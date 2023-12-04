const Propose = {
  cliente: {
    nome: 'Lucas Fernandes',
    cpfCnpj: '999.999.999-99',
    telefone: '(34) 99999-9999',
    email: 'placeholder@gmail.com',
  },
  localizacao: {
    cep: '38300-150',
    uf: 'MG',
    cidade: 'ITUIUTABA',
    bairro: 'CENTRO',
    endereco: 'RUA A',
    numeroOuIdentificador: '999',
  },
  servicos: [
    {
      titulo: 'FORNECIMENTO DE MATERIAIS, EXECUÇÃO DE MALHA DE ATERRAMENTO E INSTALAÇÃO DE CABINE',
      descricao:
        'Escavação, instalação de caixas de passagem, lançamento de condutores, conexões. Instalação e fixação de cabine em base de concreto existente.Execução de parametrização de relé, instalação de TP e TC CEMIG, acompanhamento de vistoria e correções em caso de reprova.',
      itens: [
        { descricao: 'MÃO DE OBRA', valor: 10000 },
        { descricao: 'MATERIAIS', valor: 12000 },
      ],
    },
    {
      titulo: 'FORNECIMENTO DE MATERIAIS E EXECUÇÃO DE POSTE DE ANCORAGEM',
      descricao: 'Instalação de poste equipado, instalação de eletrodutos,  lançamento de condutores e instalação de muflas.',
      itens: [
        { descricao: 'MÃO DE OBRA', valor: 7000 },
        { descricao: 'MATERIAIS', valor: 14000 },
      ],
    },
    {
      titulo: 'INSTALAÇÃO DE ALAMBRADO',
      descricao: 'Instalação de alambrado em mourões de concreto e tela fornecidos pela contratada, incluindo aterramento e portão de entrada.',
      itens: [
        { descricao: 'MÃO DE OBRA', valor: 3500 },
        { descricao: 'MATERIAIS', valor: 1500 },
      ],
    },
  ],
  responsabilidades: [
    { descricao: 'Fornecer liberação da área para execução dos serviços.', responsavel: 'CONTRATANTE' },
    { descricao: 'Fornecer documentação necessária para aprovação execução dos serviços.', responsavel: 'CONTRATANTE' },
    { descricao: 'Fornecer materiais que não constam na lista do ANEXO I.', responsavel: 'CONTRATANTE' },
    {
      descricao: 'Fornecer dois ajudantes práticos da área civil que serão instruídos e acompanhados por nossos técnicos na abertura de valas.',
      responsavel: 'CONTRATANTE',
    },
  ],
  condicoesPagamento: [
    'Todos os materiais serão faturados diretamente para o CONTRATANTE.',
    '- Saldo em 10 dias após o termino da execução dos serviços',
  ],
  incluso: [
    '- Fornecimento de materiais listados no ANEXO I',
    '- Mão de obra direta ou subcontratada especializada para execução dos serviços',
    '- Equipamentos de teste, ferramentas e EPIs',
    '- Fornecimento de caminhão munk',
    '- Anotação de ART para os serviços executados',
    '- Todos os serviços propostos serão executados conforme projeto aprovado enviado para elaboração desta proposta (Anexo II).',
  ],
  excluso: [
    'Todo e qualquer serviço ou item não mencionado claramente como parte desta proposta será de inteira responsabilidade do cliente.',
    'Os mesmos, se aprovados sua execução, serão considerados como aditivos a esta proposta de orçamento.',
  ],
  previsaoExecucao: 15,
  validade: 10,
  valor: 48000,
}
