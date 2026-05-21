import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageSquare,
  Workflow,
  LayoutDashboard,
  Mail,
  Sparkles,
  GraduationCap,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { path: "", label: "Overview", icon: LayoutDashboard },
  { path: "/prompt", label: "Prompt Hub", icon: Sparkles },
  { path: "/agent", label: "Agent Workspace", icon: MessageSquare },
  { path: "/flow", label: "Flow Editor", icon: Workflow },
  { path: "/board", label: "Pipeline Board", icon: LayoutDashboard },
  { path: "/inbox", label: "Inbox Center", icon: Mail },
  { path: "/onboarding", label: "Onboarding", icon: GraduationCap },
];

export function UIShowcaseLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const basePath = location.pathname.startsWith("/protocol/ui-showcase")
    ? "/protocol/ui-showcase"
    : "/ui-showcase";

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col sticky top-0 h-screen">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <Link
            to="/protocol"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Protocol</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const path = `${basePath}${item.path}`;
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-400">
            UI Showcase
            <br />
            Based on 20 screenshots
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-white">{children}</main>
    </div>
  );
}
