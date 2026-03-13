'use client';

import { useState } from 'react';
import { parseWorkflow, Workflow } from '@/lib/parser';
import { WorkflowEditor } from '@/components/workflow-editor';
import { WorkflowCanvas } from '@/components/workflow-canvas';
import { WorkflowChecklist } from '@/components/workflow-checklist';
import { Layout, CheckSquare } from 'lucide-react';

const DEFAULT_WORKFLOW_TEXT = `Phase: STAGE 1 — MEETING SETUP
Step: STEP 1 — Confirm Meeting Details
Step: STEP 2 — Create Listing Meeting Folder
Step: STEP 3 — Verify Property Information

Phase: STAGE 2 — DOCUMENT PREPARATION
Step: STEP 4 — Prepare Listing Agreement
Decision: Property built before 1978?
  Yes: Prepare Lead-Based Paint Disclosure
  No: Continue
Decision: Property part of HOA?
  Yes: Prepare HOA / Condo Disclosure or Addendum
  No: STEP 5 — Prepare Seller Disclosures
Step: STEP 5 — Prepare Seller Disclosures

Phase: STAGE 3 — PRESENTATION & ASSETS
Step: STEP 6 — Prepare CMA
Step: STEP 7 — Prepare Listing Presentation
Step: STEP 8 — Coordinate Marketing Assets

Phase: STAGE 4 — FINAL PREPARATION
Step: STEP 9 — Final Readiness Check
Decision: All materials ready?
  Yes: STEP 10 — Send Preparation Brief to Paula
  No: Complete missing assets
Step: STEP 10 — Send Preparation Brief to Paula
Step: STEP 11 — Confirm Meeting with Seller

Phase: STAGE 5 — MEETING DAY SUPPORT
Step: STEP 12 — Provide Meeting Support
Step: END — Listing Meeting Ready`;

const DEFAULT_CHECKLIST_TEXT = `Stage: 72 HOURS BEFORE THE MEETING
Task: Send intake reminder to the agent to confirm property address, seller name(s), proposed listing price, and commission terms.
Task: Pull county records to verify property details such as owner name(s), year built, property description, and HOA status.
Task: Verify HOA information if applicable such as association name and fees.
Task: Verify property tax information.
Task: Begin drafting the Exclusive Right of Sale Listing Agreement using the terms provided by Paula.
Task: Prepare Seller Property Disclosure, Lead-Based Paint Disclosure if the property was built before 1978, HOA or Condo Disclosure if applicable, and Broker Relationship Disclosure.
Task: Request before-and-after listing photos, marketing visuals, and neighborhood highlights from the digital editor in Argentina for the listing presentation.
Task: Check vendor availability for photography, video, drone services, or staging consultation that may be scheduled once the listing agreement is signed.
Task: Compile the Comparative Market Analysis (CMA) and verify that pricing data reflects current market conditions and comparable sales.

Stage: 48 HOURS BEFORE THE MEETING
Task: Review and finalize the Listing Agreement and disclosure documents.
Task: Upload all drafted documents to the client record in Follow Up Boss (CRM).
Task: Organize the Listing Agreement, disclosure documents, CMA report, presentation materials, and marketing assets in the shared meeting folder.
Task: Send drafted documents to Paula for internal review and approval.
Task: Prepare or update the listing presentation deck with property overview, CMA data, neighborhood insights, marketing strategy, and Aragonian Associates team introduction.
Task: Ensure the listing presentation follows Aragonian Associates branding and formatting standards.
Task: Follow up with the digital editor to confirm visual assets have been delivered.
Task: Upload visual assets to the shared folder and verify files are clearly labeled and organized.
Task: Update the task tracker in Asana or the shared tracker with the progress of meeting preparation.
Task: Draft a short pre-meeting summary for Paula with key property details and seller background.

Stage: 24 HOURS BEFORE THE MEETING
Task: Confirm all listing documents and disclosures are prepared and ready for signature.
Task: Verify that the meeting folder contains the Listing Agreement, disclosure documents, CMA report, listing presentation, and visual assets.
Task: Test all shared links and document access permissions in Google Drive and Follow Up Boss.
Task: Send Paula a meeting brief with seller name, property address, meeting time, meeting location or Zoom link, key talking points, and the link to the meeting folder.
Task: Send a confirmation email to the seller with the meeting date, time, location or virtual meeting link, and a brief overview of the meeting purpose.
Task: Ensure the listing presentation is finalized and shareable as a Google Slides link or PDF.
Task: Confirm all visual assets are correctly embedded in the presentation deck.
Task: Prepare digital or printed backup copies of the listing documents and presentation in case of technical issues.

Stage: DAY OF THE MEETING
Task: Send Paula a short morning summary with the property address, meeting time, seller name, and quick access to all documents and presentation materials.
Task: Confirm meeting logistics such as calendar entry, meeting location details, or Zoom link functionality.
Task: Remain available via Slack or WhatsApp for any last-minute document requests or information needed during the meeting.
Task: After the meeting confirm the outcome with Paula and gather any notes regarding the seller’s decision or next steps.
Task: Update Follow Up Boss (CRM) with meeting notes, listing status, and next actions.
Task: If the listing agreement is signed initiate the listing coordination process for marketing preparation, MLS entry, and photography scheduling.`;

