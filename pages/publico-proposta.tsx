import Avatar from '@/components/utils/Avatar'
import React from 'react'
import Logo from '../utils/images/logo-texto-branco.png'
import Image from 'next/image'
import { BsSuitDiamondFill } from 'react-icons/bs'
import { formatToMoney } from '@/utils/constants'
function ProposePage() {
  const info = {
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
  type Propose = typeof info
  function groupResponsabilities(responsabilities: Propose['responsabilidades']) {
    const grouped = responsabilities.reduce(
      (acc: { CONTRATANTE: Propose['responsabilidades']; CONTRATADA: Propose['responsabilidades'] }, current) => {
        if (current.responsavel == 'CONTRATANTE') acc.CONTRATANTE.push(current)
        if (current.responsavel == 'CONTRATADA') acc.CONTRATADA.push(current)
        return acc
      },
      { CONTRATANTE: [], CONTRATADA: [] }
    )
    return grouped
  }
  return (
    <div className="h-[29.7cm] w-[21cm] font-[Inter]">
      <div className="relative flex h-[297mm] w-[210mm] flex-col overflow-hidden bg-white">
        <div className="flex h-fit w-full items-center justify-between rounded-bl-md rounded-br-md bg-[#15599a] p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-white">CLIENTE</p>
              <p className="text-xs font-light text-white">{info.cliente.nome}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-white">CPF/CNPJ</p>
              <p className="text-xs font-light text-white">{info.cliente.cpfCnpj}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-white">CIDADE</p>
              <p className="text-xs font-light text-white">
                {info.localizacao.cidade} / {info.localizacao.uf}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-white">ENDEREÇO</p>
              <p className="text-xs font-light text-white">
                {info.localizacao.endereco}, Nº {info.localizacao.numeroOuIdentificador}, {info.localizacao.bairro}{' '}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div style={{ width: '80px', height: '80px' }} className="flex items-center justify-center">
              {/** @ts-ignore */}
              <Image src={Logo} alt="LOGO" fill={true} width={80} height={80} />
            </div>
          </div>
        </div>
        <div className="px-2 py-2 text-center text-xs font-medium">
          A <strong className="text-[#fead61]">Ampère Energias</strong> é uma empresa que nasceu no Triangulo Mineiro,
          <strong className="text-[#fead61]"> com a missão de ser a melhor empresa de soluções em energia do Brasil</strong>, oferecendo soluções
          completas e com qualidade para os nossos clientes, levando economia e qualidade, com praticidade e facilidade. A Ampère conta com{' '}
          <strong className="text-[#fead61]">mais de 1500 sistemas fotovoltaicos comercializados na região</strong>, sendo uma das maiores
          integradoras de sistemas fotovoltaicos de Minas Gerais.
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center gap-1 rounded-bl-md rounded-br-md bg-[#15599a] p-3">
            <h1 className="w-full text-center text-[0.75rem] font-bold text-white">ESCOPO DE SERVIÇOS</h1>
          </div>
          {/* <div className="flex w-full items-center">
            <h1 className="w-[75%] text-center font-bold">SERVIÇO</h1>
            <h1 className="w-[25%] text-center font-bold">VALOR</h1>
          </div> */}
          {info.servicos.map((service, index) => (
            <div className="flex w-full flex-col border-b border-gray-500 p-2">
              <div className="flex w-full items-center gap-2">
                <div className="flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full border border-black text-center font-bold">
                  <h1 className="text-xs">{index + 1}</h1>
                </div>
                <h1 className="text-[0.7rem] font-black tracking-tight text-[#15599a]">{service.titulo}</h1>
              </div>
              <div className="mt-2 flex w-full items-center justify-center text-center text-[0.6rem] font-medium uppercase text-gray-800">
                {service.descricao}
              </div>
              <h1 className="mt-2 mb-1 w-full text-xs font-medium leading-none tracking-tight text-gray-500">COMPOSIÇÃO</h1>
              {service.itens.map((item, itemIndex) => (
                <div key={itemIndex} className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BsSuitDiamondFill size={10} />
                    <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">{item.descricao}</h1>
                  </div>
                  <h1 className="text-[0.6rem] font-bold">{formatToMoney(item.valor)}</h1>
                </div>
              ))}
              <div className="flex w-full items-center justify-end">
                <h1 className="text-sm font-bold">R$ 25.000,00</h1>
              </div>
            </div>
          ))}
          <div className="flex w-full items-center justify-between px-2">
            <h1 className="font-black tracking-tight text-[#15599a]">TOTAL</h1>
            <h1 className="font-bold">R$ 100.000,00</h1>
          </div>
          <div className="mt-2 flex w-full items-center gap-1 rounded-bl-md rounded-br-md bg-[#15599a] p-3">
            <h1 className="w-full text-center text-[0.75rem] font-bold text-white">RESPONSABILIDADES</h1>
          </div>
          <div className="flex flex-col px-2">
            <div className="mt-2 flex items-center gap-2">
              <BsSuitDiamondFill size={10} />
              <h1 className="text-[0.6rem] leading-none tracking-tight text-gray-500">EXECUTAR OS SERVIÇOS PROPOSTOS CONFORME PROJETO APROVADO</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposePage
