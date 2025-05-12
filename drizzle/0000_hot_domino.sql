CREATE TYPE "public"."atividade_status" AS ENUM('PENDENTE', 'EM ANDAMENTO', 'CONCLUÍDO');--> statement-breakpoint
CREATE TYPE "public"."segmento_juridico" AS ENUM('PESSOA FÍSICA', 'PESSOA JURÍDICA');--> statement-breakpoint
CREATE TYPE "public"."alocacao_referencia_tipo" AS ENUM('CONSUMÍVEL', 'TEMPORÁRIA', 'ESTOCÁVEL');--> statement-breakpoint
CREATE TYPE "public"."certificacao_referencia_tipo" AS ENUM('USUÁRIO', 'ATIVO FÍSICO');--> statement-breakpoint
CREATE TYPE "public"."contrato_status" AS ENUM('AGUARDANDO APROVAÇÃO', 'FORMULAÇÃO SOLICITADA', 'FORMULAÇÃO EM ANDAMENTO', 'AGUARDANDO ASSINATURA', 'ASSINADO', 'RESCISÃO');--> statement-breakpoint
CREATE TYPE "public"."movimentacao_financeira_tipo" AS ENUM('ENTRADA', 'SAÍDA');--> statement-breakpoint
CREATE TYPE "public"."segmento_geografico" AS ENUM('RURAL', 'URBANO');--> statement-breakpoint
CREATE TYPE "public"."tag_permissao" AS ENUM('usuarios_visualizar', 'usuarios_criar', 'usuarios_editar', 'usuarios_excluir', 'atividades_visualizar', 'atividades_criar', 'atividades_editar', 'atividades_excluir', 'propostas_venda_visualizar', 'propostas_venda_criar', 'propostas_venda_editar', 'propostas_venda_excluir', 'propostas_venda_visualizar_precificacao', 'propostas_venda_editar_precificacao', 'vendas_visualizar', 'vendas_criar', 'vendas_editar', 'vendas_excluir', 'projetos_visualizar', 'projetos_criar', 'projetos_editar', 'projetos_excluir', 'compras_visualizar', 'compras_criar', 'compras_editar', 'compras_excluir', 'homologacoes_visualizar', 'homologacoes_criar', 'homologacoes_editar', 'homologacoes_excluir', 'analises_tecnicas_visualizar', 'analises_tecnicas_criar', 'analises_tecnicas_editar', 'analises_tecnicas_excluir', 'ordens_servico_visualizar', 'ordens_servico_criar', 'ordens_servico_editar', 'ordens_servico_excluir', 'ordens_servico_executar', 'financas_visualizar', 'financas_criar', 'financas_editar', 'financas_excluir', 'receitas_visualizar', 'receitas_criar', 'receitas_editar', 'receitas_excluir', 'despesas_visualizar', 'despesas_criar', 'despesas_editar', 'despesas_excluir', 'materiais_estoque_visualizar', 'materiais_estoque_criar', 'materiais_estoque_editar', 'materiais_estoque_excluir', 'ativos_visualizar', 'ativos_criar', 'ativos_editar', 'ativos_excluir', 'quadros_kanban_visualizar', 'quadros_kanban_criar', 'quadros_kanban_editar', 'quadros_kanban_excluir', 'configurar_grupos_usuarios', 'configurar_tipos_jornada_projeto', 'configurar_premissas_propostas_venda', 'configurar_metodologias_precificacao', 'configurar_categorias_ordem_servico', 'empresa_configurar_detalhes', 'empresa_gerenciar_assinatura');--> statement-breakpoint
CREATE TYPE "public"."ativo_fisico_natureza" AS ENUM('FUNGÍVEL', 'NÃO FUNGÍVEL');--> statement-breakpoint
CREATE TYPE "public"."pricing_method_item_result_condition_type" AS ENUM('IGUAL_TEXTO', 'IGUAL_NÚMERICO', 'MAIOR_QUE_NÚMERICO', 'MENOR_QUE_NÚMERICO', 'INTERVALO_NÚMERICO', 'INCLUI_LISTA');--> statement-breakpoint
CREATE TYPE "public"."produto_categoria" AS ENUM('MÓDULO', 'INVERSOR', 'INSUMO', 'ESTRUTURA', 'PADRÃO', 'OUTROS');--> statement-breakpoint
CREATE TYPE "public"."segmento_uso_imovel" AS ENUM('RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL');--> statement-breakpoint
CREATE TYPE "public"."compra_entrega_status" AS ENUM('AGUARDANDO COMPRA', 'AGUARDANDO DESPACHE', 'EM ROTA', 'ENTREGUE');--> statement-breakpoint
CREATE TYPE "public"."compra_status" AS ENUM('PENDENTE', 'EM COTAÇÃO', 'AGUARDANDO APROVAÇÃO', 'AGUARDANDO LIBERAÇÃO P/ PAGAMENTO', 'AGUARDANDO PAGAMENTO', 'AGUARDANDO COMPRA', 'AGUARDANDO FATURAMENTO', 'AGUARDANDO DESPACHE', 'AGUARDANDO ENTREGA', 'PENDÊNCIAS', 'CONCLUÍDA');--> statement-breakpoint
CREATE TYPE "public"."sales_proposal_premisses_types" AS ENUM('NÚMERICO', 'SELEÇÃO', 'BOOLEANO');--> statement-breakpoint
CREATE TYPE "public"."ordem_servico_relatorio_periodo_tipo" AS ENUM('DIÁRIO', 'SEMANAL', 'MENSAL', 'PERSONALIZADO');--> statement-breakpoint
CREATE TYPE "public"."technical_analysis_result_avalations_result" AS ENUM('POSITIVO', 'NEGATIVO', 'ATENÇÃO');--> statement-breakpoint
CREATE TYPE "public"."tempo_duracao_unidade" AS ENUM('DIAS', 'SEMANAS', 'MESES', 'ANOS');--> statement-breakpoint
CREATE TYPE "public"."homologacao_equipamento_categoria" AS ENUM('MÓDULO', 'INVERSOR');--> statement-breakpoint
CREATE TYPE "public"."homologacao_instalacao_grupo" AS ENUM('A1', 'A2', 'A3', 'A4', 'AS', 'B1', 'B2', 'B3', 'B4');--> statement-breakpoint
CREATE TYPE "public"."homologacao_status" AS ENUM('PENDENTE', 'ELABORANDO DOCUMENTAÇÕES', 'AGUARDANDO ASSINATURA', 'AGUARDANDO FATURAMENTO', 'AGUARDANDO PENDÊNCIAS', 'AGUARDANDO RESPOSTA', 'CONCLUÍDA', 'CANCELADO', 'SUSPENSO');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');--> statement-breakpoint
CREATE TYPE "public"."invoices_status" AS ENUM('succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."projeto_observacoes_assunto" AS ENUM('SERVIÇOS', 'PRODUTOS', 'NEGOCIAÇÃO', 'SUPRIMENTAÇÃO', 'EXECUÇÃO');--> statement-breakpoint
CREATE TYPE "public"."compra_item_composicao_categoria" AS ENUM('MÓDULO', 'INVERSOR', 'INSUMO', 'ESTRUTURA', 'PADRÃO', 'OUTROS');--> statement-breakpoint
CREATE TYPE "public"."urgencia" AS ENUM('POUCO URGENTE', 'URGENTE', 'EMERGÊNCIA');--> statement-breakpoint
CREATE TABLE "project_manager_activities" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"venda_id" varchar(255),
	"projeto_id" varchar(255),
	"compra_id" varchar(255),
	"homologacao_id" varchar(255),
	"analise_tecnica_id" varchar(255),
	"atividade_status" "atividade_status" DEFAULT 'PENDENTE' NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"descricao" text NOT NULL,
	"data_vencimento" timestamp,
	"data_inicio" timestamp,
	"data_conclusao" timestamp,
	"data_insercao" timestamp DEFAULT now() NOT NULL,
	"autor_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_activity_responsibles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"atividade_id" varchar(255) NOT NULL,
	"usuario_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_allocation_reference_temporary_allocation_records" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"ativo_fisico_id" varchar(255) NOT NULL,
	"referencia_alocacao_origem_id" varchar(255) NOT NULL,
	"referencia_alocacao_id" varchar(255) NOT NULL,
	"qtde" double precision NOT NULL,
	"data_inicio" timestamp NOT NULL,
	"data_fim" timestamp,
	"data_efetivacao" timestamp,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_allocation_reference_usage_records" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"ativo_fisico_id" varchar(255) NOT NULL,
	"referencia_alocacao_id" varchar(255) NOT NULL,
	"ordem_servico_id" varchar(255),
	"ordem_servico_relatorio_id" varchar(255),
	"qtde" double precision NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_physical_asset_allocation_references" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"alocador_id" varchar(255) NOT NULL,
	"ativo_fisico_id" varchar(255) NOT NULL,
	"qtde_prevista" double precision DEFAULT 0 NOT NULL,
	"qtde" double precision NOT NULL,
	"preco_unitario" double precision NOT NULL,
	"qtde_maxima" double precision,
	"qtde_minima" double precision,
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_physical_assets_allocators" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"projeto_id" varchar(255),
	"nome" varchar(255) NOT NULL,
	"descricao" text,
	"localizacao_cep" varchar(255),
	"localizacao_uf" varchar(255),
	"localizacao_cidade" varchar(255),
	"localizacao_bairro" varchar(255),
	"localizacao_logradouro" varchar(255),
	"localizacao_numero" varchar(255),
	"localizacao_complemento" varchar(255),
	"localizacao_latitude" varchar(255),
	"localizacao_longitude" varchar(255),
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_asset_category_reference" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"ativo_fisico_id" varchar(255) NOT NULL,
	"ativo_categoria_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_physical_asset_movement_record" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"formulario_movimentacao_ativos_id" varchar(255),
	"compra_id" varchar(255),
	"compra_item_composicao_id" varchar(255),
	"ativo_fisico_id" varchar(255) NOT NULL,
	"qtde" double precision NOT NULL,
	"alocador_origem_id" varchar(255),
	"referencia_alocacao_origem_id" varchar(255),
	"alocador_destino_id" varchar(255) NOT NULL,
	"referencia_alocacao_destino_id" varchar(255),
	"data_movimentacao" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_manager_assets_categories" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255),
	"nome" varchar(255) NOT NULL,
	"descricao" varchar(255),
	"cores_primaria" varchar(15) NOT NULL,
	"cores_secundaria" varchar(15) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_physical_assets_movement_formularies" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"titulo" text NOT NULL,
	"anotacoes" text,
	"ordem_servico_id" varchar(255),
	"autor_id" varchar(255) NOT NULL,
	"data_efetivacao" timestamp,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_physical_assets" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255),
	"nome" text NOT NULL,
	"natureza" "ativo_fisico_natureza" NOT NULL,
	"unidade" varchar(25) NOT NULL,
	"descricao" text,
	"numero_serie" varchar(255),
	"metadados_categoria_produto" "produto_categoria",
	"metadados_fabricante" text,
	"metadados_modelo" text,
	"metadados_garantia_medida" "tempo_duracao_unidade",
	"metadados_garantia_valor" double precision,
	"metadados_potencia" double precision,
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_email_verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar(8) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "project_manager_email_verification_codes_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "project_manager_password_reset_tokens" (
	"id" varchar(40) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_calendars" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"google_calendar_id" varchar(255) NOT NULL,
	"google_refresh_token" varchar(255) NOT NULL,
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_certification_references" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"certificacao_id" varchar(255) NOT NULL,
	"tipo" "certificacao_referencia_tipo" NOT NULL,
	"ativo_fisico_id" varchar(255),
	"usuario_id" varchar(255),
	"anotacoes" text,
	"data_inicio" timestamp NOT NULL,
	"data_fim" timestamp NOT NULL,
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_certifications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text,
	"duracao_prevista_unidade" "tempo_duracao_unidade" NOT NULL,
	"duracao_prevista_valor" double precision NOT NULL,
	"fornecedor_nome" varchar(255),
	"fornecedor_contato" varchar(255),
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_clients" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"cpf_cnpj" varchar(255) NOT NULL,
	"segmento_juridico" "segmento_juridico" NOT NULL,
	"email" varchar(255) NOT NULL,
	"telefone_primario" varchar(255) NOT NULL,
	"telefone_secundario" varchar(255),
	"localizacao_cep" varchar(255),
	"localizacao_uf" varchar(255),
	"localizacao_cidade" varchar(255),
	"localizacao_bairro" varchar(255),
	"localizacao_logradouro" varchar(255),
	"localizacao_numero" varchar(255),
	"localizacao_complemento" varchar(255),
	"localizacao_latitude" varchar(50),
	"localizacao_longitude" varchar(50),
	"dataNascimento" timestamp,
	"profissao" varchar(50),
	"onde_trabalha" varchar(50),
	"estado_civil" varchar(50),
	"deficiencia" varchar(50),
	"canal_aquisicao" varchar(50),
	"data_insercao" timestamp DEFAULT now() NOT NULL,
	"autor_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_distances" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"origem" text NOT NULL,
	"destino" text NOT NULL,
	"distancia" double precision NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_file_reference_categories" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255),
	"titulo" varchar(50) NOT NULL,
	"cores_primaria" varchar(15) NOT NULL,
	"cores_secundaria" varchar(15) NOT NULL,
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_file_reference_category_reference" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"referencia_arquivo_id" varchar(255) NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"referencia_arquivo_categoria_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_file_references" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"usuario_id" varchar(255),
	"cliente_id" varchar(255),
	"proposta_venda_id" varchar(255),
	"venda_id" varchar(255),
	"projeto_id" varchar(255),
	"compra_id" varchar(255),
	"homologacao_id" varchar(255),
	"atividade_id" varchar(255),
	"ativo_fisico_id" varchar(255),
	"ordem_servico_id" varchar(255),
	"ordem_servico_auxiliares_id" varchar(255),
	"ordem_servico_relatorio_id" varchar(255),
	"analise_tecnica_id" varchar(255),
	"titulo" varchar(255) NOT NULL,
	"formato" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"tamanho" integer NOT NULL,
	"publico" boolean DEFAULT false NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL,
	"autor_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_accounting_entries" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"projeto_id" varchar(255),
	"titulo" text NOT NULL,
	"anotacoes" text NOT NULL,
	"id_conta_debito" varchar(255) NOT NULL,
	"id_conta_credito" varchar(255) NOT NULL,
	"total" double precision NOT NULL,
	"data_competencia" timestamp NOT NULL,
	"autor_id" varchar(255),
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_accounting_entry_composition_items" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"lancamento_contabil_id" varchar(255) NOT NULL,
	"descricao" varchar(255) NOT NULL,
	"unidade" varchar(25) NOT NULL,
	"valor" double precision NOT NULL,
	"qtde" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_accounts_charts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255),
	"nome" varchar(255) NOT NULL,
	"id_conta_pai" varchar(255),
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_financial_transactions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"lancamento_contabil_id" varchar(255) NOT NULL,
	"projeto_id" varchar(255),
	"titulo" text NOT NULL,
	"movimentacao_financeira_tipo" "movimentacao_financeira_tipo" NOT NULL,
	"valor" double precision NOT NULL,
	"metodo" varchar(255) NOT NULL,
	"data_previsao" timestamp NOT NULL,
	"data_efetivacao" timestamp,
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_homologation_equipments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"homologacao_id" varchar(255) NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"produto_id" varchar(255) NOT NULL,
	"quantidade" double precision NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_homologation_updates" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"homologacao_id" varchar(255) NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"descricao" text NOT NULL,
	"autor_id" varchar(255) NOT NULL,
	"data" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_homologations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"projeto_id" varchar(255),
	"homologacao_status" "homologacao_status" NOT NULL,
	"potencia" double precision,
	"observacoes" text,
	"instalacao_distribuidora" varchar(255),
	"instalacao_titular_nome" varchar(255) NOT NULL,
	"instalacao_titular_identificador" varchar(255) NOT NULL,
	"instalacao_titular_contato" varchar(255) NOT NULL,
	"instalacao_titular_email" varchar(255) NOT NULL,
	"instalacao_numero_instalacao" varchar(255),
	"instalacao_numero_cliente" varchar(255),
	"homologacao_instalacao_grupo" "homologacao_instalacao_grupo",
	"contrato_forma_assinatura" varchar(255),
	"documentacao_data_inicio_elaboracao" timestamp,
	"documentacao_data_conclusao_elaboracao" timestamp,
	"documentacao_data_liberacao" timestamp,
	"documentacao_data_assinatura" timestamp,
	"acesso_codigo" varchar(255),
	"acesso_data_solicitacao" timestamp,
	"acesso_data_resposta" timestamp,
	"vistoria_data_solicitacao" timestamp,
	"vistoria_data_efetivacao" timestamp,
	"data_efetivacao" timestamp,
	"data_insercao" timestamp DEFAULT now() NOT NULL,
	"autor_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_partners" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"nome" varchar(255) NOT NULL,
	"apresentacao_texto" text,
	"cpf_cnpj" varchar(255) NOT NULL,
	"email" varchar(255),
	"telefone" varchar(255),
	"logo_url" varchar(255),
	"cliente_stripe_id" varchar(255),
	"localizacao_cep" varchar(255),
	"localizacao_uf" varchar(255),
	"localizacao_cidade" varchar(255),
	"localizacao_bairro" varchar(255),
	"localizacao_logradouro" varchar(255),
	"localizacao_numero" varchar(255),
	"localizacao_complemento" varchar(255),
	"localizacao_latitude" varchar(255),
	"localizacao_longitude" varchar(255),
	"data_insercao" timestamp DEFAULT now() NOT NULL,
	"data_atualizacao" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_manager_subscriptions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"subscription_status" "subscription_status",
	"parceiro_id" varchar(255),
	"assinatura_stripe_id" varchar(255) NOT NULL,
	"cliente_stripe_id" varchar(255) NOT NULL,
	"cliente_stripe_email" varchar(255) NOT NULL,
	"produto_stripe_id" varchar(255) NOT NULL,
	"preco_unitario" integer,
	"quantidade" integer DEFAULT 1 NOT NULL,
	"periodo_inicio" timestamp NOT NULL,
	"periodo_fim" timestamp NOT NULL,
	"data_inicio" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_invoices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"invoices_status" "invoices_status",
	"parceiro_id" varchar(255),
	"fatura_stripe_id" varchar(255) NOT NULL,
	"assinatura_stripe_id" varchar(255) NOT NULL,
	"cliente_stripe_id" varchar(255) NOT NULL,
	"cliente_stripe_email" varchar(255) NOT NULL,
	"valor_pago" integer,
	"valor_devido" integer,
	"moeda" varchar(255) NOT NULL,
	"periodo_inicio" timestamp NOT NULL,
	"periodo_fim" timestamp NOT NULL,
	"data_criacao" timestamp NOT NULL,
	"data_pagamento" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_manager_user_invites" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"grupo_usuarios_id" varchar(255) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"autor_id" varchar(255) NOT NULL,
	"data_expiracao" timestamp,
	"data_efetivacao" timestamp,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_user_permissions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"usuario_id" varchar(255) NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"tag_permissao" "tag_permissao" NOT NULL,
	"acesso" boolean NOT NULL,
	"escopo" text
);
--> statement-breakpoint
CREATE TABLE "project_manager_users" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"nome" varchar(255) NOT NULL,
	"administrador" boolean DEFAULT false,
	"parceiro_id" varchar(255) NOT NULL,
	"grupo_usuarios_id" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verificado" boolean DEFAULT false NOT NULL,
	"senha" varchar(255),
	"avatar" varchar(255),
	"telefone" varchar(255),
	"discord_id" varchar(255),
	"google_id" varchar(255),
	"google_refresh_token" varchar(255),
	"data_insercao" timestamp DEFAULT now() NOT NULL,
	"data_atualizacao" timestamp,
	CONSTRAINT "project_manager_users_email_unique" UNIQUE("email"),
	CONSTRAINT "project_manager_users_discord_id_unique" UNIQUE("discord_id"),
	CONSTRAINT "project_manager_users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
