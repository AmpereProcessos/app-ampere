type TContractData = {
  contratanteTexto: string;
  contratadaTexto: string;
  clausulas: {
    titulo: string;
    texto: string;
  }[];
  dataTexto: string;
  assinaturas: {
    contratante: {
      nome: string;
      cpfCnpj: string;
    };
    contratada: {
      nome: string;
      cpfCnpj: string;
    };
    testemunha1: {
      nome: string;
      cpfCnpj: string;
    };
    testemunha2: {
      nome: string;
      cpfCnpj: string;
    };
  };
};
