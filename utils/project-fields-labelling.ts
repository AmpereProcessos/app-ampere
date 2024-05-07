import { formatDateAsLocale } from './methods/formatting'

export const FieldsFormattings: { [key: string]: { label: string; getFormattedValue: (value: any) => any } } = {
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
    label: 'COBRANÇA FEITA',
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
