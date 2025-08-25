import React, { useEffect, useState } from 'react'
import ModalNovaOperacao from '../../components/ModalNovaOperacao'
import { useSession } from '../../components/providers/SessionProvider'
import { useRouter } from 'next/router'
import axios from 'axios'
import { FiEdit } from 'react-icons/fi'
import { TbActivity, TbExternalLink } from 'react-icons/tb'
import { AiOutlineCalendar } from 'react-icons/ai'
import { BsCalendarCheckFill } from 'react-icons/bs'
import dayjs from 'dayjs'
import { FaProjectDiagram } from 'react-icons/fa'
import LoadingPage from '../../components/utils/LoadingPage'
import ModalEdicaoOperacao from '../../components/ModalEdicaoOperacao'
import ModalControlOperacao from '../../components/ModalControlOperacao'
import Link from 'next/link'

function Operacoes() {
  const router = useRouter()
  const { session, status } = useSession({ required: true })
  const [operations, setOperations] = useState()
  const [newOperationModalIsOpen, setNewOperationModalIsOpen] = useState(false)
  const [operationModal, setOperationModal] = useState({
    editIsOpen: false,
    controlIsOpen: false,
    info: null,
  })
  async function getOperations(equipe) {
    try {
      const { data } = await axios.get(`/api/operacoes?equipe=${equipe}`)
      console.log(data)
      setOperations(data)
    } catch (error) {
      alert('Houve um erro no carregamento das operações. Por favor, tente novamente mais tarde.')
    }
  }

  useEffect(() => {
    if (session?.user.permissoes.execucao.editar || session?.user.visualizacao.tipo == 'EXECUÇÃO') {
      if (!operations) {
        getOperations(session.user.visualizacao.referencia)
      }
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])
  console.log(session)
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="flex grow flex-col p-6">
        <div className="border-primary/20 flex flex-col border-b p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-wrap items-center justify-center gap-2 font-['Roboto']">
              <p className="text-center text-2xl font-bold text-[#15599a] uppercase">OPERAÇÕES E OUTROS PROJETOS</p>
            </div>
          </div>
        </div>
        <div className="flex grow flex-wrap justify-around py-2">
          {operations ? (
            operations.length > 0 ? (
              operations?.map((operation, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setOperationModal((prev) => ({
                      ...prev,
                      controlIsOpen: true,
                      info: operation,
                    }))
                  }}
                  className="border-primary/20 flex h-[250px] w-[450px] cursor-pointer flex-col border p-3 shadow-lg"
                >
                  <div className="flex w-full justify-between">
                    <div></div>
                    <h1 className="w-full text-center text-lg font-medium">{operation.nome}</h1>
                    <div className="flex items-center gap-2">
                      <Link href={`/operacoes/calendario/${operation._id}`}>
                        <div onClick={(e) => e.stopPropagation()} className="text-[#15599a] duration-300 ease-in-out hover:scale-105">
                          <TbExternalLink
                            style={{
                              fontSize: '26px',
                              cursor: 'pointer',
                            }}
                          />
                        </div>
                      </Link>

                      {session?.user.permissoes.execucao.editar ? (
                        <div
                          onClick={() =>
                            setOperationModal((prev) => ({
                              ...prev,
                              editIsOpen: true,
                              info: operation,
                            }))
                          }
                          className="text-[#fead61] duration-300 ease-in-out hover:scale-105"
                        >
                          <FiEdit style={{ fontSize: '20px', cursor: 'pointer' }} />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <h1 className="text-primary/60 text-start text-xs font-medium">INÍCIO</h1>
                      <div className="flex items-center gap-2">
                        <AiOutlineCalendar style={{ color: '#15599a', fontSize: '20px' }} />
                        <h1 className="text-primary/70 text-xs font-medium lg:text-base">
                          {operation.dataInicio ? dayjs(operation.dataInicio).format('DD/MM/YY') : null}
                        </h1>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <h1 className="text-primary/60 text-end text-xs font-medium">PREVISÃO DE CONCLUSÃO</h1>
                      <div className="flex items-center justify-end gap-2">
                        {operation.previsaoConclusao ? (
                          <>
                            <BsCalendarCheckFill style={{ color: 'rgb(249,115,22)' }} />
                            <h1 className="text-primary/70 text-xs font-medium lg:text-base">
                              {dayjs(operation.previsaoConclusao).format('DD/MM/YY HH:mm')}
                            </h1>
                          </>
                        ) : (
                          <h1 className="text-primary/70 text-xs font-medium lg:text-base">NÃO DEFINIDO</h1>
                        )}
                      </div>
                    </div>
                  </div>
                  <h1 className="mt-3 w-full text-center text-sm font-medium">ATIVIDADES</h1>
                  {operation.atividades.map((activity, subIndex) => (
                    <div key={subIndex} className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <TbActivity />
                        <p className="text-primary/60 text-xs">{activity.nome}</p>
                      </div>
                      {activity.subAtividades ? (
                        <div className="flex items-center gap-2">
                          <FaProjectDiagram style={{ color: '#15599a' }} />
                          <p className="text-primary/60 text-xs">+ {activity.subAtividades.length}</p>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="flex grow items-center justify-center">
                <p className="text-primary/60 italic">
                  {session.user.visualizacao.referencia ? 'Nenhuma operação encontrada vinculada a sua equipe.' : 'Nenhuma operação encontrada.'}
                </p>
              </div>
            )
          ) : (
            <LoadingPage />
          )}
        </div>
        {session.user.permissoes.execucao.editar ? (
          <div
            onClick={() => setNewOperationModalIsOpen(true)}
            className="fixed bottom-10 left-150 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]"
          >
            <p className="text-sm font-bold uppercase">NOVA OPERAÇÃO</p>
          </div>
        ) : null}

        {operationModal.controlIsOpen && operationModal.info ? (
          <ModalControlOperacao
            isOpen={operationModal.controlIsOpen}
            setModalIsOpen={() =>
              setOperationModal((prev) => ({
                controlIsOpen: false,
                editIsOpen: false,
                info: null,
              }))
            }
            operation={operationModal.info}
          />
        ) : null}
        {operationModal.editIsOpen && operationModal.info ? (
          <ModalEdicaoOperacao
            isOpen={operationModal.editIsOpen}
            setModalIsOpen={() =>
              setOperationModal((prev) => ({
                controlIsOpen: false,
                editIsOpen: false,
                info: null,
              }))
            }
            operation={operationModal.info}
          />
        ) : null}
        {newOperationModalIsOpen ? <ModalNovaOperacao isOpen={newOperationModalIsOpen} setModalIsOpen={setNewOperationModalIsOpen} /> : null}
      </div>
    )
  }
}

export default Operacoes
