import { z } from "zod";
const TechnicalAnalysisMeasurementTypeEnumSchema = z.enum([
    // Físicas
    "COMPRIMENTO",
    "ÁREA",
    "VOLUME",
    "PESO",
    "PRESSÃO",
    // Elétricas
    "POTÊNCIA",
    "TENSÃO",
    "CORRENTE",
    // Ambientais
    "TEMPERATURA",
    "IRRADIAÇÃO",
    "UMIDADE",
    "VELOCIDADE DO VENTO",
    // Geométricas
    "ÂNGULO",
    "ORIENTAÇÃO",
    // Desempenho
    "EFICIÊNCIA",
    "PERDA",
]);
export type TTechnicalAnalysisMeasurementType = z.infer<typeof TechnicalAnalysisMeasurementTypeEnumSchema>;

const TechnicalAnalysisResultAvaliationLabelEnumSchema = z.enum(["POSITIVO", "NEGATIVO", "ATENÇÃO"]);
export type TTechnicalAnalysisResultAvaliationLabelEnum = z.infer<typeof TechnicalAnalysisResultAvaliationLabelEnumSchema>;

export const TechnicalAnalysisMetadataSolarSchema = z.object({
    potenciaTotalModulos: z.number({
        required_error: "Potência total dos módulos não informada.",
        invalid_type_error: "Tipo não válido para a potência total dos módulos.",
    }),
    potenciaTotalInversores: z.number({
        required_error: "Potência total dos inversores não informada.",
        invalid_type_error: "Tipo não válido para a potência total dos inversores.",
    }),
    modulos: z.array(
        z.object({
            ativoFisicoId: z.string({
                required_error: "ID do ativo físico não informado.",
                invalid_type_error: "Tipo não válido para o ID do ativo físico.",
            }),
            quantidade: z.number({
                required_error: "Quantidade de módulos não informada.",
                invalid_type_error: "Tipo não válido para a quantidade de módulos.",
            }),
            fabricante: z.string({
                required_error: "Fabricante não informado.",
                invalid_type_error: "Tipo não válido para o fabricante.",
            }),
            modelo: z.string({
                required_error: "Modelo não informado.",
                invalid_type_error: "Tipo não válido para o modelo.",
            }),
            potencia: z.number({
                required_error: "Potência do módulo não informada.",
                invalid_type_error: "Tipo não válido para a potência do módulo.",
            }),
            orientacao: z.string({
                required_error: "Orientação não informada.",
                invalid_type_error: "Tipo não válido para a orientação.",
            }),
        }),
    ),
    analiseAnual: z.array(
        z.object({
            mes: z.number({ required_error: "Mês não informado.", invalid_type_error: "Tipo não válido para o mês." }),
            fator: z.number({
                required_error: "Fator de geração do mês não informado.",
                invalid_type_error: "Tipo não válido para o fator de geração do mês.",
            }),
            geracao: z.number({ required_error: "Geração do mês não informada.", invalid_type_error: "Tipo não válido para a geração do mês." }),
            consumo: z.number({ required_error: "Consumo do mês não informado.", invalid_type_error: "Tipo não válido para o consumo do mês." }),
        }),
    ),
    arquivos: z.object({
        desenhoTelhado: z.object({
            url: z
                .string({
                    required_error: "URL do desenho do telhado não informada.",
                    invalid_type_error: "Tipo não válido para a URL do desenho do telhado.",
                })
                .optional()
                .nullable(),
            idArquivoReferencia: z
                .string({
                    required_error: "ID do arquivo de referência do desenho do telhado não informado.",
                    invalid_type_error: "Tipo não válido para o ID do arquivo de referência do desenho do telhado.",
                })
                .optional()
                .nullable(),
            tamanho: z
                .number({
                    required_error: "Tamanho do arquivo não informado.",
                    invalid_type_error: "Tipo não válido para o tamanho do arquivo.",
                })
                .optional()
                .nullable(),
            formato: z
                .string({
                    required_error: "Formato do arquivo não informado.",
                    invalid_type_error: "Tipo não válido para o formato do arquivo.",
                })
                .optional()
                .nullable(),
        }),
        diagramaUnifilar: z.object({
            url: z
                .string({
                    required_error: "URL do diagrama unifilar não informada.",
                    invalid_type_error: "Tipo não válido para a URL do diagrama unifilar.",
                })
                .optional()
                .nullable(),
            idArquivoReferencia: z
                .string({
                    required_error: "ID do arquivo de referência do diagrama unifilar não informado.",
                    invalid_type_error: "Tipo não válido para o ID do arquivo de referência do diagrama unifilar.",
                })
                .optional()
                .nullable(),
            tamanho: z
                .number({
                    required_error: "Tamanho do arquivo não informado.",
                    invalid_type_error: "Tipo não válido para o tamanho do arquivo.",
                })
                .optional()
                .nullable(),
            formato: z
                .string({
                    required_error: "Formato do arquivo não informado.",
                    invalid_type_error: "Tipo não válido para o formato do arquivo.",
                })
                .optional()
                .nullable(),
        }),
    }),
});
export type TTechnicalAnalysisMetadataSolar = z.infer<typeof TechnicalAnalysisMetadataSolarSchema>;
export const TechnicalAnalysisMetadataSchema = z.object({
    solar: TechnicalAnalysisMetadataSolarSchema,
});
export type TTechnicalAnalysisMetadata = z.infer<typeof TechnicalAnalysisMetadataSchema>;

