import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { FaBox, FaMapMarkerAlt } from 'react-icons/fa'

import LoadingPage from '../../../components/utils/LoadingPage'

import ModalEntradaAlmoxarifado from '../../../components/ModalEntradaAlmoxarifado'
import { useMaterials, useMaterialsWithFilters } from '../../../utils/methods/query/materials'
import { TbRulerMeasure } from 'react-icons/tb'
import TextInput from '../../../components/inputs/Text'
import NumberInput from '../../../components/inputs/Number'
import MaterialCard from '../../../components/identificador/almoxarifado/MaterialCard'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle, IoMdPricetag } from 'react-icons/io'
import { AnimatePresence, motion } from 'framer-motion'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { IoResize } from 'react-icons/io5'
import NewMaterial from '@/components/identificador/estoque/NewMaterial'
import { formatToMoney } from '@/utils/constants'
import EditMaterial from '@/components/identificador/estoque/EditMaterial'
import { BsCalendarPlus } from 'react-icons/bs'
import { formatDateAsLocale } from '@/utils/methods/formatting'
function Estoque() {
  const router = useRouter()
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false)
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })
  const isAuthorized = !!session?.user.permissoes.rotas?.includes('Almoxarifado') || !!session?.user.permissoes.rotas?.includes('Obras')
  const { data: materials, isLoading, isError, isSuccess, filters, setFilters } = useMaterials()

  const [newMaterialModalIsOpen, setNewMaterialModalIsOpen] = useState(false)
  const [editMaterialModal, setEditMaterialModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })

  const [entranceModalIsOpen, setEntranceModalIsOpen] = useState(false)

  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="flex grow flex-col p-6">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">ESTOQUE</p>
            </div>
            {dropdownMenuVisible ? (
              <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
              </div>
            ) : (
              <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
              </div>
            )}
          </div>
          <AnimatePresence>
            {dropdownMenuVisible ? (
              <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
                <div className="flex flex-col flex-wrap items-end justify-center gap-2 lg:flex-row">
                  <TextInput
                    label={'NOME'}
                    value={filters.search}
                    placeholder={'Digite o nome do material...'}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                  />
                  <div className="w-full lg:w-[250px]">
                    <NumberInput
                      label="MENOS QUE"
                      placeholder="Filtrar por menos quantidade que..."
                      value={filters.lessThan}
                      handleChange={(value) => setFilters((prev) => ({ ...prev, lessThan: value }))}
                      width="100%"
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <NumberInput
                      label="MAIS QUE"
                      placeholder="Filtrar por mais quantidade que..."
                      value={filters.moreThan}
                      handleChange={(value) => setFilters((prev) => ({ ...prev, moreThan: value }))}
                      width="100%"
                    />
                  </div>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, minimumUndefined: !prev.minimumUndefined }))}
                    className={`rounded-md border border-gray-400 ${
                      filters.minimumUndefined ? 'bg-gray-400 text-white' : 'bg-transparent text-gray-400'
                    }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                  >
                    MÍNIMO INDEFINIDO
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, maximumUndefined: !prev.maximumUndefined }))}
                    className={`rounded-md border border-gray-400 ${
                      filters.maximumUndefined ? 'bg-gray-400 text-white' : 'bg-transparent text-gray-400'
                    }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                  >
                    MÁXIMO INDEFINIDO
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, belowMinimum: !prev.belowMinimum }))}
                    className={`rounded-md border border-red-400 ${
                      filters.belowMinimum ? 'bg-red-400 text-white' : 'bg-transparent text-red-400'
                    }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                  >
                    MENOS QUE O MÍNIMO
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, aboveMaximum: !prev.aboveMaximum }))}
                    className={`rounded-md border border-orange-400 ${
                      filters.aboveMaximum ? 'bg-orange-400 text-white' : 'bg-transparent text-orange-400'
                    }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                  >
                    MAIS QUE O MÁXIMO
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div className="mt-2 flex w-full items-center justify-end gap-2">
            <Link href="/almoxarifado/estoque/relatorio-pdf">
              <a className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#fead41] px-2 py-1 text-sm font-bold tracking-tight text-white">
                <h1>RELATÓRIO</h1>
              </a>
            </Link>
            <Link href="/almoxarifado/estoque/analitico">
              <a className="flex cursor-pointer items-center gap-2 rounded-lg bg-black px-2 py-1 text-sm font-bold tracking-tight text-white">
                <h1>ANÁLISE DE ESTOQUE</h1>
              </a>
            </Link>
          </div>
        </div>
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar itens do estoque.'} /> : null}
        {isSuccess ? (
          <div className="my-2 flex w-full flex-col flex-wrap items-center justify-around gap-3 lg:flex-row">
            {materials.map((material) => (
              <div className="flex w-full flex-col rounded-md border border-gray-200 p-4 lg:w-[450px]">
                <div className="flex w-full items-center justify-between gap-2">
                  <h1
                    onClick={() => setEditMaterialModal({ id: material._id, isOpen: true })}
                    className="cursor-pointer text-xs font-black leading-none tracking-tight hover:text-cyan-500 lg:text-sm"
                  >
                    {material.nome || 'NÃO DEFINIDO'}
                  </h1>
                  <div className="flex min-w-fit items-center gap-2 rounded-full bg-gray-800 px-2 py-1 ">
                    <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">
                      {material.qtde} {material.grandeza || 'UN'}
                    </h1>
                  </div>
                </div>
                <div className="mt-2 flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <IoMdPricetag color="rgb(34,197,94)" />
                    <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{formatToMoney(material.preco)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TbRulerMeasure />
                    <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{material.grandeza}</p>
                  </div>
                </div>
                <div className="mt-2 flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt color="#15599a" />
                    <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
                      {material.localizacao || 'NÃO DEFINIDA'}
                    </p>
                  </div>
                  {material.qtdeMinima || material.qtdeMaxima ? (
                    <>
                      {material.qtdeMaxima ? (
                        <div className="flex items-center gap-2">
                          <FaBox color="rgb(239,68,68)" />
                          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{material.qtdeMaxima} MÁX</p>
                        </div>
                      ) : null}
                      {material.qtdeMinima ? (
                        <div className="flex items-center gap-2">
                          <FaBox color="rgb(239,68,68)" />
                          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{material.qtdeMinima} MÍN</p>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>
                <div className="mt-2 flex w-full items-center justify-end gap-2">
                  <div className="flex items-center gap-2">
                    <BsCalendarPlus />
                    <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
                      {formatDateAsLocale(material.dataInsercao, true)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {/* <div className="mt-4 flex w-full grow flex-wrap justify-around gap-3">
          {materials ? (
            materials.map((material) => (
              <MaterialCard key={material._id} material={material} handleClick={() => setEditModal({ isOpen: true, info: material })} />
            ))
          ) : (
            <LoadingPage />
          )}
        </div> */}
        <div
          onClick={() => setNewMaterialModalIsOpen(true)}
          className="left-150 fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]"
        >
          <p className="text-sm font-bold uppercase">NOVO ITEM</p>
        </div>
        <div
          onClick={() => setEntranceModalIsOpen(true)}
          className="left-150 fixed bottom-10 ml-36 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]"
        >
          <p className="text-sm font-bold uppercase">ENTRADA</p>
        </div>
        {editMaterialModal.isOpen && editMaterialModal.id ? (
          <EditMaterial materialId={editMaterialModal.id} closeModal={() => setEditMaterialModal({ id: null, isOpen: false })} />
        ) : null}
        {newMaterialModalIsOpen && <NewMaterial closeModal={() => setNewMaterialModalIsOpen(false)} />}
        {entranceModalIsOpen ? <ModalEntradaAlmoxarifado closeModal={() => setEntranceModalIsOpen((prev) => !prev)} /> : null}
      </div>
    )
  }
}

export default Estoque
