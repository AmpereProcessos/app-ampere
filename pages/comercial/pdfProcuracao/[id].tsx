import ErrorComponent from '@/components/utils/ErrorComponent'
import { TContractRequest, TContractRequestDTO } from '@/utils/schemas/contract-requests'
import connectToSolicitacoesDatabase from '@/utils/services/mongodb/requests'
import { Collection, ObjectId } from 'mongodb'
import { GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import React from 'react'
import Logo from '@/utils/images/logo-texto-azul-vertical.png'
import { formatLocation } from '@/utils/methods/formatting'
import { TLocation } from '@/utils/schemas/useful'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { FaLocationDot } from 'react-icons/fa6'
import { TbWorld } from 'react-icons/tb'
import { MdEmail } from 'react-icons/md'
dayjs.locale(ptBr)

type ProcurationPageProps = {
  requestJSON: string
  error: string | null | undefined
}
function ProcurationPage({ requestJSON, error }: ProcurationPageProps) {
  const request: TContractRequestDTO = JSON.parse(requestJSON)
  const location: TLocation = {
    uf: request.ufInstalacao || '',
    cidade: request.cidadeInstalacao || '',
    bairro: request.bairroInstalacao,
    endereco: request.enderecoInstalacao,
    cep: request.cepInstalacao,
    numeroOuIdentificador: request.numeroResInstalacao,
  }
  if (error) return <ErrorComponent msg={error} />

  return (
    <div className="bg-background relative flex h-fit w-full flex-col self-center overflow-hidden px-12 py-4 lg:h-[297mm] lg:w-[210mm]">
      <div className="flex min-h-[100px] items-center justify-center">
        <div className="relative h-[90px] max-h-[90px] min-h-[90px] w-[90px] max-w-[90px] min-w-[90px]">
          <Image src={Logo} fill={true} alt="Logo da Ampère Energias" />
        </div>
      </div>
      <h1 className="w-full text-center text-[0.9rem] font-black tracking-tight">INSTRUMENTO PARTICULAR DE PROCURAÇÃO</h1>
      <div className="mt-6 flex w-full flex-col gap-1">
        <div className="flex w-full items-start gap-1">
          <h1 className="w-[150px] max-w-[150px] text-[0.9rem] font-black tracking-tight">Nome</h1>
          <h1 className="grow text-[0.9rem] tracking-tight">{request.nomeTitularProjeto || ''}</h1>
        </div>
        <div className="flex w-full items-start gap-1">
          <h1 className="w-[150px] max-w-[150px] text-[0.9rem] font-black tracking-tight">CPF/CNPJ</h1>
          <h1 className="grow text-[0.9rem] tracking-tight">{request.cpf_cnpjTitularProjeto || request.cpf_cnpj}</h1>
        </div>
        <div className="flex w-full items-start gap-1">
          <h1 className="w-[150px] max-w-[150px] text-[0.9rem] font-black tracking-tight">Endereço</h1>
          <h1 className="grow text-[0.9rem] tracking-tight">{formatLocation({ location: location })}</h1>
        </div>
        <div className="flex w-full items-start gap-1">
          <h1 className="w-[150px] max-w-[150px] text-[0.9rem] font-black tracking-tight">Cidade</h1>
          <h1 className="grow text-[0.9rem] tracking-tight">{request.cidadeInstalacao}</h1>
        </div>
      </div>
      <h2 className="mt-4 w-full text-start text-[0.9rem] tracking-tight">
        Por este instrumento particular de procuração, nomeio e constituo como PROCURADORES os Senhores abaixo denominados:
      </h2>
      <div className="mt-6 flex w-full flex-col gap-2">
        <h1 className="w-full text-start text-[0.9rem] tracking-tight">
          1) DIOGO PAULINO CARVALHO, engenheiro eletricista, brasileiro, solteiro, portador do RG MG 14372057 e CPF: 072.427.186-43. Com registro
          geral CREA nº
          <strong>MG0000222051D</strong>, residente e domiciliado em Ituiutaba-MG.
        </h1>
        <h1 className="w-full text-start text-[0.9rem] tracking-tight">
          2) POLLIANA CRISTINA DE REZENDE, engenheira eletricista, brasileira, solteira, portador do RG MG 15600702 e CPF: 099.112.586-02. Com
          registro geral CREA nº <strong>MG0000221297D</strong>, residente e domiciliado em Ituiutaba-MG.
        </h1>
        <h1 className="w-full text-start text-[0.9rem] tracking-tight">
          3) ANDREW BORGES ALEXANDER, engenheiro eletricista, brasileiro, casado, portador do RG MG17182240 e CPF: 127.026.976-31. Com registro geral
          CREA nº <strong>MG0000382412</strong>, residente e domiciliado na Rua das Orquídeas, 337, Cidade Jardim, Ituiutaba-MG, CEP 38.307-854.
        </h1>
      </div>
      <h1 className="mt-6 w-full text-start text-[0.9rem] tracking-tight">
        Com PODERES junto à distribuidora de energia e ao CREA/CFT para assinar documentos, solicitar Liberação de Carga, Cadastros e Projetos, firmar
        termo de compromisso e responsabilidade enfim, praticar TODOS OS ATOS NECESSÁRIOS ao fiel cumprimento deste mandato e, em especial, a
        aprovação de projeto e execução de geração distribuída e projeto de rede para a(s) unidade(s) consumidora(s) em meu nome. Destacar ainda, que
        as devidas tratativas poderão ser realizadas via e-mail: projetos@ampereenergias.com.br
      </h1>
      <h1 className="mt-6 text-start text-[0.9rem] font-black tracking-tight uppercase">
        {request.cidadeInstalacao}, {dayjs().format('DD [de] MMMM [de] YYYY')}
      </h1>
      <div className="mt-16 flex w-full flex-col gap-1">
        <div className="h-[2px] w-[60%] self-center bg-black"></div>
        <h1 className="w-full text-center text-[0.9rem] font-black tracking-tight">{request.nomeTitularProjeto?.toUpperCase()}</h1>
        <p className="w-full text-center text-[0.9rem] tracking-tight">(Outorgante)</p>
        <h1 className="w-full text-center text-[0.9rem] font-black tracking-tight">{request.cpf_cnpjTitularProjeto || request.cpf_cnpj}</h1>
      </div>
      <div className="mt-6 flex w-full flex-col gap-1">
        <h1 className="w-full text-center text-blue-300">(34) 3700-7001</h1>
        <div className="mt-6 flex w-full items-center justify-center gap-1">
          <FaLocationDot size={20} color="rgb(147,197,253)" />
          <p className="text-[0.7rem] tracking-tight text-blue-300">Avenida Nove, 233, Centro - Ituiutaba/MG - CEP 38.300-150</p>
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            <TbWorld size={20} color="rgb(147,197,253)" />
            <p className="text-[0.7rem] tracking-tight text-blue-300">www.ampereenergias.com.br</p>
          </div>
          <div className="flex items-center gap-1">
            <MdEmail size={20} color="rgb(147,197,253)" />
            <p className="text-[0.7rem] tracking-tight text-blue-300">comercial@ampereenergias.com.br</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProcurationPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context
  const { id } = query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id))
    return {
      props: {
        error: 'ID inválido.',
      },
    }
  const db = await connectToSolicitacoesDatabase(process.env.MONGODB_URI)
  const contractRequestCollection: Collection<TContractRequest> = db.collection('contrato')

  const request = await contractRequestCollection.findOne({ _id: new ObjectId(id) })
  if (!request)
    return {
      props: {
        error: 'Formulário não encontrado.',
      },
    }

  return {
    props: {
      requestJSON: JSON.stringify(request),
    },
  }
}
