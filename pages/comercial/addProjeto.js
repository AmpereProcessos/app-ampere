import React, { useEffect, useState } from "react";
import { cities, cidadesAtendidas } from "../../utils/constants";
import NumberInput from "../../components/NumberInput";
import SelectInput from "../../components/SelectInput";
import TextInput from "../../components/TextInput";
import DateInput from "../../components/DateInput";
import { vendedores } from "../../utils/constants";
import { useRouter } from "next/router";
import axios from "axios";
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
const validation = {
  nomeDoContrato: {
    test(value) {
      return value.trim().length < 10;
    },
    msg: "Por favor, preencha um nome válido",
  },
  nomeDoProjeto: {
    test(value) {
      return value.trim().length < 2;
    },
    msg: "Por favor, preencha um nome válido",
  },
  vendedor: {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha o vendedor do projeto",
  },
  codigoSVB: {
    test(value) {
      return value == 0;
    },
    msg: "Por favor, preencha um código SVB válido",
  },
  cpf_cnpj: {
    test(value) {
      return value.toString().length < 10;
    },
    msg: "Por favor, preencha um CPF/CNPJ válido",
  },
  telefone: {
    test(value) {
      return value.toString().length < 9;
    },
    msg: "Por favor, preencha um Telefone válido",
  },
  linkDrive: {
    test(value) {
      return value.trim().length < 5;
    },
    msg: "Por favor, preencha o link da pasta no Drive do cliente",
  },
  "estruturaPersonaliza.tipo": {
    test(value) {
      return value == "N/A";
    },
    msg: "Por favor, preencha um tipo de estrutura válido",
  },
  "contrato.status": {
    test(value) {
      return value != "AGUARDANDO SOLICITAÇÃO" && value != "SOLICITADO";
    },
    msg: "Por favor, preencha um status válido de contrato",
  },
  "pagamento.forma": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha uma forma de pagamento",
  },
  "pagamento.pagador": {
    test(value) {
      return value.trim().length < 3;
    },
    msg: "Por favor, preencha o nome do pagador.",
  },
  "pagamento.contatoPagador": {
    test(value) {
      return value.trim().length < 9;
    },
    msg: "Por favor, preencha o contato do pagador.",
  },
  "compra.localEntrega": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha o local de entrega",
  },
  "compra.tipoDoKit": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha o tipo do kit",
  },
  "dadosCemig.titularProjeto": {
    test(value) {
      return value.trim().length < 5;
    },
    msg: "Por favor, digite o titular do projeto",
  },
  "dadosCemig.distCreditos": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha sobre a necessidade de dist. de créditos",
  },
  "sistema.qtdeModulos": {
    test(value) {
      return value == 0;
    },
    msg: "Por favor, preencha a quantidade de módulos",
  },
  "sistema.potModulos": {
    test(value) {
      return value == 0;
    },
    msg: "Por favor, preencha a potência dos módulos",
  },
  "sistema.topologia": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha uma topologia válida",
  },
  "sistema.inversor": {
    test(value) {
      return value.trim().length < 5;
    },
    msg: "Por favor, preencha informacoes sobre os micro/inversor",
  },
  "material.previsaoCustos": {
    test(value) {
      return value == 0;
    },
    msg: "Por favor, preencha um valor válido de previsão de custos de insumo",
  },
  "obra.laudo": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha o status do laudo",
  },
};
function NovoProjeto({ credentials, setCredentials }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const [infoHolder, setInfo] = useState({
    nomeDoContrato: "",
    nomeDoProjeto: "",
    cpf_cnpj: 0,
    telefone: "",
    cidade: "ITUIUTABA",
    possuiaGD: false,
    uf: "MG",
    vendedor: {
      nome: "NÃO DEFINIDO",
      codigo: 0,
    },
    linkDrive: "",
    regional: "REGIONAL ITUIUTABA",
    tipoDeServico: "SISTEMA FOTOVOLTAICO",
    codigoSVB: 0,
    segmento: "RESIDENCIAL",
    obsComercial: "",
    visitaTecnica: {
      status: "PENDÊNCIA",
      tecnico: "",
      saidaDoCliente: "",
      amperagem: "",
      tipoDaTelha: "",
    },
    padrao: {
      tipo: "NÃO DEFINIDO",
      respPagamento: "NÃO HAVERA TROCA PADRÃO",
      respInstalacao: "NÃO SE APLICA",
      valor: 0,
    },
    estruturaPersonalizada: {
      aplicavel: "NÃO",
      tipo: "N/A",
      respPagamento: "NÃO SE APLICA",
      valor: 0,
      status: "N/A",
    },
    contrato: {
      status: "NÃO DEFINIDO",
      dataSolicitacao: null, // formatar como data
      dataLiberacao: null, // formatar como data
      dataAssinatura: null, // formatar como data
      formaAssinatura: "NÃO DEFINIDO",
    },
    pagamento: {
      status: "NÃO DEFINIDO",
      forma: "NÃO DEFINIDO",
      credor: "NÃO DEFINIDO",
      pagador: "",
      contatoPagador: "",
      retorno: 0,
      cobrancaFeita: false,
    },
    faturamento: {
      previsaoFaturamento: 0, // adicionar empresa e cnpj de faturamento
      cnpjFaturamento: 0,
      empresaFaturamento: "NÃO DEFINIDO",
    },
    compra: {
      statusLiberacao: "NÃO DEFINIDO",
      dataLiberacao: undefined, // formatar como data
      tipoDoKit: "NÃO DEFINIDO",
      valorDoKit: 0,
      kitInfo: "",
      fornecedor: "NÃO DEFINIDO",
      dataPedido: undefined, // formatar como data
      dataPagamento: undefined,
      previsaoEntrega: undefined, // formatar como data
      localEntrega: "NÃO DEFINIDO",
      informacoes: "",
      previsaoNotaFiscal: undefined,
      rastreio: "",
      statusEntrega: "NÃO DEFINIDO",
    },
    dadosCemig: {
      titularProjeto: "",
      numeroInstalacao: "",
      distCreditos: "NÃO DEFINIDO",
      qtdeDistCreditos: 0,
    },
    sistema: {
      qtdeModulos: 0,
      potModulos: 0,
      potPico: 0,
      topologia: "NÃO DEFINIDO",
      inversor: "",
      valorProjeto: 0,
    },
    projeto: {
      iniciar: "NÃO DEFINIDO",
      projetista: {
        nome: "NÃO DEFINIDO",
        codigo: undefined,
      },
      dataLiberacaoDocumentacao: undefined, // formatar como data
      dataAssDocumentacao: undefined, // formatar como data
      diagramaUnifilar: undefined,
      desenhoTelhado: undefined,
      mapaDeMicro: undefined,
      aumentoDeCarga: "NÃO",
      acStatus: undefined,
      projetoConcluido: "NÃO",
      relatorioComissionamento: undefined,
    },
    parecer: {
      statusDoParecerDeAcesso: "NÃO DEFINIDO",
      dataParecerDeAcesso: undefined, // formatar como data
      parecerReprovado: "NÃO",
      qtdeReprovas: 0,
      motivoReprova: undefined,
    },
    vistoria: {
      dataPedido: undefined, // formatar como data
      status: "NÃO DEFINIDO",
      vistoriaReprovada: "NÃO",
      qtdeReprovas: 0,
      motivoReprova: undefined,
    },
    medidor: {
      data: undefined, // formatar como data
      status: "NÃO DEFINIDO",
    },
    obra: {
      laudo: "NÃO DEFINIDO",
      observacoes: "", // possibilidade de substituir \n por /, e quebrar textp em pontos
      statusSolicitacao: "NÃO SOLICITADA",
      entrada: undefined, // formatar como data
      saida: undefined, // formatar como data.
      statusDaObra: "NÃO DEFINIDO",
      equipeResp: "NÃO DEFINIDO",
      checklist: undefined,
      trafo: "NÃO",
      fotosInstalacao: undefined,
    },
    material: {
      statusSeparacao: "NÃO DEFINIDO",
      previsaoCustos: 0, // toFixed(2)
      efetivoCustos: 0,
      notaFiscal: undefined,
      materialFaltante: "",
    },
    manutencaoPreventiva: { status: "NÃO REALIZADO", data: null },
    relatorios: {
      envioUm: { status: "NÃO REALIZADO", data: null },
      envioDois: { status: "NÃO REALIZADO", data: null },
      envioTres: { status: "NÃO REALIZADO", data: null },
      envioQuatro: { status: "NÃO REALIZADO", data: null },
    },
    conferencias: {
      usinaLigada: { status: "NÃO REALIZADO", data: null },
      monitoramentoFeito: { status: "NÃO REALIZADO", data: null },
      energiaInjetada: { status: "NÃO REALIZADO", data: null },
    },
    app: {
      data: undefined,
      login: "",
      senha: "",
    },
    dataNascimento: undefined,
    email: "",
    logradouro: "",
    numeroResidencia: 0,
    bairro: "",
    cep: "",
    canalVenda: "NÃO DEFINIDO",
    indicacao: {
      quemIndicou: "", //add
      contato: "", //add
    },
    ondeTrabalha: "",
    jornada: {
      dataUltimoContato: undefined,
      boasVindas: false,
      assDocumentacoes: false,
      compraDoKit: false,
      nfFaturada: false,
      prevChegada: false,
      respConcessionaria: false,
      entregaDoKit: false,
      instalacaoAgendada: false,
      vistoriaConcessionaria: false,
      sistemaLigado: false,
      jornadaConcluida: false,
      dataNps: undefined,
    },
    nps: undefined,
  });
  function resetState() {
    setInfo({
      nomeDoContrato: "",
      nomeDoProjeto: "",
      cpf_cnpj: 0,
      telefone: "",
      cidade: "ITUIUTABA",
      uf: "MG",
      vendedor: {
        nome: "NÃO DEFINIDO",
        codigo: 0,
      },
      linkDrive: "",
      regional: "REGIONAL ITUIUTABA",
      tipoDeServico: "SISTEMA FOTOVOLTAICO",
      codigoSVB: 0,
      segmento: "RESIDENCIAL",
      obsComercial: "",
      visitaTecnica: {
        status: "PENDÊNCIA",
        tecnico: "",
        saidaDoCliente: "",
        amperagem: "",
        tipoDaTelha: "",
      },
      padrao: {
        tipo: "NÃO DEFINIDO",
        respPagamento: "NÃO HAVERA TROCA PADRÃO",
        respInstalacao: "NÃO SE APLICA",
        valor: 0,
      },
      estruturaPersonalizada: {
        aplicavel: "NÃO",
        tipo: "N/A",
        respPagamento: "NÃO SE APLICA",
        valor: 0,
        status: "N/A",
      },
      contrato: {
        status: "NÃO DEFINIDO",
        dataSolicitacao: null, // formatar como data
        dataLiberacao: null, // formatar como data
        dataAssinatura: null, // formatar como data
        formaAssinatura: "NÃO DEFINIDO",
      },
      pagamento: {
        status: "NÃO DEFINIDO",
        forma: "NÃO DEFINIDO",
        credor: "NÃO DEFINIDO",
        pagador: "",
        contatoPagador: "",
        retorno: 0,
        cobrancaFeita: false,
      },
      faturamento: {
        previsaoFaturamento: 0, // adicionar empresa e cnpj de faturamento
        cnpjFaturamento: 0,
        empresaFaturamento: "NÃO DEFINIDO",
      },
      compra: {
        statusLiberacao: "NÃO DEFINIDO",
        dataLiberacao: undefined, // formatar como data
        tipoDoKit: "NÃO DEFINIDO",
        valorDoKit: 0,
        kitInfo: "",
        fornecedor: "NÃO DEFINIDO",
        dataPedido: undefined, // formatar como data
        dataPagamento: undefined,
        previsaoEntrega: undefined, // formatar como data
        localEntrega: "NÃO DEFINIDO",
        informacoes: "",
        previsaoNotaFiscal: undefined,
        rastreio: "",
        statusEntrega: "NÃO DEFINIDO",
      },
      dadosCemig: {
        titularProjeto: "",
        numeroInstalacao: "",
        distCreditos: "NÃO DEFINIDO",
        qtdeDistCreditos: 0,
      },
      sistema: {
        qtdeModulos: 0,
        potModulos: 0,
        potPico: 0,
        topologia: "NÃO DEFINIDO",
        inversor: "",
        valorProjeto: 0,
      },
      projeto: {
        iniciar: "NÃO DEFINIDO",
        projetista: {
          nome: "NÃO DEFINIDO",
          codigo: undefined,
        },
        dataLiberacaoDocumentacao: undefined, // formatar como data
        dataAssDocumentacao: undefined, // formatar como data
        diagramaUnifilar: undefined,
        desenhoTelhado: undefined,
        mapaDeMicro: undefined,
        aumentoDeCarga: "NÃO",
        acStatus: undefined,
        projetoConcluido: "NÃO",
        relatorioComissionamento: undefined,
      },
      parecer: {
        statusDoParecerDeAcesso: "NÃO DEFINIDO",
        dataParecerDeAcesso: undefined, // formatar como data
        parecerReprovado: "NÃO",
        qtdeReprovas: 0,
        motivoReprova: undefined,
      },
      vistoria: {
        dataPedido: undefined, // formatar como data
        status: "NÃO DEFINIDO",
        vistoriaReprovada: "NÃO",
        qtdeReprovas: 0,
        motivoReprova: undefined,
      },
      medidor: {
        data: undefined, // formatar como data
        status: "NÃO DEFINIDO",
      },
      obra: {
        laudo: "NÃO DEFINIDO",
        observacoes: "", // possibilidade de substituir \n por /, e quebrar textp em pontos
        statusSolicitacao: "NÃO SOLICITADA",
        entrada: undefined, // formatar como data
        saida: undefined, // formatar como data.
        statusDaObra: "NÃO DEFINIDO",
        equipeResp: "NÃO DEFINIDO",
        checklist: undefined,
        trafo: "NÃO",
        fotosInstalacao: undefined,
      },
      material: {
        statusSeparacao: "NÃO DEFINIDO",
        previsaoCustos: 0, // toFixed(2)
        efetivoCustos: 0,
        notaFiscal: undefined,
        materialFaltante: "",
      },
      manutencaoPreventiva: { status: "NÃO REALIZADO", data: null },
      relatorios: {
        envioUm: { status: "NÃO REALIZADO", data: null },
        envioDois: { status: "NÃO REALIZADO", data: null },
        envioTres: { status: "NÃO REALIZADO", data: null },
        envioQuatro: { status: "NÃO REALIZADO", data: null },
      },
      conferencias: {
        usinaLigada: { status: "NÃO REALIZADO", data: null },
        monitoramentoFeito: { status: "NÃO REALIZADO", data: null },
        energiaInjetada: { status: "NÃO REALIZADO", data: null },
      },
      app: {
        data: undefined,
        login: "",
        senha: "",
      },
      dataNascimento: undefined,
      email: "",
      logradouro: "",
      numeroResidencia: 0,
      bairro: "",
      cep: "",
      canalVenda: "NÃO DEFINIDO",
      indicacao: {
        quemIndicou: "", //add
        contato: "", //add
      },
      ondeTrabalha: "",
      jornada: {
        dataUltimoContato: undefined,
        boasVindas: false,
        assDocumentacoes: false,
        compraDoKit: false,
        nfFaturada: false,
        prevChegada: false,
        respConcessionaria: false,
        entregaDoKit: false,
        instalacaoAgendada: false,
        vistoriaConcessionaria: false,
        sistemaLigado: false,
        jornadaConcluida: false,
        dataNps: undefined,
      },
      nps: undefined,
    });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("PPS")) {
        router.push("/");
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("PPS")) {
          router.push("/");
        }
      }
    }
  }, []);
  function addProject() {
    axios.post("/api/projects/add", infoHolder).then((res) => {
      setMsg("Projeto adicionado!");
      resetState();
    });
  }
  // adicionar quem indicou e contato de quem indicou
  function validateCreation() {
    var holder;
    Object.entries(infoHolder).forEach((entry) => {
      if (typeof entry[1] == "object") {
        let tag = entry[0];
        Object.keys(entry[1]).forEach((x) => {
          if (validation[`${tag}.${x}`] != undefined) {
            if (validation[`${tag}.${x}`].test(infoHolder[tag][x]) == true) {
              holder = true;
              setMsg(validation[`${tag}.${x}`].msg);
            }
          } else return;
        });
      } else {
        let tag = entry[0];
        if (validation[tag] != undefined) {
          if (validation[tag].test(infoHolder[tag]) == true) {
            holder = true;
            setMsg(validation[tag].msg);
          }
        }
      }
    });
    if (holder == undefined) {
      setMsg("");
      addProject();
    }
  }
  return (
    <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
      <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y-auto">
        <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
          <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
            Informações do cliente
          </span>
          <div className="flex gap-2 justify-around flex-wrap">
            <TextInput
              label={"Nome do contrato"}
              value={infoHolder.nomeDoContrato ? infoHolder.nomeDoContrato : ""}
              editable={true}
              handleChange={(value) => {
                setInfo({ ...infoHolder, nomeDoContrato: value.toUpperCase() });
              }}
            />
            <TextInput
              label={"Nome do Projeto"}
              value={infoHolder.nomeDoProjeto}
              editable={true}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  nomeDoProjeto: value.toUpperCase(),
                });
              }}
            />
            <TextInput
              label={"CPF/CNPJ"}
              editable={true}
              value={
                infoHolder.cpf_cnpj
                  ? formataCPF(infoHolder.cpf_cnpj.toString())
                  : "-"
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  cpf_cnpj: value,
                });
              }}
            />
            <TextInput
              label={"Telefone"}
              editable={true}
              value={infoHolder.telefone ? infoHolder.telefone : ""}
              handleChange={(value) => {
                setInfo({ ...infoHolder, telefone: value });
              }}
            />
            <SelectInput
              label={"Cidade"}
              editable={true}
              value={
                infoHolder.cidade ? infoHolder.cidade : cidadesAtendidas[0]
              }
              options={cidadesAtendidas.map((cidade) => {
                return { label: cidade, value: cidade };
              })}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  cidade: value,
                });
              }}
            />
            <TextInput
              label={"CEP"}
              editable={true}
              value={
                infoHolder.cep ? formataCEP(infoHolder.cep.toString()) : "-"
              }
              handleChange={(value) => {
                setInfo({ ...infoHolder, cep: value });
              }}
            />
            <TextInput
              label={"Logradouro"}
              editable={true}
              value={infoHolder.logradouro ? infoHolder.logradouro : ""}
              handleChange={(value) => {
                setInfo({ ...infoHolder, logradouro: value });
              }}
            />
            <TextInput
              label={"Bairro"}
              editable={true}
              value={infoHolder.bairro ? infoHolder.bairro : ""}
              handleChange={(value) => {
                setInfo({ ...infoHolder, bairro: value.toUpperCase() });
              }}
            />
            <NumberInput
              label={"Número da residência"}
              editable={true}
              value={
                infoHolder.numeroResidencia ? infoHolder.numeroResidencia : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  numeroResidencia: Number(value),
                });
              }}
            />
            <SelectInput
              label={"Regional"}
              editable={true}
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
              handleChange={(value) => {
                setInfo({ ...infoHolder, regional: value });
              }}
            />
            <TextInput
              label={"LINK PASTA DO DRIVE"}
              editable={true}
              value={infoHolder.linkDrive ? infoHolder.linkDrive : ""}
              handleChange={(value) => {
                setInfo({ ...infoHolder, linkDrive: value });
              }}
            />
            <NumberInput
              label={"CÓDIGO SBV"}
              editable={true}
              value={infoHolder.codigoSVB ? infoHolder.codigoSVB : 0}
              handleChange={(value) =>
                setInfo({ ...infoHolder, codigoSVB: value })
              }
            />
            <TextInput
              label={"EMAIL"}
              editable={true}
              value={infoHolder.email ? infoHolder.email : ""}
              handleChange={(value) => {
                setInfo({ ...infoHolder, email: value });
              }}
            />
            <SelectInput
              label={"Canal de venda"}
              value={
                infoHolder.canalVenda != undefined &&
                infoHolder.canalVenda != "-"
                  ? infoHolder.canalVenda
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
              handleChange={(value) => {
                setInfo({ ...infoHolder, canalVenda: value });
              }}
            />
            <div className="flex">
              <SelectInput
                label={"VENDEDOR"}
                value={
                  infoHolder.vendedor != undefined &&
                  infoHolder.vendedor.nome != "-"
                    ? infoHolder.vendedor.nome
                    : "NÃO DEFINIDO"
                }
                options={vendedores.map((vendedor) => {
                  return { label: vendedor.nome, value: vendedor.nome };
                })}
                editable={true}
                handleChange={(value) => {
                  setInfo({
                    ...infoHolder,
                    vendedor: {
                      ...infoHolder.vendedor,
                      nome: value,
                      codigo:
                        vendedores.filter(
                          (vendedor) => vendedor.nome == value
                        )[0].cod || "-",
                    },
                  });
                }}
              />
            </div>
            <SelectInput
              label={"SEGMENTO"}
              value={infoHolder.segmento}
              editable={true}
              options={[
                { label: "COMERCIAL", value: "COMERCIAL" },
                { label: "INDUSTRIAL", value: "INDUSTRIAL" },
                { label: "RESIDENCIAL", value: "RESIDENCIAL" },
                { label: "RURAL", value: "RURAL" },
              ]}
              handleChange={(value) => {
                setInfo({ ...infoHolder, segmento: value });
              }}
            />
            <TextInput
              label="TIPO DE SERVIÇO"
              value={infoHolder.tipoDeServico}
              editable={true}
              handleChange={(value) => {
                setInfo({ ...infoHolder, tipoDeServico: value });
              }}
            />
            <div>
              <input
                disabled={false}
                checked={infoHolder.possuiaGD ? true : false}
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    possuiaGD: e.target.checked,
                  });
                }}
                type="checkbox"
                name="possuiaGD"
                id="possuiaGD"
              />
              <label className="ml-2" htmlFor="possuiaGD">
                JÁ POSSUIA GD?
              </label>
            </div>
            <div>
              <input
                disabled={false}
                checked={infoHolder.oem?.aplicavel ? true : false}
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    oem: {
                      ...infoHolder.oem,
                      aplicavel: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="oemAplicavel"
                id="oemAplicavel"
              />
              <label className="ml-2" htmlFor="oemAplicavel">
                POSSUI O&M?
              </label>
            </div>
            {infoHolder.oem?.aplicavel && (
              <NumberInput
                label={"Duração O&M (anos)"}
                value={infoHolder.oem?.duracao ? infoHolder.oem?.duracao : 0}
                editable={true}
                handleChange={(value) =>
                  setInfo({
                    ...infoHolder,
                    oem: { ...infoHolder.oem, duracao: Number(value) },
                  })
                }
              />
            )}
            {infoHolder.oem?.aplicavel && (
              <NumberInput
                label={"QTDE de manutenções"}
                value={
                  infoHolder.oem?.qtdeManutencoes
                    ? infoHolder.oem?.qtdeManutencoes
                    : 0
                }
                editable={true}
                handleChange={(value) =>
                  setInfo({
                    ...infoHolder,
                    oem: { ...infoHolder.oem, qtdeManutencoes: Number(value) },
                  })
                }
              />
            )}
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
                checked={
                  infoHolder.visitaTecnica?.status === "REALIZADA"
                    ? true
                    : false
                }
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    visitaTecnica: {
                      ...infoHolder.visitaTecnica,
                      status: e.target.checked ? "REALIZADA" : "PENDÊNCIA",
                    },
                  });
                }}
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
              value={
                infoHolder.visitaTecnica.tecnico
                  ? infoHolder.visitaTecnica.tecnico
                  : ""
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  visitaTecnica: {
                    ...infoHolder.visitaTecnica,
                    tecnico: value.toUpperCase(),
                  },
                });
              }}
            />
            <TextInput
              label={"Tipo da telha"}
              editable={true}
              value={
                infoHolder.visitaTecnica?.tipoDaTelha
                  ? infoHolder.visitaTecnica?.tipoDaTelha
                  : ""
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  visitaTecnica: {
                    ...infoHolder.visitaTecnica,
                    tipoDaTelha: value.toUpperCase(),
                  },
                });
              }}
            />
          </div>
        </div>
        <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
          <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
            PADRÃO
          </span>
          <div className="flex gap-2 justify-center flex-wrap">
            <SelectInput
              label={"TIPO DO PADRÃO"}
              editable={true}
              value={
                infoHolder.padrao.tipo != undefined
                  ? infoHolder.padrao.tipo
                  : "NÃO DEFINIDO"
              }
              options={[
                {
                  label: "CONTRA A REDE",
                  value: "CONTRA A REDE",
                },
                {
                  label: "A FAVOR DA REDE",
                  value: "A FAVOR DA REDE",
                },
                {
                  label: "CONSTRUIR",
                  value: "CONSTRUIR",
                },
                {
                  label: "SUBESTAÇÃO",
                  value: "SUBESTAÇÃO",
                },
                {
                  label: "REFORMA DE PADRÃO",
                  value: "REFORMA DE PADRÃO",
                },
                {
                  label: "N/A",
                  value: "N/A",
                },
                {
                  label: "NÃO DEFINIDO",
                  value: "NÃO DEFINIDO",
                },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  padrao: { ...infoHolder.padrao, tipo: value },
                });
              }}
            />
            <SelectInput
              label={"PAGAMENTO DO PADRÃO"}
              editable={true}
              value={
                infoHolder.padrao?.respPagamento ==
                  "NÃO HAVERA TROCA DE PADRÃO" ||
                infoHolder.padrao?.respPagamento == undefined
                  ? "NÃO HAVERA TROCA PADRÃO"
                  : infoHolder.padrao?.respPagamento
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  padrao: { ...infoHolder.padrao, respPagamento: value },
                });
              }}
            />
            <NumberInput
              tag={"R$"}
              label={"Valor do padrão"}
              editable={true}
              value={infoHolder.padrao.valor ? infoHolder.padrao.valor : 0}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  padrao: { ...infoHolder.padrao, valor: Number(value) },
                });
              }}
            />
            <SelectInput
              label={"RESPONSÁVEL INSTALAÇÃO DO PADRÃO"}
              editable={true}
              value={
                infoHolder.padrao?.respInstalacao
                  ? infoHolder.padrao?.respInstalacao
                  : "NÃO SE APLICA"
              }
              options={[
                { label: "AMPERE", value: "AMPERE" },
                { label: "CLIENTE", value: "CLIENTE" },
                { label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  padrao: { ...infoHolder.padrao, respInstalacao: value },
                });
              }}
            />
            <SelectInput
              label={"Saída do cliente"}
              editable={true}
              value={
                infoHolder.visitaTecnica.saidaDoCliente
                  ? infoHolder.visitaTecnica.saidaDoCliente
                  : "N/A"
              }
              options={[
                { label: "SUBTERRANEO", value: "SUBTERRANEO" },
                { label: "AEREO", value: "AEREO" },
                { label: "N/A", value: "N/A" },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  visitaTecnica: {
                    ...infoHolder.visitaTecnica,
                    saidaDoCliente: value,
                  },
                });
              }}
            />
            <TextInput
              label={"Amperagem"}
              editable={true}
              value={
                infoHolder.visitaTecnica?.amperagem
                  ? infoHolder.visitaTecnica.amperagem
                  : ""
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  visitaTecnica: {
                    ...infoHolder.visitaTecnica,
                    amperagem: value,
                  },
                });
              }}
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
                  infoHolder.estruturaPersonalizada?.aplicavel === "SIM"
                    ? true
                    : false
                }
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    estruturaPersonalizada: {
                      ...infoHolder.estruturaPersonalizada,
                      aplicavel: e.target.checked ? "SIM" : "NÃO",
                    },
                  });
                }}
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
              value={
                infoHolder.estruturaPersonalizada?.tipo
                  ? infoHolder.estruturaPersonalizada?.tipo
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  estruturaPersonalizada: {
                    ...infoHolder.estruturaPersonalizada,
                    tipo: value,
                  },
                });
              }}
            />
            <SelectInput
              label={"PAGAMENTO DA ESTRUTURA"}
              editable={true}
              value={
                infoHolder.estruturaPersonalizada?.respPagamento
                  ? infoHolder.estruturaPersonalizada?.respPagamento
                  : "NÃ SE APLICA"
              }
              options={[
                { label: "AMPERE", value: "AMPERE" },
                { label: "CLIENTE", value: "CLIENTE" },
                { label: "NÃO SE APLICA", value: "NÃ SE APLICA" },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  estruturaPersonalizada: {
                    ...infoHolder.estruturaPersonalizada,
                    respPagamento: value,
                  },
                });
              }}
            />
            <NumberInput
              tag={"R$"}
              label={"Valor da estrutura"}
              editable={true}
              value={
                infoHolder.estruturaPersonalizada?.valor == "-" ||
                infoHolder.estruturaPersonalizada?.valor == undefined
                  ? 0
                  : infoHolder.estruturaPersonalizada?.valor
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  estruturaPersonalizada: {
                    ...infoHolder.estruturaPersonalizada,
                    valor: Number(value),
                  },
                });
              }}
            />
            {infoHolder.estruturaPersonalizada.aplicavel == "SIM" && (
              <SelectInput
                label={"STATUS da estrutura personalizada"}
                editable={true}
                value={
                  infoHolder.estruturaPersonalizada.aplicavel
                    ? infoHolder.estruturaPersonalizada.status
                      ? infoHolder.estruturaPersonalizada.status
                      : "N/A"
                    : "N/A"
                }
                options={[
                  { label: "PRONTA", value: "PRONTA" },
                  { label: "PENDÊNCIA", value: "PENDÊNCIA" },
                  { label: "N/A", value: "N/A" },
                ]}
                handleChange={(value) => {
                  setInfo({
                    ...infoHolder,
                    estruturaPersonalizada: {
                      ...infoHolder.estruturaPersonalizada,
                      status: value,
                    },
                  });
                }}
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
              value={
                infoHolder.contrato.status
                  ? infoHolder.contrato.status
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  contrato: {
                    ...infoHolder.contrato,
                    status: value,
                  },
                });
              }}
            />
            {(infoHolder.contrato.status != "AGUARDANDO SOLICITAÇÃO" ||
              infoHolder.contrato.status != "NÃO DEFINIDO") && (
              <DateInput
                label={"Data de solicitação"}
                editable={true}
                value={
                  infoHolder.contrato.dataSolicitacao != undefined &&
                  infoHolder.contrato.dataSolicitacao != "-"
                    ? new Date(infoHolder.contrato.dataSolicitacao)
                        .toISOString()
                        .slice(0, 10)
                    : 0
                }
                handleChange={(value) => {
                  setInfo({
                    ...infoHolder,
                    contrato: {
                      ...infoHolder.contrato,
                      dataSolicitacao: new Date(value).toISOString(),
                    },
                  });
                }}
              />
            )}
            <DateInput
              label={"Data de liberação p/ assinatura"}
              editable={true}
              value={
                infoHolder.contrato.dataLiberacao != undefined &&
                infoHolder.contrato.dataLiberacao != "-"
                  ? new Date(infoHolder.contrato.dataLiberacao)
                      .toISOString()
                      .slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  contrato: {
                    ...infoHolder.contrato,
                    dataLiberacao: new Date(value).toISOString(),
                  },
                });
              }}
            />
            <DateInput
              label={"Data de assinatura"}
              editable={true}
              value={
                infoHolder.contrato.dataAssinatura != undefined &&
                infoHolder.contrato.dataAssinatura != "-"
                  ? new Date(infoHolder.contrato.dataAssinatura)
                      .toISOString()
                      .slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  contrato: {
                    ...infoHolder.contrato,
                    dataAssinatura: new Date(value).toISOString(),
                  },
                });
              }}
            />
            <SelectInput
              label={"FORMA DE ASSINATURA"}
              value={
                infoHolder.contrato.formaAssinatura
                  ? infoHolder.contrato.formaAssinatura
                  : "NÃO DEFINIDO"
              }
              editable={true}
              options={[
                {
                  label: "FISICO",
                  value: "FISICO",
                },
                {
                  label: "DIGITAL",
                  value: "DIGITAL",
                },
                {
                  label: "NÃO DEFINIDO",
                  value: "NÃO DEFINIDO",
                },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  contrato: {
                    ...infoHolder.contrato,
                    formaAssinatura: value,
                  },
                });
              }}
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
                infoHolder.pagamento.status
                  ? infoHolder.pagamento.status
                  : "NÃO DEFINIDO"
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  pagamento: {
                    ...infoHolder.pagamento,
                    status: value,
                  },
                });
              }}
            />
            <SelectInput
              label={"FORMA DE PAGAMENTO"}
              value={
                infoHolder.pagamento?.forma
                  ? infoHolder.pagamento?.forma
                  : "NÃO DEFINIDO"
              }
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  pagamento: {
                    ...infoHolder.pagamento,
                    forma: value,
                  },
                });
              }}
            />
            <SelectInput
              label={"EMPRESA A FATURAR"}
              value={
                infoHolder.faturamento?.empresaFaturamento != undefined &&
                infoHolder.faturamento?.empresaFaturamento != "-"
                  ? infoHolder.faturamento?.empresaFaturamento
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  faturamento: {
                    ...infoHolder.faturamento,
                    empresaFaturamento: value,
                  },
                });
              }}
            />
            <TextInput
              label={"Informações faturamento"}
              editable={true}
              value={
                infoHolder.faturamento?.previsaoFaturamento
                  ? infoHolder.faturamento?.previsaoFaturamento
                  : ""
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  faturamento: {
                    ...infoHolder.faturamento,
                    previsaoFaturamento: value,
                  },
                });
              }}
            />
            {infoHolder.pagamento?.forma == "FINANCIAMENTO" && (
              <SelectInput
                label={"CREDOR"}
                value={
                  infoHolder.pagamento.credor != undefined &&
                  infoHolder.pagamento.credor != "-----" &&
                  infoHolder.pagamento.credor != "QUAL CREDOR?"
                    ? infoHolder.pagamento.credor
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
                handleChange={(value) => {
                  setInfo({
                    ...infoHolder,
                    pagamento: {
                      ...infoHolder.pagamento,
                      credor: value,
                    },
                  });
                }}
              />
            )}
            <TextInput
              label={"Pagador"}
              editable={true}
              value={
                infoHolder.pagamento?.pagador
                  ? infoHolder.pagamento.pagador
                  : ""
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  pagamento: {
                    ...infoHolder.pagamento,
                    pagador: value.toUpperCase(),
                  },
                });
              }}
            />
            <TextInput
              label={"Contato pagador"}
              editable={true}
              value={
                infoHolder.pagamento?.contatoPagador
                  ? infoHolder.pagamento?.contatoPagador
                  : ""
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  pagamento: {
                    ...infoHolder.pagamento,
                    contatoPagador: value.toUpperCase(),
                  },
                });
              }}
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
              editable={true}
              value={
                infoHolder.compra?.dataLiberacao != undefined &&
                infoHolder.compra?.dataLiberacao != "-"
                  ? new Date(infoHolder.compra.dataLiberacao)
                      .toISOString()
                      .slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  compra: {
                    ...infoHolder.compra,
                    dataLiberacao: new Date(value).toISOString(),
                  },
                });
              }}
            />
            <DateInput
              label={"Data do pagamento"}
              editable={true}
              value={
                infoHolder.compra?.dataPagamento != undefined &&
                infoHolder.compra?.dataPagamento != "-"
                  ? new Date(infoHolder.compra?.dataPagamento)
                      .toISOString()
                      .slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  compra: {
                    ...infoHolder.compra,
                    dataPagamento: new Date(value).toISOString(),
                  },
                });
              }}
            />
            <SelectInput
              label={"Fornecedor"}
              editable={true}
              value={
                infoHolder.compra?.fornecedor != undefined &&
                infoHolder.compra.fornecedor != "-"
                  ? infoHolder.compra.fornecedor
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  compra: {
                    ...infoHolder.compra,
                    fornecedor: value,
                  },
                });
              }}
            />
            <SelectInput
              label={"TIPO DO KIT"}
              value={
                infoHolder.compra?.tipoDoKit != undefined &&
                infoHolder.compra.tipoDoKit != "-"
                  ? infoHolder.compra.tipoDoKit
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  compra: {
                    ...infoHolder.compra,
                    tipoDoKit: value,
                  },
                });
              }}
            />
            <NumberInput
              tag={"R$"}
              label={"VALOR DO KIT"}
              editable={true}
              value={
                infoHolder.compra?.valorDoKit != undefined &&
                infoHolder.compra?.valorDoKit != "-"
                  ? infoHolder.compra?.valorDoKit
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  compra: {
                    ...infoHolder.compra,
                    valorDoKit: Number(value),
                  },
                });
              }}
            />
            <SelectInput
              label={"LOCAL DE ENTREGA"}
              value={
                infoHolder.compra?.localEntrega != undefined &&
                infoHolder.compra?.localEntrega != "-"
                  ? infoHolder.compra?.localEntrega
                  : "NÃO DEFINIDO"
              }
              editable={true}
              options={[
                { label: "MESMO DO PROJETO", value: "MESMO DO PROJETO" },
                { label: "SEM RESTRIÇÕES", value: "SEM RESTRIÇÕES" },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  compra: {
                    ...infoHolder.compra,
                    localEntrega: value,
                  },
                });
              }}
            />
            <TextInput
              label={"INFORMAÇÕES"}
              value={
                infoHolder.compra?.informacoes
                  ? infoHolder.compra?.informacoes
                  : ""
              }
              editable={true}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  compra: {
                    ...infoHolder.compra,
                    informacoes: value.toUpperCase(),
                  },
                });
              }}
            />
            <SelectInput
              label={"STATUS DA ENTREGA"}
              editable={true}
              value={
                infoHolder.compra?.statusEntrega
                  ? infoHolder.compra?.statusEntrega
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  compra: {
                    ...infoHolder.compra,
                    statusEntrega: value,
                  },
                });
              }}
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
              value={
                infoHolder.dadosCemig?.titularProjeto
                  ? infoHolder.dadosCemig?.titularProjeto
                  : ""
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  dadosCemig: {
                    ...infoHolder.dadosCemig,
                    titularProjeto: value,
                  },
                });
              }}
            />
            <TextInput
              label={"Número da instalação"}
              value={
                infoHolder.dadosCemig?.numeroInstalacao
                  ? infoHolder.dadosCemig?.numeroInstalacao
                  : ""
              }
              editable={true}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  dadosCemig: {
                    ...infoHolder.dadosCemig,
                    numeroInstalacao: value,
                  },
                });
              }}
            />
            <SelectInput
              label={"DISTRIBUIÇÃO DE CRÉDITOS"}
              value={
                infoHolder.dadosCemig?.distCreditos
                  ? infoHolder.dadosCemig?.distCreditos
                  : "NÃO DEFINIDO"
              }
              editable={true}
              options={[
                { label: "SIM", value: "SIM" },
                { label: "NÃO", value: "NÃO" },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  dadosCemig: {
                    ...infoHolder.dadosCemig,
                    distCreditos: value,
                  },
                });
              }}
            />
            {infoHolder.dadosCemig?.distCreditos == "SIM" && (
              <NumberInput
                label={"QTDE DE DISTRIBUIÇÕES"}
                editable={true}
                value={
                  infoHolder.dadosCemig?.qtdeDistCreditos != undefined &&
                  infoHolder.dadosCemig?.qtdeDistCreditos != "-"
                    ? infoHolder.dadosCemig?.qtdeDistCreditos
                    : 0
                }
                handleChange={(value) => {
                  setInfo({
                    ...infoHolder,
                    dadosCemig: {
                      ...infoHolder.dadosCemig,
                      qtdeDistCreditos: Number(value),
                    },
                  });
                }}
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
                infoHolder.sistema?.qtdeModulos != undefined &&
                infoHolder.sistema?.qtdeModulos != "-"
                  ? infoHolder.sistema?.qtdeModulos
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  sistema: {
                    ...infoHolder.sistema,
                    qtdeModulos: Number(value),
                    potPico:
                      Number(infoHolder.sistema?.potModulos * value) / 1000,
                  },
                });
              }}
            />
            <NumberInput
              unit={"W"}
              label={"POTÊNCIA DOS MÓDULOS"}
              editable={true}
              value={
                infoHolder.sistema?.potModulos != undefined &&
                infoHolder.sistema?.potModulos != "-"
                  ? infoHolder.sistema?.potModulos
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  sistema: {
                    ...infoHolder.sistema,
                    potModulos: Number(value),
                    potPico:
                      Number(value * infoHolder.sistema?.qtdeModulos) / 1000,
                  },
                });
              }}
            />
            <NumberInput
              unit={"kWp"}
              label={"POTÊNCIA PICO"}
              editable={true}
              value={
                infoHolder.sistema?.potPico != undefined &&
                infoHolder.sistema?.potPico != "-"
                  ? infoHolder.sistema?.potPico
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  sistema: {
                    ...infoHolder.sistema,
                    potPico: Number(value),
                  },
                });
              }}
            />
            <SelectInput
              label={"TOPOLOGIA"}
              value={
                infoHolder.sistema?.topologia
                  ? infoHolder.sistema?.topologia
                  : "NÃO DEFINIDO"
              }
              editable={true}
              options={[
                { label: "INVERSOR", value: "INVERSOR" },
                { label: "MICRO", value: "MICRO" },
                { label: "OUTROS SERV.", value: "OUTROS SERV." },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  sistema: {
                    ...infoHolder.sistema,
                    topologia: value,
                  },
                });
              }}
            />
            <TextInput
              label={"QTDE E POTÊNCIA DO(S) INVERSOR(ES)"}
              editable={true}
              value={
                infoHolder.sistema?.inversor ? infoHolder.sistema?.inversor : ""
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  sistema: {
                    ...infoHolder.sistema,
                    inversor: value,
                  },
                });
              }}
            />
            <NumberInput
              tag={"R$"}
              label={"VALOR DO PROJETO"}
              editable={true}
              value={
                infoHolder.sistema?.valorProjeto != undefined &&
                infoHolder.sistema?.valorProjeto != "-"
                  ? infoHolder.sistema?.valorProjeto
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  sistema: {
                    ...infoHolder.sistema,
                    valorProjeto: Number(value),
                  },
                });
              }}
            />
            <SelectInput
              label={"INICIAR PROJETO"}
              value={
                infoHolder.projeto?.iniciar
                  ? infoHolder.projeto?.iniciar
                  : "NÃO DEFINIDO"
              }
              editable={true}
              options={[
                { label: "SIM", value: "SIM" },
                {
                  label: "CONTRATO CANCELADO",
                  value: "CONTRATO CANCELADO",
                },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  projeto: {
                    ...infoHolder.projeto,
                    iniciar: value,
                  },
                });
              }}
            />
          </div>
        </div>
        <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
          <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
            PROJETO
          </span>
          <div className="flex gap-2 justify-center flex-wrap">
            <DateInput
              label={"Data de assinatura da documentação"}
              editable={true}
              value={
                infoHolder.projeto?.dataAssDocumentacao != undefined &&
                infoHolder.projeto?.dataAssDocumentacao != "-"
                  ? new Date(infoHolder.projeto.dataAssDocumentacao)
                      .toISOString()
                      .slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  projeto: {
                    ...infoHolder.projeto,
                    dataAssDocumentacao: new Date(value).toISOString(),
                  },
                });
              }}
            />
            <DateInput
              label={"Parecer de acesso"}
              editable={true}
              value={
                infoHolder.parecer?.dataParecerDeAcesso != undefined &&
                infoHolder.parecer?.dataParecerDeAcesso != "-"
                  ? new Date(infoHolder.parecer?.dataParecerDeAcesso)
                      .toISOString()
                      .slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  parecer: {
                    ...infoHolder.parecer,
                    dataParecerDeAcesso: new Date(value).toISOString(),
                  },
                });
              }}
            />
            <SelectInput
              label={"Status do parecer de acesso"}
              value={
                infoHolder.parecer?.statusDoParecerDeAcesso
                  ? infoHolder.parecer?.statusDoParecerDeAcesso
                  : "NÃO DEFINIDO"
              }
              editable={true}
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  parecer: {
                    ...infoHolder.parecer,
                    statusDoParecerDeAcesso: value,
                  },
                });
              }}
            />
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                DIAGRAMA UNIFILAR
              </span>
              <div className="flex">
                <input
                  disabled={false}
                  checked={
                    infoHolder.projeto?.diagramaUnifilar === "Ok" ? true : false
                  }
                  onChange={(e) => {
                    setInfo({
                      ...infoHolder,
                      projeto: {
                        ...infoHolder.projeto,
                        diagramaUnifilar: e.target.checked ? "Ok" : "PENDÊNCIA",
                      },
                    });
                  }}
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
                  disabled={false}
                  checked={
                    infoHolder.projeto?.desenhoTelhado === "OK" ? true : false
                  }
                  onChange={(e) => {
                    setInfo({
                      ...infoHolder,
                      projeto: {
                        ...infoHolder.projeto,
                        desenhoTelhado: e.target.checked ? "OK" : "PENDÊNCIA",
                      },
                    });
                  }}
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
              editable={true}
              value={
                infoHolder.projeto?.mapaDeMicro != undefined &&
                infoHolder.projeto?.mapaDeMicro != "-"
                  ? infoHolder.projeto?.mapaDeMicro
                  : "NÃO DEFINIDO"
              }
              options={[
                { label: "OK", value: "OK" },
                { label: `N\A`, value: `N\A` },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  projeto: {
                    ...infoHolder.projeto,
                    mapaDeMicro: value,
                  },
                });
              }}
            />
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                AUMENTO DE CARGA
              </span>
              <div className="flex">
                <input
                  disabled={false}
                  checked={
                    infoHolder.projeto?.aumentoDeCarga === "SIM" ? true : false
                  }
                  onChange={(e) => {
                    setInfo({
                      ...infoHolder,
                      projeto: {
                        ...infoHolder.projeto,
                        aumentoDeCarga: e.target.checked ? "SIM" : "NÃO",
                        acStatus:
                          e.target.checked && infoHolder.acstatus != "REALIZADO"
                            ? "PÊNDENCIA"
                            : undefined,
                      },
                    });
                  }}
                  type="checkbox"
                  name="aumentodecarga"
                  id="aumentodecarga"
                />
                <label className="ml-2" htmlFor="aumentodecarga">
                  SIM
                </label>
              </div>
            </div>
            {infoHolder.projeto?.aumentoDeCarga == "SIM" && (
              <div className="flex flex-col w-[350px] items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">
                  STATUS AUMENTO DE CARGA
                </span>
                <div className="flex">
                  <input
                    disabled={false}
                    checked={
                      infoHolder.projeto?.acStatus === "REALIZADO"
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      setInfo({
                        ...infoHolder,
                        projeto: {
                          ...infoHolder.projeto,
                          acStatus: e.target.checked
                            ? "REALIZADO"
                            : "PENDÊNCIA",
                        },
                      });
                    }}
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
              editable={true}
              value={
                infoHolder.vistoria?.dataPedido != undefined &&
                infoHolder.vistoria?.dataPedido != "-"
                  ? new Date(infoHolder.vistoria.dataPedido)
                      .toISOString()
                      .slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  vistoria: {
                    ...infoHolder.vistoria,
                    dataPedido: new Date(value).toISOString(),
                  },
                });
              }}
            />
            <SelectInput
              label={"STATUS DA VISTORIA"}
              value={
                infoHolder.vistoria?.status
                  ? infoHolder.vistoria?.status
                  : "NÃO DEFINIDO"
              }
              editable={true}
              options={[
                { label: "REALIZADA", value: "REALIZADA" },
                {
                  label: "AGUARDANDO OBRA DE REDE",
                  value: "AGUARDANDO OBRA DE REDE",
                },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  vistoria: {
                    ...infoHolder.vistoria,
                    status: value,
                  },
                });
              }}
            />
            <DateInput
              label={"DATA TROCA DO MEDIDOR"}
              editable={true}
              value={
                infoHolder.medidor?.data != undefined &&
                infoHolder.medidor?.data != "-"
                  ? new Date(infoHolder.medidor.data).toISOString().slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  medidor: {
                    ...infoHolder.medidor,
                    data: new Date(value).toISOString(),
                  },
                });
              }}
            />
            <SelectInput
              label={"STATUS DA TROCA DO MEDIDOR"}
              value={
                infoHolder.medidor?.status
                  ? infoHolder.medidor?.status
                  : "NÃO DEFINIDO"
              }
              editable={true}
              options={[
                { label: "REALIZADA", value: "REALIZADA" },
                {
                  label: "AGUARDANDO OBRA DE REDE",
                  value: "AGUARDANDO OBRA DE REDE",
                },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  medidor: {
                    ...infoHolder.medidor,
                    status: value,
                  },
                });
              }}
            />
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                PROJETO CONCLUÍDO
              </span>
              <div className="flex">
                <input
                  disabled={false}
                  checked={
                    infoHolder.projeto?.projetoConcluido === "SIM"
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    setInfo({
                      ...infoHolder,
                      projeto: {
                        ...infoHolder.projeto,
                        projetoConcluido: e.target.checked ? "SIM" : "NÃO",
                      },
                    });
                  }}
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
              value={
                infoHolder.obra?.laudo ? infoHolder.obra?.laudo : "NÃO DEFINIDO"
              }
              editable={true}
              options={[
                { label: "EM ESTUDO", value: "EM ESTUDO" },
                { label: "EMITIDO", value: "EMITIDO" },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  obra: {
                    ...infoHolder.obra,
                    laudo: value,
                  },
                });
              }}
            />
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                SOLICITAÇÃO DA OBRA
              </span>
              <div className="flex">
                <input
                  disabled={false}
                  checked={
                    infoHolder.obra?.statusSolicitacao === "SOLICITADA"
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        statusSolicitacao: e.target.checked
                          ? "SOLICITADA"
                          : "NÃO SOLICITADA",
                      },
                    });
                  }}
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
                infoHolder.obra?.entrada != undefined &&
                infoHolder.obra?.entrada != "-"
                  ? new Date(infoHolder.obra?.entrada)
                      .toISOString()
                      .slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  obra: {
                    ...infoHolder.obra,
                    entrada: new Date(value).toISOString(),
                  },
                });
              }}
            />
            <DateInput
              label={"SAIDA DE OBRA"}
              editable={true}
              value={
                infoHolder.obra?.saida != undefined &&
                infoHolder.obra?.saida != "-"
                  ? new Date(infoHolder.obra?.saida).toISOString().slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  obra: {
                    ...infoHolder.obra,
                    saida: new Date(value).toISOString(),
                  },
                });
              }}
            />
            <SelectInput
              label={"EQUIPE RESPONSÁVEL"}
              editable={true}
              value={
                infoHolder.obra?.equipeResp != undefined &&
                infoHolder.obra?.equipeResp != "-"
                  ? infoHolder.obra?.equipeResp == "TERCEIROS" ||
                    infoHolder.obra?.equipeResp == "TERCERIZADOS" ||
                    infoHolder.obra?.equipeResp == "OUTROS"
                    ? "OUTROS"
                    : infoHolder.obra?.equipeResp
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  obra: {
                    ...infoHolder.obra,
                    equipeResp: value,
                  },
                });
              }}
            />
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                CHECKLIST OBRA
              </span>
              <div className="flex">
                <input
                  disabled={false}
                  checked={infoHolder.obra?.checklist === "SIM" ? true : false}
                  onChange={(e) => {
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        checklist: e.target.checked ? "SIM" : "NÃO",
                      },
                    });
                  }}
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
                  checked={infoHolder.obra?.trafo === "SIM" ? true : false}
                  onChange={(e) => {
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        trafo: e.target.checked ? "SIM" : "NÃO",
                      },
                    });
                  }}
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
                infoHolder.obra?.statusDaObra
                  ? infoHolder.obra?.statusDaObra
                  : "NÃO DEFINIDO"
              }
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  obra: {
                    ...infoHolder.obra,
                    statusDaObra: value,
                  },
                });
              }}
            />
          </div>
          <div className="flex flex-col w-[450px] self-center mt-2 items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">
              OBSERVAÇÕES
            </span>
            <textarea
              readOnly={false}
              value={
                infoHolder.obra?.observacoes ? infoHolder.obra.observacoes : ""
              }
              placeholder={"Observações da obra aqui..."}
              onChange={(e) => {
                setInfo({
                  ...infoHolder,
                  obra: {
                    ...infoHolder.obra,
                    observacoes: e.target.value,
                  },
                });
              }}
              className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
            />
          </div>
          <div className="w-full flex items-center justify-center gap-x-4">
            <div className="flex flex-col w-[450px] self-center mt-2 items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                INFORMAÇÕES DO KIT
              </span>
              <textarea
                readOnly={false}
                value={
                  infoHolder.compra?.kitInfo ? infoHolder.compra?.kitInfo : ""
                }
                placeholder={"Observações do material aqui..."}
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    compra: {
                      ...infoHolder.compra,
                      kitInfo: e.target.value,
                    },
                  });
                }}
                className="w-full mb-2 text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
              />
            </div>
            <div className="flex flex-col w-[450px] self-center mt-2 items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                MATERIAL FALTANTE
              </span>
              <textarea
                readOnly={false}
                value={
                  infoHolder.material?.materialFaltante
                    ? infoHolder.material?.materialFaltante
                    : ""
                }
                placeholder={"Observações do material aqui..."}
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    material: {
                      ...infoHolder.material,
                      materialFaltante: e.target.value,
                    },
                  });
                }}
                className="w-full mb-2 text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
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
                infoHolder.material?.statusSeparacao
                  ? infoHolder.material?.statusSeparacao
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
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  material: {
                    ...infoHolder.material,
                    statusSeparacao: value,
                  },
                });
              }}
            />
            <NumberInput
              tag={"R$"}
              label={"Previsão de custos em insumos"}
              editable={true}
              value={
                infoHolder.material?.previsaoCustos != undefined &&
                infoHolder.material?.previsaoCustos != "#VALUE!"
                  ? infoHolder.material?.previsaoCustos
                  : 0
              }
              handleChange={(value) => {
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
              editable={true}
              value={
                infoHolder.material?.efetivoCustos != undefined &&
                infoHolder.material?.efetivoCustos != "#VALUE!"
                  ? infoHolder.material?.efetivoCustos
                  : 0
              }
              handleChange={(value) => {
                setInfo({
                  ...infoHolder,
                  material: {
                    ...infoHolder.material,
                    efetivoCustos: Number(value),
                  },
                });
              }}
            />
          </div>
        </div>
        {msg && <p className="italic text-center text-red-500">{msg}</p>}
        <div className="w-full flex items-center justify-center">
          <button
            className="p-2 my-2 bg-[#fead61] rounded font-bold hover:bg-[#15599a] hover:text-white"
            onClick={validateCreation}
          >
            ADICIONAR PROJETO
          </button>
        </div>
      </div>
    </div>
  );
}

export default NovoProjeto;
