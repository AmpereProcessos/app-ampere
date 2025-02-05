import TechnicalAnalysisFiles from '@/components/identificador/analisesTecnicas/TechnicalAnalysisFiles'
import Avatar from '@/components/utils/Avatar'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { cn } from '@/lib/utils'
import { formatDateAsLocale, formatLocation, formatNameAsInitials } from '@/utils/methods/formatting'
import { updateProject } from '@/utils/methods/mutation/clients'
import { useTechnicalAnalysisById } from '@/utils/methods/query/technical-analysis'
import { renderProductCategoryIcon } from '@/utils/methods/rendering'
import { TPurchaseControl, TPurchaseProjectDTO } from '@/utils/schemas/purchases'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineSafety } from 'react-icons/ai'
import { BsBank, BsCalendar, BsCalendarCheck, BsCalendarPlus, BsCheck2, BsCheck2All, BsPersonVcard, BsStack } from 'react-icons/bs'
import { FaBolt, FaIndustry, FaPhone, FaUserAlt } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { IoMdAdd } from 'react-icons/io'
import { MdDashboard, MdDesignServices, MdLandscape, MdOutlinePayment, MdPhone, MdSync } from 'react-icons/md'
import { TbReportAnalytics, TbRulerMeasure } from 'react-icons/tb'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CheckboxInput from '@/components/inputs/Checkbox'
import { useProjectServiceOrders } from '@/utils/methods/query/service-orders'
import { TServiceOrder, TServiceOrderSimplifiedDTO, TServiceOrderTag, TServiceOrderTagDTO } from '@/utils/schemas/service-order'
import { Pencil, Tag, UserRound } from 'lucide-react'
import ModalControlServiceOrder from '@/components/identificador/ordensDeServico/modals/ModalControlServiceOrder'
import { Session } from 'next-auth'
import { fetchProjectById } from '@/utils/methods/query/clients'
import { TProjectDTO } from '@/utils/schemas/projects'
import { createServiceOrder, updateManyServiceOrdersByProjectId } from '@/utils/methods/mutation/service-orders'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'

