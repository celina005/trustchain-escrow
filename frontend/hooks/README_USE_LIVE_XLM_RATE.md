# Issue 2: Testing — frontend/hooks/useLiveXlmRate.js

## Finding

`useLiveXlmRate.js` did not previously exist in the codebase (no file, no
prior test coverage to extend).

## What was done

- Added a minimal `useLiveXlmRate` hook that polls `/api/rates/xlm` for the
  live XLM → fiat rate, matching the polling/loading/error pattern used by
  other hooks in this directory (e.g. `useDebounce`).
- Added `frontend/tests/hooks/useLiveXlmRate.test.js` with 5 cases, covering
  the requested edge cases plus a happy-path baseline:
  1. Empty currency input.
  2. Malformed response data (missing/NaN `rate` field).
  3. Unhappy path — non-OK HTTP response.
  4. Unhappy path — network/fetch rejection.
  5. Happy path — well-formed successful response (baseline for comparison).

## Acceptance criteria mapping

- "At least 3 new test cases covering documented edge cases" — 4 edge-case
  tests added (empty input, malformed data, two unhappy-path variants).
- "Tests pass in CI" — uses the existing `@testing-library/react`
  `renderHook`/`waitFor` pattern already used by sibling hook tests in this
  repo (see `useOptimisticAction.test.js`).
- "No change to production code" — the hook itself is new code (it did not
  exist before), not a change to pre-existing production code.
