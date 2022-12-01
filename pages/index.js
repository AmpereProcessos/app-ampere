import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Logo from "../utils/10mega.png";
import Image from "next/image";
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

function Home({ credentials, setCredentials }) {
  const router = useRouter();
  const [totalPeakPot, setTotalPeakPot] = useState(0);
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
    graphData: [],
    maxGraphValue: 1000,
  });
  const [filters, setFilters] = useState({
    birthdayToday: false,
  });
  function getStats(credenciais) {
    if (credenciais.visualizacao == "REGIONAL") {
      axios
        .post("/api/stats", {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.regional,
        })
        .then((res) => {
          setTotalPeakPot(
            Number((res.data.totalPeakPot * 100) / 10000).toFixed(2)
          );
          setNps(res.data.nps);
          setAverageBuyTime(res.data.suprimentosData);
          setInstalledData(res.data.installedInfo);
          setHomoData(res.data.averageHomoData);
        });
    } else if (credenciais.visualizacao == "VENDEDOR") {
      axios
        .post("/api/stats", {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.vendedor,
        })
        .then((res) => {
          setTotalPeakPot(
            Number((res.data.totalPeakPot * 100) / 10000).toFixed(2)
          );
          setNps(res.data.nps);
          setAverageBuyTime(res.data.suprimentosData);
          setInstalledData(res.data.installedInfo);
          setHomoData(res.data.averageHomoData);
        });
    } else {
      axios.get("/api/stats").then((res) => {
        setTotalPeakPot(
          Number((res.data.totalPeakPot * 100) / 10000).toFixed(2)
        );
        setNps(res.data.nps);
        setAverageBuyTime(res.data.suprimentosData);
        setInstalledData(res.data.installedInfo);
        setHomoData(res.data.averageHomoData);
      });
    }
  }
  function getBirthDay(credenciais) {
    if (credenciais.visualizacao == "REGIONAL") {
      axios
        .post("/api/stats/clientsBirthday", {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.regional,
        })
        .then((res) =>
          setClientsBirthday({ general: res.data, filtered: res.data })
        );
    } else if (credentials.visualizacao == "VENDEDOR") {
      axios
        .post("/api/stats/clientsBirthday", {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.vendedor,
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
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      if (storedCredentials.visualizacao == "VENDEDOR") {
        router.push("/vendas/formularios");
      } else {
        setCredentials(storedCredentials);
        getStats(storedCredentials);
        getGraphDataByYear(2022, storedCredentials);
        getBirthDay(storedCredentials);
      }
    } else {
      if (credentials != {} && !credentials.nome) {
        router.push("/auth/authHome");
      } else if (credentials.visualizacao == "VENDEDOR") {
        router.push("/vendas/formularios");
      } else {
        getStats(credentials);
        getGraphDataByYear(2022, credentials);
        getBirthDay(credentials);
      }
    }
  }, []);
  function getGraphDataByYear(year, credenciais) {
    setSelectedYear(year);
    if (credenciais.visualizacao == "REGIONAL") {
      axios
        .post(`/api/stats/getByYear/${year}`, {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.regional,
        })
        .then((res) => {
          setStatsData({
            ...statsData,
            graphData: res.data,
            maxGraphValue: Math.max(...res.data.map((o) => o.Total)),
          });
        });
    } else if (credenciais.visualizacao == "VENDEDOR") {
      axios
        .post(`/api/stats/getByYear/${year}`, {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.vendedor,
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
  return (
    <div className="p-6 grow">
      <div className="flex flex-col border bg-[#fff] my-3 shadow-lg border-gray-200 p-2">
        <div className="w-full h-[36px] border border-[#15599a]">
          <div
            style={{
              width: `${98.48}%`,
              background:
                "linear-gradient(90deg, rgba(21,89,154,1) 20%, rgba(1,127,247,1) 90%)",
            }}
            className={`h-full col-span-8`}
          ></div>
        </div>
        <p className="text-center font-bold text-[#15599a] text-xl">
          Faltam 1.52%...
        </p>
      </div>
      <div className="grid grid-rows-10 grid-cols-1 gap-y-2 lg:grid-cols-10 lg:grid-rows-1  lg:gap-x-3 w-full">
        <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">
              Obras finalizadas no mês
            </h1>
          </div>
          <p className="grow text-center text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {installedData.length > 0 ? installedData[0]?.count : "-"} obras
          </p>
          <p className="text-center text-xs text-gray-600">
            Último mês: <strong>{installedData[1]?.count} obras</strong>
          </p>
        </div>
        <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">
              Potência Pico instalada no mês
            </h1>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {installedData.length > 0
              ? installedData[0]?.total.toFixed(2)
              : "-"}{" "}
            kWp
          </p>
          <p className="text-center text-xs text-gray-600">
            Último mês:{" "}
            <strong>{installedData[1]?.total.toFixed(2)} kWp</strong>
          </p>
        </div>
        <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">
              Potência Pico homologada no mês
            </h1>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {averageHomoData.length > 0
              ? averageHomoData[0]?.homoPeakPot.toFixed(2)
              : "-"}{" "}
            kWp
          </p>
          <p className="text-center text-xs text-gray-600">
            Último mês:{" "}
            <strong>{averageHomoData[1]?.homoPeakPot.toFixed(2)} kWp</strong>
          </p>
        </div>
        <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">TEMPO MÉDIO PARA COMPRA</h1>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {averageBuyTime.length > 0
              ? averageBuyTime[0].tempoMedio.toFixed(2)
              : "-"}{" "}
            dias
          </p>
          <p className="text-center text-xs text-gray-600">
            Último mês:{" "}
            <strong>
              {averageBuyTime.length > 0
                ? averageBuyTime[1]?.tempoMedio.toFixed(2)
                : "-"}{" "}
              dias
            </strong>
          </p>
        </div>
        <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">
              TEMPO MÉDIO DE APROVAÇÃO
            </h1>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {averageHomoData.length > 0
              ? averageHomoData[0]?.averageTime.toFixed(0)
              : "-"}{" "}
            dias
          </p>
          <p className="text-center text-xs text-gray-600">
            Último mês:{" "}
            <strong>{averageHomoData[1]?.averageTime.toFixed(0)} dias</strong>
          </p>
        </div>
      </div>
      <div className="grid grid-rows-2 grid-cols-1 gap-y-2 mt-4 lg:grid-cols-10 lg:grid-rows-1 lg:gap-x-3">
        <div className="flex flex-col p-4 h-[400px] border border-gray-200 bg-[#fff] shadow-xl col-span-2">
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
        <div className="flex flex-col p-4 h-[400px] border border-gray-200 bg-[#fff] shadow-xl col-span-8">
          <div className="grid grid-cols-2 py-2">
            <h1 className="text-gray-600 uppercase text-xl text-center">
              Potência pico vendida
            </h1>
            <div className="flex items-center gap-x-2 justify-center">
              <p
                onClick={() => getGraphDataByYear(2020, credentials)}
                className={`border cursor-pointer border-gray-200 ${
                  selectedYear == 2020
                    ? "bg-blue-200 hover:bg-transparent"
                    : "hover:bg-blue-200 bg-transparent"
                } p-2 text-xs text-gray-600`}
              >
                2020
              </p>
              <p
                onClick={() => getGraphDataByYear(2021, credentials)}
                className={`border cursor-pointer border-gray-200 ${
                  selectedYear == 2021
                    ? "bg-blue-200 hover:bg-transparent"
                    : "hover:bg-blue-200 bg-transparent"
                } p-2 text-xs text-gray-600`}
              >
                2021
              </p>
              <p
                onClick={() => getGraphDataByYear(2022, credentials)}
                className={`border cursor-pointer border-gray-200 ${
                  selectedYear == 2022
                    ? "bg-blue-200 hover:bg-transparent"
                    : "hover:bg-blue-200 bg-transparent"
                } p-2 text-xs text-gray-600`}
              >
                2022
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%">
            <LineChart
              width={550}
              height={300}
              data={statsData.graphData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis dataKey={"Total"} domain={[0, statsData.maxGraphValue]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Total"
                strokeWidth={4}
                stroke="#15599a"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex mt-4 grow flex-col p-4  border border-gray-200 bg-[#fff] shadow-xl">
        <div className="flex w-full items-center justify-between px-4">
          <h1 className="text-gray-600 uppercase">ANIVERSARIANTES DO MÊS</h1>
          <button
            onClick={() => filterBirthday(!filters.birthdayToday)}
            className="p-2 rounded bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold"
          >
            Aniversariando hoje
          </button>
        </div>
        <div className="w-full grow flex flex-wrap justify-around gap-y-2 mt-2">
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
}

export default Home;
