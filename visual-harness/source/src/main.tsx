import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PrvseWorldView from '@/components/prvse-world/PrvseWorldView.tsx'
import BlogPage from '@/components/BlogPage.tsx'
import TheoryPageView from '@/components/TheoryPageView.tsx'
import FreeCodeTerminal from '@/components/FreeCodeTerminal.tsx'
import LoginPage from '@/components/LoginPage.tsx'
import AppearancePage from '@/components/settings/AppearancePage.tsx'
import RuntimeSOverlay from '@/components/prvse-world/overlay/RuntimeSOverlay.tsx'
import ProtocolView from '@/components/ProtocolView.tsx'
import ProtocolBuilderView from '@/components/ProtocolBuilderView.tsx'
import ResourceProtocolPage from '@/pages/protocol/ResourceProtocolPage.tsx'
import TagTreeView from '@/components/TagTreeView.tsx'
import LabView from '@/components/LabView.tsx'
import PRVDemo from '@/components/prvse/PRVDemo.tsx'
import FontCompare from '@/components/prvse/FontCompare.tsx'
import PRVSEUIDemo from '@/components/PRVSEUIDemo.tsx'
import CyberneticsSystemView from '@/components/CyberneticsSystemView.tsx'
import UIShowcaseRoutes from '@/pages/ui-showcase/UIShowcaseRoutes.tsx'
import UIShowcaseOneStepRoutes from '@/pages/ui-showcase-one-step/UIShowcaseOneStepRoutes.tsx'
import EgoneticsView from '@/components/EgoneticsView.tsx'
import CanvasView from '@/components/CanvasView.tsx'
import EgoneticsSubjectPage from '@/components/EgoneticsSubjectPage.tsx'
import RelationDetailView from '@/components/RelationDetailView.tsx'
import KanbanBoard from '@/components/taskBoard/KanbanBoard.tsx'
import TaskDetailPage from '@/components/taskBoard/TaskDetailPage.tsx'
import ProvidersPage from '@/components/providers/ProvidersPage.tsx'
import ResourcesConsolePage from '@/components/resources/ResourcesConsolePage.tsx'
import CodexUsagePage from '@/components/resources/CodexUsagePage.tsx'
import UsageLimitsView from '@/components/UsageLimitsView.tsx'
import ResourcesGeminiView from '@/components/ai-resources/ResourcesGeminiView.tsx'
import MemoryView from '@/components/MemoryView.tsx'
import ChronicleView from '@/components/ChronicleView.tsx'
import AgentsView from '@/components/AgentsView.tsx'
import QueueView from '@/components/QueueView.tsx'
import ControllerView from '@/components/ControllerView.tsx'
import MQView from '@/components/MQView.tsx'
import '../../../src/index.css'
import '@xterm/xterm/css/xterm.css'

function SourceObsidian() {
  return (
    <div className="relative h-screen overflow-hidden bg-[#050508]">
      <RuntimeSOverlay />
    </div>
  )
}

function SourceHarness() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/prvse-world" replace />} />
        <Route path="/prvse-world" element={<PrvseWorldView />} />
        <Route path="/obsidian" element={<SourceObsidian />} />
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
        <Route path="/resources_gemini" element={<div className="flex h-screen justify-center overflow-auto p-8"><ResourcesGeminiView /></div>} />
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
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(<SourceHarness />)
