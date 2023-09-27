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
function EstruturaCard({ project, credentials }) {
  const [changes, setChanges] = useState({
    'estruturaPersonalizada.dataMontagem': project.estruturaPersonalizada.dataMontagem,
    'estruturaPersonalizada.status': project.estruturaPersonalizada.status,
  })
  const [osVisible, setOSVisible] = useState(false)
  const [ordensDeServico, setOrdens] = useState(project.ordensDeServico)
  function handleChanges(mudancas) {
    axios
      .post('/api/gestaoDeObras/estruturas', {
        id: project._id,
        mudancas: mudancas,
      })
      .then((res) => console.log(res.data))
  }
  return (
    <div className="w-full p-2 border border-[#15599a] rounded">
      <div className="flex flex-col lg:grid lg:grid-cols-10 items-center gap-x-2 justify-between border-b border-gray-200 pb-2">
        <div className="flex flex-col justify-center items-center col-span-2">
          <strong className="text-[#15599a]">#{project.qtde} </strong>
          <p className="font-bold text-center">{project.nomeDoContrato}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center grow justify-around col-span-8">
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">PAGAMENTO DO KIT</p>
            <p className="text-xs uppercase text-gray-500">{project.compra.statusLiberacao}</p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">CIDADE</p>
            <p className="text-xs uppercase text-gray-500">{project.cidade}</p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">BAIRRO</p>
            <p className="text-xs uppercase text-gray-500">{project.bairro}</p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">LOGRADOURO</p>
            <p className="text-xs uppercase text-gray-500">{project.logradouro}</p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">NÚMERO</p>
            <p className="text-xs uppercase text-gray-500">{project.numeroResidencia}</p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">STATUS DA ENTREGA</p>
            <p className="text-xs uppercase text-gray-500">{project.compra.statusEntrega ? project.compra.statusEntrega : '-'}</p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">
              {project.compra.statusEntrega == 'ENTREGUE' ? 'DATA DE ENTREGA' : 'PREVISÃO DE ENTREGA'}
            </p>
            <p className="text-xs uppercase text-gray-500">
              {project.compra.statusEntrega == 'ENTREGUE'
                ? project.compra.dataEntrega
                  ? dayjs(new Date(project.compra.dataEntrega)).add(4, 'hours').format('DD/MM/YYYY')
                  : dayjs(new Date(project.compra.previsaoEntrega)).add(4, 'hours').format('DD/MM/YYYY')
                : project.compra.previsaoEntrega
                ? dayjs(new Date(project.compra.previsaoEntrega)).add(4, 'hours').format('DD/MM/YYYY')
                : '-'}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">TIPO DA ESTRUTURA</p>
            <p className="text-xs uppercase text-gray-500">{project.estruturaPersonalizada?.tipo ? project.estruturaPersonalizada?.tipo : '-'}</p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">RESP.PAGAMENTO DA ESTRUTURA</p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.respPagamento ? project.estruturaPersonalizada?.respPagamento : '-'}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">VALOR DA ESTRUTURA</p>
            <p className="text-xs uppercase text-gray-500">{project.estruturaPersonalizada?.valor ? project.estruturaPersonalizada?.valor : '-'}</p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">ENTREGA DA ESTRUTURA</p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.statusEntrega ? project.estruturaPersonalizada?.statusEntrega : '-'}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">DATA DE ENTREGA DA ESTRUTURA</p>
            <p className="text-xs uppercase text-gray-500">
              {project.estruturaPersonalizada?.dataEntrega
                ? dayjs(project.estruturaPersonalizada?.dataEntrega).add(4, 'hours').format('DD/MM/YYYY')
                : '-'}
            </p>
          </div>
          <div className="flex flex-col items-center w-[200px]">
            <p className="text-sm uppercase text-[#15599a] font-bold">NºModulos</p>
            <p className="text-xs uppercase text-gray-500">{project.sistema.qtdeModulos ? project.sistema.qtdeModulos : '-'}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-around mt-2">
        <div className="flex flex-col">
          <h1 className="font-bold">DIA DA MONTAGEM</h1>
          <input
            type="date"
            value={
              changes['estruturaPersonalizada.dataMontagem']
                ? new Date(changes['estruturaPersonalizada.dataMontagem']).toISOString().slice(0, 10)
                : null
            }
            onChange={(e) => {
              handleChanges({
                'estruturaPersonalizada.dataMontagem': new Date(e.target.value),
              })
              setChanges({
                ...changes,
                'estruturaPersonalizada.dataMontagem': new Date(e.target.value),
              })
            }}
          />
        </div>
        <SelectInput
          label={'STATUS da estrutura personalizada'}
          editable={true}
          value={changes['estruturaPersonalizada.status']}
          options={[
            { label: 'PRONTA', value: 'PRONTA' },
            { label: 'PENDÊNCIA', value: 'PENDÊNCIA' },
            { label: 'N/A', value: 'N/A' },
          ]}
          handleChange={(value) => {
            handleChanges({
              'estruturaPersonalizada.status': value,
            })
            setChanges({
              ...changes,
              'estruturaPersonalizada.status': value,
            })
          }}
        />
      </div>
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-x-2">
          <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">ORDEM DE SERVIÇO</span>
          <button onClick={() => setOSVisible(!osVisible)} className="px-1 h-[20px] rounded bg-[#fead41]  hover:bg-[#15599a] hover:text-white">
            <AiFillEye />
          </button>
        </div>
        {osVisible ? (
          <>
            <OSCreationBlock
              project={project}
              categories={[
                { label: 'ESTRUTURA', value: 'ESTRUTURA' },
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

export default EstruturaCard
