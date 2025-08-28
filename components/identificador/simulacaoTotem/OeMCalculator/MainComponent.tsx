import React, { useState } from 'react'
import BackgroundImageWithSmallLogo from '@/utils/images/background-with-white-logo.png'
import BackgroundImageWithBigLogo from '@/utils/images/background-with-big-white-logo.png'
import Image from 'next/image'
import { AiFillInstagram, AiFillPhone } from 'react-icons/ai'
import { TbWorld } from 'react-icons/tb'
import { TTotemSimulation } from '@/utils/schemas/totem-simulation'
import FirstStage from './stages/FirstStage'
import SecondStage from './stages/SecondStage'
import ThirdStage from './stages/ThirdStage'
import { getOeMInvestimentByModuleQty } from '@/utils/totem-simulation/helpers'
import { createTotemSimulation } from '@/utils/methods/mutation/totem-simulation'
import { formatToMoney } from '@/utils/constants'
import ResultStage from './stages/ResultStage'
import StageShowcase from '../StageShowcase'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'
type MainComponentProps = {
  resetSimulation: () => void
}
function MainComponent({ resetSimulation }: MainComponentProps) {
  const [infoHolder, setInfoHolder] = useState<TTotemSimulation>({
    tipoSimulacao: 'CALCULADORA DE MANUTENÇÃO E LIMPEZA',
    nome: '',
    cpfCpnj: '',
    uf: '',
    cidade: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    premissas: {
      numModulos: null,
      valorFaturaEnergia: null,
    },
    sugestao: {
      numModulos: null,
      potModulos: null,
      potenciaPico: null,
      investimento: null,
    },
  })
  const [stage, setStage] = useState(1)

  function validateStageChange({ prev, next, data }: { prev: number; next: number; data: TTotemSimulation }) {
    console.log('VALIDANDO', prev, next, data)
    if (prev === 1 && next === 2) {
      if (!data.premissas.numModulos || Number(data.premissas.numModulos) === 0) {
        toast.error('Por favor, preencha um número de módulos válido.')
        return false
      }
    }
    if (prev === 2 && next === 3) {
      if (data.uf === '' || data.cidade === '') {
        toast.error('Por favor, preencha o seu estado e cidade.')
        return false
      }
    }
    if (next === 4) {
      if (data.nome === '') {
        toast.error('Por favor, preencha um nome válido.')
        return false
      }
      if (data.cpfCpnj === '') {
        toast.error('Por favor, preencha um cpf/cnpj válido.')
        return false
      }
      if (data.telefone === '') {
        toast.error('Por favor, preencha um telefone válido.')
        return false
      }
      return true
    }
    return true
  }
  async function handleCreateSimulation(simulation: TTotemSimulation) {
    const { simpleMaintenance, sunPlan, sunPlusPlan } = getOeMInvestimentByModuleQty(simulation.premissas.numModulos || 0)
    await createTotemSimulation({
      simulation: {
        ...simulation,
        sugestao: {
          investimento: `MANUTENÇÃO: ${formatToMoney(simpleMaintenance)}, PLANO SOL: ${formatToMoney(sunPlan)}, PLANO SOL PLUS: ${formatToMoney(
            sunPlusPlan
          )}`,
        },
      },
    })
    return 'Simulação criada com sucesso'
  }
  const { mutate, isPending } = useMutation({
    mutationFn: handleCreateSimulation,
    onSuccess: (data) => {
      toast.success(data)
      setStage(4)
    },
    onError: () => {
      toast.error('Oops, algo deu errado. Por favor, tente novamente.')
    },
  })
  if (stage == 4)
    return (
      <ResultStage
        nome={infoHolder.nome}
        numModulos={infoHolder.premissas.numModulos || 0}
        potenciaPico={infoHolder.premissas.potenciaPico || null}
        resetSimulation={resetSimulation}
      />
    )

  return (
    <div className={'bg-background flex h-full w-full flex-col items-center gap-3'}>
      {/** HEADER */}
      {/** LARGE DEVICES */}
      {/* LARGE DEVICES */}
      <div className="relative hidden h-[80px] w-full overflow-hidden lg:block lg:h-[300px]">
        <Image src={BackgroundImageWithSmallLogo} alt="FUNDO" fill objectFit="cover" quality={100} priority sizes="100vw" objectPosition="center" />
      </div>
      {/* SMALL DEVICES */}
      <div className="relative block h-[80px] w-full overflow-hidden lg:hidden lg:h-[100px]">
        <Image
          src={BackgroundImageWithBigLogo}
          alt="FUNDO"
          fill
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          quality={100}
          priority
          sizes="100vw"
        />
      </div>
      <div className="flex w-full grow flex-col items-center justify-center gap-3 px-2 py-4">
        <div className="bg-card flex w-full flex-col gap-6 rounded-lg px-4 py-4 shadow-lg lg:w-[600px] lg:px-24">
          <StageShowcase stage={stage} />
          {stage == 1 && (
            <>
              <FirstStage infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              <Button
                size={'xl'}
                onClick={() => {
                  if (
                    validateStageChange({
                      prev: 1,
                      next: 2,
                      data: infoHolder,
                    })
                  ) {
                    setStage(2)
                  }
                }}
                className="w-full bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] p-3 font-black text-white"
              >
                Próximo
              </Button>
            </>
          )}
          {stage == 2 && (
            <>
              <SecondStage infoHolder={infoHolder} setInfoHolder={setInfoHolder} moveToNextStage={() => setStage((prev) => prev + 1)} />
              <Button
                size={'xl'}
                onClick={() => {
                  if (
                    validateStageChange({
                      prev: 2,
                      next: 3,
                      data: infoHolder,
                    })
                  ) {
                    setStage(3)
                  }
                }}
                className="w-full bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] p-3 font-black text-white"
              >
                Próximo
              </Button>
            </>
          )}
          {stage == 3 && (
            <>
              <ThirdStage infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              <LoadingButton
                size={'xl'}
                loading={isPending}
                onClick={() => {
                  if (
                    validateStageChange({
                      prev: 3,
                      next: 4,
                      data: infoHolder,
                    })
                  ) {
                    mutate(infoHolder)
                  }
                }}
                className="w-full bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] p-3 font-black text-white"
              >
                Visualizar Simulação
              </LoadingButton>
            </>
          )}
        </div>
      </div>
      <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-2 bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] p-3 px-10">
        <h1 className="text-center text-xs font-black text-white lg:text-sm">
          A energia que move o mundo{'  '}
          <strong className="text-[rgba(254,173,65,1)]"> vem de você</strong>!
        </h1>
        <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="flex items-center gap-1 text-xs text-white lg:text-sm">
            <AiFillInstagram />
            <p>@ampereenergias</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-white lg:text-sm">
            <AiFillPhone />
            <p>(34) 3700-7001</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-white lg:text-sm">
            <TbWorld />
            <p>ampereenergias.com.br</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainComponent
