export interface WorkflowNode {
  id: string;
  type: 'action' | 'decision';
  label: string;
  x: number;
  y: number;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface WorkflowPhase {
  id: string;
  title: string;
  steps: string[]; // IDs of nodes in this phase
}

export interface Workflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  phases: WorkflowPhase[];
}

interface ParsedLine {
  level: number;
  type: 'action' | 'decision' | 'si' | 'sino' | 'phase' | 'empty';
  text: string;
  rawLine: string;
}

// Detectar indentación
function getIndentLevel(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length / 2 : 0;
}

// Parsear cada línea
function parseLine(line: string): ParsedLine {
  const trimmed = line.trim();
  const level = getIndentLevel(line);

  if (!trimmed) {
    return { level, type: 'empty', text: '', rawLine: line };
  }

  // Ignore decorative arrows
  if (/^[↓→\s]+$/.test(trimmed)) {
    return { level, type: 'empty', text: '', rawLine: line };
  }

  const clean = trimmed.replace(/^[↓→🔷☐☑\s]+/, '');

  // Detectar "Phase:", "Stage:", "⏰", etc.
  const phaseMatch = clean.match(/^(phase|stage|fase|etapa):\s*(.+)/i) || 
                   clean.match(/^(phase|stage|fase|etapa)\s+\d+[:—\s]+(.+)/i) ||
                   trimmed.match(/^⏰\s*(.+)/);
  if (phaseMatch) {
    return {
      level,
      type: 'phase',
      text: (phaseMatch[2] || phaseMatch[1]).trim(),
      rawLine: line,
    };
  }

  // Detectar "Step:", "Paso:", "Task:", "☐", etc.
  const pasoMatch = clean.match(/^(step|paso|task):\s*(.+)/i) || 
                   clean.match(/^(step|paso|task)\s+\d+[:—\s]+(.+)/i) ||
                   trimmed.match(/^[☐☑-]\s*(.+)/);
  if (pasoMatch) {
    return {
      level,
      type: 'action',
      text: (pasoMatch[2] || pasoMatch[1]).trim(),
      rawLine: line,
    };
  }

  // Detectar Decision
  const decisionMatch = clean.match(/^¿(.+)\?$/) || clean.match(/^decision\s*[:—\s]+(.+)/i);
  if (decisionMatch) {
    return {
      level,
      type: 'decision',
      text: (decisionMatch[1] || decisionMatch[2]).trim().replace(/\?$/, ''),
      rawLine: line,
    };
  }

  // Detectar "Yes:" / "Si:" / "YES →"
  const siMatch = clean.match(/^(yes|si)[:\s→]+(.+)/i);
  if (siMatch) {
    return {
      level,
      type: 'si',
      text: siMatch[2].trim(),
      rawLine: line,
    };
  }

  // Detectar "No:" / "Si no:" / "NO →"
  const sinoMatch = clean.match(/^(no|si\s+no|not)[:\s→]+(.+)/i);
  if (sinoMatch) {
    return {
      level,
      type: 'sino',
      text: sinoMatch[2].trim(),
      rawLine: line,
    };
  }

  // Si no coincide con nada, ignorar para forzar sintaxis estricta
  return {
    level,
    type: 'empty',
    text: '',
    rawLine: line,
  };
}

// Posicionar nodos automáticamente con mejor layout para decisiones
function autoPositionNodes(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] {
  const xCenter = 400;
  const ySpacing = 160;
  const xBranchSpacing = 400;
  const positions: { [nodeId: string]: { x: number; y: number } } = {};
  
  // Asignar Y secuencialmente siguiendo el orden de creación para mantener el flujo vertical
  nodes.forEach((node, index) => {
    positions[node.id] = { x: xCenter, y: 50 + (index * ySpacing) };
  });

  // Ajustar X basado en la procedencia (Herencia de rama)
  nodes.forEach((node) => {
    const parentEdge = edges.find(e => e.target === node.id);
    if (parentEdge) {
      const parentPos = positions[parentEdge.source];
      if (parentEdge.label === 'Yes' || parentEdge.label === 'Si') {
        positions[node.id].x = xCenter - xBranchSpacing / 2;
      } else if (parentEdge.label === 'No' || parentEdge.label === 'Si no' || parentEdge.label === 'Not') {
        positions[node.id].x = xCenter + xBranchSpacing / 2;
      } else {
        // HERENCIA: Si es una conexión normal (Step después de un Yes), mantiene el X de su padre
        positions[node.id].x = parentPos.x;
      }
    }
  });

  return nodes.map((node) => ({
    ...node,
    x: positions[node.id]?.x || xCenter,
    y: positions[node.id]?.y || 0,
  }));
}

