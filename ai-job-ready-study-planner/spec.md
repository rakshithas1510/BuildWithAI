# Specification

## Summary
**Goal:** Fix the ReadinessScoreRing component so it is always visible on the Dashboard and Skill Gap pages, and harden the backend and query hook to never surface errors to the user.

**Planned changes:**
- Update the `ReadinessScoreRing` component to always render the SVG ring and score percentage, removing any error boundary or conditional path that hides the ring or shows an error message; display 0% when no data is available and a skeleton during loading.
- Audit `getReadinessScore` in `backend/main.mo` to add defensive null/empty checks so it never traps and always returns a Nat between 0 and 100 (returning 0 for missing profile, missing study plan, or empty task list).
- Update the `useGetReadinessScore` hook in `useQueries.ts` to catch any backend error and resolve as 0 instead of entering an error state, with `retry: false` to prevent repeated failure loops.

**User-visible outcome:** The readiness score ring is always visible on the Dashboard and Skill Gap pages. It shows 0% when there is no study plan or when a backend error occurs, shows a skeleton while loading, and applies the correct red/amber/green color thresholds — never showing an error message to the user.