const TechnicalAnalysisSchema = z.object({
    parceiroId: z.string({
        required_error: "ID de referência do parceiro não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do parceiro.",
    }),
    clienteId: z.string({
        required_error: "ID de referência do cliente não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do cliente.",
    }),
    propostaVendaId: z.string({ invalid_type_error: "Tipo não válido para o ID de referência da proposta." }).optional().nullable(),
    vendaId: z.string({ invalid_type_error: "Tipo não válido para o ID de referência da venda." }).optional().nullable(),
    projetoId: z.string({ invalid_type_error: "Tipo não válido para o ID de referência do projeto." }).optional().nullable(),
    indexador: z.number({
        required_error: "Indexador não informado.",
        invalid_type_error: "Tipo não válido para o indexador.",
    }),
    titulo: z.string({
        required_error: "Título não informado.",
        invalid_type_error: "Tipo não válido para o título.",
    }),
    anotacoes: z.string({ invalid_type_error: "Tipo não válido para anotações." }).optional().nullable(),
    status: z.string({
        required_error: "Status não informado.",
        invalid_type_error: "Tipo não válido para o status.",
    }),
    localizacaoCep: z.string({ invalid_type_error: "Tipo não válido para CEP." }).optional().nullable(),
    localizacaoUf: z.string({ invalid_type_error: "Tipo não válido para UF." }).optional().nullable(),
    localizacaoCidade: z.string({ invalid_type_error: "Tipo não válido para cidade." }).optional().nullable(),
    localizacaoBairro: z.string({ invalid_type_error: "Tipo não válido para bairro." }).optional().nullable(),
    localizacaoLogradouro: z.string({ invalid_type_error: "Tipo não válido para logradouro." }).optional().nullable(),
    localizacaoNumero: z.string({ invalid_type_error: "Tipo não válido para número." }).optional().nullable(),
    localizacaoComplemento: z.string({ invalid_type_error: "Tipo não válido para complemento." }).optional().nullable(),
    localizacaoLatitude: z.string({ invalid_type_error: "Tipo não válido para latitude." }).optional().nullable(),
    localizacaoLongitude: z.string({ invalid_type_error: "Tipo não válido para longitude." }).optional().nullable(),
    dataPrevisaoEfetivacao: z.date({ invalid_type_error: "Tipo não válido para data de efetivação." }).optional().nullable(),
    dataEfetivacao: z.date({ invalid_type_error: "Tipo não válido para data de efetivação." }).optional().nullable(),
    dataInsercao: z.date({ invalid_type_error: "Tipo não válido para data de inserção." }).optional(),
    metadados: TechnicalAnalysisMetadataSchema.optional().nullable(),
    autorId: z.string({
        required_error: "ID de referência do autor não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do autor.",
    }),
});

