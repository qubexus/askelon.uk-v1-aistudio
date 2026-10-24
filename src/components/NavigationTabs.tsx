import React from "react";
import { useApp, TabType } from "../context/AppContext";
import { MessageSquare, FolderKanban, FileText, Users, User } from "lucide-react";

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, t, cases } = useApp();

  const openCasesCount = cases.filter((c) => c.status === "open").length;

  const tabs: { id: TabType; labelKey: string; icon: React.ElementType; badge?: number }[] = [
    { id: "chat", labelKey: "tabChat", icon: MessageSquare },
    { id: "cases", labelKey: "tabCases", icon: FolderKanban, badge: openCasesCount },
    { id: "templates", labelKey: "tabTemplates", icon: FileText },
    { id: "forum", labelKey: "tabForum", icon: Users },
    { id: "profile", labelKey: "tabProfile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#040A12]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 sm:py-2">
      <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 sm:px-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-[#FF6A00] font-bold"
                  : "text-[#98AEC2] hover:text-white"
              }`}
            >
              {/* Active glow background */}
              {isActive && (
                <span className="absolute inset-0 bg-[#FF6A00]/15 rounded-xl border border-[#FF6A00]/30 -z-10 shadow-[0_0_12px_rgba(255,106,0,0.25)]"></span>
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform ${isActive ? "scale-110" : ""}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-4 h-4 bg-[#FF6A00] text-black text-[9px] font-extrabold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] sm:text-xs tracking-tight mt-0.5">
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
