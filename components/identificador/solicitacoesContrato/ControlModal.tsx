import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { useContractRequestById } from '@/utils/methods/query/contract-requests'
import type { TContractRequestDTO } from '@/utils/schemas/contract-requests'
import React, { useEffect, useState } from 'react'
import { BsCalendarCheck, BsCode, BsPatchCheck } from 'react-icons/bs'
import { VscChromeClose } from 'react-icons/vsc'
import GeneralInformationBlock from './blocos/GeneralInformationBlock'
import type { TAuthSession } from '@/lib/authentication/types'
import ContactInformationBlock from './blocos/ContactInformationBlock'
import ElectricalInstallationInformationBlock from './blocos/ElectricalInstallationInformationBlock'
import SystemInformationBlock from './blocos/SystemInformationBlock'
import StructureInformationBlock from './blocos/StructureInformationBlock'
import OeMInformationBlock from './blocos/OeMInformationBlock'
import InsuranceInformationBlock from './blocos/InsuranceInformationBlock'
import EnergyPAInformationBlock from './blocos/EnergyPAInformationBlock'
import PaymentInformationBlock from './blocos/PaymentInformationBlock'
import ElectricalInstallationDependentsInformationBlock from './blocos/ElectricalInstallationDependentsInformationBlock'
import TechnicalAnalysisBlock from './blocos/TechnicalAnalysisBlock'
import FilesBlock from './blocos/FilesBlock'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { editContractRequest, generateContract } from '@/utils/methods/mutation/contract-requests'
import { useQueryClient } from '@tanstack/react-query'
import {
  getProjectHomologationInformation,
  getProjectInformationFromRequest,
  handleSendEmailToCobrancas,
  handleSendNotificationToCobrancas,
} from '@/utils/methods/util/contract-requests'
import axios from 'axios'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import Link from 'next/link'
import { FaFile } from 'react-icons/fa'
import { updateProject } from '@/utils/methods/mutation/clients'
import { updateOpportunity } from '@/utils/methods/mutation/crm/opportunities'
import type { TFileReference } from '@/utils/schemas/file-reference.schema'
import { createManyFileReferences } from '@/utils/methods/mutation/crm/file-references'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'

