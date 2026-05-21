import { useState } from "react";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  tag: string;
  tagColor: string;
  tagTextColor: string;
  unread: boolean;
}

interface Section {
  title: string;
  emails: Email[];
}

type TabKey = "important" | "shared" | "news" | "other";

const tabs: { key: TabKey; label: string; count: number }[] = [
  { key: "important", label: "Important", count: 12 },
  { key: "shared", label: "Shared", count: 13 },
  { key: "news", label: "News", count: 12 },
  { key: "other", label: "Other", count: 12 },
];

const sections: Section[] = [
  {
    title: "Today",
    emails: [
      {
        id: "e1",
        sender: "Sarah Chen",
        subject: "Q3 Hiring Plan — Engineering",
        preview: "Hi team, I've attached the finalized hiring roadmap for Q3. We have 8 open headcounts across backend, frontend, and ML...",
        time: "10:23 AM",
        tag: "recruiting",
        tagColor: "#E91E63",
        tagTextColor: "#FFFFFF",
        unread: true,
      },
      {
        id: "e2",
        sender: "Notion",
        subject: "Your workspace weekly digest",
        preview: "Here's what happened in your workspace this week: 14 new pages created, 3 tasks completed, and 2 comments...",
        time: "9:45 AM",
        tag: "news",
        tagColor: "#4FC3F7",
        tagTextColor: "#111827",
        unread: true,
      },
      {
        id: "e3",
        sender: "David Park",
        subject: "Contract signature required",
        preview: "Please review and sign the updated vendor agreement attached. The legal team has approved all clauses...",
        time: "8:12 AM",
        tag: "signature",
        tagColor: "#FFAB91",
        tagTextColor: "#111827",
        unread: true,
      },
      {
        id: "e4",
        sender: "Airbnb",
        subject: "Your upcoming trip to Kyoto",
        preview: "Your reservation at Sakura House is confirmed for Oct 12–18. Check-in begins at 3:00 PM. Here are the directions...",
        time: "7:30 AM",
        tag: "travel",
        tagColor: "#4FC3F7",
        tagTextColor: "#111827",
        unread: false,
      },
      {
        id: "e5",
        sender: "Emily Watson",
        subject: "Weekly sync — Design System",
        preview: "Thanks everyone for joining. Action items: finalize color tokens by Friday, review icon library next Tuesday...",
        time: "6:55 AM",
        tag: "meeting",
        tagColor: "#B39DDB",
        tagTextColor: "#111827",
        unread: true,
      },
      {
        id: "e6",
        sender: "Linear",
        subject: "Issue #842 assigned to you",
        preview: "You have been assigned to ENG-842: 'Fix auth token refresh on Safari'. Priority: High. Due: Oct 15...",
        time: "Yesterday",
        tag: "recruiting",
        tagColor: "#E91E63",
        tagTextColor: "#FFFFFF",
        unread: false,
      },
    ],
  },
  {
    title: "Yesterday",
    emails: [
      {
        id: "e7",
        sender: "Marcus Johnson",
        subject: "Offsite venue confirmed",
        preview: "Great news — the Tahoe lodge is locked in for Nov 3–5. I've attached the itinerary and room assignments...",
        time: "Yesterday",
        tag: "travel",
        tagColor: "#4FC3F7",
        tagTextColor: "#111827",
        unread: false,
      },
      {
        id: "e8",
        sender: "Figma",
        subject: "Comment on 'Dashboard v2'",
        preview: "Alex left a comment on Dashboard v2: 'Can we increase the contrast on the stat cards? WCAG 2.1 AA requires...'",
        time: "Yesterday",
        tag: "signature",
        tagColor: "#FFAB91",
        tagTextColor: "#111827",
        unread: true,
      },
      {
        id: "e9",
        sender: "Linda Ho",
        subject: "All-hands meeting notes",
        preview: "Attached are the notes from yesterday's all-hands. Key takeaways: Q4 OKRs published, new hiring freeze lifted...",
        time: "Yesterday",
        tag: "meeting",
        tagColor: "#B39DDB",
        tagTextColor: "#111827",
        unread: false,
      },
      {
        id: "e10",
        sender: "Stripe",
        subject: "Payout scheduled for Oct 15",
        preview: "Your next payout of $24,800.00 is scheduled for Oct 15. View your dashboard for a detailed breakdown...",
        time: "Yesterday",
        tag: "news",
        tagColor: "#4FC3F7",
        tagTextColor: "#111827",
        unread: false,
      },
      {
        id: "e11",
        sender: "James Liu",
        subject: "Referral candidate — Senior PM",
        preview: "I wanted to flag an exceptional candidate for the Senior PM role. 8 years at Shopify, led 0→1 launches...",
        time: "Yesterday",
        tag: "recruiting",
        tagColor: "#E91E63",
        tagTextColor: "#FFFFFF",
        unread: true,
      },
      {
        id: "e12",
        sender: "Calendly",
        subject: "New event scheduled with YC",
        preview: "YC Office Hours has been scheduled for Oct 18 at 2:00 PM PT. A calendar invite has been sent to both parties...",
        time: "Yesterday",
        tag: "meeting",
        tagColor: "#B39DDB",
        tagTextColor: "#111827",
        unread: false,
      },
      {
        id: "e13",
        sender: "GitHub",
        subject: "Security alert: dependabot update",
        preview: "A new security advisory affects 2 repositories in the egonetics org. Dependabot has opened PRs to patch...",
        time: "Yesterday",
        tag: "news",
        tagColor: "#4FC3F7",
        tagTextColor: "#111827",
        unread: true,
      },
      {
        id: "e14",
        sender: "Rachel Kim",
        subject: "Travel reimbursement — Q3",
        preview: "Please find my Q3 travel expenses attached for reimbursement. Total: $3,420.50. Receipts included in PDF...",
        time: "Yesterday",
        tag: "travel",
        tagColor: "#4FC3F7",
        tagTextColor: "#111827",
        unread: false,
      },
    ],
  },
];

export default function InboxCenter() {
  const [activeTab, setActiveTab] = useState<TabKey>("important");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Inbox</h1>

        <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label} {tab.count}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        <div>
          {sections.map((section) => (
            <div key={section.title} className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                {section.title}
              </h2>
              <div className="flex flex-col">
                {section.emails.map((email) => (
                  <div
                    key={email.id}
                    className={`grid items-start gap-4 px-3 py-3.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      email.unread ? "bg-gray-50/50" : "bg-white"
                    }`}
                    style={{
                      gridTemplateColumns: "180px 1fr 120px",
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {email.unread && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                      {!email.unread && (
                        <span className="w-2 h-2 rounded-full bg-transparent shrink-0" />
                      )}
                      <span
                        className={`text-sm truncate ${
                          email.unread
                            ? "font-bold text-gray-900"
                            : "font-normal text-gray-500"
                        }`}
                      >
                        {email.sender}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 lowercase"
                        style={{
                          backgroundColor: email.tagColor,
                          color: email.tagTextColor,
                        }}
                      >
                        {email.tag}
                      </span>
                      <span
                        className={`text-sm truncate ${
                          email.unread
                            ? "font-bold text-gray-900"
                            : "font-normal text-gray-500"
                        }`}
                      >
                        {email.subject}
                      </span>
                      <span className="text-sm text-gray-400 truncate hidden sm:block">
                        — {email.preview}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs ${
                          email.unread
                            ? "font-semibold text-gray-700"
                            : "font-normal text-gray-400"
                        }`}
                      >
                        {email.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
