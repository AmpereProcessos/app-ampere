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

function Propostas() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  const [dados, setDados] = useState({
    clientName: "",
    city: cities[0].name,
    attendant: "NÃO DEFINIDO",
    modulesQty: null,
    modulesPot: null,
    currentEfficience: null,
    maintenanceOnly: false,
    distance: 0,
  });
  const [propostas, setPropostas] = useState();
  // let obj = {
  //   emApresentacao: [],
  //   emNegociacao: [],
  //   emFechamento: [],
  //   fechadas: [],
  // };
  function findPrice() {
    for (let i = 0; i < prices.length; i++) {
      console.log(prices[i]);
      if (
        dados.modulesQty >= prices[i].min &&
        dados.modulesQty <= prices[i].max
      ) {
        return prices[i].price;
      }
    }
  }
  function findExpectedGen() {
    let index = cities.findIndex((x) => (x.name = dados.city));
    return cities[index].annualGenFactor;
  }
  function getPropostas() {
    axios.get("/api/o&m/propose").then((res) =>
      setPropostas({
        emApresentacao: res.data.filter((p) => p.negotiationStage == 1),
        emNegociacao: res.data.filter((p) => p.negotiationStage == 2),
        emFechamento: res.data.filter((p) => p.negotiationStage == 3),
        fechadas: res.data.filter((p) => p.negotiationStage == 4),
      })
    );
  }
  function handleValidations() {
    if (dados.clientName.trim().length < 3) {
      setMsg({
        text: "Por favor, preencha um nome válido.",
        color: "text-red-500",
      });
      return false;
    } else if (dados.attendant == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o atendente.",
        color: "text-red-500",
      });
      return false;
    } else if (dados.modulesPot == null || dados.modulesQty == null) {
      setMsg({
        text: "Por favor, preencha as informações do sistema.",
        color: "text-red-500",
      });
      return false;
    } else {
      return true;
    }
  }
  function resetState() {
    setDados({
      clientName: "",
      city: cities[0].name,
      attendant: "NÃO DEFINIDO",
      modulesQty: 0,
      modulesPot: 0,
      currentEfficience: 0,
      distance: 0,
    });
  }
  async function gerarProposta() {
    if (handleValidations()) {
      try {
        let { data } = await axios.post("/api/o&m/propose", {
          ...dados,
          price: findPrice(),
          expectedMonthlyGen: (
            (dados.modulesPot * dados.modulesQty * findExpectedGen()) /
            1000
          ).toFixed(2),
          negotiationStage: 1,
          currentPlanOption: 0,
        });
        resetState();
        getPropostas();
        setMsg({ text: data, color: "text-green-500" });
      } catch (error) {
        let { response } = error;
        console.log("Error", error);
        setMsg({ text: response.data, color: "text-red-500" });
      }
    }
  }
  useEffect(() => {
    if (session?.user) {
      if (!propostas) {
        getPropostas();
      }
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="flex flex-col p-6 grow bg-[#fff]">
        <div className="flex items-center gap-x-2 border-b-2 border-gray-200">
          <h1 className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            PROPOSTAS DE O&M
          </h1>
        </div>
        <div className="flex flex-col p-3 mt-4 border border-[#15599a] rounded shadow-lg">
          <span className="text-[#fead61] text-xl text-center font-bold">
            DADOS PARA GERAÇÃO DA PROPOSTA
          </span>
          <div className="flex flex-wrap justify-around gap-2 mt-2">
            <TextInput
              label={"NOME DO CLIENTE"}
              editable={true}
              value={dados.clientName}
              handleChange={(value) =>
                setDados({ ...dados, clientName: value.toUpperCase() })
              }
            />
            <SelectInput
              label={"CIDADE"}
              value={dados.city}
              editable={true}
              options={cities.map((cidade) => {
                return { label: cidade.name, value: cidade.name };
              })}
              handleChange={(value) => setDados({ ...dados, city: value })}
            />
            <SelectInput
              label={"ATENDENTE"}
              editable={true}
              value={dados.attendant}
              options={[
                { label: "LUIS EDUARDO", value: "LUIS EDUARDO" },
                { label: "GABRIEL MARTINS", value: "GABRIEL MARTINS" },
                { label: "MARCOS DIAS", value: "MARCOS DIAS" },
                { label: "VOLTS", value: "VOLTS" },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) => setDados({ ...dados, attendant: value })}
            />
            <NumberInput
              label={"QTDE MODULOS"}
              editable={true}
              value={dados.modulesQty}
              handleChange={(value) =>
                setDados({ ...dados, modulesQty: value })
              }
            />
            <NumberInput
              label={"POT MODULOS"}
              editable={true}
              value={dados.modulesPot}
              handleChange={(value) =>
                setDados({ ...dados, modulesPot: value })
              }
            />
            <NumberInput
              label={"EFICIÊNCIA ATUAL"}
              editable={true}
              value={dados.currentEfficience}
              handleChange={(value) =>
                setDados({ ...dados, currentEfficience: value })
              }
            />
            <div className="flex items-center gap-2">
              <label htmlFor="maintenanceOnly">SOMENTE MANUTENÇÃO ?</label>
              <input
                checked={dados.maintenanceOnly}
                onChange={(e) =>
                  setDados({ ...dados, maintenanceOnly: e.target.checked })
                }
                id="maintenanceOnly"
                name="maintenanceOnly"
                type={"checkbox"}
              />
            </div>
            <NumberInput
              label={"DISTÂNCIA"}
              editable={true}
              value={dados.distance}
              handleChange={(value) => setDados({ ...dados, distance: value })}
            />
          </div>
          <div className="flex justify-center mt-2">
            <button
              onClick={gerarProposta}
              className="p-2 rounded font-bold bg-[#fead61] hover:bg-[#15599a] hover:text-white"
            >
              GERAR PROPOSTA
            </button>
          </div>
          {msg.text && (
            <p className={`text-sm italic text-center ${msg.color}`}>
              {msg.text}
            </p>
          )}
        </div>
        <div className="grid lg:grid-cols-4 lg:grid-rows-1 grid-rows-4 grid-cols-1  w-full  py-2 gap-4 mt-5 border border-[#15599a] shadow-lg">
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
        </div>
      </div>
    );
  }
}

export default Propostas;
