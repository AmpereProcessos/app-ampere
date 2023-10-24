import React from 'react'
import NumberInput from '../NumberInput'
import TextInput from '../TextInput'
import { IoMdAdd } from 'react-icons/io'
import { useTechnicalAnalysisById } from '../../utils/methods/query/techAnalysis'
import LoadingPage from '../utils/LoadingPage'
import ErrorComponent from '../utils/ErrorComponent'
import Avatar from '../utils/Avatar'
import { useSession } from 'next-auth/react'
import { TbRulerMeasure } from 'react-icons/tb'
import { MdTopic } from 'react-icons/md'
function getViewPermissions({ routes }) {
  if (!routes) {
    return {
      suprimentos: false,
      projetos: false,
      obras: false,
    }
  }
  const permission = {
    suprimentos: routes.includes('Suprimentos'),
    projetos: routes.includes('Projetos'),
    obras: routes.includes('Obras'),
  }

  return permission
}
function InfoVisitaTecnicaBlock({ editor, infoHolder, setInfo, changes, setChanges, analysisId }) {
  const { data: session } = useSession()
  const { data: analysis, isSuccess, isLoading, isError } = useTechnicalAnalysisById({ id: analysisId, enabled: !!analysisId })
  const viewPermissions = getViewPermissions({ routes: session.user?.accessibleRoutes })
  console.log(viewPermissions, session.user?.accessibleRoutes)
  // Return for technical analysis previous to system
  if (!analysisId)
    return (
      <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg rounded-md">
        <span className="w-full bg-[#15599a] text-white text-center font-bold py-2 rounded-tr-md rounded-tl-md mb-2">
          INFORMAÇÕES SOBRE A VISITA TÉCNICA
        </span>
        <div className="flex gap-2 justify-around flex-wrap">
          <div className="flex items-center w-[350px] justify-center">
            <input
              disabled={!editor}
              checked={infoHolder.visitaTecnica?.status === 'REALIZADA' ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'visitaTecnica.status': e.target.checked ? 'REALIZADA' : 'PENDÊNCIA',
                })
                setInfo({
                  ...infoHolder,
                  visitaTecnica: {
                    ...infoHolder.visitaTecnica,
                    status: e.target.checked ? 'REALIZADA' : 'PENDÊNCIA',
                  },
                })
              }}
              type="checkbox"
              name="visitaTecnica"
              id="visitaTecnica"
            />
            <label className="ml-2" htmlFor="visitaTecnica">
              REALIZADA ?
            </label>
          </div>
          <TextInput
            label={'TÉCNICO RESPONSÁVEL'}
            editable={editor}
            value={infoHolder.visitaTecnica?.tecnico ? infoHolder.visitaTecnica?.tecnico : ''}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'visitaTecnica.tecnico': value,
              })
              setInfo({
                ...infoHolder,
                visitaTecnica: {
                  ...infoHolder.visitaTecnica,
                  tecnico: value,
                },
              })
            }}
          />
          <TextInput
            label={'Tipo da telha'}
            editable={editor}
            value={infoHolder.visitaTecnica?.tipoDaTelha ? infoHolder.visitaTecnica?.tipoDaTelha : ''}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'visitaTecnica.tipoDaTelha': value,
              })
              setInfo({
                ...infoHolder,
                visitaTecnica: {
                  ...infoHolder.visitaTecnica,
                  tipoDaTelha: value,
                },
              })
            }}
          />
        </div>
      </div>
    )
  else
    return (
      <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg rounded-md">
        <span className="w-full bg-[#15599a] text-white text-center font-bold py-2 rounded-tr-md rounded-tl-md mb-2">
          INFORMAÇÕES SOBRE A ANÁLISE TÉCNICA
        </span>
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar informações da análise técnica.'} /> : null}
        {isSuccess && analysis ? (
          <div className="flex flex-col w-full gap-2 px-4">
            <h1 className="p-1 rounded text-[#15599a] border border-[#15599a] self-center font-bold">{analysis.status}</h1>
            <div className="flex items-center gap-2 w-full justify-center">
              <h1 className="text-xs font-bold text-gray-500 font-raleway">ANALISTA</h1>
              <Avatar url={analysis.analista?.avatar_url} fallback={'A'} height={30} width={30} />
              <p className="text-gray-500 text-sm font-medium">{analysis.analista?.apelido || 'NÃO DEFINIDO'}</p>
            </div>
            <div className="w-full flex flex-wrap justify-around">
              <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                <p className="font-medium text-gray-500 text-[0.6rem] uppercase leading-none tracking-tight">TIPO DE TELHA</p>
                <h1 className="font-medium text-black text-xs uppercase text-center">{analysis.tipoTelha}</h1>
              </div>
              <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                <p className="font-medium text-gray-500 text-[0.6rem] uppercase leading-none tracking-tight">TIPO DA ESTRUTURA</p>
                <h1 className="font-medium text-black text-xs uppercase text-center">{analysis.tipoEstrutura}</h1>
              </div>
              <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                <p className="font-medium text-gray-500 text-[0.6rem] uppercase leading-none tracking-tight">ORIENTAÇÃO DA ESTRUTURA</p>
                <h1 className="font-medium text-black text-xs uppercase text-center">{analysis.orientacaoEstrutura}</h1>
              </div>
            </div>
            {viewPermissions.suprimentos ? (
              <div className="flex flex-col w-full gap-1">
                <h1 className="w-full p-1 text-center rounded-sm bg-[#fead41] text-white font-bold">SUPRIMENTOS</h1>
                <div className="flex flex-col gap-1 mt-2">
                  <h1 className="text-sm leading-none tracking-tight font-medium text-gray-500">OBSERVAÇÕES P/ SUPRIMENTOS</h1>
                  <div className="h-[50px] bg-gray-100 text-gray-500 text-sm rounded-md max-h-[50px] w-full border border-cyan-500 flex items-center justify-center text-center p-3 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {analysis.suprimentos?.observacoes}
                  </div>
                </div>
                {analysis.suprimentos?.itens?.map((item, index) => (
                  <div key={index} className="w-full flex items-center justify-between">
                    <div className="flex flex-col">
                      <h1 className="text-sm text-gray-500 font-medium">
                        <strong>{item.qtde}</strong> x {item.insumo} <strong className="text-[#fead41]">({item.tipo})</strong>
                      </h1>
                      <div className="flex items-center gap-1">
                        <TbRulerMeasure />
                        <p className="text-xs text-gray-500 italic">{item.medida}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setChanges({
                            ...changes,
                            'compra.kitInfo': infoHolder.compra?.kitInfo
                              ? infoHolder.compra?.kitInfo + '\n' + `${item.qtde}-${item.insumo} ${item.tipo}`
                              : `${item.qtde}-${item.insumo} ${item.tipo}`,
                          })
                          setInfo({
                            ...infoHolder,
                            compra: {
                              ...infoHolder.compra,
                              kitInfo: infoHolder.compra?.kitInfo
                                ? infoHolder.compra?.kitInfo + '\n' + `${item.qtde}-${item.insumo} ${item.tipo}`
                                : `${item.qtde}-${item.insumo} ${item.tipo}`,
                            },
                          })
                        }}
                        className="flex items-center gap-1 text-xs p-1 rounded border border-[#fead61] text-[#fead61] hover:bg-[#fead61] hover:text-black font-bold"
                      >
                        <IoMdAdd />
                        <p>KIT</p>
                      </button>
                      <button
                        onClick={() => {
                          setChanges({
                            ...changes,
                            'material.materialFaltante': infoHolder.material?.materialFaltante
                              ? infoHolder.material?.materialFaltante + '\n' + `${item.qtde}-${item.insumo} ${item.tipo}`
                              : `${item.qtde}-${item.insumo} ${item.tipo}`,
                          })
                          setInfo({
                            ...infoHolder,
                            material: {
                              ...infoHolder.material,
                              materialFaltante: infoHolder.material?.materialFaltante
                                ? infoHolder.material?.materialFaltante + '\n' + `${item.qtde}-${item.insumo} ${item.tipo}`
                                : `${item.qtde}-${item.insumo} ${item.tipo}`,
                            },
                          })
                        }}
                        className="flex items-center gap-1 text-xs p-1 rounded border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white font-bold"
                      >
                        <IoMdAdd />
                        <p>FALTANTE</p>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {viewPermissions.projetos ? (
              <div className="flex flex-col w-full gap-1">
                <h1 className="w-full p-1 text-center rounded-sm bg-[#fead41] text-white font-bold">PROJETOS</h1>
                <div className="flex flex-col gap-1 mt-2">
                  <h1 className="text-sm leading-none tracking-tight font-medium text-gray-500">OBSERVAÇÕES P/ PROJETOS</h1>
                  <div className="h-[50px] bg-gray-100 text-gray-500 text-sm rounded-md max-h-[50px] w-full border border-cyan-500 flex items-center justify-center text-center p-3 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {analysis.obsProjetos}
                  </div>
                </div>
                <div className="w-full flex flex-wrap justify-around mt-4">
                  <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                    <p className="font-medium text-gray-500 text-[0.6rem] uppercase leading-none tracking-tight">CONCESSIONÁRIA</p>
                    <h1 className="font-medium text-black text-xs uppercase text-center">{analysis.concessionaria}</h1>
                  </div>
                  <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                    <p className="font-medium text-gray-500 text-[0.6rem] uppercase leading-none tracking-tight">CAIXA DO MEDIDOR</p>
                    <h1 className="font-medium text-black text-xs uppercase text-center">{analysis.modeloCaixa}</h1>
                  </div>
                  <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                    <p className="font-medium text-gray-500 text-[0.6rem] uppercase leading-none tracking-tight">PENDÊNCIAS</p>
                    <h1 className="font-medium text-black text-xs uppercase text-center">{analysis.pendenciasProjetos}</h1>
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <h1 className="text-sm leading-none tracking-tight font-medium text-gray-500">DESCRITIVO</h1>
                  {analysis.descritivo?.length ? (
                    analysis.descritivo.map((item, index) => (
                      <div key={index} className="w-full flex flex-col">
                        <div className="flex items-center gap-2">
                          <MdTopic />
                          <h1 className="text-sm tracking-tight leading-none">{item.topico}</h1>
                        </div>
                        <p className="w-full text-center text-gray-500 text-sm">{item.texto}</p>
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center text-gray-500 italic">SEM DESCRITIVO</div>
                  )}
                </div>
              </div>
            ) : null}
            {viewPermissions.obras ? (
              <div className="flex flex-col w-full gap-1">
                <h1 className="w-full p-1 text-center rounded-sm bg-[#fead41] text-white font-bold">OBRAS</h1>
                <div className="flex flex-col gap-1 mt-2">
                  <h1 className="text-sm leading-none tracking-tight font-medium text-gray-500">OBSERVAÇÕES P/ OBRAS</h1>
                  <div className="h-[50px] bg-gray-100 text-gray-500 text-sm rounded-md max-h-[50px] w-full border border-cyan-500 flex items-center justify-center text-center p-3 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {analysis.obsObras}
                  </div>
                </div>
                <div className="w-full flex flex-wrap justify-around mt-4">
                  <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                    <p className="font-medium text-gray-500 text-[0.6rem] uppercase leading-none tracking-tight">ESPAÇO NO QGBT</p>
                    <h1 className="font-medium text-black text-xs uppercase text-center">{analysis.espacoQGBT}</h1>
                  </div>
                  <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                    <p className="font-medium text-gray-500 text-[0.6rem] uppercase leading-none tracking-tight">ADAPTAÇÃO NO QGBT</p>
                    <h1 className="font-medium text-black text-xs uppercase text-center">{analysis.adaptacaoQGBT}</h1>
                  </div>
                  <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                    <p className="font-medium text-gray-500 text-[0.6rem] uppercase leading-none tracking-tight">AVALIAR TELHADO</p>
                    <h1 className="font-medium text-black text-xs uppercase text-center">{analysis.avaliarTelhado}</h1>
                  </div>
                  <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                    <p className="font-medium text-gray-500 text-[0.6rem] uppercase leading-none tracking-tight">DPS NO QGBT</p>
                    <h1 className="font-medium text-black text-xs uppercase text-center">{analysis.dpsQGBT}</h1>
                  </div>
                  <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                    <p className="font-medium text-gray-500 text-[0.6rem] uppercase leading-none tracking-tight">INFRA - LANÇAMENTO DE CABOS</p>
                    <h1 className="font-medium text-black text-xs uppercase text-center">{analysis.infraCabos}</h1>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* <div className="flex gap-2 justify-around flex-wrap">
          <div className="flex items-center w-[350px] justify-center">
            <input
              disabled={!editor}
              checked={infoHolder.visitaTecnica?.status === 'REALIZADA' ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'visitaTecnica.status': e.target.checked ? 'REALIZADA' : 'PENDÊNCIA',
                })
                setInfo({
                  ...infoHolder,
                  visitaTecnica: {
                    ...infoHolder.visitaTecnica,
                    status: e.target.checked ? 'REALIZADA' : 'PENDÊNCIA',
                  },
                })
              }}
              type="checkbox"
              name="visitaTecnica"
              id="visitaTecnica"
            />
            <label className="ml-2" htmlFor="visitaTecnica">
              REALIZADA ?
            </label>
          </div>
          <TextInput
            label={'TÉCNICO RESPONSÁVEL'}
            editable={editor}
            value={infoHolder.visitaTecnica?.tecnico ? infoHolder.visitaTecnica?.tecnico : ''}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'visitaTecnica.tecnico': value,
              })
              setInfo({
                ...infoHolder,
                visitaTecnica: {
                  ...infoHolder.visitaTecnica,
                  tecnico: value,
                },
              })
            }}
          />
          <TextInput
            label={'Tipo da telha'}
            editable={editor}
            value={infoHolder.visitaTecnica?.tipoDaTelha ? infoHolder.visitaTecnica?.tipoDaTelha : ''}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'visitaTecnica.tipoDaTelha': value,
              })
              setInfo({
                ...infoHolder,
                visitaTecnica: {
                  ...infoHolder.visitaTecnica,
                  tipoDaTelha: value,
                },
              })
            }}
          />
        </div>
        {(infoVisita?.suprimentos || infoVisita?.obsSuprimentos) && (
          <div className="flex flex-col items-center">
            <div className="flex flex-col mx-12 mt-2 gap-2">
              {infoVisita.suprimentos ? (
                <div className="grid grid-cols-6 w-full">
                  <p className="text-md text-[#fead61] font-bold text-center">INSUMO</p>
                  <p className="text-md text-[#fead61] font-bold text-center">TIPO</p>
                  <p className="text-md text-[#fead61] font-bold text-center">QUANTIDADE</p>
                  <p className="text-md text-[#fead61] font-bold text-center">UNIDADE</p>
                  <p className="text-md text-[#fead61] font-bold text-center col-span-2">AÇÃO</p>
                </div>
              ) : null}

              {infoVisita.suprimentos?.map((suprimento, index) => (
                <div key={index} className="grid grid-cols-6 w-full">
                  <p className="text-xs text-gray-600 font-bold text-center">{suprimento.insumo}</p>
                  <p className="text-xs text-gray-600 font-bold text-center">{suprimento.tipo}</p>
                  <p className="text-xs text-gray-600 font-bold text-center">{suprimento.qtde}</p>
                  <p className="text-xs text-gray-600 font-bold text-center">{suprimento.medida}</p>
                  <div className="flex items-center justify-center gap-1 col-span-2">
                    <button
                      onClick={() => {
                        setChanges({
                          ...changes,
                          'compra.kitInfo': infoHolder.compra?.kitInfo
                            ? infoHolder.compra?.kitInfo + '\n' + `${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`
                            : `${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`,
                        })
                        setInfo({
                          ...infoHolder,
                          compra: {
                            ...infoHolder.compra,
                            kitInfo: infoHolder.compra?.kitInfo
                              ? infoHolder.compra?.kitInfo + '\n' + `${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`
                              : `${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`,
                          },
                        })
                      }}
                      className="flex items-center gap-1 text-xs p-1 rounded border border-[#fead61] text-[#fead61] hover:bg-[#fead61] hover:text-black font-bold"
                    >
                      <IoMdAdd />
                      <p>KIT</p>
                    </button>
                    <button
                      onClick={() => {
                        setChanges({
                          ...changes,
                          'material.materialFaltante': infoHolder.material?.materialFaltante
                            ? infoHolder.material?.materialFaltante + '\n' + `${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`
                            : `${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`,
                        })
                        setInfo({
                          ...infoHolder,
                          material: {
                            ...infoHolder.material,
                            materialFaltante: infoHolder.material?.materialFaltante
                              ? infoHolder.material?.materialFaltante + '\n' + `${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`
                              : `${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`,
                          },
                        })
                      }}
                      className="flex items-center gap-1 text-xs p-1 rounded border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white font-bold"
                    >
                      <IoMdAdd />
                      <p>FALTANTE</p>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col w-full self-center mt-2 items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">OBSERVAÇÕES P/SUPRIMENTOS</span>
              <textarea
                value={infoVisita.obsSuprimentos}
                readOnly={true}
                placeholder={'Observações p/ suprimentos aqui...'}
                className="w-full text-center h-[100px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
              />
            </div>
          </div>
        )} */}
      </div>
    )
}

export default InfoVisitaTecnicaBlock