const TechnicalAnalysisExternalReferenceSchema = z.object({
    parceiroId: z.string({
        required_error: "ID de referência do parceiro não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do parceiro.",
    }),
    analiseTecnicaId: z.string({
        required_error: "ID de referência da análise técnica não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência da análise técnica.",
    }),
    titulo: z.string({
        required_error: "Título não informado.",
        invalid_type_error: "Tipo não válido para o título.",
    }),
    url: z.string({
        required_error: "URL não informada.",
        invalid_type_error: "Tipo não válido para a URL.",
    }),
    autorId: z.string({
        required_error: "ID de referência do autor não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do autor.",
    }),
});

const TechnicalAnalysisAnalystSchema = z.object({
    parceiroId: z.string({
        required_error: "ID de referência do parceiro não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do parceiro.",
    }),
    analiseTecnicaId: z.string({
        required_error: "ID de referência da análise técnica não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência da análise técnica.",
    }),
    usuarioId: z.string({
        required_error: "ID de referência do usuário não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do usuário.",
    }),
});

const TechnicalAnalysisConditionMetadataSchema = z.object({
    tipo: z.string({ required_error: "Tipo de metadados não informado." }).optional().nullable(),
    dados: z.array(
        z.object({
            titulo: z.string({ required_error: "Título do metadado não informado.", invalid_type_error: "Tipo não válido para o título do metadado." }),
            identificador: z.string({
                required_error: "Identificador do metadado não informado.",
                invalid_type_error: "Tipo não válido para o identificador do metadado.",
            }),
            valor: z.string({ required_error: "Valor do metadado não informado.", invalid_type_error: "Tipo não válido para o valor do metadado." }),
        }),
    ),
});
export type TTechnicalAnalysisConditionMetadata = z.infer<typeof TechnicalAnalysisConditionMetadataSchema>;
const TechnicalAnalysisConditionSchema = z.object({
    parceiroId: z.string({
        required_error: "ID de referência do parceiro não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do parceiro.",
    }),
    analiseTecnicaId: z.string({
        required_error: "ID de referência da análise técnica não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência da análise técnica.",
    }),
    titulo: z.string({
        required_error: "Título não informado.",
        invalid_type_error: "Tipo não válido para o título.",
    }),
    observacoes: z.string({ invalid_type_error: "Tipo não válido para observações." }).optional().nullable(),
    metadata: TechnicalAnalysisConditionMetadataSchema,
});

const TechnicalAnalysisMeasurementSchema = z.object({
    parceiroId: z.string({
        required_error: "ID de referência do parceiro não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do parceiro.",
    }),
    analiseTecnicaId: z.string({
        required_error: "ID de referência da análise técnica não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência da análise técnica.",
    }),
    tipo: TechnicalAnalysisMeasurementTypeEnumSchema,
    titulo: z.string({
        required_error: "Título não informado.",
        invalid_type_error: "Tipo não válido para o título.",
    }),
    identificador: z.string({
        required_error: "Identificador não informado.",
        invalid_type_error: "Tipo não válido para o identificador.",
    }),
    valor: z.string({
        required_error: "Valor não informado.",
        invalid_type_error: "Tipo não válido para o valor.",
    }),
    unidade: z.string({
        required_error: "Unidade não informada.",
        invalid_type_error: "Tipo não válido para a unidade.",
    }),
    observacoes: z.string({ invalid_type_error: "Tipo não válido para observações." }).optional().nullable(),
});

const TechnicalAnalysisLocationSchema = z.object({
    parceiroId: z.string({
        required_error: "ID de referência do parceiro não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do parceiro.",
    }),
    analiseTecnicaId: z.string({
        required_error: "ID de referência da análise técnica não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência da análise técnica.",
    }),
    titulo: z.string({
        required_error: "Título não informado.",
        invalid_type_error: "Tipo não válido para o título.",
    }),
    identificador: z.string({
        required_error: "Identificador não informado.",
        invalid_type_error: "Tipo não válido para o identificador.",
    }),
    local: z.string({
        required_error: "Local não informado.",
        invalid_type_error: "Tipo não válido para o local.",
    }),
    coordenadasLatitude: z.string({ invalid_type_error: "Tipo não válido para latitude." }).optional().nullable(),
    coordenadasLongitude: z.string({ invalid_type_error: "Tipo não válido para longitude." }).optional().nullable(),
});

