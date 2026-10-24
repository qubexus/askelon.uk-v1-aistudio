import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  BookmarkPlus,
  Bot,
  User,
  Sparkles,
  Info
} from "lucide-react";

export const ChatTab: React.FC = () => {
  const {
    t,
    chatMessages,
    isChatLoading,
    sendChatMessage,
    clearChatMessages,
    saveCurrentChatAsCase,
    locale,
    user
  } = useApp();

  const [input, setInput] = useState("");
  const [isDictating, setIsDictating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [autoReadAloud, setAutoReadAloud] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // Read latest message if autoReadAloud is enabled
  useEffect(() => {
    if (autoReadAloud && chatMessages.length > 0) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg.role === "assistant" && lastMsg.id !== "msg_init") {
        speakText(lastMsg.text, lastMsg.id);
      }
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim() || isChatLoading) return;
    const textToSend = input;
    setInput("");
    sendChatMessage(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Text-To-Speech (Web Speech API)
  const speakText = (text: string, id: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking === id) {
      setIsSpeaking(null);
      return;
    }

    const clean = text.replace(/[*#_~`]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = locale === "pl" ? "pl-PL" : locale === "ro" ? "ro-RO" : "en-GB";
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(id);
    window.speechSynthesis.speak(utterance);
  };

  // Speech-To-Text (Web Speech Recognition)
  const toggleDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Twoja przeglądarka nie wspiera dyktowania głosem (Web Speech API). Użyj Chrome lub Edge.");
      return;
    }

    if (isDictating) {
      recognitionRef.current?.stop();
      setIsDictating(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = locale === "pl" ? "pl-PL" : locale === "ro" ? "ro-RO" : "en-GB";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsDictating(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      recognition.onerror = () => setIsDictating(false);
      recognition.onend = () => setIsDictating(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsDictating(false);
    }
  };

  const quickChips = [
    { label: t("q1"), prompt: t("q1") },
    { label: t("q2"), prompt: t("q2") },
    { label: t("q3"), prompt: t("q3") },
    { label: t("q4"), prompt: t("q4") },
    { label: t("q5"), prompt: t("q5") },
    { label: t("q6"), prompt: t("q6") }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto px-3 sm:px-4 pb-2">
      {/* Top Bar inside Chat */}
      <div className="flex items-center justify-between py-2 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#0B6E4F]/20 border border-[#2EE59D]/30 text-[#2EE59D] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#2EE59D] animate-ping"></span>
            <span>{t("online")}</span>
          </div>

          <button
            onClick={() => setAutoReadAloud(!autoReadAloud)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              autoReadAloud
                ? "bg-[#FF6A00]/20 border-[#FF6A00]/40 text-[#FF6A00]"
                : "bg-white/5 border-white/10 text-[#BACADA] hover:text-white"
            }`}
            title="Auto-read aloud"
          >
            {autoReadAloud ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{t("autoRead")}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {chatMessages.length > 1 && (
            <button
              onClick={saveCurrentChatAsCase}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0F2C4D] hover:bg-[#12304F] border border-white/10 text-xs font-medium text-[#2EE59D] transition-colors"
              title="Save current chat as a case"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("saveAsCase")}</span>
            </button>
          )}

          <button
            onClick={clearChatMessages}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#BACADA] hover:text-[#F26D6D] transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {chatMessages.map((msg) => {
          const isAI = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAI ? "justify-start" : "justify-end"}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B6E4F] to-[#043324] border border-[#2EE59D]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                  <Bot className="w-4.5 h-4.5 text-[#2EE59D]" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-md ${
                  isAI
                    ? "bg-[#0F2C4D] border border-white/10 text-[#F4F8FB]"
                    : "bg-[#143A66] border border-[#2EE59D]/20 text-white rounded-tr-none"
                }`}
              >
                {/* Header inside bubble */}
                <div className="flex items-center justify-between gap-3 mb-1 text-[11px] text-[#BACADA]">
                  <span className="font-semibold text-[#2EE59D]">
                    {isAI ? "Elon · ask Elon" : user.fullName || "Ty"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {isAI && (
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`p-1 rounded hover:bg-white/10 transition-colors ${
                          isSpeaking === msg.id ? "text-[#FF6A00]" : "text-[#BACADA] hover:text-white"
                        }`}
                        title="Odsłuchaj na głos"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-normal">
                  {msg.text}
                </div>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-xl bg-[#12304F] border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isChatLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0B6E4F] flex items-center justify-center shrink-0">
              <Bot className="w-4.5 h-4.5 text-[#2EE59D] animate-spin" />
            </div>
            <div className="bg-[#0F2C4D] border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#BACADA] flex items-center gap-2 shadow-md">
              <span className="inline-block w-2 h-2 rounded-full bg-[#2EE59D] animate-bounce"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#2EE59D] animate-bounce [animation-delay:0.2s]"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#2EE59D] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs font-medium ml-1">Elon analizuje prawo pracy UK...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      {chatMessages.length <= 3 && !isChatLoading && (
        <div className="py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs text-[#BACADA] mb-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>Częste zapytania:</span>
          </div>
          <div className="flex gap-2 pb-1 overflow-x-auto">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => sendChatMessage(chip.prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#0F2C4D] hover:bg-[#12304F] border border-white/10 hover:border-[#FF6A00]/40 text-xs text-[#F4F8FB] hover:text-[#FF6A00] transition-colors shrink-0 shadow-sm"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Sticky Composer */}
      <div className="mt-2 pt-2 border-t border-white/10">
        <div className="flex items-end gap-2 bg-[#0F2C4D] border border-white/15 focus-within:border-[#2EE59D] rounded-2xl p-1.5 shadow-lg transition-colors">
          <button
            onClick={toggleDictation}
            className={`p-2.5 rounded-xl transition-all ${
              isDictating
                ? "bg-[#EF4444] text-white animate-pulse"
                : "bg-white/5 hover:bg-white/10 text-[#BACADA] hover:text-white"
            }`}
            title={isDictating ? "Zatrzymaj dyktowanie" : "Dyktuj wiadomość"}
          >
            {isDictating ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDictating ? t("listening") : t("chatPlaceholder")}
            rows={1}
            className="flex-1 bg-transparent border-0 resize-none text-sm text-white placeholder-[#BACADA]/60 focus:ring-0 focus:outline-none max-h-28 py-2 px-1"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isChatLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#0B6E4F] to-[#2EE59D] text-black font-extrabold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-md"
            title="Wyślij"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Legal Micro Disclaimer */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#BACADA]/70 mt-1.5 text-center">
          <Info className="w-3 h-3 text-[#2EE59D]" />
          <span>{t("aiDisclaimer")}</span>
        </div>
      </div>
    </div>
  );
};
