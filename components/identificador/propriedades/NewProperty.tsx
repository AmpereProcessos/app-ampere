import TextInput from '@/components/inputs/Text'
import { TProperty, TPropertyDTO } from '@/utils/schemas/properties'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import TagsMenu from './TagsMenu'

type NewPropertyProps = {
  session: Session
  closeModal: () => void
}
function NewProperty({ session, closeModal }: NewPropertyProps) {
  const [infoHolder, setInfoHolder] = useState<TProperty>({
    nome: '',
    identificador: '',
    tags: [],
    responsaveis: [],
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })
  return (
    <div id="new-property" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[60%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">CADASTRO DE PROPRIEDADE</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <TextInput
                  label="NOME DA PROPRIEDADE"
                  placeholder="Preencha o nome da propriedade..."
                  value={infoHolder.nome}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <TextInput
                  label="IDENTIFICADOR DA PROPRIEDADE"
                  placeholder="Preencha o identificador da propriedade..."
                  value={infoHolder.identificador}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, identificador: value }))}
                  width="100%"
                />
              </div>
            </div>
            <TagsMenu
              propertyHolder={infoHolder as TPropertyDTO}
              setPropertyHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TPropertyDTO>>}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewProperty
