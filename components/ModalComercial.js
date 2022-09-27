import React, { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
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
function ModalComercial({ open, setModalIsOpen, project, editor }) {
  const [infoHolder, setInfo] = useState(project);
  console.log(infoHolder.datapagamento);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {infoHolder.qtde} - {infoHolder.nomedocontrato}
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => setModalIsOpen(false)}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y-auto">
              <div className="flex flex-col border border-gray-200 pb-2 shadow-lg">
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
                    editable={editor ? true : false}
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
                    editable={editor ? true : false}
                    value={infoHolder.cidade ? infoHolder.cidade : "-"}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, cidade: value })
                    }
                  />
                  <TextInput
                    label={"CEP"}
                    editable={editor ? true : false}
                    value={
                      infoHolder.cep
                        ? formataCEP(infoHolder.cep.toString())
                        : "-"
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, cep: value })
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
                    label={"Vendedor"}
                    editable={editor ? true : false}
                    value={
                      infoHolder.vendedor
                        ? `${infoHolder.vendedor} / ${infoHolder.codigodovendedor}`
                        : "-"
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, vendedor: value })
                    }
                  />
                  <SelectInput
                    label={"SEGMENTO"}
                    value={infoHolder.segmento}
                    options={[
                      { label: "COMERCIAL", value: "COMERCIAL" },
                      { label: "INDUSTRIAL", value: "INDUSTRIAL" },
                      { label: "RESIDENCIAL", value: "RESIDENCIAL" },
                      { label: "RURAL", value: "RURAL" },
                    ]}
                  />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 pb-2 shadow-lg">
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
                    value={
                      infoHolder.tecnicoresponsavel
                        ? infoHolder.tecnicoresponsavel
                        : "-"
                    }
                    handleChange={(e) =>
                      setInfo({
                        ...infoHolder,
                        tecnicoresponsavel: e.target.value,
                      })
                    }
                  />
                  <SelectInput
                    label={"Saída do cliente"}
                    value={
                      infoHolder.saidacliente ? infoHolder.saidacliente : "N/A"
                    }
                    options={[
                      { label: "SUBTERRANEO", value: "SUBTERRANEO" },
                      { label: "AEREO", value: "AEREO" },
                      { label: "N/A", value: "N/A" },
                    ]}
                    handleChange={(e) =>
                      setInfo({
                        ...infoHolder,
                        saidacliente: e.target.value,
                      })
                    }
                  />
                  <TextInput
                    label={"Amperagem"}
                    value={infoHolder.amperagem ? infoHolder.amperagem : "-"}
                    handleChange={(e) =>
                      setInfo({
                        ...infoHolder,
                        amperagem: e.target.value,
                      })
                    }
                  />
                  <TextInput
                    label={"Tipo da telha"}
                    value={infoHolder.tipotelha ? infoHolder.tipotelha : "-"}
                    handleChange={(e) =>
                      setInfo({ ...infoHolder, tipotelha: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  PADRÃO
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
                    label={"PAGAMENTO DO PADRÃO"}
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
                    handleChange={(e) =>
                      setInfo({
                        ...infoHolder,
                        pagamentodopadrao: e.target.value,
                      })
                    }
                  />
                  <NumberInput
                    label={"Valor do padrão"}
                    value={infoHolder.valorpadrao}
                    handleChange={(e) =>
                      setInfo({ ...infoHolder, valorpadrao: e.target.value })
                    }
                  />
                  <SelectInput
                    label={"RESPONSÁVEL INSTALAÇÃO DO PADRÃO"}
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
                    handleChange={(e) =>
                      setInfo({
                        ...infoHolder,
                        respinstalacaopadrao: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 pb-2 shadow-lg">
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
                    handleChange={(e) =>
                      setInfo({ ...infoHolder, tipoestrutura: e.target.value })
                    }
                  />
                  <SelectInput
                    label={"PAGAMENTO DA ESTRUTURA"}
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
                    handleChange={(e) =>
                      setInfo({
                        ...infoHolder,
                        pagestruturapersonalizada: e.target.value,
                      })
                    }
                  />
                  <NumberInput
                    label={"Valor da estrutura"}
                    value={
                      infoHolder.valorestrutura == "-" ||
                      infoHolder.valorestrutura == undefined
                        ? 0
                        : infoHolder.valorestrutura
                    }
                    handleChange={(e) =>
                      setInfo({ ...infoHolder, valorestrutura: e.target.value })
                    }
                  />
                  <SelectInput
                    label={"STATUS da estrutura personalizada"}
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
                    handleChange={(e) =>
                      setInfo({
                        ...infoHolder,
                        estruturapersonalisada: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 pb-2 shadow-lg">
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
              <div className="flex flex-col border border-gray-200 pb-2 shadow-lg">
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
                    value={infoHolder.pagador ? infoHolder.pagador : ""}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, pagador: value })
                    }
                  />
                  <TextInput
                    label={"Contato pagador"}
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
              <div className="flex flex-col border border-gray-200 pb-2 shadow-lg">
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
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  Informações do serviço
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <TextInput
                    label={"Tipo de serviço"}
                    value={
                      infoHolder.tipodeservico ? infoHolder.tipodeservico : "-"
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, tipodeservico: value })
                    }
                    editable={editor}
                  />
                  <TextInput
                    label={"Visita Técnica"}
                    value={
                      infoHolder.visitatecnica ? infoHolder.visitatecnica : "-"
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, visitatecnica: value })
                    }
                    editable={editor}
                  />
                  <TextInput
                    label={"Aumento de carga"}
                    value={
                      infoHolder.aumentodecarga
                        ? infoHolder.aumentodecarga
                        : "-"
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, aumentodecarga: value })
                    }
                    editable={editor}
                  />
                  <TextInput
                    label={"Status A.C"}
                    value={infoHolder.acstatus ? infoHolder.acstatus : "-"}
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, acstatus: value })
                    }
                    editable={editor}
                  />
                  <TextInput
                    label={"Pagamento do padrão"}
                    value={
                      infoHolder.pagamentodopadrao
                        ? infoHolder.pagamentodopadrao
                        : "-"
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, pagamentodopadrao: value })
                    }
                    editable={editor}
                  />
                  <TextInput
                    label={"Resp. instalação do padrão"}
                    value={
                      infoHolder.respinstalacaopadrao
                        ? infoHolder.respinstalacaopadrao
                        : "-"
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, respinstalacaopadrao: value })
                    }
                    editable={editor}
                  />
                  <TextInput
                    label={"Estrutura personalizada"}
                    value={
                      infoHolder.estruturapersonalisada
                        ? infoHolder.estruturapersonalisada
                        : "-"
                    }
                    handleChange={(value) =>
                      setInfo({ ...infoHolder, estruturapersonalisada: value })
                    }
                    editable={editor}
                  />
                  <TextInput
                    label={"Pagamento Estrutura Personalizada"}
                    value={
                      infoHolder.pagestruturapersonalizada
                        ? infoHolder.pagestruturapersonalizada
                        : "-"
                    }
                    handleChange={(value) =>
                      setInfo({
                        ...infoHolder,
                        pagestruturapersonalizada: value,
                      })
                    }
                    editable={editor}
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
