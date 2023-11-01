import React, { useState } from 'react'
import { FaFilePdf, FaFileSignature } from 'react-icons/fa'
import SelectFoatingInput from '../SelectFloatingInput'
import { IoIosSend } from 'react-icons/io'
import { getMetadata, ref } from 'firebase/storage'
import { storage } from '../../utils/services/firebase/firebase-storage'
import axios from 'axios'
import { BsCheck } from 'react-icons/bs'
function ESigningBlock({ projectId, contractName, email, phone_number, documentation, contractLinks, digitalSigningInfo }) {
  const [showMenu, setShowMenu] = useState()
  const [toSignFile, setToSignFile] = useState()
  const [uploadMsg, setUploadMsg] = useState({
    status: null,
    text: '',
    color: '',
  })
  const [downloadMsg, setDownloadMsg] = useState({
    status: null,
    text: '',
    color: '',
  })
  async function handleDownload(documentKey) {
    setDownloadMsg({
      text: 'Carregando',
      color: 'text-[#15599a]',
      status: 'loading',
    })
    try {
      const response = await axios.get(`/api/utils/clicksign/downloadSignedFile?documentKey=${documentKey}`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ARQUIVO_ASSINADO.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      setDownloadMsg({
        text: 'Arquivo baixado com sucesso.',
        color: 'text-green-500',
        status: 'success',
      })
    } catch (error) {
      alert('Houve um erro no download do arquivo.')
    }

    // const xhr = new XMLHttpRequest();
    // xhr.responseType = "blob";
    // xhr.onload = (event) => {
    //   const blob = xhr.response;
    //   console.log(blob);
    // };
    // xhr.open("GET", url);
    // xhr.send();

    // let fileRef = ref(storage, obj.link);
    // const resp = await getBlob(fileRef);
    // console.log(resp);
  }
  async function send() {
    if (!toSignFile) {
      setUploadMsg({
        text: 'Por favor, escolha o arquivo a ser enviado.',
        color: 'text-red-500',
        status: null,
      })
      return
    }
    if (!email) {
      setUploadMsg({
        text: 'Nenhum um email vinculado ao projeto. Por favor, atualize o projeto pra dar prosseguimento.',
        color: 'text-red-500',
        status: null,
      })
      return
    }
    if (!phone_number) {
      setUploadMsg({
        text: 'Nenhum um telefone vinculado ao projeto. Por favor, atualize o projeto pra dar prosseguimento.',
        color: 'text-red-500',
        status: null,
      })
      return
    }
    if (!documentation) {
      setUploadMsg({
        text: 'Nenhum um telefone vinculado ao projeto. Por favor, atualize o projeto pra dar prosseguimento.',
        color: 'text-red-500',
        status: null,
      })
      return
    }
    let fileRef = ref(storage, toSignFile)
    const metadata = await getMetadata(fileRef)
    const md = metadata

    const filePath = fileRef.fullPath

    setUploadMsg({
      text: 'Enviando arquivo...',
      color: 'text-[#15599a]',
      status: 'loading',
    })
    const { data } = await axios.post(`/api/utils/clicksign/sendDigitalSigning?filePath=${encodeURIComponent(filePath)}`, {
      projectId,
      contractName,
      email,
      phone_number,
      documentation,
    })
    console.log('RESPOSTA', data)
    setUploadMsg({
      text: 'Arquivo enviado com sucesso !',
      color: 'text-green-500',
      status: 'success',
    })
  }
  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">ASSINATURA DIGITAL</span>
        <div
          onClick={() => setShowMenu((prev) => !prev)}
          className={`${
            showMenu
              ? 'bg-[#15599a] text-white hover:bg-transparent hover:text-[#15599a]'
              : 'text-[#15559a] bg-transparent hover:bg-[#15599a] hover:text-white'
          } p-2 rounded-full border border-[#15599a] text-xs hover:scale-110 duration-300 ease-in-out cursor-pointer`}
        >
          <FaFileSignature />
        </div>
      </div>
      {showMenu ? (
        <div className="w-full flex flex-col mt-2 items-center">
          {digitalSigningInfo ? (
            <div className="w-full flex flex-col items-center">
              {digitalSigningInfo.documentoFinalizado ? (
                <>
                  {downloadMsg.status == 'loading' ? (
                    <div className="grow flex items-center justify-center">
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleDownload(digitalSigningInfo.documentoKey)}
                      className="flex w-fit items-center p-2 rounded border border-blue-400 gap-2 cursor-pointer"
                    >
                      <FaFilePdf style={{ color: 'rgb(96,165,250)' }} />
                      <p className="text-sm text-gray-500 font-medium">ARQUIVO ASSINADO</p>
                    </div>
                  )}
                </>
              ) : null}
              <h1 className="text-center text-gray-500 font-medium text-sm">
                Um documento foi adicionado para assinatura digital. Abaixo, estão os status de assinatura dos signatários vinculados:
              </h1>
              <div className="flex w-full flex-col items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-[13px] w-[13px] items-center justify-center rounded-full border-2 border-[#15599a] ${
                      digitalSigningInfo.assinaturaContratante ? 'bg-[#15599a]' : ''
                    }`}
                  >
                    {digitalSigningInfo.assinaturaContratante ? <BsCheck style={{ color: '#fead61' }} /> : null}
                  </div>
                  <span className={`${digitalSigningInfo.assinaturaContratante ? 'text-green-500' : 'text-gray-500'}`}>ASSINATURA DO CLIENTE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-[13px] w-[13px] items-center justify-center rounded-full border-2 border-[#15599a] ${
                      digitalSigningInfo.assinaturaContratada ? 'bg-[#15599a]' : ''
                    }`}
                  >
                    {digitalSigningInfo.assinaturaContratada ? <BsCheck style={{ color: '#fead61' }} /> : null}
                  </div>
                  <span className={`${digitalSigningInfo.assinaturaContratada ? 'text-green-500' : 'text-gray-500'}`}>ASSINATURA DA CONTRATADA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-[13px] w-[13px] items-center justify-center rounded-full border-2 border-[#15599a] ${
                      digitalSigningInfo.assinaturaValidador ? 'bg-[#15599a]' : ''
                    }`}
                  >
                    {digitalSigningInfo.assinaturaValidador ? <BsCheck style={{ color: '#fead61' }} /> : null}
                  </div>
                  <span className={`${digitalSigningInfo.assinaturaValidador ? 'text-green-500' : 'text-gray-500'}`}>ASSINATURA DO VALIDADOR</span>
                </div>
              </div>
            </div>
          ) : contractLinks ? (
            <>
              <SelectFoatingInput
                label={'ARQUIVO PARA ASSINATURA'}
                editable={true}
                value={toSignFile ? toSignFile : 'NÃO DEFINIDO'}
                options={[
                  ...contractLinks.map((fileObj) => {
                    return {
                      label: fileObj.title,
                      value: fileObj.link,
                    }
                  }),
                  { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                ]}
                handleChange={(value) => setToSignFile(value)}
              />
              {uploadMsg.text ? <p className={`text-sm text-center ${uploadMsg.color} w-full`}>{uploadMsg.text}</p> : null}
              {uploadMsg.status == 'loading' ? (
                <div className="grow flex items-center justify-center">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <button onClick={send} className="bg-blue-200 hover:text-white hover:bg-blue-600 p-1 rounded-lg mt-2 flex items-center gap-1">
                  <p className="text-xs font-medium">ENVIAR</p>
                  <IoIosSend style={{ fontSize: '15px', marginTop: '1px' }} />
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 italic text-center">
              Nenhum arquivo anexado na categoria de <strong className="text-[#fead61]">contratos</strong> . Por favor, anexe um arquivo para
              desbloquear o menu de E-Signing
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default ESigningBlock
