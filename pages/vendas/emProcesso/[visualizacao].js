import React, { useState } from 'react'

import connectToDatabase from '../../../utils/services/mongodb/projects'
import { FaUser } from 'react-icons/fa'
import { useSession } from '../../../components/providers/SessionProvider'
import LoadingPage from '../../../components/utils/LoadingPage'
function InProgress({ data }) {
  const { status } = useSession({
    required: true,
  })
  const [selectedProjects, setProjects] = useState({
    estagio: 'ASSINATURA DO CONTRATO',
    projetos: data.assContrato,
  })

  if (status !== 'authenticated') return <LoadingPage />

  return (
    <div className="flex grow flex-col bg-gray-100 p-6">
      <h1 className="text-center font-['Roboto'] text-xl font-bold text-[#15599a]">PROJETOS EM ANDAMENTO</h1>
      <div className="mt-4 flex w-full grow bg-gray-100">
        <ol className="border-l-2 border-[#15599a]">
          <li>
            <div className="flex-start flex items-center">
              <div className="-ml-2 mr-3 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xxs text-white"></div>
              <h4 className="-mt-2 text-xl font-semibold text-gray-800">ASSINATURA DO CONTRATO</h4>
            </div>
            <div className="ml-6 mb-6 flex flex-col gap-3 pb-6">
              <p className="text-sm text-blue-600 transition duration-300 ease-in-out focus:text-blue-800 hover:text-blue-700">
                {data.assContrato.length} projetos nesse estágio
              </p>
              <button
                onClick={() =>
                  setProjects({
                    estagio: 'ASSINATURA DO CONTRATO',
                    projetos: data.assContrato,
                  })
                }
                type="button"
                className="w-fit rounded bg-blue-500 px-4 py-1.5 text-xs font-medium uppercase leading-tight text-white shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex-start flex items-center">
              <div className="-ml-2 mr-3 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600"></div>
              <h4 className="-mt-2 text-xl font-semibold text-gray-800">COMPRA DO KIT</h4>
            </div>
            <div className="ml-6 mb-6 flex flex-col gap-3 pb-6">
              <p className="text-sm text-blue-600 transition duration-300 ease-in-out focus:text-blue-800 hover:text-blue-700">
                {data.compraDoKit.length} projetos nesse estágio
              </p>
              <button
                onClick={() =>
                  setProjects({
                    estagio: 'COMPRA DO KIT',
                    projetos: data.compraDoKit,
                  })
                }
                type="button"
                className="w-fit rounded bg-blue-500 px-4 py-1.5 text-xs font-medium uppercase leading-tight text-white shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex-start flex items-center">
              <div className="-ml-2 mr-3 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600"></div>
              <h4 className="-mt-2 text-xl font-semibold text-gray-800">ENTREGA DO KIT</h4>
            </div>
            <div className="ml-6 mb-6 flex flex-col gap-3 pb-6">
              <p className="text-sm text-blue-600 transition duration-300 ease-in-out focus:text-blue-800 hover:text-blue-700">
                {data.entregaDoKit.length} projetos nesse estágio
              </p>
              <button
                onClick={() =>
                  setProjects({
                    estagio: 'ENTREGA DO KIT',
                    projetos: data.entregaDoKit,
                  })
                }
                type="button"
                className="w-fit rounded bg-blue-500 px-4 py-1.5 text-xs font-medium uppercase leading-tight text-white shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex-start flex items-center">
              <div className="-ml-2 mr-3 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600"></div>
              <h4 className="-mt-2 text-xl font-semibold text-gray-800">ASSINATURA DA DOCUMENTAÇÃO</h4>
            </div>
            <div className="ml-6 mb-6 flex flex-col gap-3 pb-6">
              <p className="text-sm text-blue-600 transition duration-300 ease-in-out focus:text-blue-800 hover:text-blue-700">
                {data.assDocumentacoes.length} projetos nesse estágio
              </p>
              <button
                onClick={() =>
                  setProjects({
                    estagio: 'ASSINATURA DA DOCUMENTAÇÃO',
                    projetos: data.assDocumentacoes,
                  })
                }
                type="button"
                className="w-fit rounded bg-blue-500 px-4 py-1.5 text-xs font-medium uppercase leading-tight text-white shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex-start flex items-center">
              <div className="-ml-2 mr-3 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600"></div>
              <h4 className="-mt-2 text-xl font-semibold text-gray-800">LIBERAÇÃO DA CONCESSIONÁRIA</h4>
            </div>
            <div className="ml-6 mb-6 flex flex-col gap-3 pb-6">
              <p className="text-sm text-blue-600 transition duration-300 ease-in-out focus:text-blue-800 hover:text-blue-700">
                {data.libConc.length} projetos nesse estágio
              </p>
              <button
                onClick={() =>
                  setProjects({
                    estagio: 'LIBERAÇÃO DA CONCESSIONÁRIA',
                    projetos: data.libConc,
                  })
                }
                type="button"
                className="w-fit rounded bg-blue-500 px-4 py-1.5 text-xs font-medium uppercase leading-tight text-white shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex-start flex items-center">
              <div className="-ml-2 mr-3 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600"></div>
              <h4 className="-mt-2 text-xl font-semibold text-gray-800">AGENDAMENTO DA OBRA</h4>
            </div>
            <div className="ml-6 mb-6 flex flex-col gap-3 pb-6">
              <p className="text-sm text-blue-600 transition duration-300 ease-in-out focus:text-blue-800 hover:text-blue-700">
                {data.agendamentoObra.length} projetos nesse estágio
              </p>
              <button
                onClick={() =>
                  setProjects({
                    estagio: 'AGENDAMENTO DA OBRA',
                    projetos: data.agendamentoObra,
                  })
                }
                type="button"
                className="w-fit rounded bg-blue-500 px-4 py-1.5 text-xs font-medium uppercase leading-tight text-white shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex-start flex items-center">
              <div className="-ml-2 mr-3 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600"></div>
              <h4 className="-mt-2 text-xl font-semibold text-gray-800">TÉRMINO DA OBRA</h4>
            </div>
            <div className="ml-6 mb-6 flex flex-col gap-3 pb-6">
              <p className="text-sm text-blue-600 transition duration-300 ease-in-out focus:text-blue-800 hover:text-blue-700">
                {data.terminoObra.length} projetos nesse estágio
              </p>
              <button
                onClick={() =>
                  setProjects({
                    estagio: 'TÉRMINO DA OBRA',
                    projetos: data.terminoObra,
                  })
                }
                type="button"
                className="w-fit rounded bg-blue-500 px-4 py-1.5 text-xs font-medium uppercase leading-tight text-white shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex-start flex items-center">
              <div className="-ml-2 mr-3 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600"></div>
              <h4 className="-mt-2 text-xl font-semibold text-gray-800">VISTORIA DA CONCESSIONÁRIA</h4>
            </div>
            <div className="ml-6 mb-6 flex flex-col gap-3 pb-6">
              <p className="text-sm text-blue-600 transition duration-300 ease-in-out focus:text-blue-800 hover:text-blue-700">
                {data.vistoriaConcessionaria.length} projetos nesse estágio
              </p>
              <button
                onClick={() =>
                  setProjects({
                    estagio: 'VISTORIA DA CONCESSIONÁRIA',
                    projetos: data.vistoriaConcessionaria,
                  })
                }
                type="button"
                className="w-fit rounded bg-blue-500 px-4 py-1.5 text-xs font-medium uppercase leading-tight text-white shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex-start flex items-center">
              <div className="-ml-2 mr-3 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600"></div>
              <h4 className="-mt-2 text-xl font-semibold text-gray-800">LIGAMENTO DA USINA</h4>
            </div>
            <div className="ml-6 mb-6 flex flex-col gap-3 pb-6">
              <p className="text-sm text-blue-600 transition duration-300 ease-in-out focus:text-blue-800 hover:text-blue-700">
                {data.ligamentoUsina.length} projetos nesse estágio
              </p>
              <button
                onClick={() =>
                  setProjects({
                    estagio: 'LIGAMENTO DA USINA',
                    projetos: data.ligamentoUsina,
                  })
                }
                type="button"
                className="w-fit rounded bg-blue-500 px-4 py-1.5 text-xs font-medium uppercase leading-tight text-white shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex-start flex items-center">
              <div className="-ml-2 mr-3 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600"></div>
              <h4 className="-mt-2 text-xl font-semibold text-gray-800">ENTREGA TÉCNICA</h4>
            </div>
            <div className="ml-6 mb-6 flex flex-col gap-3 pb-6">
              <p className="text-sm text-blue-600 transition duration-300 ease-in-out focus:text-blue-800 hover:text-blue-700">
                {data.entregaTecnica.length} projetos nesse estágio
              </p>
              <button
                onClick={() =>
                  setProjects({
                    estagio: 'ENTREGA TÉCNICA',
                    projetos: data.entregaTecnica,
                  })
                }
                type="button"
                className="w-fit rounded bg-blue-500 px-4 py-1.5 text-xs font-medium uppercase leading-tight text-white shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
        </ol>
        <div className="sticky top-[10%] left-[60%] h-[600px] w-[500px] rounded-sm border border-gray-300 bg-[#fff] p-3 shadow-lg">
          <div className="flex flex-col items-center border-b border-gray-300 pb-2">
            <h1 className="text-center text-xl font-bold text-[#15599a]">PROJETOS</h1>
            <p className="text-xs text-gray-600">CLIENTES NO ESTÁGIO: {selectedProjects.estagio}</p>
          </div>
          <div className="overscroll-y flex max-h-[520px] flex-col overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {selectedProjects.projetos.map((info, index) => (
              <div key={index} className="flex items-center gap-3 border-b p-2">
                <FaUser />
                <p className="text-xs">
                  {info.nomeDoContrato}
                  {'  '}
                  <strong className="font-bold text-[#15599a]">(#{info.qtde})</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InProgress
export async function getServerSideProps({ query }) {
  const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection = db.collection('dados')
  const visualizacao = query.visualizacao
  const parametro = query.parametro
  var queryKey
  var queryValue
  var queryKey
  var queryValue
  console.log(query)
  console.log(queryKey, queryValue)
  if (visualizacao == 'REGIONAL') {
    queryKey = 'regional'
    queryValue = parametro
  } else if (visualizacao == 'VENDEDOR') {
    queryKey = 'vendedor.nome'
    queryValue = parametro
  } else if (visualizacao == 'INSIDE') {
    queryKey = 'insider'
    queryValue = parametro
  }
  let arr = await collection
    .aggregate([
      {
        $match: {
          'contrato.status': { $ne: 'RESCISÃO DE CONTRATO' },
          [`${queryKey}`]: queryValue,
        },
      },
      {
        $project: {
          qtde: 1,
          nomeDoContrato: 1,
          'contrato.status': 1,
          'compra.dataPedido': 1,
          'compra.statusLiberacao': 1,
          'compra.statusEntrega': 1,
          'homologacao.status': 1,
          'homologacao.documentacao.dataAssinatura': 1,
          'homologacao.vistoria': 1,
          'obra.statusDaObra': 1,
          'conferencias.usinaLigada': 1,
          'jornada.entregaTecnica': 1,
        },
      },
    ])
    .toArray()
  let assContrato = arr.filter((x) => x.contrato.status == 'SOLICITADO' || x.contrato.status == 'NÃO ASSINADO')
  let compraDoKit = arr.filter((x) => x.compra.statusLiberacao == 'REALIZAR COMPRA')
  let entregaDoKit = arr.filter((x) => x.compra?.statusEntrega == 'EM ROTA')
  let assDocumentacoes = arr.filter((x) => !!x.homologacao.documentacao.dataLiberacao && !x.homologacao.documentacao.dataAssinatura)
  let libConc = arr.filter((x) => !!x.homologacao.acesso.dataSolicitacao && !x.homologacao.acesso.dataResposta)
  let agendamentoObra = arr.filter((x) => ['AGUARDANDO AGENDAMENTO', 'CASA EM CONSTRUÇÃO'].includes(x.obra.statusDaObra))
  let terminoObra = arr.filter((x) => ['AGENDADA', 'EM ANDAMENTO'].includes(x.obra.statusDaObra))
  let vistoriaConcessionaria = arr.filter((x) => !!x.homologacao.vistoria.dataSolicitacao && !x.homologacao.vistoria.dataEfetivacao)
  let ligamentoUsina = arr.filter((x) => x.conferencias?.usinaLigada.status == 'NÃO REALIZADO')
  let entregaTecnica = arr.filter((x) => x.jornada?.entregaTecnica != true && x.contrato.status == 'ASSINADO' && x.obra.statusDaObra == 'CONCLUIDA')

  assContrato = JSON.parse(JSON.stringify(assContrato))
  compraDoKit = JSON.parse(JSON.stringify(compraDoKit))
  entregaDoKit = JSON.parse(JSON.stringify(entregaDoKit))
  assDocumentacoes = JSON.parse(JSON.stringify(assDocumentacoes))
  libConc = JSON.parse(JSON.stringify(libConc))
  agendamentoObra = JSON.parse(JSON.stringify(agendamentoObra))
  terminoObra = JSON.parse(JSON.stringify(terminoObra))
  vistoriaConcessionaria = JSON.parse(JSON.stringify(vistoriaConcessionaria))
  ligamentoUsina = JSON.parse(JSON.stringify(ligamentoUsina))
  entregaTecnica = JSON.parse(JSON.stringify(entregaTecnica))
  // let comercial = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         [`${queryKey}`]: queryValue,
  //         "contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
  //         "obra.statusDaObra": {
  //           $in: [
  //             "AGENDADA",
  //             "AGUARDANDO AGENDAMENTO",
  //             "EM ANDAMENTO",
  //             "NÃO DEFINIDO",
  //             "CASA EM CONSTRUÇÃO",
  //             "",
  //             null,
  //             undefined,
  //           ],
  //         },
  //       },
  //     },
  //   ])
  //   .toArray();
  // let suprimentos = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         [`${queryKey}`]: queryValue,
  //         "compra.statusEntrega": {
  //           $in: [
  //             "EM ROTA",
  //             "AGUARDANDO COMPRA",
  //             "",
  //             null,
  //             undefined,
  //             " ",
  //             "NÃO DEFINIDO",
  //           ],
  //         },
  //         "contrato.status": "ASSINADO",
  //       },
  //     },
  //   ])
  //   .toArray();
  // let projetos = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         [`${queryKey}`]: queryValue,
  //         "projeto.projetoConcluido": { $ne: "SIM" },
  //         $or: [
  //           { "compra.statusLiberacao": "PAGO" },
  //           { "projeto.iniciar": "SIM" },
  //         ],
  //       },
  //     },
  //   ])
  //   .toArray();
  // let obras = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         [`${queryKey}`]: queryValue,
  //         "obra.statusDaObra": {
  //           $in: [
  //             "AGENDADA",
  //             "AGUARDANDO AGENDAMENTO",
  //             "EM ANDAMENTO",
  //             "CASA EM CONSTRUÇÃO",
  //             null,
  //             undefined,
  //             "",
  //             " ",
  //             "NÃO DEFINIDO",
  //           ],
  //         },
  //         "contrato.status": "ASSINADO",
  //       },
  //     },
  //   ])
  //   .toArray();
  // comercial = JSON.parse(JSON.stringify(comercial));
  // suprimentos = JSON.parse(JSON.stringify(suprimentos));
  // projetos = JSON.parse(JSON.stringify(projetos));
  // obras = JSON.parse(JSON.stringify(obras));
  return {
    props: {
      data: {
        assContrato,
        compraDoKit,
        entregaDoKit,
        assDocumentacoes,
        libConc,
        agendamentoObra,
        terminoObra,
        vistoriaConcessionaria,
        ligamentoUsina,
        entregaTecnica,
      },
    }, // will be passed to the page component as props
  }
}
