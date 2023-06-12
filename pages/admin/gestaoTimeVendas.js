import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import LoadingPage from "../../components/utils/LoadingPage";
import VendedorMetaCard from "../../components/VendedorMetaCard";
import { AppContext } from "../../context/AppContext";
import { vendedores } from "../../utils/constants";

const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
const groupByVendedor = groupBy("vendedor");

function GestaoTimeDeVendas() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const { credentials } = useContext(AppContext);
  // Filters
  const [filters, setFilters] = useState({
    year: 2023,
    yearFetched: 2023,
    seller: [],
  });
  function filterSellers() {
    var newArr;
    var newArrSellersInfo;
    if (filters.seller.length > 0) {
      if (!newArr) newArr = vendedores.filter((x) => x.nome != "NÃO DEFINIDO");
      if (!newArrSellersInfo) newArrSellersInfo = sellersInfo;
      newArr = newArr.filter((item) => filters.seller.includes(item.nome));
      newArrSellersInfo = newArrSellersInfo.filter((item) =>
        filters.seller.includes(item.nome)
      );
    }

    if (!newArr) {
      setSellers(vendedores.filter((x) => x.nome != "NÃO DEFINIDO"));
      setFilteredSellersInfo([...sellersInfo]);
      return;
    } else {
      setFilteredSellersInfo(newArrSellersInfo);
      setSellers(newArr);
      return;
    }
  }
  // Data
  const [stats, setStats] = useState([]);
  const [sellersInfo, setSellersInfo] = useState([]);
  const [filteredSellersInfo, setFilteredSellersInfo] = useState([]);
  const [sellers, setSellers] = useState(
    vendedores.filter((x) => x.nome != "NÃO DEFINIDO" && !!x.ativo)
  );
  // Fetch functions
  function getStats(ano) {
    setFilters({ ...filters, yearFetched: ano });
    axios.get(`/api/stats/gestaoTimeVendas?ano=${ano}`).then((res) => {
      let newArr = groupByVendedor(res.data);
      setStats(newArr);
    });
  }
  function getVendedoresInfo() {
    axios.get("/api/auxiliares/vendedoresInfo").then((res) => {
      console.log(res.data);
      setSellersInfo(res.data);
      setFilteredSellersInfo(res.data);
    });
  }
  // UI feeding function
  function getMonthlyPerformance(nomeVendedor, mes) {
    let vendedorArr = stats[nomeVendedor];
    if (vendedorArr) {
      let mesObj = vendedorArr.filter((obj) => obj.mes == mes)[0];
      let vendedorInfo = sellersInfo.filter(
        (item) => item.nome == nomeVendedor
      )[0];
      let metaVendedor =
        vendedorInfo && vendedorInfo[filters.yearFetched]
          ? vendedorInfo[filters.yearFetched][mes - 1]
          : 0;
      if (mesObj) {
        let text = `${Number(mesObj.valorVendido)
          .toFixed(2)
          .replace(".", ",")} / ${metaVendedor}`;
        if (mesObj.valorVendido > metaVendedor) {
          return {
            valorVendido: `R$ ${Number(mesObj.valorVendido).toLocaleString(
              "pt-br",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`,
            meta: `R$ ${Number(metaVendedor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            color: "bg-green-500 text-white",
            borderColor: "border-white",
          };
        } else {
          return {
            valorVendido: `R$ ${Number(mesObj.valorVendido).toLocaleString(
              "pt-br",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`,
            meta: `R$ ${Number(metaVendedor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            color: "bg-red-500 text-white",
            borderColor: "border-white",
          };
        }
      } else {
        return {
          valorVendido: "-",
          meta: `R$ ${Number(metaVendedor).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          color: "bg-white text-gray-600",
          borderColor: "border-gray-600",
        };
      }
    } else {
      return {
        valorVendido: "-",
        meta: "-",
        color: "bg-white text-gray-600",
        borderColor: "border-gray-600",
      };
    }
  }
  useEffect(() => {
    if (session?.user?.manager || session?.user?.visualizacao == "REGIONAL") {
      getVendedoresInfo();
      getStats(2023);
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  // console.log(stats);

  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="flex flex-col p-6 grow">
        <div className="flex flex-col items-center pb-2 border-b border-[#15599a]">
          <h1 className="text-center text-[#15599a] font-bold">
            CONTROLE E GESTÃO DO TIME DE VENDAS
          </h1>
          <div className="flex items-center justify-center gap-2 my-2">
            <div className="flex items-center gap-2">
              <h1 className="text-center font-bold">ANO DE ANÁLISE:</h1>
              <input
                value={filters.year}
                onChange={(e) =>
                  setFilters({ ...filters, year: Number(e.target.value) })
                }
                type="number"
                className="outline-none w-[200px] text-center text-gray-600 border border-gray-200 rounded-sm p-1"
              />
            </div>
            <button
              onClick={() => getStats(filters.year)}
              className="bg-[#15599a] text-[#fead61] hover:bg-[#fead61] hover:text-[#15599a] font-bold text-center rounded p-1 self-end"
            >
              BUSCAR DADOS
            </button>
          </div>
        </div>
        <div className="flex flex-col my-2 w-full items-center">
          <h1 className="text-center font-bold text-xl">
            POTÊNCIA VENDIDA POR MÊS POR VENDEDOR
          </h1>
          <div className="flex items-center flex-wrap gap-2 my-2">
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
                .filter((x) => x.nome != "NÃO DEFINIDO")
                .map((vendedor) => {
                  return { label: vendedor.nome, value: vendedor.nome };
                })}
            />
            <button
              onClick={filterSellers}
              className="bg-[#15599a] text-[#fead61] hover:bg-[#fead61] hover:text-[#15599a] font-bold text-center rounded p-2 h-[36px] self-end"
            >
              FILTRAR
            </button>
          </div>
          <div className="grid grid-cols-13 items-center border border-gray-200 rounded-tr-lg rounded-tl-lg w-full">
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white rounded-tl-lg">
              NOME
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              JANEIRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              FEVEREIRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              MARÇO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              ABRIL
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              MAIO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              JUNHO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              JULHO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              AGOSTO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              SETEMBRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              OUTUBRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              NOVEMBRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white rounded-tr-lg">
              DEZEMBRO
            </h1>
          </div>
          {sellersInfo ? (
            sellers.map((vendedor, index) => (
              <div
                key={index}
                className="grid grid-cols-13 items-center border border-gray-200 w-full"
              >
                <div
                  className={`p-1 font-bold flex items-center justify-center text-center text-xxs lg:text-xs text-gray-600 border-r border-gray-200 h-[60px]`}
                >
                  {vendedor.nome}
                </div>
                <div
                  className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 1).color
                  } border-r border-gray-200 h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 1).borderColor
                        }`}
                      >
                        META: {getMonthlyPerformance(vendedor.nome, 1).meta}
                      </p>
                      <p className="text-center pt-1">
                        ALCANÇADO:{" "}
                        {getMonthlyPerformance(vendedor.nome, 1).valorVendido}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 1).borderColor
                        }`}
                      >
                        {getMonthlyPerformance(vendedor.nome, 1).meta}
                      </p>
                      <p className="text-center pt-1">
                        {getMonthlyPerformance(vendedor.nome, 1).valorVendido}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 2).color
                  } border-r border-gray-200 h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 2).borderColor
                        }`}
                      >
                        META: {getMonthlyPerformance(vendedor.nome, 2).meta}
                      </p>
                      <p className="text-center pt-1">
                        ALCANÇADO:{" "}
                        {getMonthlyPerformance(vendedor.nome, 2).valorVendido}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 2).borderColor
                        }`}
                      >
                        {getMonthlyPerformance(vendedor.nome, 2).meta}
                      </p>
                      <p className="text-center pt-1">
                        {getMonthlyPerformance(vendedor.nome, 2).valorVendido}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 3).color
                  } border-r border-gray-200 h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 3).borderColor
                        }`}
                      >
                        META: {getMonthlyPerformance(vendedor.nome, 3).meta}
                      </p>
                      <p className="text-center pt-1">
                        ALCANÇADO:{" "}
                        {getMonthlyPerformance(vendedor.nome, 3).valorVendido}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 3).borderColor
                        }`}
                      >
                        {getMonthlyPerformance(vendedor.nome, 3).meta}
                      </p>
                      <p className="text-center pt-1">
                        {getMonthlyPerformance(vendedor.nome, 3).valorVendido}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 4).color
                  } border-r border-gray-200 h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 4).borderColor
                        }`}
                      >
                        META: {getMonthlyPerformance(vendedor.nome, 4).meta}
                      </p>
                      <p className="text-center pt-1">
                        ALCANÇADO:{" "}
                        {getMonthlyPerformance(vendedor.nome, 4).valorVendido}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 4).borderColor
                        }`}
                      >
                        {getMonthlyPerformance(vendedor.nome, 4).meta}
                      </p>
                      <p className="text-center pt-1">
                        {getMonthlyPerformance(vendedor.nome, 4).valorVendido}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 5).color
                  } border-r border-gray-200 h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 5).borderColor
                        }`}
                      >
                        META: {getMonthlyPerformance(vendedor.nome, 5).meta}
                      </p>
                      <p className="text-center pt-1">
                        ALCANÇADO:{" "}
                        {getMonthlyPerformance(vendedor.nome, 5).valorVendido}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 5).borderColor
                        }`}
                      >
                        {getMonthlyPerformance(vendedor.nome, 5).meta}
                      </p>
                      <p className="text-center pt-1">
                        {getMonthlyPerformance(vendedor.nome, 5).valorVendido}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 6).color
                  } border-r border-gray-200 h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 6).borderColor
                        }`}
                      >
                        META: {getMonthlyPerformance(vendedor.nome, 6).meta}
                      </p>
                      <p className="text-center pt-1">
                        ALCANÇADO:{" "}
                        {getMonthlyPerformance(vendedor.nome, 6).valorVendido}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 6).borderColor
                        }`}
                      >
                        {getMonthlyPerformance(vendedor.nome, 6).meta}
                      </p>
                      <p className="text-center pt-1">
                        {getMonthlyPerformance(vendedor.nome, 6).valorVendido}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 7).color
                  } border-r border-gray-200 h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 7).borderColor
                        }`}
                      >
                        META: {getMonthlyPerformance(vendedor.nome, 7).meta}
                      </p>
                      <p className="text-center pt-1">
                        ALCANÇADO:{" "}
                        {getMonthlyPerformance(vendedor.nome, 7).valorVendido}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 7).borderColor
                        }`}
                      >
                        {getMonthlyPerformance(vendedor.nome, 7).meta}
                      </p>
                      <p className="text-center pt-1">
                        {getMonthlyPerformance(vendedor.nome, 7).valorVendido}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 8).color
                  } border-r border-gray-200 h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 8).borderColor
                        }`}
                      >
                        META: {getMonthlyPerformance(vendedor.nome, 8).meta}
                      </p>
                      <p className="text-center pt-1">
                        ALCANÇADO:{" "}
                        {getMonthlyPerformance(vendedor.nome, 8).valorVendido}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 8).borderColor
                        }`}
                      >
                        {getMonthlyPerformance(vendedor.nome, 8).meta}
                      </p>
                      <p className="text-center pt-1">
                        {getMonthlyPerformance(vendedor.nome, 8).valorVendido}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 9).color
                  } border-r border-gray-200 h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 9).borderColor
                        }`}
                      >
                        META: {getMonthlyPerformance(vendedor.nome, 9).meta}
                      </p>
                      <p className="text-center pt-1">
                        ALCANÇADO:{" "}
                        {getMonthlyPerformance(vendedor.nome, 9).valorVendido}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 9).borderColor
                        }`}
                      >
                        {getMonthlyPerformance(vendedor.nome, 9).meta}
                      </p>
                      <p className="text-center pt-1">
                        {getMonthlyPerformance(vendedor.nome, 9).valorVendido}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 10).color
                  } border-r border-gray-200 h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 10).borderColor
                        }`}
                      >
                        META: {getMonthlyPerformance(vendedor.nome, 10).meta}
                      </p>
                      <p className="text-center pt-1">
                        ALCANÇADO:{" "}
                        {getMonthlyPerformance(vendedor.nome, 10).valorVendido}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 10).borderColor
                        }`}
                      >
                        {getMonthlyPerformance(vendedor.nome, 10).meta}
                      </p>
                      <p className="text-center pt-1">
                        {getMonthlyPerformance(vendedor.nome, 10).valorVendido}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 11).color
                  } border-r border-gray-200 h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 11).borderColor
                        }`}
                      >
                        META: {getMonthlyPerformance(vendedor.nome, 11).meta}
                      </p>
                      <p className="text-center pt-1">
                        ALCANÇADO:{" "}
                        {getMonthlyPerformance(vendedor.nome, 11).valorVendido}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 11).borderColor
                        }`}
                      >
                        {getMonthlyPerformance(vendedor.nome, 11).meta}
                      </p>
                      <p className="text-center pt-1">
                        {getMonthlyPerformance(vendedor.nome, 11).valorVendido}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={`p-1 font-bold flex flex-col items-center justify-center text-center text-xxs lg:text-xs ${
                    getMonthlyPerformance(vendedor.nome, 12).color
                  } h-[60px]`}
                >
                  {index == 0 ? (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 12).borderColor
                        }`}
                      >
                        META: {getMonthlyPerformance(vendedor.nome, 12).meta}
                      </p>
                      <p className="text-center pt-1">
                        ALCANÇADO:{" "}
                        {getMonthlyPerformance(vendedor.nome, 12).valorVendido}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`text-center pb-1 w-full border-b ${
                          getMonthlyPerformance(vendedor.nome, 12).borderColor
                        }`}
                      >
                        {getMonthlyPerformance(vendedor.nome, 12).meta}
                      </p>
                      <p className="text-center pt-1">
                        {getMonthlyPerformance(vendedor.nome, 12).valorVendido}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col my-2 w-full items-center">
          <h1 className="text-center font-bold text-xl">
            META MENSAL POR VENDEDOR
          </h1>
          <div className="grid grid-cols-14 items-center border border-gray-200 rounded-tr-lg rounded-tl-lg w-full">
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white rounded-tl-lg">
              NOME
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              JANEIRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              FEVEREIRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              MARÇO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              ABRIL
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              MAIO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              JUNHO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              JULHO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              AGOSTO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              SETEMBRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              OUTUBRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              NOVEMBRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              DEZEMBRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white rounded-tr-lg">
              AÇÃO
            </h1>
          </div>
          {filteredSellersInfo ? (
            filteredSellersInfo.map((vendedor, index) => (
              <VendedorMetaCard
                key={vendedor.nome}
                vendedor={vendedor}
                ano={filters.yearFetched}
                getVendedoresInfo={getVendedoresInfo}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}

export default GestaoTimeDeVendas;