CREATE TABLE "project_manager_onboarding_setup" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"usuario_nome" varchar(255) NOT NULL,
	"usuario_email" varchar(255) NOT NULL,
	"usuario_telefone" varchar(255) NOT NULL,
	"usuario_avatar" varchar(255),
	"usuario_google_id" varchar(255),
	"usuario_google_refresh_token" varchar(255),
	"parceiro_nome" varchar(255) NOT NULL,
	"parceiro_cpf_cnpj" varchar(255) NOT NULL,
	"parceiro_email" varchar(255) NOT NULL,
	"parceiro_cep" varchar(255) NOT NULL,
	"parceiro_uf" varchar(255) NOT NULL,
	"parceiro_cidade" varchar(255) NOT NULL,
	"parceiro_bairro" varchar(255) NOT NULL,
	"parceiro_logradouro" varchar(255) NOT NULL,
	"parceiro_numero" varchar(255) NOT NULL,
	"parceiro_cliente_stripe_id" varchar(255),
	"numero_usuarios" integer NOT NULL,
	"estagio_informacoes_usuario" timestamp,
	"estagio_informacoes_empresa" timestamp,
	"estagio_informacoes_assinatura" timestamp,
	"data_conclusao" timestamp,
	CONSTRAINT "project_manager_onboarding_setup_usuario_email_unique" UNIQUE("usuario_email"),
	CONSTRAINT "project_manager_onboarding_setup_usuario_google_id_unique" UNIQUE("usuario_google_id")
);
--> statement-breakpoint
CREATE TABLE "project_manager_project_accesses" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"projeto_id" varchar(255) NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"identificador" varchar(255) NOT NULL,
	"login" varchar(255) NOT NULL,
	"senha" varchar(255) NOT NULL,
	"link" text NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_project_observations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"projeto_id" varchar(255) NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"projeto_observacoes_assunto" "projeto_observacoes_assunto" NOT NULL,
	"projeto_observacoes_descricao" text NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL,
	"autor_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_project_products" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"projeto_id" varchar(255) NOT NULL,
	"produto_id" varchar(255) NOT NULL,
	"quantidade" double precision NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_project_responsibles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"projeto_id" varchar(255) NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"usuario_id" varchar(255) NOT NULL,
	"papel" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_project_services" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"projeto_id" varchar(255) NOT NULL,
	"servico_id" varchar(255) NOT NULL,
	"quantidade" double precision NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_projects" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"cliente_id" varchar(255) NOT NULL,
	"venda_id" varchar(255) NOT NULL,
	"analise_tecnica_id" varchar(255),
	"indexador" integer NOT NULL,
	"nome" varchar(255) NOT NULL,
	"contatos_primario_nome" varchar(255) NOT NULL,
	"contatos_primario_telefone" varchar(255) NOT NULL,
	"contatos_secundario_nome" varchar(255),
	"contatos_secundario_telefone" varchar(255),
	"contatos_email" varchar(255) NOT NULL,
	"contatos_observacoes" text NOT NULL,
	"localizacao_cep" varchar(255),
	"localizacao_uf" varchar(255),
	"localizacao_cidade" varchar(255),
	"localizacao_bairro" varchar(255),
	"localizacao_logradouro" varchar(255),
	"localizacao_numero" varchar(255),
	"localizacao_complemento" varchar(255),
	"localizacao_latitude" varchar(255),
	"localizacao_longitude" varchar(255),
	"segmento_geografico" "segmento_geografico",
	"segmento_uso_imovel" "segmento_uso_imovel",
	"data_inicio" timestamp,
	"data_previsao_conclusao" timestamp,
	"data_conclusao" timestamp,
	"data_insercao" timestamp DEFAULT now() NOT NULL,
	"autor_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_purchase_composition_items" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"compra_id" varchar(255) NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"ativo_fisico_id" varchar(255) NOT NULL,
	"registro_movimentacao_ativo_id" varchar(255),
	"descricao" varchar(255) NOT NULL,
	"unidade" varchar(25) NOT NULL,
	"valor" double precision NOT NULL,
	"qtde" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_purchase_tag_reference" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"compra_id" varchar(255) NOT NULL,
	"compra_tag_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_purchase_tags" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"titulo" varchar(50) NOT NULL,
	"cores_primaria" varchar(15) NOT NULL,
	"cores_secundaria" varchar(15) NOT NULL,
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_purchase_updates" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"compra_id" varchar(255) NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"conteudo" text NOT NULL,
	"data" timestamp DEFAULT now() NOT NULL,
	"autor_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_purchases" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"projeto_id" varchar(255),
	"compra_status" "compra_status" NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"anotacoes" text NOT NULL,
	"total" double precision NOT NULL,
	"total_previsto" double precision,
	"liberacao_data" timestamp,
	"liberacao_autor_id" varchar(255),
	"pagamento_data_liberacao" timestamp,
	"pagamento_data_efetivacao" timestamp,
	"pedido_data" timestamp,
	"pedido_fornecedor_nome" varchar(255),
	"pedido_fornecedor_contato" varchar(255),
	"transporte_transportadora_nome" varchar(255),
	"transporte_transportadora_contato" varchar(255),
	"transporte_link_rastreio" text,
	"alocador_referencia_id" varchar(255),
	"compra_entrega_status" "compra_entrega_status" NOT NULL,
	"entrega_localizacao_cep" varchar(255),
	"entrega_localizacao_uf" varchar(255),
	"entrega_localizacao_cidade" varchar(255),
	"entrega_localizacao_bairro" varchar(255),
	"entrega_localizacao_logradouro" varchar(255),
	"entrega_localizacao_numero" varchar(255),
	"entrega_localizacao_complemento" varchar(255),
	"entrega_localizacao_latitude" varchar(255),
	"entrega_localizacao_longitude" varchar(255),
	"entrega_data_previsao" timestamp,
	"entrega_data_efetivacao" timestamp,
	"data_insercao" timestamp DEFAULT now() NOT NULL,
	"data_efetivacao" timestamp,
	"autor_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_service_order_category_report_types" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255),
	"categoria_id" varchar(255),
	"nome" varchar(255) NOT NULL,
	"configuracao" jsonb NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_service_order_instructions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"ordem_servico_id" varchar(255) NOT NULL,
	"topico" text NOT NULL,
	"descricao" text NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_service_order_report_activities" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"ordem_servico_id" varchar(255) NOT NULL,
	"ordem_servico_relatorio_id" varchar(255) NOT NULL,
	"descricao" text NOT NULL,
	"anotacoes" text,
	"periodo_inicio" timestamp NOT NULL,
	"periodo_fim" timestamp NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_service_order_report_assets_usage" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"ordem_servico_id" varchar(255) NOT NULL,
	"ordem_servico_relatorio_id" varchar(255) NOT NULL,
	"alocacao_referencia_id" varchar(255) NOT NULL,
	"ativo_fisico_id" varchar(255) NOT NULL,
	"qtde" double precision NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_service_order_reports" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"ordem_servico_id" varchar(255) NOT NULL,
	"periodo_tipo" "ordem_servico_relatorio_periodo_tipo" NOT NULL,
	"periodo_inicio" timestamp NOT NULL,
	"periodo_fim" timestamp NOT NULL,
	"anotacoes" text,
	"autor_id" varchar(255),
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_service_order_responsibles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"ordem_servico_id" varchar(255) NOT NULL,
	"usuario_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_service_orders" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"projeto_id" varchar(255),
	"categoria_id" varchar(100) NOT NULL,
	"descricao" text NOT NULL,
	"anotacoes" text,
	"favorecido_nome" varchar(255) NOT NULL,
	"favorecido_contato" varchar(255) NOT NULL,
	"urgencia" "urgencia",
	"localizacao_cep" varchar(255),
	"localizacao_uf" varchar(255),
	"localizacao_cidade" varchar(255),
	"localizacao_bairro" varchar(255),
	"localizacao_logradouro" varchar(255),
	"localizacao_numero" varchar(255),
	"localizacao_complemento" varchar(255),
	"localizacao_latitude" varchar(255),
	"localizacao_longitude" varchar(255),
	"agendamento_inicio" timestamp,
	"agendamento_fim" timestamp,
	"execucao_inicio" timestamp,
	"execucao_fim" timestamp,
	"alocador_referencia_id" varchar(255),
	"calendario_id" varchar(255),
	"relatorio_tipo_id" varchar(255),
	"permitir_relatorios_externos" boolean DEFAULT false,
	"google_calendar_id" varchar(255),
	"google_calendar_event_id" varchar(255),
	"data_efetivacao" timestamp,
	"data_insercao" timestamp DEFAULT now() NOT NULL,
	"autor_id" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_service_order_categories" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255),
	"nome" varchar(255) NOT NULL,
	"descricao" varchar(255),
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_sales_proposal_kits" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"proposta_venda_id" varchar(255) NOT NULL,
	"kit_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_sales_proposal_premisses" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"proposta_venda_id" varchar(255) NOT NULL,
	"premissa_definicao_id" varchar(255) NOT NULL,
	"identificador" varchar(255) NOT NULL,
	"valor" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_sales_proposal_premisses_definitions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255),
	"nome" varchar(255) NOT NULL,
	"identificador" varchar(255) NOT NULL,
	"descricao" text NOT NULL,
	"tipo" "sales_proposal_premisses_types" NOT NULL,
	"configuracao" jsonb NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_sales_proposal_pricing_items" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"proposta_venda_id" varchar(255) NOT NULL,
	"nome" text NOT NULL,
	"margem_lucro" double precision NOT NULL,
	"margem_lucro_calculada" double precision,
	"faturavel" boolean NOT NULL,
	"custo_formula" text,
	"custo_calculado" double precision NOT NULL,
	"custo_final" double precision NOT NULL,
	"valor_calculado" double precision NOT NULL,
	"valor_final" double precision NOT NULL,
	"valor_maximo" double precision,
	"valor_minimo" double precision,
	"revisao_tecnica_habilitada" boolean
);
--> statement-breakpoint
CREATE TABLE "project_manager_sales_proposal_products" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"proposta_venda_id" varchar(255) NOT NULL,
	"produto_id" varchar(255) NOT NULL,
	"quantidade" double precision NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_sales_proposal_services" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"proposta_venda_id" varchar(255) NOT NULL,
	"servico_id" varchar(255) NOT NULL,
	"quantidade" double precision NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_sales_proposal_updates" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"proposta_venda_id" varchar(255) NOT NULL,
	"conteudo" text NOT NULL,
	"data" timestamp DEFAULT now() NOT NULL,
	"autor_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_sales_proposals" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"cliente_id" varchar(255) NOT NULL,
	"identificador" integer NOT NULL,
	"favoritada" boolean DEFAULT false NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"anotacoes" text,
	"valor" double precision NOT NULL,
	"autor_id" varchar(255) NOT NULL,
	"data_expiracao" timestamp,
	"data_ganho" timestamp,
	"perda_data" timestamp,
	"perda_motivo" text,
	"interacao_data" timestamp,
	"venda_id" varchar(255),
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_sale_products" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"venda_id" varchar(255) NOT NULL,
	"produto_id" varchar(255) NOT NULL,
	"quantidade" double precision NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_sale_responsibles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"venda_id" varchar(255) NOT NULL,
	"usuario_id" varchar(255) NOT NULL,
	"papel" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_sale_services" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"venda_id" varchar(255) NOT NULL,
	"servico_id" varchar(255) NOT NULL,
	"quantidade" double precision NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_sales" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"cliente_id" varchar(255) NOT NULL,
	"proposta_venda_id" varchar(255),
	"analise_tecnica_id" varchar(255),
	"nome" varchar(255) NOT NULL,
	"observacoes" text NOT NULL,
	"segmento_geografico" "segmento_geografico",
	"segmento_uso_imovel" "segmento_uso_imovel",
	"contrato_status" "contrato_status",
	"contrato_data_solicitacao" timestamp,
	"contrato_data_liberacao" timestamp,
	"contrato_data_assinatura" timestamp,
	"contrato_data_rescisao" timestamp,
	"contrato_forma_assinatura" varchar(255),
	"pagamento_pagador_nome" varchar(255),
	"pagamento_pagador_telefone" varchar(255),
	"pagamento_pagador_email" varchar(255),
	"pagamento_pagador_cpf_cnpj" varchar(255),
	"pagamento_metodo_descricao" text,
	"pagamento_credito_aplicavel" boolean,
	"pagamento_credito_credor" varchar(255),
	"pagamento_credito_contato_nome" varchar(255),
	"pagamento_credito_contato_telefone" varchar(255),
	"pagamento_credito_observacoes" text,
	"pagamento_observacoes" text,
	"faturamento_observacoes" text,
	"valor" double precision NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL,
	"autor_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_user_group_permissions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255),
	"grupo_usuarios_id" varchar(255) NOT NULL,
	"tag_permissao" "tag_permissao" NOT NULL,
	"acesso" boolean NOT NULL,
	"escopo" text
);
--> statement-breakpoint
CREATE TABLE "project_manager_user_groups" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255),
	"nome" varchar(255) NOT NULL,
	"descricao" text,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_project_journey_type_step_dependencies" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"jornada_projeto_etapa_dependente_id" varchar(255) NOT NULL,
	"jornada_projeto_etapa_dependencia_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_project_journey_type_steps" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"index" integer NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"tipo_jornada_projeto_id" varchar(255) NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text NOT NULL,
	"project_journey_type_deadline_unit" "tempo_duracao_unidade",
	"prazo_valor" double precision,
	"canvas_posicao_x" double precision NOT NULL,
	"canvas_posicao_y" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_project_journey_types" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text NOT NULL,
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_pricing_method_item_results" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"metodologia_preficicacao_item_id" varchar(255),
	"formula" text NOT NULL,
	"margem_lucro" double precision NOT NULL,
	"faturavel" boolean NOT NULL,
	"valor_minimo" double precision,
	"valor_maximo" double precision,
	"revisao_tecnica_habilitada" boolean,
	"condicao_aplicavel" boolean NOT NULL,
	"condicao_tipo" "pricing_method_item_result_condition_type",
	"condicao_variavel" varchar(255),
	"condicao_igual" varchar(255),
	"condicao_maior_que" double precision,
	"condicao_menor_que" double precision,
	"condicao_intervalo_minimo" double precision,
	"condicao_intervalo_maximo" double precision,
	"condicao_inclui_lista" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "project_manager_pricing_method_items" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"metodologia_preficicacao_id" varchar(255),
	"nome" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_pricing_methods" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"descricao" text,
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_technical_analysis" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"cliente_id" varchar(255) NOT NULL,
	"proposta_venda_id" varchar(255),
	"venda_id" varchar(255),
	"projeto_id" varchar(255),
	"indexador" integer NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"anotacoes" text,
	"status" varchar(255) NOT NULL,
	"localizacao_cep" varchar(255),
	"localizacao_uf" varchar(255),
	"localizacao_cidade" varchar(255),
	"localizacao_bairro" varchar(255),
	"localizacao_logradouro" varchar(255),
	"localizacao_numero" varchar(255),
	"localizacao_complemento" varchar(255),
	"localizacao_latitude" varchar(255),
	"localizacao_longitude" varchar(255),
	"data_previsao_efetivacao" timestamp,
	"data_efetivacao" timestamp,
	"data_insercao" timestamp DEFAULT now() NOT NULL,
	"metadados" jsonb,
	"autor_id" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_technical_analysis_analysts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"analise_tecnica_id" varchar(255) NOT NULL,
	"usuario_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_technical_analysis_conditions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"analise_tecnica_id" varchar(255) NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"observacoes" text,
	"metadata" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_technical_analysis_external_references" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"analise_tecnica_id" varchar(255) NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"autor_id" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_technical_analysis_locations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"analise_tecnica_id" varchar(255) NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"identificador" varchar(255) NOT NULL,
	"local" text NOT NULL,
	"coordenadas_latitude" text,
	"coordenadas_longitude" text
);
--> statement-breakpoint
CREATE TABLE "project_manager_technical_analysis_measurements" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"analise_tecnica_id" varchar(255) NOT NULL,
	"tipo" varchar(255) NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"identificador" varchar(255) NOT NULL,
	"valor" text NOT NULL,
	"unidade" varchar(255) NOT NULL,
	"observacoes" text
);
--> statement-breakpoint
CREATE TABLE "project_manager_technical_analysis_result_avaliations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"analise_tecnica_id" varchar(255) NOT NULL,
	"item" varchar(255) NOT NULL,
	"valor" varchar(255) NOT NULL,
	"rotulo" "technical_analysis_result_avalations_result" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_technical_analysis_result_conclusion" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"analise_tecnica_id" varchar(255) NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"conteudo" text NOT NULL,
	"visibilidade_tecnica" boolean NOT NULL,
	"visibilidade_publica" boolean NOT NULL,
	"autor_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_technical_analysis_result_costs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"analise_tecnica_id" varchar(255) NOT NULL,
	"proposta_venda_item_preco_id" varchar(255),
	"nome" varchar(255) NOT NULL,
	"custo" double precision NOT NULL,
	"observacoes" text
);
--> statement-breakpoint
CREATE TABLE "project_manager_technical_analysis_result_resources" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"analise_tecnica_id" varchar(255) NOT NULL,
	"ativo_fisico_id" varchar(255) NOT NULL,
	"quantidade" double precision NOT NULL,
	"observacoes" text,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_products" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255),
	"produto_categoria" "produto_categoria" NOT NULL,
	"fabricante" varchar(255) NOT NULL,
	"modelo" varchar(255) NOT NULL,
	"garantia_medida" "tempo_duracao_unidade" NOT NULL,
	"garantia_valor" double precision NOT NULL,
	"potencia" double precision,
	"valor" double precision,
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_services" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"titulo" text NOT NULL,
	"observacoes" text,
	"garantia_medida" "tempo_duracao_unidade" NOT NULL,
	"garantia_valor" double precision NOT NULL,
	"valor" double precision,
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_kit_products" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"kit_id" varchar(255) NOT NULL,
	"produto_id" varchar(255) NOT NULL,
	"quantidade" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_kit_services" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"kit_id" varchar(255) NOT NULL,
	"servico_id" varchar(255) NOT NULL,
	"quantidade" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_kits" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"titulo" text NOT NULL,
	"preco" double precision NOT NULL,
	"metodologia_precificacao_id" varchar(255) NOT NULL,
	"metadados_tipos_estruturas_instalacao" text,
	"metadados_potencia_total_modulos" double precision,
	"metadados_potencia_total_inversores" double precision,
	"metadados_topologia" text,
	"autor_id" varchar(255) NOT NULL,
	"data_validade" timestamp,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_kanban_board_item_connections" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"quadro_id" varchar(255) NOT NULL,
	"estagio_id" varchar(255) NOT NULL,
	"proposta_venda_id" varchar(255),
	"venda_id" varchar(255),
	"projeto_id" varchar(255),
	"compra_id" varchar(255),
	"homologacao_id" varchar(255),
	"ordem_servico_id" varchar(255),
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_kanban_board_stages" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"quadro_id" varchar(255) NOT NULL,
	"nome" text NOT NULL,
	"ordem" integer NOT NULL,
	"estagio_inicial" boolean DEFAULT false NOT NULL,
	"estagio_final" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_manager_kanban_boards" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parceiro_id" varchar(255) NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"aplicavel_propostas_venda" boolean,
	"aplicavel_vendas" boolean,
	"aplicavel_projetos" boolean,
	"aplicavel_compras" boolean,
	"aplicavel_homologacoes" boolean,
	"aplicavel_ordens_servico" boolean,
	"autor_id" varchar(255) NOT NULL,
	"data_insercao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_manager_activities" ADD CONSTRAINT "project_manager_activities_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_activities" ADD CONSTRAINT "project_manager_activities_venda_id_project_manager_sales_id_fk" FOREIGN KEY ("venda_id") REFERENCES "public"."project_manager_sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_activities" ADD CONSTRAINT "project_manager_activities_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_activities" ADD CONSTRAINT "project_manager_activities_compra_id_project_manager_purchases_id_fk" FOREIGN KEY ("compra_id") REFERENCES "public"."project_manager_purchases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_activities" ADD CONSTRAINT "project_manager_activities_homologacao_id_project_manager_homologations_id_fk" FOREIGN KEY ("homologacao_id") REFERENCES "public"."project_manager_homologations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_activities" ADD CONSTRAINT "project_manager_activities_analise_tecnica_id_project_manager_technical_analysis_id_fk" FOREIGN KEY ("analise_tecnica_id") REFERENCES "public"."project_manager_technical_analysis"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_activities" ADD CONSTRAINT "project_manager_activities_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_activity_responsibles" ADD CONSTRAINT "project_manager_activity_responsibles_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_activity_responsibles" ADD CONSTRAINT "project_manager_activity_responsibles_atividade_id_project_manager_activities_id_fk" FOREIGN KEY ("atividade_id") REFERENCES "public"."project_manager_activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_activity_responsibles" ADD CONSTRAINT "project_manager_activity_responsibles_usuario_id_project_manager_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_allocation_reference_temporary_allocation_records" ADD CONSTRAINT "project_manager_allocation_reference_temporary_allocation_records_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_allocation_reference_temporary_allocation_records" ADD CONSTRAINT "project_manager_allocation_reference_temporary_allocation_records_ativo_fisico_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("ativo_fisico_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_allocation_reference_temporary_allocation_records" ADD CONSTRAINT "project_manager_allocation_reference_temporary_allocation_records_referencia_alocacao_origem_id_project_manager_physical_asset_allocation_references_id_fk" FOREIGN KEY ("referencia_alocacao_origem_id") REFERENCES "public"."project_manager_physical_asset_allocation_references"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_allocation_reference_temporary_allocation_records" ADD CONSTRAINT "project_manager_allocation_reference_temporary_allocation_records_referencia_alocacao_id_project_manager_physical_asset_allocation_references_id_fk" FOREIGN KEY ("referencia_alocacao_id") REFERENCES "public"."project_manager_physical_asset_allocation_references"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_allocation_reference_usage_records" ADD CONSTRAINT "project_manager_allocation_reference_usage_records_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_allocation_reference_usage_records" ADD CONSTRAINT "project_manager_allocation_reference_usage_records_ativo_fisico_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("ativo_fisico_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_allocation_reference_usage_records" ADD CONSTRAINT "project_manager_allocation_reference_usage_records_referencia_alocacao_id_project_manager_physical_asset_allocation_references_id_fk" FOREIGN KEY ("referencia_alocacao_id") REFERENCES "public"."project_manager_physical_asset_allocation_references"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_allocation_reference_usage_records" ADD CONSTRAINT "project_manager_allocation_reference_usage_records_ordem_servico_id_project_manager_service_orders_id_fk" FOREIGN KEY ("ordem_servico_id") REFERENCES "public"."project_manager_service_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_allocation_reference_usage_records" ADD CONSTRAINT "project_manager_allocation_reference_usage_records_ordem_servico_relatorio_id_project_manager_service_order_reports_id_fk" FOREIGN KEY ("ordem_servico_relatorio_id") REFERENCES "public"."project_manager_service_order_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_allocation_references" ADD CONSTRAINT "project_manager_physical_asset_allocation_references_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_allocation_references" ADD CONSTRAINT "project_manager_physical_asset_allocation_references_alocador_id_project_manager_physical_assets_allocators_id_fk" FOREIGN KEY ("alocador_id") REFERENCES "public"."project_manager_physical_assets_allocators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_allocation_references" ADD CONSTRAINT "project_manager_physical_asset_allocation_references_ativo_fisico_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("ativo_fisico_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_allocation_references" ADD CONSTRAINT "project_manager_physical_asset_allocation_references_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_assets_allocators" ADD CONSTRAINT "project_manager_physical_assets_allocators_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_assets_allocators" ADD CONSTRAINT "project_manager_physical_assets_allocators_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_assets_allocators" ADD CONSTRAINT "project_manager_physical_assets_allocators_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_asset_category_reference" ADD CONSTRAINT "project_manager_asset_category_reference_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_asset_category_reference" ADD CONSTRAINT "project_manager_asset_category_reference_ativo_fisico_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("ativo_fisico_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_asset_category_reference" ADD CONSTRAINT "project_manager_asset_category_reference_ativo_categoria_id_project_manager_assets_categories_id_fk" FOREIGN KEY ("ativo_categoria_id") REFERENCES "public"."project_manager_assets_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_movement_record" ADD CONSTRAINT "project_manager_physical_asset_movement_record_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_movement_record" ADD CONSTRAINT "project_manager_physical_asset_movement_record_formulario_movimentacao_ativos_id_project_manager_physical_assets_movement_formularies_id_fk" FOREIGN KEY ("formulario_movimentacao_ativos_id") REFERENCES "public"."project_manager_physical_assets_movement_formularies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_movement_record" ADD CONSTRAINT "project_manager_physical_asset_movement_record_compra_id_project_manager_purchases_id_fk" FOREIGN KEY ("compra_id") REFERENCES "public"."project_manager_purchases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_movement_record" ADD CONSTRAINT "project_manager_physical_asset_movement_record_compra_item_composicao_id_project_manager_purchase_composition_items_id_fk" FOREIGN KEY ("compra_item_composicao_id") REFERENCES "public"."project_manager_purchase_composition_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_movement_record" ADD CONSTRAINT "project_manager_physical_asset_movement_record_ativo_fisico_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("ativo_fisico_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_movement_record" ADD CONSTRAINT "project_manager_physical_asset_movement_record_alocador_origem_id_project_manager_physical_assets_allocators_id_fk" FOREIGN KEY ("alocador_origem_id") REFERENCES "public"."project_manager_physical_assets_allocators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_movement_record" ADD CONSTRAINT "project_manager_physical_asset_movement_record_referencia_alocacao_origem_id_project_manager_physical_asset_allocation_references_id_fk" FOREIGN KEY ("referencia_alocacao_origem_id") REFERENCES "public"."project_manager_physical_asset_allocation_references"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_movement_record" ADD CONSTRAINT "project_manager_physical_asset_movement_record_alocador_destino_id_project_manager_physical_assets_allocators_id_fk" FOREIGN KEY ("alocador_destino_id") REFERENCES "public"."project_manager_physical_assets_allocators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_asset_movement_record" ADD CONSTRAINT "project_manager_physical_asset_movement_record_referencia_alocacao_destino_id_project_manager_physical_asset_allocation_references_id_fk" FOREIGN KEY ("referencia_alocacao_destino_id") REFERENCES "public"."project_manager_physical_asset_allocation_references"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_assets_categories" ADD CONSTRAINT "project_manager_assets_categories_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_assets_movement_formularies" ADD CONSTRAINT "project_manager_physical_assets_movement_formularies_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_assets_movement_formularies" ADD CONSTRAINT "project_manager_physical_assets_movement_formularies_ordem_servico_id_project_manager_service_orders_id_fk" FOREIGN KEY ("ordem_servico_id") REFERENCES "public"."project_manager_service_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_assets_movement_formularies" ADD CONSTRAINT "project_manager_physical_assets_movement_formularies_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_assets" ADD CONSTRAINT "project_manager_physical_assets_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_physical_assets" ADD CONSTRAINT "project_manager_physical_assets_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_calendars" ADD CONSTRAINT "project_manager_calendars_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_calendars" ADD CONSTRAINT "project_manager_calendars_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_certification_references" ADD CONSTRAINT "project_manager_certification_references_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_certification_references" ADD CONSTRAINT "project_manager_certification_references_certificacao_id_project_manager_certifications_id_fk" FOREIGN KEY ("certificacao_id") REFERENCES "public"."project_manager_certifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_certification_references" ADD CONSTRAINT "project_manager_certification_references_ativo_fisico_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("ativo_fisico_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_certification_references" ADD CONSTRAINT "project_manager_certification_references_usuario_id_project_manager_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_certification_references" ADD CONSTRAINT "project_manager_certification_references_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_certifications" ADD CONSTRAINT "project_manager_certifications_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_certifications" ADD CONSTRAINT "project_manager_certifications_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_clients" ADD CONSTRAINT "project_manager_clients_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_clients" ADD CONSTRAINT "project_manager_clients_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_reference_categories" ADD CONSTRAINT "project_manager_file_reference_categories_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_reference_categories" ADD CONSTRAINT "project_manager_file_reference_categories_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_reference_category_reference" ADD CONSTRAINT "project_manager_file_reference_category_reference_referencia_arquivo_id_project_manager_file_references_id_fk" FOREIGN KEY ("referencia_arquivo_id") REFERENCES "public"."project_manager_file_references"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_reference_category_reference" ADD CONSTRAINT "project_manager_file_reference_category_reference_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_reference_category_reference" ADD CONSTRAINT "project_manager_file_reference_category_reference_referencia_arquivo_categoria_id_project_manager_file_reference_categories_id_fk" FOREIGN KEY ("referencia_arquivo_categoria_id") REFERENCES "public"."project_manager_file_reference_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_usuario_id_project_manager_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."project_manager_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_cliente_id_project_manager_clients_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."project_manager_clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_proposta_venda_id_project_manager_sales_proposals_id_fk" FOREIGN KEY ("proposta_venda_id") REFERENCES "public"."project_manager_sales_proposals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_venda_id_project_manager_sales_id_fk" FOREIGN KEY ("venda_id") REFERENCES "public"."project_manager_sales"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_compra_id_project_manager_purchases_id_fk" FOREIGN KEY ("compra_id") REFERENCES "public"."project_manager_purchases"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_homologacao_id_project_manager_homologations_id_fk" FOREIGN KEY ("homologacao_id") REFERENCES "public"."project_manager_homologations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_atividade_id_project_manager_activities_id_fk" FOREIGN KEY ("atividade_id") REFERENCES "public"."project_manager_activities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_ativo_fisico_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("ativo_fisico_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_ordem_servico_id_project_manager_service_orders_id_fk" FOREIGN KEY ("ordem_servico_id") REFERENCES "public"."project_manager_service_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_ordem_servico_auxiliares_id_project_manager_service_orders_id_fk" FOREIGN KEY ("ordem_servico_auxiliares_id") REFERENCES "public"."project_manager_service_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_ordem_servico_relatorio_id_project_manager_service_order_reports_id_fk" FOREIGN KEY ("ordem_servico_relatorio_id") REFERENCES "public"."project_manager_service_order_reports"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_analise_tecnica_id_project_manager_technical_analysis_id_fk" FOREIGN KEY ("analise_tecnica_id") REFERENCES "public"."project_manager_technical_analysis"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_file_references" ADD CONSTRAINT "project_manager_file_references_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_accounting_entries" ADD CONSTRAINT "project_manager_accounting_entries_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_accounting_entries" ADD CONSTRAINT "project_manager_accounting_entries_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_accounting_entries" ADD CONSTRAINT "project_manager_accounting_entries_id_conta_debito_project_manager_accounts_charts_id_fk" FOREIGN KEY ("id_conta_debito") REFERENCES "public"."project_manager_accounts_charts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_accounting_entries" ADD CONSTRAINT "project_manager_accounting_entries_id_conta_credito_project_manager_accounts_charts_id_fk" FOREIGN KEY ("id_conta_credito") REFERENCES "public"."project_manager_accounts_charts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_accounting_entries" ADD CONSTRAINT "project_manager_accounting_entries_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_accounting_entry_composition_items" ADD CONSTRAINT "project_manager_accounting_entry_composition_items_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_accounting_entry_composition_items" ADD CONSTRAINT "project_manager_accounting_entry_composition_items_lancamento_contabil_id_project_manager_accounting_entries_id_fk" FOREIGN KEY ("lancamento_contabil_id") REFERENCES "public"."project_manager_accounting_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_accounts_charts" ADD CONSTRAINT "project_manager_accounts_charts_id_conta_pai_project_manager_accounts_charts_id_fk" FOREIGN KEY ("id_conta_pai") REFERENCES "public"."project_manager_accounts_charts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_financial_transactions" ADD CONSTRAINT "project_manager_financial_transactions_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_financial_transactions" ADD CONSTRAINT "project_manager_financial_transactions_lancamento_contabil_id_project_manager_accounting_entries_id_fk" FOREIGN KEY ("lancamento_contabil_id") REFERENCES "public"."project_manager_accounting_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_financial_transactions" ADD CONSTRAINT "project_manager_financial_transactions_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_financial_transactions" ADD CONSTRAINT "project_manager_financial_transactions_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_homologation_equipments" ADD CONSTRAINT "project_manager_homologation_equipments_homologacao_id_project_manager_homologations_id_fk" FOREIGN KEY ("homologacao_id") REFERENCES "public"."project_manager_homologations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_homologation_equipments" ADD CONSTRAINT "project_manager_homologation_equipments_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_homologation_equipments" ADD CONSTRAINT "project_manager_homologation_equipments_produto_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("produto_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_homologation_updates" ADD CONSTRAINT "project_manager_homologation_updates_homologacao_id_project_manager_homologations_id_fk" FOREIGN KEY ("homologacao_id") REFERENCES "public"."project_manager_homologations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_homologation_updates" ADD CONSTRAINT "project_manager_homologation_updates_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_homologation_updates" ADD CONSTRAINT "project_manager_homologation_updates_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_homologations" ADD CONSTRAINT "project_manager_homologations_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_homologations" ADD CONSTRAINT "project_manager_homologations_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_homologations" ADD CONSTRAINT "project_manager_homologations_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_subscriptions" ADD CONSTRAINT "project_manager_subscriptions_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_invoices" ADD CONSTRAINT "project_manager_invoices_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_user_invites" ADD CONSTRAINT "project_manager_user_invites_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_user_invites" ADD CONSTRAINT "project_manager_user_invites_grupo_usuarios_id_project_manager_user_groups_id_fk" FOREIGN KEY ("grupo_usuarios_id") REFERENCES "public"."project_manager_user_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_user_invites" ADD CONSTRAINT "project_manager_user_invites_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_user_permissions" ADD CONSTRAINT "project_manager_user_permissions_usuario_id_project_manager_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."project_manager_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_user_permissions" ADD CONSTRAINT "project_manager_user_permissions_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_users" ADD CONSTRAINT "project_manager_users_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_users" ADD CONSTRAINT "project_manager_users_grupo_usuarios_id_project_manager_user_groups_id_fk" FOREIGN KEY ("grupo_usuarios_id") REFERENCES "public"."project_manager_user_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_accesses" ADD CONSTRAINT "project_manager_project_accesses_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_accesses" ADD CONSTRAINT "project_manager_project_accesses_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_observations" ADD CONSTRAINT "project_manager_project_observations_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_observations" ADD CONSTRAINT "project_manager_project_observations_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_observations" ADD CONSTRAINT "project_manager_project_observations_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_products" ADD CONSTRAINT "project_manager_project_products_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_products" ADD CONSTRAINT "project_manager_project_products_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_products" ADD CONSTRAINT "project_manager_project_products_produto_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("produto_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_responsibles" ADD CONSTRAINT "project_manager_project_responsibles_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_responsibles" ADD CONSTRAINT "project_manager_project_responsibles_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_responsibles" ADD CONSTRAINT "project_manager_project_responsibles_usuario_id_project_manager_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_services" ADD CONSTRAINT "project_manager_project_services_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_services" ADD CONSTRAINT "project_manager_project_services_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_services" ADD CONSTRAINT "project_manager_project_services_servico_id_project_manager_services_id_fk" FOREIGN KEY ("servico_id") REFERENCES "public"."project_manager_services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_projects" ADD CONSTRAINT "project_manager_projects_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_projects" ADD CONSTRAINT "project_manager_projects_cliente_id_project_manager_clients_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."project_manager_clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_projects" ADD CONSTRAINT "project_manager_projects_venda_id_project_manager_sales_id_fk" FOREIGN KEY ("venda_id") REFERENCES "public"."project_manager_sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_projects" ADD CONSTRAINT "project_manager_projects_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchase_composition_items" ADD CONSTRAINT "project_manager_purchase_composition_items_compra_id_project_manager_purchases_id_fk" FOREIGN KEY ("compra_id") REFERENCES "public"."project_manager_purchases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchase_composition_items" ADD CONSTRAINT "project_manager_purchase_composition_items_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchase_composition_items" ADD CONSTRAINT "project_manager_purchase_composition_items_ativo_fisico_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("ativo_fisico_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchase_tag_reference" ADD CONSTRAINT "project_manager_purchase_tag_reference_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchase_tag_reference" ADD CONSTRAINT "project_manager_purchase_tag_reference_compra_id_project_manager_purchases_id_fk" FOREIGN KEY ("compra_id") REFERENCES "public"."project_manager_purchases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchase_tag_reference" ADD CONSTRAINT "project_manager_purchase_tag_reference_compra_tag_id_project_manager_purchase_tags_id_fk" FOREIGN KEY ("compra_tag_id") REFERENCES "public"."project_manager_purchase_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchase_tags" ADD CONSTRAINT "project_manager_purchase_tags_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchase_tags" ADD CONSTRAINT "project_manager_purchase_tags_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchase_updates" ADD CONSTRAINT "project_manager_purchase_updates_compra_id_project_manager_purchases_id_fk" FOREIGN KEY ("compra_id") REFERENCES "public"."project_manager_purchases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchase_updates" ADD CONSTRAINT "project_manager_purchase_updates_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchase_updates" ADD CONSTRAINT "project_manager_purchase_updates_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchases" ADD CONSTRAINT "project_manager_purchases_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchases" ADD CONSTRAINT "project_manager_purchases_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchases" ADD CONSTRAINT "project_manager_purchases_liberacao_autor_id_project_manager_users_id_fk" FOREIGN KEY ("liberacao_autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchases" ADD CONSTRAINT "project_manager_purchases_alocador_referencia_id_project_manager_physical_assets_allocators_id_fk" FOREIGN KEY ("alocador_referencia_id") REFERENCES "public"."project_manager_physical_assets_allocators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_purchases" ADD CONSTRAINT "project_manager_purchases_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_category_report_types" ADD CONSTRAINT "project_manager_service_order_category_report_types_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_category_report_types" ADD CONSTRAINT "project_manager_service_order_category_report_types_categoria_id_project_manager_service_order_categories_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."project_manager_service_order_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_instructions" ADD CONSTRAINT "project_manager_service_order_instructions_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_instructions" ADD CONSTRAINT "project_manager_service_order_instructions_ordem_servico_id_project_manager_service_orders_id_fk" FOREIGN KEY ("ordem_servico_id") REFERENCES "public"."project_manager_service_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_report_activities" ADD CONSTRAINT "project_manager_service_order_report_activities_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_report_activities" ADD CONSTRAINT "project_manager_service_order_report_activities_ordem_servico_id_project_manager_service_orders_id_fk" FOREIGN KEY ("ordem_servico_id") REFERENCES "public"."project_manager_service_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_report_activities" ADD CONSTRAINT "project_manager_service_order_report_activities_ordem_servico_relatorio_id_project_manager_service_order_reports_id_fk" FOREIGN KEY ("ordem_servico_relatorio_id") REFERENCES "public"."project_manager_service_order_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_report_assets_usage" ADD CONSTRAINT "project_manager_service_order_report_assets_usage_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_report_assets_usage" ADD CONSTRAINT "project_manager_service_order_report_assets_usage_ordem_servico_id_project_manager_service_orders_id_fk" FOREIGN KEY ("ordem_servico_id") REFERENCES "public"."project_manager_service_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_report_assets_usage" ADD CONSTRAINT "project_manager_service_order_report_assets_usage_ordem_servico_relatorio_id_project_manager_service_order_reports_id_fk" FOREIGN KEY ("ordem_servico_relatorio_id") REFERENCES "public"."project_manager_service_order_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_report_assets_usage" ADD CONSTRAINT "project_manager_service_order_report_assets_usage_alocacao_referencia_id_project_manager_physical_asset_allocation_references_id_fk" FOREIGN KEY ("alocacao_referencia_id") REFERENCES "public"."project_manager_physical_asset_allocation_references"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_report_assets_usage" ADD CONSTRAINT "project_manager_service_order_report_assets_usage_ativo_fisico_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("ativo_fisico_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_reports" ADD CONSTRAINT "project_manager_service_order_reports_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_reports" ADD CONSTRAINT "project_manager_service_order_reports_ordem_servico_id_project_manager_service_orders_id_fk" FOREIGN KEY ("ordem_servico_id") REFERENCES "public"."project_manager_service_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_reports" ADD CONSTRAINT "project_manager_service_order_reports_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_responsibles" ADD CONSTRAINT "project_manager_service_order_responsibles_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_responsibles" ADD CONSTRAINT "project_manager_service_order_responsibles_ordem_servico_id_project_manager_service_orders_id_fk" FOREIGN KEY ("ordem_servico_id") REFERENCES "public"."project_manager_service_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_responsibles" ADD CONSTRAINT "project_manager_service_order_responsibles_usuario_id_project_manager_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_orders" ADD CONSTRAINT "project_manager_service_orders_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_orders" ADD CONSTRAINT "project_manager_service_orders_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_orders" ADD CONSTRAINT "project_manager_service_orders_categoria_id_project_manager_service_order_categories_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."project_manager_service_order_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_orders" ADD CONSTRAINT "project_manager_service_orders_alocador_referencia_id_project_manager_physical_assets_allocators_id_fk" FOREIGN KEY ("alocador_referencia_id") REFERENCES "public"."project_manager_physical_assets_allocators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_orders" ADD CONSTRAINT "project_manager_service_orders_calendario_id_project_manager_calendars_id_fk" FOREIGN KEY ("calendario_id") REFERENCES "public"."project_manager_calendars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_orders" ADD CONSTRAINT "project_manager_service_orders_relatorio_tipo_id_project_manager_service_order_category_report_types_id_fk" FOREIGN KEY ("relatorio_tipo_id") REFERENCES "public"."project_manager_service_order_category_report_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_orders" ADD CONSTRAINT "project_manager_service_orders_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_service_order_categories" ADD CONSTRAINT "project_manager_service_order_categories_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_kits" ADD CONSTRAINT "project_manager_sales_proposal_kits_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_kits" ADD CONSTRAINT "project_manager_sales_proposal_kits_proposta_venda_id_project_manager_sales_proposals_id_fk" FOREIGN KEY ("proposta_venda_id") REFERENCES "public"."project_manager_sales_proposals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_kits" ADD CONSTRAINT "project_manager_sales_proposal_kits_kit_id_project_manager_kits_id_fk" FOREIGN KEY ("kit_id") REFERENCES "public"."project_manager_kits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_premisses" ADD CONSTRAINT "project_manager_sales_proposal_premisses_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_premisses" ADD CONSTRAINT "project_manager_sales_proposal_premisses_proposta_venda_id_project_manager_sales_proposals_id_fk" FOREIGN KEY ("proposta_venda_id") REFERENCES "public"."project_manager_sales_proposals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_premisses" ADD CONSTRAINT "project_manager_sales_proposal_premisses_premissa_definicao_id_project_manager_sales_proposal_premisses_definitions_id_fk" FOREIGN KEY ("premissa_definicao_id") REFERENCES "public"."project_manager_sales_proposal_premisses_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_premisses_definitions" ADD CONSTRAINT "project_manager_sales_proposal_premisses_definitions_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_pricing_items" ADD CONSTRAINT "project_manager_sales_proposal_pricing_items_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_pricing_items" ADD CONSTRAINT "project_manager_sales_proposal_pricing_items_proposta_venda_id_project_manager_sales_proposals_id_fk" FOREIGN KEY ("proposta_venda_id") REFERENCES "public"."project_manager_sales_proposals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_products" ADD CONSTRAINT "project_manager_sales_proposal_products_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_products" ADD CONSTRAINT "project_manager_sales_proposal_products_proposta_venda_id_project_manager_sales_proposals_id_fk" FOREIGN KEY ("proposta_venda_id") REFERENCES "public"."project_manager_sales_proposals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_products" ADD CONSTRAINT "project_manager_sales_proposal_products_produto_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("produto_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_services" ADD CONSTRAINT "project_manager_sales_proposal_services_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_services" ADD CONSTRAINT "project_manager_sales_proposal_services_proposta_venda_id_project_manager_sales_proposals_id_fk" FOREIGN KEY ("proposta_venda_id") REFERENCES "public"."project_manager_sales_proposals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_services" ADD CONSTRAINT "project_manager_sales_proposal_services_servico_id_project_manager_services_id_fk" FOREIGN KEY ("servico_id") REFERENCES "public"."project_manager_services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_updates" ADD CONSTRAINT "project_manager_sales_proposal_updates_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_updates" ADD CONSTRAINT "project_manager_sales_proposal_updates_proposta_venda_id_project_manager_sales_proposals_id_fk" FOREIGN KEY ("proposta_venda_id") REFERENCES "public"."project_manager_sales_proposals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposal_updates" ADD CONSTRAINT "project_manager_sales_proposal_updates_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposals" ADD CONSTRAINT "project_manager_sales_proposals_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposals" ADD CONSTRAINT "project_manager_sales_proposals_cliente_id_project_manager_clients_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."project_manager_clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales_proposals" ADD CONSTRAINT "project_manager_sales_proposals_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sale_products" ADD CONSTRAINT "project_manager_sale_products_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sale_products" ADD CONSTRAINT "project_manager_sale_products_venda_id_project_manager_sales_id_fk" FOREIGN KEY ("venda_id") REFERENCES "public"."project_manager_sales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sale_products" ADD CONSTRAINT "project_manager_sale_products_produto_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("produto_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sale_responsibles" ADD CONSTRAINT "project_manager_sale_responsibles_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sale_responsibles" ADD CONSTRAINT "project_manager_sale_responsibles_venda_id_project_manager_sales_id_fk" FOREIGN KEY ("venda_id") REFERENCES "public"."project_manager_sales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sale_responsibles" ADD CONSTRAINT "project_manager_sale_responsibles_usuario_id_project_manager_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sale_services" ADD CONSTRAINT "project_manager_sale_services_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sale_services" ADD CONSTRAINT "project_manager_sale_services_venda_id_project_manager_sales_id_fk" FOREIGN KEY ("venda_id") REFERENCES "public"."project_manager_sales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sale_services" ADD CONSTRAINT "project_manager_sale_services_servico_id_project_manager_services_id_fk" FOREIGN KEY ("servico_id") REFERENCES "public"."project_manager_services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales" ADD CONSTRAINT "project_manager_sales_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales" ADD CONSTRAINT "project_manager_sales_cliente_id_project_manager_clients_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."project_manager_clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_sales" ADD CONSTRAINT "project_manager_sales_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_user_group_permissions" ADD CONSTRAINT "project_manager_user_group_permissions_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_user_group_permissions" ADD CONSTRAINT "project_manager_user_group_permissions_grupo_usuarios_id_project_manager_user_groups_id_fk" FOREIGN KEY ("grupo_usuarios_id") REFERENCES "public"."project_manager_user_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_user_groups" ADD CONSTRAINT "project_manager_user_groups_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_journey_type_step_dependencies" ADD CONSTRAINT "project_manager_project_journey_type_step_dependencies_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_journey_type_step_dependencies" ADD CONSTRAINT "project_manager_project_journey_type_step_dependencies_jornada_projeto_etapa_dependente_id_project_manager_project_journey_type_steps_id_fk" FOREIGN KEY ("jornada_projeto_etapa_dependente_id") REFERENCES "public"."project_manager_project_journey_type_steps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_journey_type_step_dependencies" ADD CONSTRAINT "project_manager_project_journey_type_step_dependencies_jornada_projeto_etapa_dependencia_id_project_manager_project_journey_type_steps_id_fk" FOREIGN KEY ("jornada_projeto_etapa_dependencia_id") REFERENCES "public"."project_manager_project_journey_type_steps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_journey_type_steps" ADD CONSTRAINT "project_manager_project_journey_type_steps_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_journey_type_steps" ADD CONSTRAINT "project_manager_project_journey_type_steps_tipo_jornada_projeto_id_project_manager_project_journey_types_id_fk" FOREIGN KEY ("tipo_jornada_projeto_id") REFERENCES "public"."project_manager_project_journey_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_journey_types" ADD CONSTRAINT "project_manager_project_journey_types_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_project_journey_types" ADD CONSTRAINT "project_manager_project_journey_types_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_pricing_method_item_results" ADD CONSTRAINT "project_manager_pricing_method_item_results_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_pricing_method_item_results" ADD CONSTRAINT "project_manager_pricing_method_item_results_metodologia_preficicacao_item_id_project_manager_pricing_method_items_id_fk" FOREIGN KEY ("metodologia_preficicacao_item_id") REFERENCES "public"."project_manager_pricing_method_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_pricing_method_items" ADD CONSTRAINT "project_manager_pricing_method_items_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_pricing_method_items" ADD CONSTRAINT "project_manager_pricing_method_items_metodologia_preficicacao_id_project_manager_pricing_methods_id_fk" FOREIGN KEY ("metodologia_preficicacao_id") REFERENCES "public"."project_manager_pricing_methods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_pricing_methods" ADD CONSTRAINT "project_manager_pricing_methods_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_pricing_methods" ADD CONSTRAINT "project_manager_pricing_methods_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis" ADD CONSTRAINT "project_manager_technical_analysis_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis" ADD CONSTRAINT "project_manager_technical_analysis_cliente_id_project_manager_clients_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."project_manager_clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis" ADD CONSTRAINT "project_manager_technical_analysis_proposta_venda_id_project_manager_sales_proposals_id_fk" FOREIGN KEY ("proposta_venda_id") REFERENCES "public"."project_manager_sales_proposals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis" ADD CONSTRAINT "project_manager_technical_analysis_venda_id_project_manager_sales_id_fk" FOREIGN KEY ("venda_id") REFERENCES "public"."project_manager_sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis" ADD CONSTRAINT "project_manager_technical_analysis_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis" ADD CONSTRAINT "project_manager_technical_analysis_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_analysts" ADD CONSTRAINT "project_manager_technical_analysis_analysts_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_analysts" ADD CONSTRAINT "project_manager_technical_analysis_analysts_analise_tecnica_id_project_manager_technical_analysis_id_fk" FOREIGN KEY ("analise_tecnica_id") REFERENCES "public"."project_manager_technical_analysis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_analysts" ADD CONSTRAINT "project_manager_technical_analysis_analysts_usuario_id_project_manager_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."project_manager_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_conditions" ADD CONSTRAINT "project_manager_technical_analysis_conditions_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_conditions" ADD CONSTRAINT "project_manager_technical_analysis_conditions_analise_tecnica_id_project_manager_technical_analysis_id_fk" FOREIGN KEY ("analise_tecnica_id") REFERENCES "public"."project_manager_technical_analysis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_external_references" ADD CONSTRAINT "project_manager_technical_analysis_external_references_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_external_references" ADD CONSTRAINT "project_manager_technical_analysis_external_references_analise_tecnica_id_project_manager_technical_analysis_id_fk" FOREIGN KEY ("analise_tecnica_id") REFERENCES "public"."project_manager_technical_analysis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_external_references" ADD CONSTRAINT "project_manager_technical_analysis_external_references_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_locations" ADD CONSTRAINT "project_manager_technical_analysis_locations_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_locations" ADD CONSTRAINT "project_manager_technical_analysis_locations_analise_tecnica_id_project_manager_technical_analysis_id_fk" FOREIGN KEY ("analise_tecnica_id") REFERENCES "public"."project_manager_technical_analysis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_measurements" ADD CONSTRAINT "project_manager_technical_analysis_measurements_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_measurements" ADD CONSTRAINT "project_manager_technical_analysis_measurements_analise_tecnica_id_project_manager_technical_analysis_id_fk" FOREIGN KEY ("analise_tecnica_id") REFERENCES "public"."project_manager_technical_analysis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_result_avaliations" ADD CONSTRAINT "project_manager_technical_analysis_result_avaliations_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_result_avaliations" ADD CONSTRAINT "project_manager_technical_analysis_result_avaliations_analise_tecnica_id_project_manager_technical_analysis_id_fk" FOREIGN KEY ("analise_tecnica_id") REFERENCES "public"."project_manager_technical_analysis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_result_conclusion" ADD CONSTRAINT "project_manager_technical_analysis_result_conclusion_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_result_conclusion" ADD CONSTRAINT "project_manager_technical_analysis_result_conclusion_analise_tecnica_id_project_manager_technical_analysis_id_fk" FOREIGN KEY ("analise_tecnica_id") REFERENCES "public"."project_manager_technical_analysis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_result_conclusion" ADD CONSTRAINT "project_manager_technical_analysis_result_conclusion_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_result_costs" ADD CONSTRAINT "project_manager_technical_analysis_result_costs_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_result_costs" ADD CONSTRAINT "project_manager_technical_analysis_result_costs_analise_tecnica_id_project_manager_technical_analysis_id_fk" FOREIGN KEY ("analise_tecnica_id") REFERENCES "public"."project_manager_technical_analysis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_result_costs" ADD CONSTRAINT "project_manager_technical_analysis_result_costs_proposta_venda_item_preco_id_project_manager_sales_proposal_pricing_items_id_fk" FOREIGN KEY ("proposta_venda_item_preco_id") REFERENCES "public"."project_manager_sales_proposal_pricing_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_result_resources" ADD CONSTRAINT "project_manager_technical_analysis_result_resources_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_result_resources" ADD CONSTRAINT "project_manager_technical_analysis_result_resources_analise_tecnica_id_project_manager_technical_analysis_id_fk" FOREIGN KEY ("analise_tecnica_id") REFERENCES "public"."project_manager_technical_analysis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_technical_analysis_result_resources" ADD CONSTRAINT "project_manager_technical_analysis_result_resources_ativo_fisico_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("ativo_fisico_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_products" ADD CONSTRAINT "project_manager_products_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_products" ADD CONSTRAINT "project_manager_products_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_services" ADD CONSTRAINT "project_manager_services_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_services" ADD CONSTRAINT "project_manager_services_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kit_products" ADD CONSTRAINT "project_manager_kit_products_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kit_products" ADD CONSTRAINT "project_manager_kit_products_kit_id_project_manager_kits_id_fk" FOREIGN KEY ("kit_id") REFERENCES "public"."project_manager_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kit_products" ADD CONSTRAINT "project_manager_kit_products_produto_id_project_manager_physical_assets_id_fk" FOREIGN KEY ("produto_id") REFERENCES "public"."project_manager_physical_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kit_services" ADD CONSTRAINT "project_manager_kit_services_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kit_services" ADD CONSTRAINT "project_manager_kit_services_kit_id_project_manager_kits_id_fk" FOREIGN KEY ("kit_id") REFERENCES "public"."project_manager_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kit_services" ADD CONSTRAINT "project_manager_kit_services_servico_id_project_manager_services_id_fk" FOREIGN KEY ("servico_id") REFERENCES "public"."project_manager_services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kits" ADD CONSTRAINT "project_manager_kits_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kits" ADD CONSTRAINT "project_manager_kits_metodologia_precificacao_id_project_manager_pricing_methods_id_fk" FOREIGN KEY ("metodologia_precificacao_id") REFERENCES "public"."project_manager_pricing_methods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kits" ADD CONSTRAINT "project_manager_kits_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_board_item_connections" ADD CONSTRAINT "project_manager_kanban_board_item_connections_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_board_item_connections" ADD CONSTRAINT "project_manager_kanban_board_item_connections_quadro_id_project_manager_kanban_boards_id_fk" FOREIGN KEY ("quadro_id") REFERENCES "public"."project_manager_kanban_boards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_board_item_connections" ADD CONSTRAINT "project_manager_kanban_board_item_connections_estagio_id_project_manager_kanban_board_stages_id_fk" FOREIGN KEY ("estagio_id") REFERENCES "public"."project_manager_kanban_board_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_board_item_connections" ADD CONSTRAINT "project_manager_kanban_board_item_connections_proposta_venda_id_project_manager_sales_proposals_id_fk" FOREIGN KEY ("proposta_venda_id") REFERENCES "public"."project_manager_sales_proposals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_board_item_connections" ADD CONSTRAINT "project_manager_kanban_board_item_connections_venda_id_project_manager_sales_id_fk" FOREIGN KEY ("venda_id") REFERENCES "public"."project_manager_sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_board_item_connections" ADD CONSTRAINT "project_manager_kanban_board_item_connections_projeto_id_project_manager_projects_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."project_manager_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_board_item_connections" ADD CONSTRAINT "project_manager_kanban_board_item_connections_compra_id_project_manager_purchases_id_fk" FOREIGN KEY ("compra_id") REFERENCES "public"."project_manager_purchases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_board_item_connections" ADD CONSTRAINT "project_manager_kanban_board_item_connections_homologacao_id_project_manager_homologations_id_fk" FOREIGN KEY ("homologacao_id") REFERENCES "public"."project_manager_homologations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_board_item_connections" ADD CONSTRAINT "project_manager_kanban_board_item_connections_ordem_servico_id_project_manager_service_orders_id_fk" FOREIGN KEY ("ordem_servico_id") REFERENCES "public"."project_manager_service_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_board_stages" ADD CONSTRAINT "project_manager_kanban_board_stages_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_board_stages" ADD CONSTRAINT "project_manager_kanban_board_stages_quadro_id_project_manager_kanban_boards_id_fk" FOREIGN KEY ("quadro_id") REFERENCES "public"."project_manager_kanban_boards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_boards" ADD CONSTRAINT "project_manager_kanban_boards_parceiro_id_project_manager_partners_id_fk" FOREIGN KEY ("parceiro_id") REFERENCES "public"."project_manager_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_manager_kanban_boards" ADD CONSTRAINT "project_manager_kanban_boards_autor_id_project_manager_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."project_manager_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ativo_fisico_nome_index" ON "project_manager_physical_assets" USING gin (to_tsvector('portuguese', "nome"));--> statement-breakpoint
CREATE INDEX "ativo_fisico_numero_serie_index" ON "project_manager_physical_assets" USING btree ("numero_serie");--> statement-breakpoint
CREATE INDEX "ativo_fisico_potencia_index" ON "project_manager_physical_assets" USING btree ("metadados_potencia");--> statement-breakpoint
CREATE INDEX "verification_code_user_idx" ON "project_manager_email_verification_codes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_code_email_idx" ON "project_manager_email_verification_codes" USING btree ("email");--> statement-breakpoint
CREATE INDEX "password_token_user_idx" ON "project_manager_password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_idx" ON "project_manager_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cliente_nome_search_index" ON "project_manager_clients" USING gin (to_tsvector('portuguese', "nome"));--> statement-breakpoint
CREATE INDEX "cliente_cpf_cnpj_index" ON "project_manager_clients" USING btree ("cpf_cnpj");--> statement-breakpoint
CREATE INDEX "cliente_telefone_primario_index" ON "project_manager_clients" USING btree ("telefone_primario");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "project_manager_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_discord_idx" ON "project_manager_users" USING btree ("discord_id");--> statement-breakpoint
CREATE INDEX "user_google_idx" ON "project_manager_users" USING btree ("google_id");--> statement-breakpoint
CREATE INDEX "projeto_nome_search_index" ON "project_manager_projects" USING gin (to_tsvector('portuguese', "nome"));--> statement-breakpoint
CREATE INDEX "projeto_indexer_index" ON "project_manager_projects" USING btree ("indexador");--> statement-breakpoint
CREATE INDEX "compra_titulo_search_index" ON "project_manager_purchases" USING gin (to_tsvector('portuguese', "titulo"));--> statement-breakpoint
CREATE INDEX "ordem_servico_descricao_search_index" ON "project_manager_service_orders" USING gin (to_tsvector('portuguese', "descricao"));--> statement-breakpoint
CREATE INDEX "ordem_servico_favorecido_search_index" ON "project_manager_service_orders" USING gin (to_tsvector('portuguese', "favorecido_nome"));--> statement-breakpoint
CREATE INDEX "proposta_venda_titulo_search_index" ON "project_manager_sales_proposals" USING gin (to_tsvector('portuguese', "titulo"));--> statement-breakpoint
CREATE INDEX "proposta_venda_data_ganho_idx" ON "project_manager_sales_proposals" USING btree ("data_ganho");--> statement-breakpoint
CREATE INDEX "proposta_venda_perda_data_idx" ON "project_manager_sales_proposals" USING btree ("perda_data");--> statement-breakpoint
CREATE INDEX "proposta_venda_data_insercao_idx" ON "project_manager_sales_proposals" USING btree ("data_insercao");--> statement-breakpoint
CREATE INDEX "venda_nome_search_index" ON "project_manager_sales" USING gin (to_tsvector('portuguese', "nome"));--> statement-breakpoint
CREATE INDEX "analise_tecnica_titulo_search_index" ON "project_manager_technical_analysis" USING gin (to_tsvector('portuguese', "titulo"));--> statement-breakpoint
CREATE INDEX "produto_categoria_idx" ON "project_manager_products" USING btree ("produto_categoria");