type PurchaseControlProjectInformationBlockProps = {
  session: Session
  purchase: TPurchaseControl
  updatePurchase: (changes: Partial<TPurchaseControl>) => void
  project: TPurchaseProjectDTO
  addProductToComposition: (product: TPurchaseControl['composicao'][number]) => void
}
function PurchaseControlProjectInformationBlock({
  session,
  purchase,
  updatePurchase,
  project,
  addProductToComposition,
}: PurchaseControlProjectInformationBlockProps) {
  const [technicalAnalysisBlockIsOpen, setTechnicalAnalysisBlockIsOpen] = useState<boolean>(false)

  async function handleUpdateProject() {
    function getServiceOrderTags({ project, purchase }: { project: TPurchaseProjectDTO; purchase: TPurchaseControl }) {
      const tags: Exclude<TServiceOrder['etiquetas'], undefined | null> = []
      if (project.homologacao.fastTrack) {
        tags.push({
          id: '6798eb1b19ad4c2b679bd2e1',
          titulo: 'FAST TRACK',
          cores: {
            primaria: '#058A05',
            secundaria: '#B7FDB7',
          },
        })
      }
      if (project.pagamento.credor == 'SOL FÁCIL') {
        tags.push({
          id: '6798eb2bd422f4f93779dd0d',
          titulo: 'DESLIGAMENTO REMOTO',
          cores: {
            primaria: '#FF0000',
            secundaria: '#FFCCCB',
          },
        })
      }
      if (purchase.metadata?.pendenciasExecucao == 'LEVAR ESTRUTURA NA MONTAGEM') {
        tags.push({
          id: '6798eb4e38fd2c093589ee7f',
          titulo: 'TRANSPORTAR ESTRUTURA',
          cores: {
            primaria: '#8B4513',
            secundaria: '#DFD0BC',
          },
        })
      }
      return tags
    }
    try {
      const changes = {
        'compra.liberacao': !!purchase.liberacao.data,
        'compra.atualizacoes': purchase.atualizacoes,
        'compra.dataLiberacao': purchase.liberacao.data,
        'compra.fornecedor': purchase.fornecedor.nome,
        'compra.dataPedido': purchase.dataPedido,
        'compra.valorDoKit': purchase.total,
        'compra.rastreio': purchase.transporte.linkRastreio,
        'compra.dataRequisicaoPagamento': purchase.dataRequisicaoPagamento,
        'compra.dataPagamento': purchase.dataLiberacaoPagamento,
        'compra.dataPagamentoEquipamentos': purchase.dataPagamento,
        'compra.previsaoEntrega': purchase.entrega.dataPrevisao,
        'compra.dataEntrega': purchase.entrega.dataEfetivacao,
        'compra.statusEntrega': purchase.entrega.status,
        'compra.kitInfo': purchase.composicao.map((c) => `${c.qtde}-${c.descricao}`).join('\n'),
        'obra.pendencias': purchase.metadata?.pendenciasExecucao,
      }
      await updateProject({ id: project._id, changes })

      // await updateManyServiceOrdersByProjectId({
      //   projectId: project._id,
      //   filters: { categoria: 'MONTAGEM', dataEfetivacao: null },
      //   changes: {
      //     etiquetas: getServiceOrderTags({ project, purchase }),
      //     dataPrevisaoLiberacao: purchase.entrega.dataPrevisao,
      //     dataLiberacao: purchase.entrega.dataEfetivacao,
      //   },
      // })

      return 'Dados sincronizados com sucesso !'
    } catch (error) {
      console.log('ERROR', error)
      throw error
    }
  }
  const { mutate, isPending } = useMutation({
    mutationKey: ['sync-project-data', project._id],
    mutationFn: handleUpdateProject,
    onSuccess: () => toast.success('Dados sincronizados no projeto.'),
  })
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES DO PROJETO</h1>
      <div className="flex w-full items-center justify-center">
        <button
          disabled={isPending}
          onClick={() => mutate()}
          className={cn(
            'flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-white duration-300 ease-in-out  disabled:bg-gray-500 hover:bg-blue-700 disabled:hover:bg-gray-500'
          )}
        >
          <MdSync />
          <h1 className="text-xs font-medium tracking-tight">SINCRONIZAR DADOS NO PROJETO</h1>
        </button>
      </div>
      <div className="flex w-full grow flex-col gap-2">
        <h1 className="w-full bg-gray-500 p-1 text-center text-xs font-medium text-white">GERAIS</h1>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-[0.65rem] font-medium text-gray-500">PROJETO</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <FaUserAlt />
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project!.nomeDoContrato}</p>
              </div>
              <div className="flex items-center gap-1">
                <MdPhone />
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.telefone}</p>
              </div>
              <div className="flex items-center gap-1">
                <BsPersonVcard />
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.cpf_cnpj}</p>
              </div>
              <div className="flex items-center gap-1">
                <MdLandscape />
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.inscricaoRural || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-1">
                <FaLocationDot />
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">
                  {formatLocation({
                    location: {
                      uf: project!.uf || '',
                      cidade: project!.cidade || '',
                      cep: project!.cep?.toString() || '',
                      bairro: project!.bairro,
                      endereco: project!.logradouro,
                      numeroOuIdentificador: project!.numeroResidencia?.toString() || '',
                      complemento: null,
                      latitude: null,
                      longitude: null,
                    },
                    includeCity: true,
                    includeUf: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
        <h1 className="w-full bg-gray-500 p-1 text-center text-xs font-medium text-white">PAGAMENTO</h1>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-[0.65rem] font-medium text-gray-500">PAGADOR</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <FaUserAlt />
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.pagamento.pagador}</p>
              </div>
              <div className="flex items-center gap-1">
                <BsPersonVcard />
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.pagamento.cpf_cnpjPagador || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-1">
                <FaPhone />
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.pagamento.contatoPagador}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 lg:items-end">
            <p className="text-[0.65rem] font-medium text-gray-500">CREDOR</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <BsStack />
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.pagamento.forma || 'NÃO DEFINIDO'}</p>
              </div>
              <div className="flex items-center gap-1">
                <MdOutlinePayment />
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.pagamento.metodo || 'NÃO DEFINIDO'}</p>
              </div>

              <div className="flex items-center gap-1">
                <BsBank />
                <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.pagamento.credor || 'NÃO DEFINIDO'}</p>
              </div>
              {project!.pagamento.forma == 'FINANCIAMENTO' ? (
                <>
                  <div className="flex items-center gap-1">
                    <FaUserAlt />
                    <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.pagamento.credorNomeGerente}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaPhone />
                    <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.pagamento.credorContatoGerente}</p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-2 lg:flex-row">
          <div className="flex w-full flex-col lg:w-1/2">
            <h1 className="w-full text-center text-[0.6rem] font-medium tracking-tight text-primary lg:text-start">
              OBSERVAÇÕES GERAIS SOBRE A NEGOCIAÇÃO
            </h1>
            <div className="flex w-full items-center justify-center rounded bg-primary/10 p-2">
              <h1 className="text-[0.6rem] font-medium">{project!.pagamento.negociacao || 'OBSERVAÇÕES DA NEGOCIAÇÃO NÃO DEFINIDAS'}</h1>
            </div>
          </div>
        </div>
        {/* <div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-2 lg:flex-row">
               <div className="flex w-full flex-col lg:w-1/2">
                 <h1 className="w-full text-center text-[0.6rem] font-medium tracking-tight text-primary lg:text-start">
                   OBSERVAÇÕES GERAIS SOBRE O PAGAMENTO
                 </h1>
                 <div className="flex w-full items-center justify-center rounded bg-primary/10 p-2">
                   <h1 className="text-[0.6rem] font-medium">{project!.pagamentoObservacoes || 'OBSERVAÇÕES GERAIS DE PAGAMENTO NÃO DEFINIDAS'}</h1>
                 </div>
               </div>
               {project!.pagamentoCreditoAplicavel ? (
                 <div className="flex w-full flex-col lg:w-1/2">
                   <h1 className="w-full text-center text-[0.6rem] font-medium tracking-tight text-primary lg:text-end">
                     OBSERVAÇÕES GERAIS SOBRE CRÉDITO
                   </h1>
                   <div className="flex w-full items-center justify-center rounded bg-primary/10 p-2">
                     <h1 className="text-[0.6rem] font-medium">
                       {project!.pagamentoCreditoObservacoes || 'OBSERVAÇÕES GERAIS DE PAGAMENTO NÃO DEFINIDAS'}
                     </h1>
                   </div>
                 </div>
               ) : null}
              </div> */}
        <h1 className="w-full bg-gray-500 p-1 text-center text-xs font-medium text-white">PRODUTOS</h1>
        <div className="flex w-full flex-wrap items-center gap-2">
          {project!.produtos && project!.produtos.length > 0 ? (
            project!.produtos.map((product) => (
              <div key={product.id} className="flex w-full flex-col gap-1 rounded-md border border-primary bg-[#fff] p-2 dark:bg-[#121212]">
                <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
                  <div className="flex w-full items-center gap-1 lg:grow">
                    <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1 dark:border-[#fff]">
                      {renderProductCategoryIcon(product.categoria, 15)}
                    </div>
                    <p className="text-sm font-bold leading-none tracking-tight">
                      <strong className="text-[#FF9B50]">{product.qtde}</strong> x {product.modelo}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
                    <div className="flex items-center gap-1">
                      <FaIndustry size={12} />
                      <p className="text-[0.6rem] font-light text-gray-500 lg:text-xs">{product.fabricante}</p>
                    </div>
                    {product.potencia ? (
                      <div className="flex items-center gap-1">
                        <FaBolt size={12} />
                        <p className="text-[0.6rem] font-light text-gray-500 lg:text-xs">{product.potencia} W</p>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-1">
                      <AiOutlineSafety size={12} />
                      <p className="text-[0.6rem] font-light text-gray-500 lg:text-xs">{product.garantia} ANOS</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-end">
                  <button
                    onClick={() =>
                      addProductToComposition({
                        categoria: product.categoria,
                        descricao: `${product.fabricante} - ${product.modelo}`,
                        qtde: product.qtde,
                        unidade: 'UN',
                        valor: 0,
                      })
                    }
                    className="flex items-center gap-1 rounded-lg border border-[#fead41] px-2  py-1 text-[0.6rem] font-medium text-[#fead41] hover:bg-[#fead41] hover:text-black"
                  >
                    <IoMdAdd width={10} height={10} />
                    <p>ADICIONAR À COMPOSIÇÃO</p>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum produto adicionado</div>
          )}
        </div>
        <ProjectServiceOrderBlock session={session} projectId={project._id} />
        <h1 className="w-full bg-gray-500 p-1 text-center text-xs font-medium text-white">OUTROS</h1>
        <div className="flex items-center justify-center">
          <div className="w-fit">
            <CheckboxInput
              labelFalse="LEVAR ESTRUTURA NA MONTAGEM"
              labelTrue="LEVAR ESTRUTURA NA MONTAGEM"
              checked={purchase.metadata?.pendenciasExecucao == 'LEVAR ESTRUTURA NA MONTAGEM'}
              handleChange={(value) => updatePurchase({ metadata: { pendenciasExecucao: value ? 'LEVAR ESTRUTURA NA MONTAGEM' : null } })}
            />
          </div>
        </div>
        {project.idVisitaTecnica ? (
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center justify-center">
              <button
                onClick={() => setTechnicalAnalysisBlockIsOpen((prev) => !prev)}
                className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
                  'bg-gray-300  hover:bg-red-300': technicalAnalysisBlockIsOpen,
                  'bg-green-300  hover:bg-green-400': !technicalAnalysisBlockIsOpen,
                })}
              >
                <TbReportAnalytics />
                <h1 className="text-xs font-medium tracking-tight">
                  {!technicalAnalysisBlockIsOpen ? 'ABRIR INFORMAÇÕES DA ANÁLISE TÉCNICA' : 'FECHAR INFORMAÇÕES DA ANÁLISE TÉCNICA'}
                </h1>
              </button>
            </div>
            {technicalAnalysisBlockIsOpen ? (
              <TechnicalAnalysisBlock analysisId={project.idVisitaTecnica} addProductToComposition={addProductToComposition} />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default PurchaseControlProjectInformationBlock

type TechnicalAnalysisBlockProps = {
  analysisId: string
  addProductToComposition: (product: TPurchaseControl['composicao'][number]) => void
}
function TechnicalAnalysisBlock({ analysisId, addProductToComposition }: TechnicalAnalysisBlockProps) {
  const { data: analysis, isLoading, isError, isSuccess } = useTechnicalAnalysisById({ id: analysisId })
  return (
    <div className="flex w-[90%] flex-col self-center rounded-md border border-[#15599a] pb-2 shadow-lg">
      <h1 className="tounded-tl-md w-full rounded-tr-md bg-[#15599a] p-1 text-center text-xs font-medium text-white">
        INFORMAÇÕES DA ANÁLISE TÉCNICA
      </h1>
      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={'Erro ao buscar informações da análise técnica.'} /> : null}
      {isSuccess && analysis ? (
        <div className="flex w-full flex-col gap-2 px-4">
          <h1 className="self-center rounded border border-[#15599a] p-1 font-bold text-[#15599a]">{analysis.status}</h1>
          <div className="flex w-full items-center justify-center gap-2">
            <h1 className="font-raleway text-xs font-bold text-gray-500">ANALISTA</h1>
            <Avatar url={analysis.analista?.avatar_url} fallback={'A'} height={30} width={30} />
            <p className="text-sm font-medium text-gray-500">{analysis.analista?.apelido || 'NÃO DEFINIDO'}</p>
          </div>
          <div className="flex w-full flex-wrap justify-around">
            <div className="flex flex-col rounded-md border border-gray-500 p-3">
              <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">TIPO DE TELHA</p>
              <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.tipoTelha}</h1>
            </div>
            <div className="flex flex-col rounded-md border border-gray-500 p-3">
              <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">TIPO DA ESTRUTURA</p>
              <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.tipoEstrutura}</h1>
            </div>
            <div className="flex flex-col rounded-md border border-gray-500 p-3">
              <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">MATERIAL DA ESTRUTURA</p>
              <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.materialEstrutura}</h1>
            </div>
            <div className="flex flex-col rounded-md border border-gray-500 p-3">
              <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">ORIENTAÇÃO DA ESTRUTURA</p>
              <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.orientacao || '-'}</h1>
            </div>
            <div className="flex flex-col rounded-md border border-gray-500 p-3">
              <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">CONCESSIONÁRIA</p>
              <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.concessionaria}</h1>
            </div>
          </div>
          <div className="flex w-full flex-col gap-1">
            <h1 className="w-full rounded-sm bg-[#fead41] p-1 text-center font-bold text-white">SUPRIMENTOS</h1>
            <div className="mt-2 flex flex-col gap-1">
              <h1 className="text-sm font-medium leading-none tracking-tight text-gray-500">OBSERVAÇÕES P/ SUPRIMENTOS</h1>
              <div className="overscroll-y flex h-[50px] max-h-[50px] w-full items-center justify-center overflow-y-auto rounded-md border border-cyan-500 bg-gray-100 p-3 text-center text-sm text-gray-500 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                {analysis.suprimentos?.observacoes}
              </div>
            </div>
            {analysis.suprimentos?.itens?.map((item, index) => (
              <div key={index} className="flex w-full items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="text-sm font-medium text-gray-500">
                    <strong>{item.qtde}</strong> x {item.descricao} <strong className="text-[#fead41]">({item.tipo})</strong>
                  </h1>
                  <div className="flex items-center gap-1">
                    <TbRulerMeasure />
                    <p className="text-xs italic text-gray-500">{item.grandeza}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() =>
                      addProductToComposition({
                        categoria: 'OUTROS',
                        qtde: item.qtde,
                        descricao: `${item.descricao} ${item.tipo}`,
                        unidade: item.grandeza,
                        valor: 0,
                      })
                    }
                    className="flex items-center gap-1 rounded border border-[#fead61] p-1 text-xs font-bold text-[#fead61] hover:bg-[#fead61] hover:text-black"
                  >
                    <IoMdAdd />
                    <p>COMPOSIÇÃO</p>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <TechnicalAnalysisFiles analysisId={analysisId} />
        </div>
      ) : null}
    </div>
  )
}

type ProjectServiceOrderBlockProps = {
  session: Session
  projectId: string
}
function ProjectServiceOrderBlock({ session, projectId }: ProjectServiceOrderBlockProps) {
  const queryClient = useQueryClient()
  const { data: serviceOrders, isLoading, isError, isSuccess } = useProjectServiceOrders({ projectId })
  const [editServiceOrderModal, setEditServiceOrderModal] = useState<{ id: string; isOpen: boolean }>({ id: '', isOpen: false })

  async function handleCreateProjectServiceOrder() {
    function getInverterMetadata(project: TProjectDTO) {
      const inverterQty = project.produtos?.filter((p) => p.categoria === 'INVERSOR').reduce((acc, curr) => acc + curr.qtde, 0)
      const inverterModel = project.produtos
        ?.filter((p) => p.categoria === 'INVERSOR')
        .map((p) => `${p.qtde}x ${p.modelo}`)
        .join(', ')
      const inverterPower = project.produtos
        ?.filter((p) => p.categoria === 'INVERSOR')
        .map((p) => `${p.qtde}x ${p.potencia}`)
        .join(', ')
      return {
        qtde: inverterQty,
        modelo: inverterModel,
        potencia: inverterPower,
      }
    }
    function getModulesMetadata(project: TProjectDTO) {
      const modulosQty = project.produtos?.filter((p) => p.categoria === 'MÓDULO').reduce((acc, curr) => acc + curr.qtde, 0)
      const modulosModel = project.produtos
        ?.filter((p) => p.categoria === 'MÓDULO')
        .map((p) => `${p.qtde}x ${p.modelo}`)
        .join(', ')
      const modulosPower = project.produtos
        ?.filter((p) => p.categoria === 'MÓDULO')
        .map((p) => `${p.qtde}x ${p.potencia}`)
        .join(', ')
      return {
        qtde: modulosQty,
        modelo: modulosModel,
        potencia: modulosPower,
      }
    }
    function getTags(project: TProjectDTO) {
      const tags: Exclude<TServiceOrder['etiquetas'], undefined | null> = []
      if (project.homologacao.fastTrack) {
        tags.push({
          id: '6798eb1b19ad4c2b679bd2e1',
          titulo: 'FAST TRACK',
          cores: {
            primaria: '#058A05',
            secundaria: '#B7FDB7',
          },
        })
      }
      if (project.pagamento.credor == 'SOL FÁCIL') {
        tags.push({
          id: '6798eb2bd422f4f93779dd0d',
          titulo: 'DESLIGAMENTO REMOTO',
          cores: {
            primaria: '#FF0000',
            secundaria: '#FFCCCB',
          },
        })
      }
      if (project.obra.pendencias == 'LEVAR ESTRUTURA NA MONTAGEM') {
        tags.push({
          id: '6798eb4e38fd2c093589ee7f',
          titulo: 'TRANSPORTAR ESTRUTURA',
          cores: {
            primaria: '#8B4513',
            secundaria: '#DFD0BC',
          },
        })
      }
      return tags
    }
    try {
      const project = await fetchProjectById({ id: projectId })
      const serviceOrder: TServiceOrder = {
        categoria: 'MONTAGEM',
        etiquetas: getTags(project),
        favorecido: {
          nome: project.nomeDoContrato || '',
          contato: project.telefone || '',
        },
        anotacoes: '',
        projeto: {
          id: project._id || null, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
          nome: project.nomeDoContrato || null, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
          identificador: project.qtde || null, // identificador QTDE do projeto no banco de projetos
          tipo: project.tipoDeServico || null, // tipo do projeto
        },
        descricao: `SERVIÇO DO PROJETO ${project.nomeDoContrato}`, // servico executado
        localizacao: {
          cep: project.cep?.toString() || '',
          uf: project.uf,
          cidade: project.cidade,
          bairro: project.bairro,
          endereco: project.logradouro,
          numeroOuIdentificador: project.numeroResidencia?.toString() || '',
        },
        responsavel: {
          nome: project.obra?.equipeResp || '',
          tipo: project.obra?.equipeResp ? 'INTERNO' : 'EXTERNO',
        },
        // configurar: false,
        urgencia: 'POUCO URGENTE',
        periodo: {
          inicio: null,
          fim: null,
        },
        pagamento: {
          recebedor: null,
          valor: null,
        },
        cobranca: {
          pagador: null,
          valor: null,
        },
        autor: {
          id: session?.user.id,
          nome: session.user.nome,
          avatar_url: session?.user.avatar_url,
        },
        equipamentos: {
          modulos: getModulesMetadata(project),
          inversor: getInverterMetadata(project),
          disponivel: null,
          retirada: null,
        },
        detalhes: {
          pontoAgua: '',
          senhaWifi: '',
          configuracaoMonitoramento: false,
          possuiTrafo: false,
          tipoEstrutura: project.estruturaPersonalizada?.tipo || null,
          tipoTelha: project.visitaTecnica?.tipoDaTelha || null,
          tipoPadrao: project.padrao?.tipo || null,
          tipoSaidaPadrao: project.visitaTecnica?.saidaDoCliente || null,
          amperagemPadrao: project.visitaTecnica?.amperagem || null,
          responsabilidadePadrao: project.padrao?.respInstalacao,
          topologia: project.sistema?.topologia,
        },
        observacoes: [],
        dataPrevisaoLiberacao: project.compra.previsaoEntrega,
        dataLiberacao: project.compra.dataEntrega,
        dataInsercao: new Date().toISOString(),
      }
      const response = await createServiceOrder({ info: serviceOrder })

      return response
    } catch (error) {
      throw error
    }
  }

  const { mutate, isPending } = useMutationWithFeedback({
    mutationKey: ['create-service-order'],
    mutationFn: handleCreateProjectServiceOrder,
    affectedQueryKey: ['project-service-orders', projectId],
    queryClient: queryClient,
  })
  const handleMutate = async () => queryClient.cancelQueries({ queryKey: ['project-service-orders', projectId] })
  const handleSettled = async () => await queryClient.invalidateQueries({ queryKey: ['project-service-orders', projectId] })
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full bg-gray-500 p-1 text-center text-xs font-medium text-white">ORDENS DE SERVIÇOS</h1>
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => mutate()}
          disabled={isPending}
          className={cn(
            'flex items-center gap-1 rounded-lg bg-blue-500 px-2 py-1 text-white duration-300 ease-in-out disabled:bg-gray-500 disabled:text-gray-300 enabled:hover:bg-blue-600'
          )}
        >
          <MdDesignServices />
          <h1 className="text-xs font-medium tracking-tight">GERAR ORDEM DE SERVIÇO DO PROJETO</h1>
        </button>
      </div>
      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={'Erro ao buscar informações das ordens de serviço.'} /> : null}
      {isSuccess ? (
        serviceOrders.length > 0 ? (
          serviceOrders.map((serviceOrder) => (
            <ServiceOrderCard
              key={serviceOrder._id}
              serviceOrder={serviceOrder}
              handleClick={(id) => setEditServiceOrderModal({ id, isOpen: true })}
            />
          ))
        ) : (
          <div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhuma ordem de serviço encontrada.</div>
        )
      ) : null}
      {editServiceOrderModal.isOpen && editServiceOrderModal.id ? (
        <ModalControlServiceOrder
          serviceOrderId={editServiceOrderModal.id}
          session={session}
          closeModal={() => setEditServiceOrderModal({ id: '', isOpen: false })}
          callbacks={{
            onMutate: handleMutate,
            onSettled: handleSettled,
          }}
        />
      ) : null}
    </div>
  )
}
type ServiceOrderCardProps = {
  serviceOrder: TServiceOrderSimplifiedDTO

  handleClick: (id: string) => void
}
function ServiceOrderCard({ serviceOrder, handleClick }: ServiceOrderCardProps) {
  function getStatusTag(serviceOrder: TServiceOrderSimplifiedDTO) {
    if (serviceOrder.status === 'PENDENTE')
      return <div className="rounded-full bg-red-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">PENDENTE</div>

    if (serviceOrder.status === 'AGUARDANDO PLANEJAMENTO')
      return <div className="rounded-full bg-blue-800 px-2 py-0.5 text-[0.5rem] font-medium text-white">AGUARDANDO PLANEJAMENTO</div>

    if (serviceOrder.status === 'AGUARDANDO AGENDAMENTO')
      return <div className="rounded-full bg-yellow-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">AGENDADA</div>

    if (serviceOrder.status === 'EM EXECUÇÃO')
      return <div className="rounded-full bg-blue-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">EM EXECUÇÃO</div>

    if (serviceOrder.status === 'CONCLUÍDA PARCIAL')
      return <div className="rounded-full bg-purple-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">CONCLUÍDA PARCIAL</div>

    if (serviceOrder.status === 'CONCLUÍDA')
      return <h1 className="min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-[0.5rem] text-white">CONCLUÍDA</h1>

    if (serviceOrder.status === 'CANCELADA')
      return <h1 className="min-w-fit rounded-lg bg-gray-500 px-2 py-0.5 text-[0.5rem] text-white">CANCELADA</h1>

    return <h1 className="min-w-fit rounded-lg bg-primary px-2 py-0.5 text-[0.5rem] text-white">NÃO DEFINIDO</h1>
  }
  return (
    <div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold leading-none tracking-tight">{serviceOrder.descricao}</p>
          {serviceOrder.projeto.nome ? (
            <div className="flex items-center gap-1">
              <MdDashboard size={10} />
              <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{serviceOrder.projeto.nome}</h1>
            </div>
          ) : null}
          {getStatusTag(serviceOrder)}
        </div>
        <div className="flex items-center gap-1">
          <UserRound size={12} />
          <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{serviceOrder.responsavel.nome}</h1>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
          <div className="flex items-center gap-1">
            <Tag size={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{serviceOrder.categoria}</h1>
          </div>
          <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ETIQUETAS</h1>
          {serviceOrder.etiquetas && serviceOrder.etiquetas?.length > 0 ? (
            serviceOrder.etiquetas.map((tag, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid',
                  borderColor: tag.cores.primaria,
                  color: tag.cores.primaria,
                  backgroundColor: tag.cores.secundaria,
                }}
                className={cn('flex items-center gap-1 rounded px-2 py-0.5')}
              >
                <Tag width={10} height={10} />
                <h1 className="text-[0.5rem] font-bold tracking-tight">{tag.titulo}</h1>
              </div>
            ))
          ) : (
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">NÃO DEFINIDAS</h1>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <FaLocationDot width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">LOCALIZAÇÃO</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {serviceOrder.localizacao.cidade} ({serviceOrder.localizacao.uf})
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCheck2 width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PREVISÃO DE LIBERAÇÃO</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {serviceOrder.dataPrevisaoLiberacao ? formatDateAsLocale(serviceOrder.dataPrevisaoLiberacao) : 'N/A'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCheck2All width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">LIBERAÇÃO</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {serviceOrder.dataLiberacao ? formatDateAsLocale(serviceOrder.dataLiberacao) : 'N/A'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendar width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">AGENDAMENTO</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {serviceOrder.agendamento
                ? `${formatDateAsLocale(serviceOrder.agendamento.inicio, true)} - ${
                    serviceOrder.agendamento.fim ? formatDateAsLocale(serviceOrder.agendamento.fim, true) : 'N/A'
                  }`
                : 'N/A'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarCheck width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">EXECUÇÃO</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {serviceOrder.periodo.inicio
                ? `${formatDateAsLocale(serviceOrder.periodo.inicio, true)} - ${
                    serviceOrder.periodo.fim ? formatDateAsLocale(serviceOrder.periodo.fim, true) : 'N/A'
                  }`
                : 'N/A'}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(serviceOrder.dataInsercao, true)}</p>
          </div>
          {serviceOrder.dataEfetivacao ? (
            <div className="flex items-center gap-1">
              <BsCalendarCheck color="#22c55e" />
              <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(serviceOrder.dataEfetivacao, true)}</p>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <Avatar
              url={serviceOrder.autor?.avatar_url || undefined}
              width={20}
              height={20}
              fallback={formatNameAsInitials(serviceOrder.autor?.nome || '')}
            />

            <p className="text-[0.65rem] font-medium text-primary/80">{serviceOrder.autor?.nome || ''}</p>
          </div>
        </div>
        <button
          onClick={() => handleClick(serviceOrder._id)}
          className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary"
        >
          <Pencil width={10} height={10} />
          <p>EDITAR</p>
        </button>
      </div>
    </div>
  )
}
