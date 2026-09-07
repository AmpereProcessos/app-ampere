# Project update automations

The POST handler saves and audits the requested changes, then calls
`runProjectUpdateAutomations` with the previous and saved project snapshots.
The PUT endpoint continues to apply raw MongoDB operations without these automations.

Execution stays sequential so failures do not start effects that previously would
have been skipped. Helpers share the saved snapshot instead of rereading the project.

| Module | Trigger and effect |
| --- | --- |
| `service-orders.ts` | Submitted keys listed in `rules.ts` refresh a linked service order. A submitted, nonempty signature date creates an assembly order for the four configured service types when no order is linked. |
| `build-service-order.ts` | Builds the initial assembly order, including project, equipment, location, and author metadata. No I/O. |
| `commissions.ts` | A submitted purchase-payment date sets the commission reference for assembly service types; a submitted signature date sets it for other types. Clearing the source date clears the reference. |
| `contract-status.ts` | Entering ASSINADO notifies finance, marks the CRM opportunity won, and initializes insurance or O&M coverage for 365 days. Entering RESCISÃO DE CONTRATO notifies finance and marks the opportunity lost. Leaving ASSINADO for another status clears CRM win/loss without email. |
| `index.ts` | Runs the above in order, then awaits best-effort journey tracking. |

Date and synchronization triggers preserve exact dotted request keys. Replacing
an entire `contrato` or `compra` object does not trigger their date-based rules.
Status transitions compare persisted values and work independently of request keys.
Changing the service type alone does not recalculate commissions or coverage.

Repeated signature-date saves now retain an existing linked service order. This
guard does not guarantee uniqueness for simultaneous requests or recover an order
inserted before its project link failed. Those need transactional or idempotent
persistence. Notifications and CRM writes likewise retain the existing partial
failure behavior: the project and audit log are already saved when effects run.
The snapshot passed to later helpers excludes automation-generated project writes,
as before. Journey tracking's internal business rules remain in `lib/project-journeys/tracking.ts`.

Run isolated regression checks (database and messaging integrations are faked):

```sh
node --test lib/projects/update-automations/automations.test.cjs
```
