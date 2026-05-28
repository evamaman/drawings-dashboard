"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import ClientSidebar from "./ClientSidebar";
import CommandPalette from "@/components/search/CommandPalette";
import { ClientDetail } from "@/lib/real-data";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function ClientDashboardLayout({
  client,
  children,
}: {
  client: ClientDetail;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#050c18" }}>
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,212,255,0.06), transparent)", zIndex: 0 }} />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 40% 60% at 90% 80%, rgba(0,201,167,0.03), transparent)", zIndex: 0 }} />

      <ClientSidebar client={client} onOpenSearch={() => setPaletteOpen(true)} />

      <div className="flex flex-col flex-1 overflow-hidden relative"
        style={{ marginLeft: "var(--sidebar-width, 260px)", zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
