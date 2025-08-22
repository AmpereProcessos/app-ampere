import axios from 'axios'
import { useSession } from '../../components/providers/SessionProvider'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import LoadingPage from '../../components/utils/LoadingPage'
import VendedorMetaCard from '../../components/VendedorMetaCard'

import { vendedores } from '../../utils/constants'

const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key]
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
    return objectsByKeyValue
  }, {})
const groupByVendedor = groupBy('vendedor')

function GestaoTimeDeVendas() {
  const router = useRouter()
  const { session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  // Filters
  const [filters, setFilters] = useState({
    year: 2023,
    yearFetched: 2023,
    seller: [],
  })
  function filterSellers() {
    var newArr
    var newArrSellersInfo
    if (filters.seller.length > 0) {
      if (!newArr) newArr = vendedores.filter((x) => x.nome != 'NÃO DEFINIDO')
      if (!newArrSellersInfo) newArrSellersInfo = sellersInfo
      newArr = newArr.filter((item) => filters.seller.includes(item.nome))
      newArrSellersInfo = newArrSellersInfo.filter((item) => filters.seller.includes(item.nome))
    }

    if (!newArr) {
      setSellers(vendedores.filter((x) => x.nome != 'NÃO DEFINIDO'))
      setFilteredSellersInfo([...sellersInfo])
      return
    } else {
      setFilteredSellersInfo(newArrSellersInfo)
      setSellers(newArr)
      return
    }
  }
  // Data
  const [stats, setStats] = useState([])
  const [sellersInfo, setSellersInfo] = useState([])
  const [filteredSellersInfo, setFilteredSellersInfo] = useState([])
  const [sellers, setSellers] = useState(vendedores.filter((x) => x.nome != 'NÃO DEFINIDO' && !!x.ativo))
  // Fetch functions
  function getStats(ano) {
    setFilters({ ...filters, yearFetched: ano })
    axios.get(`/api/stats/gestaoTimeVendas?ano=${ano}`).then((res) => {
      let newArr = groupByVendedor(res.data)
      setStats(newArr)
    })
  }
  function getVendedoresInfo() {
    axios.get('/api/auxiliares/vendedoresInfo').then((res) => {
      console.log(res.data)
      setSellersInfo(res.data)
      setFilteredSellersInfo(res.data)
    })
  }
  // UI feeding function
  function getMonthlyPerformance(nomeVendedor, mes) {
    let vendedorArr = stats[nomeVendedor]
    if (vendedorArr) {
      let mesObj = vendedorArr.filter((obj) => obj.mes == mes)[0]
      let vendedorInfo = sellersInfo.filter((item) => item.nome == nomeVendedor)[0]
      let metaVendedor = vendedorInfo && vendedorInfo[filters.yearFetched] ? vendedorInfo[filters.yearFetched][mes - 1] : 0
      if (mesObj) {
        let text = `${Number(mesObj.valorVendido).toFixed(2).replace('.', ',')} / ${metaVendedor}`
        if (mesObj.valorVendido > metaVendedor) {
          return {
            valorVendido: `R$ ${Number(mesObj.valorVendido).toLocaleString('pt-br', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            meta: `R$ ${Number(metaVendedor).toLocaleString('pt-br', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            color: 'bg-green-500 text-white',
            borderColor: 'border-white',
          }
        } else {
          return {
            valorVendido: `R$ ${Number(mesObj.valorVendido).toLocaleString('pt-br', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            meta: `R$ ${Number(metaVendedor).toLocaleString('pt-br', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            color: 'bg-red-500 text-white',
            borderColor: 'border-white',
          }
        }
      } else {
        return {
          valorVendido: '-',
          meta: `R$ ${Number(metaVendedor).toLocaleString('pt-br', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          color: 'bg-white text-gray-600',
          borderColor: 'border-gray-600',
        }
      }
    } else {
      return {
        valorVendido: '-',
        meta: '-',
        color: 'bg-white text-gray-600',
        borderColor: 'border-gray-600',
      }
    }
  }
  useEffect(() => {
    if (session?.user?.manager) {
      getVendedoresInfo()
      getStats(2023)
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])
  // console.log(stats);

  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="flex grow flex-col p-6">
        <div className="flex flex-col items-center border-b border-[#15599a] pb-2">
          <h1 className="text-center font-bold text-[#15599a]">CONTROLE E GESTÃO DO TIME DE VENDAS</h1>
          <div className="my-2 flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-center font-bold">ANO DE ANÁLISE:</h1>
              <input
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: Number(e.target.value) })}
                type="number"
                className="w-[200px] rounded-sm border border-gray-300 p-1 text-center text-gray-600 outline-none"
              />
            </div>
            <button
              onClick={() => getStats(filters.year)}
              className="self-end rounded bg-[#15599a] p-1 text-center font-bold text-[#fead61] hover:bg-[#fead61] hover:text-[#15599a]"
            >
              BUSCAR DADOS
            </button>
          </div>
        </div>
        <div className="my-2 flex w-full flex-col items-center">
          <h1 className="text-center text-xl font-bold">POTÊNCIA VENDIDA POR MÊS POR VENDEDOR</h1>
          <div className="my-2 flex flex-wrap items-center gap-2">
            <Select
              isMulti
              placeholder="VENDEDOR"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  seller: e.map((x) => x.value),
                })
              }
              options={vendedores
                .filter((x) => x.nome != 'NÃO DEFINIDO')
                .map((vendedor) => {
                  return { label: vendedor.nome, value: vendedor.nome }
                })}
            />
            <button
              onClick={filterSellers}
              className="h-[36px] self-end rounded bg-[#15599a] p-2 text-center font-bold text-[#fead61] hover:bg-[#fead61] hover:text-[#15599a]"
            >
              FILTRAR
            </button>
          </div>
          <div className="grid-cols-13 grid w-full items-center rounded-tr-lg rounded-tl-lg border border-gray-300">
            <h1 className="rounded-tl-lg border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">NOME</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">JANEIRO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">FEVEREIRO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">MARÇO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">ABRIL</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">MAIO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">JUNHO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">JULHO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">AGOSTO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">SETEMBRO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">OUTUBRO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">NOVEMBRO</h1>
            <h1 className="rounded-tr-lg bg-[#15599a] p-1 text-center font-bold text-white">DEZEMBRO</h1>
          </div>
          {sellersInfo ? (
            sellers.map((vendedor, index) => (
              <div key={index} className="grid-cols-13 grid w-full items-center border border-gray-300">
                <div
                  className={`flex h-[60px] items-center justify-center border-r border-gray-300 p-1 text-center text-xxs font-bold text-gray-600 lg:text-xs`}
                >
                  {vendedor.nome}
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-1 text-center text-xxs font-bold lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 1).color
                  } h-[60px] border-r border-gray-300`}
                >
                  {index == 0 ? (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 1).borderColor}`}>
                        META: {getMonthlyPerformance(vendedor.nome, 1).meta}
                      </p>
                      <p className="pt-1 text-center">ALCANÇADO: {getMonthlyPerformance(vendedor.nome, 1).valorVendido}</p>
                    </>
                  ) : (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 1).borderColor}`}>
                        {getMonthlyPerformance(vendedor.nome, 1).meta}
                      </p>
                      <p className="pt-1 text-center">{getMonthlyPerformance(vendedor.nome, 1).valorVendido}</p>
                    </>
                  )}
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-1 text-center text-xxs font-bold lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 2).color
                  } h-[60px] border-r border-gray-300`}
                >
                  {index == 0 ? (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 2).borderColor}`}>
                        META: {getMonthlyPerformance(vendedor.nome, 2).meta}
                      </p>
                      <p className="pt-1 text-center">ALCANÇADO: {getMonthlyPerformance(vendedor.nome, 2).valorVendido}</p>
                    </>
                  ) : (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 2).borderColor}`}>
                        {getMonthlyPerformance(vendedor.nome, 2).meta}
                      </p>
                      <p className="pt-1 text-center">{getMonthlyPerformance(vendedor.nome, 2).valorVendido}</p>
                    </>
                  )}
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-1 text-center text-xxs font-bold lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 3).color
                  } h-[60px] border-r border-gray-300`}
                >
                  {index == 0 ? (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 3).borderColor}`}>
                        META: {getMonthlyPerformance(vendedor.nome, 3).meta}
                      </p>
                      <p className="pt-1 text-center">ALCANÇADO: {getMonthlyPerformance(vendedor.nome, 3).valorVendido}</p>
                    </>
                  ) : (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 3).borderColor}`}>
                        {getMonthlyPerformance(vendedor.nome, 3).meta}
                      </p>
                      <p className="pt-1 text-center">{getMonthlyPerformance(vendedor.nome, 3).valorVendido}</p>
                    </>
                  )}
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-1 text-center text-xxs font-bold lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 4).color
                  } h-[60px] border-r border-gray-300`}
                >
                  {index == 0 ? (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 4).borderColor}`}>
                        META: {getMonthlyPerformance(vendedor.nome, 4).meta}
                      </p>
                      <p className="pt-1 text-center">ALCANÇADO: {getMonthlyPerformance(vendedor.nome, 4).valorVendido}</p>
                    </>
                  ) : (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 4).borderColor}`}>
                        {getMonthlyPerformance(vendedor.nome, 4).meta}
                      </p>
                      <p className="pt-1 text-center">{getMonthlyPerformance(vendedor.nome, 4).valorVendido}</p>
                    </>
                  )}
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-1 text-center text-xxs font-bold lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 5).color
                  } h-[60px] border-r border-gray-300`}
                >
                  {index == 0 ? (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 5).borderColor}`}>
                        META: {getMonthlyPerformance(vendedor.nome, 5).meta}
                      </p>
                      <p className="pt-1 text-center">ALCANÇADO: {getMonthlyPerformance(vendedor.nome, 5).valorVendido}</p>
                    </>
                  ) : (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 5).borderColor}`}>
                        {getMonthlyPerformance(vendedor.nome, 5).meta}
                      </p>
                      <p className="pt-1 text-center">{getMonthlyPerformance(vendedor.nome, 5).valorVendido}</p>
                    </>
                  )}
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-1 text-center text-xxs font-bold lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 6).color
                  } h-[60px] border-r border-gray-300`}
                >
                  {index == 0 ? (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 6).borderColor}`}>
                        META: {getMonthlyPerformance(vendedor.nome, 6).meta}
                      </p>
                      <p className="pt-1 text-center">ALCANÇADO: {getMonthlyPerformance(vendedor.nome, 6).valorVendido}</p>
                    </>
                  ) : (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 6).borderColor}`}>
                        {getMonthlyPerformance(vendedor.nome, 6).meta}
                      </p>
                      <p className="pt-1 text-center">{getMonthlyPerformance(vendedor.nome, 6).valorVendido}</p>
                    </>
                  )}
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-1 text-center text-xxs font-bold lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 7).color
                  } h-[60px] border-r border-gray-300`}
                >
                  {index == 0 ? (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 7).borderColor}`}>
                        META: {getMonthlyPerformance(vendedor.nome, 7).meta}
                      </p>
                      <p className="pt-1 text-center">ALCANÇADO: {getMonthlyPerformance(vendedor.nome, 7).valorVendido}</p>
                    </>
                  ) : (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 7).borderColor}`}>
                        {getMonthlyPerformance(vendedor.nome, 7).meta}
                      </p>
                      <p className="pt-1 text-center">{getMonthlyPerformance(vendedor.nome, 7).valorVendido}</p>
                    </>
                  )}
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-1 text-center text-xxs font-bold lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 8).color
                  } h-[60px] border-r border-gray-300`}
                >
                  {index == 0 ? (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 8).borderColor}`}>
                        META: {getMonthlyPerformance(vendedor.nome, 8).meta}
                      </p>
                      <p className="pt-1 text-center">ALCANÇADO: {getMonthlyPerformance(vendedor.nome, 8).valorVendido}</p>
                    </>
                  ) : (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 8).borderColor}`}>
                        {getMonthlyPerformance(vendedor.nome, 8).meta}
                      </p>
                      <p className="pt-1 text-center">{getMonthlyPerformance(vendedor.nome, 8).valorVendido}</p>
                    </>
                  )}
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-1 text-center text-xxs font-bold lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 9).color
                  } h-[60px] border-r border-gray-300`}
                >
                  {index == 0 ? (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 9).borderColor}`}>
                        META: {getMonthlyPerformance(vendedor.nome, 9).meta}
                      </p>
                      <p className="pt-1 text-center">ALCANÇADO: {getMonthlyPerformance(vendedor.nome, 9).valorVendido}</p>
                    </>
                  ) : (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 9).borderColor}`}>
                        {getMonthlyPerformance(vendedor.nome, 9).meta}
                      </p>
                      <p className="pt-1 text-center">{getMonthlyPerformance(vendedor.nome, 9).valorVendido}</p>
                    </>
                  )}
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-1 text-center text-xxs font-bold lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 10).color
                  } h-[60px] border-r border-gray-300`}
                >
                  {index == 0 ? (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 10).borderColor}`}>
                        META: {getMonthlyPerformance(vendedor.nome, 10).meta}
                      </p>
                      <p className="pt-1 text-center">ALCANÇADO: {getMonthlyPerformance(vendedor.nome, 10).valorVendido}</p>
                    </>
                  ) : (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 10).borderColor}`}>
                        {getMonthlyPerformance(vendedor.nome, 10).meta}
                      </p>
                      <p className="pt-1 text-center">{getMonthlyPerformance(vendedor.nome, 10).valorVendido}</p>
                    </>
                  )}
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-1 text-center text-xxs font-bold lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 11).color
                  } h-[60px] border-r border-gray-300`}
                >
                  {index == 0 ? (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 11).borderColor}`}>
                        META: {getMonthlyPerformance(vendedor.nome, 11).meta}
                      </p>
                      <p className="pt-1 text-center">ALCANÇADO: {getMonthlyPerformance(vendedor.nome, 11).valorVendido}</p>
                    </>
                  ) : (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 11).borderColor}`}>
                        {getMonthlyPerformance(vendedor.nome, 11).meta}
                      </p>
                      <p className="pt-1 text-center">{getMonthlyPerformance(vendedor.nome, 11).valorVendido}</p>
                    </>
                  )}
                </div>
                <div
                  className={`flex flex-col items-center justify-center p-1 text-center text-xxs font-bold lg:text-xs ${getMonthlyPerformance(vendedor.nome, 12).color} h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 12).borderColor}`}>
                        META: {getMonthlyPerformance(vendedor.nome, 12).meta}
                      </p>
                      <p className="pt-1 text-center">ALCANÇADO: {getMonthlyPerformance(vendedor.nome, 12).valorVendido}</p>
                    </>
                  ) : (
                    <>
                      <p className={`w-full border-b pb-1 text-center ${getMonthlyPerformance(vendedor.nome, 12).borderColor}`}>
                        {getMonthlyPerformance(vendedor.nome, 12).meta}
                      </p>
                      <p className="pt-1 text-center">{getMonthlyPerformance(vendedor.nome, 12).valorVendido}</p>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="my-2 flex w-full flex-col items-center">
          <h1 className="text-center text-xl font-bold">META MENSAL POR VENDEDOR</h1>
          <div className="grid-cols-14 grid w-full items-center rounded-tr-lg rounded-tl-lg border border-gray-300">
            <h1 className="rounded-tl-lg border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">NOME</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">JANEIRO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">FEVEREIRO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">MARÇO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">ABRIL</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">MAIO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">JUNHO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">JULHO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">AGOSTO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">SETEMBRO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">OUTUBRO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">NOVEMBRO</h1>
            <h1 className="border-r border-white bg-[#15599a] p-1 text-center font-bold text-white">DEZEMBRO</h1>
            <h1 className="rounded-tr-lg bg-[#15599a] p-1 text-center font-bold text-white">AÇÃO</h1>
          </div>
          {filteredSellersInfo ? (
            filteredSellersInfo.map((vendedor, index) => (
              <VendedorMetaCard key={vendedor.nome} vendedor={vendedor} ano={filters.yearFetched} getVendedoresInfo={getVendedoresInfo} />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  }
}

export default GestaoTimeDeVendas
