import { TNewWarehouseFormulary } from '@/utils/schemas/warehouse-formularies'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'

type NewFormProps = {
  session: Session
  closeModal: () => void
}
function NewForm({ session, closeModal }: NewFormProps) {
  const [infoHolder, setInfoHolder] = useState<TNewWarehouseFormulary>({
    titulo: '',
    responsaveis: '',
    projeto: {
      id: null,
      nome: null,
    },
    localizacao: {
      cep: null,
      uf: null,
      cidade: null,
      bairro: '',
      endereco: '',
      numeroOuIdentificador: '',
      distancia: null,
    },
    materiais: [],
    autor: {
      id: session.user.id,
      nome: session.user.name,
      avatar_url: session.user.image,
    },
    dataEfetivacao: null,
    dataInsercao: new Date().toISOString(),
  })
  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[70%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[60%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">NOVO FORMULÁRIO</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewForm
