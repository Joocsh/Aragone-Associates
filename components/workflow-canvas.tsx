'use client';

import { useMemo, useEffect, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  getRectOfNodes,
  getTransformForBounds,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toPng } from 'html-to-image';
import { Workflow } from '@/lib/parser';
import { ActionNode } from './custom-nodes/action-node';
import { DecisionNode } from './custom-nodes/decision-node';

interface WorkflowCanvasProps {
  workflow: Workflow;
  error?: string;
}

// Define nodeTypes outside component to prevent recreation on every render
const nodeTypes = {
  action: ActionNode,
  decision: DecisionNode,
};

function WorkflowCanvasContent({ workflow, error }: WorkflowCanvasProps) {
  const { getNodes, getViewport, setViewport } = useReactFlow();

  // Convertir nodos del parser a nodos de React Flow
  const initialNodes: Node[] = useMemo(() => {
    return workflow.nodes.map((node) => ({
      id: node.id,
      data: { label: node.label },
      position: { x: node.x, y: node.y },
      type: node.type,
    }));
  }, [workflow.nodes]);

  // Convertir edges del parser a edges de React Flow
  const initialEdges: Edge[] = useMemo(() => {
    return workflow.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#9ca3af', strokeWidth: 2 },
      labelStyle: { fill: '#4b5563', fontSize: 13, fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 },
    }));
  }, [workflow.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const workflowContentRef = useRef(JSON.stringify(workflow));

  // Initialize nodes only when the workflow structure changes significantly
  useEffect(() => {
    const currentContent = JSON.stringify(workflow);
    if (workflowContentRef.current !== currentContent) {
      setNodes(initialNodes);
      setEdges(initialEdges);
      workflowContentRef.current = currentContent;
    }
  }, [workflow, initialNodes, initialEdges, setNodes, setEdges]);

  const downloadAsImage = useCallback(() => {
    const nodes = getNodes();
    if (nodes.length === 0) return;

    // Get the bounding box of all nodes
    const nodesBounds = getRectOfNodes(nodes);
    const padding = 50;
    
    // Calculate final image dimensions with high resolution
    const width = nodesBounds.width + padding * 2;
    const height = nodesBounds.height + padding * 2;
    
    // Transform to align everything to top-left (0,0) in the export canvas
    const transform = [
      -nodesBounds.x + padding,
      -nodesBounds.y + padding,
      1 // Normal scale
    ];

    const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewportElement) return;

    toPng(viewportElement, {
      backgroundColor: '#f8f9fc',
      width: width, 
      height: height,
      pixelRatio: 4, // Higher quality export
      style: {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `workflow-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    }).catch((err) => {
      console.error('Could not download image', err);
    });
  }, [getNodes]);

  useEffect(() => {
    window.addEventListener('download-workflow', downloadAsImage);
    return () => window.removeEventListener('download-workflow', downloadAsImage);
  }, [downloadAsImage]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6">
        <div className="text-center max-w-sm">
          <div className="text-3xl mb-4 opacity-30">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900">Workflow Error</h3>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  if (workflow.nodes.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6">
        <div className="text-center max-w-sm">
          <div className="text-3xl mb-4 text-gray-300">✧</div>
          <h3 className="text-lg font-heading text-gray-900">Your workflow will appear here</h3>
          <p className="text-gray-500 text-sm mt-2 font-sans font-light">Start writing steps on the left to visualize the flow.</p>
        </div>
      </div>
    );
  }


  return (
    <ReactFlow 
      nodes={nodes} 
      edges={edges} 
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      proOptions={{ hideAttribution: true }}
      zoomOnScroll={false}
      panOnScroll={true}
    >
      <Background color="#e5e7eb" gap={20} size={1} />
      <Controls />
      <MiniMap position="bottom-right" />
    </ReactFlow>
  );
}

import React from 'react';

export function WorkflowCanvas({ workflow, error }: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasContent workflow={workflow} error={error} />
    </ReactFlowProvider>
  );
}
