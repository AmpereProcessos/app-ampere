import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import xml2js from "xml2js";
import * as XLSX from "xlsx";
function Teste() {
  const [file, setFile] = useState();
  const [month, setMonth] = useState();
  const [nomeInstalacao, setNomeInstalacao] = useState("");
  const [geracaoInstalacao, setGeracaoInstalacao] = useState("");
  const [instalacoes, setInstalacoes] = useState({});
  const [pdfMode, setPDFMode] = useState(false);
  function handleFileConvertion() {
    const reader = new FileReader();
    // const result = excelToJson({ sourceFile: file });
    // console.log(result);
    console.log(reader);
  }
  function setNome(nome, mes, geracao, numInstalacao) {
    if (!nome && !geracao) {
      return `Instalação ${numInstalacao} (${dayjs(mes).format("MM/YYYY")})`;
    } else {
      if (!nome && geracao && geracao != 0) {
        return `Instalação ${numInstalacao} (${dayjs(mes).format(
          "MM/YYYY"
        )}) - ${geracao}kWh gerados`;
      } else {
        if (nome && mes && geracao) {
          return `${nome} (${dayjs(mes).format(
            "MM/YYYY"
          )}) - ${geracao}kWh gerados`;
        }
        if (nome && mes && !geracao) {
          return `${nome} (${dayjs(mes).format("MM/YYYY")})`;
        }
      }
    }
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
      var newArr = d.filter(
        (item) => item.Período == dayjs(month).format("MM/YYYY") //dayjs().format("MM/YYYY")
      );
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
      setInstalacoes({
        ...instalacoes,
        [`${setNome(
          nomeInstalacao,
          month,
          geracaoInstalacao,
          Object.keys(instalacoes).length + 1
        )}`]: mappedArr,
      });
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
            (item) => item.Periodo == dayjs(month).format("YYYY/MM")
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
            [`${
              nomeInstalacao
                ? `${nomeInstalacao} (${dayjs(month).format("MM/YYYY")})`
                : `Instalação ${Object.keys(instalacoes).length + 1} (${dayjs(
                    month
                  ).format("MM/YYYY")})`
            }`]: mappedArr,
          });
          return mappedArr;
        }
      );
    };
  }
  async function handleFileInput() {
    // xlsx application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    // xml text/xml
    if (month == null || month == {}) {
      alert("MÊS DE ANÁLISE INVÁLIDO");
      return;
    } else {
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
  function getConsumoInstantaneo(geracaoText, arr) {
    let geradora = arr.filter((x) => x.modalidade == "Auto consumo-Geradora");
    let injecao = geradora[0] ? geradora[0].geracao : 0;
    let geracaoNumber = geracaoText.split("kWh")[0];
    geracaoNumber = Number(geracaoNumber);
    console.log(geradora);
    let consumoInstantaneo = geracaoNumber - injecao;
    return consumoInstantaneo;
  }
  function getGraficoData(data) {
    var arr = data.map((item) => {
      return {
        name: item.instalacao,
        value: Number(item.compensacao),
      };
    });
    return arr;
  }
  function sumEnergiaCompensada(arr) {
    var sumEconomizado = 0;
    var sumCompensada = 0;
    for (let i = 0; i < arr.length; i++) {
      let valorkWh = arr[i].valorkWh ? arr[i].valorkWh : 0.75;
      sumCompensada = sumCompensada + Number(arr[i].compensacao);
      sumEconomizado = sumEconomizado + Number(arr[i].compensacao) * valorkWh;
    }
    return {
      sumCompensada: sumCompensada,
      sumEconomizado: sumEconomizado,
    };
  }
  function sumValorFatura(arr) {
    var sum = 0;
    for (let i = 0; i < arr.length; i++) {
      let valor = arr[i].valorFatura ? Number(arr[i].valorFatura) : 0;
      sum = sum + valor;
    }
    return sum;
  }
  function getGeneralTotal(obj) {
    var sumFatura = 0;
    var sumEconomizado = 0;
    for (let i = 0; i < Object.keys(obj).length; i++) {
      let key = Object.keys(obj)[i];
      let arr = obj[key];
      // console.log(arr);
      for (let j = 0; j < arr.length; j++) {
        let valorkWh = arr[j].valorkWh ? arr[j].valorkWh : 0.75;
        let valorFatura = arr[j].valorFatura ? Number(arr[j].valorFatura) : 0;
        let valorEconomizado = arr[j].compensacao
          ? Number(arr[j].compensacao) * valorkWh
          : 0;
        // console.log(valorFatura);
        // console.log(valorEconomizado);
        sumFatura = sumFatura + valorFatura;
        sumEconomizado = sumEconomizado + valorEconomizado;
      }
    }
    return {
      faturas: sumFatura,
      economizado: sumEconomizado,
    };
  }
  function getTextColor(index) {
    let color = `bg-[${COLORS[index]}]`;
    return color;
  }
  // console.log(instalacoes);
  // console.log(dayjs(month).format("MM/YYYY"));
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
            <input
              className="outline-none bg-transparent p-1 border border-gray-200"
              type={"month"}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
            <input
              type="text"
              className="outline-none bg-transparent py-1 px-2 text-center border border-gray-200 w-[300px]"
              placeholder="NOMEIE A INSTALAÇÃO"
              value={nomeInstalacao}
              onChange={(e) => setNomeInstalacao(e.target.value.toUpperCase())}
            />
            <input
              type="text"
              className="outline-none bg-transparent py-1 px-2 text-center border border-gray-200 w-[300px]"
              placeholder="GERAÇÃO MENSAL DA INSTALAÇÃO..."
              value={geracaoInstalacao}
              onChange={(e) => setGeracaoInstalacao(Number(e.target.value))}
            />
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
          {Object.keys(instalacoes).length > 0 && (
            <div className="grid grid-cols-2">
              <div className="grid grid-cols-2">
                <div className="bg-[#fead61] text-xxs lg:text-base flex items-center justify-center text-center font-bold border-r border-gray-600">
                  VALOR TOTAL DAS FATURAS
                </div>
                <div className="flex items-center text-xxs lg:text-base justify-center text-center font-bold border-gray-600">
                  R${" "}
                  {getGeneralTotal(instalacoes)
                    .faturas.toFixed(2)
                    .replace(".", ",")}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="bg-[#15599a] flex items-center text-xxs lg:text-base justify-center text-center text-white font-bold border-r border-gray-600">
                  VALOR TOTAL ECONOMIZADO
                </div>
                <div className="flex items-center text-xxs lg:text-base justify-center text-center font-bold border-gray-600">
                  R${" "}
                  {getGeneralTotal(instalacoes)
                    .economizado.toFixed(2)
                    .replace(".", ",")}
                </div>
              </div>
            </div>
          )}

          {Object.keys(instalacoes).length > 0
            ? Object.keys(instalacoes).map((key, index) => (
                <div key={index} className="flex flex-col">
                  <h1 className="text-center font-bold bg-black  text-white text-sm p-1">
                    {key}
                  </h1>
                  <div className="grid grid-cols-6 lg:grid-cols-12 border-b border-gray-200">
                    <p className="hidden lg:block text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      PERÍODO
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      INSTALAÇÃO
                    </p>
                    <p className="hidden lg:block text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      MODALIDADE
                    </p>
                    <p className="hidden lg:block text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      QUOTA
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      GERAÇÃO
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      CONSUMO
                    </p>
                    <p className="hidden lg:block text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      TRANSFERIDO
                    </p>
                    <p className="hidden lg:block text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      RECEBIDO
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      COMPENSADO
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      SALDO ATUAL
                    </p>
                    <p className="hidden lg:block text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">
                      PREÇO DO kWh
                    </p>
                    <p className="text-xxs font-bold text-white bg-[#15599a] text-center p-1">
                      VALOR DA FATURA
                    </p>
                  </div>
                  {instalacoes[key].map((item, index2) => (
                    <div
                      key={index2}
                      className="grid grid-cols-6 lg:grid-cols-12 gap-1 border-b border-gray-200"
                    >
                      <p className="hidden lg:block text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
                        {formatPeriodo(item.periodo)}
                      </p>
                      <p
                        style={{
                          color: COLORS[index2],
                        }}
                        className={`text-xxs font-bold text-center border-r border-gray-200 p-1`}
                      >
                        {item.instalacao}
                      </p>
                      <p className="hidden lg:block text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
                        {item.modalidade == "Auto consumo-Geradora"
                          ? "GERADORA"
                          : "RECEBEDORA"}
                      </p>
                      <p className="hidden lg:block text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
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
                      <p className="hidden lg:block text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
                        {item.transferido != "0.0"
                          ? Number(item.transferido)
                              .toFixed(2)
                              .replace(".", ",")
                          : "-"}
                      </p>
                      <p className="hidden lg:block text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
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
                      <p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
                        {item.saldoAtual
                          ? Number(item.saldoAtual).toFixed(2).replace(".", ",")
                          : "-"}
                      </p>
                      <div className="hidden lg:flex items-center border-r border-gray-200">
                        <input
                          type={"number"}
                          placeholder="-"
                          value={instalacoes[key][index2].valorkWh}
                          onChange={(e) => {
                            var obj = instalacoes;
                            obj[key][index2].valorkWh = Number(e.target.value);
                            setInstalacoes({ ...obj });
                          }}
                          className="text-xxs font-bold text-gray-600 text-center p-1 outline-none h-full w-full bg-transparent"
                        />
                        <p className="text-xxs font-bold text-gray-600 text-center mr-2">
                          R$/kWh
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-xxs font-bold text-gray-600 text-center">
                          R$
                        </p>
                        <input
                          type={"number"}
                          placeholder="-"
                          value={instalacoes[key][index2].valorFatura}
                          onChange={(e) => {
                            var obj = instalacoes;
                            obj[key][index2].valorFatura = Number(
                              e.target.value
                            );
                            setInstalacoes({ ...obj });
                          }}
                          className="text-xxs font-bold text-gray-600 text-center p-1 outline-none h-full w-full bg-transparent"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-rows-2 grid-cols-1 xs:grid-rows-1 xs:grid-cols-2 px-2 my-2">
                    <div className="col-span-1 flex flex-col justify-center items-center">
                      <h1 className="text-xss lg:text-xs text-center font-bold">
                        ENERGIA COMPENSADA POR INSTALAÇÃO
                      </h1>
                      <div className="w-[250px] h-[250px] lg:w-[250px] lg:h-[250px] self-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart width="100%" height="80%">
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
                    <div className="col-span-1 flex flex-col gap-2 justify-center">
                      {key.split("-").length > 1 && (
                        <div className="border border-[#15599a] p-2 rounded-md">
                          <h1 className="text-center font-bold text-xxs lg:text-xs">
                            CONSUMO INSTANTÂNEO
                          </h1>
                          <p className="text-center font-bold text-xxs lg:text-base text-[#fead61]">
                            {getConsumoInstantaneo(
                              key.split("-")[1],
                              instalacoes[key]
                            )}{" "}
                            kWh
                          </p>
                        </div>
                      )}
                      <div className="border border-[#15599a] p-2 rounded-md">
                        <h1 className="text-center font-bold text-xxs lg:text-xs">
                          VALOR TOTAL DE FATURAS
                        </h1>
                        <p className="text-center font-bold text-xxs lg:text-base text-orange-500">
                          R${" "}
                          {sumValorFatura(instalacoes[key])
                            .toFixed(2)
                            .replace(".", ",")}
                        </p>
                      </div>
                      <div className="border border-[#15599a] p-2 rounded-md">
                        <h1 className="text-center font-bold text-xxs lg:text-xs">
                          ENERGIA TOTAL COMPENSADA
                        </h1>
                        <p className="text-center font-bold text-xxs lg:text-base text-[#15599a]">
                          {sumEnergiaCompensada(instalacoes[key]).sumCompensada}{" "}
                          kWh
                        </p>
                      </div>
                      <div className="border border-[#15599a] p-2 rounded-md">
                        <h1 className="text-center font-bold text-xxs lg:text-xs">
                          VALOR APROXIMADO ECONOMIZADO
                        </h1>
                        <p className="text-center font-bold text-xxs lg:text-base text-green-500">
                          R${" "}
                          {sumEnergiaCompensada(instalacoes[key])
                            .sumEconomizado.toFixed(2)
                            .replace(".", ",")}
                        </p>
                      </div>
                    </div>
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
