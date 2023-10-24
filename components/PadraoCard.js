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
function PadraoCard({ project, credentials }) {
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
    <div className="w-full p-2 border border-[#15599a] rounded">
      <div className="flex flex-col justify-center lg:flex-row items-center gap-x-2 lg:justify-between border-b border-gray-200 pb-2">
        <div className="flex flex-col justify-center items-center">
          <strong className="text-[#15599a]">#{project.qtde} </strong>
          <p className="font-bold text-center">{project.nomeDoContrato}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center grow justify-around">
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">PREVISÃO DE ENTREGA</p>
            <p className="text-xs uppercase text-gray-500">{formatDateAsLocale(project.compra.previsaoEntrega) || '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">CIDADE</p>
            <p className="text-xs uppercase text-gray-500">{project.cidade}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">BAIRRO</p>
            <p className="text-xs uppercase text-gray-500">{project.bairro}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">LOGRADOURO</p>
            <p className="text-xs uppercase text-gray-500">{project.logradouro}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">NÚMERO</p>
            <p className="text-xs uppercase text-gray-500">{project.numeroResidencia}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">DATA ASS.DOCUMENTAÇÃO</p>
            <p className="text-xs uppercase text-gray-500">
              {project.projeto?.dataAssDocumentacao ? new Date(project.projeto.dataAssDocumentacao).toLocaleDateString() : '-'}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">STATUS DO PARECER</p>
            <p className="text-xs uppercase text-gray-500">
              {project.parecer.statusDoParecerDeAcesso ? project.parecer.statusDoParecerDeAcesso : '-'}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">TIPO DO PADRÃO</p>
            <p className="text-xs uppercase text-gray-500">{project.padrao?.tipo ? project.padrao.tipo : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">RESP.PAGAMENTO DO PADRÃO</p>
            <p className="text-xs uppercase text-gray-500">{project.padrao?.respPagamento ? project.padrao.respPagamento : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">RESP.INSTALAÇÃO DO PADRÃO</p>
            <p className="text-xs uppercase text-gray-500">{project.padrao?.respInstalacao ? project.padrao.respInstalacao : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">VALOR DO PADRÃO</p>
            <p className="text-xs uppercase text-gray-500">{project.padrao?.valor ? project.padrao.valor : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">SAIDA DO CLIENTE</p>
            <p className="text-xs uppercase text-gray-500">{project.visitaTecnica.saidaDoCliente ? project.visitaTecnica.saidaDoCliente : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase text-[#15599a] font-bold">AMPERAGEM</p>
            <p className="text-xs uppercase text-gray-500">{project.visitaTecnica?.amperagem ? project.visitaTecnica.amperagem : '-'}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-around mt-2">
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
          <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">ORDEM DE SERVIÇO</span>
          <button onClick={() => setOSVisible(!osVisible)} className="px-1 h-[20px] rounded bg-[#fead41] hover:bg-[#15599a] hover:text-white">
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
