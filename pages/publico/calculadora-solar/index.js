import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import EstagioDois from '../../../components/EstagioDois'
import EstagioTres from '../../../components/EstagioTres'
import EstagioUm from '../../../components/EstagioUm'
import Logo from '../../../utils/images/logo-texto-branco.png'
import LogoSemTexto from '../../../utils/images/logo-semtexto-branco.png'
import estadosCidades from '../../../utils/jsons/estados-cidades.json'
import Head from 'next/head'
import * as fbq from '../../../utils/fpixel'
import FacebookPixel from '../../../components/Head/facebook/pixel-1'
import AnalyticsScripts from '../../../components/Head/analytics'
import { useRouter } from 'next/router'
import axios from 'axios'
import { formatPersonalName } from '../../../utils/constants'
function Calculadora() {
  const router = useRouter()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitErr, setSubmitErr] = useState({ field: null, text: '' })
  const [estagio, setEstagio] = useState(1)
  const [infoHolder, setInfoHolder] = useState({
    valorFatura: null,
    uf: null,
    cidade: null,
    nome: '',
    email: '',
    telefone: '',
  })
  function validateSubmitFields() {
    if (infoHolder.nome.trim().length < 2) {
      setSubmitErr({
        field: 'NOME',
        text: 'Por favor, preencha um nome válido.',
      })
      setSubmitLoading(false)
      return false
    }
    if (infoHolder.email.trim().length < 11) {
      setSubmitErr({
        field: 'EMAIL',
        text: 'Por favor, preencha um email válido.',
      })
      setSubmitLoading(false)
      return false
    }
    if (infoHolder.telefone.trim().length < 9) {
      setSubmitErr({
        field: 'TELEFONE',
        text: 'Por favor, preencha um telefone válido.',
      })
      setSubmitLoading(false)
      return false
    }
    setSubmitErr({ field: '', text: '' })
    return true
  }
  let obj = {
    telefone: infoHolder.telefone,
    nome: infoHolder.nome ? formatPersonalName(infoHolder.nome) : '',
    email: infoHolder.email,
    responsavel: 'NÃO DEFINIDO',
    uf: infoHolder.uf,
    cidade: infoHolder.cidade,
    canal: 'CALCULADORA SOLAR',
    campanha: '',
    dataDeAquisicao: new Date(),
    consumo: infoHolder.valorFatura,
    vendedor: 'NÃO DEFINIDO',
    dataDeEnvio: new Date(),
    codigoSVB: 0,
    nicho: 'NÃO DEFINIDO',
    leadscoreProduto: 'NÃO DEFINIDO',
    leadscoreBranding: 'NÃO DEFINIDO',
  }
  async function createSimulation() {
    setSubmitLoading(true)
    if (validateSubmitFields()) {
      let response = await axios.post('/api/insideSales/newLead', obj)
      console.log(response)
      if (response.status == 200) {
        let id = response.data.insertedId
        router.push(`/publico/calculadora-solar/resultado/${id}`)
      } else {
        setSubmitLoading(false)
      }
    }
  }
  return (
    <>
      <Head>
        <FacebookPixel />
        <AnalyticsScripts />
      </Head>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-TVBGCSZT"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>
      <div className={`bg-background inline-flex h-full flex-col items-start overflow-clip font-['Raleway']`}>
        <div className="flex h-[82px] w-full items-center justify-center self-stretch bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
          <div className="h-[46px] w-11">
            <div className="w-11">
              <Image src={LogoSemTexto} />
            </div>
          </div>
        </div>
        <div className="flex w-full grow flex-col items-center justify-center gap-[18px] self-stretch px-3 pt-[18px] pb-[12px]">
          <div className="flex w-full flex-col items-center justify-center self-stretch rounded-lg bg-[rgba(245,245,245,1)] px-6 py-1 drop-shadow-lg lg:h-full">
            <div className="h-[100px] w-full text-center text-white">
              <div className="flex w-full flex-1 grow items-center justify-center self-stretch">
                <div className="relative h-[30.05px] w-[300px] lg:w-[350px]">
                  {estagio > 1 ? (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-[42.5%] right-[50.23%] bottom-[45%] left-[3.38%] w-[150px] bg-[rgba(21,89,154,1)]"
                    />
                  ) : (
                    <div className="absolute top-[42.5%] right-[50.23%] bottom-[45%] left-[3.38%] w-[150px] bg-[rgba(79,88,96,1)]" />
                  )}
                  {estagio > 2 ? (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-[42.5%] right-[50.23%] bottom-[45%] left-1/2 w-[150px] bg-[rgba(21,89,154,1)]"
                    />
                  ) : (
                    <div className="absolute top-[42.5%] right-[3.6%] bottom-[45%] left-1/2 w-[150px] bg-[rgba(79,88,96,1)]" />
                  )}
                  <div className="absolute inset-y-0 right-[90.99%] left-0 w-[30px] font-black">
                    <div className="absolute inset-0 w-[30px] rounded-full bg-[rgba(21,89,154,1)]" />
                    <p className="absolute inset-x-0 top-[20%] bottom-[20%] m-0 inline h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">1</p>
                  </div>
                  <div className={`${estagio > 1 ? 'font-black' : ''} absolute inset-y-0 right-[45.5%] left-[45.5%] w-[30px] font-normal`}>
                    {estagio > 1 ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 w-[30px] rounded-full bg-[rgba(21,89,154,1)]"
                        />
                        <p className="absolute inset-x-0 top-[20%] bottom-[20%] m-0 inline h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">2</p>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 w-[30px] rounded-full bg-[rgba(79,88,96,1)]" />
                        <p className="absolute inset-x-0 top-[20%] bottom-[20%] m-0 inline h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">2</p>
                      </>
                    )}
                  </div>
                  <div className={`${estagio > 2 ? 'font-black' : ''} absolute inset-y-0 right-0 left-[90.99%] w-[30px] font-normal`}>
                    {estagio > 2 ? (
                      <>
                        <div className="absolute inset-0 w-[30px] rounded-full bg-[rgba(21,89,154,1)]" />
                        <p className="absolute inset-x-0 top-[20%] bottom-[20%] m-0 inline h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">3</p>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 w-[30px] rounded-full bg-[rgba(79,88,96,1)]" />
                        <p className="absolute inset-x-0 top-[20%] bottom-[20%] m-0 inline h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">3</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                createSimulation()
              }}
            >
              {estagio == 1 && <EstagioUm infoHolder={infoHolder} setInfoHolder={setInfoHolder} next={() => setEstagio((prev) => prev + 1)} />}
              {estagio == 2 && (
                <EstagioDois
                  infoHolder={infoHolder}
                  setInfoHolder={setInfoHolder}
                  previous={() => setEstagio((prev) => prev - 1)}
                  next={() => setEstagio((prev) => prev + 1)}
                />
              )}
              {estagio == 3 && (
                <EstagioTres infoHolder={infoHolder} setInfoHolder={setInfoHolder} submitLoading={submitLoading} submitErr={submitErr} />
              )}
            </form>
          </div>
        </div>
        <div className="flex h-[100px] w-full justify-center gap-3 bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] px-10">
          <div className="flex w-[80px] flex-col items-center justify-center">
            <Image src={Logo} />
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full leading-none">
              <p className="m-0 inline text-[15px] leading-[1.2] font-normal text-white">A energia que move o mundo</p>
              <p className="m-0 inline text-xs leading-[1.2] font-normal text-white"> </p>
              <p className="m-0 inline text-[15px] leading-[1.2] font-black text-[rgba(254,173,65,1)]">vem de você</p>
              <p className="m-0 inline text-xs leading-[1.2] font-normal text-white">!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Calculadora
