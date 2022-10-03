import React, { useEffect, useState } from "react";
import { cities } from "../../utils/constants";
import NumberInput from "../../components/NumberInput";
import SelectInput from "../../components/SelectInput";
import TextInput from "../../components/TextInput";
import DateInput from "../../components/DateInput";
import { vendedores } from "../../utils/constants";
import { useRouter } from "next/router";
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
function NovoProjeto({ credentials, setCredentials }) {
  const router = useRouter();
  const [info, setInfo] = useState({});
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
    } else {
      if (
        !credentials.accessibleRoutes.includes("PPS") &&
        !storedCredentials.accessibleRoutes.includes("PPS")
      ) {
        router.push("/");
      }
    }
  }, []);
  return (
    <div className="p-6 grow">
      <div className="flex items-center justify-between border-b border-gray-200 p-1">
        <div>
          <h1 className="text-[#15599a] font-bold font-raleway text-xl uppercase">
            Adicionar novo projeto
          </h1>
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
              value={info.nomedocontrato}
              editable={true}
              handleChange={(value) =>
                setInfo({ ...info, nomedocontrato: value })
              }
            />
            <TextInput
              label={"Nome do Projeto"}
              value={info.nomedoprojeto}
              editable={true}
              handleChange={(value) =>
                setInfo({ ...info, nomedoprojeto: value })
              }
            />
            <NumberInput
              label={"Nº DO PROJETO SVB"}
              value={info.codprojetosvb}
              editable={true}
              handleChange={(value) =>
                setInfo({ ...info, codprojetosvb: value })
              }
            />
            <TextInput
              label={"CPF/CNPJ"}
              editable={true}
              value={info.cpfcnpj ? formataCPF(info.cpfcnpj.toString()) : "-"}
              handleChange={(value) => setInfo({ ...info, cpfcnpj: value })}
            />
            <TextInput
              label={"Telefone"}
              editable={true}
              value={info.telefone ? info.telefone : "-"}
              handleChange={(value) => setInfo({ ...info, telefone: value })}
            />
            <SelectInput
              label={"Cidade"}
              editable={true}
              value={info.cidade}
              options={cities.map((city) => {
                return { label: city.name, value: city.name };
              })}
              handleChange={(value) => setInfo({ ...info, cidade: value })}
            />
            <TextInput
              label={"CEP"}
              editable={true}
              value={info.cep ? formataCEP(info.cep.toString()) : "-"}
              handleChange={(value) => setInfo({ ...info, cep: value })}
            />
            <TextInput
              label={"Bairro"}
              editable={true}
              value={info.bairro ? info.bairro : ""}
              handleChange={(value) => setInfo({ ...info, bairro: value })}
            />
            <NumberInput
              label={"Número da residência"}
              editable={true}
              value={info.numerores ? info.numerores : 0}
              handleChange={(value) => setInfo({ ...info, numerores: value })}
            />
            <SelectInput
              label={"Regional"}
              editable={true}
              value={info.regional && "REGIONAL ITUIUTABA"}
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
              handleChange={(value) => setInfo({ ...info, regional: value })}
            />
            <TextInput
              label={"EMAIL"}
              editable={true}
              value={info.email ? info.email : ""}
              handleChange={(value) => setInfo({ ...info, email: value })}
            />
            <SelectInput
              label={"Canal de venda"}
              value={
                info.canalvenda != undefined && info.canalvenda != "-"
                  ? info.canalvenda
                  : "NÃO DEFINIDO"
              }
              editable={true}
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
              handleChange={(value) => setInfo({ ...info, canalvenda: value })}
            />
            {info.canalvenda && info.canalvenda == "INDICAÇÃO DE AMIGO" && (
              <>
                <TextInput
                  label={"NOME DO INDICADOR"}
                  value={info.quemindicou}
                  editable={true}
                  handleChange={(value) =>
                    setInfo({ ...info, quemindicou: value })
                  }
                />
                <TextInput
                  label={"Contato do indicador"}
                  value={info.contatoindicador}
                  editable={true}
                  handleChange={(value) =>
                    setInfo({ ...info, contatoindicador: value })
                  }
                />
              </>
            )}
            <div className="flex">
              <SelectInput
                label={"VENDEDOR"}
                value={
                  info.vendedor != undefined && info.vendedor != "-"
                    ? info.vendedor
                    : "NÃO DEFINIDO"
                }
                options={vendedores.map((vendedor) => {
                  return { label: vendedor.nome, value: vendedor.nome };
                })}
                editable={true}
                handleChange={(value) => setInfo({ ...info, vendedor: value })}
              />
              {info.vendedor && (
                <div className="flex flex-col items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    CÓD.VENDEDOR
                  </span>
                  <p>
                    {
                      vendedores.filter(
                        (vendedor) => vendedor.nome == info.vendedor
                      )[0].cod
                    }
                  </p>
                </div>
              )}
            </div>
            <SelectInput
              label={"SEGMENTO"}
              value={info.segmento && "COMERCIAL"}
              editable={true}
              options={[
                { label: "COMERCIAL", value: "COMERCIAL" },
                { label: "INDUSTRIAL", value: "INDUSTRIAL" },
                { label: "RESIDENCIAL", value: "RESIDENCIAL" },
                { label: "RURAL", value: "RURAL" },
              ]}
              handleChange={(value) => setInfo({ ...info, segmento: value })}
            />
            <SelectInput
              label={"Tipo do serviço"}
              value={info.tipodeservico && "SISTEMA FOTOVOLTAICO"}
              editable={true}
              options={[
                {
                  label: "SISTEMA FOTOVOLTAICO",
                  value: "SISTEMA FOTOVOLTAICO",
                },
                {
                  label: "TROCA DE PADRÃO",
                  value: "TROCA DE PADRÃO",
                },
                {
                  label: "REFORMA DE PADRÃO",
                  value: "REFORMA DE PADRÃO",
                },
                {
                  label: "MANUTENÇÃO CORRETIVA",
                  value: "MANUTENÇÃO CORRETIVA",
                },
                {
                  label: "MANUTENÇÃO PREVENTIVA",
                  value: "MANUTENÇÃO PREVENTIVA",
                },
                {
                  label: "MONTAGEM E DESMONTAGEM",
                  value: "MONTAGEM E DESMONTAGEM",
                },
                {
                  label: "TROCA DE STRING BOX",
                  value: "TROCA DE STRING BOX",
                },
                {
                  label: "SUBESTAÇÃO DE ENERGIA",
                  value: "SUBESTAÇÃO DE ENERGIA",
                },
              ]}
              handleChange={(value) =>
                setInfo({ ...info, tipodeservico: value })
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
                disabled={false}
                checked={info.visitatecnica === "REALIZADA" ? true : false}
                onChange={(e) =>
                  setInfo({
                    ...info,
                    visitatecnica: e.target.checked ? "REALIZADA" : undefined,
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
              editable={true}
              value={info.tecnicoresponsavel ? info.tecnicoresponsavel : ""}
              handleChange={(value) =>
                setInfo({
                  ...info,
                  tecnicoresponsavel: value,
                })
              }
            />
            <SelectInput
              label={"Saída do cliente"}
              editable={true}
              value={info.saidacliente ? info.saidacliente : "N/A"}
              options={[
                { label: "SUBTERRANEO", value: "SUBTERRANEO" },
                { label: "AEREO", value: "AEREO" },
                { label: "N/A", value: "N/A" },
              ]}
              handleChange={(value) =>
                setInfo({
                  ...info,
                  saidacliente: value,
                })
              }
            />
            <TextInput
              label={"Amperagem"}
              editable={true}
              value={info.amperagem ? info.amperagem : ""}
              handleChange={(value) =>
                setInfo({
                  ...info,
                  amperagem: value,
                })
              }
            />
            <TextInput
              label={"Tipo da telha"}
              editable={true}
              value={info.tipotelha ? info.tipotelha : ""}
              handleChange={(value) => setInfo({ ...info, tipotelha: value })}
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
              editable={true}
              value={
                info.pagamentodopadrao == "NÃO HAVERA TROCA DE PADRÃO" ||
                info.pagamentodopadrao == undefined
                  ? "NÃO HAVERA TROCA PADRÃO"
                  : info.pagamentodopadrao
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
                  ...info,
                  pagamentodopadrao: value,
                })
              }
            />
            <NumberInput
              tag={"R$"}
              label={"Valor do padrão"}
              editable={true}
              value={info.valorpadrao}
              handleChange={(value) => setInfo({ ...info, valorpadrao: value })}
            />
            <SelectInput
              label={"RESPONSÁVEL INSTALAÇÃO DO PADRÃO"}
              editable={true}
              value={
                info.respinstalacaopadrao
                  ? info.respinstalacaopadrao
                  : "NÃO SE APLICA"
              }
              options={[
                { label: "AMPERE", value: "AMPERE" },
                { label: "CLIENTE", value: "CLIENTE" },
                { label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
              ]}
              handleChange={(value) =>
                setInfo({
                  ...info,
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
                disabled={false}
                checked={
                  info.possuiestruturapersonalisada === "SIM" ? true : false
                }
                onChange={(e) =>
                  setInfo({
                    ...info,
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
              editable={true}
              value={info.tipoestrutura ? info.tipoestrutura : "N/A"}
              options={[
                { label: "INCLINAÇÃO", value: "INCLINAÇÃO" },
                { label: "SOLO", value: "SOLO" },
                { label: "TELHADO", value: "TELHADO" },
                { label: "BARRACÃO", value: "BARRACÃO" },
                { label: "CARPORT", value: "CARPORT" },
                { label: "N/A", value: "N/A" },
              ]}
              handleChange={(value) =>
                setInfo({ ...info, tipoestrutura: value })
              }
            />
            <SelectInput
              label={"PAGAMENTO DA ESTRUTURA"}
              editable={true}
              value={
                info.pagestruturapersonalizada
                  ? info.pagestruturapersonalizada
                  : "NÃ SE APLICA"
              }
              options={[
                { label: "AMPERE", value: "AMPERE" },
                { label: "CLIENTE", value: "CLIENTE" },
                { label: "NÃO SE APLICA", value: "NÃ SE APLICA" },
              ]}
              handleChange={(value) =>
                setInfo({
                  ...info,
                  pagestruturapersonalizada: value,
                })
              }
            />
            <NumberInput
              tag={"R$"}
              label={"Valor da estrutura"}
              editable={true}
              value={
                info.valorestrutura == "-" || info.valorestrutura == undefined
                  ? 0
                  : info.valorestrutura
              }
              handleChange={(value) =>
                setInfo({ ...info, valorestrutura: value })
              }
            />
            {info.possuiestruturapersonalisada == "SIM" && (
              <SelectInput
                label={"STATUS da estrutura personalizada"}
                editable={true}
                value={
                  info.possuiestruturapersonalisada
                    ? info.estruturapersonalisada
                      ? info.estruturapersonalisada
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
                    ...info,
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
              editable={true}
              value={info.statuscontrato ? info.statuscontrato : "NÃO DEFINIDO"}
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
                setInfo({ ...info, statuscontrato: value })
              }
            />
            <SelectInput
              label={"Forma de assinatura"}
              value={info.formadeassinatura && "DIGITAL"}
              editable={true}
              options={[
                { label: "DIGITAL", value: "DIGITAL" },
                { label: "FISICO", value: "FISICO" },
              ]}
              handleChange={(value) =>
                setInfo({ ...info, formadeassinatura: value })
              }
            />
            {(info.statuscontrato != "AGUARDANDO SOLICITAÇÃO" ||
              info.statuscontrato != "NÃO DEFINIDO") && (
              <DateInput
                label={"Data de solicitação"}
                editable={true}
                value={
                  info.datasolicitacaocontrato != undefined &&
                  info.datasolicitacaocontrato != "-"
                    ? new Date(info.datasolicitacaocontrato)
                        .toISOString()
                        .slice(0, 10)
                    : 0
                }
                handleChange={(value) =>
                  setInfo({
                    ...info,
                    datasolicitacaocontrato: new Date(value),
                  })
                }
              />
            )}
            <DateInput
              label={"Data de liberação p/ assinatura"}
              editable={true}
              value={
                info.dataliberacaoassinatura != undefined &&
                info.dataliberacaoassinatura != "-"
                  ? new Date(info.dataliberacaoassinatura)
                      .toISOString()
                      .slice(0, 10)
                  : 0
              }
              handleChange={(value) =>
                setInfo({
                  ...info,
                  dataliberacaoassinatura: new Date(value),
                })
              }
            />
            <DateInput
              label={"Data de assinatura"}
              editable={true}
              value={
                info.dataassinatura != undefined && info.dataassinatura != "-"
                  ? new Date(info.dataassinatura).toISOString().slice(0, 10)
                  : 0
              }
              handleChange={(value) =>
                setInfo({
                  ...info,
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
                info.statuspagamento ? info.statuspagamento : "NÃO DEFINIDO"
              }
              editable={true}
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
                  ...info,
                  statuspagamento: value,
                })
              }
            />
            <SelectInput
              label={"FORMA DE PAGAMENTO"}
              value={info.formapagamento ? info.formapagamento : "NÃO DEFINIDO"}
              editable={true}
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
                  ...info,
                  formapagamento: value,
                })
              }
            />
            <SelectInput
              label={"EMPRESA A FATURAR"}
              value={
                info.empresafaturar != undefined && info.empresafaturar != "-"
                  ? info.empresafaturar
                  : "NÃO DEFINIDO"
              }
              editable={true}
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
                setInfo({ ...info, empresafaturar: value })
              }
            />
            <TextInput
              label={"Informações faturamento"}
              editable={true}
              value={info.previsaofaturamento ? info.previsaofaturamento : ""}
              handleChange={(value) =>
                setInfo({ ...info, previsaofaturamento: value })
              }
            />
            {info.formapagamento == "FINANCIAMENTO" && (
              <SelectInput
                label={"CREDOR"}
                value={
                  info.credor != undefined &&
                  info != "-----" &&
                  info != "QUAL CREDOR?"
                    ? info.credor
                    : "NÃO DEFINIDO"
                }
                editable={true}
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
                    ...info,
                    credor: value,
                  })
                }
              />
            )}
            <TextInput
              label={"Pagador"}
              editable={true}
              value={info.pagador ? info.pagador : ""}
              handleChange={(value) => setInfo({ ...info, pagador: value })}
            />
            <TextInput
              label={"Contato pagador"}
              editable={true}
              value={info.contatopagamento ? info.contatopagamento : ""}
              handleChange={(value) =>
                setInfo({ ...info, contatopagamento: value })
              }
            />
          </div>
        </div>
        <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
          <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
            Informações da compra
          </span>
          <div className="flex gap-2 justify-center flex-wrap">
            <div>
              <input
                disabled={false}
                checked={info.liberacaocompra === "LIBERADA" ? true : false}
                onChange={(e) =>
                  setInfo({
                    ...info,
                    liberacaocompra: e.target.checked ? "LIBERADA" : undefined,
                    dataliberacaoparacompra: e.target.checked
                      ? new Date()
                      : undefined,
                  })
                }
                type="checkbox"
                name="liberacaocompra"
                id="liberacaocompra"
              />
              <label className="ml-2" htmlFor="liberacaocompra">
                LIBERADA
              </label>
            </div>
            <DateInput
              label={"Data de liberação p/ compra"}
              editable={true}
              value={
                info.dataliberacaoparacompra != undefined &&
                info.dataliberacaoparacompra != "-"
                  ? new Date(info.dataliberacaoparacompra)
                      .toISOString()
                      .slice(0, 10)
                  : 0
              }
              handleChange={(value) =>
                setInfo({
                  ...info,
                  dataliberacaoparacompra: new Date(value),
                })
              }
            />
            <DateInput
              label={"Data do pagamento"}
              editable={true}
              value={
                info.datapagamento != undefined && info.datapagamento != "-"
                  ? new Date(info.datapagamento).toISOString().slice(0, 10)
                  : 0
              }
              handleChange={(value) =>
                setInfo({
                  ...info,
                  datapagamento: new Date(value),
                })
              }
            />
            <SelectInput
              label={"TIPO DO KIT"}
              value={
                info.tipokit != undefined && info.tipokit != "-"
                  ? info.tipokit
                  : "NÃO DEFINIDO"
              }
              editable={true}
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
              handleChange={(value) => setInfo({ ...info, tipokit: value })}
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
              editable={true}
              value={info.titulardoprojeto ? info.titulardoprojeto : ""}
              handleChange={(value) =>
                setInfo({ ...info, titulardoprojeto: value })
              }
            />
            <TextInput
              label={"Número da instalação"}
              value={info.numeroinstalacao ? info.numeroinstalacao : ""}
              editable={true}
              handleChange={(value) =>
                setInfo({ ...info, numeroinstalacao: value })
              }
            />
            <SelectInput
              label={"DISTRIBUIÇÃO DE CRÉDITOS"}
              value={
                info.distribuicaodecreditos
                  ? info.distribuicaodecreditos
                  : "NÃO DEFINIDO"
              }
              editable={true}
              options={[
                { label: "SIM", value: "SIM" },
                { label: "NÃO", value: "NÃO" },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) =>
                setInfo({ ...info, distribuicaodecreditos: value })
              }
            />
            {info.distribuicaodecreditos == "SIM" && (
              <NumberInput
                label={"QTDE DE DISTRIBUIÇÕES"}
                editable={true}
                value={
                  info.quantdistribuicoes != undefined &&
                  info.quantdistribuicoes != "-"
                    ? info.quantdistribuicoes
                    : 0
                }
                handleChange={(value) =>
                  setInfo({ ...info, quantdistribuicoes: value })
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
              editable={true}
              value={
                info.nmodulos != undefined && info.nmodulos != "-"
                  ? info.nmodulos
                  : 0
              }
              handleChange={(value) => setInfo({ ...info, nmodulos: value })}
            />
            <NumberInput
              unit={"W"}
              label={"POTÊNCIA DOS MÓDULOS"}
              editable={true}
              value={
                info.potmodulos != undefined && info.potmodulos != "-"
                  ? info.potmodulos
                  : 0
              }
              handleChange={(value) => setInfo({ ...info, potmodulos: value })}
            />
            <NumberInput
              unit={"kWp"}
              label={"POTÊNCIA PICO"}
              editable={true}
              value={
                info.potpico != undefined && info.potpico != "-"
                  ? info.potpico
                  : 0
              }
              handleChange={(value) => setInfo({ ...info, potpico: value })}
            />
            <SelectInput
              label={"TOPOLOGIA"}
              value={info.topologia ? info.topologia : "NÃO DEFINIDO"}
              editable={true}
              options={[
                { label: "INVERSOR", value: "INVERSOR" },
                { label: "MICRO", value: "MICRO" },
                { label: "OUTROS SERV.", value: "OUTROS SERV." },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) => setInfo({ ...info, topologia: value })}
            />
            <TextInput
              label={"QTDE E POTÊNCIA DO(S) INVERSOR(ES)"}
              editable={true}
              value={info.qtdepotinversor ? info.qtdepotinversor : ""}
              handleChange={(value) =>
                setInfo({ ...info, qtdepotinversor: value })
              }
            />
            <NumberInput
              tag={"R$"}
              label={"VALOR DO PROJETO"}
              editable={true}
              value={
                info.valorprojeto != undefined && info.valorprojeto != "-"
                  ? info.valorprojeto
                  : 0
              }
              handleChange={(value) =>
                setInfo({ ...info, valorprojeto: value })
              }
            />
            <SelectInput
              label={"INICIAR PROJETO"}
              value={info.iniciarprojeto ? info.iniciarprojeto : "NÃO DEFINIDO"}
              editable={true}
              options={[
                { label: "SIM", value: "SIM" },
                {
                  label: "CONTRATO CANCELADO",
                  value: "CONTRATO CANCELADO",
                },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) =>
                setInfo({ ...info, iniciarprojeto: value })
              }
            />
          </div>
        </div>
        <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
          <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
            PROJETO
          </span>
          <div className="flex gap-2 justify-center flex-wrap">
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                AUMENTO DE CARGA
              </span>
              <div className="flex">
                <input
                  disabled={false}
                  checked={info.aumentodecarga === "SIM" ? true : false}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      aumentodecarga: e.target.checked ? "SIM" : "NÃO",
                      acstatus:
                        e.target.checked && info.acstatus != "REALIZADO"
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
            {info.aumentodecarga == "SIM" && (
              <div className="flex flex-col w-[350px] items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">
                  STATUS AUMENTO DE CARGA
                </span>
                <div className="flex">
                  <input
                    disabled={false}
                    checked={info.acstatus === "REALIZADO" ? true : false}
                    onChange={(e) =>
                      setInfo({
                        ...info,
                        acstatus: e.target.checked ? "REALIZADO" : "PENDÊNCIA",
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
          </div>
        </div>
        <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
          <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
            Informações sobre a obra
          </span>
          <div className="flex gap-2 justify-center flex-wrap">
            <SelectInput
              label={"Laudo"}
              value={info.laudo ? info.laudo : "NÃO DEFINIDO"}
              editable={true}
              options={[
                { label: "EM ESTUDO", value: "EM ESTUDO" },
                { label: "EMITIDO", value: "EMITIDO" },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) => setInfo({ ...info, laudo: value })}
            />
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                SOLICITAÇÃO DA OBRA
              </span>
              <div className="flex">
                <input
                  disabled={false}
                  checked={info.solicitacaoobra === "SOLICITADA" ? true : false}
                  onChange={(e) =>
                    setInfo({
                      ...info,
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
              editable={true}
              value={
                info.entradanaobra != undefined && info.entradanaobra != "-"
                  ? new Date(info.entradanaobra).toISOString().slice(0, 10)
                  : 0
              }
              handleChange={(value) =>
                setInfo({ ...info, entradanaobra: value })
              }
            />
            <DateInput
              label={"SAIDA DE OBRA"}
              editable={true}
              value={
                info.saidadeobra != undefined && info.saidadeobra != "-"
                  ? new Date(info.saidadeobra).toISOString().slice(0, 10)
                  : 0
              }
              handleChange={(value) => setInfo({ ...info, saidadeobra: value })}
            />
            <SelectInput
              label={"EQUIPE RESPONSÁVEL"}
              editable={true}
              value={
                info.equipeexec != undefined && info.equipeexec != "-"
                  ? info.equipeexec == "TERCEIROS" ||
                    info.equipeexec == "TERCERIZADOS" ||
                    info.equipeexec == "OUTROS"
                    ? "OUTROS"
                    : info.equipeexec
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
              handleChange={(value) => setInfo({ ...info, equipeexec: value })}
            />
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                CHECKLIST OBRA
              </span>
              <div className="flex">
                <input
                  disabled={false}
                  checked={info.checklistobra === "SIM" ? true : false}
                  onChange={(e) =>
                    setInfo({
                      ...info,
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
                  disabled={false}
                  checked={info.trafo === "SIM" ? true : false}
                  onChange={(e) =>
                    setInfo({
                      ...info,
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
              value={info.statusobra ? info.statusobra : "NÃO DEFINIDO"}
              editable={true}
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
                readOnly={false}
                value={info.obsobra ? info.obsobra : ""}
                placeholder={"Observações da obra aqui..."}
                onChange={(e) => setInfo({ ...info, obsobra: e.target.value })}
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
                info.materialalmoxarifado
                  ? info.materialalmoxarifado
                  : "NÃO DEFINIDO"
              }
              editable={true}
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
                setInfo({ ...info, materialalmoxarifado: value })
              }
            />
            <NumberInput
              tag={"R$"}
              label={"Previsão de custos em insumos"}
              editable={true}
              value={
                info.prevcustosinsumos != undefined &&
                info.prevcustosinsumos != "#VALUE!"
                  ? info.prevcustosinsumos
                  : 0
              }
              handleChange={(value) =>
                setInfo({ ...info, prevcustosinsumos: value })
              }
            />
            <NumberInput
              tag={"R$"}
              label={"Custos em insumos"}
              editable={true}
              value={
                info.custosinsumos != undefined &&
                info.custosinsumos != "#VALUE!"
                  ? info.custosinsumos
                  : 0
              }
              handleChange={(value) =>
                setInfo({ ...info, custosinsumos: value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NovoProjeto;
