import React, { useState } from "react";

import DateFloatingInput from "../components/DateFloatingInput";
import SelectInput from "../components/inputs/Select";
import { useClients } from "../utils/methods/query/clients";
import xml2js from "xml2js";
function Teste() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState();
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
          console.log(result);
          const NFeItems = result.nfeProc.NFe.infNFe.det;
          const formattedITems = NFeItems.map((x) => {
            const itemInfo = x.prod;
            const nome = itemInfo.xProd;
            const qtde = itemInfo.qCom;
            const grandeza = itemInfo.uCom;
            const valor = itemInfo.vUnCom;
            return {
              nome: nome,
              qtde: qtde,
              grandeza: grandeza,
              preco: valor,
            };
          });
          setItems(formattedITems);
          // var json = JSON.stringify(result, null, 4);
          // var newArr = JSON.parse(json);
          // newArr = newArr.Relatorio_gd.Linha.filter(
          //   (item) => item.Periodo == dayjs(month).format("YYYY/MM")
          // );
          // var mappedArr = newArr.map((item) => {
          //   return {
          //     periodo: item.Periodo,
          //     instalacao: item.Instalacao,
          //     modalidade: item.Modalidade,
          //     quota: item.Quota,
          //     geracao: item.Qtd_geracao,
          //     transferido: item.Qtd_transferencia,
          //     consumo: item.Qtd_consumo,
          //     recebimento: item.Qtd_recebimento,
          //     compensacao: item.Qtd_compensacao,
          //     saldoAtual: item.Qtd_saldo_atual,
          //   };
          // });
          // setInstalacoes({
          //   ...instalacoes,
          //   [`${
          //     nomeInstalacao
          //       ? `${nomeInstalacao} (${dayjs(month).format("MM/YYYY")})`
          //       : `Instalação ${Object.keys(instalacoes).length + 1} (${dayjs(
          //           month
          //         ).format("MM/YYYY")})`
          //   }`]: mappedArr,
          // });
          // return mappedArr;
        }
      );
    };
  }
  console.log(items);
  return (
    <div className="w-[21cm] h-[29.7cm]  p-4 px-12">
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
          accept=".xml"
        />
      </div>
      <button onClick={() => readXML(file)}>LER XML</button>
      {items
        ? items.map((x) => (
            <div className="w-full flex items-center gap-2">
              <p>{x.nome}</p>
              <p>{x.qtde}</p>
              <p>
                R${" "}
                {Number(x.preco).toLocaleString("pt-br", {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p>{x.grandeza}</p>
            </div>
          ))
        : null}
    </div>
  );
}

export default Teste;
