import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import LandingPage from "@/app/page"

describe("LandingPage", () => {
  it("renders the hero heading", () => {
    render(<LandingPage />)
    expect(screen.getByText("before")).toBeInTheDocument()
  })

  it("renders sign in and get started links", () => {
    render(<LandingPage />)
    expect(screen.getAllByText("Sign in").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Get started").length).toBeGreaterThan(0)
  })

  it("renders features section", () => {
    render(<LandingPage />)
    expect(screen.getByText("14-Day Demand Radar")).toBeInTheDocument()
    expect(screen.getByText("Auto Procurement")).toBeInTheDocument()
    expect(screen.getByText("AI Operations Agent")).toBeInTheDocument()
  })

  it("renders social proof section", () => {
    render(<LandingPage />)
    expect(screen.getByText(/Operations teams across East Africa/)).toBeInTheDocument()
  })

  it("renders stat numbers in feature cards", () => {
    render(<LandingPage />)
    expect(screen.getAllByText("94%").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("73%").length).toBeGreaterThanOrEqual(1)
  })

  it("renders integrations section", () => {
    render(<LandingPage />)
    expect(screen.getByText(/Works with what you already have/)).toBeInTheDocument()
    expect(screen.getByText(/12\+/)).toBeInTheDocument()
  })

  it("renders testimonials", () => {
    render(<LandingPage />)
    expect(screen.getByText(/Sarah Chen/)).toBeInTheDocument()
    expect(screen.getByText(/James Omondi/)).toBeInTheDocument()
  })

  it("renders CTA section", () => {
    render(<LandingPage />)
    expect(screen.getByText("Ready to see what is coming?")).toBeInTheDocument()
  })

  it("renders footer", () => {
    render(<LandingPage />)
    expect(screen.getByText(/2026 Ona Analytics/)).toBeInTheDocument()
  })
})
