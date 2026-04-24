/**
 * FINANCIAL ACCOUNTS
 */

import {
  TCreateFinancialAccountInput,
  TCreateFinancialAccountOutput,
  TUpdateFinancialAccountInput,
  TUpdateFinancialAccountOutput,
} from "@/pages/api/financeiro/financial-accounts";
import axios from "axios";
import {
  TCreateFinancialTransactionInput,
  TCreateFinancialTransactionOutput,
  TUpdateFinancialTransactionInput,
  TUpdateFinancialTransactionOutput,
} from "@/pages/api/financeiro/financial-transactions";
import {
  TCreateAccountingEntryInput,
  TCreateAccountingEntryOutput,
  TUpdateAccountingEntryInput,
  TUpdateAccountingEntryOutput,
} from "@/pages/api/financeiro/accounting-entries";
import {
  TExtractReconciliationInput,
  TExtractReconciliationOutput,
} from "@/pages/api/financeiro/reconciliation/extract";
import {
  TMatchReconciliationInput,
  TMatchReconciliationOutput,
} from "@/pages/api/financeiro/reconciliation/match";
import {
  TCreateReconciliationInput,
  TCreateReconciliationOutput,
} from "@/pages/api/financeiro/reconciliation";

export async function createFinancialAccount(account: TCreateFinancialAccountInput) {
  const { data } = await axios.post<TCreateFinancialAccountOutput>(
    "/api/financeiro/financial-accounts",
    account,
  );
  return data;
}

export async function updateFinancialAccount(account: TUpdateFinancialAccountInput) {
  const { data } = await axios.put<TUpdateFinancialAccountOutput>(
    "/api/financeiro/financial-accounts",
    account,
  );
  return data;
}

/**
 * FINANCIAL TRANSACTIONS
 */

export async function createFinancialTransaction(transaction: TCreateFinancialTransactionInput) {
  const { data } = await axios.post<TCreateFinancialTransactionOutput>(
    "/api/financeiro/financial-transactions",
    transaction,
  );
  return data;
}

export async function updateFinancialTransaction(transaction: TUpdateFinancialTransactionInput) {
  const { data } = await axios.put<TUpdateFinancialTransactionOutput>(
    "/api/financeiro/financial-transactions",
    transaction,
  );
  return data;
}

/**
 * ACCOUNTING ENTRIES
 */

export async function createAccountingEntry(entry: TCreateAccountingEntryInput) {
  const { data } = await axios.post<TCreateAccountingEntryOutput>(
    "/api/financeiro/accounting-entries",
    entry,
  );
  return data;
}

export async function updateAccountingEntry(entry: TUpdateAccountingEntryInput) {
  const { data } = await axios.put<TUpdateAccountingEntryOutput>(
    "/api/financeiro/accounting-entries",
    entry,
  );
  return data;
}

/**
 * FINANCIAL RECONCILIATION
 */

export async function extractReconciliationFromPdf(input: TExtractReconciliationInput) {
  const { data } = await axios.post<TExtractReconciliationOutput>(
    "/api/financeiro/reconciliation/extract",
    input,
  );
  return data;
}

export async function matchReconciliation(input: TMatchReconciliationInput) {
  const { data } = await axios.post<TMatchReconciliationOutput>(
    "/api/financeiro/reconciliation/match",
    input,
  );
  return data;
}

export async function createReconciliation(input: TCreateReconciliationInput) {
  const { data } = await axios.post<TCreateReconciliationOutput>(
    "/api/financeiro/reconciliation",
    input,
  );
  return data;
}
