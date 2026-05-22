import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { CanvasView, EgoneticsSubjectPage, EgoneticsView, RelationDetailView } from '@bornfly-detachment/fe-canvas-relation-cfl'
import { FreeCodeTerminal } from '@bornfly-detachment/fe-cli-bridge-cfl'
import { AgentsView, ControllerView, MQView, QueueView } from '@bornfly-detachment/fe-control-plane-cfl'
import { AppearancePage, LoginPage } from '@bornfly-detachment/fe-login-cfl'
import { ChronicleView, MemoryView } from '@bornfly-detachment/fe-memory-chronicle-cfl'
import { ObsidianCfl } from '@bornfly-detachment/fe-obsidian-cfl'
import { ProtocolShell } from '@bornfly-detachment/fe-protocol-builder-cfl'
import { PrvseWorldCfl } from '@bornfly-detachment/fe-prvse-world-cfl'
import {
  CodexUsagePage,
  ProvidersPage,
  ResourcesConsolePage,
  ResourcesGeminiView,
  UsageLimitsView,
} from '@bornfly-detachment/fe-resource-intelligence-cfl'
import { BlogPage, TheoryPageView } from '@bornfly-detachment/fe-rich-editor-cfl'
import { KanbanBoard, TaskDetailPage } from '@bornfly-detachment/fe-task-lifecycle-cfl'

const routes = [
  { to: '/prvse-world', label: 'PRVSE World' },
  { to: '/obsidian', label: 'Obsidian' },
  { to: '/protocol', label: 'Protocol' },
  { to: '/egonetics', label: 'Canvas' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/resources', label: 'Resources' },
  { to: '/memory', label: 'Memory' },
  { to: '/agents', label: 'Control' },
  { to: '/blog', label: 'Blog' },
  { to: '/theory', label: 'Theory' },
  { to: '/free-code', label: 'Free Code' },
  { to: '/login', label: 'Login' },
  { to: '/settings', label: 'Settings' },
]

const prvseWorldProps = {
  runtimes: [
    { runtimeId: 'protocol-builder', state: 'running', pid: 3042 },
    { runtimeId: 'obsidian', state: 'idle', pid: 3061 },
  ],
  multimodalStream: [
    { ts: 1, kind: 'input', modality: 'text', payload: { route: '/prvse-world' }, evidenceHash: 'sha256:demo-input' },
    { ts: 2, kind: 'render', modality: 'ui', payload: { cfl: 'fe-prvse-world-cfl' }, evidenceHash: 'sha256:demo-render' },
  ],
  inboxItems: [
    { id: 'inbox-1', title: 'Review CFL package boundary', state: 'open' },
    { id: 'inbox-2', title: 'Promote L0 release after CI', state: 'queued' },
  ],
  resourceStatus: {
    github: { status: 'ready', usage: 36, limit: 100 },
    npm: { status: 'linked', usage: 18, limit: 100 },
  },
  goals: [
    { id: 'goal-1', title: 'Keep L0 source unique', state: 'active' },
    { id: 'goal-2', title: 'Consume CFLs through package manager', state: 'active' },
  ],
  constitution: [
    { id: 'rule-1', layer: 'L0', text: 'CFL implementation lives only in its own GitHub repository.' },
    { id: 'rule-2', layer: 'L1', text: 'Aggregators depend on package commits instead of copying source.' },
  ],
  layerStatus: {
    P: { source: 'package' },
    R: { route: '/prvse-world' },
    V: { packageBoundary: true },
    S: { copiedSource: false },
  },
}

function RedirectIntoProtocol() {
  const location = useLocation()
  return <Navigate to={`/protocol${location.pathname}${location.search}${location.hash}`} replace />
}

function PrvseWorldRoute() {
  return <PrvseWorldCfl {...prvseWorldProps} />
}

export default function App() {
  const visualMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('visual')

  return (
    <div className={visualMode ? 'min-h-screen' : 'min-h-screen bg-[#03040a] text-slate-100'}>
      {!visualMode && (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060c]/95 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
            <div className="mr-3 text-xs font-semibold uppercase text-cyan-300/80">fe-cfl shell</div>
            {routes.map((route) => (
              <NavLink
                key={route.to}
                to={route.to}
                className={({ isActive }) =>
                  `rounded-full border px-3 py-1.5 text-xs transition ${
                    isActive
                      ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-100'
                      : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'
                  }`
                }
              >
                {route.label}
              </NavLink>
            ))}
          </nav>
        </header>
      )}
      <main className={visualMode ? 'h-screen overflow-hidden' : 'h-[calc(100vh-57px)] overflow-hidden'}>
        <Routes>
          <Route path="/" element={<Navigate to="/prvse-world" replace />} />
          <Route path="/prvse-world" element={<PrvseWorldRoute />} />
          <Route path="/obsidian" element={<ObsidianCfl />} />
          <Route path="/protocol/*" element={<ProtocolShell />} />
          <Route path="/tag-tree" element={<RedirectIntoProtocol />} />
          <Route path="/lab" element={<RedirectIntoProtocol />} />
          <Route path="/prv-demo" element={<RedirectIntoProtocol />} />
          <Route path="/font-compare" element={<RedirectIntoProtocol />} />
          <Route path="/prvse-ui" element={<RedirectIntoProtocol />} />
          <Route path="/cybernetics" element={<RedirectIntoProtocol />} />
          <Route path="/ui-showcase/*" element={<RedirectIntoProtocol />} />
          <Route path="/ui-showcase-one-step/*" element={<RedirectIntoProtocol />} />
          <Route path="/egonetics" element={<EgoneticsView />} />
          <Route path="/egonetics/canvas/:canvasId" element={<CanvasView />} />
          <Route path="/egonetics/:subjectId" element={<EgoneticsSubjectPage />} />
          <Route path="/relations/:relationId" element={<RelationDetailView />} />
          <Route path="/tasks" element={<KanbanBoard />} />
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/resources" element={<ResourcesConsolePage />} />
          <Route path="/resources_codex" element={<CodexUsagePage />} />
          <Route path="/resources_claude" element={<UsageLimitsView />} />
          <Route path="/resources_gemini" element={<div className="flex h-full justify-center overflow-auto p-8"><ResourcesGeminiView /></div>} />
          <Route path="/memory" element={<MemoryView />} />
          <Route path="/chronicle" element={<ChronicleView />} />
          <Route path="/agents" element={<AgentsView />} />
          <Route path="/queue" element={<QueueView />} />
          <Route path="/controller" element={<ControllerView />} />
          <Route path="/mq" element={<MQView />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/theory" element={<TheoryPageView />} />
          <Route path="/free-code" element={<FreeCodeTerminal />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<AppearancePage />} />
          <Route path="*" element={<Navigate to="/prvse-world" replace />} />
        </Routes>
      </main>
    </div>
  )
}
