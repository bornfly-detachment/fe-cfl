import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  Folder,
  ExternalLink,
  Maximize2,
  X,
  Plus,
  Search,
  Sparkles,
  MessageSquare,
  Mic,
  Send,
  Monitor,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AgentWorkspace() {
  const [activeTab, setActiveTab] = useState<"computer" | "deliverables">("computer");
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-900">
          Competitor Social Media Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Sparkles className="w-3.5 h-3.5" />
            Manage
          </button>
          <button className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <ExternalLink className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[55%] flex flex-col border-r border-gray-200 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-600">
              <Clock className="w-3.5 h-3.5" />
              Plan: complete task
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Refero Social Media Strategy Analysis Dashboard — Complete!
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                I have successfully created a comprehensive competitor analysis
                dashboard for Refero's social media strategy. Here's what I
                analyzed:
              </p>

              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Dashboard Highlights:
              </h3>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                What's Included:
              </h4>
              <ul className="space-y-2 mb-4">
                {[
                  "Complete Twitter/X analysis (1,684 followers, 260 total tweets)",
                  "LinkedIn presence analysis (231 followers)",
                  "Last 90 days of activity (Oct 8, 2025 – Jan 6, 2026)",
                  "Interactive charts with Chart.js visualizations",
                  "Top 5 performing posts analysis",
                  "Content strategy breakdown",
                  "Posting frequency and timing patterns",
                  "Engagement metrics and benchmarks",
                  "8 strategic recommendations",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Key Findings:
              </h3>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Platform Strategy:
              </h4>
              <ul className="space-y-2">
                {[
                  "Focused exclusively on Twitter/X with minimal LinkedIn activity",
                  "Posts 1.5 times per week on average",
                  "Most active on Tuesdays (6 posts) and Thursdays (5 posts)",
                  "Best posting time: 11 AM UTC",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What do you need help with?"
                className="w-full px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
              />
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100">
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-gray-500 hover:bg-gray-100">
                    <Sparkles className="w-3 h-3" />
                    Agent
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[45%] flex flex-col bg-gray-50 overflow-hidden">
          <div className="flex items-center border-b border-gray-200 px-4">
            <button
              onClick={() => setActiveTab("computer")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "computer"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Monitor className="w-4 h-4" />
              Computer
            </button>
            <button
              onClick={() => setActiveTab("deliverables")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "deliverables"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Folder className="w-4 h-4" />
              Deliverables
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-600">
                <Clock className="w-3.5 h-3.5" />
                Plan: complete task
              </div>
              <span className="text-xs text-gray-400">1/6/2026, 9:37 AM</span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Competitive Position:
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li>Main competitors: Mobbin, Landingfolio, Pinterest, MagicLibrary</li>
                <li>Unique advantage: "Flows" feature and comprehensive tagging</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Files Delivered:
              </h3>
              <ol className="space-y-2">
                {[
                  {
                    name: "refero_competitor_dashboard.html",
                    desc: "Interactive dashboard (open in any browser)",
                  },
                  {
                    name: "refero_competitor_dashboard.css",
                    desc: "Professional styling",
                  },
                  {
                    name: "data/twitter_analysis.json",
                    desc: "Raw analysis data",
                  },
                  {
                    name: "data/refero_twitter_data.json",
                    desc: "Complete Twitter metrics",
                  },
                ].map((file, i) => (
                  <li
                    key={file.name}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="text-gray-400 font-mono text-xs mt-0.5">
                      {i + 1}.
                    </span>
                    <div>
                      <div className="font-medium text-gray-900">{file.name}</div>
                      <div className="text-gray-500 text-xs">{file.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Monitor className="w-4 h-4" />
                  refero_competitor_dashboard
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded text-gray-400 hover:bg-gray-100">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded text-gray-400 hover:bg-gray-100">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div
                className="p-6 text-center"
                style={{ borderTop: "3px solid #818CF8" }}
              >
                <div className="text-3xl mb-3">🎨</div>
                <h2
                  className="text-xl font-bold mb-1"
                  style={{
                    background: "linear-gradient(135deg, #818CF8, #6366F1)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Refero Social Media Strategy Analysis
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  Comprehensive Competitor Analysis Dashboard
                </p>
                <p className="text-xs text-gray-400">
                  Analysis Period: October 8, 2025 – January 6, 2026 (Last 90 Days)
                </p>
              </div>
              <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-gray-500">17/17</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 mx-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "100%",
                      background: "linear-gradient(90deg, #818CF8, #6366F1)",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white">
              <span className="text-xs text-gray-500">Files (1)</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-400">refero_competitor_dashboard.html</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
