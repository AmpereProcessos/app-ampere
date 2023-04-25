import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useRouter } from "next/router";
import Image from "next/image";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  AreaChart,
  Area,
  LineChart,
  Legend,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { Fireworks } from "fireworks-js";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import { useSession } from "next-auth/react";
import LoadingPage from "../components/utils/LoadingPage";
const routes = [
  {
    title: "Projetos",
    url: "projetos",
  },
  {
    title: "Obras",
    url: "obras",
  },
  {
    title: "Suprimentos",
    url: "suprimentos",
  },
  {
    title: "O&M",
    url: "o&m",
  },
  {
    title: "Marketing",
    url: "marketing",
  },
  {
    title: "Vendas",
    url: "vendas",
  },
  {
    title: "Pós-Venda",
    url: "pos-venda",
  },
  {
    title: "PPS",
    url: "pps",
  },
  {
    title: "InsideSales",
    url: "insidesales",
  },
  {
    title: "Financeiro",
    url: "financeiro",
  },
  {
    title: "ADM",
    url: "adm",
  },
  {
    title: "RH",
    url: "rh",
  },
];

function Home() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });
  const [selectedYear, setSelectedYear] = useState();
  const [installedData, setInstalledData] = useState([]);
  const [averageHomoData, setHomoData] = useState([]);
  const [averageBuyTime, setAverageBuyTime] = useState([]);
  const [clientBirthday, setClientsBirthday] = useState({
    general: [],
    filtered: [],
  });
  const [nps, setNps] = useState(0);
  const [statsData, setStatsData] = useState({
    graphData: null,
    maxGraphValue: 1000,
  });
  const [filters, setFilters] = useState({
    birthdayToday: false,
  });
  const [regional, setRegional] = useState("GERAL");
  function getStats(credenciais) {
    if (credenciais?.visualizacao == "REGIONAL") {
      axios
        .post("/api/stats", {
          filtrarPor: credenciais?.visualizacao,
          parametro: credenciais?.regional,
        })
        .then((res) => {
          setNps(res.data.nps);
          setAverageBuyTime(res.data.suprimentosData);
          setInstalledData(res.data.installedInfo);
          setHomoData(res.data.averageHomoData);
        });
    } else if (
      credenciais?.visualizacao == "VENDEDOR" ||
      credenciais?.visualizacao == "INSIDE"
    ) {
      axios
        .post("/api/stats", {
          filtrarPor: credenciais?.visualizacao,
          parametro: credenciais?.vendedor,
        })
        .then((res) => {
          setNps(res.data.nps);
          setAverageBuyTime(res.data.suprimentosData);
          setInstalledData(res.data.installedInfo);
          setHomoData(res.data.averageHomoData);
        });
    } else {
      axios.get("/api/stats").then((res) => {
        setNps(res.data.nps);
        setAverageBuyTime(res.data.suprimentosData);
        setInstalledData(res.data.installedInfo);
        setHomoData(res.data.averageHomoData);
      });
    }
  }
  function getBirthDay(credenciais) {
    if (credenciais?.visualizacao == "REGIONAL") {
      axios
        .post("/api/stats/clientsBirthday", {
          filtrarPor: credenciais?.visualizacao,
          parametro: credenciais?.regional,
        })
        .then((res) =>
          setClientsBirthday({ general: res.data, filtered: res.data })
        );
    } else if (
      credenciais?.visualizacao == "VENDEDOR" ||
      credenciais?.visualizacao == "INSIDE"
    ) {
      axios
        .post("/api/stats/clientsBirthday", {
          filtrarPor: credenciais?.visualizacao,
          parametro: credenciais?.vendedor,
        })
        .then((res) =>
          setClientsBirthday({ general: res.data, filtered: res.data })
        );
    } else {
      axios
        .get("/api/stats/clientsBirthday")
        .then((res) =>
          setClientsBirthday({ general: res.data, filtered: res.data })
        );
    }
  }
  function getGraphDataByYear(year, credenciais) {
    setSelectedYear(year);
    if (credenciais?.visualizacao == "REGIONAL") {
      axios
        .post(`/api/stats/getByYear/${year}`, {
          filtrarPor: credenciais?.visualizacao,
          parametro: credenciais?.regional,
        })
        .then((res) => {
          setStatsData({
            ...statsData,
            graphData: res.data,
            maxGraphValue: Math.max(...res.data.map((o) => o.Total)),
          });
        });
    } else if (
      credenciais?.visualizacao == "VENDEDOR" ||
      credenciais?.visualizacao == "INSIDE"
    ) {
      axios
        .post(`/api/stats/getByYear/${year}`, {
          filtrarPor: credenciais?.visualizacao,
          parametro: credenciais?.vendedor,
        })
        .then((res) =>
          setStatsData({
            ...statsData,
            graphData: res.data,
            maxGraphValue: Math.max(...res.data.map((o) => o.Total)),
          })
        );
    } else {
      axios.get(`/api/stats/getByYear/${year}`).then((res) => {
        setStatsData({
          ...statsData,
          graphData: res.data,
          maxGraphValue: Math.max(...res.data.map((o) => o.Total)),
        });
      });
    }
  }
  function filterBirthday(value) {
    var newArr;
    setFilters({ ...filters, birthdayToday: value });
    if (value == true) {
      newArr = clientBirthday.general.filter(
        (client) =>
          new Date(client.dataNascimento).getDate() == new Date().getDate()
      );
    } else {
      newArr = clientBirthday.general;
    }

    setClientsBirthday({ ...clientBirthday, filtered: newArr });
  }
  function getDataByRegional(value) {
    setRegional(value);
    getGraphDataByYear(2023, { visualizacao: "REGIONAL", regional: value });
    getStats({ visualizacao: "REGIONAL", regional: value });
  }
  function validateStatsMonth(obj) {
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();
    if (obj.mes < currentMonth)
      return obj.mes >= 10 ? (
        <p className="text-xs font-semibold text-[#fead61]">{`${obj.mes}/${currentYear}`}</p>
      ) : (
        <p className="text-xs font-semibold text-[#fead61]">{`0${obj.mes}/${currentYear}`}</p>
      );
    else {
      return null;
    }
  }
  useEffect(() => {
    if (session?.user) {
      getStats(session.user);
      getGraphDataByYear(2023, session.user);
      getBirthDay(session.user);
    }
  }, [session]);
  console.log(installedData, averageHomoData, averageBuyTime);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    if (session.user?.visualizacao == "OBRAS") {
      router.push("/ordemDeServico/osDaEquipe");
      return <></>;
    }
    if (statsData.graphData) {
      return (
        <div className="p-6 grow">
          {!session.user?.visualizacao && (
            <div className="flex items-center justify-center gap-2 mb-3">
              <button
                onClick={() => getDataByRegional("REGIONAL ITUIUTABA")}
                className={`h-[52px] lg:h-fit border border-gray-200 rounded-sm p-1 ${
                  regional == "REGIONAL ITUIUTABA" ? "bg-blue-100" : ""
                } hover:bg-blue-100 font-raleway font-bold text-xs lg:text-sm`}
              >
                REGIONAL ITUIUTABA
              </button>
              <button
                onClick={() => getDataByRegional("REGIONAL UBERLÂNDIA")}
                className={`h-[52px] lg:h-fit border border-gray-200 rounded-sm p-1 ${
                  regional == "REGIONAL UBERLÂNDIA" ? "bg-blue-100" : ""
                } hover:bg-blue-100 font-raleway font-bold text-xs lg:text-sm`}
              >
                REGIONAL UBERLÂNDIA
              </button>
              <button
                onClick={() => {
                  setRegional("GERAL");
                  getStats(session.user);
                  getGraphDataByYear(2023, session.user);
                }}
                className={`h-[52px] lg:h-fit border border-gray-200 rounded-sm p-1 ${
                  regional == "GERAL" ? "bg-blue-100" : ""
                } hover:bg-blue-100 font-raleway font-bold text-xs lg:text-sm`}
              >
                GERAL
              </button>
            </div>
          )}
          <div className="grid grid-rows-10 grid-cols-1 gap-y-2 lg:grid-cols-10 lg:grid-rows-1  lg:gap-x-3 w-full">
            <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">
                  Obras finalizadas no mês
                </h1>
                {installedData[0]
                  ? validateStatsMonth(installedData[0]._id)
                  : null}
              </div>
              <p className="grow text-center text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {installedData.length > 0 ? installedData[0]?.count : "-"} obras
              </p>
              <p className="text-center text-xs text-gray-600">
                Último mês:{" "}
                <strong>
                  {installedData.length > 0 && installedData[1]?.count
                    ? `${installedData[1]?.count} obras`
                    : "N/A"}{" "}
                </strong>
              </p>
            </div>
            <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">
                  Potência Pico instalada no mês
                </h1>
                {installedData[0]
                  ? validateStatsMonth(installedData[0]._id)
                  : null}
              </div>
              <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {installedData.length > 0
                  ? installedData[0]?.total.toFixed(2)
                  : "-"}{" "}
                kWp
              </p>
              <p className="text-center text-xs text-gray-600">
                Último mês:{" "}
                <strong>
                  {installedData.length > 0 && installedData[1]?.total
                    ? `${installedData[1]?.total.toFixed(2)} kWp`
                    : "N/A"}{" "}
                </strong>
              </p>
            </div>
            <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">
                  Potência Pico homologada no mês
                </h1>
                {averageHomoData[0]
                  ? validateStatsMonth(averageHomoData[0]._id)
                  : null}
              </div>
              <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {averageHomoData.length > 0
                  ? averageHomoData[0]?.homoPeakPot?.toFixed(2)
                  : "-"}{" "}
                kWp
              </p>
              <p className="text-center text-xs text-gray-600">
                Último mês:{" "}
                <strong>
                  {averageHomoData.length > 0 && averageHomoData[1]?.homoPeakPot
                    ? `${averageHomoData[1]?.homoPeakPot?.toFixed(2)} kWp`
                    : "N/A"}
                </strong>
              </p>
            </div>
            <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">
                  TEMPO MÉDIO PARA COMPRA
                </h1>
                {averageBuyTime[0]
                  ? validateStatsMonth(averageBuyTime[0]._id)
                  : null}
              </div>
              <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {averageBuyTime.length > 0
                  ? `${averageBuyTime[0].tempoMedio?.toFixed(2)} dias`
                  : "-"}{" "}
              </p>
              <p className="text-center text-xs text-gray-600">
                Último mês:{" "}
                <strong>
                  {averageBuyTime.length > 0 && averageBuyTime[1]?.tempoMedio
                    ? `${averageBuyTime[1]?.tempoMedio?.toFixed(2)} dias`
                    : "N/A"}{" "}
                </strong>
              </p>
            </div>
            <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">
                  TEMPO MÉDIO DE APROVAÇÃO
                </h1>
                {averageHomoData[0]
                  ? validateStatsMonth(averageHomoData[0]._id)
                  : null}
              </div>
              <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {averageHomoData.length > 0 && averageHomoData[0]?.averageTime
                  ? `${averageHomoData[0]?.averageTime?.toFixed(0)} dias`
                  : "N/A"}{" "}
              </p>
              <p className="text-center text-xs text-gray-600">
                Último mês:{" "}
                <strong>
                  {averageHomoData.length > 1 && averageHomoData[1]?.averageTime
                    ? `${averageHomoData[1]?.averageTime?.toFixed(0)} dias`
                    : "N/A"}
                </strong>
              </p>
            </div>
          </div>
          <div className="grid grid-rows-2 grid-cols-1 gap-y-2 mt-4 lg:grid-cols-10 lg:grid-rows-1 lg:gap-x-3">
            <div className="flex flex-col p-4 h-[425px] border border-gray-200 bg-[#fff] shadow-xl col-span-2">
              <h1 className="text-gray-600 text-xl text-center">NPS</h1>
              <div className="flex grow items-center justify-center">
                <div className="w-[150px] h-[150px]">
                  <CircularProgressbar
                    styles={buildStyles({
                      // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                      strokeLinecap: "butt",
                      // Text size
                      textSize: "16px",
                      // How long animation takes to go from one percentage to another, in seconds
                      pathTransitionDuration: 0.5,

                      // Can specify path transition in more detail, or remove it entirely
                      // pathTransition: 'none',

                      // Colors
                      pathColor: `#fead61`,
                      textColor: "#15599a",
                      trailColor: "#d6d6d6",
                      backgroundColor: "#3e98c7",
                    })}
                    value={Number(nps)}
                    text={`${nps}%`}
                    strokeWidth={6}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col p-4 h-[600px] lg:h-[425px] border border-gray-200 bg-[#fff] shadow-xl col-span-8">
              <div className="grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 py-2">
                <h1 className="text-gray-600 uppercase text-xl text-center">
                  Potência pico vendida
                </h1>
                <div className="flex items-center gap-x-2 justify-center">
                  <p
                    onClick={() => {
                      if (regional != undefined && regional != "GERAL") {
                        getGraphDataByYear(2020, {
                          visualizacao: "REGIONAL",
                          regional: regional,
                        });
                      } else {
                        getGraphDataByYear(2020, session.user);
                      }
                    }}
                    className={`border cursor-pointer border-gray-200 hover:scale-105 duration-500 ease-in-out ${
                      selectedYear == 2020
                        ? "bg-blue-200 hover:bg-transparent"
                        : "hover:bg-blue-200 bg-transparent"
                    } p-2 text-xs text-gray-600`}
                  >
                    2020
                  </p>
                  <p
                    onClick={() => {
                      if (regional != undefined && regional != "GERAL") {
                        getGraphDataByYear(2021, {
                          visualizacao: "REGIONAL",
                          regional: regional,
                        });
                      } else {
                        getGraphDataByYear(2021, session.user);
                      }
                    }}
                    className={`border cursor-pointer border-gray-200 hover:scale-105 duration-500 ease-in-out ${
                      selectedYear == 2021
                        ? "bg-blue-200 hover:bg-transparent"
                        : "hover:bg-blue-200 bg-transparent"
                    } p-2 text-xs text-gray-600`}
                  >
                    2021
                  </p>
                  <p
                    onClick={() => {
                      if (regional != undefined && regional != "GERAL") {
                        getGraphDataByYear(2022, {
                          visualizacao: "REGIONAL",
                          regional: regional,
                        });
                      } else {
                        getGraphDataByYear(2022, session.user);
                      }
                    }}
                    className={`border cursor-pointer border-gray-200 hover:scale-105 duration-500 ease-in-out ${
                      selectedYear == 2022
                        ? "bg-blue-200 hover:bg-transparent"
                        : "hover:bg-blue-200 bg-transparent"
                    } p-2 text-xs text-gray-600`}
                  >
                    2022
                  </p>
                  <p
                    onClick={() => {
                      if (regional != undefined && regional != "GERAL") {
                        getGraphDataByYear(2023, {
                          visualizacao: "REGIONAL",
                          regional: regional,
                        });
                      } else {
                        getGraphDataByYear(2023, session.user);
                      }
                    }}
                    className={`border cursor-pointer border-gray-200 hover:scale-105 duration-500 ease-in-out ${
                      selectedYear == 2023
                        ? "bg-blue-200 hover:bg-transparent"
                        : "hover:bg-blue-200 bg-transparent"
                    } p-2 text-xs text-gray-600`}
                  >
                    2023
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%">
                <AreaChart
                  width={550}
                  height={300}
                  data={statsData.graphData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#15599a" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#15599a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis
                    dataKey={"Total"}
                    domain={[0, statsData.maxGraphValue]}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="Total"
                    stroke="#15599a"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex mt-4 grow flex-col p-4  border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex flex-col lg:flex-row w-full items-center justify-between">
              <h1 className="text-gray-600 uppercase">
                ANIVERSARIANTES DO MÊS
              </h1>
              <button
                onClick={() => filterBirthday(!filters.birthdayToday)}
                className="p-2 rounded font-bold border border-[#fead61] text-[#fead61] hover:scale-105 duration-500 ease-in-out hover:text-black hover:bg-[#fead61]"
              >
                ANIVERSARIANDO HOJE
              </button>
            </div>
            <div className="w-full grow flex flex-wrap justify-center lg:justify-between gap-y-2 mt-2">
              {clientBirthday.filtered.length > 0 &&
                clientBirthday.filtered?.map((client, index) => (
                  <div
                    key={index}
                    className="w-[350px] text-xs text-center bg-[#fff] border border-gray-200 p-2"
                  >
                    <p>{client.nomeDoContrato}</p>
                    <p className="text-[#15599a] font-bold">
                      {client.dataNascimento != undefined &&
                        new Date(client.dataNascimento).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      );
    } else return <DashboardSkeleton />;
  }
}

export default Home;
