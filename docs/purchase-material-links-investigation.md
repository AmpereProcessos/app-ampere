# Purchase material link investigation — November 5, 2026

## Disabled maintenance endpoint

`/api/manual-updates/fix-purchase-composition-items` now returns HTTP 410 for every method, with `Cache-Control: no-store`. It has no runtime imports or database operations. This change takes effect after deployment.

The retired handler read all purchases and replaced every composition array. Its hard-coded mapping covered 32 descriptions. When a description or catalog equivalent was absent, it assigned `materialId: undefined`, overwriting any existing ID. MongoDB's configured default `ignoreUndefined: false` serializes that field as null. This was reproduced locally with mocked collections and the actual old handler; the production endpoint was not invoked.

The pre-backfill snapshot contained 1,037 missing references. Every one of those names falls into the old handler's no-match branch against the current catalog. This is consistent with a bulk overwrite, but does not prove an invocation. The supplied production logs contain no request for this endpoint. Request history would be needed to establish who or what invoked it and when. Purchase creation timestamps are not mutation timestamps.

## Remaining ways to lose or omit a reference

1. **Whole-purchase writes can overwrite repaired links.** `ControlPurchaseControl.tsx` submits `changes: infoHolder`, including the whole composition. The PUT handler validates with `GeneralPurchaseControlSchema.partial()` and writes `$set: { ...changes }`, without a version or reference-loss check. A local reproduction using the actual schema and handler accepted a null incoming reference over an existing valid ID, returned 201, and retained the null. Database collections were mocked. A stale form opened before the backfill can therefore restore old null IDs during an unrelated edit.
2. **The schema permits invalid references.** `PurchaseCompositionItemSchema.materialId` is an optional, nullable string without an ObjectId constraint. Null, omission, empty strings, and invalid ID strings all pass. The composition-kit schema inherits this field. No catalog-existence validation is performed for incoming composition references.
3. **Edit controls do not repeat the add-item guard.** New purchase and kit items require a selected material. Their existing-item editors can unlink a material and then call `handleUpdate(itemHolder)` without checking the ID. The technical-analysis supply editor has the same omission.
4. **Import controls trust their source.** Composition kits are copied directly into purchases. Technical-analysis supply items copy `idMaterial` into purchase `materialId` without validating it. This allows legacy unlinked items to propagate, although the audited source records currently have complete links.
5. **Creating a catalog item is not selecting it.** The material selector's inline creation menu creates a catalog document and refreshes search results, but does not call the selection callback. The user must select the new result. The add-item guard currently prevents adding an unselected purchase item through that normal path.

## Sources checked

- The material selector's selection callback forwards the selected catalog `_id` correctly. No automatic ID-clearing behavior was found when search results refresh; unlinking explicitly calls the parent callback.
- All 13 saved purchase composition kits had references on their 116 items.
- The recent technical-analysis audit (created from August 7 through November 5) found references on all 510 supply items across 168 analyses.
- Material merges replace purchase references with the target material ID. Hard deletion rejects referenced materials; soft deletion retains references. These paths did not explain null IDs.
- Project-triggered purchase creation starts with an empty composition; it does not manufacture unlinked line items.
- The neighboring most-used-composition-items endpoint is read-only. No repository caller of the retired migration was found.

These are read-only source audits and local reproductions. No additional production data was changed during this investigation.

## Recommended follow-up

1. Deploy the retired endpoint before further data repairs.
2. Protect PUT requests from silently clearing existing links, and detect stale composition updates. Prefer field-specific updates or explicit optimistic concurrency rather than writing stale form snapshots wholesale.
3. Validate IDs and catalog existence for newly added or replaced material items. Preserve compatibility for unchanged legacy unlinked items, so unrelated edits do not become blocked by the remaining review backlog.
4. Apply the same material-selection guard to existing-item editors and kit/technical-analysis import actions.
5. Keep stock reconciliation separate from ID backfilling. Adding a reference does not recreate historical stock entries or project allocation movements.

Only the maintenance endpoint retirement and its regression check were implemented in this follow-up. The additional validation and editing behavior remain unchanged pending implementation.

## Validation

The retired-route regression exercises GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS and fails if any runtime dependency is imported. Run it together with purchase stock regressions using `npm run test:purchases` under the project's Node 22 runtime.
