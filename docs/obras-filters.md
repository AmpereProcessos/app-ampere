# Obras filters

Project states are combined with AND and use the milestone dates already embedded
in service orders. Payment means `compra.dataPagamento` (purchase payment release),
approval means `homologacao.acesso.dataResposta`, delivery means `compra.dataEntrega`,
and inspection means `homologacao.vistoria.dataEfetivacao`, matching existing Obras cards.
Orders without an associated project are excluded when any project state is selected.
Missing/null/empty milestone dates count as pending.

Execution and Planning persist independent criteria and sorting in the browser's
`obras-filters` localStorage key. Reopening starts at page one. Restoring filters
returns to the tab's defaults; Planning defaults to approved and undelivered.
Invalid saved filters fall back to defaults; unavailable storage does not block queries.

Run the idempotent preparation script with the target database credentials:

```sh
node --env-file=.env scripts/prepare-obras-filters.cjs --check
node --env-file=.env scripts/prepare-obras-filters.cjs
```

The script creates project-link and insertion-sort indexes and refreshes milestone
dates in batches of 500 projects, including all orders linked to each project.
Each order update compares its observed dates before writing, skipping orders changed
by concurrent synchronization. A final comparison against current projects verifies
the result; exit code 2 indicates remaining mismatches and calls for another check/run.
It is deliberately separate from API requests.

Executed against the configured `projetos` database: 4,062 linked service orders,
no orphaned project links, 2,918 orders with differing dates before the run, and
3,636 orders updated (including missing-date normalization to null). Final verification
found zero mismatches. The three indexes were also created successfully.

Search applies all predicates before pagination and uses native MongoDB sorting,
without a lookup or computed sort field. Count and page queries run concurrently.
Missing/null dates sort before populated dates in ascending order, reversing in descending
order. This replaces the old synthetic epoch value for absent dates.

Use `explain('executionStats')` on representative pending and Planning filters in the
target environment to check keys/documents examined and sort stages before adding
specialized milestone indexes. The default pending/insertion index supports the
common query; selective milestones and alternate sort fields may need tailored indexes
after measurement. No production query timings were collected here.
