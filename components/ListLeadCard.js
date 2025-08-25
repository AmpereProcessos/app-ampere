import axios from 'axios'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { BsPatchCheckFill } from 'react-icons/bs'
import { FaCity, FaHandshake, FaUser, FaUserTie } from 'react-icons/fa'
import { HiIdentification } from 'react-icons/hi'
import { IoIosSend, IoMdClose } from 'react-icons/io'
import { CgCode } from 'react-icons/cg'
import { MdAttachMoney, MdOutlineCategory } from 'react-icons/md'
import { RiUser2Fill } from 'react-icons/ri'
import { VscChromeClose } from 'react-icons/vsc'

function ListLeadCard({ lead, fetchLeads }) {
  const [loseLeadInfo, setLoseLeadInfo] = useState({
    open: false,
    justification: '',
    msg: '',
    msgColor: '',
  })
  const [{ isDragging, targetId }, dragRef] = useDrag({
    type: 'CARD',
    item: { id: lead._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      targetId: monitor.getTargetIds(),
    }),
  })

  async function moveStage(listId) {
    try {
      await axios.put('/api/insideSales', {
        id: lead._id,
        changes: {
          estagioFunil: listId,
        },
      })
      fetchLeads()
    } catch (error) {
      alert('Erro ao atualizar estágio do lead. Por favor, tente novamente mais tarde.')
    }
  }
  async function setAsLost(leadId) {
    if (loseLeadInfo.justification.trim().length < 5) {
      setLoseLeadInfo((prev) => ({
        ...prev,
        msg: 'Por favor, preencha o motido da perda do lead.',
        msgColor: 'text-red-500',
      }))
      return false
    }
    try {
      await axios.put('/api/insideSales', {
        id: leadId,
        changes: {
          perdido: true,
          motivoPerda: loseLeadInfo.justification.toUpperCase(),
        },
      })
      setLoseLeadInfo((prev) => ({
        ...prev,
        msg: 'Lead marcado como perdido.',
        msgColor: 'text-green-500',
      }))
      setTimeout(() => {
        setLoseLeadInfo({
          open: false,
          justification: '',
          msg: '',
          msgColor: '',
        })
        fetchLeads()
      }, 2000)
    } catch (error) {
      alert('Erro ao atualizar lead. Por favor, tente novamente mais tarde.')
    }
  }
  const conditionalProp = { ref: dragRef }

  return (
    <div
      {...conditionalProp}
      key={lead._id}
      className={`flex h-[190px] min-h-[190px] w-full flex-col gap-3 p-3 ${lead.perdido ? 'bg-red-100' : 'bg-background'} border-primary/20 border shadow-md`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="text-primary/70 flex grow items-center justify-start gap-1 text-xs">
          <CgCode style={{ color: '#003d5b', fontSize: '20px' }} />
          <h1 className="font-medium">{lead.codigoSVB}</h1>
        </div>
        <div className="text-primary/70 flex grow-2 items-center justify-center gap-2 text-xs">
          <FaUserTie style={{ color: '#003d5b', fontSize: '20px' }} />
          <h1 className="font-medium">{lead.vendedor}</h1>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="text-primary/70 flex items-center gap-2">
          <HiIdentification style={{ color: '#15599a' }} />
          <h1 className="text-xs font-medium">{lead.nome}</h1>
        </div>
        <div className="flex items-center gap-2">
          {lead.contratoSolicitado ? (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <BsPatchCheckFill />
            </div>
          ) : null}
          {lead.contratoAssinado ? (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <FaHandshake style={{ fontSize: '20px' }} />
            </div>
          ) : null}
        </div>

        <div className="text-primary/70 flex items-center gap-2">
          <FaCity style={{ color: '#fead61' }} />
          <h1 className="text-xs font-medium">{lead.cidade}</h1>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="text-primary/70 flex items-center gap-2">
          <FaUser style={{ color: '#003d5b' }} />
          <h1 className="text-xs font-medium">{lead.responsavel}</h1>
        </div>
        <div className="text-primary/70 flex items-center gap-2">
          <IoIosSend style={{ color: '#16B010' }} />
          <h1 className="text-xs font-medium">{lead.dataDeEnvio ? dayjs(lead.dataDeEnvio).add(4, 'hour').format('DD/MM/YYYY') : '-'}</h1>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="text-primary/70 flex flex-col items-start">
          <h1 className="text-xxs font-medium">CONSUMO</h1>
          <h1 className="text-xs font-medium">
            R${' '}
            {lead.consumo
              ? Number(lead.consumo).toLocaleString('pt-br', {
                  minimumFractionDigits: 2,
                })
              : '-'}
          </h1>
        </div>
        <div className="text-primary/70 flex flex-col items-end">
          <h1 className="text-xxs font-medium">NICHO</h1>
          <h1 className="text-xs font-medium">{lead.nicho ? lead.nicho : '-'}</h1>
        </div>
      </div>
      <div className="grid w-full grid-cols-3 items-center px-0 lg:px-4">
        {lead.estagioFunil > 1 ? (
          <div onClick={() => moveStage(lead.estagioFunil - 1)} className="flex cursor-pointer items-center justify-start">
            <AiOutlineArrowLeft />
          </div>
        ) : (
          <div></div>
        )}

        <div className="relative flex items-start justify-center">
          {!lead.perdido ? (
            loseLeadInfo.open ? (
              <div className="bg-background border-primary/20 absolute flex h-[150px] w-[200%] flex-col border p-2 shadow-lg">
                <div className="border-primary/20 flex w-full items-center justify-between border-b pb-1 text-xs">
                  <h1 className="font-medium">PERDA DE LEAD</h1>
                  <button>
                    <VscChromeClose onClick={() => setLoseLeadInfo((prev) => ({ ...prev, open: false }))} style={{ color: 'red' }} />
                  </button>
                </div>
                <textarea
                  value={loseLeadInfo.justification}
                  onChange={(e) =>
                    setLoseLeadInfo((prev) => ({
                      ...prev,
                      justification: e.target.value,
                    }))
                  }
                  placeholder="Motivo da perda do lead, ex: cliente optou por outra empresa, o preço estava alto, etc..."
                  className="bg-primary/20 w-full grow resize-none p-1 text-xs outline-hidden"
                />
                <div className="mt-1 flex w-full items-center justify-between">
                  {loseLeadInfo.msg ? <p className={`text-xs ${loseLeadInfo.msgColor} italic`}>{loseLeadInfo.msg}</p> : <div></div>}
                  <button onClick={() => setAsLost(lead._id)} className="rounded bg-red-300 p-1 text-xs font-medium text-white hover:bg-red-500">
                    PERDER
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setLoseLeadInfo((prev) => ({ ...prev, open: true }))}
                className="flex cursor-pointer items-center gap-1 rounded border border-red-300 p-1 text-red-300 duration-300 hover:scale-105 hover:border-red-500 hover:text-red-500"
              >
                <p className="text-xs">PERDER</p>
                <IoMdClose />
              </div>
            )
          ) : (
            <div>
              <p className="text-xs text-red-500">PERDIDO</p>
            </div>
          )}
        </div>
        {lead.estagioFunil < 3 || !lead.estagioFunil ? (
          <div onClick={() => moveStage(lead.estagioFunil ? lead.estagioFunil + 1 : 2)} className="flex cursor-pointer items-center justify-end">
            <AiOutlineArrowRight />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default ListLeadCard
