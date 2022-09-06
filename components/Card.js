import React, { useState } from "react";
import { useDrag } from "react-dnd";
import axios from "axios";
import Link from "next/link";
function Card({ propose, fetchProposes }) {
  const [plan, setPlan] = useState(propose.currentPlanOption);
  const [{ isDragging, targetId }, dragRef] = useDrag({
    type: "CARD",
    item: { id: propose._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      targetId: monitor.getTargetIds(),
    }),
  });
  const conditionalProp = !propose.rejected ? { ref: dragRef } : {};
  const stages = {
    1: "Em apresentação",
    2: "Em negociação",
    3: "Em fechamento",
    4: "Venda fechada",
  };
  const plans = [
    {
      id: 0,
      text: "Não definido",
    },
    { id: 1, text: "Manutenção simples" },
    { id: 2, text: "Plano Sol" },
    {
      id: 3,
      text: "Plano Sol+",
    },
  ];

  var plansForSelection = plans.filter(
    (p) => p.id != propose.currentPlanOption
  );
  var currentPlan = plans.filter((p) => p.id == propose.currentPlanOption);

  function handlePlanChange(plan) {
    setPlan(plan);
    axios
      .post("/api/o&m/updatePropose", {
        id: propose._id,
        plan: plan,
      })
      .then((res) => fetchProposes());
  }
  function getCurrentPlanPrice() {
    switch (propose.currentPlanOption) {
      case 0:
        return "-";
      case 1:
        return (
          propose.price * propose.modulesQty +
          1.5 * 2 * propose.distance
        ).toFixed(2);
      case 2:
        return (
          1.3 * propose.price * propose.modulesQty +
          1.5 * 2 * propose.distance
        ).toFixed(2);
      case 3:
        return (
          1.95 * propose.price * propose.modulesQty +
          1.5 * 2 * propose.distance
        ).toFixed(2);
      default:
        return "-";
    }
  }
  function handleProjectInitiation() {
    axios
      .post("/api/o&m/projects", {
        projectInfo: {
          clientName: propose.clientName,
          clientCity: propose.city,
          modulesQty: propose.modulesQty,
          modulesPot: propose.modulesPot,
          peakPot: (propose.modulesPot * propose.modulesQty) / 1000,
          priceByModule: propose.price,
          selectedPlan: propose.currentPlanOption,
          relatedPropose: propose._id,
          attendant: propose.attendant,
        },
      })
      .then((res) => createProjectStatus());
  }
  function createProjectStatus() {
    axios
      .patch("/api/o&m/updatePropose", { id: propose._id })
      .then(() => fetchProposes());
  }
  function setProposeAsRejected() {
    axios
      .post("/api/o&m/updatePropose", {
        id: propose._id,
        rejected: true,
      })
      .then(() => fetchProposes());
  }
  return (
    <div
      {...conditionalProp}
      className={`flex w-full flex-col gap-y-2 ${
        propose.rejected && "bg-gray-300"
      } py-2 mt-2 border border-gray-200 rounded shadow-lg`}
    >
      <div className="grid grid-cols-4">
        <p className="col-span-2 text-sm text-center mx-2">
          {propose.clientName}
        </p>
        <div className="flex col-span-1">
          <Link href={`/o&m/pdf/propose/${propose._id}`}>
            <button className="bg-[#f6c228] h-[24px] w-[40px] px-2 rounded">
              Ver
            </button>
          </Link>
        </div>
        <p className="bg-green-400 text-xs py-1 col-span-1 mx-1 align-middle h-fit text-center rounded px-1">
          R$ {getCurrentPlanPrice()}
        </p>
      </div>
      <div className="w-full hidden xl:flex justify-around">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase text-gray-400">Plano:</span>
          <select
            onChange={(e) => handlePlanChange(e.target.value)}
            className="outline-none rounded bg-transparent text-base text-center text-[#15599b] text-sm"
          >
            <option defaultValue value={propose.currentPlanOption}>
              {currentPlan[0].text}
            </option>
            {plansForSelection.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.text}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase text-gray-400">Estágio:</span>
          <p className="text-xs text-center uppercase text-[#15599b]">
            {propose.rejected
              ? "Proposta rejeitada"
              : stages[propose.negotiationStage]}
          </p>
        </div>
        {propose.negotiationStage == 4 && !propose.closed && (
          <div className="flex items-center">
            <button
              onClick={handleProjectInitiation}
              className="bg-[#f6c228] h-[24px] w-[40px] px-2 rounded"
            >
              &#128221;
            </button>
          </div>
        )}
        {propose.closed && (
          <div className="flex items-center">
            <p>&#9989;</p>
          </div>
        )}
        {propose.negotiationStage != 4 && !propose.rejected && (
          <div className="flex items-center">
            <button
              onClick={() => setProposeAsRejected()}
              className="bg-red-400 h-[24px] w-[40px] px-2 rounded"
            >
              &#x2716;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
