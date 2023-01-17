import dayjs from "dayjs";
import React, { useContext } from "react";
import { BsFillSaveFill } from "react-icons/bs";
import { equipesTecnicas } from "../../utils/constants";
import { AppContext } from "../../context/AppContext";
function ControleDeOSs() {
  const arr = [
    {
      id: "6353ea39e559693d01d5a292",
      index: 1,
      qtde: 1226,
      nomeDoContrato: "ANDRE ARAUJO E SILVA",
      categoria: "MANUTENÇÃO CORRETIVA",
      servicoExecutado: "1 PLACA PARADA",
      cidade: "ITUIUTABA",
      bairro: "PORTAL DOS IPES",
      logradouro: "TRA. JUQUINHA GOUVEIA",
      numeroResidencia: 64,
      qtdeModulos: 6,
      potModulos: 450,
      topologia: "MICRO",
      equipe: "EQUIPE 16 - JOÃO FILHO",
      realizarCobranca: false,
      valorCobranca: 0,
      usuarioEmissor: "Suporte Ampère",
      grauDeUrgencia: "URGENTE",
      observacoes: "",
      dataDeAbertura: "2022-11-25T14:33:58.198Z",
      agendar: false,
      cobrancaRealizada: false,
    },
    {
      id: "6353ea39e559693d01d5a295",
      index: 1,
      qtde: 1229,
      nomeDoContrato: "CRISTIANO ROCHA GOUVEIA",
      categoria: "MANUTENÇÃO CORRETIVA",
      servicoExecutado: "VERIFICAR PONTOS DE GOTEIRA",
      cidade: "ITUIUTABA",
      bairro: "INDEPENDENCIA",
      logradouro: "AVENIDA DOUTOR SAUL RIBEIRO DE CARVALHO",
      numeroResidencia: 314,
      qtdeModulos: 12,
      potModulos: 550,
      topologia: "MICRO",
      realizarCobranca: false,
      valorCobranca: 0,
      usuarioEmissor: "Suporte Ampère",
      grauDeUrgencia: "URGENTE",
      observacoes: "",
      dataDeAbertura: "2022-11-25T14:32:29.908Z",
      agendar: false,
      cobrancaRealizada: false,
    },
    {
      id: "6353ea39e559693d01d5a295",
      index: 2,
      qtde: 1229,
      nomeDoContrato: "CRISTIANO ROCHA GOUVEIA",
      categoria: "MANUTENÇÃO CORRETIVA",
      servicoExecutado: "REPOR AS TELHAS DO BEIRAL",
      cidade: "ITUIUTABA",
      bairro: "INDEPENDENCIA",
      logradouro: "AVENIDA DOUTOR SAUL RIBEIRO DE CARVALHO",
      numeroResidencia: 314,
      qtdeModulos: 12,
      potModulos: 550,
      topologia: "MICRO",
      realizarCobranca: false,
      valorCobranca: 0,
      usuarioEmissor: "Suporte Ampère",
      grauDeUrgencia: "URGENTE",
      observacoes: "",
      dataDeAbertura: "2022-11-29T14:39:59.777Z",
      agendar: false,
      cobrancaRealizada: false,
    },
    {
      id: "6353ea39e559693d01d5a298",
      index: 1,
      qtde: 1232,
      nomeDoContrato: "CLIBIA APARECIDA MELO COSTA",
      categoria: "MANUTENÇÃO PREVENTIVA",
      servicoExecutado: "CONFIGURAÇÃO",
      cidade: "ITUIUTABA",
      bairro: "SANTO ANTONIO",
      logradouro: "AV. PREFEITOCAMILO CHAVES",
      numeroResidencia: 538,
      qtdeModulos: 18,
      potModulos: 450,
      topologia: "MICRO",
      realizarCobranca: false,
      valorCobranca: 0,
      usuarioEmissor: "Suporte Ampère",
      grauDeUrgencia: "POUCO URGENTE",
      observacoes: "",
      dataDeAbertura: "2023-01-02T19:49:47.740Z",
      agendar: false,
      configurar: true,
      inversor: "DEYE",
      cobrancaRealizada: false,
    },
  ];
  const groupBy = (key) => (array) =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = obj[key];
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});
  const groupByEquipe = groupBy("equipe");
  let groupedByEquipe = groupByEquipe(arr);
  console.log(groupedByEquipe);
  const { credentials } = useContext(AppContext);
  return (
    <div className="flex flex-col p-6 grow bg-[#fff]">
      <div className="flex flex-col items-center pb-2 border-b border-gray-200">
        <h1 className="text-[#15599a] font-bold text-xl">
          {credentials.visualizacao == "OBRAS" ? "MINHAS OSs" : "OSs EM ABERTO"}
        </h1>
      </div>
      <div className="flex flex-col mt-2">
        {Object.keys(groupedByEquipe).map((key, y) => (
          <div key={y} className="flex flex-col">
            <h1 className="text-center font-bold text-white p-1 bg-black">
              {key == "undefined" ? "NÃO DEFINIDO" : key}
            </h1>
            <div className="flex flex-col">
              <div className="grid grid-cols-3 lg:grid-cols-6 border-x border-gray-200">
                <h1 className="bg-[#15599a] text-center text-white border-r border-white font-bold font-raleway">
                  NOME
                </h1>
                <h1 className="bg-[#15599a] text-center text-white border-r border-white font-bold font-raleway hidden lg:block">
                  CATEGORIA
                </h1>
                <h1 className="bg-[#15599a] text-center text-white border-r border-white font-bold font-raleway hidden lg:block">
                  CIDADE
                </h1>
                <h1 className="bg-[#15599a] text-center text-white border-r border-white font-bold font-raleway hidden lg:block">
                  SERVIÇO
                </h1>
                <h1 className="bg-[#15599a] text-center text-white border-r border-white font-bold font-raleway">
                  EQUIPE
                </h1>
                <h1 className="bg-[#15599a] text-center text-white font-bold font-raleway">
                  AÇÃO
                </h1>
              </div>
              {groupedByEquipe[key].map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 lg:grid-cols-6 border-b border-x border-gray-200"
                >
                  <p className="text-center text-xs text-gray-500 p-1 border-r border-gray-200">
                    ({item.qtde}) - {item.nomeDoContrato}
                  </p>
                  <p className="text-center text-xs text-gray-500 p-1 border-r border-gray-200 hidden lg:block">
                    {item.categoria}
                  </p>
                  <p className="text-center text-xs text-gray-500 p-1 border-r border-gray-200 hidden lg:block">
                    {item.cidade}
                  </p>
                  <p className="text-center text-xs text-gray-500 p-1 border-r border-gray-200 hidden lg:block">
                    {item.servicoExecutado}
                  </p>
                  <select
                    value={item.equipe ? item.equipe : "NÃO DEFINIDO"}
                    className="outline-none text-center text-xs text-gray-500 p-1 border-r border-gray-200"
                  >
                    {equipesTecnicas.map((equipe) => (
                      <option key={equipe.value} value={equipe.value}>
                        {equipe.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center justify-center">
                    <button className="rounded font-bold text-xs p-1 border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white">
                      <BsFillSaveFill />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ControleDeOSs;
// export async function getServerSideProps() {
//   // Call an external API endpoint to get posts.
//   // You can use any data fetching library
//   const db = await connectToDataBase(process.env.DB_KEY);
//   const collection = db.collection("dados");
//   var arr = await collection
//     .aggregate([
//       {
//         $match: {
//           ordensDeServico: { $ne: null },
//           "ordensDeServico.dataDeFechamento": null,
//         },
//       },
//       {
//         $project: {
//           qtde: 1,
//           nomeDoContrato: 1,
//           cidade: 1,
//           logradouro: 1,
//           bairro: 1,
//           numeroResidencia: 1,
//           ordensDeServico: 1,
//           "sistema.qtdeModulos": 1,
//           "sistema.potModulos": 1,
//           "sistema.topologia": 1,
//         },
//       },
//     ])
//     .toArray();
//   let eventos = [];
//   arr.forEach((item) =>
//     item.ordensDeServico.forEach((x, index) => {
//       if (
//         !x.dataDeFechamento &&
//         dayjs().diff(dayjs(x.dataDeAbertura), "days") < 60
//       ) {
//         eventos.push({
//           id: item._id,
//           index: index,
//           qtde: item.qtde,
//           nomeDoContrato: item.nomeDoContrato,
//           categoria: x.categoria,
//           servicoExecutado: x.servicoExecutado,
//           cidade: item.cidade ? item.cidade : "-",
//           bairro: item.bairro ? item.bairro : "-",
//           logradouro: item.logradouro ? item.logradouro : "-",
//           numeroResidencia: item.numeroResidencia ? item.numeroResidencia : "-",
//           qtdeModulos: item.sistema.qtdeModulos
//             ? item.sistema.qtdeModulos
//             : "-",
//           potModulos: item.sistema.potModulos ? item.sistema.potModulos : "-",
//           topologia: item.sistema.topologia ? item.sistema.topologia : "-",
//           ...x,
//         });
//       }
//     })
//   );
//   eventos = JSON.parse(JSON.stringify(eventos));
//   console.log(eventos);
//   // eventos = eventos?.map((evento) => {
//   //   return {
//   //     title: evento.nomeDoContrato,
//   //     index: evento.index,
//   //     categoria: evento.categoria,
//   //     servicoExecutado: evento.servicoExecutado,
//   //     start: dayJS(evento.inicioServico).add(3, "hours").format("YYYY-MM-DD"),
//   //     end: dayJS(evento.fimServico).add(1, "days").format("YYYY-MM-DD"),
//   //     id: evento.id.toString(),
//   //     qtde: evento.qtde,
//   //     equipe: evento.equipe ? evento.equipe : "-",
//   //     cidade: evento.cidade ? evento.cidade : "-",
//   //     logradouro: evento.logradouro ? evento.logradouro : "-",
//   //     bairro: evento.bairro ? evento.bairro : "-",
//   //     numeroResidencia: evento.numeroResidencia ? evento.numeroResidencia : "-",
//   //     qtdeModulos: evento.qtdeModulos ? evento.qtdeModulos : "-",
//   //     topologia: evento.topologia ? evento.topologia : "-",
//   //     backgroundColor: getColor(evento.cidade),
//   //   };
//   // });

//   // By returning { props: { posts } }, the Blog component
//   // will receive `posts` as a prop at build time
//   return {
//     props: {
//       arr: eventos,
//     },
//   };
// }