const TechnicalAnalysisResultCostSchema = z.object({
    parceiroId: z.string({
        required_error: "ID de referência do parceiro não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do parceiro.",
    }),
    analiseTecnicaId: z.string({
        required_error: "ID de referência da análise técnica não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência da análise técnica.",
    }),
    propostaVendaItemPrecoId: z.string({ invalid_type_error: "Tipo não válido para o ID do item preço da proposta de venda." }).optional().nullable(),
    nome: z.string({
        required_error: "Título não informado.",
        invalid_type_error: "Tipo não válido para o título.",
    }),
    custo: z.number({
        required_error: "Valor do custo não informado.",
        invalid_type_error: "Tipo não válido para o valor do custo.",
    }),
    observacoes: z.string({ invalid_type_error: "Tipo não válido para observações." }).optional().nullable(),
});

const TechnicalAnalysisResultResourceSchema = z.object({
    parceiroId: z.string({
        required_error: "ID de referência do parceiro não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do parceiro.",
    }),
    analiseTecnicaId: z.string({
        required_error: "ID de referência da análise técnica não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência da análise técnica.",
    }),
    ativoFisicoId: z.string({ invalid_type_error: "Tipo não válido para o ID do ativo físico." }),
    quantidade: z.number({
        required_error: "Quantidade não informada.",
        invalid_type_error: "Tipo não válido para a quantidade.",
    }),
    observacoes: z.string({ invalid_type_error: "Tipo não válido para observações." }).optional().nullable(),
    dataInsercao: z.date({ invalid_type_error: "Tipo não válido para a data de inserção." }).optional(),
});

const TechnicalAnalysisResultConclusionSchema = z.object({
    parceiroId: z.string({
        required_error: "ID de referência do parceiro não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do parceiro.",
    }),
    analiseTecnicaId: z.string({
        required_error: "ID de referência da análise técnica não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência da análise técnica.",
    }),
    titulo: z.string({
        required_error: "Nome do custo não informado.",
        invalid_type_error: "Tipo não válido para o nome do custo.",
    }),
    conteudo: z.string({
        required_error: "Conteúdo não informado.",
        invalid_type_error: "Tipo não válido para o conteúdo.",
    }),
    visibilidadeTecnica: z.boolean({
        required_error: "Visibilidade técnica não informada.",
        invalid_type_error: "Tipo não válido para a visibilidade técnica.",
    }),
    visibilidadePublica: z.boolean({
        required_error: "Visibilidade pública não informada.",
        invalid_type_error: "Tipo não válido para a visibilidade pública.",
    }),
    autorId: z.string({
        required_error: "ID de referência do autor não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do autor.",
    }),
});

const TechnicalAnalysisResultAvaliationSchema = z.object({
    parceiroId: z.string({
        required_error: "ID de referência do parceiro não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência do parceiro.",
    }),
    analiseTecnicaId: z.string({
        required_error: "ID de referência da análise técnica não informado.",
        invalid_type_error: "Tipo não válido para o ID de referência da análise técnica.",
    }),
    item: z.string({
        required_error: "Item não informado.",
        invalid_type_error: "Tipo não válido para o item.",
    }),
    valor: z.string({
        required_error: "Valor não informado.",
        invalid_type_error: "Tipo não válido para o valor.",
    }),
    rotulo: TechnicalAnalysisResultAvaliationLabelEnumSchema,
});

export {
    TechnicalAnalysisSchema,
    TechnicalAnalysisExternalReferenceSchema,
    TechnicalAnalysisAnalystSchema,
    TechnicalAnalysisConditionSchema,
    TechnicalAnalysisMeasurementSchema,
    TechnicalAnalysisLocationSchema,
    TechnicalAnalysisResultCostSchema,
    TechnicalAnalysisResultResourceSchema,
    TechnicalAnalysisResultConclusionSchema,
    TechnicalAnalysisResultAvaliationSchema,
};
