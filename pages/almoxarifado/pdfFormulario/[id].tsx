import React from 'react'
import Logo from '../../../utils/images/logo-texto-azul.png'
import connectToDatabase from '../../../utils/services/mongodb/warehouse'
import { ObjectId } from 'mongodb'
import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
function PDFFormulario({ info, backTo, type }) {
  console.log(type)
  function getTotalCost() {
    var total = 0
    for (let i = 0; i < info.materiais.length; i++) {
      if (info.materiais[i].diff) {
        total = total + info.materiais[i].diff * info.materiais[i].precoUnit
      } else {
        total = total + getDiff(info.materiais[i].qtdeSaida, info.materiais[i].qtdeDevolucao) * info.materiais[i].precoUnit
      }
    }
    return total.toFixed(2)
  }
  function getDiff(taken, returned) {
    const fixedTaken = taken ? taken : 0
    const fixedReturned = returned ? returned : 0
    return Number((fixedTaken - fixedReturned).toFixed(2))
  }
  if (type == 'SIM')
    return (
      <div className="h-[29.7cm] w-[21cm]  p-4 px-4">
        <h1 className="mb-6 text-center text-xl font-bold">REQUISIÇÃO DE SAÍDA DE MATERIAIS</h1>
        <div className="grid grid-cols-2">
          <div className="flex justify-between">
            <Link href={backTo ? `/${backTo}` : '/almoxarifado/formularios'}>
              <div className="flex items-center justify-center">
                <Image height="80px" width="240px" src={Logo} />
              </div>
            </Link>
            <div className="pl-2">
              <p className="text-center text-sm font-bold">AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA - ME</p>
              <p className="text-center text-sm font-bold">
                CNPJ <br />
                27.901.968/0001-45
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
            <div className="flex justify-between border-b border-black">
              <p className="pr-2 text-center text-sm">ID DO FORMULÁRIO</p>
              <p className="pr-2 text-center text-sm">{info._id}</p>
            </div>
            <div className="flex justify-between border-b border-black">
              <p className="pr-2 text-end text-sm">DATA DE ABERTURA</p>
              <p className="pr-2 text-center text-sm">{info.dataEfetivacao ? dayjs(info.dataEfetivacao).format('DD/MM/YYYY HH:mm') : '-'}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-col gap-y-2 border border-black py-4">
          <div className="flex justify-center">
            <h1 className="text-xl font-bold">
              {info.nomeDoContrato ? info.nomeDoContrato : info.nomeTerceiro}
              {info.codigoProjeto ? `- (#${info.codigoProjeto})` : ''}
            </h1>
          </div>
          <div className="flex flex-col px-2">
            <div className="grid grid-cols-7 gap-x-2 border-b bg-gray-800">
              <p className="col-span-2 px-6 py-4 text-center text-sm font-medium text-white">PRODUTO</p>
              <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">CÓDIGO</p>
              <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">RETIRADA</p>
              <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">DEVOLUÇÃO</p>
              <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">DIFERENÇA</p>
              <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">VALOR</p>
            </div>
            {info.materiais.map((material, index) => (
              <div key={index} className="grid grid-cols-7 gap-x-2 border-x border-b border-gray-700">
                <p className="col-span-2 whitespace-nowrap py-4 text-center text-xs font-medium text-gray-900">{material.nome}</p>
                <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">{material.codigo}</p>
                <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">{material.qtdeSaida}</p>
                <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">
                  {material.qtdeDevolucao ? material.qtdeDevolucao : 0}
                </p>
                <p className="col-span-1 whitespace-nowrap  px-6 py-4 text-center text-sm font-medium text-gray-900">
                  {material.diff ? material.diff.toFixed(2) : getDiff(material.qtdeSaida, material.qtdeDevolucao)}
                </p>
                <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">
                  R$
                  {material.diff
                    ? (material.diff * material.precoUnit).toFixed(2).replace('.', ',')
                    : (getDiff(material.qtdeSaida, material.qtdeDevolucao) * material.precoUnit).toFixed(2).replace('.', ',')}
                </p>
              </div>
            ))}
            <div className="grid grid-cols-7 gap-x-2  border-x border-b border-gray-700">
              <p className="col-span-2 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">TOTAL</p>
              <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">-</p>
              <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">-</p>
              <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">-</p>
              <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">-</p>
              <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">
                R$
                {getTotalCost()}
              </p>
            </div>
            {/**<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full border border-gray-700 text-center">
                  <thead className="border-b bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        PRODUTO
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        RETIRADA
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        DEVOLUÇÃO
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        DIFERENÇA
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        VALOR
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {info.materiais.map((material, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {material.nome}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {material.qtdeSaida}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {material.qtdeDevolucao ? material.qtdeDevolucao : 0}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {material.diff ? material.diff.toFixed(2) : "-"}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          R$
                          {(material.diff * material.precoUnit)
                            .toFixed(2)
                            .replace(".", ",")}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-b border-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        TOTAL
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                        -
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                        -
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                        -
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                        R$
                        {getTotalCost()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </div>
    )
  else
    return (
      <div className="h-[29.7cm] w-[21cm]  p-4 px-4">
        <h1 className="mb-6 text-center text-xl font-bold">REQUISIÇÃO DE SAÍDA DE MATERIAIS</h1>
        <div className="grid grid-cols-2">
          <div className="flex justify-between">
            <Link href={backTo ? `/${backTo}` : '/almoxarifado/formularios'}>
              <div className="flex items-center justify-center">
                <Image height="80px" width="240px" src={Logo} />
              </div>
            </Link>
            <div className="pl-2">
              <p className="text-center text-sm font-bold">AMPÈRE ENERGENHARIA E CONSULTORIA ELÉTRICA - ME</p>
              <p className="text-center text-sm font-bold">
                CNPJ <br />
                27.901.968/0001-45
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-y-2 border border-black pl-2">
            <div className="flex justify-between border-b border-black">
              <p className="pr-2 text-center text-sm">ID DO FORMULÁRIO</p>
              <p className="pr-2 text-center text-sm">{info._id}</p>
            </div>
            <div className="flex justify-between border-b border-black">
              <p className="pr-2 text-end text-sm">DATA DE ABERTURA</p>
              <p className="pr-2 text-center text-sm">{info.dataEfetivacao ? dayjs(info.dataEfetivacao).format('DD/MM/YYYY HH:mm') : '-'}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-col gap-y-2 border border-black py-4">
          <div className="flex justify-center">
            <h1 className="text-xl font-bold">
              {info.nomeDoContrato ? `${info.nomeDoContrato} - (#${info.codigoProjeto})` : `${info.nomeTerceiro}`}
            </h1>
          </div>
          <div className="flex flex-col px-2">
            <div className="grid grid-cols-3 gap-x-2 border-b bg-gray-800">
              <p className="col-span-2 px-6 py-4 text-center text-sm font-medium text-white">PRODUTO</p>
              <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">RETIRADA</p>
            </div>
            {info.materiais.map((material, index) => (
              <div key={index} className="grid grid-cols-3 gap-x-2 border-x border-b border-gray-700">
                <p className="col-span-2 whitespace-nowrap py-4 text-center text-xs font-medium text-gray-900">{material.nome}</p>
                <p className="col-span-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">{material.qtdeSaida}</p>
              </div>
            ))}
            <div className="mt-10 flex justify-end">
              <div className="w-[35%]">
                <hr className="border-t-2 border-black" />
                <p className="text-center">Assinatura - Requerente</p>
              </div>
            </div>
            {/**<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full border border-gray-700 text-center">
                  <thead className="border-b bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        PRODUTO
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        RETIRADA
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        DEVOLUÇÃO
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        DIFERENÇA
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-white px-6 py-4"
                      >
                        VALOR
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {info.materiais.map((material, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {material.nome}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {material.qtdeSaida}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {material.qtdeDevolucao ? material.qtdeDevolucao : 0}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {material.diff ? material.diff.toFixed(2) : "-"}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          R$
                          {(material.diff * material.precoUnit)
                            .toFixed(2)
                            .replace(".", ",")}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-b border-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        TOTAL
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                        -
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                        -
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                        -
                      </td>
                      <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                        R$
                        {getTotalCost()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </div>
    )
}

export default PDFFormulario
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id
  const backTo = query.backTo ? query.backTo : ''
  const type = query.efetivado ? query.efetivado : 'SIM'
  const db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection('formularios')
  const materialCollection = db.collection('material')
  let form = await collection.findOne({
    _id: ObjectId(id),
  })
  let items = await materialCollection.find({}).toArray()
  let ajustedMaterials = form.materiais.map((mat) => {
    const itemInDb = items.find((item) => item._id == mat.id)
    return { ...mat, codigo: itemInDb?.codigo ? itemInDb.codigo : 'N/A' }
  })
  form = { ...form, materiais: ajustedMaterials }
  let info = JSON.parse(JSON.stringify(form))
  // Pass data to the page via props
  return { props: { info, backTo, type } }
}
