import dayjs from 'dayjs'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { FaUser } from 'react-icons/fa'
import { BsCheck, BsCheckAll } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { IoIosSend } from 'react-icons/io'
import { storage } from '../../../utils/services/firebase/firebase-storage'
import axios from 'axios'
import { useSession } from '../../../components/providers/SessionProvider'
import { useRouter } from 'next/router'
import connectToDatabase from '../../../utils/services/mongodb/users'
import { ObjectId } from 'mongodb'
import LoadingPage from '../../../components/utils/LoadingPage'

function MeuPerfil({ error, info }) {
  const router = useRouter()
  const { session, status } = useSession({
    required: true,
  })
  if (status != 'authenticated') return <LoadingPage />

  const [not, setNot] = useState()
  const [notifyInfo, setNotifyInfo] = useState({
    destinatario: null,
    remetente: session.user.nome,
    remetenteId: session?.user?.id,
    mensagem: '',
    projetoReferencia: null,
    nomeDoProjeto: null,
  })
  const [notifyMsg, setNotifyMsg] = useState({ text: '', color: '' })

  const [infoHolder, setInfo] = useState(info)
  const [newImage, setNewImage] = useState()
  const [msg, setMsg] = useState({ text: '', color: '' })

  // Regarding Image
  async function uploadImage() {
    var splitNome = info.nome.toLowerCase().split(' ')
    var fixedNome = splitNome.join('_')
    var imageRef = ref(storage, `usuarios/avatar-${fixedNome}`)
    let res = await uploadBytes(imageRef, newImage)
    let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
    return url
  }
  async function saveChanges() {
    if (newImage) {
      var url = await uploadImage()
    }
    axios
      .put(`/api/auth/user`, {
        id: info._id,
        changes: { ...info, avatar_url: url ? url : info.avatar_url },
      })
      .then((res) => {
        setMsg({ text: 'Alterações feitas!', color: 'text-green-500' })
        setTimeout(() => {
          setMsg({ text: '', color: '' })
        }, 2500)
      })
      .catch((err) =>
        setMsg({
          text: 'Um erro ocorreu na alteração de informações.',
          color: 'text-red-500',
        })
      )
  }
  // Regarding Notifications
  function getNotificacoes(id) {
    axios.get(`/api/notificacoes/${id}`).then((res) => setNot(res.data))
  }
  function notify() {
    if (notifyInfo.mensagem?.trim().length > 0) {
      axios
        .post('/api/notificacoes/1', notifyInfo)
        .then((res) => {
          setNotifyMsg({
            text: 'Mensagem enviada!',
            color: 'text-green-500',
          })
          setTimeout(() => {
            setNotifyInfo({
              destinatario: null,
              remetente: session.user.nome,
              remetenteId: session?.user?.id,
              mensagem: '',
              projetoReferencia: null,
              nomeDoProjeto: null,
            })
          }, 2800)
        })
        .catch((err) =>
          setNotifyMsg({
            text: 'Houve um erro no envio.',
            color: 'text-red-500',
          })
        )
    } else {
      setNotifyMsg({
        text: 'Por favor, preencha uma mensagem válida.',
        color: 'text-red-500',
      })
    }
  }
  function updateNotifications(id) {
    axios
      .put('/api/notificacoes/1', {
        id: id,
      })
      .then((res) => getNotificacoes(session?.user?.id))
  }
  function setAsRead(id, index) {
    let arr = [...not]
    arr[index].lido = true
    setNot([...arr])
    updateNotifications(id)
    getNotificacoes(session?.user?.id)
  }

  useEffect(() => {
    // create the preview
    if (newImage) {
      const objectUrl = URL.createObjectURL(newImage)
      setInfo({ avatar_url: objectUrl })

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [newImage])
  useEffect(() => {
    if (!error) {
      getNotificacoes(info._id)
    }
  }, [session])

  if (error) {
    return (
      <div className="flex grow flex-col items-center justify-center">
        <p className="text-primary/70 text-4xl uppercase">{error}</p>
      </div>
    )
  } else {
    return (
      <div className="bg-background flex grow flex-col items-center">
        <div className="bg-primary/80 flex h-[80px] w-full items-center justify-between p-2">
          <div className="flex w-[100px] items-center justify-center text-white">
            <RiArrowGoBackFill onClick={() => router.push('/')} style={{ fontSize: '30px' }} />
          </div>
          <h1 className="text-center font-bold text-white">MEU PERFIL</h1>
          <div className="w-[100px]"></div>
        </div>
        <div className="grid w-full grid-cols-1 grid-rows-10 gap-y-4 p-6 lg:grid-cols-10 lg:grid-rows-1 lg:gap-2 xl:w-[70%]">
          <div className="border-primary/20 row-span-1 flex min-h-[350px] w-full items-center justify-center rounded-md border p-4 shadow-lg lg:col-span-2">
            <div className="flex flex-col items-center">
              <div className="relative mb-3 h-[150px] w-[150px] rounded-full">
                {!newImage && info.avatar_url ? (
                  <>
                    <Image
                      src={infoHolder.avatar_url}
                      // width={96}
                      // height={96}
                      fill={true}
                      layout={'fill'}
                      style={{ borderRadius: '100%' }}
                    />
                    <div className="absolute flex h-[150px] w-[150px] items-center justify-center rounded-full bg-gray-400 opacity-0 hover:opacity-60">
                      <input
                        onChange={(e) => setNewImage(e.target.files[0])}
                        className="h-full w-full opacity-0"
                        type="file"
                        accept="image/png, image/jpeg"
                      />
                      <p className="absolute translate-x-[-10%] translate-y-[-10%] font-bold text-white">Editar</p>
                    </div>
                  </>
                ) : newImage ? (
                  <>
                    <Image
                      src={infoHolder.avatar_url}
                      // width={96}
                      // height={96}
                      fill={true}
                      layout={'fill'}
                      style={{ borderRadius: '100%' }}
                    />
                    <div className="absolute flex h-[150px] w-[150px] items-center justify-center rounded-full bg-gray-400 opacity-0 hover:opacity-60">
                      <input
                        onChange={(e) => setNewImage(e.target.files[0])}
                        className="h-full w-full opacity-0"
                        type="file"
                        accept="image/png, image/jpeg"
                      />
                      <p className="absolute translate-x-[-10%] translate-y-[-10%] font-bold text-white">Editar</p>
                    </div>
                  </>
                ) : (
                  <div className="bg-primary/80 relative flex h-[150px] w-[150px] items-center justify-center rounded-full">
                    <FaUser style={{ color: 'white', fontSize: '35px' }} />
                    <div className="absolute flex h-[150px] w-[150px] items-center justify-center rounded-full bg-gray-400 opacity-0 hover:opacity-60">
                      <input
                        onChange={(e) => setNewImage(e.target.files[0])}
                        className="h-full w-full opacity-0"
                        type="file"
                        accept="image/png, image/jpeg"
                      />
                      <p className="absolute translate-x-[-10%] translate-y-[-10%] font-bold text-white">Editar</p>
                    </div>
                  </div>
                )}
              </div>
              <h1 className="text-primary/70 text-2xl font-bold">{info.nome}</h1>
              <h1 className="text-primary/60 text-sm font-bold">{info.role}</h1>
              {msg.text ? <p className={`text-center italic ${msg.color} text-xs`}>{msg.text}</p> : null}
              {newImage ? (
                <button
                  onClick={saveChanges}
                  className="mt-4 rounded-lg border border-blue-500 p-2 font-bold text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  Salvar
                </button>
              ) : null}
            </div>
          </div>
          <div className="border-primary/20 row-span-9 flex min-h-[350px] flex-col rounded-md border p-4 shadow-lg lg:col-span-8">
            <h1 className="border-b border-[#15599a] pb-2 text-center text-xl font-bold text-[#15599a]">INFORMAÇÕES DO USUÁRIO</h1>
            <div className="flex grow flex-col gap-4 pt-2">
              <div className="border-primary/20 grid w-full grid-cols-1 grid-rows-2 items-center gap-2 border-b py-2 lg:grid-cols-10 lg:grid-rows-1">
                <p className="lg:text-md text-primary/70 col-span-1 text-center text-sm font-bold lg:col-span-3 lg:text-start">NOME:</p>
                <p className="text-primary/60 text-center lg:col-span-7 lg:text-start">{info.nome}</p>
              </div>
              <div className="border-primary/20 grid w-full grid-cols-1 grid-rows-2 items-center gap-2 border-b py-2 lg:grid-cols-10 lg:grid-rows-1">
                <p className="lg:text-md text-primary/70 col-span-1 text-center text-sm font-bold lg:col-span-3 lg:text-start">EMAIL:</p>
                <p className="text-primary/60 text-center lg:col-span-7 lg:text-start">{info.email}</p>
              </div>
              <div className="border-primary/20 grid w-full grid-cols-1 grid-rows-2 items-center gap-2 border-b py-2 lg:grid-cols-10 lg:grid-rows-1">
                <p className="lg:text-md text-primary/70 col-span-1 text-center text-sm font-bold lg:col-span-3 lg:text-start">
                  AVATAR DISPONÍVEL EM:
                </p>
                <a
                  href={info.avatar_url}
                  className="text-primary/60 cursor-pointer text-center break-words hover:text-blue-300 lg:col-span-7 lg:text-start"
                >
                  {info.avatar_url ? info.avatar_url : '-'}
                </a>
              </div>
              <div className="border-primary/20 grid w-full grid-cols-1 grid-rows-2 items-center gap-2 border-b py-2 lg:grid-cols-10 lg:grid-rows-1">
                <p className="lg:text-md text-primary/70 col-span-1 text-center text-sm font-bold lg:col-span-3 lg:text-start">DATA DE NASCIMENTO:</p>
                <p className="text-primary/60 text-center lg:col-span-7 lg:text-start">
                  {info.birthday ? dayjs(info.birthday).add(4, 'hours').format('DD/MM/YYYY') : '-'}
                </p>
              </div>
              <div className="border-primary/20 grid w-full grid-cols-1 grid-rows-2 items-center gap-2 border-b py-2 lg:grid-cols-10 lg:grid-rows-1">
                <p className="lg:text-md text-primary/70 col-span-1 text-center text-sm font-bold lg:col-span-3 lg:text-start">RG</p>
                <p className="text-primary/60 text-center lg:col-span-7 lg:text-start">{info.rg ? info.rg : 'AINDA NÃO DEFINIDO'}</p>
              </div>
              <div className="border-primary/20 grid w-full grid-cols-1 grid-rows-2 items-center gap-2 border-b py-2 lg:grid-cols-10 lg:grid-rows-1">
                <p className="lg:text-md text-primary/70 col-span-1 text-center text-sm font-bold lg:col-span-3 lg:text-start">CPF</p>
                <p className="text-primary/60 text-center lg:col-span-7 lg:text-start">{info.cpf ? info.cpf : 'AINDA NÃO DEFINIDO'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 grid-rows-10 gap-y-4 p-6 lg:grid-cols-10 lg:grid-rows-1 lg:gap-2 xl:w-[70%]">
          <div className="border-primary/20 row-span-1 flex max-h-[850px] min-h-[350px] w-full flex-col items-center rounded-md border p-4 shadow-lg lg:col-span-2">
            <h1 className="border-primary/20 text-primary/70 border-b pb-2 text-xl font-bold">ROTAS ACESSÍVEIS</h1>
            <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 my-2 flex w-full grow flex-col gap-2 overflow-y-auto">
              {info.accessibleRoutes.map((route, index) => (
                <p key={index} className="w-full rounded-lg border-2 border-[#fead61] p-2 text-center font-bold text-[#fead61] uppercase">
                  {route}
                </p>
              ))}
            </div>
          </div>
          <div className="border-primary/20 row-span-9 flex max-h-[850px] min-h-[350px] flex-col rounded-md border p-4 shadow-lg lg:col-span-8">
            <h1 className="border-b border-[#15599a] pb-2 text-center text-xl font-bold text-[#15599a]">NOTIFICAÇÕES</h1>
            {notifyInfo.destinatario && (
              <div className="my-2 flex w-full flex-col items-center">
                <h1 className="text-center text-xs text-[#15599a] italic">
                  Informações para resposta sobre o projeto: <strong>{notifyInfo.projetoReferencia}</strong>
                </h1>
                <div className="flex w-full flex-col">
                  <input
                    type={'text'}
                    className="text-primary/80 w-full text-center text-xs outline-hidden"
                    placeholder="Digite aqui a mensagem a ser enviada..."
                    value={notifyInfo.mensagem}
                    onChange={(e) => setNotifyInfo({ ...notifyInfo, mensagem: e.target.value })}
                  />
                </div>
                {notifyMsg && <p className={`my-1 text-center text-xs ${notifyMsg.color}`}>{notifyMsg.text}</p>}
                <button onClick={notify} className="mt-2 rounded-lg bg-blue-200 p-1 hover:bg-blue-600 hover:text-white">
                  <IoIosSend style={{ fontSize: '15px' }} />
                </button>
              </div>
            )}
            <div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex max-w-full grow flex-col overflow-y-auto overscroll-y-auto">
              {not ? (
                not.length > 0 ? (
                  not.map((notificacao, index) => (
                    <div
                      key={notificacao._id}
                      className={` ${
                        notificacao.lido
                          ? 'border-primary/20 dark:hover:bg-primary/10 flex max-w-full flex-col border-b bg-green-100 p-1 hover:bg-blue-100'
                          : 'border-primary/20 dark:hover:bg-primary/10 flex max-w-full flex-col border-b p-1 hover:bg-blue-100'
                      }`}
                    >
                      <h1 className="text-primary/80 text-center text-sm font-bold italic">
                        <strong className="text-[#15599a]">{notificacao.remetente}</strong> diz{' '}
                        {notificacao.projetoReferencia ? `sobre o projeto ${notificacao.projetoReferencia}` : ''}{' '}
                        {notificacao.nomeDoProjeto ? `(${notificacao.nomeDoProjeto})` : false}:
                      </h1>
                      <p className="font-raleway text-primary/60 text-center text-xs">{notificacao.mensagem}</p>
                      <div className="flex items-center justify-end gap-2 pr-4">
                        {notificacao.remetenteId && (
                          <button
                            onClick={() =>
                              setNotifyInfo({
                                destinatario: notificacao.remetenteId,
                                remetente: session.user.nome,
                                remetenteId: session?.user?.id,
                                projetoReferencia: notificacao.projetoReferencia,
                                nomeDoProjeto: notificacao.nomeDoProjeto,
                              })
                            }
                            className="outline-hidden transition duration-300 ease-in-out hover:scale-125"
                          >
                            <MdEmail style={{ fontSize: '20px', color: '#15599a' }} />{' '}
                          </button>
                        )}

                        {notificacao.lido ? (
                          <BsCheckAll style={{ fontSize: '20px', color: 'green' }} />
                        ) : (
                          <button
                            onClick={() => setAsRead(notificacao._id, index)}
                            className="outline-hidden transition duration-300 ease-in-out hover:scale-150"
                          >
                            <BsCheck
                              style={{
                                fontSize: '20px',
                                color: 'gray',
                                cursor: 'pointer',
                              }}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-primary/60 text-sm italic">Sem notificações...</p>
                  </div>
                )
              ) : (
                <LoadingPage />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  var myregexp = /^[0-9a-fA-F]{24}$/
  const id = query.id
  try {
    if (!myregexp.test(id)) throw { msg: 'ID inválido.' }
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('users')
    let user = await collection.findOne({
      _id: new ObjectId(id),
    })
    let info = JSON.parse(JSON.stringify(user))
    // Pass data to the page via props
    return { props: { info } }
  } catch (error) {
    let msg = error.msg ? error.msg : 'Erro não identificável. Por favor, tente novamente mais tarde'
    return { props: { error: msg } }
  }
}
export default MeuPerfil
