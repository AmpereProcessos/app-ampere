import { formatDecimalPlaces } from './constants'
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
    getFormattedValue: (value: any) => (value ? 'SIM' : 'NÃO'),
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
  'contrato.formaAssinatura': {
    label: 'FORMA DE ASSINATURA',
    getFormattedValue: (value: any) => value,
  },
  'contrato.status': {
    label: 'STATUS DO CONTRATO',
    getFormattedValue: (value: any) => value,
  },
  'contrato.dataSolicitacao': {
    label: 'DATA DE SOLICITAÇÃO',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
  },
  'contrato.dataLiberacao': {
    label: 'DATA DE LIBERAÇÃO',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
  },
  'contrato.dataAssinatura': {
    label: 'DATA DE ASSINATURA',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
  },
  'comissoes.efetivado': {
    label: 'PORCENTAGENS EFETIVADAS',
    getFormattedValue: (value: any) => (value ? 'SIM' : 'NÃO'),
  },
  'comissoes.pagamentoRealizado': {
    label: 'PAGAMENTOS FEITOS',
    getFormattedValue: (value: any) => (value ? 'SIM' : 'NÃO'),
  },
  'comissoes.porcentagemVendedor': {
    label: 'PORCENTAGEM DO VENDEDOR',
    getFormattedValue: (value: any) => formatDecimalPlaces(value),
  },
  'comissoes.porcentagemInsider': {
    label: 'PORCENTAGEM DO INSIDER',
    getFormattedValue: (value: any) => formatDecimalPlaces(value),
  },
  'comissionamento.comercial': {
    label: 'COMISSIONAMENTO COMERCIAL FEITO',
    getFormattedValue: (value: any) => (value ? 'SIM' : 'NÃO'),
  },
  'visitaTecnica.amperagem': {
    label: 'AMPERAGEM',
    getFormattedValue: (value: any) => value,
  },
  'padrao.tipo': {
    label: 'TIPO DO PADRÃO',
    getFormattedValue: (value: any) => value,
  },
  'padrao.tipoEntrada': {
    label: 'TIPO DE ENTRADA DO PADRÃO',
    getFormattedValue: (value: any) => value,
  },
  'visitaTecnica.saidaDoCliente': {
    label: 'TIPO DE SAIDA DO PADRÃO',
    getFormattedValue: (value: any) => value,
  },
  'projeto.aumentoDeCarga': {
    label: 'NECESSÁRIO AUMENTO DE CARGA',
    getFormattedValue: (value: any) => value,
  },
  'projeto.acStatus': {
    label: 'AMPERAGEM',
    getFormattedValue: (value: any) => value,
  },
  'padrao.respPagamento': {
    label: 'RESP. PAGAMENTO DO PADRÃO',
    getFormattedValue: (value: any) => value,
  },
  'padrao.respInstalacao': {
    label: 'RESP. INSTALAÇÃO DO PADRÃO',
    getFormattedValue: (value: any) => value,
  },
  'padrao.valor': {
    label: 'VALOR DO PADRÃO',
    getFormattedValue: (value: any) => formatDecimalPlaces(value),
  },
  'padrao.caixaConjugada': {
    label: 'AMPERAGEM',
    getFormattedValue: (value: any) => value,
  },
  'estruturaPersonalizada.tipo': {
    label: 'TIPO DA ESTRUTURA',
    getFormattedValue: (value: any) => value || 'NÃO DEFINIDO',
  },
  'estruturaPersonalizada.aplicavel': {
    label: 'NECESSÁRIO ADEQUAÇÃO DE ESTRUTURA',
    getFormattedValue: (value: any) => value,
  },
  'estruturaPersonalizada.status': {
    label: 'STATUS DE EXECUÇÃO DA ESTRUTURA PERSONALIZADA',
    getFormattedValue: (value: any) => value,
  },
  'estruturaPersonalizada.respPagamento': {
    label: 'PAGAMENTO DA ESTRUTURA',
    getFormattedValue: (value: any) => value,
  },
  'estruturaPersonalizada.valor': {
    label: 'VALOR DA ESTRUTURA',
    getFormattedValue: (value: any) => value,
  },
  'estruturaPersonalizada.statusEntrega': {
    label: 'STATUS DA ENTREGA DA ESTRUTURA',
    getFormattedValue: (value: any) => value,
  },
  'estruturaPersonalizada.dataEntrega': {
    label: 'DATA DE ENTREGA DA ESTRUTURA',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
  },
  'compra.liberacao': {
    label: 'LIBERADO PARA SUPRIMENTOS',
    getFormattedValue: (value: any) => (value ? 'SIM' : 'NÃO'),
  },
  'compra.dataLiberacao': {
    label: 'DATA DE LIBERAÇÃO P/ COMPRA',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
  },
  'compra.status': {
    label: 'STATUS DA SUPLEMENTAÇÃO',
    getFormattedValue: (value: any) => value,
  },
  'compra.tipoDoKit': {
    label: 'TIPO DO KIT',
    getFormattedValue: (value: any) => value,
  },
  'compra.previsaoValorDoKit': {
    label: 'PREV. VALOR DO KIT',
    getFormattedValue: (value: any) => formatDecimalPlaces(value),
  },
  'compra.fornecedor': {
    label: 'FORNECEDOR',
    getFormattedValue: (value: any) => value,
  },
  'compra.dataPedido': {
    label: 'DATA DO PEDIDO',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
  },
  'compra.valorDoKit': {
    label: 'VALOR DO KIT',
    getFormattedValue: (value: any) => formatDecimalPlaces(value),
  },
  'compra.rastreio': {
    label: 'RASTREIO',
    getFormattedValue: (value: any) => value,
  },
  'compra.informacoes': {
    label: 'OUTRAS INFORMAÇÕES',
    getFormattedValue: (value: any) => value,
  },
  'compra.dataMaxPagamento': {
    label: 'DATA MÁX P/ PAGAMENTO',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
  },
  'compra.dataPagamento': {
    label: 'DATA DE PAG. (CLIENTE)',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
  },
  'compra.dataPagamentoEquipamentos': {
    label: 'DATA DE PAG. (FORNECEDOR)',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
  },
  'faturamento.previsaoFaturamento': {
    label: 'INFORMAÇÕES DE FATURAMENTO',
    getFormattedValue: (value: any) => value,
  },
  'faturamento.dataFaturamento': {
    label: 'DATA DE FATURAMENTO',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
  },
  'compra.localEntrega': {
    label: 'LOCAL DE ENTREGA',
    getFormattedValue: (value: any) => value,
  },
  'compra.previsaoEntrega': {
    label: 'DATA DE PREVISÃO DE ENTREGA',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
  },
  'compra.dataEntrega': {
    label: 'DATA DE ENTREGA',
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
  },
  'compra.statusEntrega': {
    label: 'STATUS DA ENTREGA',
    getFormattedValue: (value: any) => value,
  },
  'comissionamento.suprimentos': {
    label: 'COMISSIONAMENTO DE SUPRIMENTOS FEITO',
    getFormattedValue: (value: any) => (value ? 'SIM' : 'NÃO'),
  },
  'dadosCemig.titularProjeto': {
    label: 'NOME DO TITULAR',
    getFormattedValue: (value: any) => value,
  },
  'dadosCemig.numeroInstalacao': {
    label: 'NÚMERO DA INSTALAÇÃO',
    getFormattedValue: (value: any) => value,
  },
  'dadosCemig.distCreditos': {
    label: 'NECESSÁRIO DISTRIBUIÇÃO DE CRÉDITOS',
    getFormattedValue: (value: any) => value,
  },
  'dadosCemig.qtdeDistCreditos': {
    label: 'QTDE DE DISTRIBUIÇÕES',
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
    getFormattedValue: (value: any) => (value ? formatDateAsLocale(value) : 'INDEFINIDO'),
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
