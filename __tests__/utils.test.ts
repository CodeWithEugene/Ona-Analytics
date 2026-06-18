import { describe, it, expect } from "vitest"

const calcChange = (current: number, previous: number): string => {
  if (previous === 0) return "0%"
  const change = ((current - previous) / previous) * 100
  const sign = change >= 0 ? "+" : ""
  return `${sign}${change.toFixed(1)}%`
}

const calcOccupancy = (booked: number, capacity: number): number => {
  if (capacity <= 0) return 0
  return Math.round((booked / capacity) * 100)
}

describe("calcChange", () => {
  it("returns positive percentage", () => {
    expect(calcChange(120, 100)).toBe("+20.0%")
  })

  it("returns negative percentage", () => {
    expect(calcChange(80, 100)).toBe("-20.0%")
  })

  it("returns 0% when previous is 0 (no division by zero)", () => {
    expect(calcChange(100, 0)).toBe("0%")
  })

  it("returns +0.0% when both are equal and non-zero", () => {
    expect(calcChange(50, 50)).toBe("+0.0%")
  })
})

describe("calcOccupancy", () => {
  it("returns correct percentage", () => {
    expect(calcOccupancy(50, 100)).toBe(50)
  })

  it("returns 0 when capacity is 0 (no division by zero)", () => {
    expect(calcOccupancy(50, 0)).toBe(0)
  })

  it("returns 0 when capacity is negative", () => {
    expect(calcOccupancy(50, -10)).toBe(0)
  })

  it("returns rounded percentage", () => {
    expect(calcOccupancy(33, 100)).toBe(33)
  })
})
