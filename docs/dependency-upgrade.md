# Dependency upgrade — November 2026

The application now targets Next.js 16 and React 19. Both the Pages Router and App Router remain in use.

## Framework and tooling

- Next.js 16.4.5 and React/React DOM 19.3.1, with React 19 TypeScript definitions.
- Node.js 22 or newer is required by AI SDK 7; local validation uses Node.js 24.
- `npm run dev` and `npm run build` use Turbopack. Explicit Webpack alternatives are available as `dev:webpack` and `build:webpack`.
- SVG imports use Next.js's default static image handling in both bundlers (every usage passes them to `next/image` as `src`). The old SVGR rule sat under an unrecognised `module` key and never ran, so enabling SVGR broke server rendering wherever an SVG import reached `next/image`. Obsolete Next.js configuration options were removed.
- `npm run lint` invokes the existing Oxlint installation with React and Next.js plugins. The unused ESLint configuration was removed.
- TypeScript uses bundler module resolution and the automatic JSX runtime required by Next.js 16.
- React 19 migration fixes include nullable ref types, explicit initial ref values, and an image description.
- Compatible dependency updates are recorded in the lockfile, including Tailwind 4.3.4, Radix, TanStack Query, Tiptap 3.32.2, Axios, and Firebase Admin 12.7.0.
- TanStack Query migration fixes remove a dependency on its internal `Optional` utility type and an unused legacy mutation-loading property.

## Kanban drag and drop

The purchase control, engineering, service order, and after-sales boards use `@dnd-kit/core` 6.3.1, matching `recompracrm`. `react-beautiful-dnd` and its type package were removed.

`components/kanban/Board.tsx` shares the sensor, accessibility, column, card, and overlay behavior. Existing status mutations, status timestamps, optimistic updates, and card contents remain in the individual boards. Within-column ordering is not persisted, matching the existing behavior.

- Mouse dragging activates after six pixels of movement.
- Touch dragging activates after a 250 ms long press; moving before activation allows scrolling.
- Keyboard users focus a card, press Space or Enter, choose a column with Left/Right, and confirm with Space or Enter. Escape cancels.
- Empty columns accept drops. Releases outside the board and drops in the original column do not trigger status mutations.
- Embedded controls retain their normal click and keyboard behavior.
- The dragged card is rendered in a portal to avoid clipping by scroll containers.

Run the DOM interaction regression tests with `npm run test:kanban`. They cover mouse, keyboard, touch, cancellation, empty columns, and embedded controls.

## Convex and deprecated chat removal

Convex, its workflow/helpers packages, generated functions, React provider, HTTP client, image host, and local environment keys were removed. The deprecated chat pages, navigation links, chat components, AI chat responder, messaging APIs, repositories, hooks, schemas, and chat webhook parsers were also removed. Unused chat dependencies `@ai-sdk/react` and `socket.io` were removed.

WhatsApp functionality used outside chat remains:

- OAuth callbacks save connections to the existing MongoDB `integracoes` collection. The connection settings use its existing GET/DELETE API, and access tokens remain server-side.
- The webhook still verifies subscriptions and updates template status, quality, and category in MongoDB. Deprecated chat events are acknowledged without processing.
- Project-journey template messages use the existing direct WhatsApp sender. Existing sender and recipient configuration is preserved; no chat records are created.

Connections stored only in the former backend need to be reconnected from WhatsApp settings. Remote deployment data was not accessed or deleted. Remove obsolete deployment environment variables and decommission the old cloud deployment separately when its records are no longer needed.

## Novu and AI SDK

- `ai` 7.0.162 and `@ai-sdk/openai` 4.0.108.
- `@novu/api` 3.19.1, `@novu/framework` 2.14.0, and `@novu/nextjs` / `@novu/react` 3.19.2.
- Financial PDF extraction and reconciliation use `generateText`, `Output.object`, and top-level `instructions`. Their response schemas and server-assigned line IDs are preserved.
- Inbox appearance uses the public component prop type instead of an internal package path. Existing workflow identifiers and subscriber IDs remain unchanged.

See the [AI SDK 7 migration guide](https://ai-sdk.dev/docs/migration-guides/migration-guide-7-0). Run `npm run test:integrations` for the WhatsApp and SDK contract regression tests. SDK requests are mocked; these tests do not send real notifications or make paid model calls.

## Separate migrations

Independent major upgrades such as MongoDB, Firebase, Zod, Recharts 3, and react-window 2 remain separate work. Recharts 2.15.4 and react-window 1.8.11 provide React 19 compatibility while retaining their existing APIs.

## Validation limits

Clean installation with `npm ci` and the final production build passed, as did all 78 regression tests (61 existing, seven Kanban, and ten WhatsApp/SDK tests). Lint reports warnings but no errors. The final lockfile also passes `npm ci --dry-run` validation.

The development server is available on port 3000; an HTTP smoke check of `/auth/signin` returned 200 after installation.

The original dependency-upgrade baseline had 172 type-check errors. The Convex-removal/SDK-upgrade baseline had 170; afterward it has 168, with no new diagnostic messages compared with that baseline. `typescript.ignoreBuildErrors` remains enabled, so the production build is not a substitute for `npm run typecheck`.

The DOM interaction tests exercise drag-and-drop events and mutations without a running application. Authenticated browser acceptance testing of the real boards remains a separate deployment check.
