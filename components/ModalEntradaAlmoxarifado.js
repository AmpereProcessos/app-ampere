import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { useMaterials } from "../utils/methods/query/materials";
import xml2js from "xml2js";
import Select from "./inputs/Select";
import CardEntradaAlmoxarifado from "./CardEntradaAlmoxarifado";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "10px",
  zIndex: 1000,
};
const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 1000,
};
function ModalEntradaAlmoxarifado({ closeModal }) {
  const { data: materials } = useMaterials(true);
  const [xmlFile, setXMLFile] = useState();
  const [items, setItems] = useState([]);
  const [infoHolder, setInfoHolder] = useState({
    id: null,
    nome: "",
    precoAdd: 0,
    precoEstoque: 0,
    qtdeAdd: 0,
    qtdeEstoque: null,
  });
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
              qtde: Number(qtde),
              grandeza: grandeza,
              preco: Number(valor),
            };
          });
          console.log(formattedITems);
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
  console.log(infoHolder);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div
          className="w-[90%] lg:w-[60%] h-[80%] lg:h-[70%]"
          style={MODAL_STYLES}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200 min-h-[30px]">
              <h1 className="text-[#15599a] pl-6 uppercase font-bold">
                ENTRADA DE ITEM
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => {
                    closeModal(false);
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col grow gap-2 py-2 px-2 overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="flex w-full flex-col gap-2">
                <h1 className="text-center w-full font-bold">
                  ANEXE O ARQUIVO .XML DA NOTA
                </h1>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center">
                  <div className="absolute">
                    {xmlFile ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {xmlFile?.name}
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
                    onChange={(e) => setXMLFile(e.target.files[0])}
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".xml"
                  />
                </div>
                <button
                  onClick={() => readXML(xmlFile)}
                  className="w-full text-center p-2 bg-blue-400 hover:bg-blue-600 text-white"
                >
                  LER XML
                </button>
              </div>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <CardEntradaAlmoxarifado
                    key={index}
                    materials={materials}
                    item={item}
                    items={items}
                    setItems={setItems}
                    index={index}
                  />
                ))
              ) : (
                <p className="text-center italic text-sm text-gray-500">
                  Sem itens vinculados...
                </p>
              )}
              {/* <div className="w-full flex flex-col items-center gap-1">
                <h1 className="text-center font-bold">NOME</h1>
                <input
                  value={infoHolder.nome}
                  onChange={(e) =>
                    setInfoHolder((prev) => ({ ...prev, nome: e.target.value }))
                  }
                  className="w-full p-2 outline-none text-center text-sm text-gray-700 border border-gray-300 rounded"
                />
              </div>
              <div className="w-full flex flex-col items-center gap-1">
                <h1 className="text-center font-bold">PREÇO DO MATERIAL</h1>
                <input
                  value={infoHolder.nome}
                  onChange={(e) =>
                    setInfoHolder((prev) => ({ ...prev, nome: e.target.value }))
                  }
                  className="w-full p-2 outline-none text-center text-sm text-gray-700 border border-gray-300 rounded"
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalEntradaAlmoxarifado;
