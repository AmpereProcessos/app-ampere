# Plano: custos de mão de obra nas ordens de serviço

## 1. Objetivo

Tornar a coleção de despesas o ponto de verdade dos custos de mão de obra das ordens de serviço, com:

- vínculo direto entre despesa e ordem de serviço;
- cálculo automático baseado nos dados que já são preenchidos de forma confiável;
- configurações simples por usuário ou equipe;
- memória estruturada do cálculo em `metadados`;
- distinção entre estimativa, custo confirmado, apropriação interna e serviço de terceiro;
- compatibilidade com as despesas existentes.

O modelo não dependerá de salários, encargos, benefícios ou apontamento de horas.

## 2. Evidências de uso atual

Uma consulta somente leitura ao banco, considerando as 900 ordens dos 12 meses anteriores à ordem mais recente em 15/09/2026, encontrou:

| Informação                |      Preenchimento |
| ------------------------- | -----------------: |
| Responsáveis              | 839 de 900 (93,2%) |
| Módulos e inversores      | 807 de 900 (89,7%) |
| Histórico de execução     |    2 de 900 (0,2%) |
| Exatamente um responsável | 810 de 900 (90,0%) |
| Dois ou mais responsáveis |   29 de 900 (3,2%) |

Nas 639 ordens recentes de categoria `MONTAGEM`:

- 613 possuem módulos e inversores (95,9%);
- 587 possuem responsáveis (91,9%);
- apenas 2 utilizam o histórico de execução.

Também foram encontrados:

- 73 colaboradores ativos e nenhum `salarioBase` positivo;
- 356 despesas com o identificador atual de custo de OS;
- nenhuma dessas 356 despesas com referência direta à OS;
- 757 projetos com mais de uma OS, totalizando 1.956 ordens e até 9 ordens em um único projeto.

Conclusão: categoria, responsáveis, módulos e inversores podem sustentar a automação. Salários e horas não podem.

## 3. Decisões de arquitetura

### 3.1. Despesas são o ponto de verdade

A OS não armazenará uma cópia do custo de mão de obra. A despesa vinculada à OS concentrará:

- o valor vigente em `total`;
- a composição financeira em `itens`;
- os parâmetros e a regra aplicada em `metadados`;
- a situação estimada ou confirmada em `efetivacao`;
- pagamentos, quando aplicáveis, em `pagamentos`.

Não será necessário salvar `despesaId` na OS. A consulta reversa ocorrerá por `ordemServico.id`, coberta por índice.

### 3.2. Configurações não dependem da folha

As configurações de custo serão valores operacionais diretos:

- equipe interna: custo-padrão por diária e faixas de módulos;
- terceiro: valor por módulo, valor por inversor e exceções de valor fechado;
- manual: valor informado com justificativa quando nenhuma regra for aplicável.

### 3.3. Chaves de metadados são estáveis

Será usada a chave de máquina `custo-mao-de-obra`. Textos visíveis ao usuário não serão usados como discriminantes.

Cada variante de metadados terá uma `versao`, começando em `1`, para permitir evolução futura sem reinterpretar documentos antigos.

### 3.4. Uma despesa de mão de obra por OS no MVP

O MVP terá uma única despesa com `metadados.chave = "custo-mao-de-obra"` por OS.

Esse desenho atende o fluxo dominante, no qual 90% das ordens recentes têm exatamente um responsável. Casos com mais de uma configuração aplicável exigirão a escolha de um responsável/equipe de custo ou lançamento manual.

Uma eventual versão futura poderá admitir vários cálculos dentro da mesma despesa ou várias despesas por fonte de custo, caso o uso real de equipes híbridas na mesma OS justifique a complexidade.

## 4. Configurações de custo

### 4.1. Persistência

Criar uma coleção `configuracoesCustosMaoDeObra` no banco `projetos`, junto às ordens e despesas que consomem essas configurações.

O documento terá um sujeito discriminado por usuário ou equipe:

```ts
const LaborCostSubjectSchema = z.discriminatedUnion('tipo', [
  z.object({
    tipo: z.literal('USUARIO'),
    id: z.string(),
    nome: z.string(),
  }),
  z.object({
    tipo: z.literal('EQUIPE'),
    chave: z.string(),
    nome: z.string(),
  }),
])
```

As equipes ainda são representadas principalmente por valores textuais de `equipesTecnicas`. Para o MVP, a configuração terá uma `chave` estável própria e manterá o nome apenas para exibição. A associação com valores legados deverá ser normalizada no serviço de resolução, não espalhada pelos componentes.

### 4.2. Regras suportadas

```ts
const InternalDailyRuleSchema = z.object({
  modelo: z.literal('EQUIPE_INTERNA_DIARIA'),
  valorDiaria: z.number().nonnegative(),
  faixas: z.array(
    z.object({
      minimoModulos: z.number().int().nonnegative(),
      maximoModulos: z.number().int().positive(),
      dias: z.number().positive(),
    })
  ),
})

const ExternalEquipmentRuleSchema = z.object({
  modelo: z.literal('TERCEIRO_POR_EQUIPAMENTO'),
  valorPorModulo: z.number().nonnegative(),
  valorPorInversor: z.number().nonnegative(),
  excecoes: z
    .array(
      z.object({
        quantidadeModulos: z.number().int().nonnegative(),
        valorFixo: z.number().nonnegative(),
      })
    )
    .default([]),
})

const LaborCostRuleSchema = z.discriminatedUnion('modelo', [InternalDailyRuleSchema, ExternalEquipmentRuleSchema])
```

Documento completo:

```ts
const LaborCostConfigurationSchema = z.object({
  ativo: z.boolean(),
  sujeito: LaborCostSubjectSchema,
  regra: LaborCostRuleSchema,
  autor: AuthorSchema,
  dataInsercao: z.string().datetime(),
  dataAtualizacao: z.string().datetime(),
})
```

### 4.3. Configurações iniciais

- Equipe interna:
  - R$ 560,24 por dia;
  - 2 a 8 módulos: 1 dia;
  - 9 a 16 módulos: 2 dias.
- Terceiros analisados:
  - R$ 50 por módulo;
  - R$ 50 por inversor;
  - exceções de quatro módulos conforme cada prestador.

Valores iniciais deverão ser confirmados antes de serem inseridos em produção.

## 5. Alterações no schema de despesas

### 5.1. Referência à ordem de serviço

Adicionar ao schema geral de despesas:

```ts
const ExpenseServiceOrderReferenceSchema = z.object({
  id: z.string(),
  descricao: z.string(),
})
```

```ts
ordemServico: ExpenseServiceOrderReferenceSchema.optional().nullable()
```

O campo será opcional para preservar despesas legadas, mas obrigatório por validação semântica quando `metadados.chave` for `custo-mao-de-obra`.

### 5.2. Metadados discriminados

```ts
const InternalLaborCalculationSchema = z.object({
  modelo: z.literal('equipe-interna-diaria'),
  configuracao: z.object({
    tipo: z.literal('EQUIPE'),
    chave: z.string(),
    nome: z.string(),
  }),
  quantidadeModulos: z.number().int().nonnegative(),
  faixa: z.object({
    minimo: z.number().int().nonnegative(),
    maximo: z.number().int().positive(),
  }),
  diasCalculados: z.number().positive(),
  valorDiaria: z.number().nonnegative(),
})

const ExternalLaborCalculationSchema = z.object({
  modelo: z.literal('terceiro-por-equipamento'),
  configuracao: z.object({
    tipo: z.literal('USUARIO'),
    id: z.string(),
    nome: z.string(),
  }),
  quantidadeModulos: z.number().int().nonnegative(),
  quantidadeInversores: z.number().int().nonnegative(),
  valorPorModulo: z.number().nonnegative(),
  valorPorInversor: z.number().nonnegative(),
  excecaoAplicada: z
    .object({
      quantidadeModulos: z.number().int().nonnegative(),
      valorFixo: z.number().nonnegative(),
    })
    .optional()
    .nullable(),
})

const ManualLaborCalculationSchema = z.object({
  modelo: z.literal('manual'),
  motivo: z.string().min(3),
})

const LaborCalculationSchema = z.discriminatedUnion('modelo', [
  InternalLaborCalculationSchema,
  ExternalLaborCalculationSchema,
  ManualLaborCalculationSchema,
])
```

Metadados da despesa:

