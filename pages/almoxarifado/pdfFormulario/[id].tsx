import React from 'react'
import Logo from '../../../utils/images/logo-semtexto-branco.png'
import connectToDatabase from '../../../utils/services/mongodb/warehouse'
import { Collection, Db, ObjectId } from 'mongodb'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import { GetServerSidePropsContext } from 'next'
import { TNewWarehouseFormulary, TNewWarehouseFormularyDTO, TWarehouseFormulary, TWarehouseFormularyDTO } from '@/utils/schemas/warehouse-formularies'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { formatDate, formatDecimalPlaces, formatToMoney } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { TMaterial } from '@/utils/schemas/materials'
import { BsCalendarCheck, BsCalendarPlus, BsCode } from 'react-icons/bs'

type PDFFormularioProps = {
  formularyJSON: string
  error: string | null | undefined
}
function PDFFormulario({ formularyJSON, error }: PDFFormularioProps) {
  if (error) return <ErrorComponent msg={error} />
  const formulary: TNewWarehouseFormularyDTO = JSON.parse(formularyJSON)
  function getTotalCost(materials: TNewWarehouseFormularyDTO['materiais']) {
    const total = materials.reduce((acc, current) => acc + current.preco * (current.qtdeRetirada - current.qtdeDevolucao), 0)
    return total
  }

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex h-[29.7cm] w-[21cm] flex-col">
        <div className="flex items-center justify-center gap-4 border border-black bg-black p-3">
          <Link href={'/almoxarifado/formularios'}>
            <div className="flex cursor-pointer items-center justify-end">
              <Image height={30} width={30} src={Logo} alt="Logo Ampère" />
            </div>
          </Link>
          <h1 className="text-center text-xl font-black leading-none tracking-tight text-white">RELATÓRIO DE SAÍDA DE MATERIAIS</h1>
        </div>
        <div className="flex w-full flex-col border-x border-black">
          <h1 className="w-full text-center text-lg font-black">{formulary.titulo}</h1>
          <div className="my-2 flex w-full items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <BsCode />
              <h1 className="text-xs tracking-tight text-gray-500">{formulary._id}</h1>
            </div>
            <div className="flex items-center gap-1">
              <BsCalendarPlus />
              <h1 className="text-xs tracking-tight text-gray-500">ABERTO EM: {formatDateAsLocale(formulary.dataInsercao, true)}</h1>
            </div>
            <div className="flex items-center gap-1">
              <BsCalendarCheck />
              <h1 className="text-xs tracking-tight text-gray-500">
                FINALIZADO EM: {formatDateAsLocale(formulary.dataEfetivacao, true) || 'NÃO FINALIZADO'}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col">
          <div className="flex items-center gap-2 border border-black bg-black p-2">
            <h1 className="w-[30%] text-center text-sm font-bold text-white">PRODUTO</h1>
            <h1 className="w-[15%] text-center text-sm font-bold text-white">RETIRADA</h1>
            <h1 className="w-[15%] text-center text-sm font-bold text-white">DEVOLUÇÃO</h1>
            <h1 className="w-[15%] text-center text-sm font-bold text-white">DIFERENÇA</h1>
            <h1 className="w-[25%] text-center text-sm font-bold text-white">CUSTO</h1>{' '}
          </div>

          {formulary.materiais.map((material) => (
            <div className="flex items-center gap-2 border-x border-b border-black p-2">
              <div className="flex w-[30%] flex-col">
                <h1 className="w-full text-start text-xs font-medium text-black">{material.nome}</h1>
                <div className="flex w-full items-center gap-1">
                  <BsCode />
                  <h1 className="text-[0.65rem] tracking-tight text-gray-500">{material.idExterno || 'CÓDIGO NÃO DEFINIDO'}</h1>
                </div>
              </div>
              <h1 className="w-[15%] text-center text-xs font-medium text-black">{formatDecimalPlaces(material.qtdeRetirada)}</h1>
              <h1 className="w-[15%] text-center text-xs font-medium text-black">{formatDecimalPlaces(material.qtdeDevolucao)}</h1>
              <h1 className="w-[15%] text-center text-xs font-medium text-black">
                {formatDecimalPlaces(material.qtdeRetirada - material.qtdeDevolucao)}
              </h1>
              <h1 className="w-[25%] text-center text-xs font-medium text-black">
                {formatToMoney(material.preco * (material.qtdeRetirada - material.qtdeDevolucao))}
              </h1>
            </div>
          ))}
          <div className="flex items-center gap-2 border-x border-b border-black p-2">
            <h1 className="w-[75%] text-center text-lg font-black text-black">TOTAL</h1>

            <h1 className="w-[25%] text-center text-lg font-black text-black">{formatToMoney(getTotalCost(formulary.materiais))}</h1>
          </div>
        </div>
      </div>
    </div>
  )

  // return (
  //   <div className="h-[29.7cm] w-[21cm]  p-4 px-4">
  //     <h1 className="mb-6 text-center text-xl font-bold">REQUISIÇÃO DE SAÍDA DE MATERIAIS</h1>
  //     <div className="grid grid-cols-2">
  //       <div className="flex justify-between">
  //         <Link href={'/almoxarifado/formularios'}>
  //           <div className="flex items-center justify-center">
  //             <Image height="80px" width="240px" src={Logo} />
  //           </div>
  //         </Link>
  //         <div className="pl-2">
  //           <p className="text-center text-sm font-bold">AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA - ME</p>
  //           <p className="text-center text-sm font-bold">
  //             CNPJ <br />
  //             27.901.968/0001-45
  //           </p>
  //         </div>
  //       </div>
  //       <div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
  //         <div className="flex justify-between border-b border-black">
  //           <p className="pr-2 text-center text-xs">ID DO FORMULÁRIO</p>
  //           <p className="pr-2 text-center text-xs">{formulary._id}</p>
  //         </div>
  //         <div className="flex justify-between border-b border-black">
  //           <p className="pr-2 text-end text-xs">DATA DE ABERTURA</p>
  //           <p className="pr-2 text-center text-xs">{formatDateAsLocale(formulary.dataInsercao, true)}</p>
  //         </div>
  //         <div className="flex justify-between border-b border-black">
  //           <p className="pr-2 text-end text-xs">DATA DE FINALIZAÇÃO</p>
  //           <p className="pr-2 text-center text-xs">{formulary.dataEfetivacao ? formatDateAsLocale(formulary.dataEfetivacao, true) : 'EM ABERTO'}</p>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="mt-4 flex w-full flex-col gap-y-2 border border-black py-4">
  //       <div className="flex justify-center">
  //         <h1 className="text-xl font-bold">
  //           {formulary.titulo}
  //           {formulary.projeto ? `- (#${formulary.projeto.identificador})` : ''}
  //         </h1>
  //       </div>
  //       <div className="flex flex-col px-2">
  //         <div className="grid grid-cols-6 gap-x-2 border-b bg-gray-800">
  //           <p className="col-span-2 px-6 py-4 text-center text-sm font-medium text-white">PRODUTO</p>
  //           {/* <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">CÓDIGO</p> */}
  //           <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">RETIRADA</p>
  //           <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">DEVOLUÇÃO</p>
  //           <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">DIFERENÇA</p>
  //           <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">VALOR</p>
  //         </div>
  //         {formulary.materiais.map((material, index) => (
  //           <div key={index} className="grid grid-cols-6 gap-x-2 border-x border-b border-gray-700">
  //             <div className="col-span-2 flex flex-col items-center justify-center">
  //               <p className="whitespace-nowrap text-center text-xs font-medium text-gray-900">{material.nome}</p>
  //               <div className="flex items-center gap-1">
  //                 <BsCode />
  //                 <h1 className="text-[0.65rem] tracking-tight text-gray-500">{material.idExterno || 'CÓDIGO NÃO DEFINIDO'}</h1>
  //               </div>
  //             </div>
  //             {/* <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">{material.id || 'N/A'}</p> */}
  //             <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">
  //               {formatDecimalPlaces(material.qtdeRetirada)}
  //             </p>
  //             <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">
  //               {formatDecimalPlaces(material.qtdeDevolucao || 0)}
  //             </p>
  //             <p className="col-span-1 whitespace-nowrap  px-6 py-4 text-center text-sm font-medium text-gray-900">
  //               {formatDecimalPlaces(material.qtdeRetirada - material.qtdeDevolucao)}
  //             </p>
  //             <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">
  //               {formatToMoney(material.preco * (material.qtdeRetirada - material.qtdeDevolucao))}
  //             </p>
  //           </div>
  //         ))}
  //         <div className="grid grid-cols-6 gap-x-2  border-x border-b border-gray-700">
  //           <p className="col-span-2 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">TOTAL</p>
  //           <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">-</p>

  //           <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">-</p>
  //           <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">-</p>
  //           <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">
  //             {formatToMoney(getTotalCost(formulary.materiais))}
  //           </p>
  //         </div>
  //         {/**<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
  //           <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
  //             <div className="overflow-hidden">
  //               <table className="min-w-full border border-gray-700 text-center">
  //                 <thead className="border-b bg-gray-800">
  //                   <tr>
  //                     <th
  //                       scope="col"
  //                       className="text-sm font-medium text-white px-6 py-4"
  //                     >
  //                       PRODUTO
  //                     </th>
  //                     <th
  //                       scope="col"
  //                       className="text-sm font-medium text-white px-6 py-4"
  //                     >
  //                       RETIRADA
  //                     </th>
  //                     <th
  //                       scope="col"
  //                       className="text-sm font-medium text-white px-6 py-4"
  //                     >
  //                       DEVOLUÇÃO
  //                     </th>
  //                     <th
  //                       scope="col"
  //                       className="text-sm font-medium text-white px-6 py-4"
  //                     >
  //                       DIFERENÇA
  //                     </th>
  //                     <th
  //                       scope="col"
  //                       className="text-sm font-medium text-white px-6 py-4"
  //                     >
  //                       VALOR
  //                     </th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {formulary.materiais.map((material, index) => (
  //                     <tr key={index} className="border-b border-gray-700">
  //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
  //                         {material.nome}
  //                       </td>
  //                       <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                         {material.qtdeSaida}
  //                       </td>
  //                       <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                         {material.qtdeDevolucao ? material.qtdeDevolucao : 0}
  //                       </td>
  //                       <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                         {material.diff ? material.diff.toFixed(2) : "-"}
  //                       </td>
  //                       <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                         R$
  //                         {(material.diff * material.precoUnit)
  //                           .toFixed(2)
  //                           .replace(".", ",")}
  //                       </td>
  //                     </tr>
  //                   ))}
  //                   <tr className="border-b border-gray-700">
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
  //                       TOTAL
  //                     </td>
  //                     <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                       -
  //                     </td>
  //                     <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                       -
  //                     </td>
  //                     <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                       -
  //                     </td>
  //                     <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                       R$
  //                       {getTotalCost()}
  //                     </td>
  //                   </tr>
  //                 </tbody>
  //               </table>
  //             </div>
  //           </div>
  //         </div> */}
  //       </div>
  //     </div>
  //   </div>
  // )
  // else
  //   return (
  //     <div className="h-[29.7cm] w-[21cm]  p-4 px-4">
  //       <h1 className="mb-6 text-center text-xl font-bold">REQUISIÇÃO DE SAÍDA DE MATERIAIS</h1>
  //       <div className="grid grid-cols-2">
  //         <div className="flex justify-between">
  //           <Link href={'/almoxarifado/formularios'}>
  //             <div className="flex items-center justify-center">
  //               <Image height="80px" width="240px" src={Logo} />
  //             </div>
  //           </Link>
  //           <div className="pl-2">
  //             <p className="text-center text-sm font-bold">AMPÈRE ENERGENHARIA E CONSULTORIA ELÉTRICA - ME</p>
  //             <p className="text-center text-sm font-bold">
  //               CNPJ <br />
  //               27.901.968/0001-45
  //             </p>
  //           </div>
  //         </div>
  //         <div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
  //           <div className="flex justify-between border-b border-black">
  //             <p className="pr-2 text-center text-sm">ID DO FORMULÁRIO</p>
  //             <p className="pr-2 text-center text-sm">{formulary._id}</p>
  //           </div>
  //           <div className="flex justify-between border-b border-black">
  //             <p className="pr-2 text-end text-sm">DATA DE ABERTURA</p>
  //             <p className="pr-2 text-center text-sm">
  //               {formulary.dataEfetivacao ? dayjs(formulary.dataEfetivacao).format('DD/MM/YYYY HH:mm') : '-'}
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="mt-4 flex w-full flex-col gap-y-2 border border-black py-4">
  //         <div className="flex justify-center">
  //           <h1 className="text-xl font-bold">
  //             {formulary.nomeDoContrato ? `${formulary.nomeDoContrato} - (#${formulary.codigoProjeto})` : `${formulary.nomeTerceiro}`}
  //           </h1>
  //         </div>
  //         <div className="flex flex-col px-2">
  //           <div className="grid grid-cols-3 gap-x-2 border-b bg-gray-800">
  //             <p className="col-span-2 px-6 py-4 text-center text-sm font-medium text-white">PRODUTO</p>
  //             <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">RETIRADA</p>
  //           </div>
  //           {formulary.materiais.map((material, index) => (
  //             <div key={index} className="grid grid-cols-3 gap-x-2 border-x border-b border-gray-700">
  //               <p className="col-span-2 whitespace-nowrap py-4 text-center text-xs font-medium text-gray-900">{material.nome}</p>
  //               <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">{material.qtdeSaida}</p>
  //             </div>
  //           ))}
  //           <div className="mt-10 flex justify-end">
  //             <div className="w-[35%]">
  //               <hr className="border-t-2 border-black" />
  //               <p className="text-center">Assinatura - Requerente</p>
  //             </div>
  //           </div>
  //           {/**<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
  //           <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
  //             <div className="overflow-hidden">
  //               <table className="min-w-full border border-gray-700 text-center">
  //                 <thead className="border-b bg-gray-800">
  //                   <tr>
  //                     <th
  //                       scope="col"
  //                       className="text-sm font-medium text-white px-6 py-4"
  //                     >
  //                       PRODUTO
  //                     </th>
  //                     <th
  //                       scope="col"
  //                       className="text-sm font-medium text-white px-6 py-4"
  //                     >
  //                       RETIRADA
  //                     </th>
  //                     <th
  //                       scope="col"
  //                       className="text-sm font-medium text-white px-6 py-4"
  //                     >
  //                       DEVOLUÇÃO
  //                     </th>
  //                     <th
  //                       scope="col"
  //                       className="text-sm font-medium text-white px-6 py-4"
  //                     >
  //                       DIFERENÇA
  //                     </th>
  //                     <th
  //                       scope="col"
  //                       className="text-sm font-medium text-white px-6 py-4"
  //                     >
  //                       VALOR
  //                     </th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {formulary.materiais.map((material, index) => (
  //                     <tr key={index} className="border-b border-gray-700">
  //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
  //                         {material.nome}
  //                       </td>
  //                       <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                         {material.qtdeSaida}
  //                       </td>
  //                       <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                         {material.qtdeDevolucao ? material.qtdeDevolucao : 0}
  //                       </td>
  //                       <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                         {material.diff ? material.diff.toFixed(2) : "-"}
  //                       </td>
  //                       <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                         R$
  //                         {(material.diff * material.precoUnit)
  //                           .toFixed(2)
  //                           .replace(".", ",")}
  //                       </td>
  //                     </tr>
  //                   ))}
  //                   <tr className="border-b border-gray-700">
  //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
  //                       TOTAL
  //                     </td>
  //                     <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                       -
  //                     </td>
  //                     <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                       -
  //                     </td>
  //                     <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                       -
  //                     </td>
  //                     <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
  //                       R$
  //                       {getTotalCost()}
  //                     </td>
  //                   </tr>
  //                 </tbody>
  //               </table>
  //             </div>
  //           </div>
  //         </div> */}
  //         </div>
  //       </div>
  //     </div>
  //   )
}

export default PDFFormulario
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context
  const { id } = query

  if (!id || typeof id != 'string' || !ObjectId.isValid(id))
    return {
      props: {
        error: 'Oops, o ID solicitado é inválido.',
      },
    }
  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const formulariesCollection: Collection<TNewWarehouseFormulary> = db.collection('formularios')
  const materialsCollection: Collection<TMaterial> = db.collection('material')
  const formulary = await formulariesCollection.findOne({ _id: new ObjectId(id) })
  if (!formulary)
    return {
      props: {
        error: 'Oops, o formulário solicitado não foi encontrado.',
      },
    }
  const materials = await materialsCollection.find({}, { projection: { codigo: 1 } }).toArray()

  const ajustedList = formulary.materiais.map((material) => {
    const equivalentMaterial = materials.find((m) => m._id.toString() == material.id)
    return { ...material, idExterno: equivalentMaterial?.codigo }
  })
  // Pass data to the page via props
  return { props: { formularyJSON: JSON.stringify({ ...formulary, materiais: ajustedList }) } }
}
