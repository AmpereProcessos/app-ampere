import { z } from "zod";
import { AuthorSchema } from "./users";

const AccountsChartNatureEnumSchema = z.enum([
  "ATIVO",
  "PASSIVO",
  "PATRIMONIO_LIQUIDO",
  "RECEITA",
  "CUSTO",
  "DESPESA",
]);
export type TAccountsChartNatureEnum = z.infer<typeof AccountsChartNatureEnumSchema>;
export const AccountsChartSchema = z.object({
  nome: z.string({
    required_error: "Nome não informado.",
    invalid_type_error: "Tipo inválido para o nome.",
  }),
  codigo: z.string({
    required_error: "Código não informado.",
    invalid_type_error: "Tipo inválido para o código.",
  }),
  natureza: AccountsChartNatureEnumSchema,
  contaPai: z.object({
    id: z.string({
      required_error: "ID da conta pai não informado.",
      invalid_type_error: "Tipo inválido para o ID da conta pai.",
    }),
    nome: z.string({
      required_error: "Nome da conta pai não informado.",
      invalid_type_error: "Tipo inválido para o nome da conta pai.",
    }),
    natureza: AccountsChartNatureEnumSchema,
  }),
  dataInsercao: z
    .string({
      required_error: "Data de inserção não informada.",
      invalid_type_error: "Tipo inválido para a data de inserção.",
    })
    .datetime({ message: "Tipo inválido para a data de inserção." }),
});
export type TAccountsChart = z.infer<typeof AccountsChartSchema>;

export const AccountingEntriesSchema = z.object({
  titulo: z.string({
    required_error: "Título não informado.",
    invalid_type_error: "Tipo inválido para o título.",
  }),
  anotacoes: z.string({
    invalid_type_error: "Tipo inválido para as anotações.",
  }),
  contaDebito: z.object({
    id: z.string({
      required_error: "ID da conta débito não informado.",
      invalid_type_error: "Tipo inválido para o ID da conta débito.",
    }),
    nome: z.string({
      required_error: "Nome da conta débito não informado.",
      invalid_type_error: "Tipo inválido para o nome da conta débito.",
    }),
  }),
  contaCredito: z.object({
    id: z.string({
      required_error: "ID da conta crédito não informado.",
      invalid_type_error: "Tipo inválido para o ID da conta crédito.",
    }),
    nome: z.string({
      required_error: "Nome da conta crédito não informado.",
      invalid_type_error: "Tipo inválido para o nome da conta crédito.",
    }),
  }),
  projeto: z
    .object({
      identificador: z.string({
        required_error: "Identificador do projeto não informado.",
        invalid_type_error: "Tipo inválido para o identificador do projeto.",
      }),
      id: z.string({
        required_error: "ID do projeto não informado.",
        invalid_type_error: "Tipo inválido para o ID do projeto.",
      }),
      nome: z.string({
        required_error: "Nome do projeto não informado.",
        invalid_type_error: "Tipo inválido para o nome do projeto.",
      }),
    })
    .optional()
    .nullable(),
  valor: z.number({
    required_error: "Valor não informado.",
    invalid_type_error: "Tipo inválido para o valor.",
  }),
  valorPrevisto: z.number({
    required_error: "Valor previsto não informado.",
    invalid_type_error: "Tipo inválido para o valor previsto.",
  }),
  dataCompetencia: z
    .string({
      required_error: "Data de competência não informada.",
      invalid_type_error: "Tipo inválido para a data de competência.",
    })
    .datetime({ message: "Tipo inválido para a data de competência." }),
  autor: AuthorSchema,
  dataInsercao: z
    .string({
      required_error: "Data de inserção não informada.",
      invalid_type_error: "Tipo inválido para a data de inserção.",
    })
    .datetime({ message: "Tipo inválido para a data de inserção." }),
});

export type TAccountingEntry = z.infer<typeof AccountingEntriesSchema>;