```ts
const LaborCostMetadataSchema = z.object({
  chave: z.literal('custo-mao-de-obra'),
  versao: z.literal(1),
  natureza: z.enum(['APROPRIACAO_INTERNA', 'SERVICO_TERCEIRO']),
  calculo: LaborCalculationSchema,
  valorCalculado: z.number().nonnegative(),
  calculadoEm: z.string().datetime(),
  ajuste: z
    .object({
      valorAnterior: z.number().nonnegative(),
      motivo: z.string().min(3),
      autor: AuthorSchema,
      data: z.string().datetime(),
    })
    .optional()
    .nullable(),
})

export const ExpenseMetadataSchema = z.discriminatedUnion('chave', [LaborCostMetadataSchema])
```

Adicionar ao schema geral:

```ts
metadados: ExpenseMetadataSchema.optional().nullable()
```

Novas variantes poderão ser adicionadas à union conforme surgirem outros custos estruturados.

### 5.3. Semântica dos campos

- `total`: valor vigente e fonte de verdade financeira.
- `itens`: memória financeira cuja soma deve ser igual ao total.
- `metadados.valorCalculado`: resultado automático original.
- `metadados.calculo`: fotografia dos parâmetros e preços utilizados.
- `metadados.ajuste`: justificativa para alteração do total calculado.
- `efetivacao.efetivado = false`: estimativa ainda recalculável.
- `efetivacao.efetivado = true`: custo confirmado e protegido contra recálculo silencioso.
- `natureza = APROPRIACAO_INTERNA`: custo gerencial, sem geração automática de pagamento.
- `natureza = SERVICO_TERCEIRO`: custo que pode possuir pagamentos.

Não haverá `valorFinal` nos metadados, pois duplicaria `total`.

## 6. Composição dos itens

### 6.1. Equipe interna

```ts
;[
  {
    descricao: 'DIÁRIA DA EQUIPE INTERNA',
    unidade: 'DIA',
    qtde: diasCalculados,
    preco: valorDiaria,
  },
]
```

### 6.2. Terceiro sem exceção

```ts
;[
  {
    descricao: 'CUSTO POR MÓDULOS',
    unidade: 'UN',
    qtde: quantidadeModulos,
    preco: valorPorModulo,
  },
  {
    descricao: 'CUSTO POR INVERSORES',
    unidade: 'UN',
    qtde: quantidadeInversores,
    preco: valorPorInversor,
  },
]
```

### 6.3. Terceiro com exceção de valor fechado

Usar um único item para evitar ajustes artificiais ou itens negativos:

```ts
;[
  {
    descricao: 'MÃO DE OBRA - VALOR FECHADO PARA 4 MÓDULOS',
    unidade: 'SV',
    qtde: 1,
    preco: valorFixo,
  },
]
```

Os módulos, inversores e valores unitários originais continuarão preservados nos metadados.

## 7. Serviço de cálculo e sincronização

Centralizar a regra em um serviço de domínio, sem cálculos duplicados no frontend.

Funções previstas:

```ts
resolveLaborCostConfiguration(serviceOrder)
calculateLaborCost(serviceOrder, configuration)
buildLaborCostExpense(serviceOrder, calculation, session)
syncLaborCostExpense(serviceOrderId, session)
confirmLaborCostExpense(serviceOrderId, input, session)
```

### 7.1. Resolução automática

Para ordens de categoria `MONTAGEM`:

1. localizar configurações ativas dos usuários em `responsaveis`;
2. se houver exatamente uma configuração de terceiro, utilizá-la;
3. se não houver terceiro, procurar configuração da equipe indicada em `responsavel.nome`;
4. se ainda não houver configuração, utilizar a configuração interna padrão, caso cadastrada;
5. se houver mais de uma configuração de terceiro, não escolher silenciosamente;
6. se faltarem parâmetros ou não houver regra aplicável, exigir cálculo manual.

Para outras categorias, o MVP não fará cálculo automático. O custo poderá ser manual com justificativa.

### 7.2. Sincronização explícita

- Exibir `Inferir mão de obra` como ação rápida dentro do bloco único de custos.
- Criar ou recalcular a despesa somente quando o usuário acionar essa ação.
- Não gerar despesas silenciosamente ao criar ou editar a OS.
- Usar upsert pela combinação `ordemServico.id + metadados.chave`.
- Nunca criar uma segunda despesa de mão de obra para a mesma OS.
- Nunca recalcular silenciosamente uma despesa efetivada.
- Falha ou ausência de configuração não deve impedir a gravação da OS; deve retornar um estado acionável para a interface.

## 8. Confirmação e ajuste

