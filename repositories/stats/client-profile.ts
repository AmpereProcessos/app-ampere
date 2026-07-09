import { inferSexFromName, type TInferredSex } from "@/utils/methods/infer-sex";
import type { TClient } from "@/utils/schemas/crm/client.schema";
import type { TProject } from "@/utils/schemas/projects";
import dayjs from "dayjs";
import { ObjectId, type Collection, type Filter } from "mongodb";

/**
 * Perfil de clientes dos projetos vendidos (contratos assinados).
 *
 * Todas as dimensões são computadas em memória a partir de uma única busca
 * de projetos + um join em lote com a coleção de clientes do CRM (bancos
 * diferentes impedem $lookup). O filtro de segmento funciona no estilo
 * facet: a distribuição de cada dimensão ignora o filtro dela mesma, de modo
 * que ao selecionar "MASCULINO" o gráfico de sexo continua mostrando a
 * comparação completa enquanto os demais se adaptam ao recorte.
 */

export const CLIENT_PROFILE_AGE_BRACKETS = [
  { label: "ATÉ 25", min: 0, max: 25 },
  { label: "26 A 35", min: 26, max: 35 },
  { label: "36 A 45", min: 36, max: 45 },
  { label: "46 A 55", min: 46, max: 55 },
  { label: "56 A 65", min: 56, max: 65 },
  { label: "65+", min: 66, max: Number.POSITIVE_INFINITY },
] as const;

export const CLIENT_PROFILE_VALUE_BRACKETS = [
  { label: "ATÉ 15 MIL", min: 0, max: 15_000 },
  { label: "15 A 25 MIL", min: 15_000, max: 25_000 },
  { label: "25 A 40 MIL", min: 25_000, max: 40_000 },
  { label: "40 A 60 MIL", min: 40_000, max: 60_000 },
  { label: "60 A 100 MIL", min: 60_000, max: 100_000 },
  { label: "100 MIL+", min: 100_000, max: Number.POSITIVE_INFINITY },
] as const;

export const NOT_INFORMED_LABEL = "NÃO INFORMADO";

// Rótulos curtos para os métodos de pagamento cadastrados nos projetos
// (valores de ContractRequestPaymentOptions).
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  "70% A VISTA NA ENTRADA + 30% NA FINALIZAÇÃO DA INSTALAÇÃO": "PARCELADO 70/30",
  "70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR": "PARCELADO 70/15/15",
  "80% A VISTA NA ENTRADA + 20% NA FINALIZAÇÃO DA INSTALAÇÃO": "PARCELADO 80/20",
  "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO": "FINANCIAMENTO",
  "100% PARCELADO NO CARTÃO DE CRÉDITO": "CARTÃO DE CRÉDITO",
  "100% À VISTA NO DINHEIRO/DÉBITO/PIX": "À VISTA",
  "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)": "NEGOCIAÇÃO PERSONALIZADA",
};

export type TClientProfileSegment = {
  sexo?: string | null;
  faixaEtaria?: string | null;
  faixaValor?: string | null;
  profissao?: string | null;
  formaPagamento?: string | null;
};

type TClientProfileRow = {
  _id: ObjectId;
  sexo: TInferredSex;
  idade: number | null;
  faixaEtaria: string;
  valor: number;
  faixaValor: string;
  profissao: string;
  formaPagamento: string;
  cidade: string;
  estado: string;
};

function normalizeText(value?: string | null) {
  if (!value) return null;
  const normalized = value.trim().toUpperCase();
  return normalized.length > 0 ? normalized : null;
}

function getAgeBracket(age: number | null) {
  if (age === null) return NOT_INFORMED_LABEL;
  const bracket = CLIENT_PROFILE_AGE_BRACKETS.find((b) => age >= b.min && age <= b.max);
  return bracket?.label ?? NOT_INFORMED_LABEL;
}

function getValueBracket(value: number) {
  const bracket = CLIENT_PROFILE_VALUE_BRACKETS.find((b) => value >= b.min && value < b.max);
  return bracket?.label ?? NOT_INFORMED_LABEL;
}

