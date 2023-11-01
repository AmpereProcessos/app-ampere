import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Assinatura from '../utils/images/signature-diogo.jpg'
import Logo from '../utils/images/logo-texto-azul-vertical.png'
/**
 * @typedef {Object} ServiceOrder
 * @property {string} [_id] - The ID of the service order (optional).
 * @property {'MONTAGEM' | 'MANUTANÇÃO CORRETIVA'} categoria - The category of the service order.
 * @property {Object} favorecido - Information about the beneficiary.
 * @property {string} favorecido.nome - The name of the beneficiary.
 * @property {string} favorecido.contato - The contact information of the beneficiary.
 * @property {Object} projeto - Information about the project.
 * @property {string} projeto.id - The ID of the project in the Ampère system.
 * @property {string} projeto.nome - The name of the project in the system.
 * @property {number} projeto.identificador - The identifier quantity of the project in the project database.
 * @property {string} projeto.tipo - The type of the project.
 * @property {string} descricao - The description of the service performed.
 * @property {Object} localizacao - Information about the location.
 * @property {string} localizacao.cep - The ZIP code.
 * @property {string} localizacao.uf - The state.
 * @property {string} localizacao.cidade - The city.
 * @property {string} localizacao.bairro - The neighborhood.
 * @property {string} localizacao.endereco - The address.
 * @property {string} localizacao.numeroOuIdentificador - The number or identifier.
 * @property {Object} responsavel - Information about the responsible person.
 * @property {string} responsavel.nome - The name of the responsible person.
 * @property {'INTERNO' | 'EXTERNO'} responsavel.tipo - The type of the responsible person.
 * @property {'POUCO URGENTE' | 'URGENTE' | 'EMERGÊNCIA'} urgencia - The urgency level.
 * @property {Object} periodo - Time period information.
 * @property {string | null} periodo.inicio - The start date (nullable).
 * @property {string | null} periodo.fim - The end date (nullable).
 * @property {Object} pagamento - Payment information.
 * @property {string | null} pagamento.recebedor - The payee (nullable).
 * @property {number | null} pagamento.valor - The payment amount (nullable).
 * @property {Object} cobranca - Billing information.
 * @property {string | null} cobranca.pagador - The payer (nullable).
 * @property {number | null} cobranca.valor - The billing amount (nullable).
 * @property {Object} autor - Information about the author.
 * @property {string} autor.id - The ID of the author.
 * @property {string} autor.nome - The name of the author.
 * @property {string} autor.avatar_url - The avatar URL of the author.
 * @property {Object} equipamentos - Equipment information.
 * @property {Object} equipamentos.modulos - Module information.
 * @property {string | null} equipamentos.modulos.modelo - The model of the module (nullable).
 * @property {number | null} equipamentos.modulos.qtde - The quantity of modules (nullable).
 * @property {number | null} equipamentos.modulos.potencia - The power of modules (nullable).
 * @property {Object} equipamentos.inversor - Inverter information.
 * @property {string | null} equipamentos.inversor.modelo - The model of the inverter (nullable).
 * @property {number | null} equipamentos.inversor.qtde - The quantity of inverters (nullable).
 * @property {number | null} equipamentos.inversor.potencia - The power of inverters (nullable).
 * @property {Array<{qtde: number | null, descricao: string | null}>} disponivel
 * @property {Array<{qtde: number | null, descricao: string | null}>} retirada
 * @property {Object} detalhes - Additional details.
 * @property {string} detalhes.pontoAgua - Water point information.
 * @property {string} detalhes.senhaWifi - Wi-Fi password.
 * @property {boolean} detalhes.configuracaoMonitoramento - Indicates if monitoring is configured.
 * @property {boolean} detalhes.possuiTrafo - Indicates if a transformer is present.
 * @property {string} detalhes.tipoEstrutura - Type of structure.
 * @property {string} detalhes.tipoTelha - Type of structure.
 * @property {string} detalhes.tipoEstrutura - Type of structure.
 * @property {string} detalhes.tipoPadrao - Type of structure.
 * @property {string} detalhes.tipoSaidaPadrao - Type of structure.
 * @property {string} detalhes.amperagemPadrao - Type of structure.
 * @property {string} detalhes.responsabilidadePadrao - Type of structure.
 * @property {string | undefined} [detalhes.tipoTelha] - Type of tile (optional).
 * @property {string} detalhes.topologia - Topology information.
 * @property {string} observacoes - Observations.
 * @property {string} [dataEfetivacao] - The date of execution (optional).
 * @property {string} dataInsercao - The date of insertion.
 */
