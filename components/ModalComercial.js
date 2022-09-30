import React, { useState } from "react";
import { vendedores } from "../utils/constants";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import axios from "axios";
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
function ModalComercial({
  open,
  setModalIsOpen,
  project,
  editor,
  handleUpdates,
}) {
  const [infoHolder, setInfo] = useState(project);
  function handleChanges() {
    axios
      .post(`/api/projects/update/${project._id}`, infoHolder)
      .then((res) => handleUpdates(project._id));
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
                    editable={editor}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, nomedocontrato: value })
                    }
                  />
                  <TextInput
                    label={"Nome do Projeto"}
                    value={infoHolder.nomedoprojeto}
                    editable={editor}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, nomedoprojeto: value })
                    }
                  />
                  <TextInput
                    label={"CPF/CNPJ"}
                    editable={editor}
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
                    editable={editor}
                    value={infoHolder.telefone ? infoHolder.telefone : "-"}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, telefone: value })
                    }
                  />
                  <TextInput
                    label={"Cidade"}
                    editable={editor}
                    value={infoHolder.cidade ? infoHolder.cidade : "-"}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, cidade: value })
                    }
                  />
                  <TextInput
                    label={"CEP"}
                    editable={editor}
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
                    editable={editor}
                    value={infoHolder.bairro ? infoHolder.bairro : ""}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, bairro: value })
                    }
                  />
                  <NumberInput
                    label={"Número da residência"}
                    editable={editor}
                    value={infoHolder.numerores ? infoHolder.numerores : 0}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, numerores: value })
                    }
                  />
                  <SelectInput
                    label={"Regional"}
                    editable={editor}
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
                    editable={editor}
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
                    editable={editor}
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
                      editable={editor}
                      handleChange={(value) =>
                        setInfo({ ...infoHolder, vendedor: value })
                      }
                    />
                    <div className="flex flex-col items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        CÓD.VENDEDOR
                      </span>
                      <p>{infoHolder.codigodovendedor}</p>
                    </div>
                  </div>
                  <SelectInput
                    label={"SEGMENTO"}
                    value={infoHolder.segmento}
                    editable={editor}
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
                  <div>
                    <input
                      disabled={!editor}
                      checked={
                        infoHolder.visitatecnica === "REALIZADA" ? true : false
                      }
                      onChange={(e) =>
                        setInfo({
                          ...infoHolder,
                          visitatecnica: e.target.checked
                            ? "REALIZADA"
                            : undefined,
                        })
                      }
                      type="checkbox"
                      name="visitaTecnica"
                      id="visitaTecnica"
                    />
                    <label className="ml-2" htmlFor="visitaTecnica">
                      REALIZADA
                    </label>
                  </div>
                  <TextInput
                    label={"TÉCNICO RESPONSÁVEL"}
                    editable={editor}
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
                  <SelectInput
                    label={"Saída do cliente"}
                    editable={editor}
                    value={
                      infoHolder.saidacliente ? infoHolder.saidacliente : "N/A"
                    }
                    options={[
                      { label: "SUBTERRANEO", value: "SUBTERRANEO" },
                      { label: "AEREO", value: "AEREO" },
                      { label: "N/A", value: "N/A" },
                    ]}
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        saidacliente: value,
                      })
                    }
                  />
                  <TextInput
                    label={"Amperagem"}
                    editable={editor}
                    value={infoHolder.amperagem ? infoHolder.amperagem : ""}
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        amperagem: value,
                      })
                    }
                  />
                  <TextInput
                    label={"Tipo da telha"}
                    editable={editor}
                    value={infoHolder.tipotelha ? infoHolder.tipotelha : ""}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, tipotelha: value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  PADRÃO
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
                    label={"PAGAMENTO DO PADRÃO"}
                    editable={editor}
                    value={
                      infoHolder.pagamentodopadrao ==
                        "NÃO HAVERA TROCA DE PADRÃO" ||
                      infoHolder.pagamentodopadrao == undefined
                        ? "NÃO HAVERA TROCA PADRÃO"
                        : infoHolder.pagamentodopadrao
                    }
                    options={[
                      {
                        label: "CLIENTE IRÁ COMPRAR EM SEPARADO",
                        value: "CLIENTE IRÁ COMPRAR EM SEPARADO",
                      },
                      {
                        label: "CLIENTE PAGAR POR FORA",
                        value: "CLIENTE PAGAR POR FORA",
                      },
                      {
                        label: "INCLUSO NO CONTRATO",
                        value: "INCLUSO NO CONTRATO",
                      },
                      {
                        label: "NÃO HAVERA TROCA PADRÃO",
                        value: "NÃO HAVERA TROCA PADRÃO",
                      },
                    ]}
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        pagamentodopadrao: value,
                      })
                    }
                  />
                  <NumberInput
                    tag={"R$"}
                    label={"Valor do padrão"}
                    editable={editor}
                    value={infoHolder.valorpadrao}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, valorpadrao: value })
                    }
                  />
                  <SelectInput
                    label={"RESPONSÁVEL INSTALAÇÃO DO PADRÃO"}
                    editable={editor}
                    value={
                      infoHolder.respinstalacaopadrao
                        ? infoHolder.respinstalacaopadrao
                        : "NÃO SE APLICA"
                    }
                    options={[
                      { label: "AMPERE", value: "AMPERE" },
                      { label: "CLIENTE", value: "CLIENTE" },
                      { label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
                    ]}
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        respinstalacaopadrao: value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  ESTRUTURA PERSONALIZADA
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <div>
                    <input
                      disabled={!editor}
                      checked={
                        infoHolder.possuiestruturapersonalisada === "SIM"
                          ? true
                          : false
                      }
                      onChange={(e) =>
                        setInfo({
                          ...infoHolder,
                          possuiestruturapersonalisada: e.target.checked
                            ? "SIM"
                            : "NÃO",
                        })
                      }
                      type="checkbox"
                      name="visitaTecnica"
                      id="visitaTecnica"
                    />
                    <label className="ml-2" htmlFor="visitaTecnica">
                      APLICÁVEL
                    </label>
                  </div>
                  <SelectInput
                    label={"Tipo da estrutura"}
                    editable={editor}
                    value={
                      infoHolder.tipoestrutura
                        ? infoHolder.tipoestrutura
                        : "N/A"
                    }
                    options={[
                      { label: "INCLINAÇÃO", value: "INCLINAÇÃO" },
                      { label: "SOLO", value: "SOLO" },
                      { label: "TELHADO", value: "TELHADO" },
                      { label: "BARRACÃO", value: "BARRACÃO" },
                      { label: "CARPORT", value: "CARPORT" },
                      { label: "N/A", value: "N/A" },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, tipoestrutura: value })
                    }
                  />
                  <SelectInput
                    label={"PAGAMENTO DA ESTRUTURA"}
                    editable={editor}
                    value={
                      infoHolder.pagestruturapersonalizada
                        ? infoHolder.pagestruturapersonalizada
                        : "NÃ SE APLICA"
                    }
                    options={[
                      { label: "AMPERE", value: "AMPERE" },
                      { label: "CLIENTE", value: "CLIENTE" },
                      { label: "NÃO SE APLICA", value: "NÃ SE APLICA" },
                    ]}
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        pagestruturapersonalizada: value,
                      })
                    }
                  />
                  <NumberInput
                    tag={"R$"}
                    label={"Valor da estrutura"}
                    editable={editor}
                    value={
                      infoHolder.valorestrutura == "-" ||
                      infoHolder.valorestrutura == undefined
                        ? 0
                        : infoHolder.valorestrutura
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, valorestrutura: value })
                    }
                  />
                  {infoHolder.possuiestruturapersonalisada == "SIM" && (
                    <SelectInput
                      label={"STATUS da estrutura personalizada"}
                      editable={editor}
                      value={
                        infoHolder.possuiestruturapersonalisada
                          ? infoHolder.estruturapersonalisada
                            ? infoHolder.estruturapersonalisada
                            : "N/A"
                          : "N/A"
                      }
                      options={[
                        { label: "PRONTA", value: "PRONTA" },
                        { label: "PENDÊNCIA", value: "PENDÊNCIA" },
                        { label: "N/A", value: "N/A" },
                      ]}
                      handleChange={(value) =>
                        setInfo({
                          ...infoHolder,
                          estruturapersonalisada: value,
                        })
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  CONTRATO
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
                    label={"STATUS"}
                    editable={editor}
                    value={
                      infoHolder.statuscontrato
                        ? infoHolder.statuscontrato
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      {
                        label: "AGUARDANDO SOLICITAÇÃO",
                        value: "AGUARDANDO SOLICITAÇÃO",
                      },
                      { label: "ASSINADO", value: "ASSINADO" },
                      { label: "NÃO ASSINADO", value: "NÃO ASSINADO" },
                      {
                        label: "RECISÃO DE CONTRATO",
                        value: "RECISÃO DE CONTRATO",
                      },
                      { label: "SOLICITADO", value: "SOLICITADO" },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, statuscontrato: value })
                    }
                  />
                  {(infoHolder.statuscontrato != "AGUARDANDO SOLICITAÇÃO" ||
                    infoHolder.statuscontrato != "NÃO DEFINIDO") && (
                    <DateInput
                      label={"Data de solicitação"}
                      editable={editor}
                      value={
                        infoHolder.datasolicitacaocontrato != undefined &&
                        infoHolder.datasolicitacaocontrato != "-"
                          ? new Date(infoHolder.datasolicitacaocontrato)
                              .toISOString()
                              .slice(0, 10)
                          : 0
                      }
                      handleChange={(value) =>
                        setInfo({
                          ...infoHolder,
                          datasolicitacaocontrato: new Date(value),
                        })
                      }
                    />
                  )}
                  <DateInput
                    label={"Data de liberação p/ assinatura"}
                    editable={editor}
                    value={
                      infoHolder.dataliberacaoassinatura != undefined &&
                      infoHolder.dataliberacaoassinatura != "-"
                        ? new Date(infoHolder.dataliberacaoassinatura)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        dataliberacaoassinatura: new Date(value),
                      })
                    }
                  />
                  <DateInput
                    label={"Data de assinatura"}
                    editable={editor}
                    value={
                      infoHolder.dataassinatura != undefined &&
                      infoHolder.dataassinatura != "-"
                        ? new Date(infoHolder.dataassinatura)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        dataassinatura: new Date(value),
                      })
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
                    editable={editor}
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
                    editable={editor}
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
                    editable={editor}
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
                    editable={editor}
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
                      editable={editor}
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
                    editable={editor}
                    value={infoHolder.pagador ? infoHolder.pagador : ""}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, pagador: value })
                    }
                  />
                  <TextInput
                    label={"Contato pagador"}
                    editable={editor}
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
                  DADOS INSTALAÇÃO CEMIG
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <TextInput
                    label={"Titular do projeto"}
                    editable={editor}
                    value={
                      infoHolder.titulardoprojeto
                        ? infoHolder.titulardoprojeto
                        : ""
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, titulardoprojeto: value })
                    }
                  />
                  <TextInput
                    label={"Número da instalação"}
                    value={
                      infoHolder.numeroinstalacao
                        ? infoHolder.numeroinstalacao
                        : ""
                    }
                    editable={editor}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, numeroinstalacao: value })
                    }
                  />
                  <SelectInput
                    label={"DISTRIBUIÇÃO DE CRÉDITOS"}
                    value={
                      infoHolder.distribuicaodecreditos
                        ? infoHolder.distribuicaodecreditos
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      { label: "SIM", value: "SIM" },
                      { label: "NÃO", value: "NÃO" },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, distribuicaodecreditos: value })
                    }
                  />
                  {infoHolder.distribuicaodecreditos == "SIM" && (
                    <NumberInput
                      label={"QTDE DE DISTRIBUIÇÕES"}
                      editable={editor}
                      value={
                        infoHolder.quantdistribuicoes != undefined &&
                        infoHolder.quantdistribuicoes != "-"
                          ? infoHolder.quantdistribuicoes
                          : 0
                      }
                      handleChange={(value) =>
                        setInfo({ ...infoHolder, quantdistribuicoes: value })
                      }
                    />
                  )}
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
                  PROJETO
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
                    label={"Projetista"}
                    value={
                      infoHolder.projetista
                        ? infoHolder.projetista
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "ALINE",
                        value: "ALINE APARECIDA RODRIGUES CARVALHO",
                      },
                      {
                        label: "ANDREW",
                        value: "ANDRE BORGES ALEXANDER",
                      },
                      {
                        label: "GLENDA",
                        value: "GLENDA ELIAS NASCIMENTO SANTOS",
                      },
                      {
                        label: "POLLIANA",
                        value: "POLLIANA CRISTINA DE REZENDE",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, projetista: value })
                    }
                  />
                  <DateInput
                    label={"Data de assinatura da documentação"}
                    editable={editor}
                    value={
                      infoHolder.documentacaoassinada != undefined &&
                      infoHolder.documentacaoassinada != "-"
                        ? new Date(infoHolder.documentacaoassinada)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, documentacaoassinada: value })
                    }
                  />
                  <DateInput
                    label={"Parecer de acesso"}
                    editable={editor}
                    value={
                      infoHolder.pareceracesso != undefined &&
                      infoHolder.pareceracesso != "-"
                        ? new Date(infoHolder.pareceracesso)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, pareceracesso: value })
                    }
                  />
                  <SelectInput
                    label={"Status do parecer de acesso"}
                    value={
                      infoHolder.statusparecerdeacesso
                        ? infoHolder.statusparecerdeacesso
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "AGUARDANDO FATURAMENTO ART",
                        value: "AGUARDANDO FATURAMENTO ART",
                      },
                      {
                        label: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                        value: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                      },
                      {
                        label: "CANCELADO",
                        value: "CANCELADO",
                      },
                      {
                        label: "INICIAR PROJETO",
                        value: "INICIAR PROJETO",
                      },
                      {
                        label: "PARECER DE ACESSO APROVADO",
                        value: "PARECER DE ACESSO APROVADO",
                      },
                      {
                        label: "PENDENCIAS",
                        value: "PENDENCIAS",
                      },
                      {
                        label: "SOLICITAR ACESSO",
                        value: "SOLICITAR ACESSO",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, statusparecerdeacesso: value })
                    }
                  />
                  <SelectInput
                    label={"Status do parecer de acesso"}
                    value={
                      infoHolder.statusparecerdeacesso
                        ? infoHolder.statusparecerdeacesso
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "AGUARDANDO FATURAMENTO ART",
                        value: "AGUARDANDO FATURAMENTO ART",
                      },
                      {
                        label: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                        value: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                      },
                      {
                        label: "CANCELADO",
                        value: "CANCELADO",
                      },
                      {
                        label: "INICIAR PROJETO",
                        value: "INICIAR PROJETO",
                      },
                      {
                        label: "PARECER DE ACESSO APROVADO",
                        value: "PARECER DE ACESSO APROVADO",
                      },
                      {
                        label: "PENDENCIAS",
                        value: "PENDENCIAS",
                      },
                      {
                        label: "SOLICITAR ACESSO",
                        value: "SOLICITAR ACESSO",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, statusparecerdeacesso: value })
                    }
                  />
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      DIAGRAMA UNIFILAR
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.diagramaunifilar === "Ok" ? true : false
                        }
                        onChange={(e) =>
                          setInfo({
                            ...infoHolder,
                            diagramaunifilar: e.target.checked
                              ? "Ok"
                              : undefined,
                          })
                        }
                        type="checkbox"
                        name="diagramaunifilar"
                        id="diagramaunifilar"
                      />
                      <label className="ml-2" htmlFor="diagramaunifilar">
                        OK
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      DESENHO DO TELHADO
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.desenhotelhado === "OK" ? true : false
                        }
                        onChange={(e) =>
                          setInfo({
                            ...infoHolder,
                            desenhotelhado: e.target.checked ? "OK" : undefined,
                          })
                        }
                        type="checkbox"
                        name="desenhotelhado"
                        id="desenhotelhado"
                      />
                      <label className="ml-2" htmlFor="desenhotelhado">
                        OK
                      </label>
                    </div>
                  </div>
                  <SelectInput
                    label={"MAPA DE MICRO"}
                    editable={editor}
                    value={
                      infoHolder.mapademicro != undefined &&
                      infoHolder.mapademicro != "-"
                        ? infoHolder.mapademicro
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "OK", value: "OK" },
                      { label: `N\A`, value: `N\A` },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                  />
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      AUMENTO DE CARGA
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.aumentodecarga === "SIM" ? true : false
                        }
                        onChange={(e) =>
                          setInfo({
                            ...infoHolder,
                            aumentodecarga: e.target.checked ? "SIM" : "NÃO",
                            acstatus:
                              e.target.checked &&
                              infoHolder.acstatus != "REALIZADO"
                                ? "PÊNDENCIA"
                                : undefined,
                          })
                        }
                        type="checkbox"
                        name="aumentodecarga"
                        id="aumentodecarga"
                      />
                      <label className="ml-2" htmlFor="aumentodecarga">
                        SIM
                      </label>
                    </div>
                  </div>
                  {infoHolder.aumentodecarga == "SIM" && (
                    <div className="flex flex-col w-[350px] items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        STATUS AUMENTO DE CARGA
                      </span>
                      <div className="flex">
                        <input
                          disabled={!editor}
                          checked={
                            infoHolder.acstatus === "REALIZADO" ? true : false
                          }
                          onChange={(e) =>
                            setInfo({
                              ...infoHolder,
                              acstatus: e.target.checked
                                ? "REALIZADO"
                                : "PENDÊNCIA",
                            })
                          }
                          type="checkbox"
                          name="acstatus"
                          id="acstatus"
                        />
                        <label className="ml-2" htmlFor="acstatus">
                          REALIZADO
                        </label>
                      </div>
                    </div>
                  )}
                  <DateInput
                    label={"DATA DO PEDIDO DE VISTORIA"}
                    editable={editor}
                    value={
                      infoHolder.pedidovistoria != undefined &&
                      infoHolder.pedidovistoria != "-"
                        ? new Date(infoHolder.pedidovistoria)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, pedidovistoria: value })
                    }
                  />
                  <SelectInput
                    label={"STATUS DA VISTORIA"}
                    value={
                      infoHolder.statusvistoria
                        ? infoHolder.statusvistoria
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      { label: "REALIZADA", value: "REALIZADA" },
                      {
                        label: "AGUARDANDO OBRA DE REDE",
                        value: "AGUARDANDO OBRA DE REDE",
                      },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, statusvistoria: value })
                    }
                  />
                  <DateInput
                    label={"DATA TROCA DO MEDIDOR"}
                    editable={editor}
                    value={
                      infoHolder.trocamedidor != undefined &&
                      infoHolder.trocamedidor != "-"
                        ? new Date(infoHolder.trocamedidor)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, trocamedidor: value })
                    }
                  />
                  <SelectInput
                    label={"STATUS DA TROCA DO MEDIDOR"}
                    value={
                      infoHolder.statustrocamedidor
                        ? infoHolder.statustrocamedidor
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      { label: "REALIZADA", value: "REALIZADA" },
                      {
                        label: "AGUARDANDO OBRA DE REDE",
                        value: "AGUARDANDO OBRA DE REDE",
                      },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, statustrocamedidor: value })
                    }
                  />
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      PROJETO CONCLUÍDO
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.projetoconcluido === "SIM" ? true : false
                        }
                        onChange={(e) =>
                          setInfo({
                            ...infoHolder,
                            projetoconcluido: e.target.checked ? "SIM" : "NÃO",
                          })
                        }
                        type="checkbox"
                        name="projetoconcluido"
                        id="projetoconcluido"
                      />
                      <label className="ml-2" htmlFor="projetoconcluido">
                        SIM
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  Informações sobre a obra
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
                    label={"Laudo"}
                    value={infoHolder.laudo ? infoHolder.laudo : "NÃO DEFINIDO"}
                    editable={editor}
                    options={[
                      { label: "EM ESTUDO", value: "EM ESTUDO" },
                      { label: "EMITIDO", value: "EMITIDO" },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, laudo: value })
                    }
                  />
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      SOLICITAÇÃO DA OBRA
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.solicitacaoobra === "SOLICITADA"
                            ? true
                            : false
                        }
                        onChange={(e) =>
                          setInfo({
                            ...infoHolder,
                            solicitacaoobra: e.target.checked
                              ? "SOLICITADA"
                              : undefined,
                          })
                        }
                        type="checkbox"
                        name="solicitacaoobra"
                        id="solicitacaoobra"
                      />
                      <label className="ml-2" htmlFor="solicitacaoobra">
                        SOLICITADA
                      </label>
                    </div>
                  </div>
                  <DateInput
                    label={"ENTRADA NA OBRA"}
                    editable={editor}
                    value={
                      infoHolder.entradanaobra != undefined &&
                      infoHolder.entradanaobra != "-"
                        ? new Date(infoHolder.entradanaobra)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, entradanaobra: value })
                    }
                  />
                  <DateInput
                    label={"SAIDA DE OBRA"}
                    editable={editor}
                    value={
                      infoHolder.saidadeobra != undefined &&
                      infoHolder.saidadeobra != "-"
                        ? new Date(infoHolder.saidadeobra)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, saidadeobra: value })
                    }
                  />
                  <SelectInput
                    label={"EQUIPE RESPONSÁVEL"}
                    editable={editor}
                    value={
                      infoHolder.equipeexec != undefined &&
                      infoHolder.equipeexec != "-"
                        ? infoHolder.equipeexec == "TERCEIROS" ||
                          infoHolder.equipeexec == "TERCERIZADOS" ||
                          infoHolder.equipeexec == "OUTROS"
                          ? "OUTROS"
                          : infoHolder.equipeexec
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      {
                        label: "EQUIPE 1 - JOSÉ ROBERTO",
                        value: "EQUIPE 1 - JOSÉ ROBERTO",
                      },
                      {
                        label: "EQUIPE 2 - EDUARDO",
                        value: "EQUIPE 2-EDUARDO",
                      },
                      {
                        label: "EQUIPE 3 - EDMAR",
                        value: "EQUIPE 3-EDIMAR",
                      },
                      {
                        label: "EQUIPE 4 - ERICK",
                        value: "EQUIPE 4-ERICK",
                      },
                      {
                        label: "EQUIPE 5 - JUNIN",
                        value: "EQUIPE 5-JUNIN",
                      },
                      {
                        label: "EQUIPE 6 - FELIPE",
                        value: "EQUIPE 6-FELIPE",
                      },
                      {
                        label: "EQUIPE 7 - ADENILSON",
                        value: "EQUIPE 7- ADENILSON",
                      },
                      {
                        label: "EQUIPE 8 - GERSON",
                        value: "EQUIPE 8-GERSON",
                      },
                      {
                        label: "EQUIPE 9 - REGINALDO",
                        value: "EQUIPE 9 - REGINALDO",
                      },
                      {
                        label: "EQUIPE 10 - LUIZ",
                        value: "EQUIPE 10 - LUIZ",
                      },
                      {
                        label: "EQUIPE 11 - GILMAR",
                        value: "EQUIPE 11 - GILMAR",
                      },
                      {
                        label: "EQUIPE 12 - MARCUS V.",
                        value: "EQUIPE 12 - MARCUS V.",
                      },
                      {
                        label: "EQUIPE 13 - EDUARDO FRANCO",
                        value: "EQUIPE 13 - EDUARDO FRANCO",
                      },
                      {
                        label: "EQUIPE 15 - MARCOS B.",
                        value: "EQUIPE 15 - MARCOS B.",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, equipeexec: value })
                    }
                  />
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      CHECKLIST OBRA
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.checklistobra === "SIM" ? true : false
                        }
                        onChange={(e) =>
                          setInfo({
                            ...infoHolder,
                            checklistobra: e.target.checked ? "SIM" : undefined,
                          })
                        }
                        type="checkbox"
                        name="checklistobra"
                        id="checklistobra"
                      />
                      <label className="ml-2" htmlFor="checklistobra">
                        SIM
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      TRAFO
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={infoHolder.trafo === "SIM" ? true : false}
                        onChange={(e) =>
                          setInfo({
                            ...infoHolder,
                            trafo: e.target.checked ? "SIM" : undefined,
                          })
                        }
                        type="checkbox"
                        name="trafo"
                        id="trafo"
                      />
                      <label className="ml-2" htmlFor="trafo">
                        SIM
                      </label>
                    </div>
                  </div>
                  <SelectInput
                    label={"STATUS DA OBRA"}
                    value={
                      infoHolder.statusobra
                        ? infoHolder.statusobra
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "AGENDADA",
                        value: "AGENDADA",
                      },
                      {
                        label: "AGUARDANDO AGENDAMENTO",
                        value: "AGUARDANDO AGENDAMENTO",
                      },
                      {
                        label: "CONCLUIDA",
                        value: "CONCLUIDA",
                      },
                      {
                        label: "EM ANDAMENTO",
                        value: "EM ANDAMENTO",
                      },
                      {
                        label: "OBRA CANCELADA",
                        value: "OBRA CANCELADA",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                  />
                  <div className="flex flex-col w-[450px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      OBSERVAÇÕES
                    </span>
                    <textarea
                      readOnly={!editor}
                      value={infoHolder.obsobra ? infoHolder.obsobra : ""}
                      placeholder={"Observações da obra aqui..."}
                      onChange={(e) =>
                        setInfo({ ...infoHolder, obsobra: e.target.value })
                      }
                      className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  MATERIAL
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
                    label={"Separação do material"}
                    value={
                      infoHolder.materialalmoxarifado
                        ? infoHolder.materialalmoxarifado
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
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, materialalmoxarifado: value })
                    }
                  />
                  <NumberInput
                    tag={"R$"}
                    label={"Previsão de custos em insumos"}
                    editable={editor}
                    value={
                      infoHolder.prevcustosinsumos != undefined &&
                      infoHolder.prevcustosinsumos != "#VALUE!"
                        ? infoHolder.prevcustosinsumos
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, prevcustosinsumos: value })
                    }
                  />
                  <NumberInput
                    tag={"R$"}
                    label={"Custos em insumos"}
                    editable={editor}
                    value={
                      infoHolder.custosinsumos != undefined &&
                      infoHolder.custosinsumos != "#VALUE!"
                        ? infoHolder.custosinsumos
                        : 0
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, custosinsumos: value })
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

export default ModalComercial;
