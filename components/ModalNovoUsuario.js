import axios from 'axios'
import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { equipesTecnicas, routes, vendedores } from '../utils/constants'
import RoutesCard from './RoutesCard'
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  minWidth: '40%',
  height: '87%',
  borderRadius: '10px',
  padding: '10px',
  zIndex: 1000,
}
const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,.7)',
  zIndex: 1000,
}

function formatCPF(value) {
  const cnpjCpf = value.replace(/\D/g, '')

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
  }

  // return cnpjCpf.replace(
  //   /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
  //   "$1.$2.$3/$4-$5"
  // );
}

function ModalNovoUsuario({ closeModal }) {
  const [userInfo, setUserInfo] = useState({
    nome: '',
    email: '',
    password: '',
    accessibleRoutes: [],
  })
  const [message, setMessage] = useState({ text: '', color: '' })
  function resetStates() {
    setUserInfo({
      nome: '',
      email: '',
      password: '',
      accessibleRoutes: [],
    })
  }
  function validateInfo() {
    if (userInfo.nome.trim().length < 5) {
      setMessage({
        text: 'Por favor, adicione um nome válido.',
        color: 'text-red-500',
      })
      return false
    }
    if (userInfo.email.trim().length < 10) {
      setMessage({
        text: 'Por favor, adicione um email válido.',
        color: 'text-red-500',
      })
      return false
    }
    if (userInfo.password.trim().length < 5) {
      setMessage({
        text: 'Por favor, adicione um senha válido.',
        color: 'text-red-500',
      })
      return false
    }
    setMessage({ text: '', color: '' })
    return true
  }
  function addUser() {
    if (validateInfo()) {
      axios
        .post('/api/auth/user', userInfo)
        .then((res) => {
          setMessage({ text: 'Usuário adicionado!', color: 'text-green-500' })
          resetStates()
        })
        .catch((err) =>
          setMessage({
            text: 'Erro ao comunicar com o bando de dados',
            color: 'text-red-500',
          })
        )
    }
  }
  function addRoute(rota) {
    let arr = userInfo.accessibleRoutes
    arr.push(rota)
    setUserInfo({ ...userInfo, accessibleRoutes: [...arr] })
  }
  function removeRoute(index) {
    let arr = userInfo.accessibleRoutes
    arr.splice(index, 1)
    setUserInfo({ ...userInfo, accessibleRoutes: arr })
  }
  return (
    <div style={OVERLAY_STYLES}>
      <div className="w-[90%] lg:w-[40%]" style={MODAL_STYLES}>
        <div className="flex h-full flex-col">
          <div className="border-primary/20 flex justify-between border-b pb-2">
            <h1 className="font-bold text-[#15599a]">NOVO USUÁRIO</h1>
            <button>
              <VscChromeClose
                onClick={() => {
                  setMessage({ text: '', color: '' })
                  closeModal()
                }}
                style={{ color: 'red' }}
              />
            </button>
          </div>
          <div className="overscroll-y scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-primary/20 flex flex-col gap-2 overflow-y-auto py-2">
            <div className="border-primary/20 flex w-full flex-col items-center border py-4">
              <h1 className="text-center font-bold">NOME DO USUÁRIO</h1>
              <input
                type={'text'}
                value={userInfo.nome}
                className="text-primary/80 w-full p-2 text-center text-xs outline-hidden"
                placeholder="Digite aqui o nome do usuário..."
                onChange={(e) => setUserInfo({ ...userInfo, nome: e.target.value })}
              />
            </div>
            <div className="border-primary/20 flex w-full flex-col items-center border py-4">
              <h1 className="text-center font-bold">EMAIL</h1>
              <input
                type={'text'}
                value={userInfo.email}
                className="text-primary/80 w-full p-2 text-center text-xs outline-hidden"
                placeholder="Digite aqui o email do usuário..."
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              />
            </div>
            <div className="border-primary/20 flex w-full flex-col items-center border py-4">
              <h1 className="text-center font-bold">SENHA</h1>
              <input
                type={'text'}
                value={userInfo.password}
                className="text-primary/80 w-full p-2 text-center text-xs outline-hidden"
                placeholder="Digite aqui a senha do usuário.."
                onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
              />
            </div>
            <div className="border-primary/20 flex w-full flex-col items-center border py-4">
              <h1 className="text-center font-bold">CPF</h1>
              <input
                type={'text'}
                value={userInfo.cpf}
                className="text-primary/80 w-full p-2 text-center text-xs outline-hidden"
                placeholder="Digite aqui o CPF do usuário.."
                onChange={(e) => setUserInfo({ ...userInfo, cpf: formatCPF(e.target.value) })}
              />
            </div>
            <div className="border-primary/20 flex w-full flex-col items-center border py-4">
              <h1 className="text-center font-bold">RG</h1>
              <input
                type={'text'}
                value={userInfo.rg}
                className="text-primary/80 w-full p-2 text-center text-xs outline-hidden"
                placeholder="Digite aqui o RG do usuário.."
                onChange={(e) => setUserInfo({ ...userInfo, rg: e.target.value })}
              />
            </div>
            <div className="border-primary/20 flex w-full flex-col items-center border py-4">
              <h1 className="text-center font-bold">CARGO</h1>
              <input
                type={'text'}
                value={userInfo.role}
                className="text-primary/80 w-full p-2 text-center text-xs outline-hidden"
                placeholder="Digite aqui o cargo do usuário.."
                onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })}
              />
            </div>
            <div className="border-primary/20 flex w-full flex-col items-center border py-4">
              <h1 className="text-center font-bold">DATA DE NASCIMENTO</h1>
              <input
                type={'date'}
                value={userInfo.birthday ? new Date(userInfo.birthday).toISOString().slice(0, 10) : 0}
                className="text-primary/80 w-full p-2 text-center text-xs outline-hidden"
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    birthday: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
            </div>
            <div className="border-primary/20 flex w-full flex-col items-center border py-4">
              <h1 className="text-center font-bold">DATA DE ADMISSÃO</h1>
              <input
                type={'date'}
                value={userInfo.admission ? new Date(userInfo.admission).toISOString().slice(0, 10) : 0}
                className="text-primary/80 w-full p-2 text-center text-xs outline-hidden"
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    admission: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
            </div>
            <div className="border-primary/20 flex w-full flex-col items-center border py-4">
              <h1 className="text-center font-bold">ROTAS DISPONÍVEIS</h1>
              <div className="mt-2 grid min-h-[60px] w-full grid-cols-2 gap-2 px-2 lg:grid-cols-3">
                {userInfo.accessibleRoutes?.length > 0 ? (
                  userInfo.accessibleRoutes.map((rota, index) => (
                    <button
                      key={index}
                      onClick={() => removeRoute(index)}
                      className="h-fit w-full cursor-pointer rounded border border-green-500 p-2 text-center font-bold text-green-500 hover:border-red-500 hover:text-red-500"
                    >
                      {rota}
                    </button>
                  ))
                ) : (
                  <p className="text-primary/80 col-span-4 text-center italic">SEM ROTAS ADICIONADAS...</p>
                )}
              </div>
            </div>
            <div className="border-primary/20 flex w-full flex-col items-center border py-4">
              <h1 className="text-center font-bold">ADIÇÃO DE ROTAS</h1>
              <div className="mt-2 grid w-full grid-cols-2 gap-2 px-2 lg:grid-cols-3">
                {routes
                  .filter((x) => !userInfo.accessibleRoutes.includes(x))
                  .map((rota, index) => (
                    <button
                      key={index}
                      onClick={() => addRoute(rota)}
                      className="rounded border border-green-500 p-2 text-xs font-bold text-green-500 uppercase hover:bg-green-500 hover:text-white lg:text-base"
                    >
                      {rota}
                    </button>
                  ))}
              </div>
            </div>
            <div className="border-primary/20 flex w-full flex-col items-center border py-4">
              <h1 className="text-center font-bold">TIPO DE VISUALIZAÇÃO</h1>
              <div className="mt-2 grid w-full grid-cols-2 gap-6 px-2 lg:grid-cols-4 lg:gap-2">
                <button
                  onClick={() =>
                    setUserInfo({
                      ...userInfo,
                      visualizacao: undefined,
                      vendedor: undefined,
                      regional: undefined,
                    })
                  }
                  className={`${userInfo.visualizacao ? 'opacity-30' : ''} w-full rounded border border-[#15599a] p-2 text-center font-bold text-[#15599a]`}
                >
                  GERAL
                </button>
                <button
                  onClick={() =>
                    setUserInfo({
                      ...userInfo,
                      visualizacao: 'VENDEDOR',
                      regional: undefined,
                    })
                  }
                  className={`${userInfo.visualizacao == 'VENDEDOR' ? '' : 'opacity-30'} w-full rounded border border-[#15599a] p-2 text-center font-bold text-[#15599a]`}
                >
                  VENDEDOR
                </button>
                <button
                  onClick={() =>
                    setUserInfo({
                      ...userInfo,
                      visualizacao: 'REGIONAL',
                      vendedor: undefined,
                    })
                  }
                  className={`${userInfo.visualizacao == 'REGIONAL' ? '' : 'opacity-30'} w-full rounded border border-[#15599a] p-2 text-center font-bold text-[#15599a]`}
                >
                  REGIONAL
                </button>
                <button
                  onClick={() =>
                    setUserInfo({
                      ...userInfo,
                      visualizacao: 'INSIDE',
                      regional: undefined,
                    })
                  }
                  className={`${userInfo.visualizacao == 'INSIDE' ? '' : 'opacity-30'} w-full rounded border border-[#15599a] p-2 text-center font-bold text-[#15599a]`}
                >
                  INSIDE
                </button>
                <button
                  onClick={() =>
                    setUserInfo({
                      ...userInfo,
                      visualizacao: 'OBRAS',
                      equipe: 'NÃO DEFINIDO',
                      regional: undefined,
                      vendedor: undefined,
                    })
                  }
                  className={`${userInfo.visualizacao == 'OBRAS' ? '' : 'opacity-30'} w-full rounded border border-[#15599a] p-2 text-center font-bold text-[#15599a]`}
                >
                  OBRAS
                </button>
              </div>
              {userInfo.visualizacao == 'VENDEDOR' && (
                <div className="mt-2 flex w-full flex-col items-center justify-center">
                  <h1 className="text-center font-bold">VENDEDOR</h1>
                  <select
                    value={userInfo.vendedor ? userInfo.vendedor : 'NÃO DEFINIDO'}
                    onChange={(e) => setUserInfo({ ...userInfo, vendedor: e.target.value })}
                    className="text-primary/80 p-2 outline-hidden"
                  >
                    {vendedores.map((vendedor) => (
                      <option key={vendedor.nome} value={vendedor.nome}>
                        {vendedor.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {userInfo.visualizacao == 'INSIDE' && (
                <div className="mt-2 flex w-full flex-col items-center justify-center">
                  <h1 className="text-center font-bold">INSIDER</h1>
                  <select
                    value={userInfo.vendedor ? userInfo.vendedor : 'NÃO DEFINIDO'}
                    onChange={(e) => setUserInfo({ ...userInfo, vendedor: e.target.value })}
                    className="text-primary/80 p-2 outline-hidden"
                  >
                    {vendedores
                      .filter((x) => x.qualificacao?.includes('INSIDE') || x.nome == 'NÃO DEFINIDO')
                      .map((vendedor) => (
                        <option key={vendedor.nome} value={vendedor.nome}>
                          {vendedor.nome}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              {userInfo.visualizacao == 'REGIONAL' && (
                <div className="mt-2 flex w-full flex-col items-center justify-center">
                  <h1 className="text-center font-bold">REGIONAL</h1>
                  <select
                    value={userInfo.regional ? userInfo.regional : 'NÃO DEFINIDO'}
                    onChange={(e) => setUserInfo({ ...userInfo, regional: e.target.value })}
                    className="text-primary/80 p-2 outline-hidden"
                  >
                    <option value={'REGIONAL ITUIUTABA'}>REGIONAL ITUIUTABA</option>
                    <option value={'REGIONAL UBERLÂNDIA'}>REGIONAL UBERLÂNDIA</option>
                    <option value={'NÃO DEFINIDO'}>NÃO DEFINIDO</option>
                  </select>
                </div>
              )}
              {userInfo.visualizacao == 'OBRAS' ? (
                <div className="mt-2 flex w-full flex-col items-center justify-center">
                  <h1 className="text-center font-bold">EQUIPE TÉCNICA</h1>
                  <select
                    value={userInfo.equipe ? userInfo.equipe : 'NÃO DEFINIDO'}
                    onChange={(e) => setUserInfo({ ...userInfo, equipe: e.target.value })}
                    className="text-primary/80 p-2 outline-hidden"
                  >
                    {equipesTecnicas.map((equipe, index) => (
                      <option key={index} value={equipe.value}>
                        {equipe.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
            {message.text && <p className={`my-2 text-center italic ${message.color}`}>{message.text}</p>}
            <button
              onClick={addUser}
              className="w-fit self-center rounded border border-green-500 p-2 text-center font-bold text-green-500 hover:bg-green-500 hover:text-white"
            >
              CRIAR USUÁRIO
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalNovoUsuario
