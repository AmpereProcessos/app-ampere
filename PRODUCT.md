# Product

## Register

product

## Users

Internal operations platform for **Ampère Energias**, a solar energy company. Two primary audiences share one app:

- **Back-office staff** across departments (comercial, financeiro, projetos, obras, almoxarifado, OEM/monitoramento, ordens de serviço, RH, suprimentos). They live in the app for hours, working dense tables, forms, reports, approvals, and financial audits.
- **Field technicians / installers** who use it on-site or mobile for service orders, inspections, and vehicle/property usage flows.

There is also a set of public-facing surfaces (client proposals, calculators, journey pages, intake forms), but the core register is the internal tool.

## Product Purpose

A single operations backbone that runs the business end to end: commercial pipeline, project engineering and homologation, works management, inventory/warehouse, OEM monitoring, service orders, finance and audit. Success is throughput and trust: staff move through high-volume workflows quickly, and money-critical flows (finance, audit, commissions) are legible enough to be relied on without second-guessing.

## Brand Personality

Efficient, calm, trustworthy. Tool-like and information-dense for power users, without anxiety in the finance-heavy areas. Carries a real **Ampère Energias** identity rather than neutral shadcn defaults.

Brand colors, in order of priority: `#15599a` (blue), `#fead41` (orange/amber), `#ffffff` (white), `#000000` (black). Blue is the anchor; amber is the energetic secondary/highlight.

## Anti-references

- **Not generic AI / stock-shadcn-default**: avoid the zinc-neutral + single-blue-button template every admin starter ships with.
- **Not dated enterprise / SAP**: avoid heavy legacy-ERP clutter, cramped gray toolbars, tiny icons, 2010-era density-without-hierarchy.
- Not flashy consumer-marketing polish (big gradients, hero animations) inside the work tool.

## Design Principles

1. **Throughput over decoration.** The interface serves the work. Every element earns its place by helping someone finish a task faster; ornament that slows scanning is cut.
2. **Earn trust where money lives.** Finance, audit, and commission flows get extra clarity and legibility. Numbers read cleanly, states are unambiguous, destructive actions are obvious.
3. **Brand present, not loud.** Ampère's blue-and-amber identity shows through disciplined, consistent accents, not marketing flourish. The brand is felt in the details, not shouted.
4. **One system, two hands.** The same design language serves deskbound staff on wide monitors and technicians on smaller/mobile screens. Density adapts; the system stays coherent.
5. **Respect the power user.** Daily drivers get dense data, clear focus states, and keyboard-friendly flows. No hand-holding where it would just add friction.

## Accessibility & Inclusion

- **WCAG AA contrast** for text and interactive elements in both light and dark themes.
- **Reduced-motion support**: respect `prefers-reduced-motion`; keep motion subtle and non-essential.
- **Dense-data legibility**: tables and forms must stay readable at small sizes with clear, visible focus states for keyboard and power users.
