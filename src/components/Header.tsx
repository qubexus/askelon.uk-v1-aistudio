import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Locale } from "../types";
import { Bell, Menu, Globe, Bot, ShieldCheck } from "lucide-react";

export const Header: React.FC = () => {
  const {
    t,
    locale,
    setLocale,
    setIsMenuDrawerOpen,
    setIsMessagesModalOpen,
    broadcastMessages,
    user
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const unreadCount = broadcastMessages.filter((m) => m.unread).length;

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: "pl", label: "Polski", flag: "🇵🇱" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ro", label: "Română", flag: "🇷🇴" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070F1A]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B6E4F] to-[#043324] border border-[#2EE59D]/30 shadow-md">
            <Bot className="w-5 h-5 text-[#2EE59D]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2EE59D] rounded-full border-2 border-[#070F1A] animate-pulse"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white">
                ask <span className="text-[#FF6A00]">Elon</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0B6E4F]/40 border border-[#2EE59D]/30 text-[#2EE59D]">
                UK
              </span>
              {user.isPro && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FF6A00]/20 border border-[#FF6A00]/40 text-[#FF6A00]">
                  <ShieldCheck className="w-3 h-3" />
                  PRO
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#BACADA] leading-none hidden sm:block">
              {t("motto")}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0F2C4D] hover:bg-[#12304F] border border-white/10 text-xs font-medium text-white transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#2EE59D]" />
              <span className="uppercase">{locale}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-[#0F2C4D] border border-white/15 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLocale(l.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                      locale === l.code
                        ? "bg-[#0B6E4F] text-white font-bold"
                        : "text-[#BACADA] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => setIsMessagesModalOpen(true)}
            className="relative p-2 rounded-lg bg-[#0F2C4D] hover:bg-[#12304F] border border-white/10 text-[#BACADA] hover:text-white transition-colors"
            title="Messages"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF6A00] text-black font-extrabold text-[10px] flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Menu Drawer Toggle */}
          <button
            onClick={() => setIsMenuDrawerOpen(true)}
            className="p-2 rounded-lg bg-[#0F2C4D] hover:bg-[#12304F] border border-white/10 text-[#BACADA] hover:text-white transition-colors"
            title="Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
