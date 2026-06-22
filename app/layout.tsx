import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const display = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
})

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Ona Analytics — AI-Native Demand Radar for Safari Camps",
  description:
    "Predictive demand intelligence and supply chain optimization for remote safari camps and eco-lodges. Powered by AI.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://ona-analytics.vercel.app"),
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Ona Analytics — See the surge. Secure the supply.",
    description:
      "AI-native B2B demand radar and supply chain forecasting for remote safari camps and eco-lodges.",
    url: "https://ona-analytics.vercel.app",
    siteName: "Ona Analytics",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ona Analytics — AI-Native Demand Radar for Safari Camps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ona Analytics — AI-Native Demand Radar for Safari Camps",
    description:
      "Predictive demand intelligence and supply chain optimization for remote safari camps and eco-lodges.",
    images: ["/og-image.jpg"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider><ErrorBoundary>{children}</ErrorBoundary></AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
