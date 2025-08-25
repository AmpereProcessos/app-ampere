import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { BsCheckSquareFill, BsFolderFill, BsTelephoneFill } from 'react-icons/bs'
import { FaCity, FaFileSignature, FaSolarPanel, FaUser } from 'react-icons/fa'
import { IoMdRemoveCircle } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'
import axios from 'axios'
import Link from 'next/link'
import { AiFillThunderbolt, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { GoGraph } from 'react-icons/go'
import { HiIdentification } from 'react-icons/hi'
function CardProposta({ propose, fetchProposes }) {
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
    /*axios
      .post("/api/projects", {
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
      .then((res) => createProjectStatus());*/
  }
  function setAsClosed() {
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
  async function deletePropose() {
    try {
      let response = await axios.delete(`/api/o&m/updatePropose?id=${propose._id}`)
      fetchProposes()
    } catch (error) {
      alert(error)
    }
  }
  async function moveStage(stage) {
    try {
      let { data } = await axios.put('/api/o&m/updatePropose', {
        id: propose._id,
        changes: { estagio: stage },
      })
      console.log('DATA', data)
      fetchProposes()
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }
  return (
    <div {...conditionalProp} key={propose._id} className="border-primary/20 flex h-[175px] min-h-[175px] w-full flex-col gap-3 border p-3 shadow-md">
      <div className="flex w-full items-center justify-between">
        <div className="text-primary/70 flex items-center gap-2">
          <HiIdentification style={{ color: '#15599a' }} />
          <h1 className="font-medium">{propose.nomeCliente}</h1>
        </div>
        <div className="text-primary/70 flex items-center gap-2">
          <FaCity style={{ color: '#fead61' }} />
          <h1 className="font-medium">
            {propose.cidade}/{propose.uf}
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaUser style={{ color: '#003d5b' }} />
          <h1 className="text-primary/70 text-xs font-medium">{propose.vendedor}</h1>
        </div>
        <div className="flex items-center gap-2">
          <BsTelephoneFill style={{ color: '#16B010' }} />
          <h1 className="text-primary/70 text-xs font-medium">{propose.telefoneVendedor ? propose.telefoneVendedor : 'NÃO FORNECIDO'}</h1>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex w-1/3 items-center justify-start gap-2">
          <FaSolarPanel style={{ color: ' rgb(217,119,6)' }} />
          <h1 className="text-primary/70 text-xs font-medium">{propose.qtdeModulos} MÓDULOS</h1>
        </div>
        <div className="flex w-1/3 items-center justify-center gap-2">
          <GoGraph style={{ color: 'blue' }} />
          <h1 className="text-primary/70 text-xs font-medium">{propose.eficienciaAtual}%</h1>
        </div>
        <div className="flex w-1/3 items-end justify-end gap-2">
          <AiFillThunderbolt style={{ color: 'red' }} />
          <h1 className="text-primary/70 text-xs font-medium">{propose.potModulos} W</h1>
        </div>
      </div>
      <div className="grid w-full grid-cols-3 items-center px-0 lg:px-4">
        {propose.estagio > 1 ? (
          <div onClick={() => moveStage(propose.estagio - 1)} className="flex cursor-pointer items-center justify-start">
            <AiOutlineArrowLeft />
          </div>
        ) : (
          <div></div>
        )}

        <div className="flex items-center justify-center gap-3">
          <a href={`https://app.ampereenergias.com.br/oem/pdfProposta/${propose._id}`} className="cursor-pointer text-sm font-medium text-blue-300">
            PROPOSTA
          </a>
          <BsFolderFill style={{ color: 'rgb(30,64,175)' }} />
        </div>
        {propose.estagio < 4 || !propose.estagio ? (
          <div onClick={() => moveStage(propose.estagio + 1)} className="flex cursor-pointer items-center justify-end">
            <AiOutlineArrowRight />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
export default CardProposta
