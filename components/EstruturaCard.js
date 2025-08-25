import axios from 'axios'
import React, { useState } from 'react'
import SelectInput from './SelectInput'

import dayjs from 'dayjs'

function EstruturaCard({ project }) {
  const [changes, setChanges] = useState({
    'estruturaPersonalizada.dataMontagem': project.estruturaPersonalizada.dataMontagem,
    'estruturaPersonalizada.status': project.estruturaPersonalizada.status,
  })
  const [osVisible, setOSVisible] = useState(false)
  const [ordensDeServico, setOrdens] = useState(project.ordensDeServico)
  function handleChanges(mudancas) {
    axios
      .post('/api/gestao-obras/estruturas', {
        id: project._id,
        mudancas: mudancas,
      })
      .then((res) => console.log(res.data))
  }
  return (
    <div className="w-full rounded border border-[#15599a] p-2">
      <div className="border-primary/20 flex flex-col items-center justify-between gap-x-2 border-b pb-2 lg:grid lg:grid-cols-10">
        <div className="col-span-2 flex flex-col items-center justify-center">
          <strong className="text-[#15599a]">#{project.qtde} </strong>
          <p className="text-center font-bold">{project.nomeDoContrato}</p>
        </div>
        <div className="col-span-8 flex grow flex-wrap items-center justify-around gap-2">
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">PAGAMENTO DO KIT</p>
            <p className="text-primary/60 text-xs uppercase">{project.compra.statusLiberacao}</p>
          </div>
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">CIDADE</p>
            <p className="text-primary/60 text-xs uppercase">{project.cidade}</p>
          </div>
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">BAIRRO</p>
            <p className="text-primary/60 text-xs uppercase">{project.bairro}</p>
          </div>
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">LOGRADOURO</p>
            <p className="text-primary/60 text-xs uppercase">{project.logradouro}</p>
          </div>
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">NÚMERO</p>
            <p className="text-primary/60 text-xs uppercase">{project.numeroResidencia}</p>
          </div>
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">STATUS DA ENTREGA</p>
            <p className="text-primary/60 text-xs uppercase">{project.compra.statusEntrega ? project.compra.statusEntrega : '-'}</p>
          </div>
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">
              {project.compra.statusEntrega == 'ENTREGUE' ? 'DATA DE ENTREGA' : 'PREVISÃO DE ENTREGA'}
            </p>
            <p className="text-primary/60 text-xs uppercase">
              {project.compra.statusEntrega == 'ENTREGUE'
                ? project.compra.dataEntrega
                  ? dayjs(new Date(project.compra.dataEntrega)).add(4, 'hours').format('DD/MM/YYYY')
                  : dayjs(new Date(project.compra.previsaoEntrega)).add(4, 'hours').format('DD/MM/YYYY')
                : project.compra.previsaoEntrega
                  ? dayjs(new Date(project.compra.previsaoEntrega)).add(4, 'hours').format('DD/MM/YYYY')
                  : '-'}
            </p>
          </div>
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">TIPO DA ESTRUTURA</p>
            <p className="text-primary/60 text-xs uppercase">{project.estruturaPersonalizada?.tipo ? project.estruturaPersonalizada?.tipo : '-'}</p>
          </div>
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">RESP.PAGAMENTO DA ESTRUTURA</p>
            <p className="text-primary/60 text-xs uppercase">
              {project.estruturaPersonalizada?.respPagamento ? project.estruturaPersonalizada?.respPagamento : '-'}
            </p>
          </div>
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">VALOR DA ESTRUTURA</p>
            <p className="text-primary/60 text-xs uppercase">{project.estruturaPersonalizada?.valor ? project.estruturaPersonalizada?.valor : '-'}</p>
          </div>
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">ENTREGA DA ESTRUTURA</p>
            <p className="text-primary/60 text-xs uppercase">
              {project.estruturaPersonalizada?.statusEntrega ? project.estruturaPersonalizada?.statusEntrega : '-'}
            </p>
          </div>
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">DATA DE ENTREGA DA ESTRUTURA</p>
            <p className="text-primary/60 text-xs uppercase">
              {project.estruturaPersonalizada?.dataEntrega
                ? dayjs(project.estruturaPersonalizada?.dataEntrega).add(4, 'hours').format('DD/MM/YYYY')
                : '-'}
            </p>
          </div>
          <div className="flex w-[200px] flex-col items-center">
            <p className="text-sm font-bold text-[#15599a] uppercase">NºModulos</p>
            <p className="text-primary/60 text-xs uppercase">{project.sistema.qtdeModulos ? project.sistema.qtdeModulos : '-'}</p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-around">
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
      {/* <div className="flex flex-col items-center">
				<div className="flex items-center gap-x-2">
					<span className="py-2 text-center text-sm font-bold uppercase text-[#15599a]">ORDEM DE SERVIÇO</span>
					<button onClick={() => setOSVisible(!osVisible)} className="h-[20px] rounded bg-[#fead41] px-1  hover:bg-[#15599a] hover:text-white">
						<AiFillEye />
					</button>
				</div>
				{osVisible ? (
					<>
						<OSCreationBlock
							project={project}
							categories={[
								{ label: "ESTRUTURA", value: "ESTRUTURA" },
								{
									label: "NÃO DEFINIDO",
									value: "NÃO DEFINIDO",
								},
							]}
						/>
						<ProjectServiceOrders projectId={project._id} />
					</>
				) : (
					false
				)}
			</div> */}
    </div>
  )
}

export default EstruturaCard
