import TextInput from '@/components/inputs/Text'
import TimeInput from '@/components/inputs/TimeInput'
import { formatToPhone } from '@/utils/constants'
import { getDifferenceBetweenTimes } from '@/utils/methods/dates'
import { TEmployeeAuxiliarContact, TEmployeeDTO, TUser, TWorkingHours } from '@/utils/schemas/users'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaPhone, FaPlayCircle, FaRegClock, FaStopCircle, FaUsers } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

type AuxiliarContactsMenuProps = {
  infoHolder: TEmployeeDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TEmployeeDTO>>
}
function AuxiliarContactsMenu({ infoHolder, setInfoHolder }: AuxiliarContactsMenuProps) {
  const [contactsHolder, setContactsHolder] = useState<TEmployeeAuxiliarContact>({
    nome: '',
    grau: '',
    telefone: '',
  })
  function handleAddAuxiliarContact(info: TEmployeeAuxiliarContact) {
    if (info.nome.trim().length < 3) return toast.error('Preencha um nome de ao menos 3 caracteres.')
    if (info.telefone.trim().length < 11) return toast.error('Preencha um telefone válido')

    const contacts = [...infoHolder.contatosAuxiliares]

    contacts.push(info)

    setInfoHolder((prev) => ({ ...prev, contatosAuxiliares: contacts }))
  }
  function handleDeleteAuxiliarContact(index: number) {
    const contacts = [...infoHolder.contatosAuxiliares]

    contacts.splice(index, 1)

    setInfoHolder((prev) => ({ ...prev, contatosAuxiliares: contacts }))
  }
  return (
    <>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="NOME DO CONTATO"
            placeholder="Preencha aqui o nome do contato..."
            value={contactsHolder.nome}
            handleChange={(value) => setContactsHolder((prev) => ({ ...prev, nome: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="GRAU DO CONTATO"
            placeholder="Preencha aqui o grau de parentesco do contato..."
            value={contactsHolder.grau}
            handleChange={(value) => setContactsHolder((prev) => ({ ...prev, grau: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="TELEFONE DO CONTATO"
            placeholder="Preencha aqui o telefone de parentesco do contato..."
            value={contactsHolder.telefone}
            handleChange={(value) => setContactsHolder((prev) => ({ ...prev, telefone: formatToPhone(value) }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => handleAddAuxiliarContact(contactsHolder)}
          className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
        >
          ADICIONAR CONTATO
        </button>
      </div>

      <div className="flex w-full flex-wrap items-start justify-around gap-2">
        {infoHolder.contatosAuxiliares.length > 0 ? (
          infoHolder.contatosAuxiliares.map((contact, index) => (
            <div key={index} className="flex w-full flex-col rounded-md border border-gray-300 p-3 lg:w-[350px]">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-xs font-black leading-none tracking-tight lg:text-sm">{contact.nome}</h1>
                <button
                  onClick={() => handleDeleteAuxiliarContact(index)}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                >
                  <MdDelete style={{ color: 'red' }} size={15} />
                </button>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <div className={`flex items-center gap-2 `}>
                  <FaUsers />
                  <p className="text-xs font-medium text-gray-500">{contact.grau}</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FaPhone color={'#15599a'} />
                  <p className="text-xs font-medium text-gray-500">{contact.telefone}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs font-medium italic text-gray-500">Não há contatos auxiliares cadastrados</p>
        )}
      </div>
    </>
  )
}

export default AuxiliarContactsMenu
