import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { LegalTemplate } from "../types";
import { renderTemplateLetter } from "../data/legalTemplates";
import {
  FileText,
  Copy,
  Download,
  BookmarkCheck,
  ArrowLeft,
  Archive,
  Scale,
  Sparkles,
  ChevronRight,
  Send
} from "lucide-react";

export const TemplatesTab: React.FC = () => {
  const {
    templates,
    user,
    locale,
    t,
    saveSentLetter,
    setIsSentLettersModalOpen,
    showToast
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTemplate, setActiveTemplate] = useState<LegalTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [renderedLetter, setRenderedLetter] = useState<string | null>(null);

  const categories = [
    { id: "All", label: t("categoryAll") },
    { id: "Grievance", label: t("categoryGrievance") },
    { id: "Wages", label: t("categoryWages") },
    { id: "Sick", label: t("categorySick") },
    { id: "Data", label: t("categoryData") },
    { id: "Dismissal", label: t("categoryDismissal") }
  ];

  const filteredTemplates = templates.filter(
    (tpl) => selectedCategory === "All" || tpl.category === selectedCategory
  );

  const startFilling = (tpl: LegalTemplate) => {
    setActiveTemplate(tpl);
    // Pre-populate fields from User Profile
    const initialValues: Record<string, string> = {};
    tpl.fields.forEach((f) => {
      if (f.key === "employee_name") initialValues[f.key] = user.fullName || f.defaultValue;
      else if (f.key === "job_title") initialValues[f.key] = user.jobTitle || f.defaultValue;
      else if (f.key === "employer_name") initialValues[f.key] = user.employerName || f.defaultValue;
      else initialValues[f.key] = f.defaultValue;
    });
    setFormValues(initialValues);
    setRenderedLetter(null);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTemplate) return;
    const result = renderTemplateLetter(activeTemplate, formValues);
    setRenderedLetter(result);
  };

  const handleCopy = () => {
    if (!renderedLetter) return;
    navigator.clipboard.writeText(renderedLetter);
    showToast(t("copyClipboard"));
  };

  const handleDownload = () => {
    if (!renderedLetter || !activeTemplate) return;
    const blob = new Blob([renderedLetter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTemplate.id}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t("downloadLetter"));
  };

  const handleSaveToArchive = () => {
    if (!renderedLetter || !activeTemplate) return;
    saveSentLetter({
      templateId: activeTemplate.id,
      title: activeTemplate.titlePl || activeTemplate.titleEn,
      recipient: formValues["employer_name"] || user.employerName || "Pracodawca",
      content: renderedLetter
    });
  };

  // Preview Step
  if (activeTemplate && renderedLetter) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-4 pb-24">
        <button
          onClick={() => setRenderedLetter(null)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#BACADA] hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("edit")}</span>
        </button>

        <div className="bg-[#0F2C4D] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0B6E4F]/30 text-[#2EE59D] border border-[#2EE59D]/30 uppercase">
                {activeTemplate.statutoryReference}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                {locale === "pl" ? activeTemplate.titlePl : locale === "ro" ? activeTemplate.titleRo : activeTemplate.titleEn}
              </h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12304F] hover:bg-[#153a5e] border border-white/10 text-xs font-semibold text-[#2EE59D] transition-colors"
                title="Kopiuj"
              >
                <Copy className="w-4 h-4" />
                <span>{t("copy")}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12304F] hover:bg-[#153a5e] border border-white/10 text-xs font-semibold text-white transition-colors"
                title="Pobierz"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">.txt</span>
              </button>

              <button
                onClick={handleSaveToArchive}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-black font-extrabold text-xs shadow-md transition-colors"
                title="Zapisz"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>{t("saveToSent")}</span>
              </button>
            </div>
          </div>

          {/* Letter Sheet Display */}
          <div className="p-4 sm:p-6 rounded-xl bg-[#070F1A] border border-white/10 font-mono text-xs sm:text-sm text-[#F4F8FB] whitespace-pre-wrap leading-relaxed shadow-inner overflow-x-auto">
            {renderedLetter}
          </div>
        </div>
      </div>
    );
  }

  // Form Filling Step
  if (activeTemplate) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-4 pb-24">
        <button
          onClick={() => setActiveTemplate(null)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#BACADA] hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Wróć do listy pism</span>
        </button>

        <div className="bg-[#0F2C4D] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="mb-5 pb-4 border-b border-white/10">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0B6E4F]/30 text-[#2EE59D] border border-[#2EE59D]/30 uppercase">
              {activeTemplate.statutoryReference}
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">
              {locale === "pl" ? activeTemplate.titlePl : locale === "ro" ? activeTemplate.titleRo : activeTemplate.titleEn}
            </h2>
            <p className="text-xs text-[#BACADA] mt-1">
              {locale === "pl" ? activeTemplate.descriptionPl : locale === "ro" ? activeTemplate.descriptionRo : activeTemplate.descriptionEn}
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {activeTemplate.fields.map((field) => {
              const label = locale === "pl" ? field.labelPl : locale === "ro" ? field.labelRo : field.labelEn;
              const isLong = field.key.includes("details") || field.key.includes("nature") || field.key.includes("mitigation") || field.key.includes("records");

              return (
                <div key={field.key}>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    {label}
                  </label>
                  {isLong ? (
                    <textarea
                      rows={3}
                      value={formValues[field.key] || ""}
                      onChange={(e) =>
                        setFormValues({ ...formValues, [field.key]: e.target.value })
                      }
                      placeholder={field.placeholder}
                      className="w-full bg-[#12304F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#BACADA]/50 focus:outline-none focus:border-[#2EE59D]"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formValues[field.key] || ""}
                      onChange={(e) =>
                        setFormValues({ ...formValues, [field.key]: e.target.value })
                      }
                      placeholder={field.placeholder}
                      className="w-full bg-[#12304F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#BACADA]/50 focus:outline-none focus:border-[#2EE59D]"
                    />
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0B6E4F] to-[#2EE59D] text-black font-extrabold text-sm shadow-lg hover:opacity-95 transition-all"
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>{t("generateLetter")}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Templates Gallery View
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#FF6A00]" />
            {t("templatesTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-[#BACADA] mt-0.5">
            {t("templatesSub")}
          </p>
        </div>

        <button
          onClick={() => setIsSentLettersModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F2C4D] hover:bg-[#12304F] border border-white/10 text-xs font-semibold text-[#2EE59D] transition-colors shrink-0"
        >
          <Archive className="w-4 h-4" />
          <span>{t("sentLettersTitle")}</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors shrink-0 ${
              selectedCategory === cat.id
                ? "bg-[#FF6A00] text-black border-[#FF6A00]"
                : "bg-[#0F2C4D] text-[#BACADA] border-white/10 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="space-y-3.5">
        {filteredTemplates.map((tpl) => {
          const title = locale === "pl" ? tpl.titlePl : locale === "ro" ? tpl.titleRo : tpl.titleEn;
          const desc = locale === "pl" ? tpl.descriptionPl : locale === "ro" ? tpl.descriptionRo : tpl.descriptionEn;

          return (
            <div
              key={tpl.id}
              onClick={() => startFilling(tpl)}
              className="group p-5 rounded-2xl bg-[#0F2C4D] hover:bg-[#12304F] border border-white/10 hover:border-[#2EE59D]/40 transition-all cursor-pointer shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0B6E4F]/30 text-[#2EE59D] border border-[#2EE59D]/30 uppercase">
                    {tpl.statutoryReference}
                  </span>
                  <span className="text-[10px] text-[#BACADA] px-1.5 py-0.5 rounded bg-white/5">
                    {tpl.category}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white group-hover:text-[#2EE59D] transition-colors">
                  {title}
                </h3>
                <p className="text-xs text-[#BACADA] mt-1 line-clamp-2">
                  {desc}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0B6E4F] to-[#2EE59D] text-black font-extrabold text-xs shadow-md">
                  <span>Wypełnij</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
