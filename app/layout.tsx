import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Drawings Dashboard — Wild Immersion",
  description: "Analytics dashboard for Wild Immersion Drawings",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body
        className="h-full antialiased"
        style={{ background: "#050c18", color: "#e8f0fe" }}
      >
        {children}
      </body>
    </html>
  )
}
