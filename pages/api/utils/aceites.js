import axios from "axios";
import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { authorization, after, before } = req.query;
    const formattedAfter = dayjs(after).format("YYYY-MM-DD");
    const formattedABefore = dayjs(before).format("YYYY-MM-DD");
    try {
      const { data } = await axios.post(
        "https://business.solarmarket.com.br/graphql",
        {
          operationName: "ListarPropostas",
          variables: {
            input: {
              first: 100,
              offset: 0,
              ativa: true,
              chaveVariaveis: ["potencia_sistema", "preco"],
              responsavelId: [
                0, 6924, 13615, 6320, 13443, 2382, 6615, 6283, 8035, 5615, 5763,
                5852, 11553, 12559, 8785, 12759, 11601, 2277, 4073, 3578, 12615,
                6183, 6182,
              ],
              dataAceiteInicial: formattedAfter,
              dataAceiteFinal: formattedABefore,
            },
          },
          query:
            "query ListarPropostas($input: ListarPropostaInput!) {\n  listarPropostas(input: $input) {\n    id\n    nome\n    dataInclusao\n    dataAceitacao\n    identificador\n    status\n    projeto {\n      id\n      identificador\n      nome\n      cliente {\n        identificador\n        nome\n        empresaCliente\n      }\n      responsavel {\n        nome\n      }\n      representante {\n        nome\n      }\n    }\n    variaveis {\n      chave\n      valorFormatado\n    }\n  }\n}\n",
        },
        {
          headers: {
            Authorization: authorization,
          },
        }
      );
      const acceptedProposes = data.data?.listarPropostas;
      const formattedProposes = acceptedProposes.map((item) => {
        return {
          codigoSVB: item.projeto.identificador,
          nomeProposta: item.nome,
          nomeProjeto: item.projeto.nome,
          precoProposta: item.variaveis.find((x) => x.chave == "preco")
            ? item.variaveis.find((x) => x.chave == "preco").valorFormatado
            : "N/A",
          potenciaProposta: item.variaveis.find((x) => x.chave == "preco")
            ? item.variaveis.find((x) => x.chave == "potencia_sistema")
                .valorFormatado
            : "N/A",
        };
      });
      res.json(formattedProposes);
    } catch (error) {
      res
        .status(500)
        .json(
          "Houve um erro na busca dos items. Por favor, tente novamente mais tarde."
        );
    }
  }
}