const FinancialAccountsTypeEnumSchema = z.enum(["CAIXA", "CARTEIRA_DIGITAL", "BANCO"]);
export type TFinancialAccountsTypeEnum = z.infer<typeof FinancialAccountsTypeEnumSchema>;
export const FinancialAccountsSchema = z.object({
  ativo: z.boolean({
    required_error: "Ativo não informado.",
    invalid_type_error: "Tipo inválido para o ativo.",
  }),
  nome: z.string({
    required_error: "Nome não informado.",
    invalid_type_error: "Tipo inválido para o nome.",
  }),
  descricao: z.string({
    required_error: "Descrição não informada.",
    invalid_type_error: "Tipo inválido para a descrição.",
  }),
  tipo: FinancialAccountsTypeEnumSchema,
  contaContabil: z.object({
    id: z.string({
      required_error: "ID da conta contábil não informado.",
      invalid_type_error: "Tipo inválido para o ID da conta contábil.",
    }),
    nome: z.string({
      required_error: "Nome da conta contábil não informado.",
      invalid_type_error: "Tipo inválido para o nome da conta contábil.",
    }),
  }),
  saldoInicial: z.object({
    valor: z.number({
      required_error: "Saldo inicial não informado.",
      invalid_type_error: "Tipo inválido para o saldo inicial.",
    }),
    data: z
      .string({
        required_error: "Data não informada.",
        invalid_type_error: "Tipo inválido para a data.",
      })
      .datetime({ message: "Tipo inválido para a data." }),
  }),
  // Bank specific details
  metadados: z
    .object({
      tipo: z.literal(FinancialAccountsTypeEnumSchema.Values.BANCO),
      nome: z.string({
        required_error: "Nome não informado.",
        invalid_type_error: "Tipo inválido para o nome.",
      }),
      codigo: z.string({
        required_error: "Código não informado.",
        invalid_type_error: "Tipo inválido para o código.",
      }),
      agencia: z.string({
        required_error: "Agência não informada.",
        invalid_type_error: "Tipo inválido para a agência.",
      }),
      numero: z.string({
        required_error: "Número da conta não informado.",
        invalid_type_error: "Tipo inválido para o número da conta.",
      }),
      digito: z.string({
        required_error: "Digito da conta não informado.",
        invalid_type_error: "Tipo inválido para o digito da conta.",
      }),
      tipoConta: z.enum(["CORRENTE", "POUPANÇA"]),
    })
    .optional()
    .nullable(),
  dataInsercao: z
    .string({
      required_error: "Data de inserção não informada.",
      invalid_type_error: "Tipo inválido para a data de inserção.",
    })
    .datetime({ message: "Tipo inválido para a data de inserção." }),
});

export type TFinancialAccounts = z.infer<typeof FinancialAccountsSchema>;

export const FinancialTransactionTypeEnumSchema = z.enum(["ENTRADA", "SAÍDA"]);
export type TFinancialTransactionTypeEnum = z.infer<typeof FinancialTransactionTypeEnumSchema>;
export const FinancialTransactionMethodEnumSchema = z.enum([
  "DINHEIRO",
  "CARTÃO DE DÉBITO",
  "CARTÃO DE CRÉDITO",
  "PIX",
  "TRANSFERÊNCIA",
  "BOLETO",
  "CHEQUE",
  "OUTRO",
  "A DEFINIR",
]);
export type TFinancialTransactionMethodEnum = z.infer<typeof FinancialTransactionMethodEnumSchema>;

