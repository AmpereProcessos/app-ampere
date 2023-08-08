import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { MdOutlineAddCircle } from "react-icons/md";
import Select from "react-select";
import { cities, validateAuthorization } from "../utils/constants";
import axios from "axios";
import { useClients } from "../utils/methods/query/clients";
import { useSession } from "next-auth/react";
import { useMaterials } from "../utils/methods/query/materials";
import TextInput from "./TextInput";
import TextFloatingInput from "./TextFloatingInput";
import NumberFloatingInput from "./NumberFloatingInput";
import AddMaterialFormulario from "./identificador/almoxarifado/AddMaterialFormulario";
import { debitMaterials } from "../utils/methods/mutation/materials";
import createHttpError from "http-errors";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";
import LoadingPage from "./utils/LoadingPage";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  minWidth: "85%",
  height: "87%",
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
function NovoFormulario({ setModalIsOpen, getForms }) {
  const { data: session } = useSession();
  const [mutationStatus, setMutationStatus] = useState();
  // Getting data from database to enable integration with clients and materials
  const { data: clients, isFetching: clientsFetching } = useClients(
    !!session.user
  );
  const { data: materials, isFetching: materialsFetching } = useMaterials(
    !!session.user
  );
  const { mutate, isLoading } = useMutation({
    mutationKey: ["createWarehouseForm"],
    mutationFn: handleFormCreation,
  });
  const [callInfo, setCallInfo] = useState({
    idPai: null,
    codigoProjeto: null,
    nomeDoContrato: "",
    uso: "CLIENTE",
    cidade: null,
    segmento: null,
    topologia: null,
    equipeResp: null,
    responsavel: "A DEFINIR",
    servico: "NÃO DEFINIDO",
    materiais: [],
  });

  const [materialMsg, setMaterialMsg] = useState("");

  function addMaterial(material) {
    if (material.qtdeSaida > 0) {
      let arr = callInfo.materiais;
      let index = arr.findIndex((obj) => !!obj.id && obj.id == material.id);
      if (index != -1) {
        arr[index].qtdeSaida += material.qtdeSaida;
      } else {
        arr.push(material);
      }
      setCallInfo({ ...callInfo, materiais: arr });
      setMaterialMsg("");
    } else {
      setMaterialMsg("Quantidade inválida");
    }
  }
  function validateFields() {
    if (
      callInfo.nomeDoContrato?.trim().length < 3 &&
      !callInfo.nomeTerceiro &&
      callInfo.nomeTerceiro?.trim().length < 3
    ) {
      toast.error("Nome do contrato/terceiro inválido");
      return false;
    }
    if (callInfo.responsavel == "A DEFINIR") {
      toast.error("Por favor, defina um responsável.");
      return false;
    }
    if (callInfo.servico == "NÃO DEFINIDO") {
      toast.error("Por favor, define o tipo de serviço.");
      return false;
    }
    if (callInfo.materiais.length == 0) {
      toast.error("Por favor, adicione ao menos um material à lista.");
      return false;
    }
    return true;
  }
  async function updateReferenceProjectSeparationStatus(projectId) {
    const toastID = toast.loading(
      "Atualizando status de separação do projeto..."
    );
    try {
      await axios.post(`/api/projects/update/${projectId}`, {
        "material.statusSeparacao": "SEPARADO",
      });
      toast.dismiss(toastID);
    } catch (error) {
      toast.dismiss(toastID);
      throw new createHttpError.InternalServerError(
        "Erro ao atualizar projeto de referência."
      );
    }
  }
  async function createForm(info) {
    const toastID = toast.loading("Criando formulário...");
    try {
      const { data: createFormResponse } = await axios.post(
        "/api/almoxarifado/formularios",
        {
          ...info,
          tipo: "RETIRADA",
          abertura: new Date().toISOString(),
        }
      );
      toast.dismiss(toastID);
      return createFormResponse.insertedId;
    } catch (error) {
      toast.dismiss(toastID);
      throw new createHttpError.InternalServerError(
        "Erro ao criar formulário."
      );
    }
  }
  async function handleFormCreation() {
    if (!validateFields()) return;
    try {
      // Updating project with SEPARADO for statusSeparacao
      if (callInfo.idPai) {
        await updateReferenceProjectSeparationStatus(callInfo.idPai);
        // setMessage({
        //   status: "loading",
        //   text: "Atualizando status de separação do materiais...",
        //   color: "text-[#15599a]",
        // });
        // await axios.post(`/api/projects/update/${callInfo.idPai}`, {
        //   "material.statusSeparacao": "SEPARADO",
        // });
      }
      // Creating a form in database
      // setMessage({
      //   status: "loading",
      //   text: "Criando formulário...",
      //   color: "text-[#15599a]",
      // });
      // const { data: createFormResponse } = await axios.post(
      //   "/api/almoxarifado/formularios",
      //   {
      //     ...callInfo,
      //     tipo: "RETIRADA",
      //     abertura: new Date().toISOString(),
      //   }
      // );
      const insertedId = await createForm(callInfo);

      const debitMaterialsToastID = toast.loading(
        "Debitando materiais do estoque..."
      );
      await debitMaterials({
        formId: insertedId,
        identifier: callInfo.nomeDoContrato
          ? callInfo.nomeDoContrato
          : callInfo.nomeTerceiro,
        changes: callInfo.materiais,
        tag: "RETIRADA",
      });
      toast.dismiss(debitMaterialsToastID);

      // Resetting state of callInfo for next form
      setCallInfo({
        idPai: null,
        codigoProjeto: null,
        nomeDoContrato: "",
        cidade: null,
        segmento: null,
        topologia: null,
        equipeResp: null,
        responsavel: "A DEFINIR",
        servico: "NÃO DEFINIDO",
        materiais: [],
      });
      toast.success("Formulário criado com sucesso !");
      getForms();
    } catch (error) {
      if (createHttpError.isHttpError(error) && error.expose)
        toast.error(error.message);
      else toast.error("Erro no processo de criação do formulário.");
    }
  }
  console.log("FORM INFO", callInfo);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6 uppercase font-bold">
                ABERTURA DE REQUISIÇÃO
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
            <div className="flex flex-col grow overflow-y-auto">
              <div className="w-full flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <input
                    id="usoCliente"
                    name="usoCliente"
                    type={"checkbox"}
                    checked={callInfo.uso == "CLIENTE"}
                    onChange={(e) =>
                      setCallInfo((prev) => ({
                        ...prev,
                        uso: e.target.checked ? "CLIENTE" : "TERCEIRO",
                      }))
                    }
                  />
                  <label className="text-lg" htmlFor="usoCliente">
                    CLIENTE
                  </label>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    id="usoTerceiro"
                    name="usoTerceiro"
                    type={"checkbox"}
                    checked={callInfo.uso == "TERCEIRO"}
                    onChange={(e) =>
                      setCallInfo((prev) => ({
                        ...prev,
                        uso: e.target.checked ? "TERCEIRO" : "CLIENTE",
                        idPai: null,
                        codigoProjeto: null,
                        nomeDoContrato: "",
                      }))
                    }
                  />
                  <label className="text-lg" htmlFor="usoTerceiro">
                    TERCEIRO
                  </label>
                </div>
              </div>
              {callInfo.uso == "CLIENTE" ? (
                <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-2">
                  <span className="text-center uppercase font-bold">
                    CLIENTE
                  </span>
                  <div className={"grow"}>
                    <Select
                      isMulti={false}
                      placeholder="NOME DO CLIENTE"
                      onChange={(e) =>
                        setCallInfo({
                          ...callInfo,
                          nomeDoContrato: e.value.nome,
                          idPai: e.value.id,
                          codigoProjeto: e.value.qtde,
                          cidade: e.value.cidade,
                          segmento: e.value.segmento,
                          topologia: e.value.topologia,
                          equipeResp: e.value.equipeResp,
                        })
                      }
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
                      isLoading={clientsFetching}
                      options={clients?.map((cliente) => {
                        return {
                          label: `${cliente.qtde}-${cliente.nomeDoContrato}`,
                          value: {
                            id: cliente._id,
                            qtde: cliente.qtde,
                            nome: cliente.nomeDoContrato,
                            cidade: cliente.cidade ? cliente.cidade : "-",
                            segmento: cliente.segmento ? cliente.segmento : "-",
                            topologia: cliente.sistema.topologia
                              ? cliente.sistema.topologia
                              : "-",
                            equipeResp: cliente.obra.equipeResp
                              ? cliente.obra.equipeResp
                              : "-",
                          },
                        };
                      })}
                    />
                  </div>
                </div>
              ) : null}
              {callInfo.uso == "TERCEIRO" ? (
                <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-2">
                  <span className="text-center uppercase font-bold">
                    TERCEIRO
                  </span>
                  <input
                    value={callInfo.nomeTerceiro}
                    onChange={(e) =>
                      setCallInfo((prev) => ({
                        ...prev,
                        nomeTerceiro: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="Digite aqui o nome do terceiro..."
                    className="outline-none grow p-1 h-[41px] border border-gray-200 rounded-md text-center"
                  />
                </div>
              ) : null}
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  RESPONSÁVEL
                </span>
                <select
                  value={callInfo.responsavel}
                  onChange={(e) =>
                    setCallInfo({ ...callInfo, responsavel: e.target.value })
                  }
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0"
                >
                  <option value={"A DEFINIR"}>A DEFINIR</option>
                  <option value={"DANNIEL RODRIGUES"}>DANNIEL RODRIGUES</option>
                  <option value={"ALEX SANDRO"}>ALEX SANDRO</option>
                  <option value={"MATHEUS OLIVEIRA"}>MATHEUS OLIVEIRA</option>
                  <option value={"DIOGO PAULINO"}>DIOGO PAULINO</option>
                </select>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">SERVIÇO</span>
                <select
                  value={callInfo.servico}
                  onChange={(e) =>
                    setCallInfo({ ...callInfo, servico: e.target.value })
                  }
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0"
                >
                  <option value={"PADRÃO"}>PADRÃO</option>
                  <option value={"ESTRUTURA"}>ESTRUTURA</option>
                  <option value={"MONTAGEM"}>MONTAGEM</option>
                  <option value={"MANUTENÇÃO CORRETIVA"}>
                    MANUTENÇÃO CORRETIVA
                  </option>
                  <option value={"MANUTENÇÃO PREVENTIVA"}>
                    MANUTENÇÃO PREVENTIVA
                  </option>
                  <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                </select>
              </div>
              <div className="w-full flex flex-col border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  ADICIONAR MATERIAIS
                </span>
                <AddMaterialFormulario
                  materials={materials}
                  materialsFetching={materialsFetching}
                  addMaterial={addMaterial}
                />
                {/* <p className="w-full text-center italic text-sm py-2 text-[#15599a]">
                  ITENS DO ESTOQUE
                </p>
                <div className="flex items-center w-full gap-2">
                  <div className="w-[60%]">
                    <Select
                      isMulti={false}
                      placeholder="MATERIAL"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
                      onChange={(e) =>
                        setMaterialHolder({
                          ...materialHolder,
                          nome: e.value.nome,
                          id: e.value.id,
                          precoUnit: e.value.preco,
                        })
                      }
                      isLoading={materialsFetching}
                      
                      options={materials?.map((material) => {
                        return {
                          label: material.nome,
                          value: {
                            id: material._id,
                            nome: material.nome,
                            preco: material.preco,
                          },
                        };
                      })}
                    />
                  </div>
                  <input
                    placeholder="QTDE"
                    type="number"
                    value={materialHolder.qtdeSaida}
                    className="col-span-1 outline-none text-center border border-gray-200 w-[20%]"
                    onChange={(e) =>
                      setMaterialHolder({
                        ...materialHolder,
                        qtdeSaida: Number(e.target.value),
                        qtdeDevolucao: 0,
                      })
                    }
                  />
                  <div
                    onClick={addMaterial}
                    className="cursor-pointer w-[20%] flex justify-center items-center bg-green-300 hover:bg-green-500 text-white rounded font-bold col-span-1"
                  >
                    <MdOutlineAddCircle style={{ fontSize: "25px" }} />
                  </div>
                </div>
                <p className="w-full text-center italic text-sm py-2 text-[#15599a]">
                  ITENS NÃO ESTOCÁVEIS
                </p>
                <div className="flex items-center w-full gap-2">
                  <div className="w-[60%]">
                    <TextFloatingInput
                      label={"NOME OU DESCRIÇÃO"}
                      editable={true}
                      value={materialHolder.nome}
                      handleChange={(value) =>
                        setMaterialHolder((prev) => ({ ...prev, nome: value }))
                      }
                      width={"100%"}
                    />
                  </div>
                  <div className="w-[10%]">
                    <NumberFloatingInput
                      label={"PREÇO UNITÁRIO"}
                      value={materialHolder.precoUnit}
                      handleChange={(value) =>
                        setMaterialHolder((prev) => ({
                          ...prev,
                          precoUnit: Number(value),
                        }))
                      }
                      width={"100%"}
                    />
                  </div>
                  <div className="w-[10%]">
                    <NumberFloatingInput
                      label={"QUANTIDADE"}
                      value={materialHolder.qtdeSaida}
                      handleChange={(value) =>
                        setMaterialHolder((prev) => ({
                          ...prev,
                          qtdeSaida: Number(value),
                        }))
                      }
                      width={"100%"}
                    />
                  </div>
                  <button
                    onClick={addMaterial}
                    className="cursor-pointer w-[20%] flex justify-center items-center bg-green-300 hover:bg-green-500 text-white rounded font-bold col-span-1"
                  >
                    <MdOutlineAddCircle style={{ fontSize: "25px" }} />
                  </button>
                </div> */}
              </div>
              {materialMsg && (
                <p className="text-sm italic text-red-500 text-center">
                  {materialMsg}
                </p>
              )}
              <div className="flex grow flex-col gap-y-2 border border-gray-200 p-2 mt-4">
                <h1 className="font-bold text-center">SAÍDA</h1>
                <div className="flex flex-col overflow-y-auto overscroll-y-auto">
                  {callInfo.materiais.map((obj, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-2"
                    >
                      <p className="list-none text-center text-gray-600 font-bold">
                        {obj.nome} - ({obj.qtdeSaida})
                      </p>
                      <button
                        onClick={() => {
                          let arr = callInfo.materiais;
                          arr.splice(index, 1);
                          setCallInfo({ ...callInfo, materiais: arr });
                        }}
                      >
                        <VscChromeClose
                          style={{ color: "red", fontSize: "15px" }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center w-full max-h-[40px] h-[40px]">
                {!isLoading ? (
                  <button
                    onClick={mutate}
                    className="w-fit rounded p-2 bg-blue-300 hover:bg-blue-700 text-white font-bold"
                  >
                    ABRIR FORMULÁRIO
                  </button>
                ) : (
                  <div
                    className={`flex items-center justify-center h-[40px] w-full`}
                  >
                    <LoadingPage />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NovoFormulario;
