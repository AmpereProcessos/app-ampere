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
  const [installedData, setInstalledData] = useState([]);
  const [averageHomoData, setHomoData] = useState([]);
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      axios.get("/api/stats").then((res) => {
        setInstalledData(res.data.installedInfo);
        setHomoData(res.data.averageHomoData);
      });
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
  console.log(credentials);
  var parcialPotLastMonth =
    (new Date().getDate() / 30) * installedData[2]?.total;
  var parcialHomoPotLastMonth =
    (new Date().getDate() / 30) * averageHomoData[0]?.homoPeakPot;
  var parcialJobsLastMonth =
    (new Date().getDate() / 30) * installedData[2]?.count;
  var diffPotInstalled = (
    1 -
    installedData[3]?.total / parcialPotLastMonth
  ).toFixed(2);
  var diffHomoPot = (
    1 -
    averageHomoData[1]?.homoPeakPot / parcialHomoPotLastMonth
  ).toFixed(2);
  var diffJobsDone = (
    1 -
    installedData[3]?.count / parcialJobsLastMonth
  ).toFixed(2);
  var diffHomoTime = (
    averageHomoData[0]?.averageTime / averageHomoData[1]?.averageTime -
    1
  ).toFixed(2);
  const data = [
    { name: `${installedData[0]?._id.mes}/22`, Total: installedData[0]?.total },
    { name: `${installedData[1]?._id.mes}/22`, Total: installedData[1]?.total },
    { name: `${installedData[2]?._id.mes}/22`, Total: installedData[2]?.total },
    { name: `${installedData[3]?._id.mes}/22`, Total: installedData[3]?.total },
  ];
  return (
    <div className="p-6 grow">
      <div className="grid grid-cols-4 gap-x-3 w-full">
        <div className="flex flex-col p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">
              Obras finalizadas no mês
            </h1>
            <div
              className={
                diffJobsDone > 1
                  ? `flex items-center text-green-500`
                  : "flex items-center text-red-500"
              }
            >
              {diffJobsDone > 1 ? (
                <MdOutlineKeyboardArrowUp fontSize={"25px"} />
              ) : (
                <MdOutlineKeyboardArrowDown fontSize={"25px"} />
              )}
              <p>
                {diffJobsDone > 1
                  ? (Math.abs(1 - diffJobsDone) * 100).toFixed(2)
                  : (diffJobsDone * 100).toFixed(2)}
                %
              </p>
            </div>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {installedData[3]?.count} obras
          </p>
          <p className="text-center text-xs text-gray-600">
            Últimos mês: <strong>{installedData[2]?.count} obras</strong>
          </p>
        </div>
        <div className="flex flex-col p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
          <div className="flex justify-between">
            <h1 className="uppercase text-gray-600">
              Potência Pico instalada no mês
            </h1>
            <div
              className={
                diffPotInstalled > 1
                  ? `flex items-center text-green-500`
                  : "flex items-center text-red-500"
              }
            >
              {diffPotInstalled > 1 ? (
                <MdOutlineKeyboardArrowUp fontSize={"25px"} />
              ) : (
                <MdOutlineKeyboardArrowDown fontSize={"25px"} />
              )}
              <p>
                {diffPotInstalled > 1
                  ? (Math.abs(1 - diffPotInstalled) * 100).toFixed(2)
                  : (diffPotInstalled * 100).toFixed(2)}
                %
              </p>
            </div>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {installedData[3]?.total} kWp
          </p>
          <p className="text-center text-xs text-gray-600">
            Últimos mês:{" "}
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
                diffHomoPot > 1
                  ? `flex items-center text-green-500`
                  : "flex items-center text-red-500"
              }
            >
              {diffHomoPot > 1 ? (
                <MdOutlineKeyboardArrowUp fontSize={"25px"} />
              ) : (
                <MdOutlineKeyboardArrowDown fontSize={"25px"} />
              )}
              <p>
                {diffHomoPot > 1
                  ? (Math.abs(1 - diffHomoPot) * 100).toFixed(2)
                  : (diffHomoPot * 100).toFixed(2)}
                %
              </p>
            </div>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {averageHomoData[1]?.homoPeakPot.toFixed(2)} kWp
          </p>
          <p className="text-center text-xs text-gray-600">
            Últimos mês:{" "}
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
                diffHomoTime > 0
                  ? `flex items-center text-green-500`
                  : "flex items-center text-red-500"
              }
            >
              {diffHomoTime > 0 ? (
                <MdOutlineKeyboardArrowUp fontSize={"25px"} />
              ) : (
                <MdOutlineKeyboardArrowDown fontSize={"25px"} />
              )}
              <p>
                {diffHomoTime > 0
                  ? (diffHomoTime * 100).toFixed(2)
                  : (Math.abs(diffHomoTime) * 100).toFixed(2)}
                %
              </p>
            </div>
          </div>
          <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
            {averageHomoData[1]?.averageTime.toFixed(0)} dias
          </p>
          <p className="text-center text-xs text-gray-600">
            Últimos mês:{" "}
            <strong>{averageHomoData[0]?.averageTime.toFixed(0)} dias</strong>
          </p>
        </div>
      </div>
      <div className="grid mt-4 grid-cols-4 gap-x-3">
        <div className="flex flex-col p-4 h-[300px] border border-gray-200 bg-[#fff] shadow-xl col-span-1">
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
                value={70}
                text={"70%"}
                strokeWidth={6}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col p-4 h-[300px] border border-gray-200 bg-[#fff] shadow-xl col-span-3">
          <h1 className="text-gray-600 text-xl text-center">
            Potência pico instalada
          </h1>
          <ResponsiveContainer width="100%">
            <AreaChart
              width={530}
              height={250}
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15599a" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#15599a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="gray" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="Total"
                stroke="#fead61"
                fillOpacity={1}
                fill="url(#total)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex mt-4 grow flex-col p-4  border border-gray-200 bg-[#fff] shadow-xl">
        <h1 className="text-gray-600">CLIENTES ANIVERSARIANDO HOJE</h1>
      </div>
    </div>
  );
}

export default Home;
