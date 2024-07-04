import { THomologation } from './schemas/partial/homologation'

const homologation: THomologation = {
  homologar: true,
  status: 'PENDENTE',
  potencia: 0,
  distribuidora: 'CEMIG',
  pendencias: {},
  oportunidade: {
    id: '',
    nome: '',
  },
  titular: {
    nome: '',
    contato: '',
    identificador: '',
  },
  equipamentos: [],
  localizacao: {
    uf: '',
    cidade: '',
  },
  instalacao: {
    grupo: 'COMERCIAL',
    numeroCliente: '',
    numeroInstalacao: '',
  },
  documentacao: {
    formaAssinatura: 'FÍSICA',
  },
  acesso: {
    codigo: '',
  },
  atualizacoes: [],
  vistoria: {},
  dataLiberacao: new Date().toISOString(),
}
