import { TTotemSimulation } from '@/utils/schemas/totem-simulation'
import React, { useState } from 'react'
import TotemTextInput from '../../inputs/TotemTextInput'
import TotemNumberInput from '../../inputs/TotemNumberInput'
import { formatToCPForCNPJ, formatToPhone } from '@/utils/methods/formatting'
import { formatDate } from '@/utils/constants'
import toast from 'react-hot-toast'

type ThirdStageProps = {
  infoHolder: TTotemSimulation
  setInfoHolder: React.Dispatch<React.SetStateAction<TTotemSimulation>>
  createSimulation: () => void
}
function ThirdStage({ infoHolder, setInfoHolder, createSimulation }: ThirdStageProps) {
  const [submitErr, setSubmitErr] = useState<{ field: string; text: string }>({
    field: '',
    text: '',
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  function validateFields() {
    if (infoHolder.nome.trim().length < 2) {
      setSubmitErr({ field: 'NOME', text: '' })
      toast.error('Oops, o nome o preenchido é inválido.')
      return false
    }
    if (infoHolder.email.trim().length < 9) {
      setSubmitErr({ field: 'EMAIL', text: '' })
      toast.error('Oops, o email preenchido é inválido.')
      return false
    }
    if (infoHolder.telefone.trim().length < 9) {
      setSubmitErr({ field: 'TELEFONE', text: '' })
      toast.error('Oops, o telefone preenchido é inválido.')
      return false
    }
    return true
  }
  function handleFinishForm() {
    if (validateFields()) {
      createSimulation()
    }
  }
  return (
    <div className="flex h-fit w-full flex-col">
      <div className="flex h-[300px] w-full flex-1 flex-grow flex-col items-center justify-center gap-3 self-stretch font-normal text-[rgba(79,88,96,1)]">
        <div className="flex w-[350px] flex-col items-center justify-center gap-1 text-left">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] text-[15px] leading-[1.2] lg:w-[350px]">Seu nome</p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <TotemTextInput
              showLabel={false}
              label=""
              placeholder=""
              value={infoHolder.nome || ''}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
              width="100%"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-1 text-left">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] text-[15px] leading-[1.2] lg:w-[350px]">Telefone</p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <TotemNumberInput
              showLabel={false}
              label=""
              showTag={false}
              placeholder=""
              value={infoHolder.telefone || ''}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  telefone: formatToPhone(value),
                }))
              }
              width="100%"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-1 text-left">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] text-[15px] leading-[1.2] lg:w-[350px]">CPF</p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <TotemNumberInput
              showLabel={false}
              label=""
              showTag={false}
              placeholder=""
              value={infoHolder.cpfCpnj || ''}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  cpfCpnj: formatToCPForCNPJ(value),
                }))
              }
              width="100%"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-1 text-left">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] text-[15px] leading-[1.2] lg:w-[350px]">Seu melhor e-mail</p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <TotemTextInput
              showLabel={false}
              label=""
              placeholder=""
              showEmailDomains={true}
              value={infoHolder.email || ''}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, email: value }))}
              width="100%"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-1 text-left">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] text-[15px] leading-[1.2] lg:w-[350px]">Sua data de nascimento</p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <input
              type="date"
              value={infoHolder.dataNascimento ? formatDate(infoHolder.dataNascimento) : undefined}
              onChange={(e) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  dataNascimento: e.target.value != '' ? e.target.value : null,
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-sm shadow-sm"
            />
          </div>
        </div>
        <div className="w-[350px] gap-1 text-center">
          <div className="flex h-10 w-full flex-col items-center justify-center self-stretch px-6">
            <p className="m-0 w-full text-xs leading-[1.2]">
              Fique tranquilo. Pedimos essas informações para desenvolver uma simulação mais exata para você!
            </p>
          </div>
        </div>
      </div>
      <div className="flex h-[100px] w-full flex-col items-center justify-center gap-4 self-stretch text-center font-black text-white">
        {submitErr.text ? <p className="text-center italic text-red-500">{submitErr.text}</p> : null}
        <div className="w-full">
          {submitLoading ? (
            <div className="flex w-full items-center justify-center self-center lg:w-[350px]">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
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
            <button
              type="submit"
              onClick={handleFinishForm}
              className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] p-3 duration-300 hover:scale-[1.02] lg:w-full"
            >
              <p className="w-full text-sm lg:text-[19px]">Visualizar simulação</p>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ThirdStage
