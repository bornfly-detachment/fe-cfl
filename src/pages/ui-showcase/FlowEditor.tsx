import { useState, useMemo } from "react";
import {
  GitBranch,
  Type,
  Settings,
  AtSign,
  MoreVertical,
  Calendar,
  CalendarDays,
  Search,
  FileText,
  Send,
} from "lucide-react";

type NodeType = "classification" | "text-generation" | "set-state";

interface FlowNode {
  id: string;
  type: NodeType;
  title: string;
  subtitle: string;
  categories?: string[];
  x: number;
  y: number;
}

interface FlowEdge {
  from: string;
  to: string;
}

const NODE_W = 240;
const NODE_H = 120;

const ACCENT: Record<NodeType, string> = {
  classification: "#111827",
  "text-generation": "#A78BFA",
  "set-state": "#4B5563",
};

const ICON_BG: Record<NodeType, string> = {
  classification: "#111827",
  "text-generation": "#7C3AED",
  "set-state": "#374151",
};

const nodes: FlowNode[] = [
  {
    id: "n1",
    type: "classification",
    title: "Classify review category",
    subtitle: "Classification",
    categories: ["Packaging", "Pricing", "Quality", "Delivery", "Empty"],
    x: 80,
    y: 200,
  },
  {
    id: "n2",
    type: "text-generation",
    title: "Draft packaging response",
    subtitle: "Text generation",
    x: 420,
    y: 60,
  },
  {
    id: "n3",
    type: "text-generation",
    title: "Draft pricing response",
    subtitle: "Text generation",
    x: 420,
    y: 160,
  },
  {
    id: "n4",
    type: "text-generation",
    title: "Draft quality response",
    subtitle: "Text generation",
    x: 420,
    y: 260,
  },
  {
    id: "n5",
    type: "text-generation",
    title: "Draft delivery response",
    subtitle: "Text generation",
    x: 420,
    y: 360,
  },
  {
    id: "n6",
    type: "set-state",
    title: "Handle empty review",
    subtitle: "Set state",
    x: 420,
    y: 460,
  },
  {
    id: "n7",
    type: "set-state",
    title: "Store response",
    subtitle: "Set state",
    x: 760,
    y: 200,
  },
  {
    id: "n8",
    type: "set-state",
    title: "Clear progress message",
    subtitle: "Set state",
    x: 1100,
    y: 200,
  },
];

const edges: FlowEdge[] = [
  { from: "n1", to: "n2" },
  { from: "n1", to: "n3" },
  { from: "n1", to: "n4" },
  { from: "n1", to: "n5" },
  { from: "n1", to: "n6" },
  { from: "n2", to: "n7" },
  { from: "n3", to: "n7" },
  { from: "n4", to: "n7" },
  { from: "n5", to: "n7" },
  { from: "n6", to: "n7" },
  { from: "n7", to: "n8" },
];

const stepData = [
  {
    number: 1,
    title: "Research participants",
    description:
      "Find information online about any external participants attending the meeting.",
    icon: Search,
  },
  {
    number: 2,
    title: "Find past meetings",
    description:
      "Search for earlier meetings with the same title and/or participants in internal knowledge base.",
    icon: CalendarDays,
  },
  {
    number: 3,
    title: "Gather context",
    description:
      "Search for messages, issues, and documents from participants that could be related to the meeting topic.",
    icon: FileText,
  },
  {
    number: 4,
    title: "Find documents",
    description:
      "Search for documents that could contain more context about the meeting.",
    icon: Search,
  },
  {
    number: 5,
    title: "Create prep",
    description:
      "Provide a clear and concise pre-read for the meeting that makes me well prepared.",
    icon: Send,
  },
];

function getBezierPath(x1: number, y1: number, x2: number, y2: number) {
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
}

export default function FlowEditor() {
  const [activeView, setActiveView] = useState<"graph" | "steps">("graph");

  const svgPaths = useMemo(() => {
    return edges.map((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (!fromNode || !toNode) return null;
      const x1 = fromNode.x + NODE_W;
      const y1 = fromNode.y + NODE_H / 2;
      const x2 = toNode.x;
      const y2 = toNode.y + NODE_H / 2;
      return {
        id: `${edge.from}-${edge.to}`,
        d: getBezierPath(x1, y1, x2, y2),
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Flow Editor</h1>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView("graph")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeView === "graph"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Visual Graph
          </button>
          <button
            onClick={() => setActiveView("steps")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeView === "steps"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Step Sequence
          </button>
        </div>
      </div>

      {activeView === "graph" && (
        <div
          className="relative overflow-auto"
          style={{
            backgroundColor: "#F8F9FA",
            backgroundImage:
              "radial-gradient(circle, #E2E4E9 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px",
            height: "calc(100vh - 73px)",
          }}
        >
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={1400}
            height={700}
          >
            {svgPaths.map(
              (path) =>
                path && (
                  <path
                    key={path.id}
                    d={path.d}
                    stroke="#D1D5DB"
                    strokeWidth={1.5}
                    fill="none"
                    strokeLinecap="round"
                  />
                )
            )}
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              style={{
                left: node.x,
                top: node.y,
                width: NODE_W,
                borderLeftWidth: 4,
                borderLeftColor: ACCENT[node.type],
              }}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{ backgroundColor: ICON_BG[node.type] }}
                  >
                    {node.type === "classification" && (
                      <GitBranch className="w-3 h-3 text-white" />
                    )}
                    {node.type === "text-generation" && (
                      <Type className="w-3 h-3 text-white" />
                    )}
                    {node.type === "set-state" && (
                      <Settings className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-gray-400">
                      {node.subtitle}
                    </div>
                    <div className="text-[13px] font-semibold text-gray-900">
                      {node.title}
                    </div>
                  </div>
                </div>

                {node.categories && (
                  <div className="mt-3">
                    <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                      Categories
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {node.categories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 text-xs text-gray-600"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: "#9333EA" }}
                          />
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 px-4 py-2 border-t border-gray-50">
                <button className="text-gray-400 hover:text-gray-600">
                  <AtSign className="w-3.5 h-3.5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white"
                style={{ left: -6, top: "50%", transform: "translateY(-50%)" }}
              />
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white"
                style={{ right: -6, top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          ))}
        </div>
      )}

      {activeView === "steps" && (
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 mb-4">Trigger</h2>
            <div className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-[15px] font-semibold text-gray-900">
                  Before meeting starts
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  30 min before the meeting begins
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pr-6 mb-2">
            <div
              className="w-px border-l-2 border-dashed border-gray-300"
              style={{ height: 32 }}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 mb-4">Steps</h2>
            <div className="space-y-4">
              {stepData.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="flex items-start gap-5 bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
                  >
                    <span className="text-2xl font-bold text-gray-900 w-8 text-center shrink-0">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold text-gray-900">
                        {step.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