// Función principal de parsing
export function parseWorkflow(text: string): { workflow: Workflow; error?: string } {
  if (!text || !text.trim()) {
    return {
      workflow: { nodes: [], edges: [], phases: [] },
      error: 'Por favor escribe algo para generar un workflow',
    };
  }

  const lines = text.split('\n');
  const parsedLines = lines.map(parseLine).filter((line) => line.type !== 'empty');

  if (parsedLines.length === 0) {
    return {
      workflow: { nodes: [], edges: [], phases: [] },
      error: 'No se encontró ningún paso válido. Usa "Paso:" para acciones o "¿...?" para decisiones',
    };
  }

  const nodes: WorkflowNode[] = [];
  const edges: WorkflowEdge[] = [];
  const phases: WorkflowPhase[] = [];
  let nodeCounter = 0;
  let phaseCounter = 0;
  const nodeMap: { [key: number]: string } = {}; // índice -> id del nodo
  let lastNodeId = '';
  let currentPhase: WorkflowPhase | null = null;

  for (let i = 0; i < parsedLines.length; i++) {
    const line = parsedLines[i];

    if (line.type === 'phase') {
      currentPhase = {
        id: `phase-${phaseCounter++}`,
        title: line.text,
        steps: [],
      };
      phases.push(currentPhase);
      continue;
    }

    if (line.type === 'action' || line.type === 'decision') {
      const nodeId = `node-${nodeCounter++}`;
      nodeMap[i] = nodeId;

      nodes.push({
        id: nodeId,
        type: line.type === 'decision' ? 'decision' : 'action',
        label: line.text,
        x: 0,
        y: 0,
      });

      if (currentPhase) {
        currentPhase.steps.push(nodeId);
      }

      // Conectar con el nodo anterior
      if (lastNodeId) {
        edges.push({
          id: `edge-${lastNodeId}-${nodeId}`,
          source: lastNodeId,
          target: nodeId,
        });
      }

      lastNodeId = nodeId;
    } else if (line.type === 'si' && lastNodeId) {
      const nodeId = `node-${nodeCounter++}`;
      nodeMap[i] = nodeId;

      nodes.push({
        id: nodeId,
        type: 'action',
        label: line.text,
        x: 0,
        y: 0,
      });

      if (currentPhase) {
        currentPhase.steps.push(nodeId);
      }

      edges.push({
        id: `edge-${lastNodeId}-${nodeId}-si`,
        source: lastNodeId,
        target: nodeId,
        label: 'Yes',
      });

      lastNodeId = nodeId;
    } else if (line.type === 'sino' && lastNodeId) {
      const nodeId = `node-${nodeCounter++}`;
      nodeMap[i] = nodeId;

      nodes.push({
        id: nodeId,
        type: 'action',
        label: line.text,
        x: 0,
        y: 0,
      });

      if (currentPhase) {
        currentPhase.steps.push(nodeId);
      }

      // Buscar el nodo de decisión anterior
      let decisionNodeId = '';
      for (let j = i - 1; j >= 0; j--) {
        if (parsedLines[j].type === 'decision') {
          decisionNodeId = nodeMap[j];
          break;
        }
      }

      if (decisionNodeId) {
        edges.push({
          id: `edge-${decisionNodeId}-${nodeId}-sino`,
          source: decisionNodeId,
          target: nodeId,
          label: 'No',
        });
      }

      lastNodeId = nodeId;
    }
  }

  if (nodes.length === 0) {
    return {
      workflow: { nodes: [], edges: [], phases: [] },
      error: 'No se pudo procesar el workflow. Revisa la sintaxis',
    };
  }

  // Posicionar automáticamente
  const positionedNodes = autoPositionNodes(nodes, edges);

  return {
    workflow: {
      nodes: positionedNodes,
      edges,
      phases,
    },
  };
}
