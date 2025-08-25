import { useSession } from '@/components/providers/SessionProvider'
import { useRouter } from 'next/router'
import React from 'react'
import Logo from '../../../utils/images/logo-semtexto-branco.png'
import LoadingPage from '../../../components/utils/LoadingPage'
import Image from 'next/image'
import Link from 'next/link'
import { formatDecimalPlaces, formatToMoney } from '../../../utils/constants'
import { useMaterials } from '@/utils/methods/query/materials'
import { useUnauthorizedRedirect } from '@/utils/hooks'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { BsCode } from 'react-icons/bs'

function RelatorioEstoque() {
  const { session, status } = useSession({ required: true })
  const { data: materials, isLoading, isError, isSuccess } = useMaterials()

  useUnauthorizedRedirect({ session, routes: ['Almoxarifado'] })

  if (status !== 'authenticated') return <LoadingPage />
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex h-[29.7cm] w-[21cm] flex-col p-4 px-4">
        <div className="flex items-center justify-center gap-4 border border-[#15599a] bg-[#15599a] p-3">
          <Link href={'/almoxarifado/estoque'}>
            <div className="flex cursor-pointer items-center justify-end">
              <Image height={30} width={30} src={Logo} alt="Logo" />
            </div>
          </Link>
          <h1 className="text-center text-xl leading-none font-black tracking-tight text-white">RELATÓRIO DE ESTOQUE</h1>
        </div>
        <div className="flex w-full grow flex-col">
          <div className="flex items-center gap-2 border border-black bg-[#fead41] p-2">
            <h1 className="w-[10%] text-center text-sm font-bold text-white">INDEX</h1>
            <h1 className="w-[50%] text-center text-sm font-bold text-white">NOME</h1>
            <h1 className="w-[20%] text-center text-sm font-bold text-white">QTDE</h1>
            <h1 className="w-[20%] text-center text-sm font-bold text-white">PREÇO</h1>
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorComponent msg={'Erro ao buscar materiais.'} /> : null}
          {isSuccess
            ? materials.map(
                (material, index) => (
                  <div key={material._id} className="flex items-center gap-2 border-x border-b border-black p-2">
                    <h1 className="w-[10%] text-center text-xs font-medium text-black">{index + 1}</h1>
                    <div className="flex w-[50%] flex-col">
                      <h1 className="w-full text-start text-xs font-medium text-black">{material.nome}</h1>
                      <div className="flex w-full items-center gap-1">
                        <BsCode />
                        <h1 className="text-primary/60 text-[0.65rem] tracking-tight">{material.codigo || 'CÓDIGO NÃO DEFINIDO'}</h1>
                      </div>
                    </div>
                    <h1 className="w-[20%] text-center text-xs font-medium text-black">{formatDecimalPlaces(material.qtde)}</h1>
                    <h1 className="w-[20%] text-center text-xs font-medium text-black">{formatToMoney(material.preco)}</h1>
                  </div>
                )

                // <div
                //   key={index}
                //   // prettier-ignore
                //   className={`grid ${checkQty({qty: material.qtde,minQty: material.qtdeMinima,})? 'bg-red-200' : ''} grid-cols-9 gap-x-2 border-b border-x border-primary/70`}
                // >
                //   <div className="col-span-1 whitespace-nowrap py-4 text-center text-xs font-medium text-gray-900">{index + 1}</div>
                //   <div className="col-span-4 flex items-center gap-2 whitespace-nowrap py-4 text-center  text-xs font-medium text-gray-900 ">
                //     {checkQty({ qty: material.qtde, minQty: material.qtdeMinima }) ? <IoMdAlert size={'25px'} color={'rgb(239,68,68)'} /> : null}
                //     {material.nome}
                //   </div>
                //   <div className="col-span-2 whitespace-nowrap break-words py-4 text-center  text-xs font-medium text-gray-900">
                //     {material.codigo ? material.codigo : '-'}
                //   </div>
                //   <div className="col-span-1 whitespace-nowrap py-4 text-center  text-sm font-medium text-gray-900">
                //     {material.qtde && material.qtde > 0 ? formatDecimalPlaces(material.qtde) : '-'}
                //   </div>
                //   <div className="col-span-1 whitespace-nowrap py-4 text-center  text-sm font-medium text-gray-900">
                //     {material.preco && material.preco > 0 ? formatDecimalPlaces(material.preco) : '-'}
                //   </div>
                // </div>
              )
            : null}
        </div>
      </div>
    </div>
  )
}

export default RelatorioEstoque
