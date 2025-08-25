import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import axios from 'axios'
import Link from 'next/link'
function Card({ propose, fetchProposes }) {
  const [plan, setPlan] = useState(propose.currentPlanOption)
  const [{ isDragging, targetId }, dragRef] = useDrag({
    type: 'CARD',
    item: { id: propose._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      targetId: monitor.getTargetIds(),
    }),
  })
  const conditionalProp = !propose.rejected ? { ref: dragRef } : {}
  const stages = {
    1: 'Em apresentação',
    2: 'Em negociação',
    3: 'Em fechamento',
    4: 'Venda fechada',
  }
  const plans = [
    {
      id: 0,
      text: 'Não definido',
    },
    { id: 1, text: 'Manutenção simples' },
    { id: 2, text: 'Plano Sol' },
    {
      id: 3,
      text: 'Plano Sol+',
    },
  ]

  var plansForSelection = plans.filter((p) => p.id != propose.currentPlanOption)
  var currentPlan = plans.filter((p) => p.id == propose.currentPlanOption)

  function handlePlanChange(plan) {
    setPlan(plan)
    axios
      .post('/api/o&m/updatePropose', {
        id: propose._id,
        plan: plan,
      })
      .then((res) => fetchProposes())
  }
  function getCurrentPlanPrice() {
    switch (propose.currentPlanOption) {
      case 0:
        return '-'
      case 1:
        return (propose.price * propose.modulesQty + 1.5 * 2 * propose.distance).toFixed(2)
      case 2:
        return (1.3 * propose.price * propose.modulesQty + 1.5 * 2 * propose.distance).toFixed(2)
      case 3:
        return (1.95 * propose.price * propose.modulesQty + 1.5 * 2 * propose.distance).toFixed(2)
      default:
        return '-'
    }
  }
  function handleProjectInitiation() {
    axios
      .post('/api/o&m/projects', {
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
      .then((res) => createProjectStatus())
  }
  function createProjectStatus() {
    axios.patch('/api/o&m/updatePropose', { id: propose._id }).then(() => fetchProposes())
  }
  function setProposeAsRejected() {
    axios
      .post('/api/o&m/updatePropose', {
        id: propose._id,
        rejected: true,
      })
      .then(() => fetchProposes())
  }
  return (
    <div
      {...conditionalProp}
      className={`flex w-full flex-col gap-y-2 ${propose.rejected && 'bg-primary/20'} border-primary/20 mt-2 rounded border py-2 shadow-lg`}
    >
      <div className="grid grid-cols-4">
        <p className="col-span-2 mx-2 text-center text-sm">{propose.clientName}</p>
        <div className="col-span-1 flex">
          <Link href={`/oem/pdf/propose/${propose._id}`}>
            <button className="h-[24px] w-[40px] rounded bg-[#f6c228] px-2">Ver</button>
          </Link>
        </div>
        <p className="col-span-1 mx-1 h-fit rounded bg-green-400 px-1 py-1 text-center align-middle text-xs">R$ {getCurrentPlanPrice()}</p>
      </div>
      <div className="hidden w-full justify-around xl:flex">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 uppercase">Plano:</span>
          <select
            onChange={(e) => handlePlanChange(e.target.value)}
            className="rounded bg-transparent text-center text-sm text-[#15599b] outline-hidden"
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
          <span className="text-xs text-gray-400 uppercase">Estágio:</span>
          <p className="text-center text-xs text-[#15599b] uppercase">{propose.rejected ? 'Proposta rejeitada' : stages[propose.negotiationStage]}</p>
        </div>
        {propose.negotiationStage == 4 && !propose.closed && (
          <div className="flex items-center">
            <button onClick={handleProjectInitiation} className="h-[24px] w-[40px] rounded bg-[#f6c228] px-2">
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
            <button onClick={() => setProposeAsRejected()} className="h-[24px] w-[40px] rounded bg-red-400 px-2">
              &#x2716;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
