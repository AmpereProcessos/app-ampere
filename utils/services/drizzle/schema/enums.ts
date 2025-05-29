import { pgEnum } from "drizzle-orm/pg-core";

export const permissionEnum = pgEnum("tag_permissao", [
	"usuarios_visualizar",
	"usuarios_criar",
	"usuarios_editar",
	"usuarios_excluir",
	"atividades_visualizar",
	"atividades_criar",
	"atividades_editar",
	"atividades_excluir",
	"propostas_venda_visualizar",
	"propostas_venda_criar",
	"propostas_venda_editar",
	"propostas_venda_excluir",
	"propostas_venda_visualizar_precificacao",
	"propostas_venda_editar_precificacao",
	"vendas_visualizar",
	"vendas_criar",
	"vendas_editar",
	"vendas_excluir",
	"projetos_visualizar",
	"projetos_criar",
	"projetos_editar",
	"projetos_excluir",
	"compras_visualizar",
	"compras_criar",
	"compras_editar",
	"compras_excluir",
	"homologacoes_visualizar",
	"homologacoes_criar",
	"homologacoes_editar",
	"homologacoes_excluir",
	"analises_tecnicas_visualizar",
	"analises_tecnicas_criar",
	"analises_tecnicas_editar",
	"analises_tecnicas_excluir",
	"ordens_servico_visualizar",
	"ordens_servico_criar",
	"ordens_servico_editar",
	"ordens_servico_excluir",
	"ordens_servico_executar",
	"financas_visualizar",
	"financas_criar",
	"financas_editar",
	"financas_excluir",
	"receitas_visualizar",
	"receitas_criar",
	"receitas_editar",
	"receitas_excluir",
	"despesas_visualizar",
	"despesas_criar",
	"despesas_editar",
	"despesas_excluir",
	"materiais_estoque_visualizar",
	"materiais_estoque_criar",
	"materiais_estoque_editar",
	"materiais_estoque_excluir",
	"ativos_visualizar",
	"ativos_criar",
	"ativos_editar",
	"ativos_excluir",
	"quadros_kanban_visualizar",
	"quadros_kanban_criar",
	"quadros_kanban_editar",
	"quadros_kanban_excluir",
	"configurar_grupos_usuarios",
	"configurar_tipos_jornada_projeto",
	"configurar_premissas_propostas_venda",
	"configurar_metodologias_precificacao",
	"configurar_categorias_ordem_servico",
	"empresa_configurar_detalhes",
	"empresa_gerenciar_assinatura",
]);

export const geographicSegmentEnum = pgEnum("segmento_geografico", ["RURAL", "URBANO"]);
export const propertyUseSegmentEnum = pgEnum("segmento_uso_imovel", ["RESIDENCIAL", "COMERCIAL", "INDUSTRIAL"]);
export const contractStatusEnum = pgEnum("contrato_status", [
	"AGUARDANDO APROVAÇÃO",
	"FORMULAÇÃO SOLICITADA",
	"FORMULAÇÃO EM ANDAMENTO",
	"AGUARDANDO ASSINATURA",
	"ASSINADO",
	"RESCISÃO",
]);

export const productCategoryEnum = pgEnum("produto_categoria", ["MÓDULO", "INVERSOR", "INSUMO", "ESTRUTURA", "PADRÃO", "OUTROS"]);

export const purchaseStatusEnum = pgEnum("compra_status", [
	"PENDENTE",
	"EM COTAÇÃO",
	"AGUARDANDO APROVAÇÃO",
	"AGUARDANDO LIBERAÇÃO P/ PAGAMENTO",
	"AGUARDANDO PAGAMENTO",
	"AGUARDANDO COMPRA",
	"AGUARDANDO FATURAMENTO",
	"AGUARDANDO DESPACHE",
	"AGUARDANDO ENTREGA",
	"PENDÊNCIAS",
	"CONCLUÍDA",
]);
export const purchaseDeliveryStatusEnum = pgEnum("compra_entrega_status", ["AGUARDANDO COMPRA", "AGUARDANDO DESPACHE", "EM ROTA", "ENTREGUE"]);

export const financialTransactionTypeEnum = pgEnum("movimentacao_financeira_tipo", ["ENTRADA", "SAÍDA"]);

export const timeDurationUnitEnum = pgEnum("tempo_duracao_unidade", ["DIAS", "SEMANAS", "MESES", "ANOS"]);

export const certificationReferenceTypeEnum = pgEnum("certificacao_referencia_tipo", ["USUÁRIO", "ATIVO FÍSICO"]);

export const allocationReferenceTypeEnum = pgEnum("alocacao_referencia_tipo", ["CONSUMÍVEL", "TEMPORÁRIA", "ESTOCÁVEL"]);

export const physicalAssetNatureEnum = pgEnum("ativo_fisico_natureza", ["FUNGÍVEL", "NÃO FUNGÍVEL"]);

export const serviceOrderReportPeriodTypeEnum = pgEnum("ordem_servico_relatorio_periodo_tipo", ["DIÁRIO", "SEMANAL", "MENSAL", "PERSONALIZADO"]);

export const salesProposalPremissesTypes = pgEnum("sales_proposal_premisses_types", ["NÚMERICO", "SELEÇÃO", "BOOLEANO"]);

export const pricingMethodItemResultConditionTypeEnum = pgEnum("pricing_method_item_result_condition_type", [
	"IGUAL_TEXTO",
	"IGUAL_NÚMERICO",
	"MAIOR_QUE_NÚMERICO",
	"MENOR_QUE_NÚMERICO",
	"INTERVALO_NÚMERICO",
	"INCLUI_LISTA",
]);

export const technicalAnalysisResultAvaliationsLabelEnum = pgEnum("technical_analysis_result_avalations_result", ["POSITIVO", "NEGATIVO", "ATENÇÃO"]);
