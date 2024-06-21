import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Assinatura from '../utils/images/signature-diogo.jpg'
import Logo from '../utils/images/logo-texto-azul-vertical.png'
import { TServiceOrderDTO } from '@/utils/schemas/service-order'
import ObservationsDocumentBlock from './identificador/ordensDeServico/ObservationsDocumentBlock'

type OSMontagemPDFProps = {
  order: TServiceOrderDTO
}
function OSMontagemPDF({ order }: OSMontagemPDFProps) {
  return (
    <div className="h-[29.7cm] w-[21cm]  p-4 px-12">
      <h1 className="mb-6 text-center text-xl font-bold">ORDEM DE SERVIÇO</h1>
      <div className="grid grid-cols-2">
        <div className="flex items-center justify-between">
          <Link href="/obras">
            <div className="flex items-center justify-center">
              <Image height="60px" width="60px" src={Logo} />
            </div>
          </Link>
          <div className="pl-2">
            <p className="text-center font-bold">AMPÈRE ENERGENHARIA E CONSULTORIA ELÉTRICA - ME</p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
          <div className="flex justify-between border-b border-black">
            <p className="pr-2 text-end text-xs">DATA DE ABERTURA</p>
            <p className="pr-2 text-center text-xs">{order.dataInsercao ? new Date(order.dataInsercao).toLocaleDateString() : '-'}</p>
          </div>
          <div className="flex justify-between border-b border-black">
            <p className="pr-2 text-end text-xs">GRAU DE URGÊNCIA</p>
            <p className="pr-2 text-center text-xs">{order.urgencia || '-'}</p>
          </div>
          <div className="flex justify-between">
            <p className="pr-2 text-end text-xs">REALIZAR COBRANÇA</p>
            <p className="pr-2 text-center text-xs">{order.cobranca.pagador ? 'SIM' : 'NÃO'}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 border border-black">
        <h1 className="my-2 text-center font-bold">DADOS DO CLIENTE</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid-rows-3">
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Nome:</p>
              <p className="col-span-3 border border-black text-center text-xs">
                {order.projeto.identificador || ''} {order.favorecido.nome}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Endereço:</p>
              <p className="col-span-3 border border-t-0 border-black text-center text-xs">{order.localizacao.endereco}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Telefone:</p>
              <p className="col-span-3 border border-t-0 border-black text-center text-xs">{order.favorecido.contato}</p>
            </div>
          </div>
          <div className="grid-rows-3">
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Bairro:</p>
              <p className="col-span-3 border border-black text-center text-xs">{order.localizacao.bairro}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Número:</p>
              <p className="col-span-3 border border-t-0 border-black text-center text-xs">{order.localizacao.numeroOuIdentificador}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="text-xs font-semibold uppercase">Cidade:</p>
              <p className="col-span-3 border border-t-0 border-black text-center text-xs">{order.localizacao.cidade}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 border border-black">
        <h1 className="my-2 text-center font-bold">DADOS INSTALAÇÃO</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid grid-rows-5">
            <div className="row-span-1 grid grid-cols-5">
              <p className="col-span-2 text-center text-xs font-semibold uppercase">Topologia:</p>
              <p className="col-span-3 border border-black text-center text-xs">
                {order.detalhes.topologia} ({order.equipamentos?.inversor.modelo || 'N/A'} - {order.equipamentos.inversor.potencia || 'N/A'}W)
              </p>
            </div>
            <div className="row-span-1 grid grid-cols-5">
              <p className="col-span-2 text-center text-xs font-semibold uppercase">Módulos:</p>
              <p className="col-span-3 border border-t-0 border-black text-center text-xs">
                {order.equipamentos.modulos.qtde ? order.equipamentos.modulos.qtde : '-'} -{' '}
                {order.equipamentos.modulos.potencia ? order.equipamentos.modulos.potencia : 'N/A'}W
              </p>
            </div>
            <div className="row-span-3 grid min-h-[80px] grid-cols-5">
              <p className="col-span-2 flex items-center justify-center text-xs font-semibold uppercase">KIT SOLAR</p>
              <div className="col-span-3 flex flex-col items-center justify-center border border-t-0 border-black p-2 text-xxs">
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
            <div className="row-span-4 grid h-full grid-cols-3 items-center">
              <p className="col-span-1 w-32 text-center text-xs font-semibold uppercase">MATERIAL DO ESCRITÓRIO</p>
              <div className="col-span-2 flex h-full w-full flex-col items-center border border-black p-2 px-2 text-xs">
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
            <div className="row-span-1 grid h-full grid-cols-3 items-center">
              <p className="col-span-1 text-center text-xs font-semibold uppercase">TIPO DE TELHA</p>
              <div className="col-span-2 flex h-full w-full items-center justify-center border border-y-0 border-black px-2 text-center text-xs">
                <div>{order.detalhes.tipoTelha ? order.detalhes.tipoTelha : '-'}</div>
              </div>
            </div>
            <div className="row-span-1 grid h-full grid-cols-3 items-center">
              <p className="col-span-1 text-center text-xs font-semibold uppercase">TIPO DE ESTRUTURA</p>
              <div className="col-span-2 flex h-full w-full items-center justify-center border border-black px-2 text-center text-xs">
                <div>{order.detalhes.tipoEstrutura ? order.detalhes.tipoEstrutura : '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 border border-black p-1">
        <ObservationsDocumentBlock description={order.descricao} observations={order.observacoes} />
      </div>
      <div className="mt-3 border border-black px-4 pb-4">
        <h1 className="py-2 text-center font-bold">CONFERÊNCIA DOS CHECKLIST</h1>
        <div className="grid grid-cols-2 pb-2">
          <div className="grid grid-rows-2">
            <div className="flex gap-x-2">
              <div className="h-4 w-4 rounded-md border border-black"></div>
              <p className="text-xs">CONFIGURAÇÃO DO SISTEMA FEITA ?</p>
            </div>
            <div className="mt-2 flex gap-x-2">
              <div className="h-4 w-4 rounded-md border border-black"></div>
              <p className="text-xs">FOTOS DA INSTALAÇÃO NO GRUPO DE OBRA ?</p>
            </div>
          </div>
          <div className="grid grid-rows-2">
            <div className="flex">
              <div className="h-4 w-4 rounded-md border border-black"></div>
              <p className="pl-2 text-center text-xs">TERMO DE RECEBIMENTO DE OBRA</p>
            </div>
            <div className="mt-2 flex items-center gap-x-2 uppercase">
              <p className="text-xs">Data execução:</p>
              <p>____/____/_____</p>
            </div>
          </div>
        </div>
        <div className="mt-1 grid grid-cols-2 gap-x-4">
          <div className="flex flex-col">
            <p className="text-start text-xs">Autorizado por:</p>
            <div className="items-centertext-center flex w-[150px]  justify-center">
              <Image src={Assinatura} />
            </div>
            <hr className="border-t-2 border-black" />
            <p className="text-center text-xs">ASSINATURA DIRETOR DE ENGENHARIA</p>
          </div>
          <div className="flex flex-col">
            <p className="text-start text-xs">Realizado por:</p>
            <hr className="mt-12 border-t-2 border-black" />
            <p className="text-center text-xs">ASSINATURA TÉCNICO RESPONSÁVEL</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OSMontagemPDF
