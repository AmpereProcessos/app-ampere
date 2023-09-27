import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { equipesTecnicas, statusObra, tiposDeEstruturas, vendedores } from '../utils/constants'
import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import TextInput from './TextInput'
import SelectInput from './SelectInput'
import NotificationCreationBlock from './NotificationCreationBlock'
import DateInput from './DateInput'
import NumberInput from './NumberInput'
import Link from 'next/link'
import OSCreationBlock from './OSCreationBlock'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import { useKey } from '../utils/hooks'
import InfoPadraoBlock from './blocosInfoProjeto/InfoPadraoBlock'
import InfoEstruturaBlock from './blocosInfoProjeto/InfoEstruturaBlock'
import InfoSistemaBlock from './blocosInfoProjeto/InfoSistemaBlock'
import InfoVisitaTecnicaBlock from './blocosInfoProjeto/InfoVisitaTecnicaBlock'
import InfoClienteBlock from './blocosInfoProjeto/InfoClienteBlock'
import InfoArquivosBlock from './blocosInfoProjeto/InfoArquivosBlock'
import InfoObrasBlock from './blocosInfoProjeto/InfoObrasBlock'
import InfoMaterialBlock from './blocosInfoProjeto/InfoMaterialBlock'
import SaveButton from './utils/Buttons/SaveButton'
import ProjectServiceOrders from './identificador/ordensDeServico/ProjectServiceOrders'
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  width: '93%',
  height: '98%',
  borderRadius: '10px',
  padding: '10px',
  zIndex: 1000,
}
const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,.7)',
  zIndex: 1000,
}
function formataCPF(cpf) {
  //retira os caracteres indesejados...
  cpf = cpf.replace(/[^\d]/g, '')
  //realizar a formatação...
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
function formataCEP(cep) {
  cep = cep
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')

  return cep
}
function ModalObras({ open, setModalIsOpen, modalIsOpen, project, editor, handleUpdates, credentials }) {
  useKey('Escape', () => setModalIsOpen(false))

  const [infoHolder, setInfo] = useState(project)
  const [infoVisita, setInfoVisita] = useState({})
  const [msg, setMsg] = useState('')
  const [osMsg, setOsMsg] = useState({
    text: '',
    color: 'text-red-500',
  })
  const [changes, setChanges] = useState({})
  const [osInfo, setOsInfo] = useState({
    categoria: 'NÃO DEFINIDO',
    servicoExecutado: '',
    realizarCobranca: false,
    valorCobranca: 0,
    usuarioEmissor: '',
    grauDeUrgencia: 'NÃO DEFINIDO',
    observacoes: '',
    dataDeAbertura: new Date().toISOString(),
    agendar: false,
  })
  const [agendamentoInfo, setAgendamentoInfo] = useState({
    inicio: null,
    fim: null,
    msg: '',
  })
  async function handleChanges() {
    axios.post(`/api/projects/update/${project._id}`, changes).then((res) => {
      setMsg('Alterações feitas')
      handleUpdates(project._id)
    })
  }
  function handleOSChanges(id, index, date) {
    axios
      .put('/api/ordensDeServico/realizarCobranca', {
        id: id,
        index: index,
        date: date,
      })
      .then((res) => handleUpdates(project._id))
  }
  function handleOSCreation() {
    var arr
    if (!credentials?.controller) {
      setOsMsg({
        text: 'Usuário não autorizado para geração de OSs.',
        color: 'text-red-500',
      })
    } else {
      if (osInfo.servicoExecutado.trim().length < 5) {
        setOsMsg({
          text: 'Por favor, preencha o serviço a ser executado.',
          color: 'text-red-500',
        })
        return
      } else {
        if (infoHolder.ordensDeServico != undefined && infoHolder.ordensDeServico?.length > 0) {
          infoHolder.ordensDeServico.push({
            ...osInfo,
            usuarioEmissor: credentials?.name,
            index: infoHolder.ordensDeServico?.length,
            cobrancaRealizada: false,
          })
          arr = infoHolder.ordensDeServico
        } else {
          arr = [
            {
              ...osInfo,
              usuarioEmissor: credentials?.name,
              index: 0,
              cobrancaRealizada: false,
            },
          ]
          infoHolder.ordensDeServico = arr
        }
        axios.post('/api/ordensDeServico', { id: project._id, arr: arr }).then((res) => {
          setOsMsg({
            text: 'Ordem de serviço gerada',
            color: 'text-green-500',
          })
          setOsInfo({
            categoria: 'NÃO DEFINIDO',
            servicoExecutado: '',
            realizarCobranca: false,
            valorCobranca: 0,
            usuarioEmissor: '',
            grauDeUrgencia: 'NÃO DEFINIDO',
            observacoes: '',
            dataDeAbertura: new Date().toISOString(),
            agendar: false,
          })
          handleUpdates(project._id)
        })
      }
    }
  }
  function getVisitaInfo(id) {
    axios
      .post(`/api/solicitacoes/getVisitaTecnica/${id}`, {
        espacoQGBT: 1,
        adaptacaoQGBT: 1,
        avaliarTelhado: 1,
        dpsQGBT: 1,
        infraCabos: 1,
        distanciaItbaRural: 1,
        distanciaSistemaInversor: 1,
        realimentar: 1,
        temEstudoDeCaso: 1,
        obsObras: 1,
      })
      .then((res) => {
        setInfoVisita({
          espacoQGBT: res.data.espacoQGBT,
          adaptacaoQGBT: res.data.adaptacaoQGBT,
          avaliarTelhado: res.data.avaliarTelhado,
          dpsQGBT: res.data.dpsQGBT,
          infraCabos: res.data.infraCabos,
          distanciaItbaRural: res.data.distanciaItbaRural,
          distanciaSistemaInversor: res.data.distanciaSistemaInversor,
          realimentar: res.data.realimentar,
          temEstudoDeCaso: res.data.temEstudoDeCaso,
          obsObras: res.data.obsObras,
        })
      })
  }
  useEffect(() => {
    if (infoHolder.idVisitaTecnica?.trim().length > 10) {
      getVisitaInfo(infoHolder.idVisitaTecnica)
    }
  }, [])
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex flex-wrap justify-center mb-2 lg:mb-0 gap-2 items-center">
              <h1 className="text-[#15599a] pl-6 text-center font-bold">
                {infoHolder.qtde} - {infoHolder.nomeDoContrato}
              </h1>
              {infoHolder.codigoSVB && <p className="text-gray-600 text-sm font-bold">#{infoHolder.codigoSVB}</p>}
              {infoHolder.pagamento.credor == 'SOL FÁCIL' && (
                <div className="p-1 border border-red-500 text-sm text-center text-red-500 font-bold">POSSUI DESLIGAMENTO REMOTO</div>
              )}
            </div>
            <div className="flex gap-x-2 items-center">
              {msg && <p className={`hidden lg:block text-sm italic text-green-500`}>{msg}</p>}
              <SaveButton text={'Salvar alterações'} icon={<FaSave />} handleClick={handleChanges} />
              <button>
                <VscChromeClose onClick={() => setModalIsOpen(false)} style={{ color: 'red' }} />
              </button>
            </div>
            {msg && <p className={`block lg:hidden text-sm italic text-green-500`}>{msg}</p>}
          </div>
          <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y-auto">
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <NotificationCreationBlock nomeDoProjeto={project.nomeDoContrato} codProjeto={project.qtde} />
            </div>
            <InfoClienteBlock editor={false} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} project={project} />
            <InfoObrasBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              project={project}
              showDeliveryInfo={true}
              showMaterialInfo={true}
            />

            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg px-2">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">ORDENS DE SERVIÇO</span>
              <ProjectServiceOrders projectId={project._id} />
              <OSCreationBlock project={infoHolder} />
              {/* {infoHolder.ordensDeServico != undefined && infoHolder.ordensDeServico?.length > 0 && (
                <div className="w-full flex flex-col px-2 lg:px-10 border-t border-gray-200 mt-2">
                  <h1 className="text-[#fead61] font-bold">OSs GERADAS DO PROJETO</h1>
                  {infoHolder.ordensDeServico.map((ordem, index) => (
                    <div key={index} className="flex mt-1 items-center justify-around">
                      <div className="flex flex-col items-center">
                        <p className="uppercase text-gray-500">CATEGORIA</p>
                        <p className="text-xs uppercase">{ordem.categoria}</p>
                      </div>
                      <div className="hidden lg:flex flex-col items-center">
                        <p className="uppercase text-gray-500">SERVIÇO PARA EXECUÇÃO</p>
                        <p className="text-xs uppercase">{ordem.servicoExecutado}</p>
                      </div>
                      <div className="hidden lg:flex flex-col items-center">
                        <p className="uppercase text-gray-500">REALIZAR COBRANÇA?</p>
                        <p className="text-xs uppercase">{ordem.realizarCobranca ? 'SIM' : 'NÃO'}</p>
                      </div>
                      <div className="hidden lg:flex flex-col items-center">
                        <p className="uppercase text-gray-500">VALOR DA COBRANÇA</p>
                        <p className="text-xs uppercase">R$ {ordem.valorCobranca}</p>
                      </div>
                      <div className="hidden lg:flex flex-col items-center">
                        <p className="uppercase text-gray-500">EMISSOR DA OS</p>
                        <p className="text-xs uppercase">{ordem.usuarioEmissor}</p>
                      </div>
                      <div className="hidden lg:flex flex-col items-center">
                        <p className="uppercase text-gray-500">DATA DE ABERTURA</p>
                        <p className="text-xs uppercase">{new Date(ordem.dataDeAbertura).toLocaleDateString()}</p>
                      </div>
                      <div className="hidden lg:flex flex-col items-center">
                        <p className="uppercase text-gray-500">GRAU DE URGÊNCIA</p>
                        <p className="text-xs uppercase">{ordem.grauDeUrgencia}</p>
                      </div>
                      <Link href={`/ordemDeServico/pdf/${project._id}?index=${index}`}>
                        <button className="p-2 bg-[#fead61] font-bold rounded">VER OS</button>
                      </Link>
                    </div>
                  ))}
                </div>
              )} */}
            </div>
            <InfoSistemaBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              showPaymentInfo={false}
            />
            <InfoVisitaTecnicaBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
            {Object.keys(infoVisita).length > 0 && (
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">INFORMAÇÕES DO FORMULÁRIO DA VISITA</span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <div className="flex flex-col items-center pt-2 mt-2">
                    <div className="w-full flex items-center justify-center gap-2 flex-wrap">
                      <SelectInput
                        label={'ESPAÇO NO QGBT'}
                        editable={false}
                        value={infoVisita.espacoQGBT ? infoVisita.espacoQGBT : 'NÃO DEFINIDO'}
                        options={[
                          { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                          { label: 'NÃO', value: 'NÃO' },
                          { label: 'SIM', value: 'SIM' },
                        ]}
                        handleChange={(value) => setDados({ ...dados, espacoQGBT: value })}
                      />
                      <SelectInput
                        label={'ADAPTAÇÃO NO QGBT'}
                        editable={false}
                        value={infoVisita.adaptacaoQGBT ? infoVisita.adaptacaoQGBT : 'NÃO DEFINIDO'}
                        options={[
                          { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                          { label: 'CORTE', value: 'CORTE' },
                          { label: 'TRILHO', value: 'TRILHO' },
                          { label: 'CORTE E TRILHO', value: 'CORTE E TRILHO' },
                          { label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
                          { label: 'NÃO', value: 'NÃO' },
                        ]}
                        handleChange={(value) => setDados({ ...dados, adaptacaoQGBT: value })}
                      />
                      <SelectInput
                        label={'AVALIAR TELHADO'}
                        editable={false}
                        value={infoVisita.avaliarTelhado ? infoVisita.avaliarTelhado : 'NÃO DEFINIDO'}
                        options={[
                          { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                          { label: 'NÃO', value: 'NÃO' },
                          { label: 'SIM', value: 'SIM' },
                        ]}
                        handleChange={(value) => setDados({ ...dados, avaliarTelhado: value })}
                      />
                      <SelectInput
                        label={'DPS NO QGBT'}
                        editable={false}
                        value={infoVisita.dpsQGBT ? infoVisita.dpsQGBT : 'NÃO DEFINIDO'}
                        options={[
                          { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                          { label: 'NÃO', value: 'NÃO' },
                          { label: 'SIM', value: 'SIM' },
                        ]}
                        handleChange={(value) => setDados({ ...dados, dpsQGBT: value })}
                      />
                      <SelectInput
                        label={'INFRA PARA LANÇAMENTOS DE CABOS'}
                        editable={false}
                        value={infoVisita.infraCabos ? infoVisita.infraCabos : 'NÃO DEFINIDO'}
                        options={[
                          { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                          { label: 'KIT NORMAL', value: 'KIT NORMAL' },
                          { label: 'KIT+MANGUEIRA', value: 'KIT+MANGUEIRA' },
                          { label: 'PERSONALIZADO', value: 'PERSONALIZADO' },
                        ]}
                        handleChange={(value) => setDados({ ...dados, infraCabos: value })}
                      />
                      <TextInput
                        label={'DISTÂNCIA ITBA À ZONA RURAL'}
                        editable={false}
                        value={infoVisita.distanciaItbaRural}
                        handleChange={(value) => setDados({ ...dados, distanciaItbaRural: value })}
                      />
                      <TextInput
                        label={'DISTÂNCIA DO SISTEMA AO INVERSOR'}
                        editable={false}
                        value={infoVisita.distanciaSistemaInversor}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            distanciaSistemaInversor: value,
                          })
                        }
                      />
                      <SelectInput
                        label={'REALIMENTAR A FAZENDA ?'}
                        editable={false}
                        value={infoVisita.realimentar ? infoVisita.realimentar : 'NÃO DEFINIDO'}
                        options={[
                          { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                          { label: 'NÃO', value: 'NÃO' },
                          { label: 'SIM', value: 'SIM' },
                        ]}
                        handleChange={(value) => setDados({ ...dados, realimentar: value })}
                      />
                      <SelectInput
                        label={'TEM ESTUDO DE CASO?'}
                        editable={false}
                        value={infoVisita.temEstudoDeCaso ? infoVisita.temEstudoDeCaso : 'NÃO DEFINIDO'}
                        options={[
                          { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                          { label: 'NÃO', value: 'NÃO' },
                          { label: 'SIM', value: 'SIM' },
                        ]}
                        handleChange={(value) => setDados({ ...dados, temEstudoDeCaso: value })}
                      />
                    </div>
                    <div className="flex flex-col w-full self-center mt-2 items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">OBSERVAÇÕES P/OBRAS</span>
                      <textarea
                        value={infoVisita.obsObras}
                        readOnly={true}
                        placeholder={'Observações da obra aqui...'}
                        onChange={(e) => {
                          setDados({
                            ...dados,
                            obsObras: e.target.value.toUpperCase(),
                          })
                        }}
                        className="w-full text-center h-[100px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!['OPERAÇÃO E MANUTENÇÃO', 'BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
              <InfoPadraoBlock
                comercialEdition={false}
                technicalEdition={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
            )}
            {!['TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) && (
              <InfoEstruturaBlock
                comercialEdition={false}
                technicalEdition={true}
                infoHolder={infoHolder}
                project={project}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
            )}
            <InfoMaterialBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              showCircuitBreakers={true}
            />
            {/* <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                MATERIAL
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <SelectInput
                  label={"Separação do material"}
                  value={
                    infoHolder.material?.statusSeparacao
                      ? infoHolder.material?.statusSeparacao
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    {
                      label: "INICIAR SEPARAÇÃO",
                      value: "INICIAR SEPARAÇÃO",
                    },
                    {
                      label: "SEPARADO",
                      value: "SEPARADO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "material.statusSeparacao": value,
                    });
                    setInfo({
                      ...infoHolder,
                      material: {
                        ...infoHolder.material,
                        statusSeparacao: value,
                      },
                    });
                  }}
                />
                {credentials?.visualizacao == undefined && (
                  <>
                    {" "}
                    <NumberInput
                      tag={"R$"}
                      label={"Previsão de custos em insumos"}
                      editable={editor}
                      value={
                        infoHolder.material?.previsaoCustos != undefined &&
                        infoHolder.material?.previsaoCustos != "#VALUE!"
                          ? Number(infoHolder.material?.previsaoCustos).toFixed(
                              2
                            )
                          : 0
                      }
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          "material.previsaoCustos": Number(value).toFixed(2),
                        });
                        setInfo({
                          ...infoHolder,
                          material: {
                            ...infoHolder.material,
                            previsaoCustos: Number(value).toFixed(2),
                          },
                        });
                      }}
                    />
                    <NumberInput
                      tag={"R$"}
                      label={"Custos em insumos"}
                      editable={editor}
                      value={
                        infoHolder.material?.efetivoCustos != undefined &&
                        infoHolder.material?.efetivoCustos != "#VALUE!"
                          ? infoHolder.material?.efetivoCustos
                          : 0
                      }
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          "material.efetivoCustos": Number(value),
                        });
                        setInfo({
                          ...infoHolder,
                          material: {
                            ...infoHolder.material,
                            efetivoCustos: Number(value),
                          },
                        });
                      }}
                    />
                  </>
                )}
              </div>
            </div> */}
            <InfoArquivosBlock
              project={project}
              infoHolder={infoHolder}
              categories={[
                { label: 'DOCUMENTOS', value: 'links.documentos' },
                { label: 'CONTRATOS', value: 'links.contratos' },
                { label: 'EQUIPAMENTOS', value: 'links.equipamentos' },
                { label: 'PROJETOS', value: 'links.projetos' },
                { label: 'OBRAS', value: 'links.obras' },
                { label: 'VISITA TÉCNICA', value: 'links.visitaTecnica' },
              ]}
              handleUpdates={handleUpdates}
            />
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalObras
