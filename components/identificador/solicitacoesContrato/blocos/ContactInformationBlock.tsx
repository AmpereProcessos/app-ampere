import TextInput from '@/components/inputs/Text'
import { formatToPhone } from '@/utils/methods/formatting'
import { TContractRequestDTO } from '@/utils/schemas/contract-requests'
import React from 'react'

type ContactInformationBlockProps = {
  infoHolder: TContractRequestDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>
  userHasEditPermission: boolean
}
function ContactInformationBlock({ infoHolder, setInfoHolder, userHasEditPermission }: ContactInformationBlockProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DE CONTATO</h1>
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
        <div className="w-1/4 lg:w-full">
          <TextInput
            label={'NOME DO CONTATO 1'}
            placeholder="Preencha o nome do contato primário..."
            editable={userHasEditPermission}
            value={infoHolder.nomeContatoJornadaUm}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nomeContatoJornadaUm: value }))}
            width="100%"
          />
        </div>
        <div className="w-1/4 lg:w-full">
          <TextInput
            label={'TELEFONE DO CONTATO 1'}
            placeholder="Preencha o telefone do contato primário..."
            editable={userHasEditPermission}
            value={infoHolder.telefoneContatoUm}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                telefoneContatoUm: formatToPhone(value),
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-1/4 lg:w-full">
          <TextInput
            label={'NOME DO CONTATO 2'}
            placeholder="Preencha o nome do contato secundário..."
            editable={userHasEditPermission}
            value={infoHolder.nomeContatoJornadaDois}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nomeContatoJornadaDois: value }))}
            width="100%"
          />
        </div>
        <div className="w-1/4 lg:w-full">
          <TextInput
            label={'TELEFONE DO CONTATO 2'}
            placeholder="Preencha o telefone do contato secuncário..."
            editable={userHasEditPermission}
            value={infoHolder.telefoneContatoDois}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                telefoneContatoDois: formatToPhone(value),
              }))
            }
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
        <div className="w-full">
          <div className="mt-2 flex w-full flex-col items-center self-center px-2">
            <span className="text-center font-raleway text-sm font-bold uppercase">CUIDADOS PARA CONTATO COM O CLIENTE</span>
            <textarea
              readOnly={!userHasEditPermission}
              placeholder={
                'Descreva aqui cuidados em relação ao contato do cliente durante a jornada. Melhores horários para contato, texto ou aúdio, etc...'
              }
              value={infoHolder.cuidadosContatoJornada}
              className="h-[80px] w-full resize-none border border-gray-600 bg-gray-200 p-2 text-center outline-none"
              onChange={(e) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  cuidadosContatoJornada: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactInformationBlock
