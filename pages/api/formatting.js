function fixUsinaLigada(value) {
  if (isNaN(Date.parse(value)) == true) {
    return { status: "NÃO REALIZADO", data: null };
  } else {
    return { status: "REALIZADO", data: new Date(value) };
  }
}
function fixDate(value) {
  if (isNaN(Date.parse(value)) == true) {
    return null;
  } else {
    return new Date(value).toISOString();
  }
}
function done(value) {
  if (isNaN(Date.parse(value)) == true) {
    return true;
  } else {
    return false;
  }
}
export default async function handler(req, res) {
  const newArr = projects.map((project) => {
    return {
      qtde: project.qtde,
      nomeDoContrato: project.nomedocontrato,
      nomeDoProjeto: project.nomedoprojeto,
      cpf_cnpj: project.cpfcnpj,
      telefone: project.telefone,
      cidade: project.cidade,
      uf: project.uf,
      vendedor: {
        nome: project.vendedor,
        codigo: project.codigodovendedor,
      },
      regional: project.regional,
      tipoDeServico: project.tipodeservico,
      codigoSVB: project.codprojetosvb,
      segmento: project.segmento,
      obsComercial: project.obscomercial,
      visitaTecnica: {
        status: project.visitatecnica,
        tecnico: project.tecnicoresponsavel,
        saidaDoCliente: project.saidacliente,
        amperagem: project.amperagem,
        tipoDaTelha: project.tipotelha,
      },
      padrao: {
        tipo: project.tipopadrao,
        respPagamento: project.pagamentodopadrao,
        respInstalacao: project.respinstalacaopadrao,
        valor: project.valorpadrao,
      },
      estruturaPersonalizada: {
        aplicavel: project.possuiestruturapersonalisada,
        tipo: project.tipoestrutura,
        respPagamento: project.pagestruturapersonalizada,
        valor: project.valorestrutura,
        status: project.estruturapersonalisada,
      },
      contrato: {
        status: project.statuscontrato,
        dataSolicitacao: fixDate(project.datasolicitacaocontrato), // formatar como data
        dataLiberacao: fixDate(project.dataliberacaoassinatura), // formatar como data
        dataAssinatura: fixDate(project.dataassinatura), // formatar como data
        formaAssinatura: project.formadeassinatura,
      },
      pagamento: {
        status: project.statuspagamento,
        forma: project.formapagamento,
        credor: project.credor,
        pagador: project.pagador,
        contatoPagador: project.contatopagamento,
        retorno: project.retorno,
        cobrancaFeita: project.cobrancarealizada == "REALIZADA" ? true : false,
      },
      faturamento: {
        previsaoFaturamento: project.previsaofaturamento, // adicionar empresa e cnpj de faturamento
        cnpjFaturamento: project.cnpjfaturar,
        empresaFaturamento: project.empresafaturar,
        dataFaturamento: project.dataFaturamento
      },
      compra: {
        statusLiberacao: project.statusliberacaocredito,
        dataLiberacao: fixDate(project.dataliberacaoparacompra), // formatar como data
        tipoDoKit: project.tipokit,
        valorDoKit: project.valordokit,
        kitInfo: project.kitsolar,
        fornecedor: project.fornecedor,
        dataPedido: fixDate(project.datadopedido), // formatar como data
        dataPagamento: fixDate(project.datapagamento),
        previsaoEntrega: fixDate(project.previsaoentrega), // formatar como data
        localEntrega: project.localdeentrega,
        informacoes: project.informacoescompra,
        previsaoNotaFiscal: project.previsaonotafiscal,
        rastreio: project.rastreiooutransportadora,
        statusEntrega: project.statusentrega,
      },
      dadosCemig: {
        titularProjeto: project.titulardoprojeto,
        numeroInstalacao: project.numeroinstalacao,
        distCreditos: project.distribuicaodecreditos,
        qtdeDistCreditos: project.quantdistribuicoes,
      },
      sistema: {
        qtdeModulos: project.nmodulos,
        potModulos: project.potmodulos,
        potPico: project.potpico,
        topologia: project.topologia,
        inversor: project.qtdepotinversor,
        valorProjeto: project.valorprojeto,
      },
      projeto: {
        iniciar: project.iniciarprojeto,
        projetista: {
          nome: project.projetista,
          codigo: project.codigoprojetista,
        },
        dataLiberacaoDocumentacao: fixDate(project.dataliberacaodocumentacao), // formatar como data
        dataAssDocumentacao: fixDate(project.documentacaoassinada), // formatar como data
        diagramaUnifilar: project.diagramaunifilar,
        desenhoTelhado: project.desenhotelhado,
        mapaDeMicro: project.mapademicro,
        aumentoDeCarga: project.aumentodecarga,
        acStatus: project.acstatus,
        projetoConcluido: project.projetoconcluido,
        relatorioComissionamento: project.relatoriocomissionamento,
      },
      parecer: {
        statusDoParecerDeAcesso: project.statusparecerdeacesso,
        qtdeDiasObraDeRede: project.qtdediasobraderede,
        dataParecerDeAcesso: fixDate(project.pareceracesso), // formatar como data
        parecerReprovado: project.parecerReprovado,
        qtdeReprovas: project.qtdeReprovasParecer,
        motivoReprova: project.motivoReprovaParecer,
      },
      vistoria: {
        dataPedido: fixDate(project.pedidovistoria), // formatar como data
        status: project.statusvistoria,
        vistoriaReprovada: project.vistoriaReprovada,
        qtdeReprovas: project.qtdeReprovasVistoria,
        motivoReprova: project.motivoReprovaVistoria,
      },
      medidor: {
        data: fixDate(project.trocamedidor), // formatar como data
        status: project.statustrocamedidor,
      },
      oem: {
        aplicavel: project.possuioem, // checar se existe campo existente na gestao
        duracao: project.duracaooem,
        qtdeManutencoes: project.qtdemanutencoes,
      },
      obra: {
        laudo: project.laudo,
        observacoes: project.obsobra, // possibilidade de substituir \n por /, e quebrar textp em pontos
        statusSolicitacao: project.solicitacaoobra,
        entrada: fixDate(project.entradanaobra), // formatar como data
        saida: fixDate(project.saidadeobra), // formatar como data.
        statusDaObra: project.statusobra,
        equipeResp: project.equipeexec,
        checklist: project.checklist,
        trafo: project.trafo,
        fotosInstalacao: project.fotosinstalacao,
      },
      material: {
        statusSeparacao: project.materialalmoxarifado,
        previsaoCustos: project.prevcustosinsumos, // toFixed(2)
        efetivoCustos: project.custosinsumos,
        notaFiscal: project.notafiscal,
        materialFaltante: project.materialfaltando,
      },
      manutencaoPreventiva: fixUsinaLigada(project.datamanutencaoprev),
      relatorios: {
        envioUm: fixUsinaLigada(project.relatorioum),
        envioDois: fixUsinaLigada(project.relatoriodois),
        envioTres: fixUsinaLigada(project.relatoriotres),
        envioQuatro: fixUsinaLigada(project.relatorioquatro),
      },
      conferencias: {
        usinaLigada: fixUsinaLigada(project.usinaligada),
        monitoramentoFeito: fixUsinaLigada(project.monitoramentoFeito),
        energiaInjetada: fixUsinaLigada(project.energiainjetada),
      },
      app: {
        data: project.appcelular,
        login: project.loginapp,
        senha: project.senhaapp,
      },
      dataNascimento: fixDate(project.datanascimento),
      email: project.email,
      logradouro: project.logradouro,
      numeroResidencia: project.numerores,
      bairro: project.bairro,
      cep: project.cep,
      canalVenda: project.canalvenda,
      indicacao: {
        quemIndicou: project.quemindicou,
        contato: project.contatoindicacao,
      },
      ondeTrabalha: project.ondetrabalha,
      jornada: {
        dataUltimoContato: project.dataultimocontato,
        boasVindas: project.boasvindas,
        assDocumentacoes: project.assdocumentacoes,
        compraDoKit: project.compradokit,
        nfFaturada: project.nffaturada,
        prevChegada: project.prevchegada,
        respConcessionaria: project.respconcessionaria,
        entregaDoKit: project.entregadokit,
        instalacaoAgendada: project.instalacaoagendada,
        instalacaoRealizada: project.instalacaorealizada,
        vistoriaConcessionaria: project.vistoriaconcessionaria,
        sistemaLigado: done(project.sistemaligado),
        jornadaConcluida: project.jornadaconcluida,
        dataNps: fixDate(project.datanps),
      },
      nps: project.nps,
    };
  });
  return res.json(newArr);
}
/*       ordensDeServico: [
        {
          servicoExecutado: '',
          realizarCobranca: true,
          valorCobranca: 0,
          usuarioEmissor: '',
          grauDeUrgencia: '',
          dataDeAbertura: 0,
          dataDeFechamento: 0,
          index: 0,
          dataDeCobranca: 0
        }
      ]
*/
