# Compra Galápagos: correção e investigação em 15/11/2026

## Correção executada no banco configurado em DB_KEY

Compra: `6a70a7d96655bf24bf7a335d` — COMPRA ALVENARIA - CLIENTE: ED. GALÁPAGOS (FELIPE TADEU).

A compra não tem `projeto.id`. Portanto, a alocação prevista pelo sistema é uma entrada no estoque, mesmo que o título mencione um cliente.

Antes da correção, os quatro itens tinham `materialId: null`, data de alocação e quantidade alocada preenchidas. Não havia movimentações com `idCompra` ou `compra.id` apontando para essa compra, incluindo consultas por string e ObjectId.

O script `scripts/maintenance/repair-galapagos-purchase.cjs` validou descrição, unidade, quantidade e preço dos quatro itens contra os respectivos materiais, salvou um backup e executou uma transação com leitura snapshot e escrita majority:

- Tijolinho: material `6a70a6397f53c87b9e3d1403`, entrada de 200 UN a R$ 0,77.
- Cal: material `6a70a67c7f53c87b9e3d1406`, entrada de 1 UN a R$ 25,60.
- Areia: material `64d24f96ab998e916e930a0b`, entrada de 8 UN a R$ 8,00.
- Cimento: material `64d2518055751645a4ccfc3b`, entrada de 50 KG a R$ 0,90. O fator de conversão de 50 foi preservado; não foi multiplicado novamente.

Foram restaurados os vínculos e criadas quatro movimentações ENTRADA, com identificação de manutenção via script autorizada pelo usuário. A data da entrega de 13/11/2026 foi preservada; a data de inserção das movimentações é a data real da manutenção. Os preços médios foram recalculados pela mesma fórmula da API.

A leitura posterior confirmou que a soma das entradas de cada material coincide com a quantidade comprada. Uma nova simulação calculou ajuste zero nos quatro itens, verificando que uma repetição não adicionaria as quantidades novamente.

Backup da execução aplicada: `C:/Users/decsa/AppData/Local/Temp/ampere-galapagos-jHI8a5/` (`before.json`, `after.json`, `result.json`). Cópia persistente em `C:/Users/decsa/.t3/userdata/artifacts/ampere-galapagos-2026-11-15/`.

## Por que os vínculos podem virar null

### Rotina antiga de manutenção: mecanismo confirmado, execução histórica não confirmada

O checkout atual contém `/api/manual-updates/fix-purchase-composition-items`, que:

1. Lê todas as compras, sem limitar por compra ou data.
2. Reescreve a composição completa usando uma lista fixa de equivalências por descrição.
3. Executa `materialId: equivalentMaterial?._id.toString()` mesmo quando não encontrou equivalência, apagando inclusive vínculos válidos.
4. Grava `undefined`, serializado como `null` pelo driver MongoDB com `ignoreUndefined: false`.

A conversão foi reproduzida localmente com `bson.serialize({ materialId: undefined }, { ignoreUndefined: false })`. A rotina HTTP não foi invocada durante esta investigação, pois o GET antigo altera dados. O wrapper `apiHandler` não autentica automaticamente; esse handler também não chama a autenticação.

Após a correção desta compra, a auditoria somente de leitura encontrou 6.008 itens com null explícito em 1.347 das 1.554 compras. Todos os 6.008 caem no ramo sem equivalência da rotina antiga contra o catálogo atual. Isso é compatível com uma reescrita em massa, mas não prova uma chamada da rotina, seu autor ou sua data. O cadastro e as descrições também podem ter mudado desde a execução. Datas de criação de compras não são datas da perda dos vínculos.

Os 13 kits salvos têm materialId preenchido em todos os itens. A exclusão de materiais bloqueia hard delete com dependências e a mesclagem substitui IDs pelo material de destino; esses caminhos não explicam a gravação de null observada.

### Formulários antigos podem desfazer reparos

`ControlPurchaseControl.tsx` envia `changes: infoHolder`, incluindo a composição inteira. A API PUT aceita a composição via schema parcial e executa `$set: { ...changes }`, sem versão ou proteção contra perda de vínculos. Assim, um formulário aberto antes de uma correção pode reenviar null sobre um materialId reparado. O risco existe no código; não foi atribuída a ele uma ocorrência histórica específica.

### A validação permite itens sem vínculo

O schema aceita materialId ausente, null, vazio ou string sem formato de ObjectId. O editor de item permite desvincular e chama `handleUpdate(itemHolder)` sem repetir a validação de material selecionado existente na inclusão de novos itens. Importações de kits e suprimentos também confiam nos dados de origem.

### Alocação preenchida não comprova movimentação

No estoque, o fluxo UPDATING calcula `item.qtde - item.qtdeAlocada`. Quando o item tem data/quantidade de alocação, mas não há histórico, o resultado pode ser zero e o update do log inexistente não insere uma entrada. Por isso, restaurar apenas materialId não basta. A correção desta compra reconciliou entradas efetivamente existentes.

## Correção anterior encontrada no Git

O checkout é `main`, dois commits atrás da referência local `origin/main`. Essa referência contém `30b30bd4e71099631c282cc20220dd847dc19139`, de 05/11/2026, que desativa a rotina com HTTP 410 e inclui investigação anterior e testes. O commit não faz parte do HEAD deste checkout. As referências remotas locais foram inspecionadas sem fetch; nenhuma versão publicada foi verificada e não se presume que esse commit esteja em produção.

## Próximas medidas recomendadas

1. Confirmar a versão publicada e garantir que a rotina destrutiva esteja desativada.
2. Impedir perda silenciosa de materialId e salvamentos com composição desatualizada na API, preservando a possibilidade de editar campos não relacionados em compras legadas.
3. Validar material selecionado e existência no catálogo nas inclusões, substituições e importações.
4. Reconciliar estoque pelo histórico efetivo, sem confiar apenas em qtdeAlocada.
5. Auditar as demais compras separadamente: nomes podem ser duplicados e entradas podem ter ocorrido por outros fluxos. Não aplicar reposição de estoque em massa com base apenas em null.

Somente a compra Galápagos indicada foi alterada. Não houve mudanças no código da aplicação, checkout de commits, push ou deploy nesta investigação.
