import React from "react";
import { Routes, Route } from "react-router-dom";
import { UIShowcaseLayout } from "./UIShowcaseLayout";

const Overview = React.lazy(() => import("./Overview"));
const PromptHub = React.lazy(() => import("./PromptHub"));
const AgentWorkspace = React.lazy(() => import("./AgentWorkspace"));
const FlowEditor = React.lazy(() => import("./FlowEditor"));
const PipelineBoard = React.lazy(() => import("./PipelineBoard"));
const InboxCenter = React.lazy(() => import("./InboxCenter"));
const OnboardingPage = React.lazy(() => import("./OnboardingPage"));

function UIShowcaseOneStepRoutes() {
  return (
    <UIShowcaseLayout>
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center h-96">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="prompt" element={<PromptHub />} />
          <Route path="agent" element={<AgentWorkspace />} />
          <Route path="flow" element={<FlowEditor />} />
          <Route path="board" element={<PipelineBoard />} />
          <Route path="inbox" element={<InboxCenter />} />
          <Route path="onboarding" element={<OnboardingPage />} />
        </Routes>
      </React.Suspense>
    </UIShowcaseLayout>
  );
}

export default UIShowcaseOneStepRoutes;
