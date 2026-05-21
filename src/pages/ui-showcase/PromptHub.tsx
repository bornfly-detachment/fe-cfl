import { useState } from "react";
import {
  Monitor,
  FileText,
  BarChart3,
  Globe,
  MessageSquare,
  Mic,
  Send,
  Plus,
  X,
  Presentation,
  LayoutDashboard,
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TemplateCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tag?: string;
}

const filterOptions: FilterOption[] = [
  {
    id: "presentation",
    label: "Make presentation",
    icon: <Presentation size={16} />,
  },
  {
    id: "content",
    label: "Create content",
    icon: <FileText size={16} />,
  },
  {
    id: "dashboard",
    label: "Build dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  {
    id: "research",
    label: "Deep research",
    icon: <Search size={16} />,
  },
];

const templateCards: TemplateCard[] = [
  {
    id: "t1",
    title: "Quarterly Business Review",
    description:
      "Generate a comprehensive QBR deck with executive summary, KPIs, and next-quarter roadmap.",
    icon: <Presentation size={20} className="text-[#6B21A8]" />,
    tag: "Presentation",
  },
  {
    id: "t2",
    title: "Blog Post Generator",
    description:
      "Write a long-form blog post with SEO-optimized headings, meta description, and social snippets.",
    icon: <FileText size={20} className="text-[#6B21A8]" />,
    tag: "Content",
  },
  {
    id: "t3",
    title: "Analytics Dashboard",
    description:
      "Build an interactive dashboard with charts, filters, and real-time data visualizations.",
    icon: <BarChart3 size={20} className="text-[#6B21A8]" />,
    tag: "Dashboard",
  },
  {
    id: "t4",
    title: "Market Research Report",
    description:
      "Compile competitor analysis, trend insights, and strategic recommendations in one doc.",
    icon: <Globe size={20} className="text-[#6B21A8]" />,
    tag: "Research",
  },
  {
    id: "t5",
    title: "Product Launch Plan",
    description:
      "Outline go-to-market strategy, timeline, messaging, and channel plan for new releases.",
    icon: <Sparkles size={20} className="text-[#6B21A8]" />,
    tag: "Presentation",
  },
  {
    id: "t6",
    title: "Technical Documentation",
    description:
      "Generate API docs, architecture diagrams, and developer onboarding guides.",
    icon: <BookOpen size={20} className="text-[#6B21A8]" />,
    tag: "Content",
  },
  {
    id: "t7",
    title: "Sales Performance Tracker",
    description:
      "Create a revenue pipeline view with forecast, conversion rates, and rep leaderboards.",
    icon: <LayoutDashboard size={20} className="text-[#6B21A8]" />,
    tag: "Dashboard",
  },
  {
    id: "t8",
    title: "Industry Trend Analysis",
    description:
      "Synthesize the latest industry reports, emerging technologies, and disruption signals.",
    icon: <Search size={20} className="text-[#6B21A8]" />,
    tag: "Research",
  },
];

export default function PromptHub() {
  const [promptText, setPromptText] = useState(
    "Draft a 10-slide investor pitch deck for our Series A, focusing on traction, market size, and team strengths."
  );
  const [tags, setTags] = useState<string[]>(["Agent", "Presentation"]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const filteredTemplates = selectedFilter
    ? templateCards.filter(
        (t) => t.tag?.toLowerCase() === selectedFilter.toLowerCase()
      )
    : templateCards;

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4">
      <div className="mx-auto max-w-[960px]">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-semibold text-[#1F2937]">
            Prompt Hub
          </h1>
          <p className="text-[15px] text-[#6B7280]">
            Describe what you want to build, or pick a template to get started.
          </p>
        </div>

        <div className="mb-6 rounded-[16px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="mb-4 w-full resize-none border-0 bg-transparent p-0 text-[15px] font-normal leading-[1.6] text-[#1F2937] outline-none placeholder:text-[#9CA3AF]"
            rows={4}
            placeholder="What do you want to create today?"
          />

          <div className="mb-4 flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-[#F3E8FF] px-3 py-1 text-[13px] font-medium text-[#6B21A8]"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 hover:bg-[#E9D5FF]"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <span className="inline-flex items-center gap-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag"
                className="w-24 rounded-full bg-[#F3F4F6] px-3 py-1 text-[13px] font-medium text-[#6B21A8] outline-none placeholder:text-[#9CA3AF]"
              />
              <button
                onClick={addTag}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F3E8FF] text-[#6B21A8] hover:bg-[#E9D5FF]"
              >
                <Plus size={14} />
              </button>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#9CA3AF]">
              <Monitor size={20} />
              <FileText size={20} />
              <BarChart3 size={20} />
              <Globe size={20} />
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#1F2937]">
                <MessageSquare size={18} />
              </button>
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#1F2937]">
                <Mic size={18} />
              </button>
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-sm transition-transform hover:scale-105 active:scale-95">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {filterOptions.map((opt) => {
            const isSelected = selectedFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() =>
                  setSelectedFilter(isSelected ? null : opt.id)
                }
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                  isSelected
                    ? "border-[#A78BFA] text-[#7C3AED]"
                    : "border-[#E5E7EB] text-[#4B5563] hover:border-[#D1D5DB] hover:text-[#1F2937]"
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredTemplates.map((card) => (
            <button
              key={card.id}
              onClick={() =>
                setPromptText(
                  (prev) =>
                    prev +
                    (prev ? "\n\n" : "") +
                    `[Template: ${card.title}] ${card.description}`
                )
              }
              className="flex flex-col items-start rounded-xl border border-[#E5E7EB] bg-white p-4 text-left transition-all hover:border-[#A78BFA] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-3 flex w-full items-start justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F3E8FF]">
                  {card.icon}
                </div>
                <ArrowRight
                  size={16}
                  className="mt-2 text-[#9CA3AF] transition-colors group-hover:text-[#6B21A8]"
                />
              </div>
              <h3 className="mb-1 text-[14px] font-semibold text-[#1F2937]">
                {card.title}
              </h3>
              <p className="text-[13px] font-normal leading-[1.5] text-[#4B5563]">
                {card.description}
              </p>
              {card.tag && (
                <span className="mt-3 inline-block rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[12px] font-medium text-[#6B7280]">
                  {card.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