/**
 * @param {Object} props - Component props.
 * @param {ServiceOrder} props.order - The service order object.
 */
function PreventivaOSPDF({ order }) {
  return (
    <div className="w-[21cm] h-[29.7cm]  p-4 px-12">
      <h1 className="text-center font-bold text-xl mb-6">ORDEM DE SERVIÇO</h1>
      <div className="grid grid-cols-2">
        <div className="flex justify-between">
          <Link href="/">
            <div className="flex justify-center items-center">
              <Image height="100px" width="100px" src={Logo} />
            </div>
          </Link>
          <div className="pl-2">
            <p className="text-center font-bold">AMPÈRE ENERGENHARIA E CONSULTORIA ELÉTRICA - ME</p>
            <p className="text-center font-bold">
              CNPJ <br />
              27.901.968/0001-45
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
          <div className="flex justify-between border-black border-b">
            <p className="text-end pr-2">ID da O.S</p>
            <p className="text-center pr-2">{order._id}</p>
          </div>
          <div className="flex justify-between border-black border-b">
            <p className="text-end pr-2">DATA DE ABERTURA</p>
            <p className="text-center pr-2">{order.dataInsercao ? new Date(order.dataInsercao).toLocaleDateString() : '-'}</p>
          </div>
        </div>
      </div>
      <div className="border border-black mt-6">
        <h1 className="text-center my-2 font-bold">DADOS DO CLIENTE</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2 h-full">
          <div className="grid-rows-3 h-full">
            <div className="grid grid-cols-4">
              <p className="font-semibold">Nome:</p>
              <p className="col-span-3 text-center border border-black text-xs">{order.favorecido.nome}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="font-semibold">Endereço:</p>
              <p className="col-span-3 text-center border border-black border-t-0 text-xs">{order.localizacao.endereco}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="font-semibold">Telefone:</p>
              <p className="col-span-3 text-center border border-black border-t-0 text-xs">{order.favorecido.contato}</p>
            </div>
          </div>
          <div className="grid-rows-3 h-full">
            <div className="grid grid-cols-4">
              <p className="font-semibold">Bairro:</p>
              <p className="col-span-3 text-center border border-black text-xs">{order.localizacao.bairro}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="font-semibold">Número:</p>
              <p className="col-span-3 text-center border border-black border-t-0 text-xs">{order.localizacao.numeroOuIdentificador}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="font-semibold">Cidade:</p>
              <p className="col-span-3 text-center border border-black border-t-0 text-xs">{order.localizacao.cidade}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-6">
        <h1 className="text-center my-2 font-bold">DADOS DO SISTEMA</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid-rows-2">
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">Topologia:</p>
              <p className="col-span-3 text-xs text-center border border-black">
                {order.detalhes?.topologia} ({order.detalhes?.topologia})
              </p>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">NºMódulos:</p>
              <p className="col-span-3 text-xs text-center border border-black border-t-0">
                {order.equipamentos.modulos.qtde ? order.equipamentos.modulos.qtde : '-'} -{' '}
                {order.equipamentos.modulos.potencia ? order.equipamentos.modulos.potencia : '-'}W
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">Marca/Modelo:</p>
              <p className="col-span-3 w-48 text-center border border-black">
                {order.equipamentos.inversor.modelo ? order.equipamentos.inversor.modelo : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-6">
        <h1 className="text-center my-2 font-bold">INFORMAÇÕES PARA OBRA</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid-rows-3 gap-y-px">
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">CONFIGURAR?:</p>
              <p className="col-span-3 text-center border border-black">{order.detalhes.configuracaoMonitoramento == true ? 'SIM' : 'NÃO'}</p>
            </div>
            <div className="grid grid-cols-5">
              <p className="text-center col-span-2 font-semibold">PONTO DE ÁGUA:</p>
              <div className="flex justify-center items-center col-span-3 border border-black border-t-0">
                {order.detalhes.pontoAgua ? order.detalhes.pontoAgua : '-'}
              </div>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">SENHA DO WI-FI:</p>
              <p className="col-span-3 text-center border border-black border-t-0">{order.detalhes.senhaWifi ? order.detalhes.senhaWifi : '-'}</p>
            </div>
          </div>
          <div className="grid-rows-3">
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">TIPO DE TELHA:</p>
              <p className="col-span-3 text-center border border-black">{order.detalhes.tipoTelha ? order.detalhes.tipoTelha : '-'}</p>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold text-center">TIPO DE ESTRUTURA:</p>
              <div className="flex justify-center items-center col-span-3 border border-black border-t-0">
                {order.detalhes.tipoEstrutura ? order.detalhes.tipoEstrutura : '-'}
              </div>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 text-center font-semibold">TRAFO?:</p>
              <p className="col-span-3 text-center border border-black border-t-0">{order.detalhes.possuiTrafo ? order.detalhes.possuiTrafo : '-'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-6">
        <h1 className="text-center font-bold py-2">SERVIÇO A SER EXECUTADO</h1>
        <div className="flex flex-col justify-center h-[120px] items-center">
          <p className="text-sm">SERVIÇO: {order.descricao.toUpperCase()}</p>
          <div className="flex flex-col justify-center min-h-[50px] items-center">
            {order.observacoes ? (
              <div className={`${order.observacoes.length > 370 ? 'text-xxs' : 'text-xs'} px-2 my-2 font-bold text-center`}>
                {order.observacoes ? order.observacoes.split('/').map((string, index) => <li key={index}>{string}</li>) : false}
              </div>
            ) : (
              <p className="my-2 text-xs">SEM OBSERVAÇÕES DE OS</p>
            )}
          </div>
        </div>
      </div>
      <div className="border border-black mt-6 px-4 pb-4">
        <h1 className="text-center font-bold py-1">CONFERÊNCIA DOS CHECKLIST</h1>
        <div className="grid grid-cols-2 pb-2">
          <div className="grid grid-rows-2">
            <div className="flex gap-x-2 items-center">
              <div className="w-4 h-4 border rounded-md border-black"></div>
              <p className="text-center text-xs">https://forms.gle/FTvLg1Eey2xzPqL37</p>
            </div>
            <div className="flex gap-x-2 items-center">
              <div className="w-4 h-4 border rounded-md border-black"></div>
              <p className="text-center text-xs">CHECKLIST DE MATERIAL</p>
            </div>
          </div>
          <div className="grid grid-rows-2">
            <div className="flex items-center gap-x-2">
              <div className="w-4 h-4 border rounded-md border-black"></div>
              <p className="text-center text-xs">TERMO DE REALIZAÇÃO DE MANUTENÇÃO PREVENTIVA</p>
            </div>
            <div className="flex items-center">
              <div className="flex gap-x-2 items-center uppercase">
                <p className="text-xs">Data execução:</p>
                <p>____/____/_____</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-x-4 grid-cols-2">
          <div className="flex flex-col">
            <p className="text-start">Autorizado por:</p>
            <div className="w-[150px] flex justify-center  items-centertext-center">
              <Image src={Assinatura} />
            </div>
            <hr className="border-t-2 border-black" />
            <p>ASSINATURA DIRETOR DE ENGENHARIA</p>
          </div>
          <div className="flex flex-col">
            <p className="text-start">Realizado por:</p>
            <hr className="mt-12 border-t-2 border-black" />
            <p>ASSINATURA TÉCNICO RESPONSÁVEL</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreventivaOSPDF
