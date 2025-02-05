import React, { useState } from 'react'
import AllCities from '@/utils/jsons/cidades.json'
import { TServiceOrder, TServiceOrderDTO } from '@/utils/schemas/service-order'
import SelectInput from '@/components/inputs/Select'
import { equipesTecnicas, serviceOrdersCategories, tiposDeEstruturas, tiposDePadrao, tiposDeTelha } from '@/utils/constants'
import TextInput from '@/components/inputs/Text'
import NumberInput from '@/components/inputs/Number'
import TakeMaterialsBlock from '@/components/identificador/ordensDeServico/TakeMaterialsBlock'
import toast from 'react-hot-toast'
import AvailableMaterialsBlock from '@/components/identificador/ordensDeServico/AvailableMaterialsBlock'
import CheckboxInput from '@/components/inputs/Checkbox'
import ServiceOrderPDF from '@/components/OSMontagemPDF'
import PadraoOS from '@/components/PadraoOS'
import PreventivaOS from '@/components/PreventivaOS'
import OSCorretiva from '@/components/OSCorretivaPDF'
import { formatToCEP } from '@/utils/methods/formatting'
import { getCEPInfo } from '@/utils/methods/shared'
import { estadosECidades } from '@/utils/estados_cidades'
import SelectVirtualizedInput from '@/components/inputs/SelectVirtualized'
import Logo from '@/utils/images/logo-texto-azul-vertical.png'
import Image from 'next/image'
import ObservationModalBlock from '@/components/identificador/ordensDeServico/modals/blocos/utils/Observations'
function OrdemServicoEmBranco() {
  const [infoHolder, setInfoHolder] = useState<TServiceOrder>({
    categoria: 'MONTAGEM',
    favorecido: {
      nome: '',
      contato: '',
    },
    projeto: {
      id: '', // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
      nome: '', // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
      identificador: 1, // identificador QTDE do projeto no banco de projetos
      tipo: '', // tipo do projeto
    },
    descricao: '', // servico executado
    localizacao: {
      cep: '',
      uf: '',
      cidade: '',
      bairro: '',
      endereco: '',
      numeroOuIdentificador: '',
    },
    responsavel: {
      nome: '',
      tipo: 'EXTERNO',
    },
    // configurar: false,
    urgencia: 'POUCO URGENTE',
    periodo: {
      inicio: null,
      fim: null,
    },
    pagamento: {
      recebedor: null,
      valor: null,
    },
    cobranca: {
      pagador: null,
      valor: null,
    },
    autor: {
      id: '',
      nome: '',
      avatar_url: null,
    },
    equipamentos: {
      modulos: {
        modelo: '',
        qtde: 0,
        potencia: 0,
      },
      inversor: {
        modelo: '',
        qtde: 0,
        potencia: 0,
      },
      disponivel: [],
      retirada: [],
    },
    detalhes: {
      pontoAgua: '',
      senhaWifi: '',
      configuracaoMonitoramento: false,
      possuiTrafo: false,
      tipoEstrutura: '',
      tipoTelha: undefined,
      tipoPadrao: '',
      tipoSaidaPadrao: 'N/A',
      amperagemPadrao: '',
      responsabilidadePadrao: 'NÃO SE APLICA',
      topologia: '',
    },
    observacoes: [],
    anotacoes: '',
    dataInsercao: new Date().toISOString(),
  })
  async function setAddressDataByCEP(cep: string) {
    const addressInfo = await getCEPInfo(cep)
    const toastID = toast.loading('Buscando informações sobre o CEP...', {
      duration: 2000,
    })
    setTimeout(() => {
      if (addressInfo) {
        toast.dismiss(toastID)
        toast.success('Dados do CEP buscados com sucesso.', {
          duration: 1000,
        })
        setInfoHolder((prev) => ({
          ...prev,
          localizacao: {
            ...prev.localizacao,
            endereco: addressInfo.logradouro,
            bairro: addressInfo.bairro,
            uf: addressInfo.uf,
            cidade: addressInfo.localidade.toUpperCase(),
          },
        }))
      }
    }, 1000)
  }
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-[80%] flex-col rounded-md border border-gray-500 print:hidden">
        <h1 className="w-full bg-gray-800 py-2 text-center font-bold text-white">PREENCHIMENTO DE DADOS</h1>
        <div className="flex w-full flex-col p-2">
          <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-[50%]">
              <TextInput
                label={'NOME DO FAVORECIDO'}
                placeholder={'Preencha o nome do favorecido...'}
                value={infoHolder.favorecido.nome}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, favorecido: { ...prev.favorecido, nome: value } }))}
                width={'100%'}
              />
            </div>
            <div className="w-full lg:w-[50%]">
              <TextInput
                label={'CONTATO DO FAVORECIDO'}
                placeholder={'Preencha o contato do favorecido..'}
                value={infoHolder.favorecido.contato}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, favorecido: { ...prev.favorecido, contato: value } }))}
                width={'100%'}
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-center px-2">
            <TextInput
              label={'CEP'}
              placeholder="Preencha o CEP do cliente..."
              value={infoHolder.localizacao.cep ? formatToCEP(infoHolder.localizacao.cep.toString()) : ''}
              handleChange={(value) => {
                if (value.length == 9) {
                  setAddressDataByCEP(value)
                }

                setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, cep: value } }))
              }}
            />
          </div>
          <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <SelectInput
                label="ESTADO"
                value={infoHolder.localizacao.uf}
                handleChange={(value) => {
                  setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, uf: value } }))
                }}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => {
                  setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, uf: 'NÃO DEFINIDO' } }))
                }}
                options={Object.keys(estadosECidades).map((state, index) => ({ id: index + 1, label: state, value: state }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <SelectVirtualizedInput
                label={'CIDADE'}
                value={infoHolder.localizacao.cidade}
                selectedItemLabel="NÃO DEFINIDO"
                options={AllCities.map((city, index) => ({ id: index + 1, label: city, value: city }))}
                handleChange={(value) => {
                  setInfoHolder((prev) => ({
                    ...prev,
                    localizacao: {
                      ...prev.localizacao,
                      cidade: value,
                    },
                  }))
                }}
                onReset={() => {
                  setInfoHolder((prev) => ({
                    ...prev,
                    localizacao: {
                      ...prev.localizacao,
                      cidade: '',
                    },
                  }))
                }}
                width="100%"
              />
            </div>
          </div>
          <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <TextInput
                label={'BAIRRO'}
                placeholder="Preencha o bairro do cliente..."
                value={infoHolder.localizacao.bairro || ''}
                handleChange={(value) => {
                  setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, bairro: value } }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <TextInput
                label={'LOGRADOURO'}
                placeholder="Preencha o logradouro do cliente..."
                value={infoHolder.localizacao.endereco}
                handleChange={(value) => {
                  setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, endereco: value } }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <TextInput
                label={'NÚMERO DA RESIDÊNCIA'}
                placeholder="Preencha o número da residência do cliente..."
                value={infoHolder.localizacao.numeroOuIdentificador ? infoHolder.localizacao.numeroOuIdentificador.toString() : ''}
                handleChange={(value) => {
                  setInfoHolder((prev) => ({
                    ...prev,
                    localizacao: { ...prev.localizacao, numeroOuIdentificador: value },
                  }))
                }}
                width="100%"
              />
            </div>
          </div>
          <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-[25%]">
              <SelectInput
                label={'CATEGORIA'}
                value={infoHolder.categoria}
                options={serviceOrdersCategories}
                selectedItemLabel={'NÃO DEFINIDO'}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, categoria: value }))}
                onReset={() => setInfoHolder((prev) => ({ ...prev, categoria: 'MONTAGEM' }))}
                width={'100%'}
              />
            </div>
            <div className="w-full lg:w-[25%]">
              <TextInput
                label={'DESCRIÇÃO DO SERVIÇO'}
                placeholder={'Preencha a descrição do serviço a ser executado...'}
                value={infoHolder.descricao}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, descricao: value }))}
                width={'100%'}
              />
            </div>
            <div className="w-full lg:w-[25%]">
              <SelectInput
                label={'TIPO DE RESPONSÁVEL'}
                value={infoHolder.responsavel.tipo}
                options={[
                  { id: 1, label: 'INTERNO', value: 'INTERNO' },
                  { id: 2, label: 'EXTERNO', value: 'EXTERNO' },
                ]}
                selectedItemLabel={'NÃO DEFINIDO'}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, tipo: value } }))}
                onReset={() => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, tipo: 'INTERNO' } }))}
                width={'100%'}
              />
            </div>
            <div className="w-full lg:w-[25%]">
              {infoHolder.responsavel.tipo == 'EXTERNO' ? (
                <TextInput
                  label={'NOME DO RESPONSÁVEL'}
                  placeholder={'Preencha o nome do responsável pela execução...'}
                  value={infoHolder.responsavel.nome || ''}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, nome: value } }))}
                  width={'100%'}
                />
              ) : (
                <SelectInput
                  label={'NOME DE RESPONSÁVEL'}
                  value={infoHolder.responsavel.nome}
                  options={equipesTecnicas.map((team, index) => ({ ...team, id: index + 1 }))}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, nome: value } }))}
                  onReset={() => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, nome: '' } }))}
                  width={'100%'}
                />
              )}
            </div>
          </div>
          <ObservationModalBlock
            infoHolder={infoHolder as TServiceOrderDTO}
            setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TServiceOrderDTO>>}
          />

          <div className="flex w-full items-center justify-center">
            <div className="w-full lg:w-1/2">
              <SelectInput
                label={'URGÊNCIA'}
                value={infoHolder.urgencia}
                options={[
                  { id: 1, label: 'POUCO URGENTE', value: 'POUCO URGENTE' },
                  { id: 2, label: 'URGENTE', value: 'URGENTE' },
                  { id: 3, label: 'EMERGÊNCIA', value: 'EMERGÊNCIA' },
                ]}
                selectedItemLabel={'NÃO DEFINIDO'}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, urgencia: value }))}
                onReset={() => setInfoHolder((prev) => ({ ...prev, urgencia: 'POUCO URGENTE' }))}
                width={'100%'}
              />
            </div>
          </div>
          <h1 className="mt-4 w-full rounded-md bg-gray-800 p-2 text-center font-bold text-white">EQUIPAMENTOS</h1>
          <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <TextInput
                label={'MODELO DO(S) INVERSOR(ES)'}
                placeholder={'Preencha o modelo dos inversores...'}
                value={infoHolder.equipamentos.inversor.modelo || ''}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    equipamentos: { ...prev.equipamentos, inversor: { ...prev.equipamentos.inversor, modelo: value } },
                  }))
                }
                width={'100%'}
              />
            </div>
            <div className="w-full lg:w-1/3">
              <NumberInput
                label={'QTDE DE INVERSOR(ES)'}
                placeholder={'Preencha a quantidade de inversores...'}
                value={infoHolder.equipamentos.inversor.qtde || null}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    equipamentos: { ...prev.equipamentos, inversor: { ...prev.equipamentos.inversor, qtde: value } },
                  }))
                }
                width={'100%'}
              />
            </div>
            <div className="w-full lg:w-1/3">
              <TextInput
                label={'POTÊNCIA DO(S) INVERSOR(ES)'}
                placeholder={'Preencha a potência dos inversores...'}
                value={infoHolder.equipamentos.inversor.potencia?.toString() || ''}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    equipamentos: { ...prev.equipamentos, inversor: { ...prev.equipamentos.inversor, potencia: value } },
                  }))
                }
                width={'100%'}
              />
            </div>
          </div>
          <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <TextInput
                label={'MODELO DOS MODULOS'}
                placeholder={'Preencha o modelo dos módulos...'}
                value={infoHolder.equipamentos.modulos.modelo || ''}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    equipamentos: { ...prev.equipamentos, modulos: { ...prev.equipamentos.modulos, modelo: value } },
                  }))
                }
                width={'100%'}
              />
            </div>
            <div className="w-full lg:w-1/3">
              <NumberInput
                label={'QTDE DE MODULOS'}
                placeholder={'Preencha a quantidade de módulos...'}
                value={infoHolder.equipamentos.modulos.qtde || null}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    equipamentos: { ...prev.equipamentos, modulos: { ...prev.equipamentos.modulos, qtde: value } },
                  }))
                }
                width={'100%'}
              />
            </div>
            <div className="w-full lg:w-1/3">
              <TextInput
                label={'POTÊNCIA DOS MODULOS'}
                placeholder={'Preencha a potência dos módulos...'}
                value={infoHolder.equipamentos.modulos.potencia?.toString() || ''}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    equipamentos: { ...prev.equipamentos, modulos: { ...prev.equipamentos.modulos, potencia: value } },
                  }))
                }
                width={'100%'}
              />
            </div>
          </div>
          <div className="mt-2 flex w-full flex-col items-start gap-2 lg:flex-row">
            <div className="h-full w-full lg:w-[50%]">
              <TakeMaterialsBlock
                osInfo={infoHolder}
                setOsInfo={setInfoHolder}
                useMissingMaterialInformation={() => toast.error('Não disponível.')}
              />
            </div>
            <div className="h-full w-full lg:w-[50%]">
              <AvailableMaterialsBlock osInfo={infoHolder} setOsInfo={setInfoHolder} useKitInformation={() => toast.error('Não disponível.')} />
            </div>
          </div>
          <h1 className="mt-4 w-full rounded-md bg-gray-800 p-2 text-center font-bold text-white">DETALHES</h1>
          <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <SelectInput
                label={'TOPOLOGIA'}
                value={infoHolder.detalhes.topologia}
                options={[
                  { id: 1, label: 'MICRO', value: 'MICRO' },
                  { id: 2, label: 'INVERSOR', value: 'INVERSOR' },
                ]}
                selectedItemLabel={'NÃO DEFINIDO'}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, topologia: value } }))}
                onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, topologia: 'MICRO' } }))}
                width={'100%'}
              />
            </div>
            <div className="w-full lg:w-1/3">
              <SelectInput
                label={'TIPO DE ESTRUTURA'}
                value={infoHolder.detalhes.tipoEstrutura}
                options={tiposDeEstruturas.map((structure, index) => ({ ...structure, id: index + 1 }))}
                selectedItemLabel={'NÃO DEFINIDO'}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoEstrutura: value } }))}
                onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoEstrutura: '' } }))}
                width={'100%'}
              />
            </div>
            <div className="w-full lg:w-1/3">
              <SelectInput
                label={'TIPO DE TELHA'}
                value={infoHolder.detalhes.tipoTelha}
                options={tiposDeTelha.map((roofType, index) => ({ ...roofType, id: index + 1 }))}
                selectedItemLabel={'NÃO DEFINIDO'}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoTelha: value } }))}
                onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoTelha: '' } }))}
                width={'100%'}
              />
            </div>
          </div>
          {infoHolder.categoria == 'MANUTENÇÃO PREVENTIVA' ? (
            <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/4">
                <TextInput
                  label={'PONTO DE ÁGUA'}
                  placeholder={'Localização do ponto de água...'}
                  value={infoHolder.detalhes.pontoAgua}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, pontoAgua: value } }))}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/4">
                <TextInput
                  label={'SENHA DO WIFI'}
                  placeholder={'Senha do Wi-Fi do cliente...'}
                  value={infoHolder.detalhes.senhaWifi || ''}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, senhaWifi: value } }))}
                  width={'100%'}
                />
              </div>
              <div className="flex w-full justify-center lg:w-1/4">
                <CheckboxInput
                  labelFalse={'NÃO CONFIGURAR'}
                  labelTrue={'CONFIGURAR'}
                  labelClassName="font-sans font-bold  text-[#353432]"
                  checked={!!infoHolder.detalhes.configuracaoMonitoramento}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, configuracaoMonitoramento: value } }))}
                />
              </div>
              <div className="flex w-full justify-center lg:w-1/4">
                <CheckboxInput
                  labelFalse={'NÃO POSSUI TRAFO'}
                  labelTrue={'POSSUI TRAFO'}
                  labelClassName="font-sans font-bold  text-[#353432]"
                  checked={infoHolder.detalhes.possuiTrafo}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, possuiTrafo: value } }))}
                />
              </div>
            </div>
          ) : null}
          {infoHolder.categoria == 'PADRÃO' ? (
            <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/4">
                <SelectInput
                  label={'ENTRADA DO PADRÃO'}
                  value={infoHolder.detalhes.tipoPadrao}
                  options={[
                    { id: 1, label: 'AEREO', value: 'AEREO' },
                    { id: 2, label: 'SUBTERRANEO', value: 'SUBTERRANEO' },
                  ]}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoPadrao: value } }))}
                  onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoPadrao: '' } }))}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/4">
                <SelectInput
                  label={'SAÍDA DO PADRÃO'}
                  value={infoHolder.detalhes.tipoSaidaPadrao}
                  options={[
                    { id: 1, label: 'AEREO', value: 'AEREO' },
                    { id: 2, label: 'SUBTERRANEO', value: 'SUBTERRANEO' },
                  ]}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoSaidaPadrao: value } }))}
                  onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoSaidaPadrao: 'N/A' } }))}
                  width={'100%'}
                />
              </div>
              <div className="flex w-full justify-center lg:w-1/4">
                <SelectInput
                  label={'AMPERAGEM DO PADRÃO'}
                  value={infoHolder.detalhes.amperagemPadrao}
                  options={tiposDePadrao.map((type, index) => ({ ...type, id: index + 1 }))}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, amperagemPadrao: value } }))}
                  onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, amperagemPadrao: '' } }))}
                  width={'100%'}
                />
              </div>
              <div className="flex w-full justify-center lg:w-1/4">
                <SelectInput
                  label={'RESPONSABILIDADE DO PADRÃO'}
                  value={infoHolder.detalhes.amperagemPadrao}
                  options={[
                    { id: 1, label: 'AMPERE', value: 'AMPERE' },
                    { id: 2, label: 'CLIENTE', value: 'CLIENTE' },
                    { id: 3, label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
                  ]}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, amperagemPadrao: value } }))}
                  onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, amperagemPadrao: '' } }))}
                  width={'100%'}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <>
        {/**@ts-ignore */}
        {infoHolder.categoria == 'PADRÃO' && <PadraoOS order={infoHolder} />}
        {/**@ts-ignore */}
        {infoHolder.categoria == 'MONTAGEM' && <ServiceOrderPDF order={infoHolder} />}
        {/**@ts-ignore */}
        {infoHolder.categoria == 'MANUTENÇÃO PREVENTIVA' && <PreventivaOS order={infoHolder} />}
        {/* {infoHolder.categoria == 'ESTRUTURA' && (
            <EstruturaOS
              info={osInfo}
              observacoesOS={osInfo.ordensDeServico[index].observacoes}
              servicoExecutado={osInfo.ordensDeServico[index].servicoExecutado}
            />
           )} */}
        {/**@ts-ignore */}
        {(infoHolder.categoria == 'MANUTENÇÃO CORRETIVA' || infoHolder.categoria == 'OUTROS') && <OSCorretiva order={data} />}
      </>
      {infoHolder.categoria == 'MANUTENÇÃO PREVENTIVA' ? (
        <div className="h-[29.7cm] w-[21cm] p-4">
          <div className="flex justify-center">
            <Image height="70px" width="70px" src={Logo} />
          </div>

          <h1 className="mt-6 text-center font-bold">TERMO DE REALIZAÇÃO DE MANUTENÇÃO PREVENTIVA</h1>
          <div className="mt-8 px-4">
            <p className="text-center font-raleway">
              Eu, {infoHolder.favorecido.nome}, declaro que a equipe técnica da empresa <strong>AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA</strong>
              , inscrita sob o CNPJ nº 27.901.968/0001-45, realizou no dia ____/____/_____ à manutenção preventiva, prevista em contrato, do sistema
              fotovoltaico de {((infoHolder.equipamentos.modulos.qtde || 0) * (Number(infoHolder.equipamentos.modulos.potencia) || 0)) / 1000} kWp
              instalado na{' '}
              <strong>
                {infoHolder.localizacao.endereco ? infoHolder.localizacao.endereco : '-'}, Nº{' '}
                {infoHolder.localizacao.numeroOuIdentificador ? infoHolder.localizacao.numeroOuIdentificador : '-'},{' '}
                {infoHolder.localizacao.bairro ? infoHolder.localizacao.bairro : '-'}
              </strong>{' '}
              , no município de <strong>{infoHolder.localizacao.cidade ? infoHolder.localizacao.cidade : '-'}</strong>.
            </p>
            <p className="mt-12">Por ser verdade assino este termo</p>
            <p className="mt-6 text-end">Ituiutaba, ____/____/_____</p>
            <div className="mt-32 flex flex-col">
              <hr className="border-t-2 border-black" />
              <p className="mt-4 text-center font-raleway font-bold">TÉCNICO</p>
            </div>
            <div className="mt-32 flex flex-col">
              <hr className="border-t-2 border-black" />
              <p className="mt-4 text-center font-raleway font-bold">CLIENTE</p>
            </div>
            <div className="mt-72">
              <p className="text-center font-raleway">Avenida Nove, 233 - Centro, Ituiutaba-MG</p>
              <p className="text-center">ampereenergiascomercial@gmail.com</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default OrdemServicoEmBranco
