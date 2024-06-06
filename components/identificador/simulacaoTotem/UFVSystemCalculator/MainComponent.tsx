import React, { useState } from 'react'
import BackgroundImageWithSmallLogo from '@/utils/images/background-with-white-logo.png'
import BackgroundImageWithBigLogo from '@/utils/images/background-with-big-white-logo.png'
import AmpereWhiteLogo from '@/utils/svgs/logo-texto-branco-vertical.svg'
import Image from 'next/image'
import { AiFillInstagram, AiFillPhone } from 'react-icons/ai'
import { TbWorld } from 'react-icons/tb'
import { motion } from 'framer-motion'
import { TTotemSimulation } from '@/utils/schemas/totem-simulation'
import FirstStage from './stages/FirstStage'
import SecondStage from './stages/SecondStage'
import ThirdStage from './stages/ThirdStage'
import { getUFVSystemInvestmentByEnergyBill } from '@/utils/totem-simulation/helpers'
import { createTotemSimulation } from '@/utils/methods/mutation/totem-simulation'
import ResultStage from './stages/ResultStage'
function MainComponent() {
  const [infoHolder, setInfoHolder] = useState<TTotemSimulation>({
    tipoSimulacao: 'CALCULADORA DE ENERGIA SOLAR',
    nome: '',
    cpfCpnj: '',
    uf: '',
    cidade: '',
    email: '',
    telefone: '',
    valorFaturaEnergia: null,
    dataNascimento: '',
    investimentoEstimado: null,
  })
  const [stage, setStage] = useState(1)
  async function handleCreateSimulation(simulation: TTotemSimulation) {
    const { investiment } = getUFVSystemInvestmentByEnergyBill(simulation.valorFaturaEnergia || 0)
    try {
      const response = await createTotemSimulation({ simulation: { ...simulation, investimentoEstimado: investiment } })
      return setStage(4)
    } catch (error) {
      throw error
    }
  }
  if (stage == 4)
    return (
      <ResultStage
        nome={infoHolder.nome}
        valorFaturaEnergia={infoHolder.valorFaturaEnergia || 0}
        resetSimulation={() => {
          setInfoHolder({
            tipoSimulacao: 'CALCULADORA DE ENERGIA SOLAR',
            nome: '',
            cpfCpnj: '',
            uf: '',
            cidade: '',
            email: '',
            telefone: '',
            valorFaturaEnergia: null,
            dataNascimento: '',
            investimentoEstimado: null,
          })
          setStage(1)
        }}
      />
    )
  return (
    <div className={`flex h-full grow flex-col items-center overflow-clip bg-white font-raleway`}>
      <div className={`inline-flex h-full w-full grow flex-col items-start overflow-clip bg-white font-['Raleway']`}>
        <div className="relative flex h-[150px] w-full items-center justify-center lg:h-[350px]">
          {/** LARGE DEVICES */}
          <div className="absolute top-0 z-[2] hidden h-[150px] w-full lg:block lg:h-[350px]">
            <Image
              src={BackgroundImageWithSmallLogo}
              alt="FUNDO"
              layout="fill"
              objectFit="cover" // Use "cover" para que a imagem preencha o contêiner respeitando a proporção
              quality={100}
            />
          </div>
          {/** SMALL DEVICES */}
          <div className="absolute top-0 z-[2] block h-[150px] w-full lg:hidden lg:h-[350px]">
            <Image
              src={BackgroundImageWithBigLogo}
              alt="FUNDO"
              layout="fill"
              objectFit="cover" // Use "cover" para que a imagem preencha o contêiner respeitando a proporção
              quality={100}
            />
          </div>
        </div>

        <div className="flex w-full grow flex-col items-center justify-center gap-[18px] self-stretch px-3 pt-[18px] pb-[12px]">
          <div className="flex h-[700px] w-full flex-col items-center justify-center self-stretch rounded-lg bg-[rgba(245,245,245,1)] px-6 py-1 drop-shadow-lg lg:h-full">
            <div className="h-[100px] w-full text-center text-white">
              <div className="flex w-full flex-1 flex-grow items-center justify-center self-stretch">
                <div className="relative h-[30.05px] w-[300px] lg:w-[350px]">
                  {stage > 1 ? (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute left-[3.38%] right-[50.23%] top-[42.5%] bottom-[45%] w-[125px] bg-[rgba(21,89,154,1)] lg:w-[150px]"
                    />
                  ) : (
                    <div className="absolute left-[3.38%] right-[50.23%] top-[42.5%] bottom-[45%] w-[125px] bg-[rgba(79,88,96,1)] lg:w-[150px]" />
                  )}
                  {stage > 2 ? (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute left-1/2 right-[50.23%] top-[42.5%] bottom-[45%] w-[125px] bg-[rgba(21,89,154,1)] lg:w-[150px]"
                    />
                  ) : (
                    <div className="absolute left-1/2 right-[3.6%] top-[42.5%] bottom-[45%] w-[125px] bg-[rgba(79,88,96,1)] lg:w-[150px]" />
                  )}
                  <div className="absolute inset-y-0 left-0 right-[90.99%] w-[30px] font-black">
                    <div className="absolute inset-0 w-[30px] rounded-full bg-[rgba(21,89,154,1)]" />
                    <p className="absolute inset-x-0 top-[20%] bottom-[20%] m-0 inline h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">1</p>
                  </div>
                  <div className={`${stage > 1 ? 'font-black' : ''} absolute inset-y-0 left-[45.5%] right-[45.5%] w-[30px] font-normal`}>
                    {stage > 1 ? (
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
                  <div className={`${stage > 2 ? 'font-black' : ''} absolute inset-y-0 right-0 left-[90.99%] w-[30px] font-normal`}>
                    {stage > 2 ? (
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
            <div className="z-[2]">
              {stage == 1 && (
                <FirstStage infoHolder={infoHolder} setInfoHolder={setInfoHolder} moveToNextStage={() => setStage((prev) => prev + 1)} />
              )}
              {stage == 2 && (
                <SecondStage infoHolder={infoHolder} setInfoHolder={setInfoHolder} moveToNextStage={() => setStage((prev) => prev + 1)} />
              )}
              {stage == 3 && (
                <ThirdStage infoHolder={infoHolder} setInfoHolder={setInfoHolder} createSimulation={() => handleCreateSimulation(infoHolder)} />
              )}
            </div>
          </div>
        </div>
        <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-2 bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] p-3 px-10">
          <div className="flex flex-col items-center justify-center gap-3 lg:flex-row">
            <div className="z-10 flex w-[80px] flex-col items-center justify-center">
              <Image src={AmpereWhiteLogo} quality={100} height={80} width={80} alt="LOGO" style={{ objectFit: 'cover' }} />
            </div>
            <h1 className="text-center text-white">
              A energia que move o mundo{'  '}
              <strong className=" text-[rgba(254,173,65,1)]"> vem de você</strong>!
            </h1>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
            <div className="flex items-center gap-1 text-white">
              <AiFillInstagram size="35px" />
              <p>@ampereenergias</p>
            </div>
            <div className="flex items-center gap-1 text-white">
              <AiFillPhone size="35px" />
              <p>(34) 3700-7001</p>
            </div>
            <div className="flex items-center gap-1 text-white">
              <TbWorld size="35px" />
              <p>ampereenergias.com.br</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainComponent
