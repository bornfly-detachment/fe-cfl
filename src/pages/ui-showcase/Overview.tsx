import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  MessageSquare,
  Workflow,
  Mail,
  GraduationCap,
  Calculator,
  Target,
  BookOpen,
  Lock,
  Settings,
  User,
  Table,
  PanelTop,
  Image,
  Bell,
  Search,
  LayoutTemplate,
  BarChart3,
} from "lucide-react";

interface ScreenshotItem {
  filename: string;
  description: string;
  status: "implemented" | "planned";
  route?: string;
  icon: React.ElementType;
}

const screenshots: ScreenshotItem[] = [
  {
    filename: "overview.png",
    description: "Dashboard grid showing all UI patterns and their implementation status.",
    status: "implemented",
    route: "/ui-showcase",
    icon: LayoutDashboard,
  },
  {
    filename: "prompt_hub.png",
    description: "Prompt management interface with templates and history.",
    status: "implemented",
    route: "/ui-showcase/prompt",
    icon: Sparkles,
  },
  {
    filename: "agent_workspace.png",
    description: "Multi-agent chat workspace with context panels.",
    status: "implemented",
    route: "/ui-showcase/agent",
    icon: MessageSquare,
  },
  {
    filename: "flow_editor.png",
    description: "Visual node-based flow editor with drag-and-drop.",
    status: "implemented",
    route: "/ui-showcase/flow",
    icon: Workflow,
  },
  {
    filename: "pipeline_board.png",
    description: "Kanban-style pipeline board for tracking stages.",
    status: "implemented",
    route: "/ui-showcase/board",
    icon: LayoutTemplate,
  },
  {
    filename: "inbox_center.png",
    description: "Unified inbox with filtering and batch actions.",
    status: "implemented",
    route: "/ui-showcase/inbox",
    icon: Mail,
  },
  {
    filename: "onboarding.png",
    description: "Multi-step onboarding wizard with progress tracking.",
    status: "implemented",
    route: "/ui-showcase/onboarding",
    icon: GraduationCap,
  },
  {
    filename: "build_step.png",
    description: "Math level selection with card-based options and progress bar.",
    status: "planned",
    icon: Calculator,
  },
  {
    filename: "user_guide.png",
    description: "Goal selection using vertical pill buttons and mascot.",
    status: "planned",
    icon: Target,
  },
  {
    filename: "layout.png",
    description: "Accordion unit header with lesson rows and start buttons.",
    status: "planned",
    icon: BookOpen,
  },
  {
    filename: "login.png",
    description: "Authentication screen with social login options.",
    status: "planned",
    icon: Lock,
  },
  {
    filename: "settings.png",
    description: "Preferences panel with categorized settings and toggles.",
    status: "planned",
    icon: Settings,
  },
  {
    filename: "profile.png",
    description: "User profile card with avatar, stats, and activity.",
    status: "planned",
    icon: User,
  },
  {
    filename: "data_table.png",
    description: "Sortable data grid with pagination and filters.",
    status: "planned",
    icon: Table,
  },
  {
    filename: "modal.png",
    description: "Modal dialog overlay with form and confirmation actions.",
    status: "planned",
    icon: PanelTop,
  },
  {
    filename: "empty_state.png",
    description: "Empty state illustration with guidance and CTA.",
    status: "planned",
    icon: Image,
  },
  {
    filename: "toast.png",
    description: "Toast notification stack with auto-dismiss.",
    status: "planned",
    icon: Bell,
  },
  {
    filename: "search.png",
    description: "Search results page with facets and highlights.",
    status: "planned",
    icon: Search,
  },
  {
    filename: "kanban.png",
    description: "Task board with drag-and-drop columns and cards.",
    status: "planned",
    icon: LayoutTemplate,
  },
  {
    filename: "chart.png",
    description: "Analytics dashboard with line and bar visualizations.",
    status: "planned",
    icon: BarChart3,
  },
];

export default function Overview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">UI Showcase Overview</h1>
          <p className="text-sm text-gray-500 mt-2">
            A curated collection of 20 UI patterns based on reference screenshots.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {screenshots.map((item) => {
            const Icon = item.icon;
            const isImplemented = item.status === "implemented";
            return (
              <button
                key={item.filename}
                onClick={() => {
                  if (item.route) navigate(item.route);
                }}
                disabled={!item.route}
                className={`text-left group rounded-xl border bg-white p-5 transition-all hover:shadow-md ${
                  item.route
                    ? "border-gray-200 hover:border-gray-300 cursor-pointer"
                    : "border-gray-100 opacity-70 cursor-default"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isImplemented
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {isImplemented ? "Implemented" : "Planned"}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{item.filename}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{screenshots.filter((s) => s.status === "implemented").length} Implemented</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>{screenshots.filter((s) => s.status === "planned").length} Planned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
