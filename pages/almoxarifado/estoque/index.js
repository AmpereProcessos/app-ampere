import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { FaBox } from 'react-icons/fa'
import { ImPriceTag } from 'react-icons/im'
import { AiFillWarning, AiOutlineReload, AiOutlineSearch } from 'react-icons/ai'

import ModalControlAlmoxarifado from '../../../components/ModalControlAlmoxarifado'
import ModalNovoItemAlmoxarifado from '../../../components/ModalNovoItemAlmoxarifado'
import LoadingPage from '../../../components/utils/LoadingPage'
import FilterButton from '../../../components/utils/Buttons/FilterButton'
import FetchDataButton from '../../../components/utils/Buttons/FetchDataButton'
import ModalEntradaAlmoxarifado from '../../../components/ModalEntradaAlmoxarifado'
import { useMaterialsWithFilters } from '../../../utils/methods/query/materials'
import { TbReportSearch } from 'react-icons/tb'
import TextInput from '../../../components/inputs/Text'
import NumberInput from '../../../components/inputs/Number'
import MaterialCard from '../../../components/identificador/almoxarifado/MaterialCard'
function Estoque() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })
  const isAuthorized = !!session?.user.accessibleRoutes.includes('Almoxarifado') || !!session?.user.accessibleRoutes.includes('Obras')
  const [filters, setFilters] = useState({
    search: '',
    qtyLessThan: null,
  })

  const { data: materials } = useMaterialsWithFilters(isAuthorized, filters)
  const [editModal, setEditModal] = useState({
    isOpen: false,
    info: {},
  })
  const [newItemModalIsOpen, setNewItemModalIsOpen] = useState(false)
  const [entranceModalIsOpen, setEntranceModalIsOpen] = useState(false)

  async function handleUpdates(id) {
    let { data } = await axios.get(`/api/almoxarifado/materiais?id=${id}`)

    setEditModal((prev) => ({ ...prev, info: data }))
  }

  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="flex grow flex-col p-6">
        <div className="flex flex-col items-center border-b border-gray-200 pb-2">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">ESTOQUE</h1>
            <Link href="/almoxarifado/pdfRelatorioEstoque">
              <a className="flex items-center gap-1 font-bold tracking-tight">
                <p className="text-sm text-gray-600">RELATÓRIO</p>
                <TbReportSearch />
              </a>
            </Link>
          </div>
          <div className="flex w-full items-center justify-end gap-1">
            <TextInput
              showLabel={false}
              placeholder={'Filtre pelo nome do produto...'}
              value={filters.search}
              handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
            />
            <NumberInput
              showLabel={false}
              placeholder={'Filtre por quantidade de produto menor que...'}
              value={filters.qtyLessThan}
              handleChange={(value) => setFilters((prev) => ({ ...prev, qtyLessThan: value }))}
            />
          </div>
          <div className="flex w-full items-center justify-start">
            <Link href="/almoxarifado/estoque/analitico">
              <a className="rounded border border-[#fead61] p-1 font-medium text-[#fead61]">ANALÍTICO</a>
            </Link>
          </div>
        </div>
        <div className="mt-4 flex w-full grow flex-wrap justify-around gap-3">
          {materials ? (
            materials.map((material) => (
              <MaterialCard key={material._id} material={material} handleClick={() => setEditModal({ isOpen: true, info: material })} />
            ))
          ) : (
            <LoadingPage />
          )}
        </div>
        <div
          onClick={() => setNewItemModalIsOpen(true)}
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
        {editModal.isOpen && editModal.info ? (
          <ModalControlAlmoxarifado
            credentials={session?.user}
            closeModal={() => setEditModal((prev) => ({ isOpen: false, info: {} }))}
            info={editModal.info}
            handleUpdates={handleUpdates}
          />
        ) : (
          false
        )}
        {newItemModalIsOpen && <ModalNovoItemAlmoxarifado closeModal={() => setNewItemModalIsOpen(false)} />}
        {entranceModalIsOpen ? <ModalEntradaAlmoxarifado closeModal={() => setEntranceModalIsOpen((prev) => !prev)} /> : null}
      </div>
    )
  }
}

export default Estoque
