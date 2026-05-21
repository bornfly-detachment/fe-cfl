import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import {
  Boxes,
  Braces,
  Cpu,
  FlaskConical,
  GitBranch,
  LayoutDashboard,
  Network,
  Palette,
  ScrollText,
  Sparkles,
  Tags,
  Type,
} from 'lucide-react'
import ProtocolView from './ProtocolView'
import ProtocolBuilderView from './ProtocolBuilderView'
import TagTreeView from './TagTreeView'
import LabView from './LabView'
import CyberneticsSystemView from './CyberneticsSystemView'
import PRVSEUIDemo from './PRVSEUIDemo'
import PRVDemo from './prvse/PRVDemo'
import FontCompare from './prvse/FontCompare'
import ResourceProtocolPage from '../pages/protocol/ResourceProtocolPage'
import UIShowcaseRoutes from '../pages/ui-showcase/UIShowcaseRoutes'
import UIShowcaseOneStepRoutes from '../pages/ui-showcase-one-step/UIShowcaseOneStepRoutes'

const protocolSections = [
  { to: '/protocol', label: 'Rules', icon: ScrollText, end: true },
  { to: '/protocol/builder', label: 'Builder', icon: Braces },
  { to: '/protocol/resource', label: 'Resource', icon: Boxes },
  { to: '/protocol/tag-tree', label: 'TagTree', icon: Tags },
  { to: '/protocol/lab', label: 'Lab', icon: FlaskConical },
  { to: '/protocol/prv-demo', label: 'PRV Demo', icon: GitBranch },
  { to: '/protocol/font-compare', label: 'Fonts', icon: Type },
  { to: '/protocol/prvse-ui', label: 'PRVSE UI', icon: Palette },
  { to: '/protocol/cybernetics', label: 'Cybernetics', icon: Cpu },
  { to: '/protocol/ui-showcase', label: 'Showcase', icon: LayoutDashboard },
  { to: '/protocol/ui-showcase-one-step', label: 'One Step', icon: Sparkles },
]

function ProtocolNavLink({ item }: { item: (typeof protocolSections)[number] }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `inline-flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-[12px] font-medium transition-colors ${
          isActive
            ? 'border-cyan-300/45 bg-cyan-300/12 text-cyan-100'
            : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'
        }`
      }
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{item.label}</span>
    </NavLink>
  )
}

export default function ProtocolShell() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#03040a] text-slate-100">
      <header className="shrink-0 border-b border-white/10 bg-[#05060c]/95 px-4 py-3 backdrop-blur">
        <div className="mb-3 flex items-center gap-2">
          <Network className="h-4 w-4 text-cyan-200" />
          <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
            Protocol Builder CFL
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {protocolSections.map((item) => <ProtocolNavLink key={item.to} item={item} />)}
        </nav>
      </header>
      <section className="min-h-0 flex-1 overflow-hidden">
        <Routes>
          <Route index element={<ProtocolView />} />
          <Route path="builder" element={<ProtocolBuilderView />} />
          <Route path="resource" element={<ResourceProtocolPage />} />
          <Route path="tag-tree" element={<TagTreeView />} />
          <Route path="lab" element={<LabView />} />
          <Route path="prv-demo" element={<PRVDemo />} />
          <Route path="font-compare" element={<FontCompare />} />
          <Route path="prvse-ui" element={<PRVSEUIDemo />} />
          <Route path="cybernetics" element={<CyberneticsSystemView />} />
          <Route path="ui-showcase/*" element={<UIShowcaseRoutes />} />
          <Route path="ui-showcase-one-step/*" element={<UIShowcaseOneStepRoutes />} />
          <Route path="*" element={<Navigate to="/protocol" replace />} />
        </Routes>
      </section>
    </div>
  )
}
