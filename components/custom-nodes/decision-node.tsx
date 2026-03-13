'use client';

import { Handle, Position } from 'reactflow';

interface DecisionNodeProps {
  data: {
    label: string;
  };
}

export function DecisionNode({ data }: DecisionNodeProps) {
  return (
    <div className="flex items-center justify-center">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-300 !border-white" />
      
      {/* Diamante */}
      <div
        className="relative bg-white border border-gray-200 w-36 h-36 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl"
        style={{
          transform: 'rotate(45deg)',
        }}
      >
        {/* Texto dentro del diamante, rotado hacia atrás */}
        <div
          className="text-xs font-sans font-semibold text-gray-700 text-center px-2 break-words w-24 leading-relaxed"
          style={{
            transform: 'rotate(-45deg)',
            maxWidth: '96px',
          }}
        >
          {data.label}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-300 !border-white" />
    </div>
  );
}
