import React, { useEffect, useState } from "react";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import NumberInput from "../../components/NumberInput";
import ListPropostas from "../../components/ListPropostas";
import { cidadesAtendidas, prices, cities } from "../../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
import ModalNewPropostaOeM from "../../components/ModalNewPropostaOeM";
import { FaCity, FaSolarPanel, FaUser } from "react-icons/fa";
import { HiIdentification } from "react-icons/hi";
import { BsFolderFill, BsTelephoneFill } from "react-icons/bs";
import { IoMdPower } from "react-icons/io";
import { AiFillThunderbolt } from "react-icons/ai";
import { GoGraph } from "react-icons/go";
function Propostas() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });
  const [newProposeModalIsOpen, setNewProposeModalIsOpen] = useState(false);

  const [proposes, setProposes] = useState({ status: null, data: null });

  async function getProposes() {
    setProposes({ status: "loading", data: null });
    try {
      const { data } = await axios.get("/api/o&m/proposes");
      console.log("DATA", data);
      setProposes({ status: "success", data: data });
    } catch (error) {
      setProposes({ status: "failure", data: [] });
    }
  }
  // let obj = {
  //   emApresentacao: [],
  //   emNegociacao: [],
  //   emFechamento: [],
  //   fechadas: [],
  // };
  // function findPrice() {
  //   for (let i = 0; i < prices.length; i++) {
  //     console.log(prices[i]);
  //     if (
  //       dados.modulesQty >= prices[i].min &&
  //       dados.modulesQty <= prices[i].max
  //     ) {
  //       return prices[i].price;
  //     }
  //   }
  // }
  // function findExpectedGen() {
  //   let index = cities.findIndex((x) => (x.name = dados.city));
  //   return cities[index].annualGenFactor;
  // }
  // function getPropostas() {
  //   axios.get("/api/o&m/propose").then((res) =>
  //     setPropostas({
  //       emApresentacao: res.data.filter((p) => p.negotiationStage == 1),
  //       emNegociacao: res.data.filter((p) => p.negotiationStage == 2),
  //       emFechamento: res.data.filter((p) => p.negotiationStage == 3),
  //       fechadas: res.data.filter((p) => p.negotiationStage == 4),
  //     })
  //   );
  // }
  // function handleValidations() {
  //   if (dados.clientName.trim().length < 3) {
  //     setMsg({
  //       text: "Por favor, preencha um nome válido.",
  //       color: "text-red-500",
  //     });
  //     return false;
  //   } else if (dados.attendant == "NÃO DEFINIDO") {
  //     setMsg({
  //       text: "Por favor, preencha o atendente.",
  //       color: "text-red-500",
  //     });
  //     return false;
  //   } else if (dados.modulesPot == null || dados.modulesQty == null) {
  //     setMsg({
  //       text: "Por favor, preencha as informações do sistema.",
  //       color: "text-red-500",
  //     });
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  // function resetState() {
  //   setDados({
  //     clientName: "",
  //     city: cities[0].name,
  //     attendant: "NÃO DEFINIDO",
  //     modulesQty: 0,
  //     modulesPot: 0,
  //     currentEfficience: 0,
  //     distance: 0,
  //   });
  // }
  // async function gerarProposta() {
  //   if (handleValidations()) {
  //     try {
  //       let { data } = await axios.post("/api/o&m/propose", {
  //         ...dados,
  //         price: findPrice(),
  //         expectedMonthlyGen: (
  //           (dados.modulesPot * dados.modulesQty * findExpectedGen()) /
  //           1000
  //         ).toFixed(2),
  //         negotiationStage: 1,
  //         currentPlanOption: 0,
  //       });
  //       resetState();
  //       getPropostas();
  //       setMsg({ text: data, color: "text-green-500" });
  //     } catch (error) {
  //       let { response } = error;
  //       console.log("Error", error);
  //       setMsg({ text: response.data, color: "text-red-500" });
  //     }
  //   }
  // }
  useEffect(() => {
    if (session?.user) {
      if (!proposes.data) {
        getProposes();
      }
    }
  }, [session]);
  console.log(proposes);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="flex flex-col p-6 grow bg-[#fff]">
        <div className="flex items-center gap-x-2 border-b-2 border-gray-200">
          <h1 className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            PROPOSTAS DE O&M
          </h1>
        </div>
        {proposes.status == "loading" ? <LoadingPage /> : null}
        {proposes.status == "success" ? (
          <div className="grow flex gap-2 flex-wrap justify-around p-2">
            {proposes.data.map((propose) => (
              <div className="flex gap-3 flex-col p-3 w-full lg:w-[400px] h-[150px] border border-gray-200 shadow-md">
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <HiIdentification style={{ color: "#15599a" }} />
                    <h1 className="font-medium">{propose.nomeCliente}</h1>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaCity style={{ color: "#fead61" }} />
                    <h1 className="font-medium">
                      {propose.cidade}/{propose.uf}
                    </h1>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaUser style={{ color: "#003d5b" }} />
                    <h1 className="text-gray-700 font-medium text-xs">
                      {propose.vendedor}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsTelephoneFill style={{ color: "#16B010" }} />
                    <h1 className="text-gray-700 font-medium text-xs">
                      {propose.telefoneVendedor
                        ? propose.telefoneVendedor
                        : "NÃO FORNECIDO"}
                    </h1>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-1/3 flex items-center justify-start gap-2">
                    <FaSolarPanel style={{ color: " rgb(217,119,6)" }} />
                    <h1 className="text-gray-700 font-medium text-xs">
                      {propose.qtdeModulos} MÓDULOS
                    </h1>
                  </div>
                  <div className="w-1/3 flex items-center justify-center gap-2">
                    <GoGraph style={{ color: "blue" }} />
                    <h1 className="text-gray-700 font-medium text-xs">
                      {propose.eficienciaAtual}%
                    </h1>
                  </div>
                  <div className="w-1/3 flex items-end justify-end gap-2">
                    <AiFillThunderbolt style={{ color: "red" }} />
                    <h1 className="text-gray-700 font-medium text-xs">
                      {propose.potModulos} W
                    </h1>
                  </div>
                </div>
                <div className="flex gap-3 items-center justify-center">
                  <a
                    onClick={() =>
                      router.push(`/oem/pdfProposta/${propose._id}`)
                    }
                    className="text-sm text-blue-300 font-medium cursor-pointer"
                  >
                    PROPOSTA
                  </a>
                  <BsFolderFill style={{ color: "rgb(30,64,175)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {/* <div className="grid lg:grid-cols-4 lg:grid-rows-1 grid-rows-4 grid-cols-1  w-full  py-2 gap-4 mt-5 border border-[#15599a] shadow-lg">
          <ListPropostas
            title={"Em apresentação"}
            listId={1}
            fetchProposes={getPropostas}
            proposes={
              propostas?.emApresentacao ? propostas?.emApresentacao : []
            }
          />
          <ListPropostas
            title={"Em negociação"}
            listId={2}
            fetchProposes={getPropostas}
            proposes={propostas?.emNegociacao ? propostas?.emNegociacao : []}
          />
          <ListPropostas
            title={"Em fechamento"}
            listId={3}
            fetchProposes={getPropostas}
            proposes={propostas?.emFechamento ? propostas?.emFechamento : []}
          />
          <ListPropostas
            title={"Vendas fechadas"}
            listId={4}
            fetchProposes={getPropostas}
            proposes={propostas?.fechadas ? propostas?.fechadas : []}
          />
        </div> */}
        <div
          onClick={() => setNewProposeModalIsOpen(true)}
          className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
        >
          <p className="uppercase font-bold text-sm">Nova proposta</p>
        </div>
        {newProposeModalIsOpen ? (
          <ModalNewPropostaOeM
            closeModal={() => setNewProposeModalIsOpen(false)}
            isOpen={newProposeModalIsOpen}
          />
        ) : null}
      </div>
    );
  }
}

export default Propostas;
