import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { VscChromeClose } from 'react-icons/vsc'
import { storage } from '../utils/services/firebase/firebase-storage'
import { BsCheckLg } from 'react-icons/bs'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import axios from 'axios'
import { equipesTecnicas, routes, vendedores } from '../utils/constants'
import SaveButton from './utils/Buttons/SaveButton'
import { FaSave } from 'react-icons/fa'
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  minWidth: '40%',
  height: '87%',
  borderRadius: '5px',
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
function ModalEdicaoUsuario({ closeModal, userInfo, getUsers }) {
  const [msg, setMsg] = useState({ text: '', color: '' })
  const [info, setInfo] = useState(userInfo)
  const [image, setImage] = useState()
  async function uploadImage() {
    var splitNome = info.nome.toLowerCase().split(' ')
    var fixedNome = splitNome.join('_')
    var imageRef = ref(storage, `usuarios/avatar-${fixedNome}`)
    let res = await uploadBytes(imageRef, image)
    let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
    return url
  }
  async function saveChanges() {
    if (image) {
      var url = await uploadImage()
    }
    axios
      .put(`/api/auth/user`, {
        id: userInfo._id,
        changes: { ...info, avatar_url: url ? url : info.avatar_url },
      })
      .then((res) => {
        setMsg({ text: 'Alterações feitas!', color: 'text-green-500' })
        setTimeout(() => {
          setMsg({ text: '', color: '' })
        }, 2500)
        getUsers()
      })
      .catch((err) =>
        setMsg({
          text: 'Um erro ocorreu na alteração de informações.',
          color: 'text-red-500',
        })
      )
  }
  function addRoute(rota) {
    let arr = info.accessibleRoutes
    arr.push(rota)
    setInfo({ ...info, accessibleRoutes: [...arr] })
  }
  function removeRoute(index) {
    let arr = info.accessibleRoutes
    arr.splice(index, 1)
    setInfo({ ...info, accessibleRoutes: arr })
  }
  useEffect(() => {
    // create the preview
    if (image) {
      const objectUrl = URL.createObjectURL(image)
      setInfo({ ...info, avatar_url: objectUrl })

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [image])
  console.log(info)
  console.log('IMAGE', image)
  return (
    <div style={OVERLAY_STYLES}>
      <div className="w-[90%] lg:w-[40%]" style={MODAL_STYLES}>
        <div className="flex h-full flex-col">
          <div className="border-primary/20 flex w-full justify-between border-b pb-2">
            <h1 className="self-start text-center font-bold text-[#15599a]">ALTERAÇÃO DE INFORMAÇÕES</h1>
            <div className="flex h-full items-center justify-center self-end">
              <button className="flex items-center justify-center transition duration-300 ease-in-out hover:scale-125">
                <VscChromeClose
                  onClick={() => {
                    closeModal()
                  }}
                  style={{ color: 'red' }}
                />
              </button>
            </div>
          </div>
          <div className="overscroll-y scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-primary/20 flex h-full flex-col gap-2 overflow-y-auto px-3 py-4">
            <div className="flex h-[200px] items-center justify-center">
              {!image && info.avatar_url ? (
                <div className="relative mb-3 h-[120px] w-[120px] cursor-pointer rounded-full">
                  <Image
                    src={info.avatar_url}
                    // width={96}
                    // height={96}
                    fill={true}
                    layout={'fill'}
                    style={{
                      borderRadius: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                    }}
                  />
                  <input onChange={(e) => setImage(e.target.files[0])} className="h-full w-full opacity-0" type="file" />
                </div>
              ) : image ? (
                <div className="relative mb-3 h-[120px] w-[120px] cursor-pointer rounded-full">
                  <Image
                    src={info.avatar_url}
                    // width={96}
                    // height={96}
                    fill={true}
                    layout={'fill'}
                    style={{
                      borderRadius: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                    }}
                  />
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    className="h-full w-full opacity-0"
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </div>
              ) : (
                <div className="border-primary/20 relative flex h-[120px] w-[120px] items-center justify-center rounded-full border bg-gray-200">
                  {image?.name ? (
                    <div className="absolute flex items-center justify-center">
                      <BsCheckLg style={{ color: 'green', fontSize: '25px' }} />
                    </div>
                  ) : (
                    <p className="text-primary/70 absolute w-full text-center text-xs font-bold">ESCOLHA UMA IMAGEM</p>
                  )}

                  <input onChange={(e) => setImage(e.target.files[0])} className="h-full w-full opacity-0" type="file" accept=".png, .jpeg" />
                </div>
              )}
            </div>
            <div className="group relative z-0 mb-6 w-full">
              <input
                value={info.nome}
                onChange={(e) => setInfo({ ...info, nome: e.target.value })}
                type="text"
                name="name"
                id="name"
                className="dark:border-primary/80 peer border-primary/20 block w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden dark:text-white dark:focus:border-blue-500"
                placeholder=" "
                required
              />
              <label
                htmlFor="name"
                className="text-primary/60 absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 dark:peer-focus:text-blue-500"
              >
                NOME
              </label>
            </div>
            <div className="group relative z-0 mb-6 w-full">
              <input
                value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                type="email"
                name="floating_email"
                id="floating_email"
                className="dark:border-primary/80 peer border-primary/20 block w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden dark:text-white dark:focus:border-blue-500"
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_email"
                className="text-primary/60 absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 dark:peer-focus:text-blue-500"
              >
                EMAIL
              </label>
            </div>
            <div className="group relative z-0 mb-6 w-full">
              <input
                value={info.password}
                onChange={(e) => setInfo({ ...info, password: e.target.value })}
                type="text"
                name="password"
                id="password"
                className="dark:border-primary/80 peer border-primary/20 block w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden dark:text-white dark:focus:border-blue-500"
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                className="text-primary/60 absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 dark:peer-focus:text-blue-500"
              >
                SENHA
              </label>
            </div>
            <div className="group relative z-0 mb-6 w-full">
              <input
                value={info.cpf}
                onChange={(e) => setInfo({ ...info, cpf: formatCPF(e.target.value) })}
                type="text"
                name="cpf"
                id="cpf"
                className="dark:border-primary/80 peer border-primary/20 block w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden dark:text-white dark:focus:border-blue-500"
                placeholder=" "
              />
              <label
                htmlFor="cpf"
                className="text-primary/60 absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 dark:peer-focus:text-blue-500"
              >
                CPF
              </label>
            </div>
            <div className="group relative z-0 mb-6 w-full">
              <input
                value={info.rg}
                onChange={(e) => setInfo({ ...info, rg: e.target.value })}
                type="text"
                name="rg"
                id="rg"
                className="dark:border-primary/80 peer border-primary/20 block w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden dark:text-white dark:focus:border-blue-500"
                placeholder=" "
              />
              <label
                htmlFor="rg"
                className="text-primary/60 absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 dark:peer-focus:text-blue-500"
              >
                RG
              </label>
            </div>
            <div className="group relative z-0 mb-6 w-full">
              <input
                value={info.role}
                onChange={(e) => setInfo({ ...info, role: e.target.value })}
                type="text"
                name="rg"
                id="rg"
                className="dark:border-primary/80 peer border-primary/20 block w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden dark:text-white dark:focus:border-blue-500"
                placeholder=" "
              />
              <label
                htmlFor="rg"
                className="text-primary/60 absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 dark:peer-focus:text-blue-500"
              >
                CARGO
              </label>
            </div>
            <div className="flex w-full flex-col">
              <label className="text-primary/60 text-sm">DATA DE NASCIMENTO</label>
              <input
                value={info.birthday ? new Date(info.birthday).toISOString().slice(0, 10) : 0}
                onChange={(e) =>
                  setInfo({
                    ...info,
                    birthday: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
                type={'date'}
                className="peer border-primary/20 block w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden"
              />
            </div>
            <div className="flex w-full flex-col">
              <label className="text-primary/60 text-sm">DATA DE ADMISSÃO</label>
              <input
                value={info.admission ? new Date(info.admission).toISOString().slice(0, 10) : 0}
                onChange={(e) =>
                  setInfo({
                    ...info,
                    admission: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
                type={'date'}
                className="peer border-primary/20 block w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-hidden"
              />
            </div>
            <div className="border-primary/20 flex w-full flex-col items-center border py-4">
              <h1 className="text-center font-bold">ROTAS DISPONÍVEIS</h1>
              <div className="mt-2 grid min-h-[60px] w-full grid-cols-2 gap-2 px-2 lg:grid-cols-3">
                {info.accessibleRoutes?.length > 0 ? (
                  info.accessibleRoutes.map((rota, index) => (
                    <button
                      key={index}
                      onClick={() => removeRoute(index)}
                      className="h-fit w-full cursor-pointer rounded border border-green-500 p-2 text-center font-bold text-green-500 uppercase hover:border-red-500 hover:text-red-500"
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
                  .filter((x) => !info.accessibleRoutes.includes(x))
                  .map((rota, index) => (
                    <button
                      key={index}
                      onClick={() => addRoute(rota)}
                      className="w-full rounded border border-green-500 p-2 text-xs font-bold text-green-500 uppercase hover:bg-green-500 hover:text-white lg:text-base"
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
                    setInfo({
                      ...info,
                      visualizacao: undefined,
                      vendedor: undefined,
                      regional: undefined,
                    })
                  }
                  className={`${info.visualizacao ? 'opacity-30' : ''} w-full rounded border border-[#15599a] p-2 text-center font-bold text-[#15599a]`}
                >
                  GERAL
                </button>
                <button
                  onClick={() =>
                    setInfo({
                      ...info,
                      visualizacao: 'VENDEDOR',
                      regional: undefined,
                    })
                  }
                  className={`${info.visualizacao == 'VENDEDOR' ? '' : 'opacity-30'} w-full rounded border border-[#15599a] p-2 text-center font-bold text-[#15599a]`}
                >
                  VENDEDOR
                </button>
                <button
                  onClick={() =>
                    setInfo({
                      ...info,
                      visualizacao: 'REGIONAL',
                      vendedor: undefined,
                    })
                  }
                  className={`${info.visualizacao == 'REGIONAL' ? '' : 'opacity-30'} w-full rounded border border-[#15599a] p-2 text-center font-bold text-[#15599a]`}
                >
                  REGIONAL
                </button>
                <button
                  onClick={() =>
                    setInfo({
                      ...info,
                      visualizacao: 'INSIDE',
                      regional: undefined,
                    })
                  }
                  className={`${info.visualizacao == 'INSIDE' ? '' : 'opacity-30'} w-full rounded border border-[#15599a] p-2 text-center font-bold text-[#15599a]`}
                >
                  INSIDE
                </button>
                <button
                  onClick={() =>
                    setInfo({
                      ...info,
                      visualizacao: 'OBRAS',
                      equipe: 'NÃO DEFINIDO',
                      regional: undefined,
                      vendedor: undefined,
                    })
                  }
                  className={`${info.visualizacao == 'OBRAS' ? '' : 'opacity-30'} w-full rounded border border-[#15599a] p-2 text-center font-bold text-[#15599a]`}
                >
                  OBRAS
                </button>
              </div>
              {info.visualizacao == 'VENDEDOR' && (
                <div className="mt-2 flex w-full flex-col items-center justify-center">
                  <h1 className="text-center font-bold">VENDEDOR</h1>
                  <select
                    value={info.vendedor ? info.vendedor : 'NÃO DEFINIDO'}
                    onChange={(e) => setInfo({ ...info, vendedor: e.target.value })}
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
              {info.visualizacao == 'INSIDE' && (
                <div className="mt-2 flex w-full flex-col items-center justify-center">
                  <h1 className="text-center font-bold">INSIDER</h1>
                  <select
                    value={info.vendedor ? info.vendedor : 'NÃO DEFINIDO'}
                    onChange={(e) => setInfo({ ...info, vendedor: e.target.value })}
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
              {info.visualizacao == 'REGIONAL' && (
                <div className="mt-2 flex w-full flex-col items-center justify-center">
                  <h1 className="text-center font-bold">REGIONAL</h1>
                  <select
                    value={info.regional ? info.regional : 'NÃO DEFINIDO'}
                    onChange={(e) => setInfo({ ...info, regional: e.target.value })}
                    className="text-primary/80 p-2 outline-hidden"
                  >
                    <option value={'REGIONAL ITUIUTABA'}>REGIONAL ITUIUTABA</option>
                    <option value={'REGIONAL UBERLÂNDIA'}>REGIONAL UBERLÂNDIA</option>
                    <option value={'NÃO DEFINIDO'}>NÃO DEFINIDO</option>
                  </select>
                </div>
              )}
              {info.visualizacao == 'OBRAS' ? (
                <div className="mt-2 flex w-full flex-col items-center justify-center">
                  <h1 className="text-center font-bold">EQUIPE TÉCNICA</h1>
                  <select
                    value={info.equipe ? info.equipe : 'NÃO DEFINIDO'}
                    onChange={(e) => setInfo({ ...info, equipe: e.target.value })}
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
            {msg.text ? (
              <p className={`text-center text-xs italic ${msg.color}`}>{msg.text}</p>
            ) : (
              <div className="flex items-center justify-center">
                <SaveButton text={'SALVAR'} icon={<FaSave />} handleClick={saveChanges} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalEdicaoUsuario
