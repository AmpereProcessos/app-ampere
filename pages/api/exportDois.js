import connectToDatabase from "../../utils/connectDb";
function fixDate(value) {
  if (isNaN(Date.parse(value)) == true) {
    return "-";
  } else {
    return new Date(value).toLocaleDateString("pt-br");
  }
}
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection.find({}).sort({ qtde: 1 }).skip(1000).toArray();
    let newArr = arr.map((obj) => {
      return {
        qtde: obj.qtde ? obj.qtde : "-",
        nomeDoContrato: obj.nomeDoContrato ? obj.nomeDoContrato : "-",
        nomeDoProjeto: obj.nomeDoProjeto ? obj.nomeDoProjeto : "-",
        vendedor: obj.vendedor.nome ? obj.vendedor.nome : "-",
        codVendedor: obj.vendedor.codigo ? obj.vendedor.codigo : "-",
        uf: obj.uf ? obj.uf : "-",
        cidade: obj.cidade ? obj.cidade : "-",
        cpf_cnpj: obj.cpf_cnpj ? obj.cpf_cnpj : "-",
        tipoDeServico: obj.tipoDeServico ? obj.tipoDeServico : "-",
        telefone: obj.telefone ? obj.telefone : "-",
        pagamentoPadrao: obj.padrao.respPagamento
          ? obj.padrao.respPagamento
          : "-",
        respInstPadrao: obj.padrao.respInstalacao
          ? obj.padrao.respInstalacao
          : "-",
        estruturaPagamento: obj.estruturaPersonalizada.respPagamento
          ? obj.estruturaPersonalizada.respPagamento
          : "-",
        contratoStatus: obj.contrato.status ? obj.contrato.status : "-",
        solicitacaoContrato: obj.contrato.dataSolicitacao
          ? fixDate(obj.contrato.dataSolicitacao)
          : "-",
        libAssContrato: obj.contrato.dataLiberacao
          ? fixDate(obj.contrato.dataLiberacao)
          : "-",
        assContrato: obj.contrato.dataAssinatura
          ? fixDate(obj.contrato.dataAssinatura)
          : "-",
        formaPagamento: obj.pagamento.forma ? obj.pagamento.forma : "-",
        credor: obj.pagamento.credor ? obj.pagamento.credor : "-",
        pagador: obj.pagamento.pagador ? obj.pagamento.pagador : "-",
        contatoPagador: obj.pagamento.contatoPagador
          ? obj.pagamento.contatoPagador
          : "-",
        libCompra: obj.compra.statusLiberacao
          ? obj.compra.statusLiberacao
          : "-",
        dataLibCompra: obj.compra.dataLiberacao
          ? fixDate(obj.compra.dataLiberacao)
          : "-",
        localDeEntrega: obj.compra.localEntrega ? obj.compra.localEntrega : "-",
        titularProjeto: obj.dadosCemig.titularProjeto
          ? obj.dadosCemig.titularProjeto
          : "-",
        numInstalacao: obj.dadosCemig.numeroInstalacao
          ? obj.dadosCemig.numeroInstalacao
          : "-",
        distCreditos: obj.dadosCemig.distCreditos
          ? obj.dadosCemig.distCreditos
          : "-",
        qtdeDist: obj.dadosCemig.qtdeDistCreditos
          ? obj.dadosCemig.qtdeDistCreditos
          : "-",
        qtdeModulos: obj.sistema.qtdeModulos ? obj.sistema.qtdeModulos : "-",
        potModulos: obj.sistema.potModulos ? obj.sistema.potModulos : "-",
        topologia: obj.sistema.topologia ? obj.sistema.topologia : "-",
        inversor: obj.sistema.inversor ? obj.sistema.inversor : "-",
        valorEstrutura: obj.estruturaPersonalizada.valor
          ? obj.estruturaPersonalizada.valor
          : "-",
        valorPadrao: obj.padrao.valor ? obj.padrao.valor : "-",
        valorProjeto: obj.sistema.valorProjeto ? obj.sistema.valorProjeto : "-",
        iniciarProjeto: obj.projeto.iniciar ? obj.projeto.iniciar : "-",
        fornecedor: obj.compra.fornecedor ? obj.compra.fornecedor : "-",
        infoCompra: obj.compra.informacoes ? obj.compra.informacoes : "-",
        valorKit: obj.compra.valorDoKit ? obj.compra.valorDoKit : "-",
        dataPedido: obj.compra.dataPedido
          ? fixDate(obj.compra.dataPedido)
          : "-",
        dataPagamento: obj.compra.dataPagamento
          ? fixDate(obj.compra.dataPagamento)
          : "-",
        statusPagamento: obj.pagamento.status ? obj.pagamento.status : "-",
        prevFaturamento: obj.faturamento.previsaoFaturamento
          ? obj.faturamento.previsaoFaturamento
          : "-",
        previsaoEntrega: obj.compra.previsaoEntrega
          ? fixDate(obj.compra.previsaoEntrega)
          : "-",
        rastreio: obj.compra.rastreio ? obj.compra.rastreio : "-",
        statusEntrega: obj.compra.statusEntrega
          ? obj.compra.statusEntrega
          : "-",
        projetista: obj.projeto.projetista.nome
          ? obj.projeto.projetista.nome
          : "-",
        codigoProjetista: obj.projeto.projetista.codigo
          ? obj.projeto.projetista.codigo
          : "-",
        statusParecer: obj.parecer.statusDoParecerDeAcesso
          ? obj.parecer.statusDoParecerDeAcesso
          : "-",
        documentacaoAssinada: obj.projeto.dataAssDocumentacao
          ? fixDate(obj.projeto.dataAssDocumentacao)
          : "-",
        dataParecer: obj.parecer.dataParecerDeAcesso
          ? fixDate(obj.parecer.dataParecerDeAcesso)
          : "-",
        diagramaUnifilar: obj.projeto.diagramaUnifilar
          ? obj.projeto.diagramaUnifilar
          : "-",
        desenhoTelhado: obj.projeto.desenhoTelhado
          ? obj.projeto.desenhoTelhado
          : "-",
        mapaDeMicro: obj.projeto.mapaDeMicro ? obj.projeto.mapaDeMicro : "-",
        pedidoVistoria: obj.vistoria.dataPedido
          ? fixDate(obj.vistoria.dataPedido)
          : "-",
        statusVistoria: obj.vistoria.status ? obj.vistoria.status : "-",
        trocaMedidor: obj.medidor.data ? fixDate(obj.medidor.data) : "-",
        statusMedidor: obj.medidor.status ? obj.medidor.status : "-",
        projetoConcluido: obj.projeto.projetoConcluido
          ? obj.projeto.projetoConcluido
          : "-",
        obsObra: obj.obra.observacoes ? obj.obra.observacoes : "-",
        solicitacaoObra: obj.obra.statusSolicitacao
          ? obj.obra.statusSolicitacao
          : "-",
        statusVisita: obj.visitaTecnica.status ? obj.visitaTecnica.status : "-",
        tecnicoResp: obj.visitaTecnica.tecnico
          ? obj.visitaTecnica.tecnico
          : "-",
        aumentoDeCarga: obj.projeto.aumentoDeCarga
          ? obj.projeto.aumentoDeCarga
          : "-",
        acStatus: obj.projeto.acStatus ? obj.projeto.acStatus : "-",
        possuiEstrutura: obj.estruturaPersonalizada.aplicavel
          ? obj.estruturaPersonalizada.aplicavel
          : "-",
        statusEstrutura: obj.estruturaPersonalizada.status
          ? obj.estruturaPersonalizada.status
          : "-",
        laudo: obj.obra.laudo ? obj.obra.laudo : "-",
        separacaoMaterial: obj.material.statusSeparacao
          ? obj.material.statusSeparacao
          : "-",
        entradaObra: obj.obra.entrada ? fixDate(obj.obra.entrada) : "-",
        saidaObra: obj.obra.saida ? fixDate(obj.obra.saida) : "-",
        statusObra: obj.obra.statusDaObra ? obj.obra.statusDaObra : "-",
        equipeExec: obj.obra.equipeResp ? obj.obra.equipeResp : "-",
        codEquipeExec: "-",
        checklistObra: obj.obra.checklist ? obj.obra.checklist : "-",
        prevNotaFiscal: obj.material.notaFiscal ? obj.material.notaFiscal : "-",
        prevCustos: obj.material.previsaoCustos
          ? obj.material.previsaoCustos
          : "-",
        efetivoCustos: obj.efetivoCustos ? obj.efetivoCustos : "-",
        manutencaoStatus: obj.manutencaoPreventiva.status
          ? obj.manutencaoPreventiva.status
          : "-",
        manutencaoData: obj.manutencaoPreventiva.data
          ? fixDate(obj.manutencaoPreventiva.data)
          : "-",
        manutencaoCorretiva: "-",
        retrabalho: "-",
        regional: obj.regional ? obj.regional : "-",
        tipoKit: obj.compra.tipoDoKit ? obj.compra.tipoDoKit : "-",
        segmento: obj.segmento ? obj.segmento : "-",
        nps: obj.nps ? obj.nps : "-",
        dataNps: obj.jornada?.dataNps ? fixDate(obj.jornada.dataNps) : "-",
        codSVB: obj.codigoSVB ? obj.codigoSVB : "-",
        potenciaPico: obj.sistema.potPico ? obj.sistema.potPico : "-",
        dataNascimento: obj.dataNascimento ? obj.dataNascimento : "-", // novas infos
        email: obj.email ? obj.email : "-",
        logradouro: obj.logradouro ? obj.logradouro : "-",
        numeroResidencia: obj.numeroResidencia ? obj.numeroResidencia : "-",
        bairro: obj.bairro ? obj.bairro : "-",
        cep: obj.cep ? obj.cep : "-",
        canalDeVenda: obj.canalVenda ? obj.canalVenda : "-",
        indicador: obj.indicacao?.quemIndicou
          ? obj.indicacao?.quemIndicou
          : "-",
        ondeTrabalha: obj.ondeTrabalha ? obj.ondeTrabalha : "-",
        valorContrato: getContractValue(
          obj.sistema.valorProjeto,
          obj.padrao.valor,
          obj.estruturaPersonalizada.valor
        ),
        dataUltimoContato: obj.jornada.dataUltimoContato
          ? obj.jornada.dataUltimoContato
          : "-",
        statusContato: getContactStatus(
          obj.jornada.dataUltimoContato,
          obj.jornada.jornadaConcluida
        ),
        jornadaConcluida: obj.jornada.jornadaConcluida
          ? obj.jornada.jornadaConcluida
          : "-",
        boasVindas: obj.jornada.boasVindas ? obj.jornada.boasVindas : "-",
        assDocumentacao: obj.jornada.assDocumentacoes
          ? obj.jornada.assDocumentacoes
          : "-",
        compraDoKit: obj.jornada.compraDoKit ? obj.jornada.compraDoKit : "-",
        nfFaturada: obj.jornada.nfFaturada ? obj.jornada.nfFaturada : "-",
        prevChegada: obj.jornada.prevChegada ? obj.jornada.prevChegada : "-",
        respConcessionaria: obj.jornada.respConcessionaria
          ? obj.jornada.respConcessionaria
          : "-",
        entregaDoKit: obj.jornada.entregaDoKit ? obj.jornada.entregaDoKit : "-",
        instalacaoAgendada: obj.jornada.instalacaoAgendada
          ? obj.jornada.instalacaoAgendada
          : "-",
        instalacaoRealizada: obj.jornada.instalacaoRealizada
          ? obj.jornada.instalacaoRealizada
          : "-",
        vistoriaConcessionaria: obj.jornada.vistoriaConcessionaria
          ? obj.jornada.vistoriaConcessionaria
          : "-",
        sistemaLigado: done(obj.jornada.sistemaLigado),
      };
    });
    res.json(newArr);
  }
}
export const config = {
  api: {
    responseLimit: "8mb",
  },
};
// Case #00106481 na vercel
