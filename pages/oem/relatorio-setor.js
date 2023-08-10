import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingPage from "../../components/utils/LoadingPage";
import { useOeMReportData } from "../../utils/methods/query/oem";
import { formatToMoney, validateAuthorization } from "../../utils/constants";
import { FaSolarPanel, FaHouse, FaHome } from "react-icons/fa";
import dayjs from "dayjs";
const dateParam = "2022-12-31T24:00:00.000Z";
const limitDateParam = "2023-12-31T24:00:00.000Z";
const secondScenarioMaxDateParam = "2023-03-31T24:00:00.000Z";
const dilutionMaxDateParam = "2024-03-31T24:00:00.000Z";

function getMonthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}
function RelatorioSetor() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/auth/authHome");
    },
  });
  const { data, isFetching, isSuccess } = useOeMReportData(
    validateAuthorization(session, "O&M")
  );
  const filteredDataByMaxDateParam = data
    ? data.filter((x) => new Date(x.medidor.data) < new Date(dateParam))
    : [];
  const filteredDataByMaxDateParamSecondScenario = data
    ? data.filter(
        (x) => new Date(x.medidor.data) < new Date(secondScenarioMaxDateParam)
      )
    : [];
  const filteredDataByDilutionPeriod = data
    ? data.filter(
        (x) => new Date(x.medidor.data) < new Date(dilutionMaxDateParam)
      )
    : [];
  function getOverallTotalQty(info) {
    if (!info) return { plants: 0, modules: 0 };
    const totalModulesQty = info.reduce((acc, current) => {
      const currentModules = isNaN(current.sistema?.qtdeModulos)
        ? 0
        : Number(current.sistema?.qtdeModulos);
      return acc + currentModules;
    }, 0);
    const totalPlantsQty = info.length;
    return { plants: totalPlantsQty, modules: totalModulesQty };
  }
  function getDilutedOverallTotalQty(info) {
    if (!info) return { plants: 0, modules: 0 };
    const numeratorMonths = getMonthDiff(
      new Date(limitDateParam),
      new Date(dilutionMaxDateParam)
    );
    const denominatorMonths = getMonthDiff(
      new Date(),
      new Date(dilutionMaxDateParam)
    );
    const dilutionMultiplier = numeratorMonths / denominatorMonths;
    console.log(
      "MULTIPLICADOR DE DILUIÇÃO",
      numeratorMonths,
      denominatorMonths,
      dilutionMultiplier
    );
    const totalModulesQty = info.reduce((acc, current) => {
      const currentModules = isNaN(current.sistema?.qtdeModulos)
        ? 0
        : Number(current.sistema?.qtdeModulos);
      return acc + currentModules;
    }, 0);
    const totalPlantsQty = info.length;
    return {
      plants: totalPlantsQty * dilutionMultiplier,
      modules: totalModulesQty * dilutionMultiplier,
    };
  }
  function getDataGroupedByCitySecondScenario(info) {
    // Corresponding to months from now till 31/12/2023
    const numeratorMonths = getMonthDiff(new Date(), new Date(limitDateParam));
    const denominatorMonths = getMonthDiff(
      new Date(),
      new Date(dilutionMaxDateParam)
    );
    const multiplier = numeratorMonths / denominatorMonths;
    console.log("MULTIPLICADOR", multiplier);
    const groupedResult = info.reduce((acc, current) => {
      const city = current.cidade;
      const currentModules = isNaN(current.sistema?.qtdeModulos)
        ? 0
        : Number(current.sistema?.qtdeModulos);
      if (!acc[city]) {
        acc[city] = {
          plants: 0,
          modules: 0,
        };
      }
      acc[city].plants = acc[city].plants + 1 * multiplier;
      acc[city].modules = acc[city].modules + currentModules * multiplier;
      return acc;
    }, {});
    return groupedResult;
  }
  function getDataGroupedByCity(info) {
    const groupedResult = info.reduce((acc, current) => {
      const city = current.cidade;
      const currentModules = isNaN(current.sistema?.qtdeModulos)
        ? 0
        : Number(current.sistema?.qtdeModulos);
      if (!acc[city]) {
        acc[city] = {
          plants: 0,
          modules: 0,
        };
      }
      acc[city].plants = acc[city].plants + 1;
      acc[city].modules = acc[city].modules + currentModules;
      return acc;
    }, {});
    return groupedResult;
  }
  function renderDataGroupedByCity(data) {
    // filteredDataByMaxDateParam
    return Object.keys(getDataGroupedByCity(data)).map((city, index) => (
      <div
        key={index}
        className="w-full flex items-center gap-2 py-1 border-b border-gray-300"
      >
        <h1 className="text-center font-medium text-gray-500 w-1/3">{city}</h1>
        <h1 className="text-center font-medium text-gray-500 w-1/3">
          {getDataGroupedByCity(data)[city].plants}
        </h1>
        <h1 className="text-center font-medium text-gray-500 w-1/3">
          {getDataGroupedByCity(data)[city].modules}
        </h1>
      </div>
    ));
  }
  function renderDataGroupedByCitySecondScenario(data) {
    // filteredDataByMaxDateParam
    return Object.keys(getDataGroupedByCitySecondScenario(data)).map(
      (city, index) => (
        <div
          key={index}
          className="w-full flex items-center gap-2 py-1 border-b border-gray-300"
        >
          <h1 className="text-center font-medium text-gray-500 w-1/3">
            {city}
          </h1>
          <h1 className="text-center font-medium text-gray-500 w-1/3">
            {getDataGroupedByCitySecondScenario(data)[city].plants.toFixed(0)}
          </h1>
          <h1 className="text-center font-medium text-gray-500 w-1/3">
            {getDataGroupedByCitySecondScenario(data)[city].modules.toFixed(0)}
          </h1>
        </div>
      )
    );
  }
  console.log("DADOS DO RELATÓRIO", data);
  return (
    <div className="p-6 grow">
      <div className="flex flex-col items-center justify-between gap-2 border-b border-gray-200 p-1">
        <h1 className="flex font-Poppins text-2xl font-black text-[#fead61]">
          RELATÓRIO DO SETOR DE O&M
        </h1>
      </div>
      <div className="flex flex-col w-full grow p-3">
        {isFetching ? <LoadingPage /> : null}
        {isSuccess ? (
          <div className="flex flex-col w-full gap-4">
            <div className="flex flex-col items-center  justify-center bg-[#15599a] py-2">
              <p className="text-3xl text-white font-bold">CENÁRIO GERAL</p>
              <p className="text-sm italic text-white font-medium">
                Considerando vencimento até:{" "}
                {dayjs(dateParam).format("DD/MM/YYYY")}
              </p>
            </div>

            <div className="w-full flex items-center gap-2">
              <div className="w-1/2 flex flex-col items-center border border-gray-300 shadow-lg rounded p-3">
                <h1 className="text-center text-lg font-Poppins text-[#15599a] font-medium">
                  Nº DE USINAS A SEREM LIMPAS
                </h1>
                <div className="flex items-center justify-center w-full gap-2">
                  <FaHome color="#fead41" size={"40px"} />
                  <p className="font-Poppins text-center text-[#fead41] font-black text-2xl">
                    {getOverallTotalQty(filteredDataByMaxDateParam).plants}
                  </p>
                </div>
              </div>
              <div className="w-1/2 flex flex-col items-center border border-gray-300 shadow-lg rounded p-3">
                <h1 className="text-center text-lg font-Poppins text-[#15599a] font-medium">
                  Nº DE MÓDULOS À SEREM LIMPOS
                </h1>
                <div className="flex items-center justify-center w-full gap-2">
                  <FaSolarPanel color="#fead41" size={"40px"} />
                  <p className="font-Poppins text-center text-[#fead41] font-black text-2xl">
                    {getOverallTotalQty(filteredDataByMaxDateParam).modules}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full border border-gray-300 shadow-lg rounded">
              <div className="flex items-center w-full gap-2 bg-[#15599a]">
                <h1 className="font-medium text-white w-1/3 text-center">
                  CIDADE
                </h1>
                <h1 className="font-medium text-white w-1/3 text-center">
                  Nº DE USINAS
                </h1>
                <h1 className="font-medium text-white w-1/3 text-center">
                  Nº DE MÓDULOS
                </h1>
              </div>
              {renderDataGroupedByCity(filteredDataByMaxDateParam)}
            </div>
            <div className="flex flex-col items-center  justify-center bg-[#fead41] py-2">
              <p className="text-3xl text-white font-bold">
                CENÁRIO SECUNDÁRIO
              </p>
              <p className="text-sm italic text-white font-medium">
                Considerando diluição das manutenção pendentes até 31/12/2023 em
                até {}
              </p>
            </div>
            <div className="w-full flex items-center gap-2">
              <div className="w-1/2 flex flex-col items-center border border-gray-300 shadow-lg rounded p-3">
                <h1 className="text-center text-lg font-Poppins text-[#15599a] font-medium">
                  Nº DE USINAS A SEREM LIMPAS
                </h1>
                <div className="flex items-center justify-center w-full gap-2">
                  <FaHome color="#fead41" size={"40px"} />
                  <p className="font-Poppins text-center text-[#fead41] font-black text-2xl">
                    {
                      getOverallTotalQty(
                        filteredDataByMaxDateParamSecondScenario
                      ).plants
                    }
                  </p>
                </div>
                <p className="text-center text-gray-500 italic">
                  {getDilutedOverallTotalQty(
                    filteredDataByMaxDateParam
                  ).plants.toFixed(0)}{" "}
                  até {dayjs(dateParam).format("DD/MM/YYYY")}
                </p>
              </div>
              <div className="w-1/2 flex flex-col items-center border border-gray-300 shadow-lg rounded p-3">
                <h1 className="text-center text-lg font-Poppins text-[#15599a] font-medium">
                  Nº DE MÓDULOS À SEREM LIMPOS
                </h1>
                <div className="flex items-center justify-center w-full gap-2">
                  <FaSolarPanel color="#fead41" size={"40px"} />
                  <p className="font-Poppins text-center text-[#fead41] font-black text-2xl">
                    {
                      getOverallTotalQty(
                        filteredDataByMaxDateParamSecondScenario
                      ).modules
                    }
                  </p>
                </div>
                <p className="text-center text-gray-500 italic">
                  {getDilutedOverallTotalQty(
                    filteredDataByMaxDateParam
                  ).modules.toFixed(0)}{" "}
                  até {dayjs(dateParam).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
            <div className="flex flex-col w-full border border-gray-300 shadow-lg rounded">
              <div className="flex items-center w-full gap-2 bg-[#15599a]">
                <h1 className="font-medium text-white w-1/3 text-center">
                  CIDADE
                </h1>
                <h1 className="font-medium text-white w-1/3 text-center">
                  Nº DE USINAS
                </h1>
                <h1 className="font-medium text-white w-1/3 text-center">
                  Nº DE MÓDULOS
                </h1>
              </div>
              {renderDataGroupedByCitySecondScenario(
                filteredDataByMaxDateParam
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default RelatorioSetor;
