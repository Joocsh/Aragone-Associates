'use client';

import { Workflow } from '@/lib/parser';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface WorkflowChecklistProps {
  workflow: Workflow;
}

export function WorkflowChecklist({ workflow }: WorkflowChecklistProps) {
  const checklistRef = useRef<HTMLDivElement>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const downloadAsWord = useCallback(() => {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: [
          // Branding Header
          new Paragraph({
            children: [
              new TextRun({
                text: "ARAGONIAN ASSOCIATES",
                bold: true,
                size: 20,
                color: "9CA3AF",
                characterSpacing: 2,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "PROJECT EXECUTION REPORT",
                bold: true,
                size: 36,
                color: "111827",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on ${new Date().toLocaleDateString()} — Status: ${Object.values(checkedItems).filter(Boolean).length}/${workflow.nodes.length} Completed`,
                size: 18,
                color: "6B7280",
              }),
            ],
            spacing: { after: 600 },
          }),

          // Checklist Content
          ...workflow.phases.flatMap(phase => [
            new Paragraph({
              children: [
                new TextRun({
                  text: phase.title.toUpperCase(),
                  bold: true,
                  size: 24,
                  color: "374151",
                }),
              ],
              spacing: { before: 400, after: 200 },
              border: {
                bottom: { color: "E5E7EB", space: 5, style: "single", size: 6 },
              },
            }),
            ...phase.steps.map(nodeId => {
              const node = workflow.nodes.find(n => n.id === nodeId);
              const isChecked = !!checkedItems[nodeId];
              return new Paragraph({
                children: [
                  new TextRun({ 
                    text: isChecked ? "☑  " : "☐  ", 
                    size: 24,
                    color: isChecked ? "111827" : "9CA3AF"
                  }),
                  new TextRun({ 
                    text: node?.label || "", 
                    size: 24,
                    color: isChecked ? "6B7280" : "111827",
                    strike: isChecked,
                  })
                ],
                spacing: { before: 300, after: 300 },
                indent: { left: 400 }
              });
            })
          ]),
          
          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: "\n\nEnd of Execution Report",
                size: 16,
                color: "9CA3AF",
                italics: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 1000 },
          }),
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `Aragonian-Report-${new Date().getTime()}.docx`);
    });
  }, [workflow, checkedItems]);

  useEffect(() => {
    window.addEventListener('download-checklist', downloadAsWord);
    return () => window.removeEventListener('download-checklist', downloadAsWord);
  }, [downloadAsWord]);

  if (workflow.phases.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6">
        <div className="text-center max-w-sm">
          <div className="text-3xl mb-4 text-gray-300">📋</div>
          <h3 className="text-lg font-heading text-gray-900">Checklist Ready</h3>
          <p className="text-gray-500 text-sm mt-2 font-sans font-light">
            Use <code className="bg-gray-100 px-1 rounded">Phase: Title</code> in the editor to group steps into a checklist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#fcfdfe] overflow-y-auto p-12" ref={checklistRef}>
      <div className="max-w-3xl mx-auto space-y-16 pb-24">
        {/* Aesthetic Header */}
        <div className="space-y-4 border-b border-gray-100 pb-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#c4a76c]"></span>
            <p className="text-[10px] font-bold text-[#c4a76c] uppercase tracking-[0.3em]">Operational Protocol</p>
          </div>
          <h1 className="text-5xl font-heading font-extrabold text-gray-900 tracking-tight leading-none">
            Project <span className="text-[#c4a76c]/60">Checklist</span>
          </h1>
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#c4a76c] animate-pulse"></div>
              <span className="text-[12px] font-bold text-gray-900 uppercase tracking-wider">Aragonian Associates</span>
            </div>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="text-xs text-gray-500 font-medium">
              Progress: <span className="text-gray-900 font-bold">{Object.values(checkedItems).filter(Boolean).length}</span> of {workflow.nodes.length} verified
            </div>
          </div>
        </div>

        {workflow.phases.map((phase) => (
          <div key={phase.id} className="space-y-8">
            <h2 className="text-[11px] font-black text-[#b09b6b] uppercase tracking-[0.25em] flex items-center gap-4">
              {phase.title}
              <span className="flex-1 h-px bg-gray-100"></span>
            </h2>
            <div className="grid gap-4">
              {phase.steps.map((nodeId) => {
                const node = workflow.nodes.find((n) => n.id === nodeId);
                if (!node) return null;
                const isChecked = !!checkedItems[nodeId];
                return (
                  <label 
                    key={nodeId} 
                    className={`flex items-start gap-5 p-6 rounded-[24px] border transition-all cursor-pointer group select-none ${isChecked ? 'bg-gray-50/50 border-gray-100' : 'bg-white border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-gray-200 hover:-translate-y-0.5'}`}
                  >
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => toggleItem(nodeId)}
                        className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-gray-200 transition-all checked:border-black checked:bg-black" 
                      />
                      <svg 
                        className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className={`text-[15px] font-sans leading-relaxed transition-all ${isChecked ? 'text-gray-400 line-through' : 'text-gray-800 font-medium'}`}>
                        {node.label}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