type ContractRequestControlModalProps = {
  requestId: string
  session: TAuthSession
  closeModal: () => void
}
function ContractRequestControlModal({ requestId, session, closeModal }: ContractRequestControlModalProps) {
  const queryClient = useQueryClient()
  const userHasEditPermission = session.user.permissoes.comercial.editar || session.user.permissoes.rotas.includes('PPS')
  const { data: request, isLoading, isError, isSuccess } = useContractRequestById({ id: requestId })
  const [infoHolder, setInfoHolder] = useState<TContractRequestDTO>({
    _id: '',
    nomeVendedor: '',
    nomeDoProjeto: '',
    idParceiro: '',
    telefoneVendedor: '',
    tipoDeServico: 'SISTEMA FOTOVOLTAICO',
    nomeDoContrato: '',
    telefone: '',
    cpf_cnpj: '',
    rg: '',
    dataDeNascimento: null,
    cep: '',
    cidade: '',
    uf: '',
    enderecoCobranca: '',
    numeroResCobranca: '',
    bairro: '',
    pontoDeReferencia: '',
    segmento: undefined,
    formaAssinatura: 'FISICO',
    codigoSVB: '',
    estadoCivil: '',
    email: '',
    profissao: '',
    ondeTrabalha: '',
    possuiDeficiencia: 'NÃO',
    qualDeficiencia: '',
    canalVenda: '',
    nomeIndicador: '',
    telefoneIndicador: '',
    comoChegouAoCliente: '',
    nomeContatoJornadaUm: '',
    telefoneContatoUm: '',
    nomeContatoJornadaDois: '',
    telefoneContatoDois: '',
    cuidadosContatoJornada: '',
    nomeTitularProjeto: '',
    tipoDoTitular: null,
    tipoDaLigacao: null,
    tipoDaInstalacao: 'URBANO',
    cepInstalacao: '',
    enderecoInstalacao: '',
    numeroResInstalacao: '',
    numeroInstalacao: '',
    bairroInstalacao: '',
    cidadeInstalacao: '',
    ufInstalacao: '',
    pontoDeReferenciaInstalacao: '',
    loginCemigAtende: '',
    senhaCemigAtende: '',
    latitude: '',
    longitude: '',
    potPico: 0,
    geracaoPrevista: 0,
    topologia: null,
    marcaInversor: '',
    qtdeInversor: '',
    potInversor: '',
    marcaModulos: '',
    qtdeModulos: '',
    potModulos: '',
    tipoEstrutura: '',
    materialEstrutura: null,
    estruturaAmpere: 'NÃO',
    responsavelEstrutura: 'NÃO SE APLICA',
    formaPagamentoEstrutura: null,
    valorEstrutura: 0,
    possuiOeM: 'NÃO',
    planoOeM: 'NÃO SE APLICA',
    clienteSegurado: 'NÃO',
    valorSeguro: 0,
    tempoSegurado: 'NÃO SE APLICA',
    formaPagamentoOeMOuSeguro: 'NÃO SE APLICA',
    valorOeMOuSeguro: null,
    aumentoDeCarga: 'NÃO',
    caixaConjugada: 'NÃO',
    tipoDePadrao: null,
    aumentoDisjuntor: null,
    respTrocaPadrao: null,
    formaPagamentoPadrao: null,
    valorPadrao: 0,
    nomePagador: '',
    contatoPagador: '',
    necessidaInscricaoRural: null,
    inscriçãoRural: '',
    cpf_cnpjNF: '',
    localEntrega: null,
    entregaIgualCobranca: null,
    restricoesEntrega: null,
    valorContrato: 0,
    origemRecurso: null,
    numParcelas: 0,
    valorParcela: 0,
    credor: null,
    nomeGerente: '',
    contatoGerente: '',
    necessidadeNFAdiantada: null,
    necessidadeCodigoFiname: null,
    formaDePagamento: null,
    descricaoNegociacao: '',
    possuiDistribuicao: null,
    realizarHomologacao: true,
    distribuicoes: [],
    dataSolicitacao: new Date().toISOString(),
  })
  async function approveFormulary(info: TContractRequestDTO) {
    try {
      // Adding a new operational projecy
      let insertObject = getProjectInformationFromRequest({ request: info })

      // Getting homologation information in case idHomologacao is defined
      if (info.idHomologacao) {
        const { projectHomologation, projectHomologationFiles } = await getProjectHomologationInformation({
          homologationId: info.idHomologacao,
        })
        insertObject = {
          ...insertObject,
          homologacao: projectHomologation,
          links: { ...insertObject.links, projetos: projectHomologationFiles },
        }
      }
      const { data } = await axios.post('/api/projects/add', insertObject)
      const insertedProjectId = data.data.insertedId

      const fileReferences: TFileReference[] =
        insertObject.links.documentos?.map((file) => ({
          titulo: file.title,
          url: file.link,
          formato: file.format,
          idProjeto: insertedProjectId,
          categorias: ['DOCUMENTOS'],
          autor: { id: 'holder', nome: 'MIGRAÇÃO' },
          dataInsercao: new Date().toISOString(),
        })) || []
      if (fileReferences.length > 0) await createManyFileReferences({ info: fileReferences })
      // Updating the contract request instance
      await editContractRequest({
        id: requestId,
        changes: {
          ...info,
          idProjetoApp: insertedProjectId,
          aprovacao: true,
          dataAprovacao: new Date().toISOString(),
        },
      })
      // Notifying and emailing cobrancas sector
      if (info.tipoDeServico !== 'CONSÓRCIO DE ENERGIA')
        await handleSendEmailToCobrancas({
          requestId: requestId,
          contractName: info?.nomeDoContrato,
        })
      await handleSendNotificationToCobrancas({
        contractName: info.nomeDoContrato,
      })
      return 'Novo projeto adicionado com sucesso !'
    } catch (error) {
      throw error
    }
  }
  async function rejectFormulary(info: TContractRequestDTO) {
    try {
      const formularyId = info._id
      const formularyOpportunityId = info.idProjetoCRM

      if (formularyOpportunityId)
        await updateOpportunity({
          id: formularyOpportunityId,
          changes: {
            'ganho.idSolicitacao': null,
            'ganho.dataSolicitacao': null,
          },
        })
      await editContractRequest({
        id: formularyId,
        changes: { aprovacao: false },
      })

      return 'Formulário de contrato atualizado com sucesso !'
    } catch (error) {
      throw error
    }
  }
  const { mutate: handleApproveRequest, isPending: approvalLoading } = useMutationWithFeedback({
    mutationKey: ['add-new-project', requestId],
    mutationFn: approveFormulary,
    queryClient: queryClient,
    affectedQueryKey: ['contract-requests'],
    callbackFn: async () =>
      await queryClient.invalidateQueries({
        queryKey: ['contract-request-by-id', requestId],
      }),
  })
  const { mutate: handleRejectRequest, isPending: rejectLoading } = useMutationWithFeedback({
    mutationKey: ['reject-contract-request', requestId],
    mutationFn: rejectFormulary,
    queryClient: queryClient,
    affectedQueryKey: ['contract-requests'],
  })
  const { mutate: handleRequestUpdate, isPending: updateLoading } = useMutationWithFeedback({
    mutationKey: ['update-contract-request', requestId],
    mutationFn: editContractRequest,
    queryClient: queryClient,
    affectedQueryKey: ['contract-requests'],
    callbackFn: async () =>
      await queryClient.invalidateQueries({
        queryKey: ['contract-request-by-id', requestId],
      }),
  })
  const { mutate: handleGetContractDcoument, isPending: isGeneratingContractDocument } = useMutationWithFeedback({
    mutationKey: ['generate-contract-pdf', requestId],
    mutationFn: generateContract,
    queryClient: queryClient,
    affectedQueryKey: ['contract-requests'],
  })
  useEffect(() => {
    if (request) setInfoHolder(request)
  }, [request])
  return (
    <div id="edit-expense" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[75%]">
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-300 px-2 pb-2">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-[#353432] dark:text-white ">CONTROLE DE FORMULÁRIO</h3>
              <div className="flex items-center gap-1">
                <BsCode />
                <h1 className="text-xxs leading-none tracking-tight text-gray-500">#{requestId}</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={() => closeModal()}
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorComponent msg={'Houve um erro ao buscar informações do formulário de contrato.'} /> : null}
          {isSuccess && !!infoHolder._id ? (
            <>
              <div className="flex grow flex-col gap-y-4 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <div className="flex w-full items-center justify-end gap-2">
                  <Link href={`/comercial/pdfProcuracao/${requestId}`}>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded border border-gray-600 px-4 py-2 text-gray-600 duration-300 ease-in-out hover:border-gray-400 hover:text-gray-400"
                    >
                      <FaFile />
                      <p className="text-xs font-bold tracking-tight">PROCURAÇÃO EM PDF</p>
                    </button>
                  </Link>
                  <Link href={`/comercial/publicoFormulario/${requestId}`}>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded border border-orange-600 px-4 py-2 text-orange-600 duration-300 ease-in-out hover:border-orange-400 hover:text-orange-400"
                    >
                      <FaFile />
                      <p className="text-xs font-bold tracking-tight">FORMULÁRIO EM PDF</p>
                    </button>
                  </Link>
                </div>
                <GeneralInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

                <ContactInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

                <ElectricalInstallationInformationBlock
                  infoHolder={infoHolder}
                  setInfoHolder={setInfoHolder}
                  userHasEditPermission={userHasEditPermission}
                />

                <SystemInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

                <StructureInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

                <EnergyPAInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

                <OeMInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

                <InsuranceInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

                <PaymentInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

                <ElectricalInstallationDependentsInformationBlock
                  infoHolder={infoHolder}
                  setInfoHolder={setInfoHolder}
                  userHasEditPermission={userHasEditPermission}
                />

                <TechnicalAnalysisBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

                <FilesBlock
                  files={infoHolder.links}
                  tag={`${infoHolder.nomeDoContrato}`}
                  vinculateFiles={(newLinks) =>
                    //@ts-ignore
                    handleRequestUpdate({
                      id: requestId,
                      changes: { links: newLinks },
                    })
                  }
                  vinculationPending={updateLoading}
                />
                <div className="flex w-full flex-wrap items-center justify-center gap-2">
                  <LoadingButton
                    onClick={() =>
                      handleGetContractDcoument({
                        requestId: requestId,
                        contractName: infoHolder.nomeDoContrato,
                        contractFormat: 'docx',
                      })
                    }
                    loading={isGeneratingContractDocument}
                  >
                    GERAR CONTRATO EM DOCX
                  </LoadingButton>
                  <LoadingButton
                    onClick={() =>
                      handleGetContractDcoument({
                        requestId: requestId,
                        contractName: infoHolder.nomeDoContrato,
                        contractFormat: 'pdf',
                      })
                    }
                    loading={isGeneratingContractDocument}
                  >
                    GERAR CONTRATO EM PDF
                  </LoadingButton>
                </div>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {infoHolder.aprovacao ? (
                    <>
                      <div className="flex items-center gap-1">
                        <BsCalendarCheck color="rgb(34,197,94)" />
                        <h1 className="text-sm font-medium tracking-tight text-gray-500">
                          APROVADO EM: {formatDateAsLocale(infoHolder.dataAprovacao, true)}
                        </h1>
                      </div>
                      {infoHolder.confeccionado ? (
                        <div className="flex items-center gap-1">
                          <BsPatchCheck color="rgb(34,197,94)" />
                          <h1 className="text-sm font-medium tracking-tight text-gray-500">CONFECCIONADO</h1>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={updateLoading}
                          onClick={async () => {
                            // @ts-ignore
                            handleRequestUpdate({
                              id: requestId,
                              changes: { confeccionado: true },
                            })

                            if (infoHolder.idProjetoApp)
                              await updateProject({
                                id: infoHolder.idProjetoApp,
                                changes: {
                                  'contrato.dataLiberacao': new Date().toISOString(),
                                },
                              })
                          }}
                          className="flex h-9 items-center gap-1 whitespace-nowrap rounded bg-cyan-800 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-cyan-600 enabled:hover:text-white"
                        >
                          <BsPatchCheck />
                          <p className="">VALIDAR CONFECÇÃO</p>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={approvalLoading || updateLoading || rejectLoading}
                        onClick={() => {
                          // @ts-ignore
                          handleApproveRequest(infoHolder)
                        }}
                        className="h-9 whitespace-nowrap rounded bg-green-800 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-green-800 enabled:hover:text-white"
                      >
                        APROVAR FORMULÁRIO
                      </button>
                      <button
                        type="button"
                        disabled={rejectLoading || approvalLoading || updateLoading}
                        onClick={() => {
                          // @ts-ignore
                          handleRejectRequest(infoHolder)
                        }}
                        className="h-9 whitespace-nowrap rounded bg-red-800 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-red-800 enabled:hover:text-white"
                      >
                        REPROVAR FORMULÁRIO
                      </button>
                    </>
                  )}
                  {infoHolder.tipoDeServico === 'OPERAÇÃO E MANUTENÇÃO' ? (
                    <Link href={`/adm/contratos/pdf/${requestId}`}>
                      <button
                        type="button"
                        className="flex items-center gap-2 rounded border border-orange-600 px-4 py-2 text-orange-600 duration-300 ease-in-out hover:border-orange-400 hover:text-orange-400"
                      >
                        <FaFile />
                        <p className="text-xs font-bold tracking-tight">TEMPLATE DE CONTRATO</p>
                      </button>
                    </Link>
                  ) : null}
                </div>

                <button
                  type="button"
                  disabled={updateLoading || approvalLoading || rejectLoading}
                  onClick={() => {
                    // @ts-ignore
                    handleRequestUpdate({
                      id: requestId,
                      changes: { ...infoHolder },
                    })
                  }}
                  className="h-9 whitespace-nowrap rounded bg-blue-800 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-blue-800 enabled:hover:text-white"
                >
                  ATUALIZAR FORMULÁRIO
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ContractRequestControlModal
