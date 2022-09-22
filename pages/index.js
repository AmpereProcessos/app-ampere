import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
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
  const [regionalFilter, setRegionalFilter] = useState();
  const [selectedYear, setSelectedYear] = useState();
  const [installedData, setInstalledData] = useState([]);
  const [averageHomoData, setHomoData] = useState([]);
  const [maxGraphNumber, setMaxGraphNumber] = useState(0);
  const [nps, setNps] = useState(0);
  const [statsData, setStatsData] = useState({
    diffPotInstalled: 0,
    diffHomoPot: 0,
    diffJobsDone: 0,
    diffHomoTime: 0,
    graphData: {},
  });
  function getStats() {
    setRegionalFilter("GERAL");
    axios.get("/api/stats").then((res) => {
      setNps(res.data.nps);
      setInstalledData(res.data.installedInfo);
      setHomoData(res.data.averageHomoData);
    });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      getStats();
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        axios.get("/api/stats").then((res) => {
          setInstalledData(res.data.installedInfo);
          setHomoData(res.data.averageHomoData);
        });
      }
    }
  }, []);
  function filterByRegional(regional) {
    setRegionalFilter(regional);
    axios.post("/api/stats", { regional: regional }).then((res) => {
      setInstalledData(res.data.installedInfo);
      setHomoData(res.data.averageHomoData);
    });
  }
  function getGraphDataByYear(year) {
    setSelectedYear(year);
    axios.get(`/api/stats/getByYear/${year}`).then((res) => {
      setStatsData({ ...statsData, graphData: res.data });
    });
  }
  useEffect(() => {
    var parcialPotLastMonth =
      (new Date().getDate() / 30) * installedData[2]?.total;
    console.log(parcialPotLastMonth);
    var parcialHomoPotLastMonth =
      (new Date().getDate() / 30) * averageHomoData[0]?.homoPeakPot;
    var parcialJobsLastMonth =
      (new Date().getDate() / 30) * installedData[2]?.count;
    setStatsData({
      diffPotInstalled: (
        1 -
        installedData[3]?.total / parcialPotLastMonth
      ).toFixed(2),
      diffHomoPot: (
        1 -
        averageHomoData[1]?.homoPeakPot / parcialHomoPotLastMonth
      ).toFixed(2),
      diffJobsDone: (
        1 -
        installedData[3]?.count / parcialJobsLastMonth
      ).toFixed(2),
      diffHomoTime: (
        1 -
        installedData[3]?.count / parcialJobsLastMonth
      ).toFixed(2),
      graphData: [
        {
          name: `${installedData[0]?._id.mes}/22`,
          Total: installedData[0]?.total,
        },
        {
          name: `${installedData[1]?._id.mes}/22`,
          Total: installedData[1]?.total,
        },
        {
          name: `${installedData[2]?._id.mes}/22`,
          Total: installedData[2]?.total,
        },
        {
          name: `${installedData[3]?._id.mes}/22`,
          Total: installedData[3]?.total,
        },
      ],
    });
  }, [installedData, averageHomoData]);
  // var max = Math.max(...statsData.graphData.map((x) => x.total));
<<<<<<< HEAD
=======
  console.log(averageHomoData);
