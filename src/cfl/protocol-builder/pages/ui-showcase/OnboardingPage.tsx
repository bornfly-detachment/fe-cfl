import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  GraduationCap,
  Brain,
  Calculator,
  FunctionSquare,
  Sigma,
  Triangle,
  Play,
} from "lucide-react";

const mathOptions = [
  {
    id: "arithmetic",
    label: "Arithmetic",
    description: "Introductory",
    icon: Calculator,
    expression: "2 + 2 = 4",
  },
  {
    id: "basic-algebra",
    label: "Basic Algebra",
    description: "Foundational",
    icon: FunctionSquare,
    expression: "x + 3 = 7",
  },
  {
    id: "algebra",
    label: "Algebra",
    description: "Intermediate",
    icon: Brain,
    expression: "x² + 5x + 6",
  },
  {
    id: "calculus",
    label: "Calculus",
    description: "Advanced",
    icon: Sigma,
    expression: "∫ x dx",
  },
];

const goalOptions = [
  "Professional growth",
  "Staying sharp",
  "Excelling in school",
  "Helping my child learn",
  "Helping my students learn",
  "Something else",
];

const lessons = [
  {
    id: 1,
    title: "Greetings and introductions",
    label: "Lesson 1",
    description: "Learn common phrases for meeting new people.",
    cta: "Start now",
    filled: true,
  },
  {
    id: 2,
    title: "Ordering food and drinks",
    label: "Lesson 2",
    description: "Practice dialogues at restaurants and cafés.",
    cta: "Start now",
    filled: false,
  },
  {
    id: 3,
    title: "Asking for directions",
    label: "Lesson 3",
    description: "Navigate cities using polite questions.",
    cta: "Start now",
    filled: false,
  },
];

function DiamondLogo() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-16 h-16 bg-emerald-500 rotate-45 rounded-lg flex items-center justify-center shadow-lg">
        <div className="-rotate-45">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}

function BlobMascot() {
  return (
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 bg-emerald-400 rounded-full opacity-80" style={{ borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%' }} />
      <div className="absolute top-4 left-5 w-2.5 h-2.5 bg-gray-900 rounded-full" />
      <div className="absolute top-4 right-5 w-2.5 h-2.5 bg-gray-900 rounded-full" />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-6 h-3 bg-gray-900 rounded-full opacity-20" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-gray-900 rounded-full" />
    </div>
  );
}

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState<"math" | "goals" | "units">("math");
  const [mathSelection, setMathSelection] = useState<string | null>(null);
  const [goalSelection, setGoalSelection] = useState<string | null>(null);
  const [unitExpanded, setUnitExpanded] = useState(true);

  return (
    <div className="min-h-full bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Onboarding Patterns</h1>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { key: "math" as const, label: "Math Level" },
              { key: "goals" as const, label: "Goals" },
              { key: "units" as const, label: "Units" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-10">
            {activeTab === "math" && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center gap-4">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "30%" }} />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">1 of 4</span>
                </div>

                <div className="text-center space-y-4">
                  <DiamondLogo />
                  <h2 className="text-xl font-bold text-gray-900">
                    What&apos;s your math comfort level?
                  </h2>
                  <p className="text-sm text-gray-500">
                    Choose the highest level you feel confident in — you can always adjust later.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mathOptions.map((option) => {
                    const Icon = option.icon;
                    const selected = mathSelection === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setMathSelection(option.id)}
                        className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                          selected
                            ? "bg-violet-50 border-violet-500 shadow-sm"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${
                            selected ? "bg-violet-500 text-white" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-sm font-bold ${
                              selected ? "text-violet-700" : "text-gray-900"
                            }`}
                          >
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {option.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={!mathSelection}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      mathSelection
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {activeTab === "goals" && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center gap-5">
                  <BlobMascot />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      What&apos;s your top goal?
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      We&apos;ll personalize your experience based on what matters most.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 max-w-lg">
                  {goalOptions.map((goal) => {
                    const selected = goalSelection === goal;
                    return (
                      <button
                        key={goal}
                        onClick={() => setGoalSelection(goal)}
                        className={`w-full text-left px-5 py-3.5 rounded-full border transition-all text-sm font-medium ${
                          selected
                            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                            : "bg-white text-gray-900 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={!goalSelection}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      goalSelection
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {activeTab === "units" && (
              <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
                <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
                  <button
                    onClick={() => setUnitExpanded((v) => !v)}
                    className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-bold text-gray-900">
                        Understand short emails and messages
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">3 lessons</div>
                    </div>
                    {unitExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {unitExpanded && (
                    <div className="border-t border-gray-100">
                      {lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
                        >
                          <div
                            className="w-16 h-20 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: "#FADBC8" }}
                          >
                            <Triangle className="w-8 h-8 text-orange-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                              {lesson.label}
                            </div>
                            <div className="text-sm font-bold text-gray-900 mt-0.5">
                              {lesson.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 truncate">
                              {lesson.description}
                            </div>
                          </div>
                          <button
                            className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                              lesson.filled
                                ? "bg-gray-900 text-white hover:bg-gray-800"
                                : "text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            {lesson.filled ? (
                              <span className="flex items-center gap-1.5">
                                <Play className="w-3.5 h-3.5" />
                                Start now
                              </span>
                            ) : (
                              "Start now"
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
