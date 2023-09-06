import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { FaBox } from 'react-icons/fa'
import { ImPriceTag } from 'react-icons/im'
import { AiFillWarning, AiOutlineReload, AiOutlineSearch } from 'react-icons/ai'

import ModalControlAlmoxarifado from '../../components/ModalControlAlmoxarifado'
import ModalNovoItemAlmoxarifado from '../../components/ModalNovoItemAlmoxarifado'
import LoadingPage from '../../components/utils/LoadingPage'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import FetchDataButton from '../../components/utils/Buttons/FetchDataButton'
import ModalEntradaAlmoxarifado from '../../components/ModalEntradaAlmoxarifado'
import { useMaterialsWithFilters } from '../../utils/methods/query/materials'
import { TbReportSearch } from 'react-icons/tb'
import TextInput from '../../components/inputs/Text'
import NumberInput from '../../components/inputs/Number'
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
      <div className="p-6 grow flex flex-col">
        <div className="flex flex-col items-center border-b border-gray-200 pb-2">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">ESTOQUE</h1>
            <Link href="/almoxarifado/pdfRelatorioEstoque">
              <a className="font-bold tracking-tight flex items-center gap-1">
                <p className="text-sm text-gray-600">RELATÓRIO</p>
                <TbReportSearch />
              </a>
            </Link>
          </div>
          <div className="flex items-center gap-1 justify-end w-full">
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
        </div>
        <div className="flex justify-around gap-3 mt-4 flex-wrap w-full grow">
          {materials ? (
            materials.map((material) => (
              <div
                onClick={() => {
                  setEditModal({ isOpen: true, info: material })
                }}
                key={material._id}
                className="w-[350px] lg:w-[350px] hover:bg-blue-100 bg-[#fff] cursor-pointer border border-gray-200 p-3 flex flex-col gap-2"
              >
                <h1 className="font-Poppins text-[#15599a] text-center font-black w-full">{material.nome}</h1>
                <p className="text-lg text-green-600 text-center font-bold">{material.localizacao ? material.localizacao : '-'}</p>
                <p className="text-xs text-gray-500 text-center">{material.nomeTecnico ? material.nomeTecnico : 'NÃO DEFINIDO'}</p>
                <div className="flex items-center justify-around mt-2">
                  <div className="flex items-center gap-2">
                    <FaBox color="#fead41" />
                    <p className="text-xs text-gray-700 text-center">
                      {material.qtde
                        ? Number(material.qtde).toLocaleString('pt-br', {
                            maximumFractionDigits: 2,
                          })
                        : '-'}{' '}
                      {material.grandeza}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImPriceTag />
                    <p className="text-xs text-gray-700 text-center">{material.preco ? `R$${material.preco.toFixed(2).replace('.', ',')}` : '-'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 italic">
                  <AiFillWarning color="rgb(239,68,68)" />
                  <p className="text-gray-500 text-xs">
                    Quantidade mínima definida de: <strong className="text-red-500">{material.qtdeMinima ? material.qtdeMinima : 'N/A'}</strong>{' '}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <LoadingPage />
          )}
        </div>
        <div
          onClick={() => setNewItemModalIsOpen(true)}
          className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
        >
          <p className="uppercase font-bold text-sm">NOVO ITEM</p>
        </div>
        <div
          onClick={() => setEntranceModalIsOpen(true)}
          className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150 ml-36"
        >
          <p className="uppercase font-bold text-sm">ENTRADA</p>
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
