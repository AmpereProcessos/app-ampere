import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useKey } from "../utils/hooks";
import {
  cidadesAtendidas,
  vendedores,
  projetistas,
  statusLiberacao,
  credores,
  localEntregaOptions,
  fornecedores,
  tiposDeServico,
  tiposDeEstruturas,
  equipesTecnicas,
  oemPlans,
} from "../utils/constants";
import { FaSave } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import axios from "axios";
import dayjs from "dayjs";
import NotificationCreationBlock from "./NotificationCreationBlock";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import InfoSistemaBlock from "./blocosInfoProjeto/InfoSistemaBlock";
import InfoPadraoBlock from "./blocosInfoProjeto/InfoPadraoBlock";
import InfoEstruturaBlock from "./blocosInfoProjeto/InfoEstruturaBlock";
import InfoCompraBlock from "./blocosInfoProjeto/InfoCompraBlock";
import InfoVisitaTecnicaBlock from "./blocosInfoProjeto/InfoVisitaTecnicaBlock";
import InfoContratoBlock from "./blocosInfoProjeto/InfoContratoBlock";
import InfoClienteBlock from "./blocosInfoProjeto/InfoClienteBlock";
import InfoDadosConcessionariaBlock from "./blocosInfoProjeto/InfoDadosConcessionariaBlock";
import InfoPagamentoBlock from "./blocosInfoProjeto/InfoPagamentoBlock";
import InfoArquivosBlock from "./blocosInfoProjeto/InfoArquivosBlock";
import InfoProjetoBlock from "./blocosInfoProjeto/InfoProjetoBlock";
import InfoObrasBlock from "./blocosInfoProjeto/InfoObrasBlock";
import InfoMaterialBlock from "./blocosInfoProjeto/InfoMaterialBlock";
import SaveButton from "./utils/Buttons/SaveButton";

