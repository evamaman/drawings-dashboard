"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import { exportHistory } from "@/lib/mock-data";
import {
  Download,
  FileText,
  Image,
  Archive,
  Plus,
  Clock,
  CheckCircle,
  Loader2,
  HardDrive,
  Database,
  Package,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

const typeConfig = {
  csv: { label: "CSV", color: "#00d4ff", icon: Database },
  pdf: { label: "PDF", color: "#818cf8", icon: FileText },
  zip: { label: "ZIP", color: "#f59e0b", icon: Archive },
};

const exportOptions = [
  {
    id: "drawings-csv",
    title: "All Drawings",
    description: "Complete drawing dataset with metadata",
    format: "CSV",
    icon: Database,
    color: "#00d4ff",
    estimatedSize: "~2.4 MB",
    rows: "18,742 rows",
  },
  {
    id: "sessions-csv",
    title: "User Sessions",
    description: "Session data with engagement metrics",
    format: "CSV",
    icon: Database,
    color: "#00c9a7",
    estimatedSize: "~8.1 MB",
    rows: "94,310 rows",
  },
  {
    id: "analytics-pdf",
    title: "Analytics Report",
    description: "Full monthly analytics PDF report",
    format: "PDF",
    icon: FileText,
    color: "#818cf8",
    estimatedSize: "~1.2 MB",
    rows: "15 pages",
  },
  {
    id: "drawings-images",
    title: "Drawing Images",
    description: "All drawing images as PNG archive",
    format: "ZIP",
    icon: Archive,
    color: "#f59e0b",
    estimatedSize: "~142 MB",
    rows: "18,742 files",
  },
];

export default function ExportPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => setGenerating(null), 2800);
  };

  return (
    <DashboardLayout>
      <Header title="Export & Media" subtitle="Download data, reports and drawing archives" />

      <div className="flex-1 p-8 space-y-8">
        {/* Storage overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total storage used", value: "18.4 GB", icon: HardDrive, color: "#00d4ff", pct: 36.8 },
            { label: "Drawing images", value: "16.2 GB", icon: Image, color: "#00c9a7", pct: 32.4 },
            { label: "Exports generated", value: "42", icon: Package, color: "#818cf8", pct: null },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="p-5 rounded-2xl"
              style={{
                background: "rgba(9,20,34,0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}
                >
                  <s.icon size={16} style={{ color: s.color }} strokeWidth={1.75} />
                </div>
                <div>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "#e8f0fe" }}>{s.value}</p>
                  <p style={{ fontSize: "11px", color: "#4a6a9c" }}>{s.label}</p>
                </div>
              </div>
              {s.pct !== null && (
                <>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: s.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    />
                  </div>
                  <p style={{ fontSize: "11px", color: "#4a6a9c", marginTop: "4px" }}>
                    {s.pct}% of 50 GB quota
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Generate new export */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(9,20,34,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe" }}>
                Generate Export
              </h3>
              <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "2px" }}>
                Create a new export package
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {exportOptions.map((opt, i) => (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 + 0.25 }}
                className="p-4 rounded-xl group cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "all 0.2s",
                }}
                whileHover={{
                  background: `${opt.color}08`,
                  borderColor: `${opt.color}20`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${opt.color}15`, border: `1px solid ${opt.color}25` }}
                >
                  <opt.icon size={17} style={{ color: opt.color }} strokeWidth={1.75} />
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#e8f0fe" }}>{opt.title}</h4>
                <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "3px", marginBottom: "12px" }}>
                  {opt.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    style={{
                      fontSize: "11px",
                      color: opt.color,
                      background: `${opt.color}12`,
                      padding: "2px 7px",
                      borderRadius: "5px",
                      border: `1px solid ${opt.color}20`,
                    }}
                  >
                    {opt.format}
                  </span>
                  <span style={{ fontSize: "11px", color: "#4a6a9c" }}>{opt.estimatedSize}</span>
                </div>
                <p style={{ fontSize: "11px", color: "#2d4a6e" }}>{opt.rows}</p>
                <button
                  onClick={() => handleGenerate(opt.id)}
                  disabled={generating === opt.id}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: generating === opt.id ? `${opt.color}10` : `${opt.color}15`,
                    color: opt.color,
                    border: `1px solid ${opt.color}25`,
                  }}
                >
                  {generating === opt.id ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Generating…
                    </>
                  ) : (
                    <>
                      <Plus size={12} /> Generate
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Export history */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(9,20,34,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
            Export History
          </h3>
          <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "20px" }}>
            Recent exports & downloads
          </p>

          <div className="space-y-2">
            {exportHistory.map((item, i) => {
              const cfg = typeConfig[item.type as keyof typeof typeConfig];
              const TypeIcon = cfg.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.4 }}
                  className="flex items-center gap-4 p-4 rounded-xl group cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    transition: "all 0.15s",
                  }}
                  whileHover={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}20` }}
                  >
                    <TypeIcon size={15} style={{ color: cfg.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}>{item.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className={`badge-${cfg.color === "#00d4ff" ? "cyan" : cfg.color === "#818cf8" ? "neutral" : "warning"}`}>
                        {cfg.label}
                      </span>
                      {item.rows > 0 && (
                        <span style={{ fontSize: "11px", color: "#4a6a9c" }}>
                          {item.rows.toLocaleString()} rows
                        </span>
                      )}
                      <span style={{ fontSize: "11px", color: "#4a6a9c" }}>{item.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Clock size={11} style={{ color: "#2d4a6e" }} />
                    <span style={{ fontSize: "11px", color: "#4a6a9c" }}>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div className="flex-shrink-0">
                    {item.status === "ready" ? (
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all opacity-0 group-hover:opacity-100"
                        style={{
                          background: "rgba(0,212,255,0.1)",
                          color: "#00d4ff",
                          border: "1px solid rgba(0,212,255,0.2)",
                        }}
                      >
                        <Download size={11} /> Download
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Loader2 size={13} style={{ color: "#f59e0b" }} className="animate-spin" />
                        <span style={{ fontSize: "12px", color: "#f59e0b" }}>Generating</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
