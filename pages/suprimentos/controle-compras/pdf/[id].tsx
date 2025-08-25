import ErrorComponent from '@/components/utils/ErrorComponent'
import { TPurchaseControl, TPurchaseControlWithProjectDTO } from '@/utils/schemas/purchases'
import connectToDatabase from '@/utils/services/mongodb/projects'
import { Db, ObjectId } from 'mongodb'
import { GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AmpereLogo from '@/utils/images/logo-semtexto-branco.png'
import { FaPhone, FaUserAlt } from 'react-icons/fa'
import { MdDashboard, MdLandscape, MdOutlinePayment, MdPhone } from 'react-icons/md'
import { BsBank, BsPersonVcard } from 'react-icons/bs'
import { FaLocationDot } from 'react-icons/fa6'
import { formatLocation } from '@/utils/methods/formatting'
import { formatDecimalPlaces } from '@/utils/constants'
type PurchaseControlPageProps = {
  purchaseControlJSON: string
  error: string | null | undefined
}
function PurchaseControlPage({ purchaseControlJSON, error }: PurchaseControlPageProps) {
  const purchaseControl: TPurchaseControlWithProjectDTO = JSON.parse(purchaseControlJSON)
  console.log(purchaseControl)

  if (!!error) return <ErrorComponent msg={error} />

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex h-[29.7cm] w-[21cm] flex-col">
        <div className="flex items-center justify-center gap-4 border border-black bg-black p-3">
          <Link href={'/suprimentos/controle-compras'}>
            <div className="flex cursor-pointer items-center justify-end">
              <Image height={30} width={30} src={AmpereLogo} alt="Logo Ampère" />
            </div>
          </Link>
          <h1 className="text-center text-xl leading-none font-black tracking-tight text-white">COMPOSIÇÃO DE COMPRA</h1>
        </div>
        <div className="flex w-full flex-col gap-2 border-x border-black py-2">
          <h1 className="w-full text-center text-lg font-black">{purchaseControl.titulo}</h1>
          {purchaseControl.projetoDados ? (
            <div className="flex flex-col items-center gap-1">
              <p className="text-primary/60 text-[0.7rem] font-medium">INFORMAÇÕES DE PROJETO</p>
              <div className="flex flex-wrap items-center justify-center gap-4 px-2">
                <div className="flex items-center gap-1">
                  <FaUserAlt />
                  <p className="text-xs leading-none font-medium tracking-tight">{purchaseControl.projetoDados!.nomeDoContrato}</p>
                </div>
                <div className="flex items-center gap-1">
                  <MdPhone />
                  <p className="text-xs leading-none font-medium tracking-tight">{purchaseControl.projetoDados?.telefone}</p>
                </div>
                <div className="flex items-center gap-1">
                  <BsPersonVcard />
                  <p className="text-xs leading-none font-medium tracking-tight">{purchaseControl.projetoDados?.cpf_cnpj}</p>
                </div>
                <div className="flex items-center gap-1">
                  <MdLandscape />
                  <p className="text-xs leading-none font-medium tracking-tight">{purchaseControl.projetoDados?.inscricaoRural || 'N/A'}</p>
                </div>
              </div>
              <p className="text-primary/60 text-[0.7rem] font-medium">INFORMAÇÕES DE PAGAMENTO</p>
              <div className="flex flex-wrap items-center justify-center gap-4 px-2">
                <div className="flex items-center gap-1">
                  <FaUserAlt />
                  <p className="text-xs leading-none font-medium tracking-tight">{purchaseControl.projetoDados.pagamento.pagador}</p>
                </div>
                <div className="flex items-center gap-1">
                  <FaPhone />
                  <p className="text-xs leading-none font-medium tracking-tight">{purchaseControl.projetoDados.pagamento.contatoPagador}</p>
                </div>
                <div className="flex items-center gap-1">
                  <BsPersonVcard />
                  <p className="text-xs leading-none font-medium tracking-tight">{purchaseControl.projetoDados?.pagamento.cpf_cnpjPagador}</p>
                </div>
                <div className="flex items-center gap-1">
                  <MdOutlinePayment />
                  <p className="text-xs leading-none font-medium tracking-tight">{purchaseControl.projetoDados.pagamento.forma || 'NÃO DEFINIDO'}</p>
                </div>
                <div className="flex items-center gap-1">
                  <BsBank />
                  <p className="text-xs leading-none font-medium tracking-tight">{purchaseControl.projetoDados.pagamento.credor || 'NÃO DEFINIDO'}</p>
                </div>
              </div>
            </div>
          ) : null}
          <div className="flex flex-col items-center gap-1">
            <p className="text-primary/60 text-[0.7rem] font-medium">LOCALIZAÇÃO</p>
            <div className="flex w-full items-center justify-center">
              <div className="flex items-center gap-1">
                <FaLocationDot />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {formatLocation({
                    location: purchaseControl.entrega.localizacao,
                    includeCity: true,
                    includeUf: true,
                    includeCEP: true,
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-primary/60 text-[0.7rem] font-medium">ANOTAÇÕES</p>
            <p className="w-[90%] rounded bg-gray-50 p-1 text-center text-[0.6rem] leading-none font-medium tracking-tight">
              {purchaseControl.anotacoes || 'NÃO DEFINIDO'}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-2 border border-black bg-black p-2">
            <h1 className="w-[40%] text-center text-sm font-bold text-white">PRODUTO</h1>
            <h1 className="w-[30%] text-center text-sm font-bold text-white">UNIDADE</h1>
            <h1 className="w-[30%] text-center text-sm font-bold text-white">QUANTIDADE</h1>
          </div>
          {purchaseControl.composicao.map((item) => (
            <div className="flex items-center gap-2 border-x border-b border-black p-2">
              <div className="flex w-[40%] flex-col">
                <h1 className="w-full text-start text-xs font-medium text-black">{item.descricao}</h1>
                <div className="flex w-full items-center gap-1">
                  <MdDashboard />
                  <h1 className="text-primary/60 text-[0.65rem] tracking-tight">{item.categoria || 'CÓDIGO NÃO DEFINIDO'}</h1>
                </div>
              </div>
              <h1 className="w-[30%] text-center text-xs font-medium text-black">{item.unidade}</h1>
              <h1 className="w-[30%] text-center text-xs font-medium text-black">{formatDecimalPlaces(item.qtde)}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PurchaseControlPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context
  const { id } = query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id))
    return {
      props: {
        error: 'ID inválido.',
      },
    }

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TPurchaseControl>('controles-compras')

  const addFields = { projectIdAsObjectId: { $toObjectId: '$projeto.id' } }
  const lookup = { from: 'dados', localField: 'projectIdAsObjectId', foreignField: '_id', as: 'projetoDados' }
  const purchaseControlArr = await collection
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $addFields: addFields },
      { $lookup: lookup },
      {
        $project: {
          status: 1,
          titulo: 1,
          anotacoes: 1,
          projeto: 1,
          etiquetas: 1,
          atualizacoes: 1,
          totalPrevisto: 1,
          liberacao: 1,
          composicao: 1,
          dataPagamento: 1,
          dataPedido: 1,
          fornecedor: 1,
          total: 1,
          transporte: 1,
          faturamentos: 1,
          entrega: 1,
          autor: 1,
          dataInsercao: 1,
          dataEfetivacao: 1,
          'projetoDados._id': 1,
          'projetoDados.nomeDoContrato': 1,
          'projetoDados.cpf_cnpj': 1,
          'projetoDados.inscricaoRural': 1,
          'projetoDados.tipoDeServico': 1,
          'projetoDados.telefone': 1,
          'projetoDados.email': 1,
          'projetoDados.cep': 1,
          'projetoDados.uf': 1,
          'projetoDados.cidade': 1,
          'projetoDados.bairro': 1,
          'projetoDados.logradouro': 1,
          'projetoDados.numeroResidencia': 1,
          'projetoDados.pagamento.pagador': 1,
          'projetoDados.pagamento.contatoPagador': 1,
          'projetoDados.pagamento.cpf_cnpjPagador': 1,
          'projetoDados.pagamento.forma': 1,
          'projetoDados.pagamento.metodo': 1,
          'projetoDados.pagamento.credor': 1,
          'projetoDados.pagamento.credorNomeGerente': 1,
          'projetoDados.pagamento.credorContatoGerente': 1,
          'projetoDados.pagamento.negociacao': 1,
          'projetoDados.produtos': 1,
          'projetoDados.idVisitaTecnica': 1,
        },
      },
    ])
    .toArray()
  const purchaseControl = purchaseControlArr.map((p) => ({ ...p, projetoDados: p.projetoDados[0] }))[0]
  if (!purchaseControl)
    return {
      props: {
        error: 'Controle de compra não encontrado.',
      },
    }

  return {
    props: {
      purchaseControlJSON: JSON.stringify(purchaseControl),
    },
  }
}