function getAge(birthdate: string | null | undefined, reference: string | null | undefined) {
  if (!birthdate) return null;
  const birth = dayjs(birthdate);
  if (!birth.isValid()) return null;
  const ref = reference && dayjs(reference).isValid() ? dayjs(reference) : dayjs();
  const age = ref.diff(birth, "year");
  return age >= 12 && age <= 110 ? age : null;
}

function isCorporateDocument(cpfCnpj: string | number | null | undefined) {
  if (cpfCnpj === null || cpfCnpj === undefined) return false;
  return String(cpfCnpj).replace(/\D/g, "").length > 11;
}

function median(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function countBy(rows: TClientProfileRow[], getKey: (row: TClientProfileRow) => string) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = getKey(row);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function toDistribution(counts: Map<string, number>, orderedLabels?: string[]) {
  const total = [...counts.values()].reduce((acc, qtde) => acc + qtde, 0);
  const labels = orderedLabels ?? [...counts.keys()].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0));
  return labels.map((label) => {
    const qtde = counts.get(label) ?? 0;
    return { titulo: label, qtde, percentual: total > 0 ? (qtde / total) * 100 : 0 };
  });
}

/**
 * Enriquece cada projeto candidato com as dimensões de perfil (sexo, idade,
 * valor, profissão, pagamento) e a localidade. Etapa compartilhada entre o
 * relatório de perfil e o helper que devolve os IDs segmentados para as demais
 * abas — garante que Perfil, Visão Geral e Geografia usem exatamente o mesmo
 * cálculo de segmento.
 */
type TBuildRowsParams = {
  projectsCollection: Collection<TProject>;
  clientsCollection: Collection<TClient>;
  projectsQuery: Filter<TProject>;
};
async function buildClientProfileRows({ projectsCollection, clientsCollection, projectsQuery }: TBuildRowsParams): Promise<TClientProfileRow[]> {
  const projects = (await projectsCollection
    .find(projectsQuery, {
      projection: {
        _id: 1,
        nomeDoContrato: 1,
        cpf_cnpj: 1,
        dataNascimento: 1,
        idClienteCRM: 1,
        cidade: 1,
        uf: 1,
        "contrato.dataAssinatura": 1,
        "pagamento.metodo": 1,
        "sistema.valorProjeto": 1,
        "padrao.valor": 1,
        "oem.valor": 1,
        "estruturaPersonalizada.valor": 1,
        "seguro.valor": 1,
      },
    })
    .toArray()) as unknown as {
    _id: ObjectId;
    nomeDoContrato?: string | null;
    cpf_cnpj?: string | number | null;
    dataNascimento?: string | null;
    idClienteCRM?: string | null;
    cidade?: string | null;
    uf?: string | null;
    contrato?: { dataAssinatura?: string | null };
    pagamento?: { metodo?: string | null };
    sistema?: { valorProjeto?: number | null };
    padrao?: { valor?: number | null };
    oem?: { valor?: number | null };
    estruturaPersonalizada?: { valor?: number | null };
    seguro?: { valor?: number | null };
  }[];

  // Join em lote com os clientes do CRM (profissão e data de nascimento)
  const clientIds = [...new Set(projects.map((p) => p.idClienteCRM).filter((id): id is string => !!id && ObjectId.isValid(id)))];
  const clients =
    clientIds.length > 0
      ? await clientsCollection
          .find({ _id: { $in: clientIds.map((id) => new ObjectId(id)) } }, { projection: { nome: 1, dataNascimento: 1, profissao: 1 } })
          .toArray()
      : [];
  const clientsById = new Map(clients.map((c) => [c._id.toString(), c]));

  return projects.map((project) => {
    const client = project.idClienteCRM ? clientsById.get(project.idClienteCRM) : undefined;

    const sexo: TInferredSex = isCorporateDocument(project.cpf_cnpj)
      ? "INDETERMINADO"
      : inferSexFromName(project.nomeDoContrato ?? client?.nome);

    const idade = getAge(project.dataNascimento ?? client?.dataNascimento, project.contrato?.dataAssinatura);

    const valor =
      (project.sistema?.valorProjeto ?? 0) +
      (project.padrao?.valor ?? 0) +
      (project.oem?.valor ?? 0) +
      (project.estruturaPersonalizada?.valor ?? 0) +
      (project.seguro?.valor ?? 0);

    const formaPagamento = PAYMENT_METHOD_LABELS[project.pagamento?.metodo ?? ""] ?? normalizeText(project.pagamento?.metodo) ?? NOT_INFORMED_LABEL;

    return {
      _id: project._id,
      sexo,
      idade,
      faixaEtaria: getAgeBracket(idade),
      valor,
      faixaValor: getValueBracket(valor),
      profissao: normalizeText(client?.profissao) ?? NOT_INFORMED_LABEL,
      formaPagamento,
      cidade: normalizeText(project.cidade) ?? NOT_INFORMED_LABEL,
      estado: normalizeText(project.uf) ?? NOT_INFORMED_LABEL,
    };
  });
}

