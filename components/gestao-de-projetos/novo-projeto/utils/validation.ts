import type { TProject } from "@/utils/schemas/projects";

import type {
  TDirectProjectDraft,
  TDirectProjectValidationResult,
  TNewProjectStage,
} from "../types";

function hasValue(value: unknown) {
  return typeof value === "string"
    ? value.trim().length > 0
    : value !== null && value !== undefined;
}

function result(errors: string[]): TDirectProjectValidationResult {
  return { valid: errors.length === 0, errors };
}

export function validateDirectProjectStage(
  stage: TNewProjectStage,
  draft: TDirectProjectDraft,
): TDirectProjectValidationResult {
  const project = draft.project;
  const client = draft.client.clientData;

  if (stage === "cliente") {
    return result(
      [
        !hasValue(client.nome) ? "Informe o nome do cliente." : "",
        !hasValue(client.telefonePrimario) && !hasValue(client.cpfCnpj)
          ? "Informe telefone ou CPF/CNPJ do cliente."
          : "",
      ].filter(Boolean),
    );
  }

  if (stage === "venda") {
    return result(
      [
        !hasValue(project.nomeDoContrato) ? "Informe o nome do contrato." : "",
        !hasValue(project.tipoDeServico) || project.tipoDeServico === "NAO DEFINIDO"
          ? "Selecione o tipo de serviço."
          : "",
        !hasValue(project.vendedor.nome) || project.vendedor.nome === "NAO DEFINIDO"
          ? "Selecione o vendedor."
          : "",
        !hasValue(project.uf) ? "Informe a UF de execução." : "",
        !hasValue(project.cidade) ? "Informe a cidade de execução." : "",
      ].filter(Boolean),
    );
  }

  if (stage === "padrao") {
    return result(
      [
        project.padrao.aumentoCarga.aplicavel && !hasValue(project.padrao.respInstalacao)
          ? "Informe o responsável pela instalação do padrão."
          : "",
        project.padrao.aumentoCarga.aplicavel && !hasValue(project.padrao.respPagamento)
          ? "Informe o responsável pelo pagamento do padrão."
          : "",
      ].filter(Boolean),
    );
  }

  if (stage === "estrutura") {
    return result(
      [
        project.estruturaPersonalizada.aplicavel === "SIM" &&
        !hasValue(project.estruturaPersonalizada.tipo)
          ? "Informe o tipo da estrutura."
          : "",
        project.estruturaPersonalizada.aplicavel === "SIM" &&
        !hasValue(project.estruturaPersonalizada.respPagamento)
          ? "Informe o responsável pelo pagamento da estrutura."
          : "",
      ].filter(Boolean),
    );
  }

  if (stage === "sistema") {
    return result([]);
  }

  if (stage === "pagamento") {
    return result(
      [
        !hasValue(project.pagamento.forma) ? "Selecione a forma de pagamento." : "",
        !hasValue(project.pagamento.metodo) || project.pagamento.metodo === "NAO DEFINIDO"
          ? "Selecione o método de pagamento."
          : "",
        !hasValue(project.pagamento.pagador.nome) ? "Informe o nome do pagador." : "",
        !hasValue(project.pagamento.pagador.cpfCnpj) ? "Informe o CPF/CNPJ do pagador." : "",
        !hasValue(project.pagamento.pagador.telefone) ? "Informe o telefone do pagador." : "",
      ].filter(Boolean),
    );
  }

  if (stage === "revisao") {
    return validateFullDirectProject(draft);
  }

  return result([]);
}

export function validateFullDirectProject(
  draft: TDirectProjectDraft,
): TDirectProjectValidationResult {
  const errors = (
    ["cliente", "venda", "padrao", "estrutura", "sistema", "pagamento"] as TNewProjectStage[]
  ).flatMap((stage) => validateDirectProjectStage(stage, draft).errors);
  return result(errors);
}

export function getContractTotal(project: TProject) {
  return (
    Number(project.sistema.valorProjeto || 0) +
    Number(project.padrao.valor || 0) +
    Number(project.estruturaPersonalizada.valor || 0) +
    Number(project.oem.valor || 0) +
    Number(project.seguro.valor || 0)
  );
}
