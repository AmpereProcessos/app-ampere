import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import { storage } from "../utils/firebase";
import Logo from "../utils/logo.png";
import Link from "next/link";
import Image from "next/image";
import { FiCheck } from "react-icons/fi";
import dayjs from "dayjs";
import xml2js from "xml2js";
import * as XLSX from "xlsx";
function Teste() {
  const [file, setFile] = useState();
  const [instalacoes, setInstalacoes] = useState({});
  const [pdfMode, setPDFMode] = useState(false);
  function handleFileConvertion() {
    const reader = new FileReader();
    // const result = excelToJson({ sourceFile: file });
    // console.log(result);
    console.log(reader);
  }
  function readExcel(file) {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      fileReader.onerror = (err) => {
        reject(err);
      };
    });
    promise.then((d) => {
      var newArr = d.filter((item) => item.Período == "01/2023");
      var mappedArr = newArr.map((item) => {
        return {
          periodo: item.Período,
          instalacao: item.Instalação,
          modalidade: item.Modalidade,
          quota: item.Quota,
          geracao: item.Geração,
          transferido: item.Transferido,
          consumo: item.Consumo,
          recebimento: item.Recebimento,
          compensacao: item.Compensação,
          saldoAtual: item["Saldo Atual"],
        };
      });
      console.log(Object.keys(instalacoes).length);
      setInstalacoes({
        ...instalacoes,
        [`Instalação ${Object.keys(instalacoes).length + 1}`]: mappedArr,
      });
      console.log(mappedArr);
      return mappedArr;
    });
  }
  function readXML(file) {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = (e) => {
      xml2js.parseString(
        e.target.result,
        { explicitArray: false },
        (err, result) => {
          if (err) {
            console.log(err);
            throw err;
          }
          var json = JSON.stringify(result, null, 4);
          var newArr = JSON.parse(json);
          newArr = newArr.Relatorio_gd.Linha.filter(
            (item) => item.Periodo == "2023/01"
          );
          var mappedArr = newArr.map((item) => {
            return {
              periodo: item.Periodo,
              instalacao: item.Instalacao,
              modalidade: item.Modalidade,
              quota: item.Quota,
              geracao: item.Qtd_geracao,
              transferido: item.Qtd_transferencia,
              consumo: item.Qtd_consumo,
              recebimento: item.Qtd_recebimento,
              compensacao: item.Qtd_compensacao,
              saldoAtual: item.Qtd_saldo_atual,
            };
          });
          setInstalacoes({
            ...instalacoes,
            [`Instalação ${Object.keys(instalacoes).length + 1}`]: mappedArr,
          });
          return mappedArr;
        }
      );
    };
  }
  async function handleFileInput() {
    // xlsx application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    // xml text/xml
    if (
      file?.type ==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      readExcel(file);
    } else if (file?.type == "text/xml") {
      readXML(file);
    } else {
      alert("FORMATO INVÁLIDO");
    }
  }
  function formatPeriodo(periodo) {
    let splited = periodo.split("/");
    if (splited[0].length == 4) {
      return `${splited[1]}/${splited[0]}`;
    } else {
      return `${splited[0]}/${splited[1]}`;
    }
  }
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#a8d5e2",
    "#DB5375",
    "#B5BD89",
    "#729EA1",
    "##1D2C2E",
    "#023e8a",
    "#ff006e",
    "b5179e",
  ];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  function getGraficoData(data) {
    let arr = data.filter((item) => item.modalidade != "Auto consumo-Geradora");
    arr = arr.map((item) => {
      return {
        name: item.instalacao,
        value: Number(item.compensacao),
      };
    });
    return arr;
  }
  function getTextColor(index) {
    let color = `bg-[${COLORS[index]}]`;
    return color;
  }
  console.log(instalacoes, Object.keys(instalacoes));
  return (
    <div className="grow bg-zinc-100 p-4">
      <div className="flex flex-col items-center">
        {pdfMode ? (
          <h1
            onClick={() => setPDFMode(false)}
            className="text-center text-xl text-[#15599a] font-bold"
          >
            RELATÓRIO
          </h1>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-center text-xl text-[#15599a] font-bold">
              RELATÓRIO DE DISTRIBUIÇÃO
            </h1>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {file ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {file?.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      Adicione o arquivo aqui
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                className="h-full w-full opacity-0"
                type="file"
                accept=".xlsx, .xml"
              />
            </div>
            <button
              className="p-2 text-xs rounded border-2 border-[#15599a] text-[#15599a] font-bold hover:border-0 hover:bg-[#15599a] hover:text-white"
              onClick={() => handleFileInput()}
            >
              ADICIONAR INSTALAÇÃO
            </button>
            <button
              onClick={() => setPDFMode(true)}
              className="p-2 text-xs rounded border-2 border-[#15599a] text-[#15599a] font-bold hover:border-0 hover:bg-[#15599a] hover:text-white"
            >
              MODO PDF
            </button>
          </div>
        )}

        <div className="flex flex-col border border-gray-600 mt-2">
          {Object.keys(instalacoes).length > 0
            ? Object.keys(instalacoes).map((key, index) => (
                <div key={index} className="flex flex-col">
                  <h1 className="text-center font-bold bg-black uppercase text-white text-sm p-1">
                    {key}
                  </h1>
                  <div className="grid grid-cols-10 border-b border-gray-200">
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      PERÍODO
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      INSTALAÇÃO
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      MODALIDADE
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      QUOTA
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      GERAÇÃO
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      CONSUMO
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      TRANSFERIDO
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      RECEBIDO
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      COMPENSADO
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] text-center p-1">
                      SALDO ATUAL
                    </p>
                  </div>
                  {instalacoes[key].map((item, index2) => (
                    <div
                      key={index2}
                      className="grid grid-cols-10 gap-1 border-b border-gray-200"
                    >
                      <p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
                        {formatPeriodo(item.periodo)}
                      </p>
                      <p
                        style={{
                          color: index2 > 0 ? COLORS[index2 - 1] : "#4B5563",
                        }}
                        className={`text-xxs font-bold text-center border-r border-gray-200 p-1`}
                      >
                        {item.instalacao}
                      </p>
                      <p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
                        {item.modalidade == "Auto consumo-Geradora"
                          ? "GERADORA"
                          : "RECEBEDORA"}
                      </p>
                      <p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
                        {item.quota
                          ? `${item.quota.substr(0, item.quota.length - 4)}%`
                          : "-"}
                      </p>
                      <p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
                        {item.geracao != "0.0"
                          ? Number(item.geracao).toFixed(2).replace(".", ",")
                          : "-"}
                      </p>
                      <p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
                        {item.consumo != "0.0"
                          ? Number(item.consumo).toFixed(2).replace(".", ",")
                          : "-"}
                      </p>
                      <p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
                        {item.transferido != "0.0"
                          ? Number(item.transferido)
                              .toFixed(2)
                              .replace(".", ",")
                          : "-"}
                      </p>
                      <p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
                        {item.recebimento != "0.0"
                          ? Number(item.recebimento)
                              .toFixed(2)
                              .replace(".", ",")
                          : "-"}
                      </p>
                      <p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
                        {item.compensacao != "0.0"
                          ? Number(item.compensacao)
                              .toFixed(2)
                              .replace(".", ",")
                          : "-"}
                      </p>
                      <p className="text-xxs font-bold text-gray-600 text-center p-1">
                        {item.saldoAtual
                          ? Number(item.saldoAtual).toFixed(2).replace(".", ",")
                          : "-"}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-center items-center w-[250px] h-[250px] self-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={250} height={250}>
                        <Pie
                          data={getGraficoData(instalacoes[key])}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getGraficoData(instalacoes[key]).map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))
            : false}
        </div>

        {/**<h1 classNameName="text-center text-[#15599a] font-bold">ENTREGUES</h1>
        <div classNameName="grid grid-cols-6">
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            NOME DO PROJETO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            NOME DO CONTRATO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            QTDE MÓDULOS
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            TOPOLOGIA
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            CIDADE
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            DESDE ENTREGA
          </div>
        </div>
        <div classNameName="flex flex-col bg-[#fff]">
          {entregues.map((obj) => (
            <div classNameName="grid grid-cols-6 h-[36px]">
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 text-center font-bold border-b border-gray-200">
                {obj.nomeDoProjeto}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoContrato}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.qtdeModulos}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.topologia}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.cidade}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.compra.statusEntrega == "ENTREGUE"
                  ? obj.compra.dataEntrega
                    ? `${dayjs(new Date()).diff(
                        obj.compra.dataEntrega,
                        "days"
                      )} dias`
                    : `${dayjs(new Date()).diff(
                        obj.compra.previsaoEntrega,
                        "days"
                      )} dias`
                  : "-"}
              </div>
            </div>
          ))}
        </div> */}
        {/* <h1 classNameName="text-center text-[#15599a] font-bold">EM ROTA</h1>
        <div classNameName="grid grid-cols-6">
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            NOME DO PROJETO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            NOME DO CONTRATO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            QTDE MÓDULOS
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            TOPOLOGIA
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            CIDADE
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            ATÉ ENTREGA
          </div>
        </div>
        <div classNameName="flex flex-col bg-[#fff]">
          {emRota.map((obj, index) => (
            <div key={index} classNameName="grid grid-cols-6 h-[36px]">
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoProjeto}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoContrato}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.qtdeModulos}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.topologia}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.cidade}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {dayjs(obj.compra.previsaoEntrega).diff(new Date(), "day")} dias
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}

export default Teste;
