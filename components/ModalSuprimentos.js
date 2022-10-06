import React, { useState } from "react";
import axios from "axios";
import { vendedores } from "../utils/constants";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "93%",
  height: "98%",
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
function formataCPF(cpf) {
  //retira os caracteres indesejados...
  cpf = cpf.replace(/[^\d]/g, "");
  //realizar a formatação...
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
function formataCEP(cep) {
  cep = cep
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");

  return cep;
}
function ModalSuprimentos({
  setModalIsOpen,
  project,
  editor,
  ppsEditor,
  handleUpdates,
}) {
  const [infoHolder, setInfo] = useState(project);
  const [msg, setMsg] = useState("");
  function handleChanges() {
    axios
      .post(`/api/projects/update/${project._id}`, infoHolder)
      .then((res) => {
        setMsg("Alterações feitas");
        handleUpdates(project._id);
      });
  }
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {infoHolder.qtde} - {infoHolder.nomedocontrato}
              </h1>
              {infoHolder.codprojetosvb && (
                <p className="text-gray-600 text-sm font-bold">
                  #{infoHolder.codprojetosvb}
                </p>
              )}
              <div className="flex gap-x-2">
                {msg && <p className="text-sm italic text-green-400">{msg}</p>}
                <button
                  onClick={handleChanges}
                  className="flex items-center gap-x-2 bg-[#15599a] hover:bg-blue-500 p-1 text-white font-bold rounded text-sm"
                >
                  <p>Salvar alterações</p>
                  <FaSave />
                </button>
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
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  Informações do cliente
                </span>
                <div className="flex gap-2 justify-around flex-wrap">
                  <TextInput
                    label={"Nome do contrato"}
                    value={infoHolder.nomedocontrato}
                    editable={ppsEditor}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, nomedocontrato: value })
                    }
                  />
                  <TextInput
                    label={"Nome do Projeto"}
                    value={infoHolder.nomedoprojeto}
                    editable={ppsEditor}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, nomedoprojeto: value })
                    }
                  />
                  <TextInput
                    label={"CPF/CNPJ"}
                    editable={ppsEditor}
                    value={
                      infoHolder.cpfcnpj
                        ? formataCPF(infoHolder.cpfcnpj.toString())
                        : "-"
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, cpfcnpj: value })
                    }
                  />
                  <TextInput
                    label={"Telefone"}
                    editable={ppsEditor}
                    value={infoHolder.telefone ? infoHolder.telefone : "-"}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, telefone: value })
                    }
                  />
                  <TextInput
                    label={"Cidade"}
                    editable={ppsEditor}
                    value={infoHolder.cidade ? infoHolder.cidade : "-"}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, cidade: value })
                    }
                  />
                  <TextInput
                    label={"CEP"}
                    editable={ppsEditor}
                    value={
                      infoHolder.cep
                        ? formataCEP(infoHolder.cep.toString())
                        : "-"
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, cep: value })
                    }
                  />
                  <TextInput
                    label={"Bairro"}
                    editable={ppsEditor}
                    value={infoHolder.bairro ? infoHolder.bairro : ""}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, bairro: value })
                    }
                  />
                  <NumberInput
                    label={"Número da residência"}
                    editable={ppsEditor}
                    value={infoHolder.numerores ? infoHolder.numerores : 0}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, numerores: value })
                    }
                  />
                  <SelectInput
                    label={"Regional"}
                    editable={ppsEditor}
                    value={infoHolder.regional}
                    options={[
                      {
                        label: "REGIONAL ITUIUTABA",
                        value: "REGIONAL ITUIUTABA",
                      },
                      {
                        label: "REGIONAL UBERLANDIA",
                        value: "REGIONAL UBERLANDIA",
                      },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, regional: value })
                    }
                  />
                  <TextInput
                    label={"EMAIL"}
                    editable={ppsEditor}
                    value={infoHolder.email ? infoHolder.email : ""}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, email: value })
                    }
                  />
                  <SelectInput
                    label={"Canal de venda"}
                    value={
                      infoHolder.canalvenda != undefined &&
                      infoHolder.canalvenda != "-"
                        ? infoHolder.canalvenda
                        : "NÃO DEFINIDO"
                    }
                    editable={ppsEditor}
                    options={[
                      { label: "EVENTO", value: "EVENTO" },
                      {
                        label: "INDICAÇÃO DE AMIGO",
                        value: "INDICAÇÃO DE AMIGO",
                      },
                      { label: "INSIDE SALES", value: "INSIDE SALES" },
                      { label: "PASSIVO", value: "PASSIVO" },
                      { label: "PORTA A PORTA", value: "PORTA A PORTA" },
                      { label: "TELEVENDAS", value: "TELEVENDAS" },
                      { label: "NETWORK", value: "NETWORK" },
                      { label: "OUTRO", value: "OUTRO" },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, canalvenda: value })
                    }
                  />
                  <div className="flex">
                    <SelectInput
                      label={"VENDEDOR"}
                      value={
                        infoHolder.vendedor != undefined &&
                        infoHolder.vendedor != "-"
                          ? infoHolder.vendedor
                          : "NÃO DEFINIDO"
                      }
                      options={vendedores.map((vendedor) => {
                        return { label: vendedor.nome, value: vendedor.nome };
                      })}
                      editable={ppsEditor}
                      handleChange={(value) =>
                        setInfo({ ...infoHolder, vendedor: value })
                      }
                    />
                    <div className="flex flex-col items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        CÓD.VENDEDOR
                      </span>
                      <p>
                        {vendedores.filter(
                          (vendedor) => vendedor.nome == infoHolder.vendedor
                        ).length > 0
                          ? vendedores.filter(
                              (vendedor) => vendedor.nome == infoHolder.vendedor
                            )[0].cod
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <SelectInput
                    label={"SEGMENTO"}
                    value={infoHolder.segmento}
                    editable={ppsEditor}
                    options={[
                      { label: "COMERCIAL", value: "COMERCIAL" },
                      { label: "INDUSTRIAL", value: "INDUSTRIAL" },
                      { label: "RESIDENCIAL", value: "RESIDENCIAL" },
                      { label: "RURAL", value: "RURAL" },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, segmento: value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  VISITA TÉCNICA
                </span>
                <div className="flex gap-2 justify-around flex-wrap">
                  <TextInput
                    label={"TÉCNICO RESPONSÁVEL"}
                    editable={ppsEditor}
                    value={
                      infoHolder.tecnicoresponsavel
                        ? infoHolder.tecnicoresponsavel
                        : ""
                    }
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        tecnicoresponsavel: value,
                      })
                    }
                  />

                  <TextInput
                    label={"Tipo da telha"}
                    editable={ppsEditor}
                    value={infoHolder.tipotelha ? infoHolder.tipotelha : ""}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, tipotelha: value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  SISTEMA
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <NumberInput
                    label={"NÚMERO DE MÓDULOS"}
                    editable={editor}
                    value={
                      infoHolder.nmodulos != undefined &&
                      infoHolder.nmodulos != "-"
                        ? infoHolder.nmodulos
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, nmodulos: value })
                    }
                  />
                  <NumberInput
                    unit={"W"}
                    label={"POTÊNCIA DOS MÓDULOS"}
                    editable={editor}
                    value={
                      infoHolder.potmodulos != undefined &&
                      infoHolder.potmodulos != "-"
                        ? infoHolder.potmodulos
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, potmodulos: value })
                    }
                  />
                  <NumberInput
                    unit={"kWp"}
                    label={"POTÊNCIA PICO"}
                    editable={editor}
                    value={
                      infoHolder.potpico != undefined &&
                      infoHolder.potpico != "-"
                        ? infoHolder.potpico
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, potpico: value })
                    }
                  />
                  <SelectInput
                    label={"TOPOLOGIA"}
                    value={
                      infoHolder.topologia
                        ? infoHolder.topologia
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      { label: "INVERSOR", value: "INVERSOR" },
                      { label: "MICRO", value: "MICRO" },
                      { label: "OUTROS SERV.", value: "OUTROS SERV." },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, topologia: value })
                    }
                  />
                  <TextInput
                    label={"QTDE E POTÊNCIA DO(S) INVERSOR(ES)"}
                    editable={editor}
                    value={
                      infoHolder.qtdepotinversor
                        ? infoHolder.qtdepotinversor
                        : ""
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, qtdepotinversor: value })
                    }
                  />
                  <NumberInput
                    tag={"R$"}
                    label={"VALOR DO PROJETO"}
                    editable={editor}
                    value={
                      infoHolder.valorprojeto != undefined &&
                      infoHolder.valorprojeto != "-"
                        ? infoHolder.valorprojeto
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, valorprojeto: value })
                    }
                  />
                  <SelectInput
                    label={"INICIAR PROJETO"}
                    value={
                      infoHolder.iniciarprojeto
                        ? infoHolder.iniciarprojeto
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      { label: "SIM", value: "SIM" },
                      {
                        label: "CONTRATO CANCELADO",
                        value: "CONTRATO CANCELADO",
                      },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, iniciarprojeto: value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  Informações da compra
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <DateInput
                    label={"Data de liberação p/ compra"}
                    editable={editor}
                    value={
                      infoHolder.dataliberacaoparacompra != undefined &&
                      infoHolder.dataliberacaoparacompra != "-"
                        ? new Date(infoHolder.dataliberacaoparacompra)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        dataliberacaoparacompra: new Date(value),
                      })
                    }
                  />
                  <DateInput
                    label={"Data do pagamento"}
                    editable={editor}
                    value={
                      infoHolder.datapagamento != undefined &&
                      infoHolder.datapagamento != "-"
                        ? new Date(infoHolder.datapagamento)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        datapagamento: new Date(value),
                      })
                    }
                  />
                  <SelectInput
                    label={"Fornecedor"}
                    editable={editor}
                    value={
                      infoHolder.fornecedor != undefined &&
                      infoHolder.fornecedor != "-"
                        ? infoHolder.fornecedor
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      {
                        label: "ALDO",
                        value: "ALDO",
                      },
                      {
                        label: "AMPÈRE",
                        value: "AMPÈRE",
                      },
                      {
                        label: "BEL ENERGY",
                        value: "BEL ENERGY",
                      },
                      {
                        label: "SKY SOLAR",
                        value: "SKY SOLAR",
                      },
                      {
                        label: "SOU ENERGY",
                        value: "SOU ENERGY",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, fornecedor: value })
                    }
                  />
                  <SelectInput
                    label={"TIPO DO KIT"}
                    value={
                      infoHolder.tipokit != undefined &&
                      infoHolder.tipokit != "-"
                        ? infoHolder.tipokit
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "NORMAL",
                        value: "NORMAL",
                      },
                      {
                        label: "PROMO",
                        value: "PROMO",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, tipokit: value })
                    }
                  />
                  <NumberInput
                    tag={"R$"}
                    label={"VALOR DO KIT"}
                    editable={editor}
                    value={
                      infoHolder.valordokit != undefined &&
                      infoHolder.valordokit != "-"
                        ? infoHolder.valordokit
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, valordokit: value })
                    }
                  />
                  <SelectInput
                    label={"LOCAL DE ENTREGA"}
                    value={
                      infoHolder.localdeentrega != undefined &&
                      infoHolder.localdeentrega != "-"
                        ? infoHolder.localdeentrega
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      { label: "MESMO DO PROJETO", value: "MESMO DO PROJETO" },
                      { label: "SEM RESTRIÇÕES", value: "SEM RESTRIÇÕES" },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, localdeentrega: value })
                    }
                  />
                  <TextInput
                    label={"INFORMAÇÕES"}
                    value={
                      infoHolder.informacoescompra
                        ? infoHolder.informacoescompra
                        : ""
                    }
                    editable={editor}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, informacoescompra: value })
                    }
                  />
                  <SelectInput
                    label={"STATUS DA ENTREGA"}
                    editable={editor}
                    value={
                      infoHolder.statusentrega
                        ? infoHolder.statusentrega
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      {
                        label: "AGUARDANDO COMPRA",
                        value: "AGUARDANDO COMPRA",
                      },
                      {
                        label: "ENTREGUE",
                        value: "ENTREGUE",
                      },
                      {
                        label: "CANCELADO",
                        value: "CANCELADO",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, statusentrega: value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  PAGAMENTO
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
                    label={"STATUS PAGAMENTO"}
                    value={
                      infoHolder.statuspagamento
                        ? infoHolder.statuspagamento
                        : "NÃO DEFINIDO"
                    }
                    editable={ppsEditor}
                    options={[
                      {
                        label: "AGUARDANDO PAGAMENTO",
                        value: "AGUARDANDO PAGAMENTO",
                      },
                      {
                        label: "PAGO",
                        value: "PAGO",
                      },
                      {
                        label: "RESCISÃO",
                        value: "RESCISÃO",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        statuspagamento: value,
                      })
                    }
                  />
                  <SelectInput
                    label={"FORMA DE PAGAMENTO"}
                    value={
                      infoHolder.formapagamento
                        ? infoHolder.formapagamento
                        : "NÃO DEFINIDO"
                    }
                    editable={ppsEditor}
                    options={[
                      {
                        label: "CAPITAL PROPRIO",
                        value: "CAPITAL PROPRIO",
                      },
                      {
                        label: "FINANCIAMENTO",
                        value: "FINANCIAMENTO",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        formapagamento: value,
                      })
                    }
                  />
                  <SelectInput
                    label={"EMPRESA A FATURAR"}
                    value={
                      infoHolder.empresafaturar != undefined &&
                      infoHolder.empresafaturar != "-"
                        ? infoHolder.empresafaturar
                        : "NÃO DEFINIDO"
                    }
                    editable={ppsEditor}
                    options={[
                      { label: "AMPERE ENERGIAS", value: "AMPERE ENERGIAS" },
                      {
                        label: "ANALISE DO FINANCEIRO",
                        value: "ANALISE DO FINANCEIRO",
                      },
                      { label: "IZAIRA SERVIÇOS", value: "IZAIRA SERVIÇOS" },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, empresafaturar: value })
                    }
                  />
                  <TextInput
                    label={"Informações faturamento"}
                    editable={ppsEditor}
                    value={
                      infoHolder.previsaofaturamento
                        ? infoHolder.previsaofaturamento
                        : ""
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, previsaofaturamento: value })
                    }
                  />
                  {infoHolder.formapagamento == "FINANCIAMENTO" && (
                    <SelectInput
                      label={"FORMA DE PAGAMENTO"}
                      value={
                        infoHolder.credor != undefined &&
                        infoHolder != "-----" &&
                        infoHolder != "QUAL CREDOR?"
                          ? infoHolder.credor
                          : "NÃO DEFINIDO"
                      }
                      editable={ppsEditor}
                      options={[
                        {
                          label: "BANCO DO BRASIL",
                          value: "BANCO DO BRASIL",
                        },
                        {
                          label: "BRADESCO",
                          value: "BRADESCO",
                        },
                        {
                          label: "BV FINANCEIRA",
                          value: "BV FINANCEIRA",
                        },
                        {
                          label: "CAIXA",
                          value: "CAIXA",
                        },
                        {
                          label: "COOPACREDI",
                          value: "COOPACREDI",
                        },
                        {
                          label: "CREDICAMPINA",
                          value: "CREDICAMPINA",
                        },
                        {
                          label: "CREDIPONTAL",
                          value: "CREDIPONTAL",
                        },
                        {
                          label: "SANTANDER",
                          value: "SANTANDER",
                        },
                        {
                          label: "SOL FACIL",
                          value: "SOL FACIL",
                        },
                        {
                          label: "NÃO DEFINIDO",
                          value: "NÃO DEFINIDO",
                        },
                      ]}
                      handleChange={(value) =>
                        setInfo({
                          ...infoHolder,
                          credor: value,
                        })
                      }
                    />
                  )}
                  <TextInput
                    label={"Pagador"}
                    editable={ppsEditor}
                    value={infoHolder.pagador ? infoHolder.pagador : ""}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, pagador: value })
                    }
                  />
                  <TextInput
                    label={"Contato pagador"}
                    editable={ppsEditor}
                    value={
                      infoHolder.contatopagamento
                        ? infoHolder.contatopagamento
                        : ""
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, contatopagamento: value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalSuprimentos;
