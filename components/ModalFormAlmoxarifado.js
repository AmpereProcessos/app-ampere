import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { MdOutlineAddCircle } from "react-icons/md";
import Select from "react-select";
import { cities } from "../utils/constants";
import axios from "axios";
import MaterialItem from "./MaterialItem";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  minWidth: "85%",
  height: "90%",
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
function FormularioAlmoxarifado({ setModalIsOpen, info }) {
  const [dados, setDados] = useState(info);
  const [materiais, setMateriais] = useState([]);
  const [saidaMaterialHolder, setSaidaMaterialHolder] = useState({
    nome: null,
    id: null,
    qtdeSaida: null,
  });
  const [saidaMaterialMsg, setSaidaMaterialMsg] = useState("");
  const [responseMessage, setResponseMessage] = useState({
    text: "",
    color: "",
  });
  function getMaterials() {
    axios.get("/api/almoxarifado/materiais").then((res) => {
      setMateriais(res.data);
    });
  }
  console.log(dados);
  function addMaterialSaida() {
    if (
      saidaMaterialHolder.qtdeSaida > 0 &&
      saidaMaterialHolder.nome.trim().length > 0
    ) {
      let arr = dados.materiais;
      let index = arr.findIndex((obj) => obj.id == saidaMaterialHolder.id);
      if (index != -1) {
        arr[index].qtdeSaida += saidaMaterialHolder.qtdeSaida;
      } else {
        arr.push(saidaMaterialHolder);
      }
      setDados({ ...dados, materiais: arr });
      setSaidaMaterialHolder({ ...saidaMaterialHolder, qtdeSaida: null });
      setSaidaMaterialMsg("");
    } else {
      setSaidaMaterialMsg("Informações inválidas");
    }
  }
  async function validateForm() {
    await axios.put("/api/almoxarifado/formularios", {
      id: dados._id,
      data: dados.materiais,
    });
    axios
      .post("/api/almoxarifado/materiais", dados.materiais)
      .then((res) =>
        setResponseMessage({
          text: "Baixa de produtos realizado!",
          color: "text-green-500",
        })
      )
      .catch((err) =>
        setResponseMessage({
          text: "Um erro ocorreu, por favor tente novamente.",
          color: "text-red-500",
        })
      );
    setDados({ ...dados, efetivado: true });
  }
  useEffect(() => {
    getMaterials();
  }, []);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6 uppercase font-bold">
                ABERTURA DE CHAMADO
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => {
                    setModalIsOpen(false);
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col grow overflow-y-auto scrollbar-thin scrollbar-thumb-[#15599a80] scrollbar-track-gray-100">
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">CLIENTE</span>
                <div className={"grow"}>
                  <p className="text-gray-600 text-center">
                    {dados.nomeDoContrato}
                  </p>
                </div>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">CIDADE</span>
                <div className={"grow"}>
                  <p className="text-gray-600 text-center">{dados.cidade}</p>
                </div>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  SEGMENTO
                </span>
                <div className={"grow"}>
                  <p className="text-gray-600 text-center">{dados.segmento}</p>
                </div>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  TOPOLOGIA
                </span>
                <div className={"grow"}>
                  <p className="text-gray-600 text-center">{dados.topologia}</p>
                </div>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  EQUIPE RESP
                </span>
                <div className={"grow"}>
                  <p className="text-gray-600 text-center">
                    {dados.equipeResp}
                  </p>
                </div>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  RESPONSÁVEL
                </span>
                <div className={"grow"}>
                  <p className="text-gray-600 text-center">
                    {dados.responsavel}
                  </p>
                </div>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">SERVIÇO</span>
                <div className={"grow"}>
                  <p className="text-gray-600 text-center">{dados.servico}</p>
                </div>
              </div>
              {dados.efetivado != true && (
                <>
                  {" "}
                  <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                    <span className="text-center uppercase font-bold">
                      ADICIONAR
                    </span>
                    <div className="grid grid-cols-6 gap-x-2">
                      <div className="grow col-span-4">
                        <Select
                          isMulti={false}
                          placeholder="MATERIAL"
                          onChange={(e) =>
                            setSaidaMaterialHolder({
                              ...saidaMaterialHolder,
                              nome: e.value.nome,
                              id: e.value.id,
                            })
                          }
                          options={materiais.map((material) => {
                            return {
                              label: material.nome,
                              value: {
                                id: material._id,
                                nome: material.nome,
                              },
                            };
                          })}
                        />
                      </div>
                      <input
                        placeholder="QTDE"
                        type="number"
                        value={saidaMaterialHolder.qtdeSaida}
                        className="col-span-1 outline-none text-center border border-gray-200"
                        onChange={(e) =>
                          setSaidaMaterialHolder({
                            ...saidaMaterialHolder,
                            qtdeSaida: Number(e.target.value),
                          })
                        }
                      />
                      <div
                        onClick={addMaterialSaida}
                        className="cursor-pointer flex justify-center items-center bg-green-300 hover:bg-green-500 text-white rounded font-bold col-span-1"
                      >
                        <MdOutlineAddCircle style={{ fontSize: "25px" }} />
                      </div>
                    </div>
                  </div>
                  {saidaMaterialMsg && (
                    <p className="text-sm italic text-red-500 text-center">
                      {saidaMaterialMsg}
                    </p>
                  )}
                </>
              )}

              <div className="flex h-[350px] flex-col gap-y-2 border border-gray-200 p-2 mt-4">
                <h1 className="font-bold text-center">MATERIAIS</h1>
                <div className="grid grid-cols-9">
                  <p className="text-[#15599a] font-bold col-span-4 text-center">
                    NOME
                  </p>
                  <p className="text-[#15599a] font-bold col-span-2 text-center">
                    SAÍDA
                  </p>
                  <p className="text-[#15599a] font-bold col-span-2 text-center ">
                    DEVOLUÇÃO
                  </p>
                  <p className="text-[#15599a] font-bold col-span-1 text-center">
                    EXCLUIR
                  </p>
                </div>
                <div className="flex flex-col gap-2 grow overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {dados.materiais.map((obj, index) => (
                    <MaterialItem
                      key={index}
                      obj={obj}
                      index={index}
                      dados={dados}
                      setDados={setDados}
                    />
                  ))}
                </div>
              </div>
              {dados.efetivado != true && (
                <div className="flex justify-center mt-2">
                  <button
                    onClick={validateForm}
                    className="bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold p-2 rounded"
                  >
                    DAR BAIXA
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormularioAlmoxarifado;
