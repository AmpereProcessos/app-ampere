import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ModalSolicitacaoVendas from '../../components/ModalSolicitacaoVendas'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from '../../components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'
function FormulariosVendedor() {
  const router = useRouter()
  const { session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })
  const [forms, setForms] = useState([])
  const [filteredForms, setFilteredForms] = useState([])
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalSolicitacao, setModalSolicitacao] = useState({})
  function getProjects(credenciais) {
    axios
      .post('/api/solicitacoes/byVendedor', {
        vendedor: credenciais.vendedor,
        tipo: 'CONTRATO',
      })
      .then((res) => {
        setForms(res.data)
        setFilteredForms(res.data)
      })
  }
  function handleUpdates(id) {
    getProjects(session?.user)
    let changedObj = forms.filter((project) => project._id == id)
    setModalSolicitacao(changedObj[0])
  }

  function getCardColor(statusAprovacao) {
    if (statusAprovacao == true) {
      return 'bg-green-100'
    } else if (statusAprovacao == false) {
      return 'bg-red-100'
    } else {
      return 'bg-[#fff]'
    }
  }
  useEffect(() => {
    if (session?.user.permissoes.rotas.includes('Vendas')) {
      getProjects(session.user)
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])
  console.log(modalSolicitacao)
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="flex grow flex-col bg-[#fff] p-6">
        <div className="flex border-b border-gray-300">
          <h1 className="text-xl font-bold text-[#15599a]">SEUS FORMULÁRIOS DE SOLICITAÇÃO DE CONTRATO</h1>
        </div>
        <div className="mt-4 flex flex-wrap justify-around gap-3">
          {filteredForms.map((solicitacao) => (
            <div
              key={solicitacao._id}
              onClick={() => {
                setModalIsOpen(true)
                setModalSolicitacao(solicitacao)
              }}
              className={`flex flex-col ${getCardColor(solicitacao.aprovacao)} w-[250px] cursor-pointer border border-gray-300 p-3 hover:bg-blue-100 lg:w-[450px]`}
            >
              <div className="flex justify-center">
                <h1 className="text-xs font-bold text-[#15599a]">{solicitacao.nomeDoContrato}</h1>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xxs">VENDEDOR</span>
                  <p className="text-xs text-gray-600">{solicitacao.nomeVendedor && solicitacao.nomeVendedor}</p>
                </div>
                <div>
                  <span className="text-xxs">CIDADE</span>
                  <p className="text-xs text-gray-600">{solicitacao.cidade ? solicitacao.cidade : '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/publico/formSolicitacao">
          <div className="left-150 fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
            <p className="text-sm font-bold uppercase">CRIAR SOLICITAÇÃO</p>
          </div>
        </Link>
        {modalIsOpen && (
          <ModalSolicitacaoVendas
            editable={modalSolicitacao.aprovacao == false}
            info={modalSolicitacao}
            setModalIsOpen={setModalIsOpen}
            handleUpdates={handleUpdates}
          />
        )}
      </div>
    )
  }
}

export default FormulariosVendedor
