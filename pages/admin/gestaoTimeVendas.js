import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
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
  const { credentials } = useContext(AppContext);
  const router = useRouter();
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
      console.log(newArrSellersInfo);
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
    vendedores.filter((x) => x.nome != "NÃO DEFINIDO")
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
        let text = `${Number(mesObj.potVendida)
          .toFixed(2)
          .replace(".", ",")} / ${metaVendedor}`;
        if (mesObj.potVendida > metaVendedor) {
          return {
            potVendida: Number(mesObj.potVendida).toFixed(2).replace(".", ","),
            meta: metaVendedor,
            color: "bg-green-500 text-white",
            borderColor: "border-white",
          };
        } else {
          return {
            potVendida: Number(mesObj.potVendida).toFixed(2).replace(".", ","),
            meta: metaVendedor,
            color: "bg-red-500 text-white",
            borderColor: "border-white",
          };
        }
      } else {
        return {
          potVendida: "-",
          meta: metaVendedor,
          color: "bg-white text-gray-600",
          borderColor: "border-gray-600",
        };
      }
    } else {
      return {
        potVendida: "-",
        meta: "-",
        color: "bg-white text-gray-600",
        borderColor: "border-gray-600",
      };
    }
  }
  useEffect(() => {
    if (credentials.manager || credentials.visualizacao == "REGIONAL") {
      getVendedoresInfo();
      getStats(2023);
    } else {
      router.push("/");
    }
  }, []);
  console.log(filteredSellersInfo);
  // console.log(stats);
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
                      {getMonthlyPerformance(vendedor.nome, 1).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 1).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 2).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 2).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 3).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 3).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 4).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 4).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 5).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 5).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 6).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 6).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 7).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 7).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 8).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 8).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 9).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 9).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 10).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 10).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 11).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 11).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 12).potVendida}
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
                      {getMonthlyPerformance(vendedor.nome, 12).potVendida}
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

export default GestaoTimeDeVendas;
