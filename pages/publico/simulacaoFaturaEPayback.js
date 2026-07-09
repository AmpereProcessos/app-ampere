import React, { useState } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { MdRestartAlt } from "react-icons/md";
import EmptyLogo from "../../utils/images/logo-texto-azul.png";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const fatoresListOfDict = {
  ITUIUTABA: {
    0: 139.04,
    1: 139.09,
    2: 127.06,
    3: 121.16,
    4: 108.14,
    5: 103.4,
    6: 108.91,
    7: 131.73,
    8: 128.55,
    9: 136.27,
    10: 139.12,
    11: 143.86,
  },
  UBERLÂNDIA: {
    0: 134.84,
    1: 142.25,
    2: 124.22,
    3: 122.08,
    4: 109.69,
    5: 104.98,
    6: 110.49,
    7: 132.97,
    8: 132.29,
    9: 137.66,
    10: 135.86,
    11: 140.16,
  },
  CANÁPOLIS: {
    0: 138.9,
    1: 141.47,
    2: 129.2,
    3: 123.52,
    4: 111.85,
    5: 105.39,
    6: 109.91,
    7: 132.99,
    8: 128.3,
    9: 136.57,
    10: 140.16,
    11: 142.74,
  },
  TUPACIGUARA: {
    0: 137.3,
    1: 143.47,
    2: 125.41,
    3: 122.45,
    4: 111.1,
    5: 105.44,
    6: 110.32,
    7: 132.39,
    8: 130.2,
    9: 137.37,
    10: 137.98,
    11: 142.93,
  },
  "CAMPINA VERDE": {
    0: 139.17,
    1: 140.43,
    2: 126.21,
    3: 121.26,
    4: 106.43,
    5: 99.58,
    6: 106.65,
    7: 128.64,
    8: 127.04,
    9: 135.35,
    10: 141.01,
    11: 145.95,
  },
  CENTRALINA: {
    0: 139.36,
    1: 143.32,
    2: 128.67,
    3: 125.46,
    4: 112.73,
    5: 106.09,
    6: 110.37,
    7: 133.21,
    8: 128.84,
    9: 137.27,
    10: 140.26,
    11: 142.06,
  },
  PRATA: {
    0: 136.83,
    1: 141.5,
    2: 124.63,
    3: 122.37,
    4: 107.94,
    5: 130.69,
    6: 107.99,
    7: 130.69,
    8: 126.65,
    9: 135.96,
    10: 138.61,
    11: 143.52,
  },
  "SÃO SIMÃO": {
    0: 138.24,
    1: 142.45,
    2: 129.67,
    3: 121.6,
    4: 107.49,
    5: 100.34,
    6: 105.14,
    7: 125.33,
    8: 123.91,
    9: 134.46,
    10: 140.65,
    11: 145.85,
  },
  ITUMBIARA: {
    0: 134.53,
    1: 137.11,
    2: 124.64,
    3: 121.87,
    4: 111.3,
    5: 105.64,
    6: 110.0,
    7: 133.57,
    8: 127.79,
    9: 134.34,
    10: 134.75,
    11: 139.03,
  },
  "SANTA VITÓRIA": {
    0: 142.62,
    1: 142.57,
    2: 130.86,
    3: 123.76,
    4: 109.13,
    5: 102.96,
    6: 107.79,
    7: 130.13,
    8: 128.26,
    9: 137.51,
    10: 143.05,
    11: 147.4,
  },
  QUIRINÓPOLIS: {
    0: (5614 * 0.81 * 30) / 1000,
    1: (5667 * 0.81 * 30) / 1000,
    2: (5248 * 0.81 * 30) / 1000,
    3: (5072 * 0.81 * 30) / 1000,
    4: (4562 * 0.81 * 30) / 1000,
    5: (4313 * 0.81 * 30) / 1000,
    6: (4478 * 0.81 * 30) / 1000,
    7: (5442 * 0.81 * 30) / 1000,
    8: (5289 * 0.81 * 30) / 1000,
    9: (5560 * 0.81 * 30) / 1000,
    10: (5689 * 0.81 * 30) / 1000,
    11: (5798 * 0.81 * 30) / 1000,
  },
};
const disponibilidadePorTipoDeLigacao = {
  Monofásico: 30,
  Bifásico: 50,
  Trifásico: 100,
};
function SimulacaoFaturaEPayback() {
  const [info, setInfo] = useState({
    qtdeModulos: 0,
    potModulos: 0,
    tipoDeLigacao: "NÃO DEFINIDO",
    cidade: "ITUIUTABA",
    anoInicio: 2023,
    mesInicio: 1,
    valorkWh: 0.75,
    valorFioBConcessionaria: 0.232757,
    consumoMedio: 0,
    valorInvestido: 0,
    iluminacaoPublica: 0,
    simultaneidade: 0.33,
    rendimentoPoupanca: 0.6808,
  });
  const [data, setData] = useState();
  const [graphData, setGraphData] = useState();
  const [msg, setMsg] = useState({ text: "", color: "" });
  console.log(info.rendimentoPoupanca / 100);
  function simulate() {
    if (info.qtdeModulos <= 0) {
      setMsg({
        text: "Por favor, preencha uma quantidade válida de módulos",
        color: "text-red-500",
      });
      setTimeout(() => {
        setMsg({ text: "", color: "" });
      }, 2500);
      return;
    }
    if (info.potModulos <= 0) {
      setMsg({
        text: "Por favor, preencha uma potência válida de módulos",
        color: "text-red-500",
      });
      setTimeout(() => {
        setMsg({ text: "", color: "" });
      }, 2500);
      return;
    }
    if (info.consumoMedio <= 0) {
      setMsg({
        text: "Por favor, preencha um consumo válido.",
        color: "text-red-500",
      });
      setTimeout(() => {
        setMsg({ text: "", color: "" });
      }, 2500);
      return;
    }
    if (info.valorInvestido <= 0) {
      setMsg({
        text: "Por favor, preencha um valor de investimento válido.",
        color: "text-red-500",
      });
      setTimeout(() => {
        setMsg({ text: "", color: "" });
      }, 2500);
      return;
    }
    const irradianca = fatoresListOfDict[info.cidade];
    const consumo = [
      { mes: 1, valor: info.consumoMedio },
      { mes: 2, valor: info.consumoMedio },
      { mes: 3, valor: info.consumoMedio },
      { mes: 4, valor: info.consumoMedio },
      { mes: 5, valor: info.consumoMedio },
      { mes: 6, valor: info.consumoMedio },
      { mes: 7, valor: info.consumoMedio },
      { mes: 8, valor: info.consumoMedio },
      { mes: 9, valor: info.consumoMedio },
      { mes: 10, valor: info.consumoMedio },
      { mes: 11, valor: info.consumoMedio },
      { mes: 12, valor: info.consumoMedio },
    ];
    const geracao = Object.keys(irradianca).map((key, index) =>
      Number(((irradianca[key] * info.potModulos * info.qtdeModulos) / 1000).toFixed(2)),
    );
    const consumoInstantaneo = consumo.map((obj, index) => {
      let consumo =
        geracao[index] > obj.valor * info.simultaneidade
          ? obj.valor * info.simultaneidade
          : geracao[index];
      return consumo;
    });
    const liquidoMensal = geracao.map((geracao, index) =>
      Number((geracao - consumo[index].valor).toFixed(2)),
    );
    const progressaoKWH = {
      2023: info.valorkWh,
      2024: info.valorkWh * 1.05,
      2025: info.valorkWh * 1.05 ** 2,
      2026: info.valorkWh * 1.05 ** 3,
      2027: info.valorkWh * 1.05 ** 4,
      2028: info.valorkWh * 1.05 ** 5,
      2029: info.valorkWh * 1.05 ** 6,
    };
    const progressaoFioB = {
      2023: (info.valorFioBConcessionaria / info.valorkWh) * 0.15 * progressaoKWH[2023],
      2024: (info.valorFioBConcessionaria / info.valorkWh) * 0.3 * progressaoKWH[2024],
      2025: (info.valorFioBConcessionaria / info.valorkWh) * 0.45 * progressaoKWH[2025],
      2026: (info.valorFioBConcessionaria / info.valorkWh) * 0.6 * progressaoKWH[2026],
      2027: (info.valorFioBConcessionaria / info.valorkWh) * 0.75 * progressaoKWH[2027],
      2028: (info.valorFioBConcessionaria / info.valorkWh) * 0.9 * progressaoKWH[2028],
      2029: (info.valorFioBConcessionaria / info.valorkWh) * 1 * progressaoKWH[2029],
    };
    var meses;
    meses =
      (new Date(2029, 12, 31).getFullYear() -
        new Date(info.anoInicio, info.mesInicio, 1).getFullYear()) *
      12;
    meses -= new Date(info.anoInicio, info.mesInicio, 1).getMonth();
    meses += new Date(2029, 12, 31).getMonth();
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    var tabelaFinal = [];

    var saldoCumulado = 0;
    var saldoCumuladoDireitoAdquirido = 0;
    var anoComparacao = info.anoInicio;
    var mesComparacao = info.mesInicio;
    var saldoPassado = 0;
    var saldoPassadoDireitoAdquirido = 0;
    var poupanca = -info.valorInvestido;
    var payback = -info.valorInvestido;
    var paybackDireitoAdquirido = -info.valorInvestido;
    for (let i = 0; i <= meses; i++) {
      var saldoPassado = saldoCumulado;
      var saldoPassadoDireitoAdquirido = saldoCumuladoDireitoAdquirido;

      var liquidoMesComparacao = liquidoMensal[mesComparacao - 1];
      var injetadoMesComparacao =
        geracao[mesComparacao - 1] - consumoInstantaneo[mesComparacao - 1];

      var usoConcessionariaMesComparacao =
        consumo[mesComparacao - 1].valor - consumoInstantaneo[mesComparacao - 1];

      var saldoParaAdicionarDireitoAdquirido =
        injetadoMesComparacao +
        disponibilidadePorTipoDeLigacao[info.tipoDeLigacao] -
        usoConcessionariaMesComparacao;

      saldoCumulado =
        saldoCumulado + liquidoMensal[mesComparacao - 1] > 0
          ? saldoCumulado + liquidoMensal[mesComparacao - 1]
          : 0;

      saldoCumuladoDireitoAdquirido =
        saldoCumuladoDireitoAdquirido + saldoParaAdicionarDireitoAdquirido > 0
          ? saldoCumuladoDireitoAdquirido + saldoParaAdicionarDireitoAdquirido
          : 0;
      var compensacaoSeComUsoDeSaldo =
        saldoPassado <= 0
          ? injetadoMesComparacao
          : saldoPassado + injetadoMesComparacao < usoConcessionariaMesComparacao
            ? saldoPassado + injetadoMesComparacao
            : usoConcessionariaMesComparacao;
      var compensacao =
        liquidoMesComparacao >= 0
          ? usoConcessionariaMesComparacao
          : compensacaoSeComUsoDeSaldo > 0
            ? compensacaoSeComUsoDeSaldo
            : 0;

      var fioB = compensacao * progressaoFioB[anoComparacao];
      var outrosCustos =
        compensacao >= usoConcessionariaMesComparacao
          ? fioB
          : fioB + (usoConcessionariaMesComparacao - compensacao) * progressaoKWH[anoComparacao];

      var custoDisponibilidade =
        disponibilidadePorTipoDeLigacao[info.tipoDeLigacao] * progressaoKWH[anoComparacao];

      var valorFatura =
        custoDisponibilidade > outrosCustos
          ? custoDisponibilidade + info.iluminacaoPublica
          : outrosCustos + info.iluminacaoPublica;
      var valorFaturaDireitoAdquirido =
        saldoParaAdicionarDireitoAdquirido > 0
          ? custoDisponibilidade + info.iluminacaoPublica
          : saldoParaAdicionarDireitoAdquirido + saldoPassadoDireitoAdquirido >= 0
            ? custoDisponibilidade + info.iluminacaoPublica
            : Math.abs(saldoParaAdicionarDireitoAdquirido + saldoPassadoDireitoAdquirido) *
                progressaoKWH[anoComparacao] +
              info.iluminacaoPublica +
              custoDisponibilidade;

      var economia =
        consumo[mesComparacao - 1].valor * progressaoKWH[anoComparacao] +
        info.iluminacaoPublica -
        valorFatura;
      var economiaDireitoAdquirido =
        consumo[mesComparacao - 1].valor * progressaoKWH[anoComparacao] +
        info.iluminacaoPublica -
        valorFaturaDireitoAdquirido;

      payback = payback + economia;
      paybackDireitoAdquirido = paybackDireitoAdquirido + economiaDireitoAdquirido;
      if (i > 0) poupanca = poupanca + (info.rendimentoPoupanca / 100) * -poupanca;
      if (custoDisponibilidade > outrosCustos)
        saldoCumulado = saldoCumulado + disponibilidadePorTipoDeLigacao[info.tipoDeLigacao];

      tabelaFinal.push({
        ANO: anoComparacao,
        MÊS: mesComparacao,
        TAG:
          mesComparacao >= 10
            ? `${mesComparacao}/${anoComparacao}`
            : `0${mesComparacao}/${anoComparacao}`,
        "SALDO ACUMULADO (NOVA LEI)": Number(saldoCumulado.toFixed(2)),
        "SALDO ACUMULADO (DIREITO ADQUIRIDO)": Number(saldoCumuladoDireitoAdquirido.toFixed(2)),
        "VALOR FATURA (NOVA LEI)": Number(valorFatura.toFixed(2)),
        "VALOR FATURA (DIREITO ADQUIRIDO)": Number(valorFaturaDireitoAdquirido.toFixed(2)),

        "PAYBACK (NOVA LEI)": Number(payback.toFixed(2)),
        "PAYBACK (DIREITO ADQUIRIDO)": Number(paybackDireitoAdquirido.toFixed(2)),
        "INVESTIMENTO POUPANÇA": poupanca,
      });

      if (mesComparacao + 1 > 12) {
        mesComparacao = 1;
        anoComparacao = anoComparacao + 1;
      } else {
        mesComparacao = mesComparacao + 1;
      }
    }
    console.log(tabelaFinal);
    setData(tabelaFinal);
    setGraphData(tabelaFinal);
  }

  function getYearlyGraphData(data) {
    let arrayOfYears = data.map((data) => data.ANO);
    let uniqueYears = arrayOfYears.filter((value, index, array) => array.indexOf(value) === index);
    let newArrOfObjs = uniqueYears.map((year) => {
      let matchingObjForThisYear = data.filter((item) => item.ANO == year && item["MÊS"] == 12)[0];
      return {
        TAG: year,
        "PAYBACK (DIREITO ADQUIRIDO)": matchingObjForThisYear["PAYBACK (DIREITO ADQUIRIDO)"],
        "PAYBACK (NOVA LEI)": matchingObjForThisYear["PAYBACK (NOVA LEI)"],
        "INVESTIMENTO POUPANÇA": matchingObjForThisYear["INVESTIMENTO POUPANÇA"],
      };
    });
    setGraphData(newArrOfObjs);
  }
  if (data) {
    return (
      <div className="flex grow flex-col p-6">
        <div className="mb-3 flex w-full items-center justify-center gap-2">
          <h1 className="text-center font-['Roboto'] text-xl font-bold text-[#15599a]">ANÁLISE</h1>
          <button
            onClick={() => setData(null)}
            className="border-primary/80 text-foreground hover:bg-primary/80 rounded border p-2 duration-300 ease-in-out hover:scale-110 hover:text-white"
          >
            <MdRestartAlt />
          </button>
        </div>
        <div className="flex w-full items-center justify-center lg:justify-end">
          <button
            onClick={() => getYearlyGraphData(data)}
            className="mb-2 rounded bg-[#15599a] p-2 text-xs text-white duration-300 ease-in-out hover:scale-110"
          >
            VISUALIZAÇÃO POR ANO
          </button>
        </div>
        <div className="h-[600px] w-full">
          <ResponsiveContainer>
            <BarChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="TAG" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="PAYBACK (DIREITO ADQUIRIDO)" fill="#fead61" />
              <Bar dataKey="PAYBACK (NOVA LEI)" fill="#15599a" />
              <Bar dataKey="INVESTIMENTO POUPANÇA" fill="#023047" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid w-full grid-cols-6 lg:grid-cols-8">
          <div className="text-xxs flex items-center justify-center border-r border-white bg-black p-1 text-center font-bold text-white lg:text-base">
            PERÍODO
          </div>
          <div className="text-xxs hidden items-center justify-center border-r border-white bg-black p-1 text-center font-bold text-white lg:flex lg:text-base">
            SALDO DIREITO ADQUIRIDO
          </div>
          <div className="text-xxs hidden items-center justify-center border-r border-white bg-black p-1 text-center font-bold text-white lg:flex lg:text-base">
            SALDO NOVA LEI
          </div>
          <div className="text-xxs flex items-center justify-center border-r border-white bg-black p-1 text-center font-bold text-white lg:text-base">
            FATURA DIREITO ADQUIRIDO
          </div>
          <div className="text-xxs flex items-center justify-center border-r border-white bg-black p-1 text-center font-bold text-white lg:text-base">
            FATURA NOVA LEI{" "}
          </div>
          <div className="text-xxs flex items-center justify-center border-r border-white bg-black p-1 text-center font-bold text-white lg:text-base">
            PAYBACK DIREITO ADQUIRIDO
          </div>
          <div className="text-xxs flex items-center justify-center border-r border-white bg-black p-1 text-center font-bold text-white lg:text-base">
            PAYBACK NOVA LEI
          </div>
          <div className="text-xxs flex items-center justify-center bg-black p-1 text-center font-bold text-white lg:text-base">
            POUPANÇA
          </div>
        </div>
        {data?.map((obj, index) => (
          <div
            key={index}
            className="border-border grid w-full grid-cols-6 border-x border-b lg:grid-cols-8"
          >
            <h1 className="text-xxs text-foreground border-border border-r p-1 text-center lg:text-sm">
              {obj["TAG"]}
            </h1>
            <h1 className="text-xxs text-foreground border-border hidden border-r p-1 text-center lg:block lg:text-sm">
              {obj["SALDO ACUMULADO (DIREITO ADQUIRIDO)"].toFixed(2)}
            </h1>
            <h1 className="text-xxs text-foreground border-border hidden border-r p-1 text-center lg:block lg:text-sm">
              {obj["SALDO ACUMULADO (NOVA LEI)"].toFixed(2)}
            </h1>
            <h1 className="text-xxs text-foreground border-border border-r p-1 text-center lg:text-sm">
              {obj["VALOR FATURA (DIREITO ADQUIRIDO)"].toFixed(2)}
            </h1>
            <h1 className="text-xxs text-foreground border-border border-r p-1 text-center lg:text-sm">
              {obj["VALOR FATURA (NOVA LEI)"].toFixed(2)}
            </h1>
            <h1
              className={`text-xxs text-center lg:text-sm ${obj["PAYBACK (DIREITO ADQUIRIDO)"] > 0 ? "text-green-500" : "text-red-500"} border-border border-r p-1`}
            >
              {obj["PAYBACK (DIREITO ADQUIRIDO)"].toFixed(2)}
            </h1>
            <h1
              className={`text-xxs text-center lg:text-sm ${obj["PAYBACK (NOVA LEI)"] > 0 ? "text-green-500" : "text-red-500"} p-1`}
            >
              {obj["PAYBACK (NOVA LEI)"].toFixed(2)}
            </h1>
            <h1 className="text-xxs text-foreground border-border border-r p-1 text-center lg:text-sm">
              {obj["INVESTIMENTO POUPANÇA"].toFixed(2)}
            </h1>
          </div>
        ))}
      </div>
    );
  } else
    return (
      <div className="flex grow flex-col items-center justify-center p-6 lg:flex-row">
        <div className="mr-4">
          <Image src={EmptyLogo} />
        </div>
        <div className="flex w-full flex-col lg:w-[40%]">
          <h1 className="text-center font-['Roboto'] text-xl font-bold text-[#15599a]">
            SIMULAÇÃO DE FATURAS E PAYBACK
          </h1>
          <div className="flex w-full flex-col gap-2 px-12 py-2">
            <div className="grid w-full grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-2 lg:grid-rows-1">
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">
                  Quantidade de Módulos
                </label>
                <input
                  value={info.qtdeModulos}
                  onChange={(e) => setInfo({ ...info, qtdeModulos: Number(e.target.value) })}
                  type={"number"}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] outline-hidden"
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">
                  Potência dos Módulos
                </label>
                <input
                  value={info.potModulos}
                  onChange={(e) => setInfo({ ...info, potModulos: Number(e.target.value) })}
                  type={"number"}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] outline-hidden"
                />
              </div>
            </div>
            <div className="grid w-full grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-2 lg:grid-rows-1">
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">Tipo de ligação</label>
                <select
                  value={info.tipoDeLigacao}
                  onChange={(e) => setInfo({ ...info, tipoDeLigacao: e.target.value })}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] uppercase outline-hidden"
                >
                  <option value={"Monofásico"}>Monofásico</option>
                  <option value={"Bifásico"}>Bifásico</option>
                  <option value={"Trifásico"}>Trifásico</option>
                  <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                </select>
              </div>
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">Cidade</label>
                <select
                  value={info.cidade}
                  onChange={(e) => setInfo({ ...info, cidade: e.target.value })}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] uppercase outline-hidden"
                >
                  {Object.keys(fatoresListOfDict).map((cidade, index) => (
                    <option key={index} value={cidade}>
                      {cidade}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-2 lg:grid-rows-1">
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">Ano de início</label>
                <select
                  value={info.anoInicio}
                  onChange={(e) => setInfo({ ...info, anoInicio: Number(e.target.value) })}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] uppercase outline-hidden"
                >
                  <option value={2023}>2023</option>
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                  <option value={2029}>2029</option>
                </select>
              </div>
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">Mês de início</label>
                <select
                  value={info.mesInicio}
                  onChange={(e) => setInfo({ ...info, mesInicio: Number(e.target.value) })}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] uppercase outline-hidden"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                  <option value={9}>9</option>
                  <option value={10}>10</option>
                  <option value={11}>11</option>
                  <option value={12}>12</option>
                </select>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-2 lg:grid-rows-1">
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">Valor do kWh</label>
                <input
                  value={info.valorkWh}
                  onChange={(e) => setInfo({ ...info, valorkWh: Number(e.target.value) })}
                  type={"number"}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] outline-hidden"
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">Valor do Fio B</label>
                <input
                  value={info.valorFioBConcessionaria}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      valorFioBConcessionaria: Number(e.target.value),
                    })
                  }
                  type={"number"}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] outline-hidden"
                />
              </div>
            </div>
            <div className="grid w-full grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-2 lg:grid-rows-1">
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">
                  Iluminação pública
                </label>
                <input
                  value={info.iluminacaoPublica}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      iluminacaoPublica: Number(e.target.value),
                    })
                  }
                  type={"number"}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] outline-hidden"
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">Simultaneidade</label>
                <input
                  value={info.simultaneidade}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      simultaneidade: Number(e.target.value),
                    })
                  }
                  type={"number"}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] outline-hidden"
                />
              </div>
            </div>
            <div className="grid w-full grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-2 lg:grid-rows-1">
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">
                  Consumo médio (kWh)
                </label>
                <input
                  value={info.consumoMedio}
                  onChange={(e) => setInfo({ ...info, consumoMedio: Number(e.target.value) })}
                  type={"number"}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] outline-hidden"
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">
                  Valor investido (R$)
                </label>
                <input
                  value={info.valorInvestido}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      valorInvestido: Number(e.target.value),
                    })
                  }
                  type={"number"}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] outline-hidden"
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <div className="flex w-full flex-col gap-2">
                <label className="text-md text-foreground text-start italic">
                  Rendimento mensal da Poupança (%)
                </label>
                <input
                  value={info.rendimentoPoupanca}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      rendimentoPoupanca: Number(e.target.value),
                    })
                  }
                  type={"number"}
                  className="rounded-md border border-[#15599a] p-2 text-center text-lg text-[#15599a] outline-hidden"
                />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center">
              {msg.text ? (
                <p className={`text-center text-base italic ${msg.color}`}>{msg.text}</p>
              ) : (
                <button
                  onClick={simulate}
                  className="flex items-center rounded-full border border-[#fead61] p-6 text-[#fead61] duration-300 ease-in-out hover:scale-110 hover:bg-[#fead61] hover:text-white"
                >
                  <FaPlay />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}

export default SimulacaoFaturaEPayback;