const SEGMENT_DIMENSIONS: (keyof TClientProfileSegment)[] = ["sexo", "faixaEtaria", "faixaValor", "profissao", "formaPagamento"];

/** Constrói os matchers estilo facet a partir de um segmento. */
function buildSegmentMatchers(segment: TClientProfileSegment): Record<keyof TClientProfileSegment, (row: TClientProfileRow) => boolean> {
  return {
    sexo: (row) => !segment.sexo || row.sexo === segment.sexo,
    faixaEtaria: (row) => !segment.faixaEtaria || row.faixaEtaria === segment.faixaEtaria,
    faixaValor: (row) => !segment.faixaValor || row.faixaValor === segment.faixaValor,
    profissao: (row) => !segment.profissao || row.profissao === segment.profissao,
    formaPagamento: (row) => !segment.formaPagamento || row.formaPagamento === segment.formaPagamento,
  };
}

type TGetSegmentedProjectIdsParams = {
  projectsCollection: Collection<TProject>;
  clientsCollection: Collection<TClient>;
  baseQuery: Filter<TProject>;
  segment: TClientProfileSegment;
};
/**
 * Devolve os _ids dos projetos compatíveis com o recorte de segmento do Perfil.
 * As rotas Geral e Geográfica acrescentam `_id: { $in: [...] }` às suas consultas
 * para que "Feminino", "26 a 35" etc. alterem totais e pontos do mapa de maneira
 * idêntica ao Perfil. Só deve ser chamado quando há segmento ativo.
 */
export async function getSegmentedProjectIds({ projectsCollection, clientsCollection, baseQuery, segment }: TGetSegmentedProjectIdsParams): Promise<ObjectId[]> {
  const rows = await buildClientProfileRows({ projectsCollection, clientsCollection, projectsQuery: baseQuery });
  const matchers = buildSegmentMatchers(segment);
  return rows.filter((row) => SEGMENT_DIMENSIONS.every((d) => matchers[d](row))).map((row) => row._id);
}

/** Resumo geográfico calculado a partir da amostra final já filtrada. */
function buildGeographySummary(rows: TClientProfileRow[]) {
  const withLocation = rows.filter((row) => row.cidade !== NOT_INFORMED_LABEL && row.estado !== NOT_INFORMED_LABEL);
  const estados = new Set(withLocation.map((row) => row.estado));
  const localidades = new Map<string, { cidade: string; estado: string; qtde: number }>();
  for (const row of withLocation) {
    const key = `${row.cidade}::${row.estado}`;
    const entry = localidades.get(key) ?? { cidade: row.cidade, estado: row.estado, qtde: 0 };
    entry.qtde += 1;
    localidades.set(key, entry);
  }
  const top = [...localidades.values()].sort((a, b) => b.qtde - a.qtde).slice(0, 5);

  return {
    totalCidades: localidades.size,
    totalEstados: estados.size,
    projetosComLocalizacao: withLocation.length,
    projetosSemLocalizacao: rows.length - withLocation.length,
    top,
    coberturaPercentual: rows.length > 0 ? (withLocation.length / rows.length) * 100 : 0,
  };
}