>>>>>>> eb091488161a6a76ede6dfe20567f5558aecd7ee
  return (
    <div className="p-6 grow">
      <div className="flex justify-center gap-x-2 bg-[#fff] py-2 mb-2 border border-gray-200 shadow-lg">
        <p
          onClick={() => filterByRegional("REGIONAL ITUIUTABA")}
          className={`border ${
            regionalFilter == "REGIONAL ITUIUTABA"
              ? "bg-blue-200"
              : "bg-[#fff] hover:bg-blue-200"
          }  cursor-pointer p-1 px-2 font-semibold text-gray-600 text-sm text-center border-gray-200 font-raleway`}
        >
          REGIONAL ITUIUTABA
        </p>
        <p
          onClick={() => filterByRegional("REGIONAL UBERLÂNDIA")}
          className={`border ${
            regionalFilter == "REGIONAL UBERLÂNDIA"
              ? "bg-blue-200"
              : "bg-[#fff] hover:bg-blue-200"
          }  cursor-pointer p-1 px-2 font-semibold text-gray-600 text-sm text-center border-gray-200 font-raleway`}
        >
          REGIONAL UBERLÂNDIA
        </p>
        <p
          onClick={getStats}
          className={`border ${
            regionalFilter == "GERAL"
              ? "bg-blue-200"
              : "bg-[#fff] hover:bg-blue-200"
          }  cursor-pointer p-1 px-2 font-semibold text-gray-600 text-sm text-center border-gray-200 font-raleway`}
        >
          GERAL
        </p>
      </div>
      <div className="grid grid-cols-4 gap-x-3 w-full">
        <div className="flex flex-col p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">
              Obras finalizadas no mês
            </h1>
            <div
              className={
                statsData.diffJobsDone < 0
                  ? `flex items-center text-green-500`
                  : "flex items-center text-red-500"
              }
            >
              {statsData.diffJobsDone < 0 ? (
                <MdOutlineKeyboardArrowUp fontSize={"25px"} />
              ) : (
                <MdOutlineKeyboardArrowDown fontSize={"25px"} />
              )}
              <p>
                {statsData.diffJobsDone < 0
                  ? (Math.abs(statsData.diffJobsDone) * 100).toFixed(2)
                  : (statsData.diffJobsDone * 100).toFixed(2)}
                %
              </p>
            </div>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {installedData[3]?.count} obras
          </p>
          <p className="text-center text-xs text-gray-600">
            Último mês: <strong>{installedData[2]?.count} obras</strong>
          </p>
        </div>
        <div className="flex flex-col p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">
              Potência Pico instalada no mês
            </h1>
            <div
              className={
                statsData.diffPotInstalled < 0
                  ? `flex items-center text-green-500`
                  : "flex items-center text-red-500"
              }
            >
              {statsData.diffPotInstalled < 0 ? (
                <MdOutlineKeyboardArrowUp fontSize={"25px"} />
              ) : (
                <MdOutlineKeyboardArrowDown fontSize={"25px"} />
              )}
              <p>
                {statsData.diffPotInstalled < 0
                  ? (Math.abs(statsData.diffPotInstalled) * 100).toFixed(2)
                  : (statsData.diffPotInstalled * 100).toFixed(2)}
                %
              </p>
            </div>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {installedData[3]?.total} kWp
          </p>
          <p className="text-center text-xs text-gray-600">
            Último mês:{" "}
            <strong>{installedData[2]?.total.toFixed(2)} kWp</strong>
          </p>
        </div>
        <div className="flex flex-col p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">
              Potência Pico homologada no mês
            </h1>
            <div
              className={
                statsData.diffHomoPot > 1
                  ? `flex items-center text-green-500`
                  : "flex items-center text-red-500"
              }
            >
              {statsData.diffHomoPot > 1 ? (
                <MdOutlineKeyboardArrowUp fontSize={"25px"} />
              ) : (
                <MdOutlineKeyboardArrowDown fontSize={"25px"} />
              )}
              <p>
                {statsData.diffHomoPot > 1
                  ? (Math.abs(1 - statsData.diffHomoPot) * 100).toFixed(2)
                  : (statsData.diffHomoPot * 100).toFixed(2)}
                %
              </p>
            </div>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {averageHomoData[1]?.homoPeakPot.toFixed(2)} kWp
          </p>
          <p className="text-center text-xs text-gray-600">
            Último mês:{" "}
            <strong>{averageHomoData[0]?.homoPeakPot.toFixed(2)} kWp</strong>
          </p>
        </div>
        <div className="flex flex-col p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">
              TEMPO MÉDIO DE APROVAÇÃO
            </h1>
            <div
              className={
                statsData.diffHomoTime > 0
                  ? `flex items-center text-green-500`
                  : "flex items-center text-red-500"
              }
            >
              {statsData.diffHomoTime > 0 ? (
                <MdOutlineKeyboardArrowUp fontSize={"25px"} />
              ) : (
                <MdOutlineKeyboardArrowDown fontSize={"25px"} />
              )}
              <p>
                {statsData.diffHomoTime > 0
                  ? (statsData.diffHomoTime * 100).toFixed(2)
                  : (Math.abs(statsData.diffHomoTime) * 100).toFixed(2)}
                %
              </p>
            </div>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {averageHomoData[1]?.averageTime.toFixed(0)} dias
          </p>
          <p className="text-center text-xs text-gray-600">
            Último mês:{" "}
            <strong>{averageHomoData[0]?.averageTime.toFixed(0)} dias</strong>
          </p>
        </div>
      </div>
      <div className="grid mt-4 grid-cols-4 gap-x-3">
        <div className="flex flex-col p-4 h-[400px] border border-gray-200 bg-[#fff] shadow-xl col-span-1">
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
        <div className="flex flex-col p-4 h-[400px] border border-gray-200 bg-[#fff] shadow-xl col-span-3">
          <div className="grid grid-cols-2 py-2">
            <h1 className="text-gray-600 uppercase text-xl text-center">
              Potência pico instalada
            </h1>
            <div className="flex items-center gap-x-2 justify-center">
              <p
                onClick={() => getGraphDataByYear(2020)}
                className={`border cursor-pointer border-gray-200 ${
                  selectedYear == 2020
                    ? "bg-blue-200 hover:bg-transparent"
                    : "hover:bg-blue-200 bg-transparent"
                } p-2 text-xs text-gray-600`}
              >
                2020
              </p>
              <p
                onClick={() => getGraphDataByYear(2021)}
                className={`border cursor-pointer border-gray-200 ${
                  selectedYear == 2021
                    ? "bg-blue-200 hover:bg-transparent"
                    : "hover:bg-blue-200 bg-transparent"
                } p-2 text-xs text-gray-600`}
              >
                2021
              </p>
              <p
                onClick={() => getGraphDataByYear(2022)}
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
              <YAxis dataKey={"Total"} domain={[0, 500]} />
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
        <h1 className="text-gray-600 uppercase">
          CLIENTES ANIVERSARIANDO HOJE
        </h1>
      </div>
    </div>
  );
}

export default Home;