Ao concluir a OS, apresentar o valor calculado:

```text
Custo calculado: R$ 750,00
[ Confirmar ] [ Ajustar ]
```

### 8.1. Confirmação sem alteração

- manter `total` igual a `metadados.valorCalculado`;
- definir `efetivacao.efetivado = true`;
- definir `efetivacao.data`;
- manter `metadados.ajuste = null`.

### 8.2. Confirmação com alteração

- atualizar `total`;
- preservar `metadados.valorCalculado`;
- registrar valor anterior, motivo, autor e data em `metadados.ajuste`;
- atualizar os itens para que sua soma permaneça igual ao total;
- efetivar a despesa.

Uma despesa efetivada só poderá ser alterada após uma ação explícita de reabertura, com permissão financeira.

## 9. Índices

Criar índice parcial único:

```js
db.despesas.createIndex(
  {
    'ordemServico.id': 1,
    'metadados.chave': 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      'ordemServico.id': { $exists: true },
      'metadados.chave': 'custo-mao-de-obra',
    },
  }
)
```

Também avaliar um índice não único em `ordemServico.id` para consultas de todas as despesas da OS.

## 10. APIs

Criar endpoints específicos, em vez de permitir que o frontend monte livremente despesas automáticas.

### Configurações

- listar configurações;
- criar configuração;
- editar configuração;
- ativar/desativar configuração.

### Custo da OS

- obter a despesa de mão de obra da OS;
- inferir/recalcular a estimativa sob demanda;
- confirmar custo;
- ajustar custo com justificativa;
- reabrir custo confirmado.

O servidor sempre recalculará valores e validará permissões. O frontend enviará identificadores e intenções, não preços unitários confiáveis.

## 11. Permissões

Proposta inicial:

- `ordensDeServico.editar`:
  - visualizar estimativa;
  - solicitar recálculo;
  - confirmar sem alteração, se a regra operacional permitir.
- `financeiro.editar`:
  - manter configurações;
  - ajustar valor;
  - reabrir custo;
  - gerir pagamentos de terceiros.
- demais usuários:
  - visualizar conforme as permissões financeiras já existentes.

As decisões finais de permissão devem ser confirmadas antes da implementação da interface.

## 12. Relatórios financeiros

Os relatórios devem distinguir:

- custo da obra: inclui apropriação interna e serviço de terceiro;
- contas a pagar e fluxo de caixa: inclui somente valores com pagamentos aplicáveis;
- estimado: despesas ainda não efetivadas;
- confirmado: despesas efetivadas;
- desvio: `total - metadados.valorCalculado`.

`APROPRIACAO_INTERNA` não deve aparecer automaticamente como título a pagar.

## 13. Compatibilidade e migração

### 13.1. Despesas legadas

- `ordemServico` e `metadados` serão opcionais no schema geral.
- Não converter automaticamente as 356 despesas atuais, pois elas não possuem vínculo suficiente para identificar uma OS com segurança.
- Continuar exibindo despesas legadas no fluxo atual.
- Novas despesas automáticas usarão os campos estruturados.

### 13.2. Campo `identificador`

Manter `identificador` por compatibilidade, mas não usá-lo como fonte de verdade para o novo fluxo.

Para novas despesas de mão de obra, poderá ser preenchido com `CUSTOS-ORDEM-DE-SERVICO`, desde que toda lógica nova utilize `metadados.chave` e `ordemServico.id`.

### 13.3. Bloco atual de custos

Substituir a detecção baseada em categoria `ART` pela consulta estruturada da despesa vinculada à OS. Corrigir a listagem para não mostrar em cada OS todas as despesas do mesmo projeto.

## 14. Validações obrigatórias

- Toda despesa `custo-mao-de-obra` deve possuir `ordemServico.id`.
- `total` deve ser igual à soma de `item.qtde * item.preco`, com arredondamento monetário centralizado.
- Ajuste de valor exige motivo.
- `APROPRIACAO_INTERNA` não gera pagamentos automaticamente.
- A exceção por quantidade de módulos substitui a fórmula normal.
- Faixas internas não podem se sobrepor.
- Deve existir no máximo uma configuração ativa para o mesmo sujeito e finalidade.
- Uma despesa efetivada não pode ser recalculada sem reabertura explícita.
- O vínculo com projeto deve ser copiado da OS, quando existente.

## 15. Etapas de implementação

