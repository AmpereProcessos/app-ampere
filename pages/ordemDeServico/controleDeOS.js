import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { BsFillSaveFill } from "react-icons/bs";
import { equipesTecnicas } from "../../utils/constants";
import { AppContext } from "../../context/AppContext";
import connectToDatabase from "../../utils/projectsDb";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
const groupByEquipe = groupBy("equipe");

function ControleDeOSs({ arr }) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [groupedByEquipe, setGroupedByEquipe] = useState([]);
  function saveChanges(id, index, change) {
    console.log("FUI CHAMADO", id, index, change);
    axios
      .post(`/api/projects/update/${id}`, {
        [`ordensDeServico.${index}.equipe`]: change,
      })
      .then(() => {
        if (session?.user?.visualizacao == "OBRAS") {
          alert("Alteração feita. OS disponível em Minhas OSs");
        } else {
          alert("Alteração feita!");
        }
      });
  }
  useEffect(() => {
    if (session?.user) {
      let newArr = groupByEquipe(arr);
      setGroupedByEquipe(newArr);
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="flex flex-col p-6 grow bg-[#fff]">
        <div className="flex flex-col items-center pb-2 border-b border-gray-200">
          <h1 className="text-[#15599a] font-bold text-xl">
            ORDENS DE SERVIÇO EM ABERTO
          </h1>
        </div>
        <div className="flex justify-around gap-3 mt-4 flex-wrap">
          {session?.user?.visualizacao == "OBRAS" ? (
            <div className="flex flex-col">
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
                        <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                        <option value={session?.user?.equipe}>
                          {session?.user?.equipe}
                        </option>
                      </select>
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => {
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
              <div key={y} className="flex flex-col w-full">
                <h1 className="text-center font-bold text-white p-1 bg-black">
                  {key == "undefined" ? "NÃO DEFINIDO" : key}
                </h1>
                <div className="flex flex-col w-full">
                  <div className="grid grid-cols-3 lg:grid-cols-6 border-x border-gray-200 w-full">
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
                      className="grid grid-cols-3 lg:grid-cols-6 border-b border-x border-gray-200 w-full"
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
                          newObj[key][i].equipe = e.target.value;
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
                            saveChanges(
                              groupedByEquipe[key][i].id,
                              groupedByEquipe[key][i].index,
                              groupedByEquipe[key][i].equipe
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
            ))
          )}
        </div>
        <Link href={"/ordemDeServico/osDaEquipe"}>
          <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
            <p className="uppercase font-bold text-sm">MINHAS OSs</p>
          </a>
        </Link>
      </div>
    );
  }
}

export default ControleDeOSs;
export async function getServerSideProps() {
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
  return {
    props: {
      arr: eventos,
    },
  };
}
