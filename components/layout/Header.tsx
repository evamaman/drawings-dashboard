"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Bell, RefreshCw, Calendar } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header
      className="flex-shrink-0 flex items-center justify-between px-8 py-5"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(5,12,24,0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Left: Title */}
      <div>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#e8f0fe",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "13px", color: "#4a6a9c", marginTop: "2px" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-3">
        {/* Date */}
        <div className="hidden lg:flex items-center gap-2 mr-2">
          <Calendar size={13} style={{ color: "#2d4a6e" }} />
          <span style={{ fontSize: "12px", color: "#4a6a9c" }}>{dateStr}</span>
        </div>

        {/* Search */}
        <motion.div
          className="relative flex items-center"
          animate={{ width: searchFocused ? 240 : 180 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "12px",
              color: searchFocused ? "#00d4ff" : "#4a6a9c",
              transition: "color 0.2s",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: "100%",
              paddingLeft: "32px",
              paddingRight: "12px",
              paddingTop: "8px",
              paddingBottom: "8px",
              background: searchFocused
                ? "rgba(0,212,255,0.06)"
                : "rgba(255,255,255,0.04)",
              border: searchFocused
                ? "1px solid rgba(0,212,255,0.3)"
                : "1px solid rgba(255,255,255,0.07)",
              borderRadius: "10px",
              fontSize: "13px",
              color: "#e8f0fe",
              outline: "none",
              transition: "all 0.2s",
            }}
          />
        </motion.div>

        {/* Refresh */}
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#4a6a9c",
          }}
          title="Refresh data"
        >
          <RefreshCw size={14} />
        </button>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#4a6a9c",
          }}
        >
          <Bell size={14} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{
              background: "#ef4444",
              boxShadow: "0 0 6px rgba(239,68,68,0.7)",
            }}
          />
        </button>

        {/* Extra actions passed from page */}
        {actions}
      </div>
    </header>
  );
}
