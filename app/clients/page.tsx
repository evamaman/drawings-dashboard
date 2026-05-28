"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import { ecosystems, type Client } from "@/lib/mock-data";
import { fetchAllClients, addClient, updateClient, deleteClient } from "@/lib/db";
import {
  Search,
  Plus,
  Building2,
  ShieldCheck,
  X,
  Check,
  Clock,
  CalendarDays,
  ScrollText,
  Pencil,
  Trash2,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(/[\s\-_]/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

function avatarColor(id: number): string {
  const palette = [
    "#00d4ff", "#00c9a7", "#818cf8", "#10b981",
    "#f59e0b", "#ec4899", "#f97316", "#a78bfa",
  ];
  return palette[id % palette.length];
}

function statusBadge(client: Client) {
  if (!client.isActive) return { label: "Inactif", color: "#ef4444", cls: "badge-danger" };
  if (client.expiresAt) {
    const exp = new Date(client.expiresAt);
    if (exp < new Date()) return { label: "Expiré", color: "#ef4444", cls: "badge-danger" };
    const daysLeft = Math.ceil((exp.getTime() - Date.now()) / 86_400_000);
    if (daysLeft <= 60) return { label: `Expire dans ${daysLeft}j`, color: "#f59e0b", cls: "badge-warning" };
  }
  return { label: "Actif", color: "#10b981", cls: "badge-success" };
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Add Client Modal ──────────────────────────────────────────────────────────

interface AddClientModalProps {
  onClose: () => void;
  onAdd: (client: Client) => void;
  existingIds: number[];
}

function AddClientModal({ onClose, onAdd, existingIds }: AddClientModalProps) {
  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [scrollingEnabled, setScrollingEnabled] = useState(true);
  const [selectedEcos, setSelectedEcos] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleEco = (id: number) =>
    setSelectedEcos((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Le nom est requis";
    if (name.trim().length < 2) errs.name = "Minimum 2 caractères";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const newId = Math.max(...existingIds) + 1;
    const now = new Date().toISOString().split("T")[0];
    onAdd({
      id: newId,
      name: name.trim(),
      createdAt: now,
      expiresAt: expiresAt || null,
      isActive: true,
      lastUsedAt: null,
      scrollingEnabled,
      ecosystemIds: selectedEcos,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2,8,16,0.8)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg rounded-2xl p-6"
        style={{
          background: "#0a1628",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#e8f0fe" }}>
              Nouveau client
            </h2>
            <p style={{ fontSize: "13px", color: "#4a6a9c", marginTop: "2px" }}>
              Il sera enregistré et persistera dans le dashboard
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/5"
            style={{ color: "#4a6a9c" }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label style={{ fontSize: "12px", color: "#7b96c2", display: "block", marginBottom: "6px", fontWeight: 500 }}>
              Nom *
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors({}); }}
              placeholder="Ex: Aquarium de Paris"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: errors.name ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${errors.name ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "10px",
                fontSize: "14px",
                color: "#e8f0fe",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {errors.name && (
              <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{errors.name}</p>
            )}
          </div>

          {/* Expiry */}
          <div>
            <label style={{ fontSize: "12px", color: "#7b96c2", display: "block", marginBottom: "6px", fontWeight: 500 }}>
              Date d'expiration (optionnel)
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                fontSize: "14px",
                color: expiresAt ? "#e8f0fe" : "#4a6a9c",
                outline: "none",
                colorScheme: "dark",
              }}
            />
          </div>

          {/* Scrolling */}
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2">
              <ScrollText size={14} style={{ color: "#4a6a9c" }} />
              <span style={{ fontSize: "13px", color: "#7b96c2" }}>Scrolling activé</span>
            </div>
            <button
              onClick={() => setScrollingEnabled(!scrollingEnabled)}
              className="relative w-10 h-5 rounded-full transition-all"
              style={{
                background: scrollingEnabled ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.08)",
                border: scrollingEnabled ? "1px solid rgba(0,212,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <motion.div
                className="absolute top-0.5 w-4 h-4 rounded-full"
                animate={{ left: scrollingEnabled ? "calc(100% - 18px)" : "2px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ background: scrollingEnabled ? "#00d4ff" : "#4a6a9c" }}
              />
            </button>
          </div>

          {/* Ecosystems */}
          <div>
            <label style={{ fontSize: "12px", color: "#7b96c2", display: "block", marginBottom: "8px", fontWeight: 500 }}>
              Accès aux expériences
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ecosystems.map((eco) => {
                const selected = selectedEcos.includes(eco.id);
                return (
                  <button
                    key={eco.id}
                    onClick={() => toggleEco(eco.id)}
                    className="flex items-center gap-2 p-2 rounded-lg transition-all text-left"
                    style={{
                      background: selected ? `${eco.color}12` : "rgba(255,255,255,0.02)",
                      border: selected ? `1px solid ${eco.color}30` : "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <span style={{ fontSize: "13px" }}>{eco.emoji}</span>
                    <span style={{ fontSize: "11px", color: selected ? eco.color : "#4a6a9c", flex: 1, lineHeight: 1.2 }}>
                      {eco.name}
                    </span>
                    {selected && <Check size={10} style={{ color: eco.color, flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#7b96c2" }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
            style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}
          >
            <Plus size={14} /> Ajouter le client
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Edit Modal ────────────────────────────────────────────────────────────────

function EditClientModal({ client, onClose, onSave }: { client: Client; onClose: () => void; onSave: (c: Client) => void }) {
  const [name, setName] = useState(client.name);
  const [expiresAt, setExpiresAt] = useState(client.expiresAt ?? "");
  const [scrollingEnabled, setScrollingEnabled] = useState(client.scrollingEnabled);
  const [selectedEcos, setSelectedEcos] = useState<number[]>(client.ecosystemIds);

  const toggleEco = (id: number) =>
    setSelectedEcos((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2,8,16,0.8)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-2xl p-6"
        style={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#e8f0fe" }}>Modifier — {client.name}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/5" style={{ color: "#4a6a9c" }}>
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label style={{ fontSize: "12px", color: "#7b96c2", display: "block", marginBottom: "6px" }}>Nom</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", fontSize: "14px", color: "#e8f0fe", outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "#7b96c2", display: "block", marginBottom: "6px" }}>Date d'expiration</label>
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", fontSize: "14px", color: expiresAt ? "#e8f0fe" : "#4a6a9c", outline: "none", colorScheme: "dark" }} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: "13px", color: "#7b96c2" }}>Scrolling activé</span>
            <button onClick={() => setScrollingEnabled(!scrollingEnabled)} className="relative w-10 h-5 rounded-full transition-all"
              style={{ background: scrollingEnabled ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.08)", border: scrollingEnabled ? "1px solid rgba(0,212,255,0.5)" : "1px solid rgba(255,255,255,0.1)" }}>
              <motion.div className="absolute top-0.5 w-4 h-4 rounded-full" animate={{ left: scrollingEnabled ? "calc(100% - 18px)" : "2px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }} style={{ background: scrollingEnabled ? "#00d4ff" : "#4a6a9c" }} />
            </button>
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "#7b96c2", display: "block", marginBottom: "8px" }}>Accès aux expériences</label>
            <div className="grid grid-cols-3 gap-2">
              {ecosystems.map((eco) => {
                const selected = selectedEcos.includes(eco.id);
                return (
                  <button key={eco.id} onClick={() => toggleEco(eco.id)} className="flex items-center gap-2 p-2 rounded-lg transition-all"
                    style={{ background: selected ? `${eco.color}12` : "rgba(255,255,255,0.02)", border: selected ? `1px solid ${eco.color}30` : "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: "13px" }}>{eco.emoji}</span>
                    <span style={{ fontSize: "11px", color: selected ? eco.color : "#4a6a9c", flex: 1, lineHeight: 1.2 }}>{eco.name}</span>
                    {selected && <Check size={10} style={{ color: eco.color, flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#7b96c2" }}>
            Annuler
          </button>
          <button onClick={() => { onSave({ ...client, name, expiresAt: expiresAt || null, scrollingEnabled, ecosystemIds: selectedEcos }); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}>
            <Check size={14} /> Enregistrer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ["Tous", "Actif", "Expiré"] as const;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tous");
  const [sortBy, setSortBy] = useState<"name" | "lastUsed" | "created" | "ecosystems">("name");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchAllClients().then((data) => { setClients(data); setLoading(false); });
  }, []);

  const handleAdd = async (client: Client) => {
    const newId = clients.length > 0 ? Math.max(...clients.map((c) => c.id)) + 1 : 100;
    const newClient: Client = { ...client, id: newId, isBase: false };
    await addClient(newClient);
    setClients((prev) => [...prev, newClient]);
  };

  const handleEdit = async (updated: Client) => {
    await updateClient(updated);
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDelete = async (id: number) => {
    await deleteClient(id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    setShowDeleteConfirm(null);
  };

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const status = statusBadge(c);
      const matchStatus =
        statusFilter === "Tous" ||
        (statusFilter === "Actif" && status.label === "Actif") ||
        (statusFilter === "Expiré" && (status.label === "Expiré" || status.label.startsWith("Expire")));
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    }).sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "lastUsed") {
        if (!a.lastUsedAt && !b.lastUsedAt) return 0;
        if (!a.lastUsedAt) return 1;
        if (!b.lastUsedAt) return -1;
        return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime();
      }
      if (sortBy === "created") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "ecosystems") return b.ecosystemIds.length - a.ecosystemIds.length;
      return 0;
    });
  }, [clients, search, statusFilter, sortBy]);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter((c: Client) => statusBadge(c).label === "Actif").length,
    expiringSoon: clients.filter((c: Client) => statusBadge(c).cls === "badge-warning").length,
    recentlyUsed: clients.filter((c: Client) => c.lastUsedAt).length,
  }), [clients]);

  return (
    <DashboardLayout>
      <Header
        title="Clients"
        subtitle={`${stats.total} clients · ${stats.active} actifs`}
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}
          >
            <Plus size={14} /> Nouveau client
          </button>
        }
      />

      <div className="flex-1 p-8 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total clients",      value: stats.total,        color: "#00d4ff", icon: Building2 },
            { label: "Comptes actifs",     value: stats.active,       color: "#10b981", icon: ShieldCheck },
            { label: "Expirent bientôt",   value: stats.expiringSoon, color: "#f59e0b", icon: Clock },
            { label: "Utilisé récemment",  value: stats.recentlyUsed, color: "#a78bfa", icon: CalendarDays },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: "rgba(9,20,34,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                <s.icon size={15} style={{ color: s.color }} strokeWidth={1.75} />
              </div>
              <div>
                <p style={{ fontSize: "20px", color: "#e8f0fe", fontWeight: 700 }}>{s.value}</p>
                <p style={{ fontSize: "11px", color: "#4a6a9c" }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4a6a9c", pointerEvents: "none" }} />
            <input type="text" placeholder="Rechercher un client…" value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: "34px", paddingRight: "12px", paddingTop: "9px", paddingBottom: "9px",
                background: "rgba(9,20,34,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", fontSize: "13px", color: "#e8f0fe", outline: "none" }} />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(9,20,34,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
            {STATUS_FILTERS.map((f) => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: statusFilter === f ? "rgba(0,212,255,0.12)" : "transparent", color: statusFilter === f ? "#00d4ff" : "#4a6a9c", border: statusFilter === f ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent" }}>
                {f}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={{ padding: "9px 12px", background: "rgba(9,20,34,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", fontSize: "13px", color: "#7b96c2", outline: "none", colorScheme: "dark" }}>
            <option value="name">Trier : Nom</option>
            <option value="lastUsed">Trier : Dernière utilisation</option>
            <option value="created">Trier : Date création</option>
            <option value="ecosystems">Trier : Nb expériences</option>
          </select>

          <p className="ml-auto" style={{ fontSize: "13px", color: "#4a6a9c", flexShrink: 0 }}>
            <span style={{ color: "#e8f0fe", fontWeight: 600 }}>{filtered.length}</span> résultats
          </p>
        </div>

        {/* Client list */}
        <motion.div layout className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(9,20,34,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>

          {/* Table header */}
          <div className="grid px-5 py-3" style={{
            gridTemplateColumns: "2.5fr 1fr 2fr 1.2fr 1.2fr 80px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            {["Client", "Statut", "Expériences", "Dernière utilisation", "Créé le", ""].map((h) => (
              <span key={h} style={{ fontSize: "11px", color: "#2d4a6e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {h}
              </span>
            ))}
          </div>

          <AnimatePresence>
            {loading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-4xl mb-3">⏳</div>
                <p style={{ fontSize: "15px", color: "#e8f0fe", fontWeight: 600 }}>Chargement des clients…</p>
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p style={{ fontSize: "15px", color: "#e8f0fe", fontWeight: 600 }}>Aucun client trouvé</p>
                <p style={{ fontSize: "13px", color: "#4a6a9c", marginTop: "4px" }}>Ajustez vos filtres ou ajoutez un nouveau client</p>
              </motion.div>
            ) : (
              filtered.map((client, i) => {
                const status = statusBadge(client);
                const color = avatarColor(client.id);
                const isAdded = client.isBase === false;
                const clientEcos = ecosystems.filter((e) => client.ecosystemIds.includes(e.id));

                return (
                  <motion.div
                    key={client.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="grid items-center px-5 py-3.5 group cursor-default transition-all"
                    style={{
                      gridTemplateColumns: "2.5fr 1fr 2fr 1.2fr 1.2fr 80px",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Name + avatar */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: `${color}18`, border: `1px solid ${color}28`, color }}>
                        {initials(client.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5" style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}>
                          <span className="truncate">{client.name}</span>
                          {isAdded && <span className="badge-teal shrink-0">Nouveau</span>}
                        </p>
                        <p style={{ fontSize: "11px", color: "#2d4a6e" }}>#{client.id}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={status.cls}>{status.label}</span>
                    </div>

                    {/* Ecosystems */}
                    <div className="flex flex-wrap gap-1">
                      {clientEcos.slice(0, 4).map((eco) => (
                        <span key={eco.id} title={eco.name}
                          className="text-sm px-1 py-0.5 rounded-md"
                          style={{ background: `${eco.color}12`, border: `1px solid ${eco.color}20`, fontSize: "12px" }}>
                          {eco.emoji}
                        </span>
                      ))}
                      {clientEcos.length === 0 && <span style={{ fontSize: "11px", color: "#2d4a6e" }}>—</span>}
                      {clientEcos.length > 4 && (
                        <span style={{ fontSize: "11px", color: "#4a6a9c" }}>+{clientEcos.length - 4}</span>
                      )}
                    </div>

                    {/* Last used */}
                    <div className="flex items-center gap-1.5">
                      <Clock size={10} style={{ color: "#2d4a6e" }} />
                      <span style={{ fontSize: "12px", color: client.lastUsedAt ? "#7b96c2" : "#2d4a6e" }}>
                        {formatDate(client.lastUsedAt)}
                      </span>
                    </div>

                    {/* Created */}
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={10} style={{ color: "#2d4a6e" }} />
                      <span style={{ fontSize: "12px", color: "#4a6a9c" }}>{formatDate(client.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                      <button onClick={() => setEditClient(client)}
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="Modifier">
                        <Pencil size={12} style={{ color: "#4a6a9c" }} />
                      </button>
                      {isAdded && (
                        showDeleteConfirm === client.id ? (
                          <button onClick={() => handleDelete(client.id)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }} title="Confirmer suppression">
                            <Check size={12} />
                          </button>
                        ) : (
                          <button onClick={() => setShowDeleteConfirm(client.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" title="Supprimer">
                            <Trash2 size={12} style={{ color: "#4a6a9c" }} />
                          </button>
                        )
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>

        <p style={{ fontSize: "12px", color: "#2d4a6e", textAlign: "center" }}>
          Les clients ajoutés manuellement sont enregistrés dans la base de données.
        </p>
      </div>

      <AnimatePresence>
        {showModal && (
          <AddClientModal
            onClose={() => setShowModal(false)}
            onAdd={handleAdd}
            existingIds={clients.map((c: Client) => c.id)}
          />
        )}
        {editClient && (
          <EditClientModal
            client={editClient}
            onClose={() => setEditClient(null)}
            onSave={handleEdit}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
