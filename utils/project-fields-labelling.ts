import { formatDateAsLocale } from './methods/formatting'

export const FieldsFormattings: { [key: string]: { label: string; getFormattedValue: (value: any) => any } } = {
  nomeDoContrato: {
    label: 'NOME DO CONTRATO',
    getFormattedValue: (value: any) => value,
  },
  nomeDoProjeto: {
    label: 'NOME DO PROJETO',
    getFormattedValue: (value: any) => value,
  },
  codigoSVB: {
    label: 'CÓDIGO CRM',
    getFormattedValue: (value: any) => value,
  },
  cpf_cnpj: {
    label: 'CPF/CNPJ',
    getFormattedValue: (value: any) => value,
  },
  tipoDeServico: {
    label: 'TIPO DE SERVIÇO',
    getFormattedValue: (value: any) => value,
  },
  regional: {
    label: 'REGIONAL',
    getFormattedValue: (value: any) => value,
  },
  telefone: {
    label: 'TELEFONE',
    getFormattedValue: (value: any) => value,
  },
  email: {
    label: 'EMAIL',
    getFormattedValue: (value: any) => value,
  },
  cep: {
    label: 'CEP',
    getFormattedValue: (value: any) => value,
  },
  uf: {
    label: 'UF',
    getFormattedValue: (value: any) => value,
  },
  cidade: {
    label: 'CIDADE',
    getFormattedValue: (value: any) => value,
  },
  bairro: {
    label: 'BAIRRO',
    getFormattedValue: (value: any) => value,
  },
  logradouro: {
    label: 'LOGRADOURO',
    getFormattedValue: (value: any) => value,
  },
  numeroResidencia: {
    label: 'Nº DA RESIDÊNCIA',
    getFormattedValue: (value: any) => value,
  },
  canalVenda: {
    label: 'CANAL DE VENDA',
    getFormattedValue: (value: any) => value,
  },
  segmento: {
    label: 'SEGMENTO',
    getFormattedValue: (value: any) => value,
  },
  'vendedor.nome': {
    label: 'NOME DO VENDEDOR',
    getFormattedValue: (value: any) => value,
  },
  insider: {
    label: 'INSIDER',
    getFormattedValue: (value: any) => value,
  },
  possuiaGD: {
    label: 'POSSUI GD',
    getFormattedValue: (value: any) => value,
  },
  linkDrive: {
    label: 'LINK DA NUVEM',
    getFormattedValue: (value: any) => value,
  },
  idVisitaTecnica: {
    label: 'ID DA VISITA TÉCNICA',
    getFormattedValue: (value: any) => value,
  },
  idProjetoCRM: {
    label: 'ID DO PROJETO DO CRM',
    getFormattedValue: (value: any) => value,
  },
  idPropostaCRM: {
    label: 'ID DA PROPOSTA DO CRM',
    getFormattedValue: (value: any) => value,
  },
  'oem.aplicavel': {
    label: 'APLICABILIDADE DO O&M',
    getFormattedValue: (value: any) => value,
  },
  'oem.duracao': {
    label: 'DURAÇÃO DO O&M',
    getFormattedValue: (value: any) => value,
  },
  'oem.qtdeManutencoes': {
    label: 'QTDE DE MANUTENÇÕES',
    getFormattedValue: (value: any) => value,
  },
  obsComercial: {
    label: 'OBSERVAÇÕES COMERCIAIS',
    getFormattedValue: (value: any) => value,
  },
  idSolicitacaoContrato: {
    label: 'ID DE SOLICITAÇÃO DO CONTRATO',
    getFormattedValue: (value: any) => value,
  },
  'pagamento.forma': {
    label: 'FORMA DE PAGAMENTO',
    getFormattedValue: (value: any) => value,
  },
  'pagamento.credor': {
    label: 'CREDOR',
    getFormattedValue: (value: any) => value,
  },
  'pagamento.pagador': {
    label: 'NOME DO PAGADOR',
    getFormattedValue: (value: any) => value,
  },
  'pagamento.contatoPagador': {
    label: 'CONTATO DO PAGADOR',
    getFormattedValue: (value: any) => value,
  },
  'pagamento.cobrancaFeita': {
    label: 'PAGAMENTO CONCLUÍDO',
    getFormattedValue: (value: any) => (value ? 'SIM' : 'NÃO'),
  },
  'pagamento.dataRecebimento': {
    label: 'DATA DE RECEBIMENTO',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : null),
  },
  'faturamento.empresaFaturamento': {
    label: 'REMPRESA DE FATURAMENTO',
    getFormattedValue: (value: any) => value,
  },
  'faturamento.cnpjFaturamento': {
    label: 'CNPJ DE FATURAMENTO',
    getFormattedValue: (value: any) => value,
  },
  'faturamento.concluido': {
    label: 'FATURAMENTO CONCLUIDO',
    getFormattedValue: (value: any) => (value ? 'SIM' : 'NÃO'),
  },
}

export function getUpdateLogFormatted({ field, value }: { field: string; value: any }) {
  const equivalentField = FieldsFormattings[field]
  if (!equivalentField) return null
  const label = equivalentField.label
  const valueFormatted = equivalentField.getFormattedValue(value)
  return { label, valueFormatted }
}
