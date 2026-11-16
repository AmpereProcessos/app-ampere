# Proteções de materiais e alocações de compras

Implementação em 15/11/2026. Não executa recuperação em massa nem modifica automaticamente compras existentes.

## Escrita e concorrência

- Criação de compras e kits exige IDs de material válidos, existentes e ativos no catálogo, além de quantidades positivas. Novas referências são verificadas no banco.
- A API mantém a edição de itens legados sem vínculo quando permanecem inalterados. Novos itens sem vínculo, alterações desses itens e perda de vínculos válidos são rejeitados.
- Cada PUT incrementa `revisao`. PUTs com composição exigem a revisão lida pelo cliente e usam uma condição de atualização para impedir gravações concorrentes. Documentos antigos começam logicamente na revisão zero, sem migração de dados.
- O GET de uma compra inclui a revisão. O cliente a reenvia com a composição. Revisão ausente ou desatualizada gera HTTP 409, com orientação para reabrir a compra.
- A sincronização de estoque e a mesclagem de materiais também incrementam a revisão. Data e quantidade alocadas dos itens são controladas pelo servidor.
- Editores de itens, kits e suprimentos exigem material selecionado; importações rejeitam itens sem vínculo.
- Produtos vendidos exigem a seleção de um material do estoque antes de serem adicionados à composição, tanto no desktop quanto no mobile.
- A rotina `/api/manual-updates/fix-purchase-composition-items` retorna HTTP 410 em todos os métodos e não importa clientes do banco.

## Alocações

- Criação de compras já entregues registra a compra e suas alocações na mesma transação.
- Alterações somente em observações ou outros campos não relacionados não disparam a reconciliação. A comparação da composição ignora a ordem das propriedades e os campos de alocação controlados pelo servidor.
- Estoque é reconciliado pela soma das movimentações ENTRADA vinculadas à compra, agrupadas por material. Data/quantidade alocadas não substituem esse histórico.
- Quantidades repetidas do mesmo material são somadas. Remoções e substituições estornam entradas anteriores. O valor de estoque e o preço médio acompanham alterações de preço e quantidade.
- Movimentações de ajuste são acrescentadas ao histórico, inclusive estornos negativos. Não se apagam as entradas anteriores. Uma segunda reconciliação não repete o ajuste.
- Movimentações legadas sem snapshots de preço usam o preço da composição anterior como referência. Isso não reconstrói preços históricos desconhecidos.
- Alocações de projeto também agrupam linhas repetidas e removem apenas as movimentações dessa compra, preservando movimentos de outras compras e alocações não relacionadas.
- A primeira entrega usa o projeto atualizado na mesma requisição. Mudar o destino de uma compra já entregue exige desfazer a entrega antes.
- Compras legadas sem movimentação não recebem estoque por uma simples edição de observações. Recuperações históricas exigem auditoria e sincronização explícita.

## Validação

- `npm run test:purchases`: 24 testes de validação, concorrência, API, reconciliação e desativação da rotina.
- `node --test lib/projects/allocations.test.cjs lib/service-orders/delivery-release.test.cjs`: 11 testes relacionados.
- Lint dos arquivos envolvidos: sem erros; há avisos existentes nos componentes.
- A checagem global de tipos continua com erros existentes. Comparação com uma cópia do HEAD original, usando as mesmas dependências e `next-env.d.ts`, não identificou novos diagnósticos por arquivo/código. Foram corrigidos dois erros existentes relativos a `purchaseControlId` nos formulários de criação.

As proteções precisam ser publicadas para valer no ambiente em uso. Clientes antigos que tentarem salvar a composição sem revisão receberão HTTP 409 e deverão recarregar a aplicação. Nenhum deploy foi feito nesta implementação.
