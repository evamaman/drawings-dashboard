"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, LayoutDashboard, Users, Building2,
  ArrowRight, Clock, BarChart3,
} from "lucide-react";
import { fetchAllClients } from "@/lib/db";
import type { Client } from "@/lib/mock-data";

// ─── Types ────────────────────────────────────────────────────────────────────

type SearchResult = {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  icon: React.ElementType;
  color: string;
  category: string;
};

// ─── Static nav items ─────────────────────────────────────────────────────────

const NAV_ITEMS: SearchResult[] = [
  { id: "nav-global", label: "Dashboard Global",  href: "/global", icon: LayoutDashboard, color: "#00d4ff", category: "Navigation" },
  { id: "nav-clients", label: "Gestion Clients",  href: "/clients",          icon: Users,           color: "#a78bfa", category: "Navigation" },
  { id: "nav-analytics", label: "Analytics",      href: "/analytics",        icon: BarChart3,       color: "#f59e0b", category: "Navigation" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load clients from Supabase once
  useEffect(() => {
    fetchAllClients().then(setClients);
    try {
      const saved = JSON.parse(localStorage.getItem("wi_recent_clients") ?? "[]");
      setRecentIds(saved);
    } catch { /* ignore */ }
  }, []);

  // Focus when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // All client results
  const clientResults = useMemo((): SearchResult[] =>
    clients.map((c): SearchResult => ({
      id: `client-${c.id}`,
      label: c.name,
      sublabel: `Client #${c.id}`,
      href: `/client/${c.id}`,
      icon: Building2,
      color: "#00d4ff",
      category: "Clients",
    })),
  [clients]);

  // Filtered results
  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return [
      ...NAV_ITEMS.filter((r) => r.label.toLowerCase().includes(q)),
      ...clientResults.filter((r) =>
        r.label.toLowerCase().includes(q) || r.sublabel?.toLowerCase().includes(q)
      ),
    ].slice(0, 12);
  }, [query, clientResults]);

  // Grouped by category
  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    for (const r of results) {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category)!.push(r);
    }
    return map;
  }, [results]);

  // Recent clients
  const recentClients = useMemo(() =>
    recentIds
      .map((id) => clientResults.find((c) => c.id === `client-${id}`))
      .filter(Boolean) as SearchResult[],
  [recentIds, clientResults]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      else if (e.key === "Enter") { const item = results[selectedIndex]; if (item) handleSelect(item); }
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, selectedIndex]);

  // Auto-scroll
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${selectedIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleSelect = (item: SearchResult) => {
    // Save recent client
    if (item.category === "Clients") {
      const clientId = item.id.replace("client-", "");
      const updated = [clientId, ...recentIds.filter((x) => x !== clientId)].slice(0, 5);
      setRecentIds(updated);
      localStorage.setItem("wi_recent_clients", JSON.stringify(updated));
    }
    router.push(item.href);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
        style={{ background: "rgba(2,8,16,0.8)", backdropFilter: "blur(8px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, scale: 0.97, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-xl rounded-2xl overflow-hidden"
          style={{
            background: "#0a1628",
            border: "1px solid rgba(0,212,255,0.15)",
            boxShadow: "0 0 0 1px rgba(0,212,255,0.05), 0 32px 80px rgba(0,0,0,0.7)",
          }}
        >
          {/* Input */}
          <div className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Search size={16} style={{ color: query ? "#00d4ff" : "#4a6a9c", flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              placeholder="Rechercher un client…"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "15px", color: "#e8f0fe" }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ color: "#4a6a9c" }}><X size={14} /></button>
            )}
            <kbd style={{ fontSize: "10px", color: "#2d4a6e", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.07)" }}>
              ESC
            </kbd>
          </div>

          {/* Content */}
          <div ref={listRef} style={{ maxHeight: "440px", overflowY: "auto" }}>

            {/* No query: recents + quick nav */}
            {!query && (
              <div>
                {recentClients.length > 0 && (
                  <>
                    <p className="px-5 pt-4 pb-2" style={{ fontSize: "11px", color: "#2d4a6e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Clients récents
                    </p>
                    {recentClients.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.id}
                          className="flex items-center gap-3 px-5 py-2.5 cursor-pointer"
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          onClick={() => handleSelect(item)}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${item.color}15`, border: `1px solid ${item.color}20` }}>
                            <Icon size={13} style={{ color: item.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: "13px", color: "#7b96c2" }} className="truncate">{item.label}</p>
                            <p style={{ fontSize: "11px", color: "#2d4a6e" }}>{item.sublabel}</p>
                          </div>
                          <Clock size={11} style={{ color: "#2d4a6e", flexShrink: 0 }} />
                        </div>
                      );
                    })}
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.04)", margin: "8px 0" }} />
                  </>
                )}

                <p className="px-5 pt-3 pb-2" style={{ fontSize: "11px", color: "#2d4a6e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Navigation rapide
                </p>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id}
                      className="flex items-center gap-3 px-5 py-2.5 cursor-pointer"
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      onClick={() => handleSelect(item)}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${item.color}15`, border: `1px solid ${item.color}20` }}>
                        <Icon size={13} style={{ color: item.color }} />
                      </div>
                      <span style={{ fontSize: "13px", color: "#7b96c2" }}>{item.label}</span>
                      <ArrowRight size={12} style={{ color: "#2d4a6e", marginLeft: "auto" }} />
                    </div>
                  );
                })}
                <div style={{ height: "12px" }} />
              </div>
            )}

            {/* Results */}
            {query && results.length > 0 && (
              <div className="py-2">
                {Array.from(grouped.entries()).map(([category, items]) => (
                  <div key={category}>
                    <p className="px-5 pt-3 pb-1.5"
                      style={{ fontSize: "11px", color: "#2d4a6e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {category}
                    </p>
                    {items.map((item) => {
                      const idx = results.indexOf(item);
                      const isSelected = idx === selectedIndex;
                      const Icon = item.icon;
                      return (
                        <div key={item.id} data-idx={idx}
                          className="flex items-center gap-3 px-5 py-2.5 cursor-pointer"
                          style={{ background: isSelected ? "rgba(0,212,255,0.06)" : "transparent" }}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => handleSelect(item)}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${item.color}15`, border: `1px solid ${item.color}20` }}>
                            <Icon size={13} style={{ color: item.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: "13px", color: isSelected ? "#e8f0fe" : "#7b96c2", fontWeight: isSelected ? 500 : 400 }} className="truncate">
                              {item.label}
                            </p>
                            {item.sublabel && (
                              <p style={{ fontSize: "11px", color: "#2d4a6e" }}>{item.sublabel}</p>
                            )}
                          </div>
                          {isSelected && (
                            <kbd style={{ fontSize: "10px", color: "#00d4ff", background: "rgba(0,212,255,0.1)", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(0,212,255,0.2)", flexShrink: 0 }}>
                              ↵
                            </kbd>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div style={{ height: "8px" }} />
              </div>
            )}

            {/* No results */}
            {query && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-3xl mb-3">🔍</div>
                <p style={{ fontSize: "14px", color: "#7b96c2", fontWeight: 500 }}>
                  Aucun résultat pour «&nbsp;{query}&nbsp;»
                </p>
                <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "4px" }}>
                  Essayez un autre terme
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="flex items-center gap-4 px-5 py-2.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              {[["↑↓", "Naviguer"], ["↵", "Ouvrir"], ["Esc", "Fermer"]].map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <kbd style={{ fontSize: "10px", color: "#4a6a9c", background: "rgba(255,255,255,0.04)", padding: "2px 5px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {key}
                  </kbd>
                  <span style={{ fontSize: "11px", color: "#2d4a6e" }}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
