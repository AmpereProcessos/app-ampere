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
  autor: AuthorSchema,
  dataInsercao: z
    .string({
      required_error: "Data de inserção não informada.",
      invalid_type_error: "Tipo inválido para a data de inserção.",
    })
    .datetime({ message: "Tipo inválido para a data de inserção." }),
});
export type TFinancialTransaction = z.infer<typeof FinancialTransactionSchema>;
