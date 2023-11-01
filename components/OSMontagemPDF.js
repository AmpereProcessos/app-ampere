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
function OSMontagemPDF({ order }) {
  return (
    <div className="w-[21cm] h-[29.7cm]  p-4 px-12">
      <h1 className="text-center font-bold text-xl mb-6">ORDEM DE SERVIÇO</h1>
      <div className="grid grid-cols-2">
        <div className="flex justify-between items-center">
          <Link href="/obras">
            <div className="flex justify-center items-center">
              <Image height="60px" width="60px" src={Logo} />
            </div>
          </Link>
          <div className="pl-2">
            <p className="text-center font-bold">AMPÈRE ENERGENHARIA E CONSULTORIA ELÉTRICA - ME</p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
          <div className="flex justify-between border-black border-b">
            <p className="text-xs text-end pr-2">DATA DE ABERTURA</p>
            <p className="text-xs text-center pr-2">{order.dataInsercao ? new Date(order.dataInsercao).toLocaleDateString() : '-'}</p>
          </div>
          <div className="flex justify-between border-black border-b">
            <p className="text-xs text-end pr-2">GRAU DE URGÊNCIA</p>
            <p className="text-xs text-center pr-2">{order.urgencia || '-'}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-end pr-2">REALIZAR COBRANÇA</p>
            <p className="text-xs text-center pr-2">{order.cobranca.pagador ? 'SIM' : 'NÃO'}</p>
          </div>
        </div>
      </div>
      <div className="border border-black mt-4">
        <h1 className="text-center my-2 font-bold">DADOS DO CLIENTE</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid-rows-3">
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Nome:</p>
              <p className="text-xs col-span-3 text-center border border-black">
                {order.projeto.identificador || ''} {order.favorecido.nome}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Endereço:</p>
              <p className="text-xs col-span-3 text-center border border-black border-t-0">{order.localizacao.endereco}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Telefone:</p>
              <p className="text-xs col-span-3 text-center border border-black border-t-0">{order.favorecido.contato}</p>
            </div>
          </div>
          <div className="grid-rows-3">
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Bairro:</p>
              <p className="text-xs col-span-3 text-center border border-black">{order.localizacao.bairro}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Número:</p>
              <p className="text-xs col-span-3 text-center border border-black border-t-0">{order.localizacao.numeroOuIdentificador}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Cidade:</p>
              <p className="text-xs col-span-3 text-center border border-black border-t-0">{order.localizacao.cidade}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-3">
        <h1 className="text-center my-2 font-bold">DADOS INSTALAÇÃO</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid grid-rows-5">
            <div className="row-span-1 grid grid-cols-5">
              <p className="text-xs text-center col-span-2 font-semibold uppercase">Topologia:</p>
              <p className="text-xs col-span-3 text-center border border-black">
                {order.detalhes.topologia} ({order.equipamentos?.inversor.modelo || 'N/A'} - {order.equipamentos.inversor.potencia || 'N/A'}W)
              </p>
            </div>
            <div className="row-span-1 grid grid-cols-5">
              <p className="text-xs text-center col-span-2 font-semibold uppercase">Módulos:</p>
              <p className="text-xs col-span-3 text-center border border-black border-t-0">
                {order.equipamentos.modulos.qtde ? order.equipamentos.modulos.qtde : '-'} -{' '}
                {order.equipamentos.modulos.potencia ? order.equipamentos.modulos.potencia : 'N/A'}W
              </p>
            </div>
            <div className="row-span-3 grid grid-cols-5 min-h-[80px]">
              <p className="flex items-center justify-center text-xs col-span-2 font-semibold uppercase">KIT SOLAR</p>
              <div className="flex p-2 flex-col items-center justify-center text-xxs col-span-3 border border-black border-t-0">
                {order.equipamentos.disponivel
                  ? order.equipamentos.disponivel.map((equip, index) => (
                      <p key={index} className="w-full text-center text-[0.6rem]">
                        {equip.qtde ? `${equip.qtde}x ` : ''}
                        {equip.descricao}
                      </p>
                    ))
                  : 'N/A'}
              </div>
            </div>
          </div>
          <div className="grid grid-rows-6">
            <div className="row-span-4 grid grid-cols-3 h-full items-center">
              <p className="text-xs col-span-1 text-center w-32 font-semibold uppercase">MATERIAL DO ESCRITÓRIO</p>
              <div className="flex p-2 flex-col items-center text-xs col-span-2 w-full px-2 h-full border border-black">
                {order.equipamentos.retirada
                  ? order.equipamentos.retirada.map((equip, index) => (
                      <p key={index} className="w-full text-center text-[0.6rem]">
                        {equip.qtde ? `${equip.qtde}x ` : ''}
                        {equip.descricao}
                      </p>
                    ))
                  : 'N/A'}
              </div>
            </div>
            <div className="row-span-1 grid grid-cols-3 h-full items-center">
              <p className="text-xs col-span-1 text-center font-semibold uppercase">TIPO DE TELHA</p>
              <div className="text-xs col-span-2 w-full px-2 h-full flex items-center justify-center text-center border border-black border-y-0">
                <div>{order.detalhes.tipoTelha ? order.detalhes.tipoTelha : '-'}</div>
              </div>
            </div>
            <div className="row-span-1 grid grid-cols-3 h-full items-center">
              <p className="text-xs col-span-1 text-center font-semibold uppercase">TIPO DE ESTRUTURA</p>
              <div className="text-xs col-span-2 w-full px-2 h-full flex items-center justify-center text-center border border-black">
                <div>{order.detalhes.tipoEstrutura ? order.detalhes.tipoEstrutura : '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black mt-3">
        <h1 className="text-center  font-bold pt-1">OBSERVAÇÕES DA OBRA/OS</h1>
        <div className="flex flex-col justify-center min-h-[50px] items-center">
          <p>Serviço: {order.descricao.toUpperCase()}</p>
          {order.observacoes ? (
            <div className={`${order.observacoes.length > 370 ? 'text-xxs' : 'text-xs'} px-2 my-2 font-bold text-center`}>
              {order.observacoes ? order.observacoes.split('/').map((string, index) => <li key={index}>{string}</li>) : false}
            </div>
          ) : (
            <p className="my-2">SEM OBSERVAÇÕES DE OS</p>
          )}
        </div>
      </div>
      <div className="border border-black mt-3 px-4 pb-4">
        <h1 className="text-center font-bold py-2">CONFERÊNCIA DOS CHECKLIST</h1>
        <div className="grid grid-cols-2 pb-2">
          <div className="grid grid-rows-2">
            <div className="flex gap-x-2">
              <div className="w-4 h-4 border rounded-md border-black"></div>
              <p className="text-xs">CONFIGURAÇÃO DO SISTEMA FEITA ?</p>
            </div>
            <div className="flex gap-x-2 mt-2">
              <div className="w-4 h-4 border rounded-md border-black"></div>
              <p className="text-xs">FOTOS DA INSTALAÇÃO NO GRUPO DE OBRA ?</p>
            </div>
          </div>
          <div className="grid grid-rows-2">
            <div className="flex">
              <div className="w-4 h-4 border rounded-md border-black"></div>
              <p className="text-xs text-center pl-2">TERMO DE RECEBIMENTO DE OBRA</p>
            </div>
            <div className="flex mt-2 gap-x-2 items-center uppercase">
              <p className="text-xs">Data execução:</p>
              <p>____/____/_____</p>
            </div>
          </div>
        </div>
        <div className="mt-1 grid gap-x-4 grid-cols-2">
          <div className="flex flex-col">
            <p className="text-xs text-start">Autorizado por:</p>
            <div className="w-[150px] flex justify-center  items-centertext-center">
              <Image src={Assinatura} />
            </div>
            <hr className="border-t-2 border-black" />
            <p className="text-xs text-center">ASSINATURA DIRETOR DE ENGENHARIA</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-start">Realizado por:</p>
            <hr className="mt-12 border-t-2 border-black" />
            <p className="text-xs text-center">ASSINATURA TÉCNICO RESPONSÁVEL</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OSMontagemPDF
