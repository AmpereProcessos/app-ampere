import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { FaLongArrowAltRight, FaSave } from "react-icons/fa";
import Select from "react-select";
import { cities, units } from "../utils/constants";
import axios from "axios";
import SaveButton from "./utils/Buttons/SaveButton";
import TextFloatingInput from "./TextFloatingInput";
import NumberFloatingInput from "./NumberFloatingInput";
import dayjs from "dayjs";
import SelectFoatingInput from "./SelectFloatingInput";
import { utils } from "xlsx";
import { useMaterialLogs } from "../utils/methods/query/materials";
import MaterialLogs from "./identificador/materials/MaterialLogs";
import { useQueryClient } from "react-query";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  minWidth: "70%",
  height: "80%",
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
function ControleAlmoxarifado({
  closeModal,
  info,
  credentials,
  handleUpdates,
}) {
  const queryClient = useQueryClient();
  const [materialInfo, setMaterialInfo] = useState(info);
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });

  function validateChanges() {
    if (materialInfo.qtde < 0) {
      setMsg({
        text: "Por favor, preencha uma quantidade válida.",
        color: "text-red-500",
      });
      return false;
    }
    if (materialInfo.preco < 0) {
      setMsg({
        text: "Por favor, preencha um preço válido.",
        color: "text-red-500",
      });
      return false;
    }
    setMsg({ text: "", color: "" });
    return true;
  }
  async function handleAlteracoes() {
    if (validateChanges()) {
      let response = await axios.put("/api/almoxarifado/materiais", {
        id: info._id,
        changes: {
          ...materialInfo,
        },
      });
      if (response.status == 201)
        setMsg({ text: response.data, color: "text-green-500" });
      await queryClient.invalidateQueries({
        queryKey: ["materialLog", materialInfo._id],
      });
      handleUpdates(info._id);
    }
  }

  useEffect(() => {
    setMaterialInfo(info);
  }, [info]);
  return (
    <div style={OVERLAY_STYLES}>
      <div style={MODAL_STYLES}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between min-h-[30px]">
            <h1 className="text-[#15599a] font-bold">{info.nome}</h1>
            <p className="text-xs text-gray-500">#{info._id}</p>
            <div className="">
              <button className="hover:bg-red-200 rounded-lg p-1">
                <VscChromeClose
                  onClick={() => closeModal()}
                  style={{ color: "red" }}
                />
              </button>
            </div>
          </div>
          <div className="grow py-2 overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="w-full h-full px-4">
              <div className="flex flex-col w-full">
                <h1 className="font-raleway text-center w-full font-medium text-[#15599a]">
                  INFORMAÇÕES DO ITEM
                </h1>
                <div className="flex mt-4 flex-col w-full gap-4">
                  <TextFloatingInput
                    label="NOME DO ITEM"
                    value={materialInfo.nome}
                    handleChange={(value) =>
                      setMaterialInfo((prev) => ({ ...prev, nome: value }))
                    }
                    editable={true}
                    width={"100%"}
                  />
                  <TextFloatingInput
                    label="CÓDIGO NEREUS"
                    value={materialInfo.codigo}
                    handleChange={(value) =>
                      setMaterialInfo((prev) => ({ ...prev, codigo: value }))
                    }
                    editable={true}
                    width={"100%"}
                  />
                  <NumberFloatingInput
                    label={"QUANTIDADE"}
                    value={materialInfo.qtde}
                    editable={true}
                    handleChange={(value) =>
                      setMaterialInfo((prev) => ({
                        ...prev,
                        qtde: Number(value),
                      }))
                    }
                    width={"100%"}
                  />
                  <NumberFloatingInput
                    label={"QUANTIDADE MÍNIMA"}
                    value={materialInfo.qtdeMinima}
                    editable={true}
                    handleChange={(value) =>
                      setMaterialInfo((prev) => ({
                        ...prev,
                        qtdeMinima: Number(value),
                      }))
                    }
                    width={"100%"}
                  />
                  <SelectFoatingInput
                    label={"GRANDEZA"}
                    editable={true}
                    value={
                      materialInfo.grandeza
                        ? materialInfo.grandeza
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      ...units,
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) =>
                      setMaterialInfo((prev) => ({ ...prev, grandeza: value }))
                    }
                    width={"100%"}
                  />
                  <NumberFloatingInput
                    label={"PREÇO"}
                    value={materialInfo.preco}
                    editable={true}
                    handleChange={(value) =>
                      setMaterialInfo((prev) => ({
                        ...prev,
                        preco: Number(value),
                      }))
                    }
                    width={"100%"}
                  />
                  <TextFloatingInput
                    label={"LOCALIZAÇÃO"}
                    value={materialInfo.localizacao}
                    editable={true}
                    handleChange={(value) =>
                      setMaterialInfo((prev) => ({
                        ...prev,
                        localizacao: value,
                      }))
                    }
                    width={"100%"}
                  />
                  <div className="flex flex-col w-full gap-1">
                    <h1 className="text-gray-500 font-medium text-xs w-full text-center">
                      ANOTAÇÕES
                    </h1>
                    <textarea
                      value={materialInfo.anotacoes}
                      onChange={(e) =>
                        setMaterialInfo((prev) => ({
                          ...prev,
                          anotacoes: e.target.value,
                        }))
                      }
                      placeholder="Deixe aqui anotações sobre o item em questão..."
                      className="w-full h-[80px] p-1 text-sm text-center resize-none outline-blue-200 bg-gray-100 border border-gray-200"
                    />
                  </div>
                </div>
              </div>
              <div className="my-2 flex flex-col items-center w-full gap-1">
                <p
                  className={`w-full italic text-center ${msg.color} text-center`}
                >
                  {msg.text}
                </p>
                <div>
                  <SaveButton
                    text={"SALVAR"}
                    icon={<FaSave />}
                    handleClick={handleAlteracoes}
                  />
                </div>
              </div>
              <MaterialLogs materialId={materialInfo._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControleAlmoxarifado;