export const FinancialTransactionSchema = z.object({
  lancamentoContabil: z.object({
    id: z.string({
      required_error: "ID do lançamento contábil não informado.",
      invalid_type_error: "Tipo inválido para o ID do lançamento contábil.",
    }),
    nome: z.string({
      required_error: "Nome do lançamento contábil não informado.",
      invalid_type_error: "Tipo inválido para o nome do lançamento contábil.",
    }),
  }),
  contaFinanceira: z.object({
    id: z.string({
      required_error: "ID da conta financeira não informado.",
      invalid_type_error: "Tipo inválido para o ID da conta financeira.",
    }),
    nome: z.string({
      required_error: "Nome da conta financeira não informado.",
      invalid_type_error: "Tipo inválido para o nome da conta financeira.",
    }),
    tipo: FinancialAccountsTypeEnumSchema,
  }),
  titulo: z.string({
    required_error: "Título não informado.",
    invalid_type_error: "Tipo inválido para o título.",
  }),
  tipo: FinancialTransactionTypeEnumSchema,
  valor: z.number({
    required_error: "Valor não informado.",
    invalid_type_error: "Tipo inválido para o valor.",
  }),
  metodo: FinancialTransactionMethodEnumSchema,
  dataPrevisao: z
    .string({
      required_error: "Data de previsão não informada.",
      invalid_type_error: "Tipo inválido para a data de previsão.",
    })
    .datetime({ message: "Tipo inválido para a data de previsão." }),
  dataEfetivacao: z
    .string({
      invalid_type_error: "Tipo inválido para a data de efetivação.",
    })
    .datetime({ message: "Tipo inválido para a data de efetivação." })
    .optional()
    .nullable(),
  parcela: z
    .number({
      invalid_type_error: "Tipo inválido para o número da parcela.",
    })
    .int()
    .optional()
    .nullable(),
  totalParcelas: z
    .number({
      invalid_type_error: "Tipo inválido para o total de parcelas.",
    })
    .int()
    .optional()
    .nullable(),
  provedorReferencia: z
    .string({
      invalid_type_error: "Tipo inválido para a referência do provedor.",
    })
    .optional()
    .nullable(),
  provedorStatus: z
    .string({
      invalid_type_error: "Tipo inválido para o status do provedor.",
    })
    .optional()
    .nullable(),
  conciliado: z
    .boolean({
      invalid_type_error: "Tipo inválido para o status de conciliação.",
    })
    .optional()
    .nullable(),
  conciliacaoId: z
    .string({
      invalid_type_error: "Tipo inválido para o ID da conciliação.",
    })
    .optional()
    .nullable(),
  dataReconciliacao: z
    .string({
      invalid_type_error: "Tipo inválido para a data de reconciliação.",
    })
    .datetime({ message: "Tipo inválido para a data de reconciliação." })
    .optional()
    .nullable(),
  referenciaExterno: z
    .string({
      invalid_type_error: "Tipo inválido para a referência externa.",
    })
    .optional()
    .nullable(),
  autor: AuthorSchema,
  dataInsercao: z
    .string({
      required_error: "Data de inserção não informada.",
      invalid_type_error: "Tipo inválido para a data de inserção.",
    })
    .datetime({ message: "Tipo inválido para a data de inserção." }),
});
export type TFinancialTransaction = z.infer<typeof FinancialTransactionSchema>;

/**
 * FINANCIAL RECONCILIATION
 *
 * Stores a "reconciliation session": user uploads a PDF bank statement, AI extracts
 * lines, the system matches them against transactions in the selected account/period,
 * and the user confirms. Each matched transaction is stamped with `conciliado`,
 * `conciliacaoId`, `dataReconciliacao` and `referenciaExterno`.
 */
export const FinancialReconciliationStatusEnumSchema = z.enum(["RASCUNHO", "CONCLUIDA"]);
export type TFinancialReconciliationStatus = z.infer<
  typeof FinancialReconciliationStatusEnumSchema
>;

export const FinancialReconciliationMatchStrategyEnumSchema = z.enum([
  "EXATA",
  "APROXIMADA",
  "IA",
  "MANUAL",
  "CRIADA",
]);
export type TFinancialReconciliationMatchStrategy = z.infer<
  typeof FinancialReconciliationMatchStrategyEnumSchema
>;

