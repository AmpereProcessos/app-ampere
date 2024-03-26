import axios from 'axios'
import dayjs from 'dayjs'
import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import DateInput from './DateInput'
import SelectInput from './SelectInput'
import TextInput from './TextInput'
import SaveButton from './utils/Buttons/SaveButton'
import { ImAttachment } from 'react-icons/im'
import { FaSave } from 'react-icons/fa'
import InfoArquivosBlock from './blocosInfoProjeto/InfoArquivosBlock'
import AnexoArquivo from './AnexoArquivo'
import { VscChromeClose } from 'react-icons/vsc'
import FileLinkBlock from '../components/utils/FileLinkBlock'
function ComissionamentoPosObraCard({ project, index, handleUpdates }) {
  const [info, setInfo] = useState(project)
  const [changes, setChanges] = useState({})
  const [msg, setMsg] = useState({ text: '', color: '' })
  const [showFileBlock, setShowFileBlock] = useState(false)
  function handleChanges() {
    if (info.jornada?.entregaTecnica == true) {
      if (info.jornada?.tipoEntregaTecnica == undefined || info.jornada?.tipoEntregaTecnica == 'NÃO DEFINIDO') {
        setMsg({
          text: 'Por favor, preencha o tipo de visita técnica',
          color: 'text-red-500',
        })
      } else {
        axios
          .post(`/api/projects/update/${project._id}`, changes)
          .then((res) => {
            setMsg({
              text: 'Alterações feitas !',
              color: 'text-green-400',
            })
          })
          .catch((err) =>
            setMsg({
              text: 'Houve um erro na alterações, por favor tente novamente',
              color: 'text-red-500',
            })
          )
      }
    } else {
      axios
        .post(`/api/projects/update/${project._id}`, changes)
        .then((res) => {
          setMsg({
            text: 'Alterações feitas !',
            color: 'text-green-400',
          })
        })
        .catch((err) =>
          setMsg({
            text: 'Houve um erro na alterações, por favor tente novamente',
            color: 'text-red-500',
          })
        )
    }
  }
  function getBorderColor(diff) {
    if (diff > 3) {
      return 'border-2 border-red-500'
    } else {
      return 'border border-[#15599a]'
    }
  }
  console.log(project)
  return (
    <motion.div
      initial={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.01 * index }}
      className={`flex flex-col ${getBorderColor(dayjs().diff(info.medidor.data, 'days'))} p-2`}
    >
      <div className="grid-rows-10 grid w-full grid-cols-1 lg:grid-cols-10 lg:grid-rows-1">
        <div className="col-span-1 row-span-1 flex flex-col justify-around">
          <h1 className="text-center font-bold text-[#15599a]">
            {info.nomeDoContrato} - ({info.qtde})
          </h1>
          {msg.text && <p className={`text-center text-xs italic ${msg.color}`}>{msg.text}</p>}
          <div className="flex items-center justify-center">
            <SaveButton text={'SALVAR'} icon={<FaSave />} handleClick={handleChanges} />
          </div>
        </div>
        <div className="col-span-9 row-span-5 flex flex-col">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <p className="text-xs font-bold text-[#15599a]">TROCA DO MEDIDOR</p>
              <p className="text-xs text-gray-600">{info.medidor.data ? dayjs(info.medidor.data).add(4, 'hours').format('DD/MM/YYYY') : '-'}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs font-bold text-[#15599a]">SAÍDA DE OBRA</p>
              <p className="text-xs text-gray-600">{info.obra.saida ? dayjs(info.obra.saida).add(4, 'hours').format('DD/MM/YYYY') : '-'}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs font-bold text-[#15599a]">EQUIPE RESP.</p>
              <p className="text-xs text-gray-600">{info.obra.equipeResp}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1">
            <DateInput
              label={'Usina Ligada'}
              editable={true}
              value={
                info.conferencias.usinaLigada.data != undefined && dayjs(info.conferencias.usinaLigada.data).isValid()
                  ? new Date(info.conferencias.usinaLigada.data).toISOString().slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setChanges({
                  ...changes,
                  'conferencias.usinaLigada.data': isNaN(value) ? new Date(value).toISOString() : null,
                  'conferencias.usinaLigada.status': isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
                })
                setInfo({
                  ...info,
                  conferencias: {
                    ...info.conferencias,
                    usinaLigada: {
                      data: isNaN(value) ? new Date(value).toISOString() : null,
                      status: isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
                    },
                  },
                })
              }}
            />
            <DateInput
              label={'Monitoramento feito'}
              editable={true}
              value={
                info.conferencias.monitoramentoFeito.data != undefined && dayjs(info.conferencias.monitoramentoFeito.data).isValid()
                  ? new Date(info.conferencias.monitoramentoFeito.data).toISOString().slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setChanges({
                  ...changes,
                  'conferencias.monitoramentoFeito.data': isNaN(value) ? new Date(value).toISOString() : null,
                  'conferencias.monitoramentoFeito.status': isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
                })
                setInfo({
                  ...info,
                  conferencias: {
                    ...info.conferencias,
                    monitoramentoFeito: {
                      data: isNaN(value) ? new Date(value).toISOString() : null,
                      status: isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
                    },
                  },
                })
              }}
            />
            <DateInput
              label={'Data APP no celular'}
              editable={true}
              value={info.app.data != undefined && dayjs(info.app.data).isValid() ? new Date(info.app.data).toISOString().slice(0, 10) : 0}
              handleChange={(value) => {
                setChanges({
                  ...changes,
                  'app.data': isNaN(value) ? new Date(value).toISOString() : null,
                })
                setInfo({
                  ...info,
                  app: {
                    ...info.app,
                    data: isNaN(value) ? new Date(value).toISOString() : null,
                  },
                })
              }}
            />
            <DateInput
              label={'Energia Injetada'}
              editable={true}
              value={
                info.conferencias.energiaInjetada.data != undefined && dayjs(info.conferencias.energiaInjetada.data).isValid()
                  ? new Date(info.conferencias.energiaInjetada.data).toISOString().slice(0, 10)
                  : 0
              }
              handleChange={(value) => {
                setChanges({
                  ...changes,
                  'conferencias.energiaInjetada.data': isNaN(value) ? new Date(value).toISOString() : null,
                  'conferencias.energiaInjetada.status': isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
                })
                setInfo({
                  ...info,
                  conferencias: {
                    ...info.conferencias,
                    energiaInjetada: {
                      data: isNaN(value) ? new Date(value).toISOString() : null,
                      status: isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
                    },
                  },
                })
              }}
            />
            <TextInput
              label={'LOGIN NO APP'}
              value={info.app.login ? info.app.login : ''}
              normalCase={true}
              editable={true}
              handleChange={(value) => {
                setChanges({
                  ...changes,
                  'app.login': value,
                })
                setInfo({
                  ...info,
                  app: {
                    ...info.app,
                    login: value,
                  },
                })
              }}
            />
            <TextInput
              label={'SENHA NO APP'}
              value={info.app.senha}
              normalCase={true}
              editable={true}
              handleChange={(value) => {
                setChanges({
                  ...changes,
                  'app.senha': value,
                })
                setInfo({
                  ...info,
                  app: {
                    ...info.app,
                    senha: value,
                  },
                })
              }}
            />
            <SelectInput
              label={'TIPO DA ENTREGA TÉCNICA'}
              editable={true}
              value={info.jornada?.tipoEntregaTecnica ? info.jornada.tipoEntregaTecnica : 'NÃO DEFINIDO'}
              options={[
                {
                  label: 'NÃO DEFINIDO',
                  value: 'NÃO DEFINIDO',
                },
                {
                  label: 'PRESENCIAL',
                  value: 'PRESENCIAL',
                },
                {
                  label: 'REMOTO',
                  value: 'REMOTO',
                },
              ]}
              handleChange={(value) => {
                setChanges({ ...changes, 'jornada.tipoEntregaTecnica': value })
                setInfo({
                  ...info,
                  jornada: {
                    ...info.jornada,
                    tipoEntregaTecnica: value,
                  },
                })
              }}
            />
            <div className="flex w-[350px] flex-col items-center">
              <span className="text-center font-raleway text-sm font-bold uppercase">ENTREGA TÉCNICA</span>
              <div className="flex">
                <input
                  checked={info.jornada?.entregaTecnica}
                  onChange={(e) => {
                    setChanges({
                      ...changes,
                      'jornada.entregaTecnica': e.target.checked,
                      'jornada.dataEntregaTecnicaRemota': e.target.checked == true ? new Date().toISOString() : null,
                    })
                    setInfo({
                      ...info,
                      jornada: {
                        ...info.jornada,
                        entregaTecnica: e.target.checked,
                      },
                    })
                  }}
                  type="checkbox"
                  name="entregaTecnica"
                  id="entregaTecnica"
                />
                <label className="ml-2" htmlFor="entregaTecnica">
                  FEITA ?
                </label>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <div></div>
            <SelectInput
              label={'DIAGNÓSTICO'}
              value={info.oem?.diagnostico ? info.oem?.diagnostico : 'NÃO DEFINIDO'}
              editable={true}
              options={[
                {
                  label: 'MICRO/INVERSOR DESCONFIGURADO',
                  value: 'MICRO/INVERSOR DESCONFIGURADO',
                },
                {
                  label: 'CLIENTE SEM INTERNET',
                  value: 'CLIENTE SEM INTERNET',
                },
                {
                  label: 'TEMPO DE O&M VENCIDO',
                  value: 'TEMPO DE O&M VENCIDO',
                },
                {
                  label: 'EQUIPAMENTOS PARA GARANTIA',
                  value: 'EQUIPAMENTOS PARA GARANTIA',
                },
                {
                  label: 'ROTEADOR COMPATÍVEL',
                  value: 'ROTEADOR COMPATÍVEL',
                },
                {
                  label: 'NÃO DEFINIDO',
                  value: 'NÃO DEFINIDO',
                },
              ]}
              handleChange={(value) => {
                setChanges({ ...changes, 'oem.diagnostico': value })
                setInfo({
                  ...info,
                  oem: {
                    ...info.oem,
                    diagnostico: value,
                  },
                })
              }}
            />
            <div className="flex items-center justify-center text-red-500">
              {showFileBlock ? (
                <VscChromeClose
                  onClick={() => setShowFileBlock(false)}
                  style={{
                    color: 'rgb(239,68,68)',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                />
              ) : (
                <ImAttachment
                  onClick={() => setShowFileBlock(true)}
                  style={{
                    color: 'rgb(107,114,128)',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {showFileBlock ? (
        <div className="flex w-full flex-col items-center">
          <div className="w-full lg:w-1/2">
            <AnexoArquivo
              id={project._id}
              prevLinks={project.links ? project.links : {}}
              client={`${project.nomeDoContrato}-${project.codigoSVB}`}
              categories={[
                { label: 'OBRAS', value: 'links.obras' },
                {
                  label: 'MANUTENÇÃO CORRETIVA',
                  value: 'links.manutencaoCorretiva',
                },
              ]}
              handleUpdates={() => handleUpdates()}
            />
          </div>
          {project.links && (
            <div className="mt-3 flex flex-wrap justify-center gap-2 gap-y-4">
              {Object.keys(project.links).map((category, index) =>
                project.links[category]?.length > 0 ? (
                  <div key={index} className="flex w-full flex-col p-1 shadow-sm lg:w-[45%]">
                    <h1 className="text-center font-bold text-green-500">{category.toUpperCase()}</h1>
                    <div className="flex flex-col items-center gap-1">
                      {project.links[category].map((obj, index2) => (
                        <FileLinkBlock
                          key={index2}
                          obj={obj}
                          deleteFile={(obj) =>
                            setMsg({
                              text: 'Exclusão de arquivos não permitida nessa área.',
                              color: 'text-red-500',
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      ) : null}
    </motion.div>
  )
}

export default ComissionamentoPosObraCard
