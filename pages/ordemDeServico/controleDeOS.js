import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { BsFillSaveFill } from "react-icons/bs";
import { equipesTecnicas } from "../../utils/constants";
import { AppContext } from "../../context/AppContext";
import ModalOS from "../../components/ModalOS";
import connectToDatabase from "../../utils/projectsDb";
import axios from "axios";
const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
const groupByEquipe = groupBy("equipe");
function ControleDeOSs({ arr }) {
  const { credentials } = useContext(AppContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalOS, setModalOS] = useState({});
  const [groupedByEquipe, setGroupedByEquipe] = useState([]);
  function handleOpenModal(os) {
    setModalIsOpen(true);
    setModalOS(os);
  }
  function saveChanges(id, index, change) {
    console.log(id, index, change);
    axios.post(`/api/projects/update/${id}`, {
      [`ordensDeServico.${index}.equipe`]: change,
    });
  }
  useEffect(() => {
    let newArr = groupByEquipe(arr);
    setGroupedByEquipe(newArr);
  }, []);
  return (
    <div className="flex flex-col p-6 grow bg-[#fff]">
      <div className="flex flex-col items-center pb-2 border-b border-gray-200">
        <h1 className="text-[#15599a] font-bold text-xl">
          {credentials.visualizacao == "OBRAS" ? "MINHAS OSs" : "OSs EM ABERTO"}
        </h1>
      </div>
      <div className="flex justify-around gap-3 mt-4 flex-wrap">
        {credentials.visualizacao == "OBRAS" ? (
          <div className="flex flex-col">
            <div className="flex flex-col">
              {groupedByEquipe[credentials.equipe] ? (
                <div className="flex  justify-around gap-3 mt-4 flex-wrap">
                  {groupedByEquipe[credentials.equipe].map((item, i) => (
                    <div
                      key={i}
                      onClick={() => handleOpenModal(item)}
                      className="w-[250px] lg:w-[450px]  cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-700">
                          {item.nomeDoContrato}
                        </p>
                        <p className="text-xs text-[#15599a]">#{item.qtde}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-col items-center">
                          <span className="text-xxs text-center">
                            CATEGORIA
                          </span>
                          <p className="text-xs text-gray-600 text-center">
                            {item.categoria ? item.categoria : "-"}
                          </p>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xxs text-center">SERVIÇO</span>
                          <p className="text-xs text-gray-600 text-center">
                            {item.servicoExecutado
                              ? item.servicoExecutado
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center italic text-gray-500 text-xs pb-2 border-b border-gray-200">
                  SEM ORDENS DE SERVIÇO ATIVAS PARA SUA EQUIPE...
                </p>
              )}
            </div>
            <div className="flex flex-col mt-5">
              <h1 className="text-[#15599a] font-bold text-xl text-center">
                AINDA NÃO DESIGNADAS
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
                {groupedByEquipe["undefined"]?.map((item, i) => (
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
                      onChange={(e) => {
                        let newObj = groupedByEquipe;
                        newObj["undefined"][i].equipe = e.target.value;
                        // console.log(newObj);
                        // console.log("INDIVIDUAL", newObj["undefined"][i]);
                        setGroupedByEquipe({ ...newObj });
                      }}
                      className="outline-none text-center text-xs text-gray-500 p-1 border-r border-gray-200"
                    >
                      {equipesTecnicas.map((equipe) => (
                        <option key={equipe.value} value={equipe.value}>
                          {equipe.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => {
                          console.log(groupedByEquipe["undefined"][i]);
                          saveChanges(
                            groupedByEquipe["undefined"][i].id,
                            groupedByEquipe["undefined"][i].index,
                            groupedByEquipe["undefined"][i].equipe
                          );
                        }}
                        className="rounded font-bold text-xs p-1 border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white"
                      >
                        <BsFillSaveFill />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          Object.keys(groupedByEquipe).map((key, y) => (
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
          ))
        )}
      </div>
      {modalIsOpen && (
        <ModalOS info={modalOS} setModalIsOpen={setModalIsOpen} />
      )}
    </div>
  );
}

export default ControleDeOSs;
export async function getServerSideProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("dados");
  var arr = await collection
    .aggregate([
      {
        $match: {
          ordensDeServico: { $ne: null },
          "ordensDeServico.dataDeFechamento": null,
        },
      },
      {
        $project: {
          qtde: 1,
          nomeDoContrato: 1,
          cidade: 1,
          logradouro: 1,
          bairro: 1,
          numeroResidencia: 1,
          ordensDeServico: 1,
          "sistema.qtdeModulos": 1,
          "sistema.potModulos": 1,
          "sistema.topologia": 1,
        },
      },
    ])
    .toArray();
  let eventos = [];
  arr.forEach((item) =>
    item.ordensDeServico.forEach((x, index) => {
      if (
        !x.dataDeFechamento &&
        dayjs().diff(dayjs(x.dataDeAbertura), "days") < 60
      ) {
        eventos.push({
          id: item._id,
          index: index,
          qtde: item.qtde,
          nomeDoContrato: item.nomeDoContrato,
          categoria: x.categoria,
          servicoExecutado: x.servicoExecutado,
          cidade: item.cidade ? item.cidade : "-",
          bairro: item.bairro ? item.bairro : "-",
          logradouro: item.logradouro ? item.logradouro : "-",
          numeroResidencia: item.numeroResidencia ? item.numeroResidencia : "-",
          qtdeModulos: item.sistema.qtdeModulos
            ? item.sistema.qtdeModulos
            : "-",
          potModulos: item.sistema.potModulos ? item.sistema.potModulos : "-",
          topologia: item.sistema.topologia ? item.sistema.topologia : "-",
          ...x,
        });
      }
    })
  );
  eventos = JSON.parse(JSON.stringify(eventos));
  // eventos = eventos?.map((evento) => {
  //   return {
  //     title: evento.nomeDoContrato,
  //     index: evento.index,
  //     categoria: evento.categoria,
  //     servicoExecutado: evento.servicoExecutado,
  //     start: dayJS(evento.inicioServico).add(3, "hours").format("YYYY-MM-DD"),
  //     end: dayJS(evento.fimServico).add(1, "days").format("YYYY-MM-DD"),
  //     id: evento.id.toString(),
  //     qtde: evento.qtde,
  //     equipe: evento.equipe ? evento.equipe : "-",
  //     cidade: evento.cidade ? evento.cidade : "-",
  //     logradouro: evento.logradouro ? evento.logradouro : "-",
  //     bairro: evento.bairro ? evento.bairro : "-",
  //     numeroResidencia: evento.numeroResidencia ? evento.numeroResidencia : "-",
  //     qtdeModulos: evento.qtdeModulos ? evento.qtdeModulos : "-",
  //     topologia: evento.topologia ? evento.topologia : "-",
  //     backgroundColor: getColor(evento.cidade),
  //   };
  // });

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      arr: eventos,
    },
  };
}
