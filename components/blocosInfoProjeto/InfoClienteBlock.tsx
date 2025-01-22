import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Accessibility, BriefcaseBusiness, Building2, Cake, Filter, Phone, User, UserRound } from 'lucide-react'
import { BsCalendarPlus } from 'react-icons/bs'
import { FaRegIdCard, FaRing } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'

import Avatar from '../utils/Avatar'

import { formatDateAsLocale, formatLocation, formatToCEP, formatToCPForCNPJ, formatToPhone } from '@/utils/methods/formatting'
import { TProjectWithClientDTO } from '@/utils/schemas/projects'
import { VscChromeClose } from 'react-icons/vsc'
import { AiFillEdit } from 'react-icons/ai'
import { TClientDTO } from '@/utils/schemas/crm/client.schema'
import { formatDate, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import TextInput from '../inputs/Text'
import SelectInput from '../inputs/Select'
import { estadosECidades } from '@/utils/estados_cidades'
import { customersAcquisitionChannels, NaturalPersonMaritalStatus } from '@/utils/select-options'
import { formatDateInputChange, getCEPInfo } from '@/utils/methods/shared'
import toast from 'react-hot-toast'
import DateInput from '../inputs/Date'

type InfoClienteBlockProps = {
  editable: boolean
  infoHolder: TProjectWithClientDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectWithClientDTO>>
  clientChanges: { [key: string]: any }
  setClientChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}
function InfoClienteBlock({ editable, infoHolder, setInfo, clientChanges, setClientChanges }: InfoClienteBlockProps) {
  const [editMenuIsOpen, setEditMenuIsOpen] = useState(false)

  function updateClient(info: Partial<TClientDTO>) {
    setInfo((prev) => ({
      ...prev,
      cliente: prev.cliente ? { ...prev.cliente, ...info } : undefined,
    }))
  }
  function updateClientChanges(info: Partial<TClientDTO>) {
    setClientChanges((prev) => ({
      ...prev,
      ...info,
    }))
  }
  if (!infoHolder.cliente) return null
  return (
    <div className="flex w-full flex-col rounded-md border border-primary">
      <div className="flex w-full items-center justify-center gap-2 bg-primary p-2 text-primary-foreground">
        <h1 className="font-bold">CLIENTE</h1>
        {editable ? (
          <button
            onClick={() => setEditMenuIsOpen((prev) => !prev)}
            className="rounded-full p-1 text-xs duration-300 ease-in-out hover:bg-primary-foreground hover:text-primary"
          >
            {editMenuIsOpen ? <VscChromeClose /> : <AiFillEdit />}
          </button>
        ) : null}
      </div>
      <AnimatePresence>
        {editMenuIsOpen ? (
          <ClientEditBlock
            client={infoHolder.cliente}
            updateClient={updateClient}
            clientChanges={clientChanges}
            updateClientChanges={updateClientChanges}
          />
        ) : (
          <ClientViewBlock client={infoHolder.cliente} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default InfoClienteBlock

type ClientEditBlockProps = {
  client: TClientDTO
  updateClient: (info: Partial<TClientDTO>) => void
  clientChanges: { [key: string]: any }
  updateClientChanges: (info: { [key: string]: any }) => void
}
function ClientEditBlock({ client, updateClient, clientChanges, updateClientChanges }: ClientEditBlockProps) {
  async function setAddressDataByCEP(cep: string) {
    const addressInfo = await getCEPInfo(cep)
    const toastID = toast.loading('Buscando informações sobre o CEP...', {
      duration: 2000,
    })
    setTimeout(() => {
      if (addressInfo) {
        toast.dismiss(toastID)
        toast.success('Dados do CEP buscados com sucesso.', {
          duration: 1000,
        })
        updateClient({
          endereco: addressInfo.logradouro,
          bairro: addressInfo.bairro,
          uf: addressInfo.uf as keyof typeof estadosECidades,
          cidade: addressInfo.localidade.toUpperCase(),
        })
        updateClientChanges({
          endereco: addressInfo.logradouro,
          bairro: addressInfo.bairro,
          uf: addressInfo.uf as keyof typeof estadosECidades,
          cidade: addressInfo.localidade.toUpperCase(),
        })
      }
    }, 1000)
  }
  return (
    <motion.div
      key={'edit-block'}
      variants={GeneralVisibleHiddenExitMotionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex w-full grow flex-col gap-2 p-3"
    >
      <h1 className="self-center rounded-lg bg-gray-800 px-2 py-1 text-xs font-bold tracking-tight text-white">INFORMAÇÕES PESSOAIS</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="NOME (*)"
            value={client.nome}
            placeholder="Preencha aqui o nome do cliente."
            handleChange={(value) => {
              updateClient({ nome: value })
              updateClientChanges({ nome: value })
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="CPF/CNPJ"
            value={client.cpfCnpj || ''}
            placeholder="Preencha aqui o CPF ou CNPJ do cliente."
            handleChange={(value) => {
              updateClient({ cpfCnpj: formatToCPForCNPJ(value) })
              updateClientChanges({ cpfCnpj: formatToCPForCNPJ(value) })
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <DateInput
            label={'DATA DE NASCIMENTO'}
            value={formatDate(client.dataNascimento)}
            handleChange={(value) => {
              {
                updateClient({ dataNascimento: formatDateInputChange(value, 'string') as string })
                updateClientChanges({ dataNascimento: formatDateInputChange(value, 'string') as string })
              }
            }}
            width={'100%'}
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="PROFISSÃO"
            value={client.profissao || ''}
            placeholder="Preencha aqui a profissão do cliente."
            handleChange={(value) => {
              updateClient({ profissao: value })
              updateClientChanges({ profissao: value })
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <SelectInput
            label="ESTADO CIVIL"
            value={client.estadoCivil}
            options={NaturalPersonMaritalStatus}
            handleChange={(value) => {
              updateClient({ estadoCivil: value })
              updateClientChanges({ estadoCivil: value })
            }}
            onReset={() => {
              updateClient({ estadoCivil: null })
              updateClientChanges({ estadoCivil: null })
            }}
            selectedItemLabel="NÃO DEFINIDO"
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <SelectInput
            label="CANAL DE AQUISIÇÃO"
            value={client.canalAquisicao}
            options={customersAcquisitionChannels}
            handleChange={(value) => {
              updateClient({ canalAquisicao: value })
              updateClientChanges({ canalAquisicao: value })
            }}
            onReset={() => {
              updateClient({ canalAquisicao: '' })
              updateClientChanges({ canalAquisicao: '' })
            }}
            selectedItemLabel="NÃO DEFINIDO"
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="NOME DO INDICADOR (SE INDICAÇÃO)"
            value={client.indicador.nome || ''}
            placeholder="Preencha aqui o nome do indicador..."
            handleChange={(value) => {
              updateClient({ indicador: { ...client.indicador, nome: value } })
              updateClientChanges({ indicador: { ...client.indicador, nome: value } })
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="TELEFONE DO INDICADOR (SE INDICAÇÃO)"
            value={client.indicador.contato || ''}
            placeholder="Preencha aqui o contato do indicador..."
            handleChange={(value) => {
              updateClient({ indicador: { ...client.indicador, contato: formatToPhone(value) } })
              updateClientChanges({ indicador: { ...client.indicador, contato: formatToPhone(value) } })
            }}
            width="100%"
          />
        </div>
      </div>
      <h1 className="self-center rounded-lg bg-gray-800 px-2 py-1 text-xs font-bold tracking-tight text-white">INFORMAÇÕES DE CONTATO</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label="TELEFONE PRIMÁRIO (*)"
            value={client.telefonePrimario}
            placeholder="Preencha aqui o telefone primário do cliente."
            handleChange={(value) => {
              updateClient({ telefonePrimario: formatToPhone(value) })
              updateClientChanges({ telefonePrimario: formatToPhone(value) })
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="TELEFONE SECUNDÁRIO"
            value={client.telefoneSecundario || ''}
            placeholder="Preencha aqui o telefone secundário do cliente."
            handleChange={(value) => {
              updateClient({ telefoneSecundario: formatToPhone(value) })
              updateClientChanges({ telefoneSecundario: formatToPhone(value) })
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="EMAIL"
            value={client.email || ''}
            placeholder="Preencha aqui o email do cliente."
            handleChange={(value) => {
              updateClient({ email: value })
              updateClientChanges({ email: value })
            }}
            width="100%"
          />
        </div>
      </div>
      <h1 className="self-center rounded-lg bg-gray-800 px-2 py-1 text-xs font-bold tracking-tight text-white">INFORMAÇÕES DE ENDEREÇO</h1>
      <div className="grid grid-cols-1 grid-rows-3 items-center gap-6 px-2 lg:grid-cols-3 lg:grid-rows-1">
        <TextInput
          label="CEP"
          value={client.cep || ''}
          placeholder="Preencha aqui o CEP do cliente."
          handleChange={(value) => {
            if (value.length == 9) {
              setAddressDataByCEP(value)
            }
            updateClient({ cep: formatToCEP(value) })
            updateClientChanges({ cep: formatToCEP(value) })
          }}
          width="100%"
        />
        <SelectInput
          label="ESTADO"
          value={client.uf}
          options={Object.keys(estadosECidades).map((state, index) => ({ id: index + 1, label: state, value: state }))}
          handleChange={(value) => {
            updateClient({ uf: value, cidade: estadosECidades[value as keyof typeof estadosECidades][0] as string })
            updateClientChanges({ uf: value, cidade: estadosECidades[value as keyof typeof estadosECidades][0] as string })
          }}
          selectedItemLabel="NÃO DEFINIDO"
          onReset={() => {
            updateClient({ uf: '', cidade: '' })
            updateClientChanges({ uf: '', cidade: '' })
          }}
          width="100%"
        />
        <SelectInput
          label="CIDADE"
          value={client.cidade}
          options={
            client.uf
              ? estadosECidades[client.uf as keyof typeof estadosECidades].map((city, index) => ({ id: index + 1, value: city, label: city }))
              : null
          }
          handleChange={(value) => {
            updateClient({ cidade: value })
            updateClientChanges({ cidade: value })
          }}
          selectedItemLabel="NÃO DEFINIDO"
          onReset={() => {
            updateClient({ cidade: '' })
            updateClientChanges({ cidade: '' })
          }}
          width="100%"
        />
      </div>
      <div className="grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
        <TextInput
          label="BAIRRO"
          value={client.bairro || ''}
          placeholder="Preencha aqui o bairro do cliente."
          handleChange={(value) => {
            updateClient({ bairro: value })
            updateClientChanges({ bairro: value })
          }}
          width="100%"
        />
        <TextInput
          label="LOGRADOURO/RUA"
          value={client.endereco || ''}
          placeholder="Preencha aqui o logradouro do cliente."
          handleChange={(value) => {
            updateClient({ endereco: value })
            updateClientChanges({ endereco: value })
          }}
          width="100%"
        />
      </div>
      <div className="mb-2 grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
        <TextInput
          label="NÚMERO/IDENTIFICADOR"
          value={client.numeroOuIdentificador || ''}
          placeholder="Preencha aqui o número ou identificador da residência do cliente."
          handleChange={(value) => {
            updateClient({ numeroOuIdentificador: value })
            updateClientChanges({ numeroOuIdentificador: value })
          }}
          width="100%"
        />
        <TextInput
          label="COMPLEMENTO"
          value={client.complemento || ''}
          placeholder="Preencha aqui algum complemento do endereço."
          handleChange={(value) => {
            updateClient({ complemento: value })
            updateClientChanges({ complemento: value })
          }}
          width="100%"
        />
      </div>
    </motion.div>
  )
}

type ClientViewBlockProps = {
  client: TClientDTO
}
function ClientViewBlock({ client }: ClientViewBlockProps) {
  return (
    <motion.div
      key={'view-block'}
      variants={GeneralVisibleHiddenExitMotionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex w-full grow flex-col gap-2 p-3"
    >
      <div className="flex w-full grow flex-col gap-2">
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-[0.65rem] font-medium text-gray-500">GERAIS</p>
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <div className="flex items-center gap-1">
                <UserRound size={15} />
                <p className="text-[0.75rem] font-medium leading-none tracking-tight">{client?.nome}</p>
              </div>
              <div className="flex items-center gap-1">
                <FaRegIdCard size={12} />
                <p className="text-[0.75rem] font-medium leading-none tracking-tight">{client?.cpfCnpj}</p>
              </div>
              <div className="flex items-center gap-1">
                <Cake size={15} />
                <p className="text-[0.75rem] font-medium leading-none tracking-tight">
                  {client?.dataNascimento ? formatDateAsLocale(client?.dataNascimento) : 'NÃO DEFINIDO'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <FaRing size={12} />
                <p className="text-[0.75rem] font-medium leading-none tracking-tight">{client?.estadoCivil || 'NÃO DEFINIDO'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-[0.65rem] font-medium text-gray-500">CONTATOS</p>
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <div className="flex items-center gap-1">
                <Phone size={12} />
                <p className="text-[0.75rem] font-medium leading-none tracking-tight">{client?.telefonePrimario}</p>
              </div>
              <div className="flex items-center gap-1">
                <MdEmail size={12} />
                <p className="text-[0.75rem] font-medium leading-none tracking-tight">{client?.email || 'NÃO DEFINIDO'}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 lg:items-end">
            <p className="text-[0.65rem] font-medium text-gray-500">AQUISIÇÃO</p>
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <div className="flex items-center gap-1">
                <Filter size={12} />
                <p className="text-[0.75rem] font-medium leading-none tracking-tight">{client?.canalAquisicao}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-[0.65rem] font-medium text-gray-500">LOCALIZAÇÃO</p>
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <div className="flex items-center gap-1">
                <FaLocationDot size={12} />
                <p className="text-[0.75rem] font-medium leading-none tracking-tight">
                  {formatLocation({
                    location: {
                      cep: client?.cep,
                      uf: client?.uf || '',
                      cidade: client?.cidade || '',
                      bairro: client?.bairro,
                      endereco: client?.endereco,
                      numeroOuIdentificador: client?.numeroOuIdentificador,
                      complemento: client?.complemento,
                    },
                    includeCity: true,
                    includeUf: true,
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 lg:items-end">
            <p className="text-[0.65rem] font-medium text-gray-500">ESTADO CIVIL</p>
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <div className="flex items-center gap-1">
                <FaRing size={15} />
                <p className="text-[0.75rem] font-medium leading-none tracking-tight">{client?.estadoCivil || 'NÃO DEFINIDO'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <p className="text-[0.65rem] font-medium text-gray-500">TRABALHO</p>
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <div className="flex items-center gap-1">
                <BriefcaseBusiness size={12} />
                <p className="text-[0.75rem] font-medium leading-none tracking-tight">{client?.profissao || 'NÃO DEFINIDO'}</p>
              </div>
              <div className="flex items-center gap-1">
                <Building2 size={12} />
                <p className="text-[0.75rem] font-medium leading-none tracking-tight">{client?.ondeTrabalha || 'NÃO DEFINIDO'}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 lg:items-end">
            <p className="text-[0.65rem] font-medium text-gray-500">DEFICIÊNCIA</p>
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <div className="flex items-center gap-1">
                <Accessibility size={15} />
                <p className="text-[0.75rem] font-medium leading-none tracking-tight">{client?.deficiencia || 'NÃO DEFINIDO'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[0.65rem] font-medium text-gray-500">INDICAÇÃO</p>
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-center">
            {client?.indicador.nome ? (
              <>
                <div className="flex items-center gap-1">
                  <User size={15} />
                  <p className="text-[0.75rem] font-medium leading-none tracking-tight">{client?.indicador.nome}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Phone size={15} />
                  <p className="text-[0.75rem] font-medium leading-none tracking-tight">{client?.indicador.contato || 'NÃO DEFINIDO'}</p>
                </div>
              </>
            ) : (
              <p className="text-[0.75rem] font-medium leading-none tracking-tight">NÃO APLICÁVEL</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-2">
        <div className={`flex items-center gap-1`}>
          <BsCalendarPlus />
          <p className="text-[0.65rem] font-medium text-gray-500">{formatDateAsLocale(client?.dataInsercao, true)}</p>
        </div>
        <div className="flex items-center gap-1">
          <Avatar fallback={'R'} url={client?.autor.avatar_url || undefined} height={20} width={20} />
          <p className="text-[0.65rem] font-medium text-gray-500">{client?.autor.nome}</p>
        </div>
      </div>
    </motion.div>
  )
}