export default function Home() {
  const [workflowText, setWorkflowText] = useState(DEFAULT_WORKFLOW_TEXT);
  const [checklistText, setChecklistText] = useState(DEFAULT_CHECKLIST_TEXT);
  const [workflow, setWorkflow] = useState<Workflow>({ nodes: [], edges: [], phases: [] });
  const [error, setError] = useState<string>();
  const [view, setView] = useState<'workflow' | 'checklist'>('checklist');

  const handleWorkflowChange = (newWorkflow: Workflow, newText: string, newError?: string) => {
    if (view === 'workflow') setWorkflowText(newText);
    else setChecklistText(newText);
    
    setWorkflow(newWorkflow);
    setError(newError);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FBFBFB] selection:bg-gray-200 selection:text-gray-900 font-sans relative">
      
      {/* Navigation Layer */}
      <header className="sticky top-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-12 py-4 w-full print-hide">
        <div className="flex items-center justify-between w-full max-w-screen-2xl">
          <div className="flex items-center">
            <img src="/logo.png" alt="Aragone & Associates Logo" className="h-7 md:h-11 object-contain" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="max-w-screen-2xl mx-auto w-full p-6 md:p-12 pb-24 space-y-16">
          
          {/* Assignment Hero Section */}
          <section className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20 pt-2 lg:pt-6 print-hide">
            <div className="space-y-8 flex-1 lg:max-w-[50%]">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-10 bg-[#c4a76c]"></span>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#c4a76c]">Executive Protocol</span>
              </div>
              <h2 className="text-5xl md:text-6xl xl:text-7xl font-heading text-gray-900 leading-[1.05] tracking-[-0.03em] font-bold text-left">
                Client Listing <span className="text-[#c4a76c]">Preparation Protocol</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 font-sans font-normal leading-relaxed max-w-xl text-left">
                A streamlined, automated workflow designed specifically for Paula, our CEO. Built to ensure flawless execution and total team alignment before every critical client listing meeting.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="w-2 h-2 rounded-full bg-[#c4a76c]"></div>
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-500">Aragonian Associates</span>
              </div>
            </div>

            {/* CEO Image */}
            <div className="flex-shrink-0 relative w-full lg:w-[45%] mt-4 lg:mt-0">
              <div className="absolute -inset-3 bg-gradient-to-br from-[#c4a76c]/10 via-transparent to-[#c4a76c]/5 rounded-[2.5rem] z-0"></div>
              <img 
                src="/paula.jpg" 
                alt="Paula Aragone, CEO" 
                className="relative w-full h-[300px] md:h-[400px] lg:h-[480px] xl:h-[520px] object-cover rounded-[1.5rem] md:rounded-[2rem] z-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]"
                style={{ objectPosition: 'center 20%' }}
              />
            </div>
          </section>

          {/* Interactive Workspace Section */}
          <section className="space-y-6 mt-4 print-mt-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4 print-hide">
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900 tracking-tight">Interactive Workspace</h2>
                <p className="text-sm text-[#b09b6b] font-sans font-medium mt-1">
                  Visualize your SOP, edit in real-time or create custom checklists.
                </p>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setView('checklist')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${view === 'checklist' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <CheckSquare className="w-4 h-4" />
                  Checklist
                </button>
                <button 
                  onClick={() => setView('workflow')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${view === 'workflow' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Layout className="w-4 h-4" />
                  Workflow
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    const currentText = view === 'workflow' ? workflowText : checklistText;
                    const { workflow: newWorkflow, error: newError } = parseWorkflow(currentText);
                    setWorkflow(newWorkflow);
                    setError(newError);
                  }}
                  className="group flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#111827] text-white rounded-[14px] shadow-sm hover:bg-black transition-all active:scale-[0.98]"
                >
                  <span className="text-[13px] font-sans font-semibold">Generate Workflow</span>
                </button>
                <button 
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('download-checklist'))}
                  className="group flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-gray-200/80 rounded-[14px] shadow-sm hover:shadow-md hover:bg-gray-50/80 hover:border-[#c4a76c]/40 transition-all active:scale-[0.98]"
                >
                  <svg 
                    className="w-[18px] h-[18px] text-gray-500 group-hover:text-[#c4a76c] transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="text-[13px] font-sans font-semibold text-gray-700 group-hover:text-gray-900">Download Report</span>
                </button>
              </div>
            </div>

            <div id="workflow-container" className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden flex flex-col lg:flex-row h-[700px] ring-1 ring-black/[0.03]">
              <div className="w-full lg:w-[32%] flex-shrink-0 border-r-0 lg:border-r border-b lg:border-b-0 border-gray-100 bg-[#fafafa] overflow-hidden flex flex-col print-hide">
                <div className="flex-1 overflow-y-auto">
                  <WorkflowEditor 
                    key={view}
                    defaultValue={view === 'workflow' ? workflowText : checklistText}
                    onWorkflowChange={handleWorkflowChange} 
                  />
                </div>
              </div>

              <div className="flex-1 overflow-hidden relative bg-[#f8f9fc]">
                {view === 'workflow' ? (
                  <WorkflowCanvas workflow={workflow} error={error} />
                ) : (
                  <div className="h-full overflow-y-auto">
                    <WorkflowChecklist workflow={workflow} />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Bilingual Explanation Cards */}
          <section className="pt-16 mt-8 border-t border-gray-100 print-pt-0 print-border-0" id="print-rationale">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-10 bg-[#c4a76c]"></span>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#c4a76c]">Strategic Analysis</span>
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">How This Workflow Saves Time & Keeps the Team Aligned</h2>
              <p className="text-sm text-gray-500 font-sans font-medium mt-2">
                The strategic value behind our automated protocol.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-lg text-gray-900">Strategic Impact</h3>
                  <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold tracking-widest text-gray-600 uppercase">English</span>
                </div>
                <div className="space-y-4 text-base text-gray-600 font-normal leading-relaxed font-sans">
                  <p>This workflow organizes listing meeting preparation into a structured 72-hour timeline to ensure every task is completed in advance and nothing is left to the last minute. By breaking the process into clear stages, the Virtual Assistant can prepare documents, coordinate with team members, and gather marketing assets in a logical sequence that reduces errors and avoids unnecessary urgency.</p>
                  <p>The workflow also improves team alignment by clearly defining responsibilities and deadlines. For example, the digital editor in Argentina receives asset requests early, ensuring time zone differences do not delay the preparation of presentation materials. At the same time, Paula receives organized updates and meeting briefs rather than multiple scattered requests, allowing her to focus on client relationships and strategic conversations.</p>
                  <p>Using tools such as Follow Up Boss and Asana ensures that tasks, documents, and communication remain centralized and transparent. Team members can easily track progress, access files, and understand their responsibilities without constant follow-ups.</p>
                  <p>As a result, Paula enters each listing meeting fully prepared with drafted agreements, organized disclosures, updated market data, and a complete presentation. This structured approach reduces last-minute stress, improves collaboration across the team, and helps maintain a consistent and professional experience for every potential listing client.</p>
                </div>
              </div>

              <div className="bg-[#111827] p-8 rounded-3xl border border-gray-800 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-bold text-lg text-white">Impacto Estrat\u00e9gico</h2>
                  <span className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold tracking-widest text-gray-300 uppercase">Espa\u00f1ol</span>
                </div>
                <div className="space-y-4 text-base text-gray-300 font-normal leading-relaxed font-sans">
                  <p>Este workflow organiza la preparaci\u00f3n de una reuni\u00f3n de listado en una l\u00ednea de tiempo estructurada de 72 horas para asegurar que cada tarea se complete con anticipaci\u00f3n y que nada quede para el \u00faltimo momento. Al dividir el proceso en etapas claras, el asistente virtual puede preparar documentos, coordinar con el equipo y recopilar activos de marketing en una secuencia l\u00f3gica que reduce errores y evita urgencias innecesarias.</p>
                  <p>El workflow tambi\u00e9n mejora la alineaci\u00f3n del equipo al definir responsabilidades y plazos de forma clara. Por ejemplo, el editor digital en Argentina recibe las solicitudes de activos visuales con suficiente anticipaci\u00f3n, lo que evita que las diferencias de horario retrasen la preparaci\u00f3n de la presentaci\u00f3n. Al mismo tiempo, Paula recibe res\u00famenes organizados y actualizaciones clave en lugar de m\u00faltiples solicitudes dispersas, lo que le permite enfocarse en las relaciones con clientes y en decisiones estrat\u00e9gicas.</p>
                  <p>El uso de herramientas como Follow Up Boss y Asana permite que las tareas, documentos y comunicaciones se mantengan centralizados y visibles para todo el equipo. Esto facilita el seguimiento del progreso, el acceso a archivos y la claridad sobre las responsabilidades de cada miembro.</p>
                  <p>Como resultado, Paula llega a cada reuni\u00f3n de listado completamente preparada, con contratos listos para firma, datos de mercado actualizados y una presentaci\u00f3n profesional organizada. Este enfoque estructurado reduce el estr\u00e9s de \u00faltimo momento, mejora la colaboraci\u00f3n del equipo y asegura una experiencia profesional y consistente para cada posible cliente.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
