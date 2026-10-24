import React from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2 } from "lucide-react";

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0B6E4F] border border-[#2EE59D]/40 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
      <CheckCircle2 className="w-4.5 h-4.5 text-[#2EE59D] shrink-0" />
      <span className="text-xs font-bold tracking-tight">{toastMessage}</span>
    </div>
  );
};
