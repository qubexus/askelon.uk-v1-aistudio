import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { SentLetter } from "../types";
import { X, Archive, Copy, Download, FileText, ChevronRight, ArrowLeft } from "lucide-react";

export const SentLettersModal: React.FC = () => {
  const {
    isSentLettersModalOpen,
    setIsSentLettersModalOpen,
    sentLetters,
    showToast,
    t
  } = useApp();

  const [activeLetter, setActiveLetter] = useState<SentLetter | null>(null);

  if (!isSentLettersModalOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(t("copyClipboard"));
  };

  const handleDownload = (letter: SentLetter) => {
    const blob = new Blob([letter.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${letter.title.replace(/\s+/g, "_")}_${letter.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t("downloadLetter"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0F2C4D] border border-white/15 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0B6E4F] flex items-center justify-center text-[#2EE59D]">
              <Archive className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {t("sentLettersTitle")}
              </h2>
              <p className="text-[11px] text-[#BACADA]">
                Archiwum pism formalnych i wezwań ACAS
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveLetter(null);
              setIsSentLettersModalOpen(false);
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#BACADA] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeLetter ? (
            <div className="space-y-4">
              <button
                onClick={() => setActiveLetter(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#BACADA] hover:text-white mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Wróć do listy</span>
              </button>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{activeLetter.title}</h3>
                  <p className="text-[11px] text-[#BACADA]">Do: {activeLetter.recipient} • {activeLetter.date}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(activeLetter.content)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12304F] text-xs font-semibold text-[#2EE59D] border border-white/10"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopiuj</span>
                  </button>

                  <button
                    onClick={() => handleDownload(activeLetter)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12304F] text-xs font-semibold text-white border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Pobierz</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070F1A] border border-white/10 font-mono text-xs text-[#F4F8FB] whitespace-pre-wrap leading-relaxed">
                {activeLetter.content}
              </div>
            </div>
          ) : sentLetters.length > 0 ? (
            <div className="space-y-3">
              {sentLetters.map((letter) => (
                <div
                  key={letter.id}
                  onClick={() => setActiveLetter(letter)}
                  className="p-4 rounded-2xl bg-[#12304F] hover:bg-[#153a5e] border border-white/10 hover:border-[#2EE59D]/40 cursor-pointer transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#FF6A00]" />
                      <h4 className="text-xs font-bold text-white">{letter.title}</h4>
                    </div>
                    <p className="text-[11px] text-[#BACADA]">
                      Odbiorca: {letter.recipient} • Data: {letter.date}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#BACADA]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs text-[#BACADA] py-12 space-y-2">
              <Archive className="w-10 h-10 text-[#BACADA]/40 mx-auto" />
              <p>{t("noSentLetters")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
