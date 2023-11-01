import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Logo from '../../utils//images/logo-texto-azul-vertical.png'
import LoadingPage from '../../components/utils/LoadingPage'
import Image from 'next/image'
import Link from 'next/link'
import Select from 'react-select'
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri'
import { formatDecimalPlaces } from '../../utils/constants'
import { IoMdAlert } from 'react-icons/io'

function RelatorioEstoque() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })
  const [showFilter, setShowFilter] = useState(true)
  const [toBuyFilter, setToBuyFilter] = useState(false)
  const [materials, setMaterials] = useState()
  const [hideMaterials, setHideMaterials] = useState([])
  function getMateriais() {
    axios.get('/api/almoxarifado/materiais').then((res) => {
      setMaterials(res.data)
    })
  }
  useEffect(() => {
    // console
    // if (session?.user.accessibleRoutes.includes("Almoxarifado")) {
    if (!materials) {
      getMateriais()
    }
    //   }
    // } else {
    //   if (session?.user) router.push("/");
    // }
  }, [])

  function filterItems(materiais, toBuyFilter) {
    var filtered
    filtered = materiais.filter((item) => !hideMaterials.includes(item.nome))
    if (toBuyFilter)
      filtered = filtered.filter((item) => {
        const qty = item.qtde
        const minQty = item.qtdeMinima
        if (minQty) return qty <= minQty
        return qty <= 0
      })
    return filtered
  }
  function checkQty({ qty, minQty }) {
    console.log(minQty, !isNaN(minQty))
    if (!isNaN(minQty)) {
      return qty <= minQty
    } else {
      return qty <= 0
    }
  }
  if (status == 'loading') return <LoadingPage />
  return (
    <div className="w-[21cm] h-[29.7cm] p-4 px-4 flex flex-col">
      <div className={`flex flex-col items-center w-full gap-2 ${!showFilter ? 'hidden' : ''}`}>
        <div className="w-full flex gap-2 items-center">
          <div className="grow">
            <Select
              isMulti
              placeholder="ESCONDER ITENS"
              styles={{
                control: (base, state) => ({
                  ...base,
                  width: '100%',
                  minHeight: '41px',
                }),
              }}
              onChange={(e) => setHideMaterials(e.map((x) => x.value))}
              options={
                materials
                  ? materials.map((material) => {
                      return {
                        label: material.nome,
                        value: material.nome,
                      }
                    })
                  : []
              }
            />
          </div>
          <button
            onClick={() => {
              setToBuyFilter((prev) => !prev)
            }}
            className={`p-2 rounded w-fit h-full border border-red-500  ${
              toBuyFilter ? 'bg-red-500 text-white' : 'bg-transparent text-red-500'
            } font-medium text-center`}
          >
            PARA COMPRAR
          </button>
        </div>
        {/* <button
            onClick={() => setShowFilter(false)}
            className="w-fit p-2 bg-[#15559a] text-white hover:bg-[#fead61] hover:text-black font-bold rounded-md"
          >
            VISUALIZAR PDF
          </button> */}
      </div>

      <div className="grid items-center grid-cols-3 w-full my-2 px-2">
        <div className="flex items-center justify-center text-2xl hover:text-[#fead61]">
          {showFilter ? (
            <RiArrowDownSFill style={{ cursor: 'pointer' }} onClick={() => setShowFilter(false)} />
          ) : (
            <RiArrowUpSFill style={{ cursor: 'pointer' }} onClick={() => setShowFilter(true)} />
          )}
        </div>
        <h1 className="text-center font-bold text-xl">RELATÓRIO DE ESTOQUE</h1>
        <Link href={'/almoxarifado/estoque'}>
          <div className="flex items-center justify-end cursor-pointer">
            <Image height={60} width={60} src={Logo} />
          </div>
        </Link>
      </div>
      <div className="w-full grow flex flex-col">
        <div className="grid grid-cols-9 gap-x-2 border-b bg-gray-800 w-full">
          <p className="text-sm col-span-1 font-medium text-white px-6 py-4 text-center">INDEX</p>
          <p className="text-sm col-span-4 font-medium text-white px-6 py-4 text-center">NOME</p>
          <p className="text-sm col-span-2 font-medium text-white px-6 py-4 text-center">CÓDIGO</p>
          <p className="text-sm col-span-1 font-medium text-white px-6 py-4 text-center">QTDE</p>
          <p className="text-sm col-span-1 font-medium text-white px-6 py-4 text-center">PREÇO</p>
        </div>
        {materials && materials?.length
          ? filterItems(materials, toBuyFilter).map((material, index) => (
              <div
                key={index}
                // prettier-ignore
                className={`grid ${checkQty({qty: material.qtde,minQty: material.qtdeMinima,})? 'bg-red-200' : ''} grid-cols-9 gap-x-2 border-b border-x border-gray-700`}
              >
                <div className="col-span-1 py-4 text-center whitespace-nowrap text-xs font-medium text-gray-900">{index + 1}</div>
                <div className="flex items-center gap-2 text-xs col-span-4 text-gray-900 font-medium  py-4 text-center whitespace-nowrap ">
                  {checkQty({ qty: material.qtde, minQty: material.qtdeMinima }) ? <IoMdAlert size={'25px'} color={'rgb(239,68,68)'} /> : null}
                  {material.nome}
                </div>
                <div className="text-xs col-span-2 break-words text-gray-900 font-medium  py-4 text-center whitespace-nowrap">
                  {material.codigo ? material.codigo : '-'}
                </div>
                <div className="text-sm col-span-1 text-gray-900 font-medium  py-4 text-center whitespace-nowrap">
                  {material.qtde && material.qtde > 0 ? formatDecimalPlaces(material.qtde) : '-'}
                </div>
                <div className="text-sm col-span-1 text-gray-900 font-medium  py-4 text-center whitespace-nowrap">
                  {material.preco && material.preco > 0 ? formatDecimalPlaces(material.preco) : '-'}
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  )
}

export default RelatorioEstoque