function formatCnpjCpf(value) {
  const cnpjCpf = value.replace(/\D/g, "");

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5"
  );
}
function formataCEP(cep) {
  cep = cep
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");

  return cep;
}
function ModalComercial({
  open,
  setModalIsOpen,
  modalIsOpen,
  project,
  editor,
  handleUpdates,
  credentials,
}) {
  useKey("Escape", () => setModalIsOpen(false));

  const [infoHolder, setInfo] = useState(project);
  const [infoVisita, setInfoVisita] = useState({});
  const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  async function findCPF(field) {
    axios
      .get(`https://viacep.com.br/ws/${infoHolder.cep.replace("-", "")}/json/`)
      .then((res) => {
        if (res.data.erro) {
          return;
        } else {
          console.log(
            cidadesAtendidas.includes(res.data.localidade.toUpperCase())
          );
          setInfo({
            ...infoHolder,
            bairro: res.data.bairro,
            cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase())
              ? res.data.localidade.toUpperCase()
              : "NÃO DEFINIDO",
            logradouro: res.data.logradouro,
            uf: res.data.uf,
          });
          setChanges({
            ...changes,
            bairro: res.data.bairro,
            cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase())
              ? res.data.localidade.toUpperCase()
              : "NÃO DEFINIDO",
            logradouro: res.data.logradouro,
            uf: res.data.uf,
          });
        }
      });
  }
  async function handleChanges() {
    if (
      infoHolder.contrato.status != "ASSINADO" &&
      infoHolder.pagamento.status == "PAGO"
    ) {
      setMsg({ text: "Verifique as informações!", color: "text-red-400" });
    } else if (
      !infoHolder.comissionamento?.comercial &&
      (infoHolder.compra?.statusLiberacao == "REALIZAR COMPRA" ||
        infoHolder.compra?.statusLiberacao == "PAGO")
    ) {
      setMsg({
        text: "Preencha o relatório de comissionamento.",
        color: "text-red-400",
      });
    } else if (
      infoHolder.linkDrive?.trim().length < 5 &&
      (infoHolder.compra?.statusLiberacao == "REALIZAR COMPRA" ||
        infoHolder.compra?.statusLiberacao == "PAGO")
    ) {
      setMsg({
        text: "Preencha o link do cliente no drive",
        color: "text-red-400",
      });
    } else {
      axios.post(`/api/projects/update/${project._id}`, changes).then((res) => {
        setMsg({ text: "Alterações feitas !", color: "text-green-400" });
        handleUpdates(project._id);
      });
    }
  }
  function getVisitaInfo(id) {
    axios
      .post(`/api/solicitacoes/getVisitaTecnica/${id}`, {
        links: 1,
      })
      .then((res) => {
        console.log(res.data);
        if (!project.links?.visitaTecnica) {
          project.links = { ...project.links, visitaTecnica: res.data.links };
          setInfo({
            ...infoHolder,
            links: {
              ...infoHolder.links,
              visitaTecnica: res.data.links,
            },
          });
          return setChanges({
            ...changes,
            "links.visitaTecnica": res.data.links,
          });
        }
      });
  }
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between px-2 text-lg border-b border-gray-200 pb-2">
            <div className="flex gap-x-2">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {infoHolder.qtde} - {infoHolder.nomeDoContrato}
              </h1>
              {infoHolder.codigoSVB && (
                <p className="text-gray-600 text-sm font-bold">
                  #{infoHolder.codigoSVB}
                </p>
              )}
            </div>
            <div className="flex gap-x-2 items-center">
              {msg.text && (
                <p className={`text-sm italic ${msg.color}`}>{msg.text}</p>
              )}
              <SaveButton
                text={"Salvar alterações"}
                icon={<FaSave />}
                handleClick={handleChanges}
              />
              {/* <button
                onClick={handleChanges}
                className="flex items-center gap-x-2 bg-[#15599a] hover:bg-blue-500 p-1 text-white font-bold rounded text-sm"
              >
                <p>Salvar alterações</p>
                <FaSave />
              </button> */}
              <button>
                <VscChromeClose
                  onClick={() => setModalIsOpen(false)}
                  style={{ color: "red" }}
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y-auto">
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <NotificationCreationBlock
                nomeDoProjeto={project.nomeDoContrato}
                codProjeto={project.qtde}
              />
            </div>
            <InfoClienteBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              project={project}
            />
            <InfoVisitaTecnicaBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
            />
            {![
              "OPERAÇÃO E MANUTENÇÃO",
              "BOMBA SOLAR",
              "SISTEMA FOTOVOLTAICO (OFF GRID)",
            ].includes(infoHolder.tipoDeServico) && (
              <InfoPadraoBlock
                comercialEdition={true}
                technicalEdition={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
            )}
            {![
              "TROCA DE PADRÃO",
              "REFORMA DE PADRÃO",
              "SUBESTAÇÃO DE ENERGIA",
            ].includes(infoHolder.tipoDeServico) && (
              <InfoEstruturaBlock
                comercialEdition={true}
                technicalEdition={true}
                project={project}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
            )}
            <InfoContratoBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              minimalInfo={false}
              showPaymentInfo={true}
            />
            <InfoPagamentoBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
            />
            {infoHolder.tipoDeServico != "MONTAGEM E DESMONTAGEM" && (
              <InfoCompraBlock
                editor={true}
                project={project}
                comercialEditionOnly={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showDeliveryInfoOnly={false}
                showMonetaryValues={true}
              />
            )}
            {!["BOMBA SOLAR", "SISTEMA FOTOVOLTAICO (OFF GRID)"].includes(
              infoHolder.tipoDeServico
            ) && (
              <InfoDadosConcessionariaBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
              />
            )}
            {![
              "TROCA DE PADRÃO",
              "REFORMA DE PADRÃO",
              "SUBESTAÇÃO DE ENERGIA",
            ].includes(infoHolder.tipoDeServico) && (
              <InfoSistemaBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
            )}
            <InfoProjetoBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              handleUpdates={handleUpdates}
              project={project}
            />
            <InfoObrasBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              project={project}
            />
            <InfoMaterialBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
            />
            {/* <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                MATERIAL
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <SelectInput
                  label={"Separação do material"}
                  value={
                    infoHolder.material?.statusSeparacao
                      ? infoHolder.material?.statusSeparacao
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    {
                      label: "INICIAR SEPARAÇÃO",
                      value: "INICIAR SEPARAÇÃO",
                    },
                    {
                      label: "SEPARADO",
                      value: "SEPARADO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "material.statusSeparacao": value,
                    });
                    setInfo({
                      ...infoHolder,
                      material: {
                        ...infoHolder.material,
                        statusSeparacao: value,
                      },
                    });
                  }}
                />
                {credentials?.visualizacao == undefined && (
                  <>
                    {" "}
                    <NumberInput
                      tag={"R$"}
                      label={"Previsão de custos em insumos"}
                      editable={editor}
                      value={
                        infoHolder.material?.previsaoCustos != undefined &&
                        infoHolder.material?.previsaoCustos != "#VALUE!"
                          ? infoHolder.material?.previsaoCustos.toFixed(2)
                          : 0
                      }
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          "material.previsaoCustos": Number(value),
                        });
                        setInfo({
                          ...infoHolder,
                          material: {
                            ...infoHolder.material,
                            previsaoCustos: Number(value),
                          },
                        });
                      }}
                    />
                    <NumberInput
                      tag={"R$"}
                      label={"Custos em insumos"}
                      editable={editor}
                      value={
                        infoHolder.material?.efetivoCustos != undefined &&
                        infoHolder.material?.efetivoCustos != "#VALUE!"
                          ? infoHolder.material?.efetivoCustos
                          : 0
                      }
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          "material.efetivoCustos": Number(value),
                        });
                        setInfo({
                          ...infoHolder,
                          material: {
                            ...infoHolder.material,
                            efetivoCustos: Number(value),
                          },
                        });
                      }}
                    />
                  </>
                )}
              </div>
            </div> */}
            <InfoArquivosBlock
              project={project}
              infoHolder={infoHolder}
              categories={[
                { label: "DOCUMENTOS", value: "links.documentos" },
                { label: "CONTRATOS", value: "links.contratos" },
                {
                  label: "EQUIPAMENTOS",
                  value: "links.equipamentos",
                },
                { label: "PROJETOS", value: "links.projetos" },
                { label: "VISITA TÉCNICA", value: "links.visitaTecnica" },
              ]}
              handleUpdates={handleUpdates}
            />
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalComercial;
