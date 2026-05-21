import React, { useState, useMemo } from "react";
import { Sparkles, MessageSquare, Database, MoreHorizontal, AtSign } from "lucide-react";

export default function FlowEditor() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes = [
    {
      id: "classify",
      type: "classification",
      title: "Classify review category",
      label: "Classification",
      color: "bg-indigo-400",
      textColor: "text-indigo-500",
      lineColor: "#6366f1",
      borderColor: "border-indigo-200",
      icon: Sparkles,
      x: 40,
      y: 360,
      width: 320,
      height: 160,
      actions: false,
      showCategories: true,
    },
    {
      id: "packaging",
      type: "text-generation",
      title: "Draft packaging response",
      label: "Text generation",
      color: "bg-purple-500",
      textColor: "text-purple-600",
      lineColor: "#a855f7",
      borderColor: "border-purple-200",
      icon: MessageSquare,
      x: 480,
      y: 40,
      width: 280,
      height: 100,
      actions: true,
      showCategories: false,
    },
    {
      id: "pricing",
      type: "text-generation",
      title: "Draft pricing response",
      label: "Text generation",
      color: "bg-purple-500",
      textColor: "text-purple-600",
      lineColor: "#a855f7",
      borderColor: "border-purple-200",
      icon: MessageSquare,
      x: 480,
      y: 230,
      width: 280,
      height: 100,
      actions: true,
      showCategories: false,
    },
    {
      id: "quality",
      type: "text-generation",
      title: "Draft quality response",
      label: "Text generation",
      color: "bg-purple-500",
      textColor: "text-purple-600",
      lineColor: "#a855f7",
      borderColor: "border-purple-200",
      icon: MessageSquare,
      x: 480,
      y: 420,
      width: 280,
      height: 100,
      actions: true,
      showCategories: false,
    },
    {
      id: "delivery",
      type: "text-generation",
      title: "Draft delivery response",
      label: "Text generation",
      color: "bg-purple-500",
      textColor: "text-purple-600",
      lineColor: "#a855f7",
      borderColor: "border-purple-200",
      icon: MessageSquare,
      x: 480,
      y: 650,
      width: 280,
      height: 100,
      actions: true,
      showCategories: false,
    },
    {
      id: "empty",
      type: "set-state",
      title: "Handle empty review",
      label: "Set state",
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      lineColor: "#10b981",
      borderColor: "border-emerald-200",
      icon: Database,
      x: 480,
      y: 830,
      width: 280,
      height: 100,
      actions: true,
      showCategories: false,
    },
    {
      id: "store",
      type: "set-state",
      title: "Store response",
      label: "Set state",
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      lineColor: "#10b981",
      borderColor: "border-emerald-200",
      icon: Database,
      x: 860,
      y: 400,
      width: 280,
      height: 100,
      actions: true,
      showCategories: false,
    },
    {
      id: "clear",
      type: "set-state",
      title: "Clear progress message",
      label: "Set state",
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      lineColor: "#10b981",
      borderColor: "border-emerald-200",
      icon: Database,
      x: 1200,
      y: 400,
      width: 280,
      height: 100,
      actions: true,
      showCategories: false,
    },
  ];

  const connections = [
    { from: "classify", to: "packaging", color: "#a855f7", type: "curved" as const, offsetY: 0 },
    { from: "classify", to: "pricing", color: "#a855f7", type: "curved" as const, offsetY: 0 },
    { from: "classify", to: "quality", color: "#a855f7", type: "curved" as const, offsetY: 0 },
    { from: "classify", to: "delivery", color: "#a855f7", type: "curved" as const, offsetY: 0 },
    { from: "classify", to: "empty", color: "#a855f7", type: "curved" as const, offsetY: 0 },
    { from: "packaging", to: "store", color: "#cbd5e1", type: "curved" as const, offsetY: 0 },
    { from: "pricing", to: "store", color: "#cbd5e1", type: "curved" as const, offsetY: 0 },
    { from: "quality", to: "store", color: "#cbd5e1", type: "curved" as const, offsetY: 0 },
    { from: "delivery", to: "store", color: "#cbd5e1", type: "curved" as const, offsetY: 0 },
    { from: "empty", to: "store", color: "#cbd5e1", type: "curved" as const, offsetY: 0 },
    { from: "store", to: "clear", color: "#cbd5e1", type: "straight" as const, offsetY: 0 },
  ];

  const categories = [
    { name: "Packaging", color: "bg-purple-500" },
    { name: "Pricing", color: "bg-purple-500" },
    { name: "Quality", color: "bg-purple-500" },
    { name: "Delivery", color: "bg-purple-500" },
    { name: "Empty", color: "bg-purple-500" },
  ];

  const getNodeById = (id: string) => nodes.find((n) => n.id === id);

  const getPortPosition = (nodeId: string, isOutput: boolean) => {
    const node = getNodeById(nodeId);
    if (!node) return { x: 0, y: 0 };
    if (isOutput) {
      return { x: node.x + node.width, y: node.y + node.height / 2 };
    }
    return { x: node.x, y: node.y + node.height / 2 };
  };

  const generatePath = (from: string, to: string, type: "curved" | "straight") => {
    const start = getPortPosition(from, true);
    const end = getPortPosition(to, false);
    const midX = (start.x + end.x) / 2;
    if (type === "straight") {
      return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }
    return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
  };

  const selectedConnection = useMemo(() => {
    if (!selectedNode) return null;
    const node = getNodeById(selectedNode);
    if (!node) return null;
    const incoming = connections.filter((c) => c.to === selectedNode).map((c) => c.from);
    const outgoing = connections.filter((c) => c.from === selectedNode).map((c) => c.to);
    return { incoming, outgoing };
  }, [selectedNode]);

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden select-none">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <filter id="line-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.15" />
          </filter>
        </defs>
        {connections.map((conn, i) => {
          const isHighlighted =
            selectedNode && (conn.from === selectedNode || conn.to === selectedNode);
          return (
            <g key={i}>
              <path
                d={generatePath(conn.from, conn.to, conn.type)}
                fill="none"
                stroke={conn.color}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                opacity={isHighlighted ? 1 : 0.7}
                filter="url(#line-shadow)"
              />
              {(() => {
                const end = getPortPosition(conn.to, false);
                return (
                  <circle
                    cx={end.x}
                    cy={end.y}
                    r={4}
                    fill={isHighlighted ? conn.color : "#fff"}
                    stroke={conn.color}
                    strokeWidth={1.5}
                  />
                );
              })()}
            </g>
          );
        })}
      </svg>

      <div className="absolute inset-0 z-20">
        {nodes.map((node) => {
          const isSelected = selectedNode === node.id;
          const Icon = node.icon;
          return (
            <div
              key={node.id}
              className={`absolute transition-shadow duration-200 cursor-pointer
                ${isSelected ? "ring-2 ring-offset-2 ring-slate-300 shadow-lg shadow-slate-200/50" : "hover:shadow-md shadow-sm shadow-slate-100"}
              `}
              style={{
                left: node.x,
                top: node.y,
                width: node.width,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNode(isSelected ? null : node.id);
              }}
            >
              <div
                className={`relative bg-white rounded-lg border border-slate-100 overflow-hidden
                  ${isSelected ? "bg-white" : "bg-white/95 backdrop-blur-sm"}
                `}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${node.color}`} />

                <div className="p-4 pl-5">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${node.type === "classification" ? "bg-black" : node.type === "text-generation" ? "bg-black" : "bg-white border border-slate-200"}`}
                    >
                      <Icon
                        className={`w-4 h-4 ${node.type === "classification" || node.type === "text-generation" ? "text-white" : "text-slate-700"}`}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                        {node.label}
                      </div>
                      <h3 className="text-[13px] font-semibold text-slate-900 leading-tight">
                        {node.title}
                      </h3>
                    </div>
                  </div>

                  {node.showCategories && (
                    <div className="mt-5 pl-10">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                        Categories
                      </div>
                      <div className="space-y-2.5">
                        {categories.map((cat) => (
                          <div key={cat.name} className="flex items-center justify-between group">
                            <span className="text-[12px] text-slate-600 font-medium">
                              {cat.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${cat.color} shadow-sm`} />
                              <div className="w-16 h-[1.5px] bg-slate-200 group-hover:bg-slate-300 transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center gap-1 text-slate-400">
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                      </div>
                    </div>
                  )}

                  {node.actions && (
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                        <AtSign className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30"
                style={{ pointerEvents: "none" }}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${node.color} border-[1.5px] border-white shadow-sm`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2">
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium">Flow Editor</span>
        </div>
      </div>
    </div>
  );
}