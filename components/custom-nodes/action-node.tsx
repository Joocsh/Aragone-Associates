'use client';

import { Handle, Position } from 'reactflow';

interface ActionNodeProps {
  data: {
    label: string;
  };
}

export function ActionNode({ data }: ActionNodeProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 w-[260px] shadow-sm hover:shadow-md transition-shadow duration-300">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-300 !border-white" />
      <div className="text-sm font-sans font-medium text-gray-900 text-center break-words leading-relaxed">
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-300 !border-white" />
    </div>
  );
}
