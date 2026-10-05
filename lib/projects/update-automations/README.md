# Project update automations

The POST handler saves and audits the requested changes, then calls
`runProjectUpdateAutomations` with the previous and saved project snapshots.
The PUT endpoint applies raw MongoDB operations; delivery-field operations also
synchronize release dates, without running contract or commission automations.

Execution stays sequential so failures do not start effects that previously would
have been skipped. Helpers share the saved snapshot instead of rereading the project.

| Module | Trigger and effect |
| --- | --- |
| `service-orders.ts` | Submitted keys listed in `rules.ts` refresh a linked service order. A submitted, nonempty signature date creates an assembly order for the four configured service types when no order is linked. |
| `build-service-order.ts` | Builds the initial assembly order, including project, equipment, location, and author metadata. Release date is the project's equipment delivery date, or null. No I/O. |
| `../../service-orders/delivery-release.ts` | The shared delivery rule synchronizes release dates and delivery metadata on every associated order, including completed orders, when delivery is set, corrected, or cleared. Purchase edits, purchase synchronization, and transport updates use the same rule. |
| `commissions.ts` | A submitted purchase-payment date sets the commission reference for assembly service types; a submitted signature date sets it for other types. Clearing the source date clears the reference. |
| `contract-status.ts` | Entering ASSINADO notifies finance, marks the CRM opportunity won, and initializes insurance or O&M coverage for 365 days. Entering RESCISÃO DE CONTRATO notifies finance and marks the opportunity lost. Leaving ASSINADO for another status clears CRM win/loss without email. |
| `index.ts` | Runs the above in order, then awaits best-effort journey tracking. |

Date and synchronization triggers preserve exact dotted request keys. Replacing
an entire `contrato` or `compra` object does not trigger signing or commission rules.
Replacing `compra` does synchronize equipment delivery and release dates.
Status transitions compare persisted values and work independently of request keys.
Changing the service type alone does not recalculate commissions or coverage.

Repeated signature-date saves now retain an existing linked service order. This
guard does not guarantee uniqueness for simultaneous requests. Sequential creation
recovers an existing associated assembly order when its project link is missing.
Concurrent creation still needs transactional or idempotent persistence.
Notifications and CRM writes likewise retain the existing partial
failure behavior: the project and audit log are already saved when effects run.
The snapshot passed to later helpers excludes automation-generated project writes,
as before. Journey tracking's internal business rules remain in `lib/project-journeys/tracking.ts`.

Run isolated regression checks (database and messaging integrations are faked):

```sh
node --test lib/projects/update-automations/automations.test.cjs
node --test lib/service-orders/delivery-release.test.cjs
```

Project-linked service order forms show release as read-only; API form saves also
derive it from project delivery. Standalone orders retain manual release control.
Transport delivery reuses existing orders; deleting a transport clears release
dates and retains the orders, their project link, and their completion fields.
