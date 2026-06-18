import "@testing-library/jest-dom/vitest"

window.matchMedia = window.matchMedia || (() => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as unknown as (query: string) => MediaQueryList

class MockIntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ""
  readonly thresholds: ReadonlyArray<number> = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