type TGetClientProfileParams = {
  projectsCollection: Collection<TProject>;
  clientsCollection: Collection<TClient>;
  projectsQuery: Filter<TProject>;
  segment: TClientProfileSegment;
};
export async function getClientProfile({ projectsCollection, clientsCollection, projectsQuery, segment }: TGetClientProfileParams) {
  const rows = await buildClientProfileRows({ projectsCollection, clientsCollection, projectsQuery });

  // Filtro estilo facet: cada dimensão enxerga os filtros das demais, mas não o próprio
  const matchers = buildSegmentMatchers(segment);
  const dimensions = SEGMENT_DIMENSIONS;
  const rowsForDimension = (dimension: keyof TClientProfileSegment) =>
    rows.filter((row) => dimensions.every((d) => d === dimension || matchers[d](row)));
  const fullyFilteredRows = rows.filter((row) => dimensions.every((d) => matchers[d](row)));

  // SEXO
  const sexRows = rowsForDimension("sexo");
  const sexOrder: TInferredSex[] = ["MASCULINO", "FEMININO", "INDETERMINADO"];
  const sexo = {
    distribuicao: toDistribution(
      countBy(sexRows, (row) => row.sexo),
      sexOrder,
    ),
  };

  // IDADE
  const ageRows = rowsForDimension("faixaEtaria");
  const knownAges = fullyFilteredRows.map((row) => row.idade).filter((age): age is number => age !== null);
  const idade = {
    media: knownAges.length > 0 ? knownAges.reduce((acc, age) => acc + age, 0) / knownAges.length : 0,
    mediana: median(knownAges),
    qtdeInformada: knownAges.length,
    qtdeNaoInformada: fullyFilteredRows.length - knownAges.length,
    distribuicao: toDistribution(
      countBy(
        ageRows.filter((row) => row.idade !== null),
        (row) => row.faixaEtaria,
      ),
      CLIENT_PROFILE_AGE_BRACKETS.map((b) => b.label),
    ),
  };

  // VALOR DE PROJETO
  const valueRows = rowsForDimension("faixaValor");
  const values = fullyFilteredRows.map((row) => row.valor).filter((value) => value > 0);
  const valor = {
    media: values.length > 0 ? values.reduce((acc, value) => acc + value, 0) / values.length : 0,
    mediana: median(values),
    total: values.reduce((acc, value) => acc + value, 0),
    distribuicao: toDistribution(
      countBy(
        valueRows.filter((row) => row.valor > 0),
        (row) => row.faixaValor,
      ),
      CLIENT_PROFILE_VALUE_BRACKETS.map((b) => b.label),
    ),
  };

  // PROFISSÕES (top 5 entre as informadas)
  const professionRows = rowsForDimension("profissao");
  const professionCounts = countBy(
    professionRows.filter((row) => row.profissao !== NOT_INFORMED_LABEL),
    (row) => row.profissao,
  );
  // Mantém a profissão selecionada visível mesmo fora do top 5
  const topProfessions = toDistribution(professionCounts).filter(
    (item, index) => index < 5 || item.titulo === normalizeText(segment.profissao),
  );
  const profissoes = {
    qtdeInformada: professionRows.length - (countBy(professionRows, (row) => row.profissao).get(NOT_INFORMED_LABEL) ?? 0),
    qtdeNaoInformada: countBy(professionRows, (row) => row.profissao).get(NOT_INFORMED_LABEL) ?? 0,
    top: topProfessions,
  };

  // FORMA DE PAGAMENTO
  const paymentRows = rowsForDimension("formaPagamento");
  const pagamento = {
    distribuicao: toDistribution(countBy(paymentRows, (row) => row.formaPagamento)),
  };

  // GEOGRAFIA (a partir da amostra final já filtrada)
  const geografia = buildGeographySummary(fullyFilteredRows);

  return {
    amostra: {
      qtdeProjetos: rows.length,
      qtdeProjetosFiltrados: fullyFilteredRows.length,
    },
    sexo,
    idade,
    valor,
    profissoes,
    pagamento,
    geografia,
  };
}
export type TClientProfile = Awaited<ReturnType<typeof getClientProfile>>;
