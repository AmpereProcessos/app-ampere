import axios from 'axios'
import React, { useState } from 'react'
import SelectInput from './SelectInput'
import TextInput from './TextInput'
import DateInput from './DateInput'
import NumberInput from './NumberInput'
import Link from 'next/link'
import { AiFillEye } from 'react-icons/ai'
import OSCreationBlock from './OSCreationBlock'
import dayjs from 'dayjs'
import ProjectServiceOrders from './identificador/ordensDeServico/ProjectServiceOrders'
import { formatDateAsLocale } from '../utils/methods/formatting'
function PadraoCard({ project }) {
  const [changes, setChanges] = useState({
    'projeto.fechamentoAC': project.projeto.fechamentoAC,
    'projeto.acStatus': project.projeto.acStatus,
  })
  const [osVisible, setOSVisible] = useState(false)
  const [ordensDeServico, setOrdens] = useState(project.ordensDeServico ? project.ordensDeServico : [])
  function handleChanges(mudancas) {
    axios
      .post('/api/gestaoDeObras/padroes', {
        id: project._id,
        mudancas: mudancas,
      })
      .then((res) => console.log(res.data))
  }
  return (
    <div className="w-full rounded border border-[#15599a] p-2">
      <div className="flex flex-col items-center justify-center gap-x-2 border-b border-gray-200 pb-2 lg:flex-row lg:justify-between">
        <div className="flex flex-col items-center justify-center">
          <strong className="text-[#15599a]">#{project.qtde} </strong>
          <p className="text-center font-bold">{project.nomeDoContrato}</p>
        </div>
        <div className="flex grow flex-wrap items-center justify-around gap-2">
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">PREVISÃO DE ENTREGA</p>
            <p className="text-xs uppercase text-gray-500">{formatDateAsLocale(project.compra.previsaoEntrega) || '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">CIDADE</p>
            <p className="text-xs uppercase text-gray-500">{project.cidade}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">BAIRRO</p>
            <p className="text-xs uppercase text-gray-500">{project.bairro}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">LOGRADOURO</p>
            <p className="text-xs uppercase text-gray-500">{project.logradouro}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">NÚMERO</p>
            <p className="text-xs uppercase text-gray-500">{project.numeroResidencia}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">DATA ASS.DOCUMENTAÇÃO</p>
            <p className="text-xs uppercase text-gray-500">
              {project.projeto?.dataAssDocumentacao ? new Date(project.projeto.dataAssDocumentacao).toLocaleDateString() : '-'}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">STATUS DO PARECER</p>
            <p className="text-xs uppercase text-gray-500">
              {project.parecer.statusDoParecerDeAcesso ? project.parecer.statusDoParecerDeAcesso : '-'}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">TIPO DO PADRÃO</p>
            <p className="text-xs uppercase text-gray-500">{project.padrao?.tipo ? project.padrao.tipo : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">RESP.PAGAMENTO DO PADRÃO</p>
            <p className="text-xs uppercase text-gray-500">{project.padrao?.respPagamento ? project.padrao.respPagamento : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">RESP.INSTALAÇÃO DO PADRÃO</p>
            <p className="text-xs uppercase text-gray-500">{project.padrao?.respInstalacao ? project.padrao.respInstalacao : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">VALOR DO PADRÃO</p>
            <p className="text-xs uppercase text-gray-500">{project.padrao?.valor ? project.padrao.valor : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">SAIDA DO CLIENTE</p>
            <p className="text-xs uppercase text-gray-500">{project.visitaTecnica.saidaDoCliente ? project.visitaTecnica.saidaDoCliente : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold uppercase text-[#15599a]">AMPERAGEM</p>
            <p className="text-xs uppercase text-gray-500">{project.visitaTecnica?.amperagem ? project.visitaTecnica.amperagem : '-'}</p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-around">
        <div className="flex flex-col">
          <h1 className="font-bold">DIA DA MONTAGEM</h1>
          <input
            type="date"
            value={changes['projeto.fechamentoAC'] ? new Date(changes['projeto.fechamentoAC']).toISOString().slice(0, 10) : null}
            onChange={(e) => {
              handleChanges({
                'projeto.fechamentoAC': new Date(e.target.value),
              })
              setChanges({
                ...changes,
                'projeto.fechamentoAC': new Date(e.target.value),
              })
            }}
          />
        </div>
        <SelectInput
          label={'STATUS AUMENTO DE CARGA'}
          editable={true}
          value={changes['projeto.acStatus']}
          options={[
            {
              label: 'PENDÊNCIA',
              value: 'PENDÊNCIA',
            },
            {
              label: 'REALIZADO',
              value: 'REALIZADO',
            },
            {
              label: 'SOLICITADO COM G.D',
              value: 'SOLICITADO COM G.D',
            },
          ]}
          handleChange={(value) => {
            handleChanges({ 'projeto.acStatus': value })
            setChanges({
              ...changes,
              'projeto.acStatus': value,
            })
          }}
        />
      </div>
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-x-2">
          <span className="py-2 text-center text-sm font-bold uppercase text-[#15599a]">ORDEM DE SERVIÇO</span>
          <button onClick={() => setOSVisible(!osVisible)} className="h-[20px] rounded bg-[#fead41] px-1 hover:bg-[#15599a] hover:text-white">
            <AiFillEye />
          </button>
        </div>
        {osVisible ? (
          <>
            <OSCreationBlock
              project={project}
              categories={[
                { label: 'PADRÃO', value: 'PADRÃO' },
                {
                  label: 'NÃO DEFINIDO',
                  value: 'NÃO DEFINIDO',
                },
              ]}
            />
            <ProjectServiceOrders projectId={project._id} />
          </>
        ) : (
          false
        )}
      </div>
    </div>
  )
}

export default PadraoCard
