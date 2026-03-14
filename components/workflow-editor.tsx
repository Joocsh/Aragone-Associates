'use client';

import { useState, useCallback, useEffect } from 'react';
import { parseWorkflow, Workflow } from '@/lib/parser';

interface WorkflowEditorProps {
  defaultValue: string;
  onWorkflowChange: (workflow: Workflow, text: string, error?: string) => void;
  onForceRefresh?: () => void;
}

const EXAMPLE_WORKFLOW = `Phase: PHASE 1 — INITIAL LOGISTICS
Step: STEP 1 - Confirm Meeting Details (Seller, Address, Time, Format) & Record in CRM
Step: STEP 2 - Create Google Drive Folder & Subfolders (Legal, Presentation, Marketing, CMA)

Phase: PHASE 2 — DOCUMENTATION & ASSETS
Step: STEP 3 - Prepare Listing Documents (Agreement, Disclosures) & Save in Legal folder
Step: STEP 4 - Finalize CMA with Paula & Ensure pricing strategy reflects market
Step: STEP 5 - Update Presentation (Marketing strategy, Recent sales, Market trends)
Step: STEP 6 - Coordinate Marketing Assets with Digital Editor (Photos & Visuals)
Step: STEP 7 - Verify Availability of Photography, Video, & Staging vendors

Phase: PHASE 3 — FINAL REVIEW & CONFIRMATION
Step: STEP 8 - Final Document Review (24h Before) - Audit all files for readiness
Step: STEP 9 - Send Preparation Brief to Paula (Seller background & Drive link)
Step: STEP 10 - Send Confirmation Email to Seller & Update Meeting Status in CRM

Phase: PHASE 4 — MEETING SUPPORT
Step: STEP 11 - Day-of-Meeting Support: Standby for urgent docs or data
Step: END - Listing Meeting Ready: Paula is fully prepared for execution`;

export function WorkflowEditor({ defaultValue, onWorkflowChange }: WorkflowEditorProps) {
  const [text, setText] = useState(defaultValue);
  const [error, setError] = useState<string>();

  // Debounced parsing
  useEffect(() => {
    const timer = setTimeout(() => {
      const { workflow, error } = parseWorkflow(text);
      setError(error);
      onWorkflowChange(workflow, text, error);
    }, 300);

    return () => clearTimeout(timer);
  }, [text, onWorkflowChange]);

  // Obtener número de nodos del último parsing
  const getNodeCount = () => {
    const { workflow } = parseWorkflow(text);
    return workflow.nodes.length;
  };

  return (
    <div className="flex flex-col h-full gap-4 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-sm font-heading tracking-wide uppercase text-gray-800">Workflow Definition</h2>
          <p className="text-[11px] font-sans font-light text-gray-500 mt-1">
            Build your SOP step by step.
          </p>
        </div>
        {!error && text.trim() && (
          <div className="ml-4 px-3 py-1 bg-gray-100 text-gray-600 text-[11px] font-medium tracking-wide rounded-full whitespace-nowrap uppercase">
            {getNodeCount()} nodes
          </div>
        )}
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-5 border border-gray-200/80 shadow-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none font-mono text-[13px] text-gray-800 placeholder-gray-400 bg-white transition-all leading-relaxed"
        placeholder={`Phase: Onboarding\nStep: Receive data\n¿Valid data?\n  Si: Process\n  Si no: Error`}
        spellCheck="false"
      />

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
          <p className="text-xs font-medium text-gray-900 uppercase tracking-widest">Note</p>
          <p className="text-sm text-gray-600 mt-1 font-light">{error}</p>
        </div>
      )}

      {/* Refined Syntax Guide */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Syntax Guide</p>
          <div className="grid grid-cols-1 gap-y-2.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500 font-light">Add Phases/Stages</span>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-900 border border-gray-200">Stage: Title</code>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500 font-light">Add Steps</span>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-900 border border-gray-200">Step: Label</code>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500 font-light">Add Checklist Task</span>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-900 border border-gray-200">Task: Label</code>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500 font-light">Add Decisions</span>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-900 border border-gray-200">Decision: Question?</code>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-gray-500 font-light">Logic Paths (Indented)</span>
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-900 border border-gray-200 text-[10px]">Yes: Action / No: Action</code>
              </div>
              <p className="text-[10px] text-gray-400 font-mono pl-2 italic">Example:<br/>Decision: built before 1978?<br/>&nbsp;&nbsp;Yes: Prepare Disclosure<br/>&nbsp;&nbsp;No: Continue</p>
            </div>
          </div>
        </div>

        {/* Future AI Feature Teaser */}
        <div className="group bg-gradient-to-br from-indigo-50/50 to-white p-4 rounded-2xl border border-indigo-100/50 hover:border-indigo-200/80 transition-all">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Next Generation</span>
          </div>
          <h4 className="text-[13px] font-heading font-bold text-indigo-900">AI Workflow Assistant</h4>
          <p className="text-[11px] text-indigo-700/70 font-sans mt-1 leading-relaxed">
            Soon you'll be able to generate complete SOPs and checklists with simple natural language instructions.
          </p>
          <div className="mt-3 py-1 px-3 bg-indigo-100/50 border border-indigo-200/50 rounded-full inline-block">
            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-tighter">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
