import { Sidebar } from "./Sidebar"

type DashboardLayoutProps = {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#050c18" }}>
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
