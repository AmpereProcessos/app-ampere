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
  console.log(infoHolder.dataliberacaoparacompra);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
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
            <div className="flex flex-col">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                Informações do cliente
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
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
                    infoHolder.cep ? formataCEP(infoHolder.cep.toString()) : "-"
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
              </div>
            </div>
            <div className="flex flex-col">
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
                    infoHolder.aumentodecarga ? infoHolder.aumentodecarga : "-"
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
                    setInfo({ ...infoHolder, pagestruturapersonalizada: value })
                  }
                  editable={editor}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                Informações da documentação
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <TextInput
                  label={"Status do contrato"}
                  value={
                    infoHolder.statuscontrato ? infoHolder.statuscontrato : "-"
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, statuscontrato: value })
                  }
                  editable={editor}
                />
                <TextInput
                  label={"Data da solicitação"}
                  value={
                    infoHolder.datasolicitacaocontrato &&
                    infoHolder.datasolicitacaocontrato != "-"
                      ? new Date(
                          infoHolder.datasolicitacaocontrato
                        ).toLocaleDateString()
                      : "-"
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, datasolicitacaocontrato: value })
                  }
                  editable={editor}
                />
                <TextInput
                  label={"Data liberação p/ assinatura"}
                  value={
                    infoHolder.dataliberacaoassinatura &&
                    infoHolder.dataliberacaoassinatura != "-"
                      ? new Date(
                          infoHolder.dataliberacaoassinatura
                        ).toLocaleDateString()
                      : "-"
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, dataliberacaoassinatura: value })
                  }
                  editable={editor}
                />
                <TextInput
                  label={"Data assinatura"}
                  value={
                    infoHolder.dataassinatura &&
                    infoHolder.dataassinatura != "-"
                      ? new Date(infoHolder.dataassinatura).toLocaleDateString()
                      : "-"
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, dataassinatura: value })
                  }
                  editable={editor}
                />
                <TextInput
                  label={"Laudo"}
                  value={infoHolder.laudo ? infoHolder.laudo : "-"}
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, laudo: value })
                  }
                  editable={editor}
                />
                <DateInput
                  label={"Documentação Assinada"}
                  value={
                    infoHolder.documentacaoassinada &&
                    infoHolder.documentacaoassinada != "-"
                      ? new Date(
                          infoHolder.documentacaoassinada
                        ).toLocaleDateString()
                      : undefined
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, documentacaoassinada: value })
                  }
                  editable={editor}
                />
                <DateInput
                  label={"Parecer de acesso"}
                  value={
                    infoHolder.pareceracesso && infoHolder.pareceracesso != "-"
                      ? new Date(infoHolder.pareceracesso).toLocaleDateString()
                      : undefined
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, pareceracesso: value })
                  }
                  editable={editor}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                Informações de pagamento e entrega
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <SelectInput
                  label={"Forma de pagamento"}
                  options={[
                    { label: "CAPITAL PROPRIO", value: "CAPITAL PROPRIO" },
                    { label: "FINANCIAMENTO", value: "FINANCIAMENTO" },
                  ]}
                  value={infoHolder.formapagemento}
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, formapagemento: value })
                  }
                  editable={editor}
                />
                <SelectInput
                  label={"CREDOR"}
                  options={[
                    { label: "ARACOOP", value: "ARACOOP" },
                    { label: "BANCO DO BRASIL", value: "BANCO DO BRASIL" },
                    { label: "BRADESCO", value: "BRADESCO" },
                    { label: "BV FINANCEIRA", value: "BV FINANCEIRA" },
                    { label: "CAIXA", value: "CAIXA" },
                    { label: "COOPACREDI", value: "COOPACREDI" },
                    { label: "CREDICAMPINA", value: "CREDICAMPINA" },
                    { label: "CREDIPINHO", value: "CREDIPINHO" },
                    { label: "CREDIPONTAL", value: "CREDIPONTAL" },
                    { label: "ITAÚ", value: "ITAÚ" },
                    { label: "MERCANTIL", value: "MERCANTIL" },
                    { label: "SANTANDER", value: "SANTANDER" },
                    { label: "SANTANDER AYMORE", value: "SANTANDER AYMORE" },
                    { label: "SICREDI", value: "SICREDI" },
                    { label: "SOLFÁCIL", value: "SOLFÁCIL" },
                  ]}
                  value={infoHolder.formapagemento}
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, credor: value })
                  }
                  editable={editor}
                />
                <TextInput
                  label={"Retorno"}
                  value={infoHolder.retorno ? infoHolder.retorno : "-"}
                  editable={editor}
                />
                <SelectInput
                  label={"Status liberação de crédito"}
                  value={infoHolder.statusliberacaocredito}
                  options={[
                    { label: "AGUARDAR CONTRATO", value: "AGUARDAR CONTRATO" },
                    {
                      label: "AGUARDAR PARECER DE ACESSO",
                      value: "AGUARDAR PARECER DE ACESSO",
                    },
                    { label: "ASSINADO", value: "ASSINADO" },
                    { label: "PAGO", value: "PAGO" },
                    { label: "REALIZAR COMPRA", value: "REALIZAR COMPRA" },
                    {
                      label: "RECISÃO DE CONTRATO",
                      value: "RECISÃO DE CONTRATO",
                    },
                  ]}
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, statusliberacaocredito: value })
                  }
                  editable={editor}
                />
                <TextInput
                  label={"Pagador"}
                  value={infoHolder.pagador ? infoHolder.pagador : "-"}
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, pagador: value })
                  }
                  editable={editor}
                />
                <TextInput
                  label={"Contato p/ Pagamento"}
                  value={
                    infoHolder.contatopagamento
                      ? infoHolder.contatopagamento
                      : "-"
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, contatopagamento: value })
                  }
                  editable={editor}
                />
                <DateInput
                  label={"Data liberação p/ compra"}
                  value={
                    infoHolder.dataliberacaoparacompra &&
                    infoHolder.dataliberacaoparacompra != "-"
                      ? infoHolder.dataliberacaoparacompra
                      : undefined
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, dataliberacaoparacompra: value })
                  }
                  editable={editor}
                />
                <TextInput
                  label={"Local de entrega"}
                  value={
                    infoHolder.localdeentrega ? infoHolder.localdeentrega : "-"
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, localdeentrega: value })
                  }
                  editable={editor}
                />
                <TextInput
                  label={"Titular do projeto"}
                  value={
                    infoHolder.titulardoprojeto
                      ? infoHolder.titulardoprojeto
                      : "-"
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, titulardoprojeto: value })
                  }
                  editable={editor}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                Informações do sistema
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <NumberInput
                  label={"Nº de módulos"}
                  value={
                    infoHolder.nmodulos && infoHolder.nmodulos != "-"
                      ? infoHolder.nmodulos
                      : 0
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, nmodulos: value })
                  }
                  editable={editor}
                />
                <NumberInput
                  label={"Potência dos módulos"}
                  value={
                    infoHolder.potmodulos && infoHolder.potmodulos != "-"
                      ? infoHolder.potmodulos
                      : 0
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, potmodulos: value })
                  }
                  editable={editor}
                />
                <NumberInput
                  label={"Potência Pico"}
                  value={
                    infoHolder.potpico && infoHolder.potpico != "-"
                      ? infoHolder.potpico
                      : 0
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, potpico: value })
                  }
                  editable={editor}
                />
                <SelectInput
                  label={"Topologia"}
                  value={infoHolder.topologia}
                  options={[
                    { label: "MICRO", value: "MICRO" },
                    { label: "INVERSOR", value: "INVERSOR" },
                  ]}
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, topologia: value })
                  }
                  editable={editor}
                />
                <TextInput
                  label={"Tipo do kit"}
                  value={infoHolder.tipokit ? infoHolder.tipokit : "-"}
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, tipokit: value })
                  }
                  editable={editor}
                />
                <NumberInput
                  label={"Valor do kit"}
                  value={
                    infoHolder.valordokit && infoHolder.valordokit != "="
                      ? infoHolder.valordokit
                      : 0
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, valordokit: value })
                  }
                  editable={editor}
                />
                <TextInput
                  label={"Qtde e potência do inversor"}
                  value={
                    infoHolder.qtdepotinversor
                      ? infoHolder.qtdepotinversor
                      : "-"
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, qtdepotinversor: value })
                  }
                  editable={editor}
                />
                <NumberInput
                  label={"Valor da estrutura"}
                  value={
                    infoHolder.valorestrutura &&
                    infoHolder.valorestrutura != "="
                      ? infoHolder.valorestrutura
                      : 0
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, valorestrutura: value })
                  }
                  editable={editor}
                />
                <NumberInput
                  label={"Valor do padrão"}
                  value={
                    infoHolder.valorpadrao && infoHolder.valorpadrao != "="
                      ? infoHolder.valorpadrao
                      : 0
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, valorpadrao: value })
                  }
                  editable={editor}
                />
                <NumberInput
                  label={"Valor do Projeto"}
                  value={
                    infoHolder.valorprojeto && infoHolder.valorprojeto != "="
                      ? infoHolder.valorprojeto
                      : 0
                  }
                  handleChange={(value) =>
                    setInfo({ ...infoHolder, valorprojeto: value })
                  }
                  editable={editor}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalComercial;