export const FinancialReconciliationExtractedLineSchema = z.object({
  id: z.string({
    required_error: "ID da linha extraída não informado.",
    invalid_type_error: "Tipo inválido para o ID da linha extraída.",
  }),
  data: z
    .string({
      required_error: "Data da linha extraída não informada.",
      invalid_type_error: "Tipo inválido para a data da linha extraída.",
    })
    .datetime({ message: "Tipo inválido para a data da linha extraída." }),
  descricao: z.string({
    required_error: "Descrição da linha extraída não informada.",
    invalid_type_error: "Tipo inválido para a descrição da linha extraída.",
  }),
  valor: z.number({
    required_error: "Valor da linha extraída não informado.",
    invalid_type_error: "Tipo inválido para o valor da linha extraída.",
  }),
  tipo: FinancialTransactionTypeEnumSchema,
  documento: z
    .string({
      invalid_type_error: "Tipo inválido para o documento da linha extraída.",
    })
    .optional()
    .nullable(),
});
export type TFinancialReconciliationExtractedLine = z.infer<
  typeof FinancialReconciliationExtractedLineSchema
>;

export const FinancialReconciliationMatchSchema = z.object({
  linhaId: z.string({
    required_error: "ID da linha não informado.",
    invalid_type_error: "Tipo inválido para o ID da linha.",
  }),
  transacaoId: z
    .string({
      invalid_type_error: "Tipo inválido para o ID da transação.",
    })
    .nullable(),
  transacaoCriadaId: z
    .string({
      invalid_type_error: "Tipo inválido para o ID da transação criada.",
    })
    .nullable()
    .optional(),
  score: z
    .number({
      required_error: "Score não informado.",
      invalid_type_error: "Tipo inválido para o score.",
    })
    .min(0)
    .max(1),
  estrategia: FinancialReconciliationMatchStrategyEnumSchema,
});
export type TFinancialReconciliationMatch = z.infer<typeof FinancialReconciliationMatchSchema>;

export const FinancialReconciliationSchema = z.object({
  contaFinanceira: z.object({
    id: z.string({
      required_error: "ID da conta financeira não informado.",
      invalid_type_error: "Tipo inválido para o ID da conta financeira.",
    }),
    nome: z.string({
      required_error: "Nome da conta financeira não informado.",
      invalid_type_error: "Tipo inválido para o nome da conta financeira.",
    }),
    tipo: FinancialAccountsTypeEnumSchema,
  }),
  periodo: z.object({
    inicio: z
      .string({
        required_error: "Data de início do período não informada.",
        invalid_type_error: "Tipo inválido para a data de início do período.",
      })
      .datetime({ message: "Tipo inválido para a data de início do período." }),
    fim: z
      .string({
        required_error: "Data de fim do período não informada.",
        invalid_type_error: "Tipo inválido para a data de fim do período.",
      })
      .datetime({ message: "Tipo inválido para a data de fim do período." }),
  }),
  pdf: z.object({
    url: z
      .string({
        required_error: "URL do PDF não informada.",
        invalid_type_error: "Tipo inválido para a URL do PDF.",
      })
      .url({ message: "URL do PDF inválida." }),
    nomeOriginal: z.string({
      required_error: "Nome original do PDF não informado.",
      invalid_type_error: "Tipo inválido para o nome original do PDF.",
    }),
  }),
  status: FinancialReconciliationStatusEnumSchema,
  linhasExtraidas: z.array(FinancialReconciliationExtractedLineSchema),
  matches: z.array(FinancialReconciliationMatchSchema),
  autor: AuthorSchema,
  dataInsercao: z
    .string({
      required_error: "Data de inserção não informada.",
      invalid_type_error: "Tipo inválido para a data de inserção.",
    })
    .datetime({ message: "Tipo inválido para a data de inserção." }),
});
export type TFinancialReconciliation = z.infer<typeof FinancialReconciliationSchema>;
