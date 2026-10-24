import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Locale,
  UserProfile,
  WorkplaceCase,
  LegalTemplate,
  ForumPost,
  UserDocument,
  WorkplaceNote,
  ChatMessage,
  SentLetter,
  BroadcastMessage
} from "../types";
import { defaultTemplates } from "../data/legalTemplates";
import * as storage from "../services/storageService";
import { askElonAI } from "../services/geminiService";
import { getTranslation } from "../i18n/translations";

export type TabType = "chat" | "cases" | "templates" | "forum" | "profile";

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;

  // Cases
  cases: WorkplaceCase[];
  activeCaseId: string | null;
  setActiveCaseId: (id: string | null) => void;
  addCase: (newCase: Omit<WorkplaceCase, "id" | "createdAt" | "updatedAt" | "notes">) => string;
  updateCaseStatus: (id: string, status: "open" | "resolved") => void;
  addCaseNote: (caseId: string, noteText: string) => void;
  startChatAboutCase: (caseItem: WorkplaceCase) => void;

  // Templates
  templates: LegalTemplate[];
  activeTemplateId: string | null;
  setActiveTemplateId: (id: string | null) => void;
  sentLetters: SentLetter[];
  saveSentLetter: (letter: Omit<SentLetter, "id" | "date">) => void;

  // Forum
  forumPosts: ForumPost[];
  addForumPost: (title: string, content: string, tag: string) => void;
  upvoteForumPost: (postId: string) => void;
  addForumComment: (postId: string, commentText: string) => void;

  // Documents
  documents: UserDocument[];
  addDocument: (doc: Omit<UserDocument, "id" | "uploadDate">) => void;
  removeDocument: (id: string) => void;
  runDocumentAudit: (id: string) => void;

  // Notes
  notes: WorkplaceNote[];
  addNote: (title: string, description: string, category: string) => void;
  removeNote: (id: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  sendChatMessage: (text: string) => Promise<void>;
  clearChatMessages: () => void;
  saveCurrentChatAsCase: () => void;

  // Modals & Drawers
  isNewCaseModalOpen: boolean;
  setIsNewCaseModalOpen: (open: boolean) => void;
  isNewPostModalOpen: boolean;
  setIsNewPostModalOpen: (open: boolean) => void;
  isEmployerLookupModalOpen: boolean;
  setIsEmployerLookupModalOpen: (open: boolean) => void;
  isPaywallModalOpen: boolean;
  setIsPaywallModalOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isMenuDrawerOpen: boolean;
  setIsMenuDrawerOpen: (open: boolean) => void;
  isMessagesModalOpen: boolean;
  setIsMessagesModalOpen: (open: boolean) => void;
  isSentLettersModalOpen: boolean;
  setIsSentLettersModalOpen: (open: boolean) => void;

  // Notifications / Toast
  broadcastMessages: BroadcastMessage[];
  markMessagesRead: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Global reset
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [locale, setLocaleState] = useState<Locale>(storage.loadLocale);
  const [user, setUserState] = useState<UserProfile>(storage.loadUserProfile);
  const [cases, setCasesState] = useState<WorkplaceCase[]>(storage.loadCases);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [templates] = useState<LegalTemplate[]>(defaultTemplates);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [sentLetters, setSentLettersState] = useState<SentLetter[]>(storage.loadSentLetters);
  const [forumPosts, setForumPostsState] = useState<ForumPost[]>(storage.loadForumPosts);
  const [documents, setDocumentsState] = useState<UserDocument[]>(storage.loadDocuments);
  const [notes, setNotesState] = useState<WorkplaceNote[]>(storage.loadNotes);
  const [chatMessages, setChatMessagesState] = useState<ChatMessage[]>(() => {
    const saved = storage.loadChatHistory();
    if (saved.length > 0) return saved;
    return [
      {
        id: "msg_init",
        role: "assistant",
        text: getTranslation("elonGreeting", locale),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ];
  });
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [broadcastMessages, setBroadcastMessagesState] = useState<BroadcastMessage[]>(storage.loadBroadcastMessages);

  // Modals
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isEmployerLookupModalOpen, setIsEmployerLookupModalOpen] = useState(false);
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
  const [isSentLettersModalOpen, setIsSentLettersModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = (key: string) => getTranslation(key, locale);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    storage.saveLocale(l);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUserState((prev) => {
      const next = { ...prev, ...updates };
      storage.saveUserProfile(next);
      return next;
    });
    showToast(t("profileSavedToast"));
  };

  const addCase = (newCaseData: Omit<WorkplaceCase, "id" | "createdAt" | "updatedAt" | "notes">): string => {
    const id = `case_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const created: WorkplaceCase = {
      ...newCaseData,
      id,
      createdAt: nowIso,
      updatedAt: nowIso,
      notes: []
    };
    const updated = [created, ...cases];
    setCasesState(updated);
    storage.saveCases(updated);
    showToast(t("createCaseBtn") + " - " + created.title);
    return id;
  };

  const updateCaseStatus = (id: string, status: "open" | "resolved") => {
    const updated = cases.map((c) => (c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c));
    setCasesState(updated);
    storage.saveCases(updated);
  };

  const addCaseNote = (caseId: string, noteText: string) => {
    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 16);
    const newNote = {
      id: `cn_${Date.now()}`,
      text: noteText,
      date: nowStr,
      author: user.fullName || "Artur Kowalski"
    };
    const updated = cases.map((c) =>
      c.id === caseId ? { ...c, updatedAt: new Date().toISOString(), notes: [...c.notes, newNote] } : c
    );
    setCasesState(updated);
    storage.saveCases(updated);
    showToast(t("caseNotes"));
  };

  const startChatAboutCase = (caseItem: WorkplaceCase) => {
    setActiveCaseId(caseItem.id);
    setActiveTab("chat");
    const promptMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      text: `Chciałbym porozmawiać o mojej sprawie: "${caseItem.title}" u pracodawcy ${caseItem.employer} (Branża: ${caseItem.sector}). Opis sprawy: ${caseItem.description}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      threadId: caseItem.id
    };
    const newChat = [...chatMessages, promptMsg];
    setChatMessagesState(newChat);
    storage.saveChatHistory(newChat);

    // Trigger AI reaction
    setIsChatLoading(true);
    askElonAI(promptMsg.text, newChat, locale, {
      name: user.fullName,
      employer: caseItem.employer,
      jobTitle: user.jobTitle,
      hourlyRate: user.hourlyRate
    })
      .then((reply) => {
        const replyMsg: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          role: "assistant",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          threadId: caseItem.id
        };
        const finalChat = [...newChat, replyMsg];
        setChatMessagesState(finalChat);
        storage.saveChatHistory(finalChat);
      })
      .finally(() => setIsChatLoading(false));
  };

  const saveSentLetter = (letterData: Omit<SentLetter, "id" | "date">) => {
    const newSent: SentLetter = {
      ...letterData,
      id: `sent_${Date.now()}`,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    };
    const updated = [newSent, ...sentLetters];
    setSentLettersState(updated);
    storage.saveSentLetters(updated);
    showToast(t("saveToSent"));
  };

  const addForumPost = (title: string, content: string, tag: string) => {
    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      author: user.fullName || "Worker_UK",
      authorRole: `${user.jobTitle || "Worker"} · ask Elon`,
      title,
      content,
      tag,
      upvotes: 1,
      userUpvoted: true,
      createdAt: new Date().toISOString(),
      comments: []
    };
    const updated = [newPost, ...forumPosts];
    setForumPostsState(updated);
    storage.saveForumPosts(updated);
    showToast(t("publishPost"));
  };

  const upvoteForumPost = (postId: string) => {
    const updated = forumPosts.map((p) => {
      if (p.id === postId) {
        const isUpvoted = p.userUpvoted;
        return {
          ...p,
          upvotes: isUpvoted ? p.upvotes - 1 : p.upvotes + 1,
          userUpvoted: !isUpvoted
        };
      }
      return p;
    });
    setForumPostsState(updated);
    storage.saveForumPosts(updated);
  };

  const addForumComment = (postId: string, commentText: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      author: user.fullName || "Artur Kowalski",
      text: commentText,
      createdAt: new Date().toISOString()
    };
    const updated = forumPosts.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
    setForumPostsState(updated);
    storage.saveForumPosts(updated);
  };

  const addDocument = (doc: Omit<UserDocument, "id" | "uploadDate">) => {
    const newDoc: UserDocument = {
      ...doc,
      id: `doc_${Date.now()}`,
      uploadDate: new Date().toISOString().slice(0, 10)
    };
    const updated = [newDoc, ...documents];
    setDocumentsState(updated);
    storage.saveDocuments(updated);
    showToast(t("uploadDoc") + " - " + newDoc.name);
  };

  const removeDocument = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    setDocumentsState(updated);
    storage.saveDocuments(updated);
  };

  const runDocumentAudit = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    // Simulate smart AI inspection
    const auditRes = {
      valid: false,
      summary: "AI Audit ukończony. Sprawdzono stawkę National Living Wage, potrącenia oraz holiday pay.",
      calculatedHourly: 12.45,
      holidayPayStatus: "Naliczone poprawnie (12.07%)",
      minimumWageCompliance: true,
      items: [
        {
          issue: "Potrącenie za uniform lub sprzęt ochronny",
          severity: "error" as const,
          recommendation: "Zgodnie z s.9 Health & Safety at Work Act 1974, pracodawca nie może potrącać z pensji kosztów wymaganego PPE."
        },
        {
          issue: "Sprawdź kalkulację nadgodzin w okresie rozliczeniowym",
          severity: "warning" as const,
          recommendation: "Zgłoś brakujące godziny korzystając z szablonu Section 13 ERA 1996 w zakładce Pisma."
        }
      ]
    };

    const updated = documents.map((d) => (d.id === id ? { ...d, auditResult: auditRes } : d));
    setDocumentsState(updated);
    storage.saveDocuments(updated);
    showToast("Audyt AI dokumentu zakończony!");
  };

  const addNote = (title: string, description: string, category: string) => {
    const newNote: WorkplaceNote = {
      id: `note_${Date.now()}`,
      title,
      description,
      category,
      date: new Date().toISOString().slice(0, 10)
    };
    const updated = [newNote, ...notes];
    setNotesState(updated);
    storage.saveNotes(updated);
    showToast(t("tabNotes") + " - " + title);
  };

  const removeNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotesState(updated);
    storage.saveNotes(updated);
  };

  const sendChatMessage = async (text: string) => {
    if (!text.trim() || isChatLoading) return;
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      threadId: activeCaseId || undefined
    };
    const newMessages = [...chatMessages, userMsg];
    setChatMessagesState(newMessages);
    storage.saveChatHistory(newMessages);
    setIsChatLoading(true);

    try {
      const reply = await askElonAI(userMsg.text, newMessages, locale, {
        name: user.fullName,
        employer: user.employerName,
        jobTitle: user.jobTitle,
        hourlyRate: user.hourlyRate
      });

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        threadId: activeCaseId || undefined
      };
      const finalMessages = [...newMessages, assistantMsg];
      setChatMessagesState(finalMessages);
      storage.saveChatHistory(finalMessages);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        text: t("aiError"),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessagesState([...newMessages, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearChatMessages = () => {
    const initial: ChatMessage[] = [
      {
        id: `msg_${Date.now()}`,
        role: "assistant",
        text: getTranslation("elonGreeting", locale),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ];
    setChatMessagesState(initial);
    storage.saveChatHistory(initial);
    setActiveCaseId(null);
    showToast(t("clearChat"));
  };

  const saveCurrentChatAsCase = () => {
    const lastUserMsg = [...chatMessages].reverse().find((m) => m.role === "user");
    const title = lastUserMsg?.text.slice(0, 50) || "Nowa sprawa z czatu z Elonem";
    const desc = chatMessages.map((m) => `${m.role === "assistant" ? "Elon" : user.fullName}: ${m.text}`).join("\n\n");
    addCase({
      title,
      description: desc.slice(0, 2000),
      sector: user.industry || "Ogólne",
      employer: user.employerName || "Pracodawca",
      status: "open",
      priority: "medium"
    });
    showToast(t("caseSavedToast"));
  };

  const markMessagesRead = () => {
    const updated = broadcastMessages.map((m) => ({ ...m, unread: false }));
    setBroadcastMessagesState(updated);
    storage.saveBroadcastMessages(updated);
  };

  const resetAll = () => {
    storage.resetAllData();
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        locale,
        setLocale,
        t,
        user,
        updateUser,
        cases,
        activeCaseId,
        setActiveCaseId,
        addCase,
        updateCaseStatus,
        addCaseNote,
        startChatAboutCase,
        templates,
        activeTemplateId,
        setActiveTemplateId,
        sentLetters,
        saveSentLetter,
        forumPosts,
        addForumPost,
        upvoteForumPost,
        addForumComment,
        documents,
        addDocument,
        removeDocument,
        runDocumentAudit,
        notes,
        addNote,
        removeNote,
        chatMessages,
        isChatLoading,
        sendChatMessage,
        clearChatMessages,
        saveCurrentChatAsCase,
        isNewCaseModalOpen,
        setIsNewCaseModalOpen,
        isNewPostModalOpen,
        setIsNewPostModalOpen,
        isEmployerLookupModalOpen,
        setIsEmployerLookupModalOpen,
        isPaywallModalOpen,
        setIsPaywallModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isMenuDrawerOpen,
        setIsMenuDrawerOpen,
        isMessagesModalOpen,
        setIsMessagesModalOpen,
        isSentLettersModalOpen,
        setIsSentLettersModalOpen,
        broadcastMessages,
        markMessagesRead,
        toastMessage,
        showToast,
        resetAll
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