### Etapa 1 — domínio e schemas

- adicionar schemas das configurações de custo;
- adicionar `ordemServico` e `metadados` ao schema de despesas;
- implementar validações semânticas;
- criar tipos TypeScript derivados dos schemas;
- criar utilitário único de arredondamento monetário.

### Etapa 2 — persistência e índices

- criar acesso à coleção de configurações;
- criar índices de configuração por sujeito;
- criar índice parcial único das despesas por OS e chave;
- implementar repositórios de leitura e upsert.

### Etapa 3 — serviço de cálculo

- resolver configuração aplicável;
- calcular equipe interna;
- calcular terceiro por equipamentos;
- aplicar exceção de valor fechado;
- construir itens e metadados;
- garantir idempotência do upsert;
- proteger despesas efetivadas.

### Etapa 4 — APIs e permissões

- endpoints de configuração;
- endpoint de consulta do custo da OS;
- endpoint de recálculo;
- endpoint de confirmação/ajuste;
- endpoint de reabertura;
- validação de autenticação e permissões.

### Etapa 5 — integração com OS

- unificar mão de obra e demais despesas em um único bloco `CUSTOS`;
- incluir `Inferir mão de obra` nas ações rápidas;
- incluir o resultado na mesma lista dos demais custos;
- permitir geração manual quando o cálculo automático não for possível;
- integrar confirmação ao encerramento da OS sem impedir o salvamento normal.

### Etapa 6 — financeiro e relatórios

- filtrar custos por OS;
- separar apropriações internas de pagamentos externos;
- mostrar estimado, confirmado e desvio;
- incluir custos estruturados na auditoria financeira do projeto;
- manter despesas legadas visíveis sem duplicidade.

### Etapa 7 — implantação gradual

- cadastrar configuração interna padrão;
- cadastrar inicialmente os terceiros validados pelo financeiro;
- habilitar o cálculo para novas OS de montagem;
- observar divergências e ajustes manuais;
- decidir posteriormente se vale recalcular OS antigas ainda abertas.

## 16. Testes

### Unitários

- cálculo interno de 2 a 8 módulos;
- cálculo interno de 9 a 16 módulos;
- ausência de faixa aplicável;
- cálculo externo normal;
- aplicação de exceção para quatro módulos;
- composição correta dos itens;
- arredondamento monetário;
- validação de metadados por discriminated union.

### Integração

- criação idempotente da despesa;
- recálculo após mudança de equipamentos;
- recálculo após mudança de responsável;
- proteção de despesa efetivada;
- confirmação sem ajuste;
- confirmação com ajuste e justificativa;
- duas OS do mesmo projeto com despesas distintas;
- compatibilidade de leitura de despesas legadas;
- apropriação interna sem pagamento;
- serviço de terceiro com pagamento.

### Interface

- estados sem configuração, calculando, estimado, ajustado e confirmado;
- seleção excepcional quando houver mais de uma configuração aplicável;
- confirmação com um clique no caminho comum;
- exigência de motivo somente quando houver ajuste;
- indicação clara de que custo interno não é conta a pagar.

## 17. Critérios de aceite do MVP

- A ação `Inferir mão de obra` gera no máximo uma despesa estimada para a OS.
- Uma nova inferência atualiza a mesma despesa enquanto ela não estiver efetivada.
- Duas OS do mesmo projeto nunca compartilham a mesma despesa de mão de obra.
- A despesa preserva a regra, os parâmetros e os preços utilizados no cálculo.
- O total sempre coincide com seus itens.
- O fechamento permite confirmar o valor calculado ou ajustá-lo com justificativa.
- Custos internos entram na análise da obra sem gerar pagamento automático.
- Custos externos podem utilizar o fluxo existente de pagamentos.
- Despesas legadas continuam funcionando.
- Nenhum fluxo depende de salário ou apontamento de horas.

## 18. Fora do escopo inicial

- cálculo contábil completo de folha e encargos;
- apontamento individual de horas;
- rateio de veículo, equipamentos, EPIs e benefícios;
- múltiplas fontes simultâneas de mão de obra na mesma OS;
- migração automática das despesas legadas;
- fórmulas arbitrárias configuradas como código ou expressão textual;
- decisão automática entre CLT e terceiro baseada em disponibilidade ou qualidade.

Esses recursos só deverão ser considerados após existir evidência de uso que justifique a complexidade.
