import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import PrvseWorldView from './cfl/prvse-world/PrvseWorldView'
import BlogPage from './cfl/rich-editor/BlogPage'
import TheoryPageView from './cfl/rich-editor/TheoryPageView'
import FreeCodeTerminal from './cfl/cli-bridge/FreeCodeTerminal'
import LoginPage from './cfl/login/LoginPage'
import AppearancePage from './cfl/login/settings/AppearancePage'
import ObsidianCfl from './cfl/obsidian/ObsidianCfl'
import {
  CyberneticsSystemView,
  FontCompare,
  LabView,
  PRVDemo,
  PRVSEUIDemo,
  ProtocolBuilderView,
  ProtocolView,
  ResourceProtocolPage,
  TagTreeView,
  UIShowcaseOneStepRoutes,
  UIShowcaseRoutes,
} from './cfl/protocol-builder'
import { CanvasView, EgoneticsSubjectPage, EgoneticsView, RelationDetailView } from './cfl/canvas-relation'
import { KanbanBoard, TaskDetailPage } from './cfl/task-lifecycle'
import {
  CodexUsagePage,
  ProvidersPage,
  ResourcesConsolePage,
  ResourcesGeminiView,
  UsageLimitsView,
} from './cfl/resource-intelligence'
import { ChronicleView, MemoryView } from './cfl/memory-chronicle'
import { AgentsView, ControllerView, MQView, QueueView } from './cfl/control-plane'

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

export default function App() {
  const visualMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('visual')

  return (
    <div className={visualMode ? "min-h-screen" : "min-h-screen bg-[#03040a] text-slate-100"}>
      {!visualMode && <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060c]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
          <div className="mr-3 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80">fe-cfl v2</div>
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
      </header>}
      <main className={visualMode ? 'h-screen overflow-hidden' : 'h-[calc(100vh-57px)] overflow-hidden'}>
        <Routes>
          <Route path="/" element={<Navigate to="/prvse-world" replace />} />
          <Route path="/prvse-world" element={<PrvseWorldView />} />
          <Route path="/obsidian" element={<ObsidianCfl />} />
          <Route path="/protocol" element={<ProtocolView />} />
          <Route path="/protocol/builder" element={<ProtocolBuilderView />} />
          <Route path="/protocol/resource" element={<ResourceProtocolPage />} />
          <Route path="/tag-tree" element={<TagTreeView />} />
          <Route path="/lab" element={<LabView />} />
          <Route path="/prv-demo" element={<PRVDemo />} />
          <Route path="/font-compare" element={<FontCompare />} />
          <Route path="/prvse-ui" element={<PRVSEUIDemo />} />
          <Route path="/cybernetics" element={<CyberneticsSystemView />} />
          <Route path="/ui-showcase/*" element={<UIShowcaseRoutes />} />
          <Route path="/ui-showcase-one-step/*" element={<UIShowcaseOneStepRoutes />} />
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
