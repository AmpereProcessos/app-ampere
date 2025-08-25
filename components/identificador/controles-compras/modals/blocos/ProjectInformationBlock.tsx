import TechnicalAnalysisFiles from '@/components/identificador/analisesTecnicas/TechnicalAnalysisFiles'
import Avatar from '@/components/utils/Avatar'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { cn } from '@/lib/utils'
import { formatDateAsLocale, formatLocation, formatNameAsInitials } from '@/utils/methods/formatting'
import { updateProject } from '@/utils/methods/mutation/clients'
import { useTechnicalAnalysisById } from '@/utils/methods/query/technical-analysis'
import { renderProductCategoryIcon } from '@/utils/methods/rendering'
import type { TPurchaseControl, TPurchaseProjectDTO } from '@/utils/schemas/purchases'
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
import type { TServiceOrder, TServiceOrderSimplifiedDTO } from '@/utils/schemas/service-order'
import { Pencil, Tag, UserRound } from 'lucide-react'
import ModalControlServiceOrder from '@/components/identificador/ordensDeServico/modals/ModalControlServiceOrder'
import type { TAuthSession } from '@/lib/authentication/types'
import { fetchProjectById } from '@/utils/methods/query/clients'
import type { TProjectDTO } from '@/utils/schemas/projects'
import { createServiceOrder, updateManyServiceOrdersByProjectId } from '@/utils/methods/mutation/service-orders'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { handleProjectServiceOrderTrigger } from '@/utils/methods/mutation/triggers'

