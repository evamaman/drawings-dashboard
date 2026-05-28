"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import {
  Palette,
  Shield,
  Monitor,
  User,
  Bell,
  Key,
  Globe,
  Zap,
  ChevronRight,
  Check,
  Save,
} from "lucide-react";

const accentColors = [
  { name: "Cyan", value: "#00d4ff" },
  { name: "Teal", value: "#00c9a7" },
  { name: "Indigo", value: "#818cf8" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
];

const sections = [
  { id: "branding", label: "Branding", icon: Palette },
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "permissions", label: "Permissions", icon: Shield },
  { id: "installations", label: "Installations", icon: Monitor },
  { id: "api", label: "API & Integrations", icon: Key },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
      style={{
        background: enabled ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.08)",
        border: enabled ? "1px solid rgba(0,212,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full"
        animate={{ left: enabled ? "calc(100% - 22px)" : "2px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ background: enabled ? "#00d4ff" : "#4a6a9c" }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("branding");
  const [accentColor, setAccentColor] = useState("#00d4ff");
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    emailAlerts: true,
    slackAlerts: false,
    moderationAlerts: true,
    offlineAlerts: true,
    weeklyReport: true,
    autoModeration: false,
    shareByDefault: false,
    publicGallery: true,
    apiAccess: true,
    webhooks: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "branding":
        return (
          <div className="space-y-6">
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
                Dashboard Theme
              </h4>
              <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "16px" }}>
                Customize the visual style of your dashboard
              </p>

              <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <p style={{ fontSize: "13px", color: "#7b96c2", marginBottom: "12px" }}>Color Mode</p>
                <div className="flex gap-3">
                  {[
                    { label: "Dark", active: true },
                    { label: "Darker", active: false },
                    { label: "Midnight", active: false },
                  ].map((m) => (
                    <button
                      key={m.label}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: m.active ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.03)",
                        border: m.active ? "1px solid rgba(0,212,255,0.25)" : "1px solid rgba(255,255,255,0.06)",
                        color: m.active ? "#00d4ff" : "#4a6a9c",
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <p style={{ fontSize: "13px", color: "#7b96c2", marginBottom: "12px" }}>Accent Color</p>
                <div className="flex gap-3">
                  {accentColors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setAccentColor(c.value)}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div
                        className="w-10 h-10 rounded-xl transition-all flex items-center justify-center"
                        style={{
                          background: `${c.value}25`,
                          border: accentColor === c.value ? `2px solid ${c.value}` : `1px solid ${c.value}30`,
                          boxShadow: accentColor === c.value ? `0 0 12px ${c.value}40` : "none",
                        }}
                      >
                        {accentColor === c.value && <Check size={14} style={{ color: c.value }} />}
                      </div>
                      <span style={{ fontSize: "10px", color: "#4a6a9c" }}>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
                Organization
              </h4>
              <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "16px" }}>
                Customize your organization identity
              </p>
              <div className="space-y-3">
                {[
                  { label: "Organization name", placeholder: "Wild Immersion", value: "Wild Immersion" },
                  { label: "Dashboard URL", placeholder: "drawings.wildimmersion.io", value: "drawings.wildimmersion.io" },
                ].map((f) => (
                  <div key={f.label}>
                    <label style={{ fontSize: "12px", color: "#7b96c2", display: "block", marginBottom: "6px" }}>
                      {f.label}
                    </label>
                    <input
                      defaultValue={f.value}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "10px",
                        fontSize: "13px",
                        color: "#e8f0fe",
                        outline: "none",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-3">
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
              Alert Preferences
            </h4>
            <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "16px" }}>
              Configure how and when you receive notifications
            </p>
            {[
              { key: "emailAlerts", label: "Email alerts", desc: "Receive critical alerts via email" },
              { key: "slackAlerts", label: "Slack notifications", desc: "Connect to Slack for team alerts" },
              { key: "moderationAlerts", label: "Moderation flags", desc: "Alert when drawings are flagged" },
              { key: "offlineAlerts", label: "Device offline alerts", desc: "Alert when an installation goes offline" },
              { key: "weeklyReport", label: "Weekly digest", desc: "Receive a weekly analytics summary" },
            ].map((n) => (
              <div
                key={n.key}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div>
                  <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}>{n.label}</p>
                  <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "2px" }}>{n.desc}</p>
                </div>
                <Toggle
                  enabled={settings[n.key as keyof typeof settings] as boolean}
                  onChange={(v) => setSettings((s) => ({ ...s, [n.key]: v }))}
                />
              </div>
            ))}
          </div>
        );

      case "permissions":
        return (
          <div className="space-y-3">
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
              Content Permissions
            </h4>
            <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "16px" }}>
              Control content moderation and sharing settings
            </p>
            {[
              { key: "autoModeration", label: "Auto-moderation", desc: "Automatically flag inappropriate content" },
              { key: "shareByDefault", label: "Share by default", desc: "Auto-share new drawings publicly" },
              { key: "publicGallery", label: "Public gallery", desc: "Allow public viewing of the drawing gallery" },
            ].map((p) => (
              <div
                key={p.key}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div>
                  <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}>{p.label}</p>
                  <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "2px" }}>{p.desc}</p>
                </div>
                <Toggle
                  enabled={settings[p.key as keyof typeof settings] as boolean}
                  onChange={(v) => setSettings((s) => ({ ...s, [p.key]: v }))}
                />
              </div>
            ))}
          </div>
        );

      case "api":
        return (
          <div className="space-y-6">
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#e8f0fe", marginBottom: "4px" }}>
                API Access
              </h4>
              <p style={{ fontSize: "12px", color: "#4a6a9c", marginBottom: "16px" }}>
                Manage API keys and integrations
              </p>
              <div
                className="p-4 rounded-xl flex items-center justify-between"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div>
                  <p style={{ fontSize: "13px", color: "#e8f0fe", fontWeight: 500 }}>API Access</p>
                  <p style={{ fontSize: "12px", color: "#4a6a9c", marginTop: "2px" }}>
                    Enable REST API for external integrations
                  </p>
                </div>
                <Toggle
                  enabled={settings.apiAccess}
                  onChange={(v) => setSettings((s) => ({ ...s, apiAccess: v }))}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontSize: "13px", color: "#7b96c2" }}>API Key</p>
                <button
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{ background: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)" }}
                >
                  Rotate
                </button>
              </div>
              <div
                className="flex items-center gap-2 p-3 rounded-lg"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <code style={{ fontSize: "12px", color: "#4a6a9c", fontFamily: "monospace", flex: 1 }}>
                  wi_sk_••••••••••••••••••••••••••••••••••••••••
                </code>
              </div>
              <p style={{ fontSize: "11px", color: "#2d4a6e", marginTop: "6px" }}>
                Last rotated: April 12, 2026
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl"
              style={{ background: "rgba(9,20,34,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              ⚙️
            </div>
            <p style={{ fontSize: "15px", color: "#e8f0fe", fontWeight: 600 }}>
              {sections.find((s) => s.id === activeSection)?.label} Settings
            </p>
            <p style={{ fontSize: "13px", color: "#4a6a9c", marginTop: "6px" }}>
              Configuration coming soon
            </p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <Header title="Settings" subtitle="Manage your dashboard configuration" />

      <div className="flex-1 p-8">
        <div className="flex gap-6 h-full">
          {/* Sidebar */}
          <div
            className="w-56 flex-shrink-0 rounded-2xl p-3"
            style={{
              background: "rgba(9,20,34,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
              height: "fit-content",
            }}
          >
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5"
                  style={{
                    background: active ? "rgba(0,212,255,0.08)" : "transparent",
                    color: active ? "#00d4ff" : "#7b96c2",
                    border: active ? "1px solid rgba(0,212,255,0.15)" : "1px solid transparent",
                    textAlign: "left",
                  }}
                >
                  <Icon size={15} strokeWidth={active ? 2 : 1.75} />
                  {s.label}
                  <ChevronRight size={12} className="ml-auto" style={{ opacity: active ? 1 : 0 }} />
                </button>
              );
            })}
          </div>

          {/* Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 rounded-2xl p-6"
            style={{
              background: "rgba(9,20,34,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {renderSection()}

            {/* Save button */}
            <div className="mt-8 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: saved ? "rgba(16,185,129,0.15)" : "rgba(0,212,255,0.15)",
                  color: saved ? "#10b981" : "#00d4ff",
                  border: `1px solid ${saved ? "rgba(16,185,129,0.3)" : "rgba(0,212,255,0.3)"}`,
                }}
              >
                {saved ? <Check size={14} /> : <Save size={14} />}
                {saved ? "Saved!" : "Save changes"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
