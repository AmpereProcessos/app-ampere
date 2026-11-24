---
version: 1
slug: "components-blocosinfoprojeto-infosistemablock-tsx"
primary_target: "components/blocosInfoProjeto/InfoSistemaBlock.tsx"
related_targets: ["components/blocosInfoProjeto/Utils/ProjectEquipmentSection.tsx","components/blocosInfoProjeto/Utils/ProjectProductsSpreadsheet.tsx","components/blocosInfoProjeto/InfoOeMBlock.tsx"]
---

# Sistema e equipamentos

Mode: Operate. Both backoffice editors and O&M readers use this project section. Preserve historical system fields and existing service-order snapshots. No database migration or design-system rewrite in this change.

## Direction contract

THESIS: Show client-owned equipment and this project's sales as two visible sibling groups; never mix their totals or hide either behind tabs.

OWN-WORLD: Inherit Ampère's Raleway, blue actions, neutral surfaces, restrained hairline tables, and amber only for a real review need. Avoid nested metric cards and disabled-looking summaries.

STORY: Read each group's equipment and quantities, edit in place, or explicitly reclassify a row. Historical records remain useful before anyone details their products.

FIRST VIEWPORT: System heading and independent topology, followed by client equipment and sales groups, each with a compact text summary, source caption, and contextual edit/add action. Desktop keeps editable cells; mobile starts with compact expandable rows. Legacy fields open inline only when needed.

FORM: seed: none (pinned). User approved “dois grupos explícitos, resumo legível e edição junto da fonte do dado”, with both audiences equally important and existing/sold equipment kept separate.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

States: read-only permissions, edit mode, empty groups, partial legacy data, mixed origins, reclassification, keyboard and touch. Missing data says “Não informado”; no required migration or fabricated zero. A live regrouping is the signature interaction. Save continues through the project's existing save action.

## Implementation evidence

Ordinary extension: incumbent DESIGN.md and tokens preserved. Actual React component rendered with production CSS in isolated fixtures at 1440px and 390px; mixed, historical, empty, read-only, and partial historical records checked. The fixture uses system-ui as a font fallback; the application continues to inherit Raleway. Headless interaction checks passed for edit/add, cancel/confirm classification, inherited origin, and historical editing. 39 Node regression tests passed. The global typecheck still reports errors outside the changed feature files.

Independent finish review: initial material finding was loss of partial historical data. Verdict pass scored isolated power, inverter text with/without numbers, and source caption resolved in both sizes; disposition ship at the component/fixture scope. The complete authenticated project modal has not been visually verified. No new shipping raster assets or global design-system changes.