type PurchaseControlProjectInformationBlockProps = {
  session: TAuthSession
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
      <h1 className="bg-primary text-primary-foreground w-full rounded p-1 text-center font-bold">INFORMAÇÕES DO PROJETO</h1>
      <div className="flex w-full items-center justify-center">
        <button
          type="button"
          disabled={isPending}
          onClick={() => mutate()}
          className={cn(
            'disabled:bg-primary/60 disabled:hover:bg-primary/60 flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-white duration-300 ease-in-out hover:bg-blue-700'
          )}
        >
          <MdSync />
          <h1 className="text-xs font-medium tracking-tight">SINCRONIZAR DADOS NO PROJETO</h1>
        </button>
      </div>
      <div className="flex w-full grow flex-col gap-2">
        <h1 className="bg-primary/60 w-full p-1 text-center text-xs font-medium text-white">GERAIS</h1>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-primary/60 text-[0.65rem] font-medium">PROJETO</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <FaUserAlt />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project.nomeDoContrato}</p>
              </div>
              <div className="flex items-center gap-1">
                <MdPhone />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.telefone}</p>
              </div>
              <div className="flex items-center gap-1">
                <BsPersonVcard />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.cpf_cnpj}</p>
              </div>
              <div className="flex items-center gap-1">
                <MdLandscape />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.inscricaoRural || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-1">
                <FaLocationDot />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">
                  {formatLocation({
                    location: {
                      uf: project.uf || '',
                      cidade: project.cidade || '',
                      cep: project.cep?.toString() || '',
                      bairro: project.bairro,
                      endereco: project.logradouro,
                      numeroOuIdentificador: project.numeroResidencia?.toString() || '',
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
        <h1 className="bg-primary/60 w-full p-1 text-center text-xs font-medium text-white">PAGAMENTO</h1>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-primary/60 text-[0.65rem] font-medium">PAGADOR</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <FaUserAlt />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.pagamento.pagador}</p>
              </div>
              <div className="flex items-center gap-1">
                <BsPersonVcard />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.pagamento.cpf_cnpjPagador || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-1">
                <FaPhone />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.pagamento.contatoPagador}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 lg:items-end">
            <p className="text-primary/60 text-[0.65rem] font-medium">CREDOR</p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-1">
                <BsStack />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.pagamento.forma || 'NÃO DEFINIDO'}</p>
              </div>
              <div className="flex items-center gap-1">
                <MdOutlinePayment />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.pagamento.metodo || 'NÃO DEFINIDO'}</p>
              </div>

              <div className="flex items-center gap-1">
                <BsBank />
                <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.pagamento.credor || 'NÃO DEFINIDO'}</p>
              </div>
              {project.pagamento.forma === 'FINANCIAMENTO' ? (
                <>
                  <div className="flex items-center gap-1">
                    <FaUserAlt />
                    <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.pagamento.credorNomeGerente}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaPhone />
                    <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.pagamento.credorContatoGerente}</p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-2 lg:flex-row">
          <div className="flex w-full flex-col lg:w-1/2">
            <h1 className="text-primary w-full text-center text-[0.6rem] font-medium tracking-tight lg:text-start">
              OBSERVAÇÕES GERAIS SOBRE A NEGOCIAÇÃO
            </h1>
            <div className="bg-primary/10 flex w-full items-center justify-center rounded p-2">
              <h1 className="text-[0.6rem] font-medium">{project.pagamento.negociacao || 'OBSERVAÇÕES DA NEGOCIAÇÃO NÃO DEFINIDAS'}</h1>
            </div>
          </div>
        </div>
        {/* <div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-2 lg:flex-row">
               <div className="flex w-full flex-col lg:w-1/2">
                 <h1 className="w-full text-center text-[0.6rem] font-medium tracking-tight text-primary lg:text-start">
                   OBSERVAÇÕES GERAIS SOBRE O PAGAMENTO
                 </h1>
                 <div className="flex w-full items-center justify-center rounded bg-primary/10 p-2">
                   <h1 className="text-[0.6rem] font-medium">{project.pagamentoObservacoes || 'OBSERVAÇÕES GERAIS DE PAGAMENTO NÃO DEFINIDAS'}</h1>
                 </div>
               </div>
               {project.pagamentoCreditoAplicavel ? (
                 <div className="flex w-full flex-col lg:w-1/2">
                   <h1 className="w-full text-center text-[0.6rem] font-medium tracking-tight text-primary lg:text-end">
                     OBSERVAÇÕES GERAIS SOBRE CRÉDITO
                   </h1>
                   <div className="flex w-full items-center justify-center rounded bg-primary/10 p-2">
                     <h1 className="text-[0.6rem] font-medium">
                       {project.pagamentoCreditoObservacoes || 'OBSERVAÇÕES GERAIS DE PAGAMENTO NÃO DEFINIDAS'}
                     </h1>
                   </div>
                 </div>
               ) : null}
              </div> */}
        <h1 className="bg-primary/60 w-full p-1 text-center text-xs font-medium text-white">PRODUTOS</h1>
        <div className="flex w-full flex-wrap items-center gap-2">
          {project.produtos && project.produtos.length > 0 ? (
            project.produtos.map((product) => (
              <div key={product.id} className="border-primary bg-background flex w-full flex-col gap-1 rounded-md border p-2 dark:bg-[#121212]">
                <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
                  <div className="flex w-full items-center gap-1 lg:grow">
                    <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1 dark:border-white">
                      {renderProductCategoryIcon(product.categoria, 15)}
                    </div>
                    <p className="text-sm leading-none font-bold tracking-tight">
                      <strong className="text-[#FF9B50]">{product.qtde}</strong> x {product.modelo}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
                    <div className="flex items-center gap-1">
                      <FaIndustry size={12} />
                      <p className="text-primary/60 text-[0.6rem] font-light lg:text-xs">{product.fabricante}</p>
                    </div>
                    {product.potencia ? (
                      <div className="flex items-center gap-1">
                        <FaBolt size={12} />
                        <p className="text-primary/60 text-[0.6rem] font-light lg:text-xs">{product.potencia} W</p>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-1">
                      <AiOutlineSafety size={12} />
                      <p className="text-primary/60 text-[0.6rem] font-light lg:text-xs">{product.garantia} ANOS</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      addProductToComposition({
                        categoria: product.categoria,
                        descricao: `${product.fabricante} - ${product.modelo}`,
                        qtde: product.qtde,
                        unidade: 'UN',
                        valor: 0,
                      })
                    }
                    className="flex items-center gap-1 rounded-lg border border-[#fead41] px-2 py-1 text-[0.6rem] font-medium text-[#fead41] hover:bg-[#fead41] hover:text-black"
                  >
                    <IoMdAdd width={10} height={10} />
                    <p>ADICIONAR À COMPOSIÇÃO</p>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhum produto adicionado</div>
          )}
        </div>
        <ProjectServiceOrderBlock session={session} project={project} projectId={project._id} />
        <h1 className="bg-primary/60 w-full p-1 text-center text-xs font-medium text-white">OUTROS</h1>
        <div className="flex items-center justify-center">
          <div className="w-fit">
            <CheckboxInput
              labelFalse="LEVAR ESTRUTURA NA MONTAGEM"
              labelTrue="LEVAR ESTRUTURA NA MONTAGEM"
              checked={purchase.metadata?.pendenciasExecucao === 'LEVAR ESTRUTURA NA MONTAGEM'}
              handleChange={(value) => updatePurchase({ metadata: { pendenciasExecucao: value ? 'LEVAR ESTRUTURA NA MONTAGEM' : null } })}
            />
          </div>
        </div>
        {project.idVisitaTecnica ? (
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center justify-center">
              <button
                type="button"
                onClick={() => setTechnicalAnalysisBlockIsOpen((prev) => !prev)}
                className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
                  'bg-primary/20 hover:bg-red-300': technicalAnalysisBlockIsOpen,
                  'bg-green-300 hover:bg-green-400': !technicalAnalysisBlockIsOpen,
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
            <h1 className="font-raleway text-primary/60 text-xs font-bold">ANALISTA</h1>
            <Avatar url={analysis.analista?.avatar_url} fallback={'A'} height={30} width={30} />
            <p className="text-primary/60 text-sm font-medium">{analysis.analista?.apelido || 'NÃO DEFINIDO'}</p>
          </div>
          <div className="flex w-full flex-wrap justify-around">
            <div className="border-primary/60 flex flex-col rounded-md border p-3">
              <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">TIPO DE TELHA</p>
              <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.tipoTelha}</h1>
            </div>
            <div className="border-primary/60 flex flex-col rounded-md border p-3">
              <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">TIPO DA ESTRUTURA</p>
              <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.tipoEstrutura}</h1>
            </div>
            <div className="border-primary/60 flex flex-col rounded-md border p-3">
              <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">MATERIAL DA ESTRUTURA</p>
              <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.materialEstrutura}</h1>
            </div>
            <div className="border-primary/60 flex flex-col rounded-md border p-3">
              <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">ORIENTAÇÃO DA ESTRUTURA</p>
              <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.orientacao || '-'}</h1>
            </div>
            <div className="border-primary/60 flex flex-col rounded-md border p-3">
              <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">CONCESSIONÁRIA</p>
              <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.concessionaria}</h1>
            </div>
          </div>
          <div className="flex w-full flex-col gap-1">
            <h1 className="w-full rounded-sm bg-[#fead41] p-1 text-center font-bold text-white">SUPRIMENTOS</h1>
            <div className="mt-2 flex flex-col gap-1">
              <h1 className="text-primary/60 text-sm leading-none font-medium tracking-tight">OBSERVAÇÕES P/ SUPRIMENTOS</h1>
              <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 text-primary/60 bg-primary/20 flex h-[50px] max-h-[50px] w-full items-center justify-center overflow-y-auto rounded-md border border-cyan-500 p-3 text-center text-sm">
                {analysis.suprimentos?.observacoes}
              </div>
            </div>
            {analysis.suprimentos?.itens?.map((item, index) => (
              <div key={`${item.descricao}-${index}`} className="flex w-full items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="text-primary/60 text-sm font-medium">
                    <strong>{item.qtde}</strong> x {item.descricao} <strong className="text-[#fead41]">({item.tipo})</strong>
                  </h1>
                  <div className="flex items-center gap-1">
                    <TbRulerMeasure />
                    <p className="text-primary/60 text-xs italic">{item.grandeza}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      addProductToComposition({
                        materialId: item.idMaterial,
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
  session: TAuthSession
  project: TPurchaseProjectDTO
  projectId: string
}
function ProjectServiceOrderBlock({ session, project, projectId }: ProjectServiceOrderBlockProps) {
  const queryClient = useQueryClient()
  const { data: serviceOrders, isLoading, isError, isSuccess } = useProjectServiceOrders({ projectId })
  const [editServiceOrderModal, setEditServiceOrderModal] = useState<{ id: string; isOpen: boolean }>({ id: '', isOpen: false })

  const { mutate: mutateProjectServiceOrderTrigger, isPending } = useMutationWithFeedback({
    mutationKey: ['create-project-main-service-order'],
    mutationFn: handleProjectServiceOrderTrigger,
    affectedQueryKey: ['project-service-orders', projectId],
    queryClient: queryClient,
  })
  const handleMutate = async () => queryClient.cancelQueries({ queryKey: ['project-service-orders', projectId] })
  const handleSettled = async () => await queryClient.invalidateQueries({ queryKey: ['project-service-orders', projectId] })
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="bg-primary/60 w-full p-1 text-center text-xs font-medium text-white">ORDENS DE SERVIÇOS</h1>
      <div className="flex w-full items-center justify-end">
        {!project.idOrdemServico ? (
          <button
            type="button"
            onClick={() =>
              mutateProjectServiceOrderTrigger({
                projectId,
              })
            }
            disabled={isPending}
            className={cn(
              'disabled:text-primary/20 disabled:bg-primary/60 flex items-center gap-1 rounded-lg bg-blue-500 px-2 py-1 text-white duration-300 ease-in-out enabled:hover:bg-blue-600'
            )}
          >
            <MdDesignServices />
            <h1 className="text-xs font-medium tracking-tight">GERAR ORDEM DE SERVIÇO DO PROJETO</h1>
          </button>
        ) : null}
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
          <div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhuma ordem de serviço encontrada.</div>
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
    if (serviceOrder.status === 'PENDENTE') return <div className="text-xxs rounded-full bg-red-600 px-2 py-0.5 font-medium text-white">PENDENTE</div>

    if (serviceOrder.status === 'AGUARDANDO PLANEJAMENTO')
      return <div className="text-xxs rounded-full bg-blue-800 px-2 py-0.5 font-medium text-white">AGUARDANDO PLANEJAMENTO</div>

    if (serviceOrder.status === 'AGUARDANDO AGENDAMENTO')
      return <div className="text-xxs rounded-full bg-yellow-600 px-2 py-0.5 font-medium text-white">AGENDADA</div>

    if (serviceOrder.status === 'EM EXECUÇÃO')
      return <div className="text-xxs rounded-full bg-blue-600 px-2 py-0.5 font-medium text-white">EM EXECUÇÃO</div>

    if (serviceOrder.status === 'CONCLUÍDA PARCIAL')
      return <div className="text-xxs rounded-full bg-purple-600 px-2 py-0.5 font-medium text-white">CONCLUÍDA PARCIAL</div>

    if (serviceOrder.status === 'CONCLUÍDA') return <h1 className="text-xxs min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-white">CONCLUÍDA</h1>

    if (serviceOrder.status === 'CANCELADA') return <h1 className="text-xxs bg-primary/60 min-w-fit rounded-lg px-2 py-0.5 text-white">CANCELADA</h1>

    return <h1 className="bg-primary text-xxs min-w-fit rounded-lg px-2 py-0.5 text-white">NÃO DEFINIDO</h1>
  }
  return (
    <div className="border-primary bg-background flex w-full flex-col gap-1 rounded border p-2 shadow-xs dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm leading-none font-bold tracking-tight">{serviceOrder.descricao}</p>
          {serviceOrder.projeto.nome ? (
            <div className="flex items-center gap-1">
              <MdDashboard size={10} />
              <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">{serviceOrder.projeto.nome}</h1>
            </div>
          ) : null}
          {getStatusTag(serviceOrder)}
        </div>
        <div className="flex items-center gap-1">
          <UserRound size={12} />
          <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">{serviceOrder.responsavel.nome}</h1>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
          <div className="flex items-center gap-1">
            <Tag size={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">{serviceOrder.categoria}</h1>
          </div>
          <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">ETIQUETAS</h1>
          {serviceOrder.etiquetas && serviceOrder.etiquetas?.length > 0 ? (
            serviceOrder.etiquetas.map((tag, index) => (
              <div
                key={`${tag.id}-${index}`}
                style={{
                  border: '1px solid',
                  borderColor: tag.cores.primaria,
                  color: tag.cores.primaria,
                  backgroundColor: tag.cores.secundaria,
                }}
                className={cn('flex items-center gap-1 rounded px-2 py-0.5')}
              >
                <Tag width={10} height={10} />
                <h1 className="text-xxs font-bold tracking-tight">{tag.titulo}</h1>
              </div>
            ))
          ) : (
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">NÃO DEFINIDAS</h1>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <FaLocationDot width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">LOCALIZAÇÃO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {serviceOrder.localizacao.cidade} ({serviceOrder.localizacao.uf})
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCheck2 width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">PREVISÃO DE LIBERAÇÃO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {serviceOrder.dataPrevisaoLiberacao ? formatDateAsLocale(serviceOrder.dataPrevisaoLiberacao) : 'N/A'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCheck2All width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">LIBERAÇÃO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {serviceOrder.dataLiberacao ? formatDateAsLocale(serviceOrder.dataLiberacao) : 'N/A'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendar width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">AGENDAMENTO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {serviceOrder.agendamento
                ? `${formatDateAsLocale(serviceOrder.agendamento.inicio, true)} - ${serviceOrder.agendamento.fim ? formatDateAsLocale(serviceOrder.agendamento.fim, true) : 'N/A'}`
                : 'N/A'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarCheck width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">EXECUÇÃO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {serviceOrder.periodo.inicio
                ? `${formatDateAsLocale(serviceOrder.periodo.inicio, true)} - ${serviceOrder.periodo.fim ? formatDateAsLocale(serviceOrder.periodo.fim, true) : 'N/A'}`
                : 'N/A'}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(serviceOrder.dataInsercao, true)}</p>
          </div>
          {serviceOrder.dataEfetivacao ? (
            <div className="flex items-center gap-1">
              <BsCalendarCheck color="#22c55e" />
              <p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(serviceOrder.dataEfetivacao, true)}</p>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <Avatar
              url={serviceOrder.autor?.avatar_url || undefined}
              width={20}
              height={20}
              fallback={formatNameAsInitials(serviceOrder.autor?.nome || '')}
            />

            <p className="text-primary/80 text-[0.65rem] font-medium">{serviceOrder.autor?.nome || ''}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleClick(serviceOrder._id)}
          className="bg-primary text-secondary flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6rem]"
        >
          <Pencil width={10} height={10} />
          <p>EDITAR</p>
        </button>
      </div>
    </div>
  )
}
