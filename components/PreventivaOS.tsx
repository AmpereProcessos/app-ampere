import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Assinatura from '../utils/images/signature-diogo.jpg'
import Logo from '../utils/images/logo-texto-azul-vertical.png'
import { TServiceOrderDTO } from '@/utils/schemas/service-order'
import ObservationsDocumentBlock from './identificador/ordensDeServico/ObservationsDocumentBlock'

type PreventivaOSPDFProps = {
  order: TServiceOrderDTO
}
function PreventivaOSPDF({ order }: PreventivaOSPDFProps) {
  return (
    <div className="h-[29.7cm] w-[21cm]  p-4 px-12">
      <h1 className="mb-6 text-center text-xl font-bold">ORDEM DE SERVIÇO</h1>
      <div className="grid grid-cols-2">
        <div className="flex justify-between">
          <Link href="/">
            <div className="flex items-center justify-center">
              <Image height={100} width={100} src={Logo} alt="Logo" />
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
          <div className="flex justify-between border-b border-black">
            <p className="pr-2 text-end">ID da O.S</p>
            <p className="pr-2 text-center">{order._id}</p>
          </div>
          <div className="flex justify-between border-b border-black">
            <p className="pr-2 text-end">DATA DE ABERTURA</p>
            <p className="pr-2 text-center">{order.dataInsercao ? new Date(order.dataInsercao).toLocaleDateString() : '-'}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 border border-black">
        <h1 className="my-2 text-center font-bold">DADOS DO CLIENTE</h1>
        <div className="grid h-full grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="h-full grid-rows-3">
            <div className="grid grid-cols-4">
              <p className="font-semibold">Nome:</p>
              <p className="col-span-3 border border-black text-center text-xs">{order.favorecido.nome}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="font-semibold">Endereço:</p>
              <p className="col-span-3 border border-t-0 border-black text-center text-xs">{order.localizacao.endereco}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="font-semibold">Telefone:</p>
              <p className="col-span-3 border border-t-0 border-black text-center text-xs">{order.favorecido.contato}</p>
            </div>
          </div>
          <div className="h-full grid-rows-3">
            <div className="grid grid-cols-4">
              <p className="font-semibold">Bairro:</p>
              <p className="col-span-3 border border-black text-center text-xs">{order.localizacao.bairro}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="font-semibold">Número:</p>
              <p className="col-span-3 border border-t-0 border-black text-center text-xs">{order.localizacao.numeroOuIdentificador}</p>
            </div>
            <div className="grid grid-cols-4">
              <p className="font-semibold">Cidade:</p>
              <p className="col-span-3 border border-t-0 border-black text-center text-xs">{order.localizacao.cidade}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 border border-black">
        <h1 className="my-2 text-center font-bold">DADOS DO SISTEMA</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid-rows-2">
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">Topologia:</p>
              <p className="col-span-3 border border-black text-center text-xs">
                {order.detalhes?.topologia} ({order.detalhes?.topologia})
              </p>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">NºMódulos:</p>
              <p className="col-span-3 border border-t-0 border-black text-center text-xs">
                {order.equipamentos.modulos.qtde ? order.equipamentos.modulos.qtde : '-'} -{' '}
                {order.equipamentos.modulos.potencia ? order.equipamentos.modulos.potencia : '-'}W
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">Marca/Modelo:</p>
              <p className="col-span-3 w-48 border border-black text-center">
                {order.equipamentos.inversor.modelo ? order.equipamentos.inversor.modelo : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 border border-black">
        <h1 className="my-2 text-center font-bold">INFORMAÇÕES PARA OBRA</h1>
        <div className="grid grid-cols-2 gap-x-2 px-6 pb-2">
          <div className="grid-rows-3 gap-y-px">
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">CONFIGURAR?:</p>
              <p className="col-span-3 border border-black text-center">{order.detalhes.configuracaoMonitoramento == true ? 'SIM' : 'NÃO'}</p>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 text-center font-semibold">PONTO DE ÁGUA:</p>
              <div className="col-span-3 flex items-center justify-center border border-t-0 border-black">
                {order.detalhes.pontoAgua ? order.detalhes.pontoAgua : '-'}
              </div>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">SENHA DO WI-FI:</p>
              <p className="col-span-3 border border-t-0 border-black text-center">{order.detalhes.senhaWifi ? order.detalhes.senhaWifi : '-'}</p>
            </div>
          </div>
          <div className="grid-rows-3">
            <div className="grid grid-cols-5">
              <p className="col-span-2 font-semibold">TIPO DE TELHA:</p>
              <p className="col-span-3 border border-black text-center">{order.detalhes.tipoTelha ? order.detalhes.tipoTelha : '-'}</p>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 text-center font-semibold">TIPO DE ESTRUTURA:</p>
              <div className="col-span-3 flex items-center justify-center border border-t-0 border-black">
                {order.detalhes.tipoEstrutura ? order.detalhes.tipoEstrutura : '-'}
              </div>
            </div>
            <div className="grid grid-cols-5">
              <p className="col-span-2 text-center font-semibold">TRAFO?:</p>
              <p className="col-span-3 border border-t-0 border-black text-center">{order.detalhes.possuiTrafo ? order.detalhes.possuiTrafo : '-'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 border border-black p-1">
        <ObservationsDocumentBlock description={order.descricao} observations={order.observacoes} />
      </div>
      <div className="mt-6 border border-black px-4 pb-4">
        <h1 className="py-1 text-center font-bold">CONFERÊNCIA DOS CHECKLIST</h1>
        <div className="grid grid-cols-2 pb-2">
          <div className="grid grid-rows-2">
            <div className="flex items-center gap-x-2">
              <div className="h-4 w-4 rounded-md border border-black"></div>
              <p className="text-center text-xs">https://forms.gle/FTvLg1Eey2xzPqL37</p>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="h-4 w-4 rounded-md border border-black"></div>
              <p className="text-center text-xs">CHECKLIST DE MATERIAL</p>
            </div>
          </div>
          <div className="grid grid-rows-2">
            <div className="flex items-center gap-x-2">
              <div className="h-4 w-4 rounded-md border border-black"></div>
              <p className="text-center text-xs">TERMO DE REALIZAÇÃO DE MANUTENÇÃO PREVENTIVA</p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-x-2 uppercase">
                <p className="text-xs">Data execução:</p>
                <p>____/____/_____</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 items-end gap-x-4">
          <div className="flex flex-col">
            <p className="text-start">Autorizado por:</p>
            <div className="relative flex h-[40px] w-[150px] items-center justify-center text-center">
              <Image src={Assinatura} fill={true} alt="Assinatura" />
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
