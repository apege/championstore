"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface AdminContextType {
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
  openModal: (modalName: string, payload?: any) => void;
  closeModal: () => void;
  activeModal: string | null;
  selectedActivationUsername: string;
  adminNote: string;
  setAdminNote: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return ctx;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedActivationUsername, setSelectedActivationUsername] =
    useState<string>("Champion_User");
  const [adminNote, setAdminNoteState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("champion_admin_note");
      if (cached) return cached;
    }
    return "Catatan penting untuk tim operasional toko.";
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const setAdminNote = (noteOrFn: string | ((prev: string) => string)) => {
    setAdminNoteState((prev) => {
      const val = typeof noteOrFn === "function" ? noteOrFn(prev) : noteOrFn;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("champion_admin_note", val);
        } catch {
          // ignore
        }
      }
      return val;
    });
  };

  // Load initial admin note from database
  useEffect(() => {
    async function loadInitialNote() {
      try {
        const res = await fetch("/api/store");
        const json = await res.json();
        if (json.success && json.data && json.data.adminNote) {
          setAdminNoteState(json.data.adminNote);
          if (typeof window !== "undefined") {
            localStorage.setItem("champion_admin_note", json.data.adminNote);
          }
        }
      } catch (err) {
        console.warn("Failed to load initial note:", err);
      }
    }
    loadInitialNote();
  }, []);

  // Toast Notification state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const openModal = (modalName: string, payload?: any) => {
    if (modalName === "activate-id" && typeof payload === "string") {
      setSelectedActivationUsername(payload);
    }
    setActiveModal(modalName);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <AdminContext.Provider
      value={{
        showToast,
        openModal,
        closeModal,
        activeModal,
        selectedActivationUsername,
        adminNote,
        setAdminNote,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}

      {/* Global Toast Notification Popup */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[99999] animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs sm:text-sm font-black tracking-wide ${
              toast.type === "success"
                ? "bg-[#06180E]/95 border-emerald-500 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                : toast.type === "error"
                ? "bg-[#1A060A]/95 border-red-500 text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.5)]"
                : "bg-[#060F1A]/95 border-blue-500 text-blue-300 shadow-[0_0_25px_rgba(59,130,246,0.5)]"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
            )}
            <span className="leading-snug">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-3 p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4 opacity-70 hover:opacity-100" />
            </button>
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
}
