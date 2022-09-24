import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MdDateRange } from "react-icons/md";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Tooltip,
} from "recharts";
var dateFilterParam = new Date();
dateFilterParam.setDate(dateFilterParam.getDate() - 2);
function PPSReport() {
  const [info, setInfo] = useState({});
  const [filterDate, setFilterDate] = useState({
    after: dateFilterParam,
    before: new Date(),
  });
  function handleFetchByDate() {
    axios
      .post("/api/calls/pps/report", { date: filterDate })
      .then((res) => setInfo(res.data));
  }
  useEffect(() => {
    axios
      .post("/api/calls/pps/report", { date: filterDate })
      .then((res) => setInfo(res.data));
  }, []);
  return (
    <div className="flex flex-col gap-y-2 bg-gray-100 grow p-6 w-full">
      <div className="flex flex-col lg:flex-row items-center justify-around p-2 w-full bg-[#fff] rounded border border-gray-200">
        <h1 className="uppercase text-[#15599a] text-xl font-bold font-raleway">
          Relatório
        </h1>
        <div className="flex flex-col lg:flex-row gap-y-2 items-center lg:gap-x-2">
          <p className="text-xl font-raleway uppercase">Entre:</p>
          <input
            value={filterDate.after}
            onChange={(e) =>
              setFilterDate({ ...filterDate, after: e.target.value })
            }
            className="border border-gray-200 outline-none p-2"
            type="date"
          />
          <p className="text-xl font-raleway uppercase">&</p>
          <input
            value={filterDate.before}
            onChange={(e) =>
              setFilterDate({ ...filterDate, before: e.target.value })
            }
            className="border border-gray-200 outline-none p-2"
            type="date"
          />
          <button
            onClick={handleFetchByDate}
            className="flex items-center gap-x-2 p-3 font-bold hover:bg-[#15599a] hover:text-white bg-[#fead61] rounded"
          >
            <p>Filtrar</p>
            <MdDateRange />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 items-center lg:flex-row lg:justify-around w-full p-2">
        <div className="flex-col justify-center w-fit bg-[#fff] border border-gray-200">
          <h1 className="text-center font-bold text-[#15599a]">
            CHAMADO POR TIPO
          </h1>
          <BarChart
            layout="vertical"
            barCategoryGap={10}
            width={400}
            height={800}
            data={info.byType}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              width={100}
              fontSize="10px"
              padding={{ left: "60px" }}
              type="category"
              dataKey="_id"
            />
            <Tooltip />
            <Bar
              dataKey="contagem"
              label={{ fill: "#fead61" }}
              fill="#15599a"
            />
          </BarChart>
        </div>
        <div className="flex flex-col justify-center w-fit bg-[#fff] border border-gray-200">
          <h1 className="text-center font-bold text-[#15599a]">
            CHAMADO POR VENDEDOR
          </h1>
          <BarChart
            layout="vertical"
            barCategoryGap={10}
            width={400}
            height={800}
            data={info.bySeller}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              width={100}
              fontSize="10px"
              padding={{ left: "60px" }}
              type="category"
              dataKey="_id"
            />
            <Tooltip />
            <Bar
              dataKey="contagem"
              label={{ fill: "#fead61" }}
              fill="#15599a"
            />
          </BarChart>
        </div>
        <div className="flex flex-col justify-center w-fit bg-[#fff] border border-gray-200">
          <h1 className="text-center font-bold text-[#15599a]">
            CHAMADO POR ATENDENTE
          </h1>
          <BarChart
            layout="vertical"
            barCategoryGap={10}
            width={400}
            height={800}
            data={info.byAttendant}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              width={100}
              fontSize="10px"
              padding={{ left: "60px" }}
              type="category"
              dataKey="_id"
            />
            <Tooltip />
            <Bar
              dataKey="contagem"
              label={{ fill: "#fead61" }}
              fill="#15599a"
            />
            <Bar dataKey="tempoMedio" label={false} fill="#fead61" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default PPSReport;
