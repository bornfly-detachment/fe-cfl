import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PrvseWorldView from '@/components/prvse-world/PrvseWorldView.tsx'
import BlogPage from '@/components/BlogPage.tsx'
import TheoryPageView from '@/components/TheoryPageView.tsx'
import FreeCodeTerminal from '@/components/FreeCodeTerminal.tsx'
import LoginPage from '@/components/LoginPage.tsx'
import AppearancePage from '@/components/settings/AppearancePage.tsx'
import '../../../src/index.css'
import '@xterm/xterm/css/xterm.css'

function SourceHarness() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/prvse-world" replace />} />
        <Route path="/prvse-world" element={<PrvseWorldView />} />
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
