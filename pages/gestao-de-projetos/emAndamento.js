import React, { useState } from 'react'

import { FaUser } from 'react-icons/fa'
import connectToDatabase from '../../utils/services/mongodb/projects'

function InProgress({ data }) {
  const [selectedProjects, setProjects] = useState({
    estagio: 'ASSINATURA DO CONTRATO',
    projetos: data.assContrato,
  })

  return (
    <>
      <div className="items flex w-full grow flex-col-reverse gap-2 p-6 lg:flex-row">
        <ol className="self-center border-l-2 border-[#15599a]">
          <li>
            <div className="flex-start flex items-center">
              <div className="-ml-2 mr-3 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xxs text-white"></div>
              <h4 className="-mt-2 text-xs font-semibold text-gray-800 lg:text-xl">ASSINATURA DO CONTRATO</h4>
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
              <h4 className="-mt-2 text-xs font-semibold text-gray-800 lg:text-xl">COMPRA DO KIT</h4>
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
              <h4 className="-mt-2 text-xs font-semibold text-gray-800 lg:text-xl">ENTREGA DO KIT</h4>
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
              <h4 className="-mt-2 text-xs font-semibold text-gray-800 lg:text-xl">ASSINATURA DA DOCUMENTAÇÃO</h4>
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
              <h4 className="-mt-2 text-xs font-semibold text-gray-800 lg:text-xl">LIBERAÇÃO DA CONCESSIONÁRIA</h4>
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
              <h4 className="-mt-2 text-xs font-semibold text-gray-800 lg:text-xl">AGENDAMENTO DA OBRA</h4>
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
              <h4 className="-mt-2 text-xs font-semibold text-gray-800 lg:text-xl">TÉRMINO DA OBRA</h4>
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
              <h4 className="-mt-2 text-xs font-semibold text-gray-800 lg:text-xl">VISTORIA DA CONCESSIONÁRIA</h4>
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
              <h4 className="-mt-2 text-xs font-semibold text-gray-800 lg:text-xl">LIGAMENTO DA USINA</h4>
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
              <h4 className="-mt-2 text-xs font-semibold text-gray-800 lg:text-xl">ENTREGA TÉCNICA</h4>
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
        <div className="top-0 left-0 mb-2 flex h-[450px] w-full flex-col rounded-sm border border-gray-300 bg-[#fff] p-3 shadow-lg lg:sticky lg:top-[10%] lg:left-[60%] lg:mb-0 lg:h-[600px] lg:w-[500px]">
          <div className="flex flex-col items-center border-b border-gray-300 pb-2">
            <h1 className="text-center text-xl font-bold text-[#15599a]">PROJETOS</h1>
            <p className="text-xs text-gray-600">CLIENTES NO ESTÁGIO: {selectedProjects.estagio}</p>
          </div>
          <div className="overscroll-y flex max-h-[520px] grow flex-col overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {selectedProjects.projetos?.length > 0 ? (
              selectedProjects.projetos.map((info, index) => (
                <div key={index} className="flex items-center gap-3 border-b p-2">
                  <FaUser />
                  <p className="text-xs">
                    {info.nomeDoContrato}
                    {'  '}
                    <strong className="font-bold text-[#15599a]">(#{info.qtde})</strong>
                  </p>
                </div>
              ))
            ) : (
              <p className="flex h-full items-center justify-center text-center text-sm italic text-gray-500">
                Nenhum projeto se encontra nesse estágio...
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default InProgress
export async function getServerSideProps(context) {
  const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection = db.collection('dados')
  let arr = await collection
    .aggregate([
      {
        $match: {
          'contrato.status': { $ne: 'RESCISÃO DE CONTRATO' },
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
          'homologacao.acesso.dataSolicitacao': 1,
          'homologacao.documentacao': 1,
          'homologacao.vistoria.dataSolicitacao': 1,
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
  let libConc = arr.filter((x) => !!x.homologacao.acesso.dataSolicitacao & !x.homologacao.acesso.dataSolicitacao)
  let agendamentoObra = arr.filter((x) => ['AGUARDANDO AGENDAMENTO', 'CASA EM CONSTRUÇÃO'].includes(x.obra.statusDaObra))
  let terminoObra = arr.filter((x) => ['AGENDADA', 'EM ANDAMENTO'].includes(x.obra.statusDaObra))
  let vistoriaConcessionaria = arr.filter((x) => !!x.homologacao.vistoria.dataSolicitacao && !x.homologacao.vistoria.dataResposta)
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
  // comercial = JSON.parse(JSON.stringify(comercial));
  // suprimentos = JSON.parse(JSON.stringify(suprimentos));
  // aguardandoPagamento = JSON.parse(JSON.stringify(aguardandoPagamento));
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
