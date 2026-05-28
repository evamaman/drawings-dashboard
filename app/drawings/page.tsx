"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import { drawings } from "@/lib/mock-data";
import {
  Search,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  PenTool,
  MapPin,
  Clock,
  Share2,
  Trash2,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Flag,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

const statusConfig = {
  published: { label: "Published", color: "#10b981", cls: "badge-success" },
  pending: { label: "Pending", color: "#f59e0b", cls: "badge-warning" },
  flagged: { label: "Flagged", color: "#ef4444", cls: "badge-danger" },
};

const filters = ["All", "Published", "Pending", "Flagged", "Shared"];

function DrawingCard({ drawing, view }: { drawing: typeof drawings[0]; view: "grid" | "list" }) {
  const status = statusConfig[drawing.status as keyof typeof statusConfig];

  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 8 }}
        className="flex items-center gap-4 p-4 rounded-xl group cursor-pointer transition-all"
        style={{
          background: "rgba(9,20,34,0.6)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
        whileHover={{
          background: "rgba(13,28,48,0.8)",
          borderColor: "rgba(0,212,255,0.12)",
        }}
      >
        {/* Emoji preview */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${drawing.color}20, ${drawing.color}10)`,
            border: `1px solid ${drawing.color}25`,
          }}
        >
          {drawing.emoji}
        </div>

        {/* Title + location */}
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: "14px", color: "#e8f0fe", fontWeight: 600 }}>
            {drawing.title}
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            <span style={{ fontSize: "12px", color: "#4a6a9c" }}>{drawing.author}, {drawing.authorAge} ans</span>
            <div className="flex items-center gap-1">
              <MapPin size={10} style={{ color: "#2d4a6e" }} />
              <span style={{ fontSize: "12px", color: "#4a6a9c" }}>{drawing.location}</span>
            </div>
          </div>
        </div>

        {/* Experience */}
        <span
          className="hidden md:block flex-shrink-0"
          style={{
            fontSize: "12px",
            color: drawing.color,
            background: `${drawing.color}12`,
            padding: "3px 8px",
            borderRadius: "6px",
            border: `1px solid ${drawing.color}20`,
          }}
        >
          {drawing.experience}
        </span>

        {/* Duration */}
        <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
          <Clock size={11} style={{ color: "#2d4a6e" }} />
          <span style={{ fontSize: "12px", color: "#4a6a9c" }}>{drawing.duration}</span>
        </div>

        {/* Date */}
        <span style={{ fontSize: "12px", color: "#2d4a6e", flexShrink: 0 }}>
          {formatDate(drawing.createdAt)}
        </span>

        {/* Status */}
        <span className={`${status.cls} flex-shrink-0`}>{status.label}</span>

        {/* Shared */}
        {drawing.shared && (
          <Share2 size={13} style={{ color: "#00d4ff", flexShrink: 0 }} />
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <Eye size={13} style={{ color: "#4a6a9c" }} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <Download size={13} style={{ color: "#4a6a9c" }} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
            <Trash2 size={13} style={{ color: "#4a6a9c" }} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: "rgba(9,20,34,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      whileHover={{
        y: -4,
        borderColor: `${drawing.color}30`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${drawing.color}15`,
        transition: { duration: 0.2 },
      }}
    >
      {/* Art preview */}
      <div
        className="relative h-44 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${drawing.color}18 0%, ${drawing.color}08 100%)`,
        }}
      >
        <span className="text-6xl select-none" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}>
          {drawing.emoji}
        </span>

        {/* Overlay on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(5,12,24,0.7)", backdropFilter: "blur(4px)" }}
        >
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: "rgba(0,212,255,0.15)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.3)" }}
          >
            <Eye size={12} /> Preview
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: "rgba(255,255,255,0.06)", color: "#7b96c2", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Download size={12} /> Export
          </button>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={status.cls}>{status.label}</span>
        </div>

        {/* Shared */}
        {drawing.shared && (
          <div className="absolute top-3 right-3">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.25)" }}
            >
              <Share2 size={11} style={{ color: "#00d4ff" }} />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p style={{ fontSize: "14px", color: "#e8f0fe", fontWeight: 600 }}>
            {drawing.title}
          </p>
          <span
            style={{
              fontSize: "11px",
              color: drawing.color,
              background: `${drawing.color}12`,
              padding: "1px 6px",
              borderRadius: "5px",
              border: `1px solid ${drawing.color}20`,
              flexShrink: 0,
            }}
          >
            {drawing.experience}
          </span>
        </div>

        <p style={{ fontSize: "12px", color: "#4a6a9c" }}>
          {drawing.author}, {drawing.authorAge} ans
        </p>

        <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-1">
            <MapPin size={10} style={{ color: "#2d4a6e" }} />
            <span style={{ fontSize: "11px", color: "#4a6a9c", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {drawing.location.split(",")[0]}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Clock size={10} style={{ color: "#2d4a6e" }} />
            <span style={{ fontSize: "11px", color: "#4a6a9c" }}>{drawing.duration}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DrawingsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = drawings.filter((d) => {
    const matchFilter =
      activeFilter === "All" ||
      (activeFilter === "Shared" && d.shared) ||
      d.status === activeFilter.toLowerCase();
    const matchSearch =
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.author.toLowerCase().includes(search.toLowerCase()) ||
      d.experience.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <DashboardLayout>
      <Header title="Drawings" subtitle={`${drawings.length.toLocaleString()} drawings total`} />

      <div className="flex-1 p-8 space-y-6">
        {/* Summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total drawings", value: "18,742", color: "#00d4ff", icon: PenTool },
            { label: "Published", value: "16,840", color: "#10b981", icon: CheckCircle },
            { label: "Pending review", value: "1,620", color: "#f59e0b", icon: AlertCircle },
            { label: "Flagged", value: "282", color: "#ef4444", icon: Flag },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{
                background: "rgba(9,20,34,0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}
              >
                <s.icon size={16} style={{ color: s.color }} strokeWidth={1.75} />
              </div>
              <div>
                <p style={{ fontSize: "18px", color: "#e8f0fe", fontWeight: 700 }}>{s.value}</p>
                <p style={{ fontSize: "11px", color: "#4a6a9c" }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4a6a9c", pointerEvents: "none" }} />
            <input
              type="text"
              placeholder="Search drawings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "34px",
                paddingRight: "12px",
                paddingTop: "9px",
                paddingBottom: "9px",
                background: "rgba(9,20,34,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "10px",
                fontSize: "13px",
                color: "#e8f0fe",
                outline: "none",
              }}
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(9,20,34,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: activeFilter === f ? "rgba(0,212,255,0.12)" : "transparent",
                  color: activeFilter === f ? "#00d4ff" : "#4a6a9c",
                  border: activeFilter === f ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort */}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
            style={{
              background: "rgba(9,20,34,0.8)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#4a6a9c",
            }}
          >
            <SortAsc size={13} /> Sort: Recent
          </button>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl ml-auto" style={{ background: "rgba(9,20,34,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <button
              onClick={() => setView("grid")}
              className="p-1.5 rounded-lg transition-all"
              style={{
                background: view === "grid" ? "rgba(0,212,255,0.12)" : "transparent",
                color: view === "grid" ? "#00d4ff" : "#4a6a9c",
              }}
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setView("list")}
              className="p-1.5 rounded-lg transition-all"
              style={{
                background: view === "list" ? "rgba(0,212,255,0.12)" : "transparent",
                color: view === "list" ? "#00d4ff" : "#4a6a9c",
              }}
            >
              <List size={14} />
            </button>
          </div>
        </div>

        {/* Results count */}
        <p style={{ fontSize: "13px", color: "#4a6a9c" }}>
          Showing <span style={{ color: "#e8f0fe", fontWeight: 600 }}>{filtered.length}</span> drawings
          {activeFilter !== "All" && ` · ${activeFilter}`}
          {search && ` · "${search}"`}
        </p>

        {/* Gallery */}
        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.map((d) => (
                <DrawingCard key={d.id} drawing={d} view="grid" />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filtered.map((d) => (
                <DrawingCard key={d.id} drawing={d} view="list" />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
              style={{ background: "rgba(9,20,34,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              🎨
            </div>
            <p style={{ fontSize: "16px", color: "#e8f0fe", fontWeight: 600 }}>No drawings found</p>
            <p style={{ fontSize: "13px", color: "#4a6a9c", marginTop: "6px" }}>
              Try adjusting your filters or search query
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
