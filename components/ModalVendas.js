import React, { useState } from 'react'
import {
  cidadesAtendidas,
  vendedores,
  projetistas,
  credores,
  fornecedores,
  localEntregaOptions,
  customersAcquisitionChannels,
} from '../utils/constants'
import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import TextInput from './TextInput'
import SelectInput from './SelectInput'
import DateInput from './DateInput'
import NumberInput from './NumberInput'
import axios from 'axios'
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
function ModalVendas({ open, setModalIsOpen, project, editor, handleUpdates }) {
  const [infoHolder, setInfo] = useState(project)
  const [changes, setChanges] = useState({})
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })
  console.log(infoHolder)
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex h-full flex-col overflow-y-auto overscroll-y-auto">
            <div className="border-primary/20 flex justify-between border-b px-2 pb-2 text-lg">
              <h1 className="pl-6 font-bold text-[#15599a]">
                {infoHolder.qtde} - {infoHolder.nomeDoContrato}
              </h1>
              {infoHolder.codigoSVB && <p className="text-primary/80 text-sm font-bold">#{infoHolder.codigoSVB}</p>}
              <div className="flex gap-x-2">
                <button>
                  <VscChromeClose onClick={() => setModalIsOpen(false)} style={{ color: 'red' }} />
                </button>
              </div>
            </div>
            <div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto">
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">Informações do cliente</span>
                <div className="flex flex-wrap justify-around gap-2">
                  <TextInput
                    label={'Nome do contrato'}
                    value={infoHolder.nomeDoContrato ? infoHolder.nomeDoContrato : ''}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        nomeDoContrato: value.toUpperCase(),
                      })
                      setInfo({
                        ...infoHolder,
                        nomeDoContrato: value.toUpperCase(),
                      })
                    }}
                  />
                  <TextInput
                    label={'Nome do Projeto'}
                    value={infoHolder.nomeDoProjeto ? infoHolder.nomeDoProjeto : ''}
                    handleChange={(value) => {
                      setChanges({ ...changes, nomeDoProjeto: value })
                      setInfo({
                        ...infoHolder,
                        nomeDoProjeto: value,
                      })
                    }}
                  />
                  <TextInput
                    label={'CPF/CNPJ'}
                    value={infoHolder.cpf_cnpj ? formataCPF(infoHolder.cpf_cnpj.toString()) : ''}
                    handleChange={(value) => {
                      setChanges({ ...changes, cpf_cnpj: value })
                      setInfo({
                        ...infoHolder,
                        cpf_cnpj: value,
                      })
                    }}
                  />
                  <TextInput
                    label={'Telefone'}
                    value={infoHolder.telefone ? infoHolder.telefone : ''}
                    handleChange={(value) => {
                      setChanges({ ...changes, telefone: value })
                      setInfo({ ...infoHolder, telefone: value })
                    }}
                  />
                  <SelectInput
                    label={'Cidade'}
                    value={infoHolder.cidade ? infoHolder.cidade : cidadesAtendidas[0]}
                    options={cidadesAtendidas.map((cidade) => {
                      return { label: cidade, value: cidade }
                    })}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        cidade: value,
                      })
                      setInfo({
                        ...infoHolder,
                        cidade: value,
                      })
                    }}
                  />
                  <TextInput
                    label={'CEP'}
                    value={infoHolder.cep ? formataCEP(infoHolder.cep.toString()) : ''}
                    handleChange={(value) => {
                      setChanges({ ...changes, cep: value })
                      setInfo({ ...infoHolder, cep: value })
                    }}
                  />
                  <TextInput
                    label={'Bairro'}
                    value={infoHolder.bairro ? infoHolder.bairro : ''}
                    handleChange={(value) => {
                      setChanges({ ...changes, bairro: value })
                      setInfo({ ...infoHolder, bairro: value })
                    }}
                  />
                  <NumberInput
                    label={'Número da residência'}
                    value={infoHolder.numeroResidencia ? infoHolder.numeroResidencia : 0}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        numeroResidencia: Number(value),
                      })
                      setInfo({
                        ...infoHolder,
                        numeroResidencia: Number(value),
                      })
                    }}
                  />
                  <SelectInput
                    label={'Regional'}
                    value={infoHolder.regional ? infoHolder.regional : 'NÃO DEFINIDO'}
                    options={[
                      {
                        label: 'REGIONAL ITUIUTABA',
                        value: 'REGIONAL ITUIUTABA',
                      },
                      {
                        label: 'REGIONAL UBERLÂNDIA',
                        value: 'REGIONAL UBERLÂNDIA',
                      },
                      {
                        label: 'NÃO DEFINIDO',
                        value: 'NÃO DEFINIDO',
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({ ...changes, regional: value })
                      setInfo({ ...infoHolder, regional: value })
                    }}
                  />
                  <TextInput
                    label={'EMAIL'}
                    value={infoHolder.email ? infoHolder.email : ''}
                    normalCase={true}
                    handleChange={(value) => {
                      setChanges({ ...changes, email: value })
                      setInfo({ ...infoHolder, email: value })
                    }}
                  />
                  <SelectInput
                    label={'Canal de venda'}
                    value={infoHolder.canalVenda != undefined && infoHolder.canalVenda != '-' ? infoHolder.canalVenda : 'NÃO DEFINIDO'}
                    options={customersAcquisitionChannels.map((value) => value)}
                    handleChange={(value) => {
                      setChanges({ ...changes, canalVenda: value })
                      setInfo({ ...infoHolder, canalVenda: value })
                    }}
                  />
                  <div className="flex">
                    <SelectInput
                      label={'VENDEDOR'}
                      value={infoHolder.vendedor != undefined && infoHolder.vendedor.nome != '-' ? infoHolder.vendedor.nome : 'NÃO DEFINIDO'}
                      options={vendedores.map((vendedor) => {
                        return { label: vendedor.nome, value: vendedor.nome }
                      })}
                      handleChange={(value) => {
                        console.log(value)
                        setChanges({
                          ...changes,
                          'vendedor.nome': value,
                          'vendedor.codigo': vendedores.filter((vendedor) => vendedor.nome == value)[0].cod || '-',
                        })
                        setInfo({
                          ...infoHolder,
                          vendedor: {
                            ...infoHolder.vendedor,
                            nome: value,
                            codigo: vendedores.filter((vendedor) => vendedor.nome == value)[0].cod || '-',
                          },
                        })
                      }}
                    />
                  </div>
                  <TextInput
                    label={'INSIDER'}
                    value={infoHolder.insider ? infoHolder.insider : ''}
                    handleChange={(value) => {
                      setChanges({ ...changes, insider: value })
                      setInfo({ ...infoHolder, insider: value })
                    }}
                  />
                  <SelectInput
                    label={'SEGMENTO'}
                    value={infoHolder.segmento ? infoHolder.segmento : 'NÃO DEFINIDO'}
                    options={[
                      { label: 'COMERCIAL', value: 'COMERCIAL' },
                      { label: 'INDUSTRIAL', value: 'INDUSTRIAL' },
                      { label: 'RESIDENCIAL', value: 'RESIDENCIAL' },
                      { label: 'RURAL', value: 'RURAL' },
                      { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                    ]}
                    handleChange={(value) => {
                      setChanges({ ...changes, segmento: value })
                      setInfo({ ...infoHolder, segmento: value })
                    }}
                  />
                  <TextInput
                    label="TIPO DE SERVIÇO"
                    value={infoHolder.tipoDeServico}
                    handleChange={(value) => {
                      setChanges({ ...changes, tipoDeServico: value })
                      setInfo({ ...infoHolder, tipoDeServico: value })
                    }}
                  />
                  <div>
                    <input
                      disabled={true}
                      checked={infoHolder.oem?.aplicavel ? true : false}
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          'oem.aplicavel': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          oem: {
                            ...infoHolder.oem,
                            aplicavel: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="visitaTecnica"
                      id="visitaTecnica"
                    />
                    <label className="ml-2" htmlFor="visitaTecnica">
                      POSSUI O&M?
                    </label>
                  </div>
                  {infoHolder.oem?.aplicavel && (
                    <NumberInput
                      label={'Duração O&M (anos)'}
                      value={infoHolder.oem?.duracao ? infoHolder.oem?.duracao : 0}
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          'oem.duracao': Number(value),
                        })
                        setInfo({
                          ...infoHolder,
                          oem: { ...infoHolder.oem, duracao: Number(value) },
                        })
                      }}
                    />
                  )}
                  {infoHolder.oem?.aplicavel && (
                    <NumberInput
                      label={'QTDE de manutenções'}
                      value={infoHolder.oem?.qtdeManutencoes ? infoHolder.oem?.qtdeManutencoes : 0}
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          'oem.qtdeManutencoes': Number(value),
                        })
                        setInfo({
                          ...infoHolder,
                          oem: {
                            ...infoHolder.oem,
                            qtdeManutencoes: Number(value),
                          },
                        })
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">VISITA TÉCNICA</span>
                <div className="flex flex-wrap justify-around gap-2">
                  <div>
                    <input
                      disabled={true}
                      checked={infoHolder.visitaTecnica?.status === 'REALIZADA' ? true : false}
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          ' visitaTecnica.status': e.target.checked ? 'REALIZADA' : 'PENDÊNCIA',
                        })
                        setInfo({
                          ...infoHolder,
                          visitaTecnica: {
                            ...infoHolder.visitaTecnica,
                            status: e.target.checked ? 'REALIZADA' : 'PENDÊNCIA',
                          },
                        })
                      }}
                      type="checkbox"
                      name="visitaTecnica"
                      id="visitaTecnica"
                    />
                    <label className="ml-2" htmlFor="visitaTecnica">
                      REALIZADA
                    </label>
                  </div>
                  <TextInput
                    label={'TÉCNICO RESPONSÁVEL'}
                    value={infoHolder.visitaTecnica?.tecnico ? infoHolder.visitaTecnica?.tecnico : ''}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'visitaTecnica.tecnico': value,
                      })
                      setInfo({
                        ...infoHolder,
                        visitaTecnica: {
                          ...infoHolder.visitaTecnica,
                          tecnico: value,
                        },
                      })
                    }}
                  />
                  <TextInput
                    label={'Tipo da telha'}
                    value={infoHolder.visitaTecnica?.tipoDaTelha ? infoHolder.visitaTecnica?.tipoDaTelha : ''}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'visitaTecnica.tipoDaTelha': value,
                      })
                      setInfo({
                        ...infoHolder,
                        visitaTecnica: {
                          ...infoHolder.visitaTecnica,
                          tipoDaTelha: value,
                        },
                      })
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">PADRÃO</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <SelectInput
                    label={'TIPO DO PADRÃO'}
                    value={infoHolder.padrao?.tipo != undefined ? infoHolder.padrao?.tipo : 'NÃO DEFINIDO'}
                    options={[
                      {
                        label: 'CONTRA A REDE',
                        value: 'CONTRA A REDE',
                      },
                      {
                        label: 'A FAVOR DA REDE',
                        value: 'A FAVOR DA REDE',
                      },
                      {
                        label: 'CONSTRUIR',
                        value: 'CONSTRUIR',
                      },
                      {
                        label: 'SUBESTAÇÃO',
                        value: 'SUBESTAÇÃO',
                      },
                      {
                        label: 'REFORMA DE PADRÃO',
                        value: 'REFORMA DE PADRÃO',
                      },
                      {
                        label: 'N/A',
                        value: 'N/A',
                      },
                      {
                        label: 'NÃO DEFINIDO',
                        value: 'NÃO DEFINIDO',
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'padrao.tipo': value,
                      })
                      setInfo({
                        ...infoHolder,
                        padrao: { ...infoHolder.padrao, tipo: value },
                      })
                    }}
                  />
                  <SelectInput
                    label={'PAGAMENTO DO PADRÃO'}
                    value={
                      infoHolder.padrao?.respPagamento == 'NÃO HAVERA TROCA DE PADRÃO' || infoHolder.padrao?.respPagamento == undefined
                        ? 'NÃO HAVERA TROCA PADRÃO'
                        : infoHolder.padrao?.respPagamento
                    }
                    options={[
                      {
                        label: 'CLIENTE IRÁ COMPRAR EM SEPARADO',
                        value: 'CLIENTE IRÁ COMPRAR EM SEPARADO',
                      },
                      {
                        label: 'CLIENTE PAGAR POR FORA',
                        value: 'CLIENTE PAGAR POR FORA',
                      },
                      {
                        label: 'INCLUSO NO CONTRATO',
                        value: 'INCLUSO NO CONTRATO',
                      },
                      {
                        label: 'NÃO HAVERA TROCA PADRÃO',
                        value: 'NÃO HAVERA TROCA PADRÃO',
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'padrao.respPagamento': value,
                      })
                      setInfo({
                        ...infoHolder,
                        padrao: { ...infoHolder.padrao, respPagamento: value },
                      })
                    }}
                  />
                  <NumberInput
                    tag={'R$'}
                    label={'Valor do padrão'}
                    value={infoHolder.padrao?.valor ? infoHolder.padrao?.valor : 0}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'padrao.valor': Number(value),
                      })
                      setInfo({
                        ...infoHolder,
                        padrao: { ...infoHolder.padrao, valor: Number(value) },
                      })
                    }}
                  />
                  <SelectInput
                    label={'RESPONSÁVEL INSTALAÇÃO DO PADRÃO'}
                    value={infoHolder.padrao?.respInstalacao ? infoHolder.padrao?.respInstalacao : 'NÃO SE APLICA'}
                    options={[
                      { label: 'AMPERE', value: 'AMPERE' },
                      { label: 'CLIENTE', value: 'CLIENTE' },
                      { label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'padrao.respInstalacao': value,
                      })
                      setInfo({
                        ...infoHolder,
                        padrao: { ...infoHolder.padrao, respInstalacao: value },
                      })
                    }}
                  />
                  <SelectInput
                    label={'Saída do cliente'}
                    value={infoHolder.visitaTecnica?.saidaDoCliente ? infoHolder.visitaTecnica?.saidaDoCliente : 'N/A'}
                    options={[
                      { label: 'SUBTERRANEO', value: 'SUBTERRANEO' },
                      { label: 'AEREO', value: 'AEREO' },
                      { label: 'N/A', value: 'N/A' },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'visitaTecnica.saidaDoCliente': value,
                      })
                      setInfo({
                        ...infoHolder,
                        visitaTecnica: {
                          ...infoHolder.visitaTecnica,
                          saidaDoCliente: value,
                        },
                      })
                    }}
                  />
                  <TextInput
                    label={'Amperagem'}
                    value={infoHolder.visitaTecnica?.amperagem ? infoHolder.visitaTecnica.amperagem : ''}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'visitaTecnica.amperagem': value,
                      })
                      setInfo({
                        ...infoHolder,
                        visitaTecnica: {
                          ...infoHolder.visitaTecnica,
                          amperagem: value,
                        },
                      })
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">ESTRUTURA PERSONALIZADA</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <div>
                    <input
                      disabled={true}
                      checked={infoHolder.estruturaPersonalizada?.aplicavel === 'SIM' ? true : false}
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          'estruturaPersonalizada.aplicavel': e.target.checked ? 'SIM' : 'NÃO',
                        })
                        setInfo({
                          ...infoHolder,
                          estruturaPersonalizada: {
                            ...infoHolder.estruturaPersonalizada,
                            aplicavel: e.target.checked ? 'SIM' : 'NÃO',
                          },
                        })
                      }}
                      type="checkbox"
                      name="visitaTecnica"
                      id="visitaTecnica"
                    />
                    <label className="ml-2" htmlFor="visitaTecnica">
                      APLICÁVEL
                    </label>
                  </div>
                  <SelectInput
                    label={'Tipo da estrutura'}
                    value={infoHolder.estruturaPersonalizada?.tipo ? infoHolder.estruturaPersonalizada?.tipo : 'N/A'}
                    options={[
                      { label: 'INCLINAÇÃO', value: 'INCLINAÇÃO' },
                      { label: 'SOLO', value: 'SOLO' },
                      { label: 'TELHADO', value: 'TELHADO' },
                      { label: 'BARRACÃO', value: 'BARRACÃO' },
                      { label: 'CARPORT', value: 'CARPORT' },
                      { label: 'N/A', value: 'N/A' },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'estruturaPersonalizada.tipo': value,
                      })
                      setInfo({
                        ...infoHolder,
                        estruturaPersonalizada: {
                          ...infoHolder.estruturaPersonalizada,
                          tipo: value,
                        },
                      })
                    }}
                  />
                  <SelectInput
                    label={'PAGAMENTO DA ESTRUTURA'}
                    value={infoHolder.estruturaPersonalizada?.respPagamento ? infoHolder.estruturaPersonalizada?.respPagamento : 'NÃO SE APLICA'}
                    options={[
                      { label: 'AMPERE', value: 'AMPERE' },
                      { label: 'CLIENTE', value: 'CLIENTE' },
                      { label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'estruturaPersonalizada.respPagamento': value,
                      })
                      setInfo({
                        ...infoHolder,
                        estruturaPersonalizada: {
                          ...infoHolder.estruturaPersonalizada,
                          respPagamento: value,
                        },
                      })
                    }}
                  />
                  <NumberInput
                    tag={'R$'}
                    label={'Valor da estrutura'}
                    value={
                      infoHolder.estruturaPersonalizada?.valor == '-' || infoHolder.estruturaPersonalizada?.valor == undefined
                        ? 0
                        : infoHolder.estruturaPersonalizada?.valor
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'estruturaPersonalizada.valor': Number(value),
                      })
                      setInfo({
                        ...infoHolder,
                        estruturaPersonalizada: {
                          ...infoHolder.estruturaPersonalizada,
                          valor: Number(value),
                        },
                      })
                    }}
                  />
                  {infoHolder.estruturaPersonalizada?.aplicavel == 'SIM' && (
                    <SelectInput
                      label={'STATUS da estrutura personalizada'}
                      value={
                        infoHolder.estruturaPersonalizada.aplicavel
                          ? infoHolder.estruturaPersonalizada.status
                            ? infoHolder.estruturaPersonalizada.status
                            : 'N/A'
                          : 'N/A'
                      }
                      options={[
                        { label: 'PRONTA', value: 'PRONTA' },
                        { label: 'PENDÊNCIA', value: 'PENDÊNCIA' },
                        { label: 'N/A', value: 'N/A' },
                      ]}
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          'estruturaPersonalizada.status': value,
                        })
                        setInfo({
                          ...infoHolder,
                          estruturaPersonalizada: {
                            ...infoHolder.estruturaPersonalizada,
                            status: value,
                          },
                        })
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">CONTRATO</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <SelectInput
                    label={'STATUS'}
                    value={infoHolder.contrato?.status ? infoHolder.contrato?.status : 'NÃO DEFINIDO'}
                    options={[
                      {
                        label: 'AGUARDANDO SOLICITAÇÃO',
                        value: 'AGUARDANDO SOLICITAÇÃO',
                      },
                      { label: 'ASSINADO', value: 'ASSINADO' },
                      { label: 'NÃO ASSINADO', value: 'NÃO ASSINADO' },
                      {
                        label: 'RESCISÃO DE CONTRATO',
                        value: 'RESCISÃO DE CONTRATO',
                      },
                      { label: 'SOLICITADO', value: 'SOLICITADO' },
                      { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'contrato.status': value,
                      })
                      setInfo({
                        ...infoHolder,
                        contrato: {
                          ...infoHolder.contrato,
                          status: value,
                        },
                      })
                    }}
                  />
                  {infoHolder.contrato?.status != 'NÃO DEFINIDO' && (
                    <DateInput
                      label={'Data de solicitação'}
                      value={
                        infoHolder.contrato.dataSolicitacao != undefined && infoHolder.contrato.dataSolicitacao != '-'
                          ? new Date(infoHolder.contrato.dataSolicitacao).toISOString().slice(0, 10)
                          : 0
                      }
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          'contrato.dataSolicitacao': new Date(value).toISOString(),
                        })
                        setInfo({
                          ...infoHolder,
                          contrato: {
                            ...infoHolder.contrato,
                            dataSolicitacao: new Date(value).toISOString(),
                          },
                        })
                      }}
                    />
                  )}
                  <DateInput
                    label={'Data de liberação p/ assinatura'}
                    value={
                      infoHolder.contrato?.dataLiberacao != undefined && infoHolder.contrato?.dataLiberacao != '-'
                        ? new Date(infoHolder.contrato.dataLiberacao).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'contrato.dataLiberacao': new Date(value).toISOString(),
                      })
                      setInfo({
                        ...infoHolder,
                        contrato: {
                          ...infoHolder.contrato,
                          dataLiberacao: new Date(value).toISOString(),
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'Data de assinatura'}
                    value={
                      infoHolder.contrato?.dataAssinatura != undefined && infoHolder.contrato?.dataAssinatura != '-'
                        ? new Date(infoHolder.contrato.dataAssinatura).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'contrato.dataAssinatura': new Date(value).toISOString(),
                      })
                      setInfo({
                        ...infoHolder,
                        contrato: {
                          ...infoHolder.contrato,
                          dataAssinatura: new Date(value).toISOString(),
                        },
                      })
                    }}
                  />
                  <SelectInput
                    label={'FORMA DE ASSINATURA'}
                    value={infoHolder.contrato?.formaAssinatura ? infoHolder.contrato?.formaAssinatura : 'NÃO DEFINIDO'}
                    options={[
                      {
                        label: 'FISICO',
                        value: 'FISICO',
                      },
                      {
                        label: 'DIGITAL',
                        value: 'DIGITAL',
                      },
                      {
                        label: 'NÃO DEFINIDO',
                        value: 'NÃO DEFINIDO',
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'contrato.formaAssinatura': value,
                      })
                      setInfo({
                        ...infoHolder,
                        contrato: {
                          ...infoHolder.contrato,
                          formaAssinatura: value,
                        },
                      })
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">PAGAMENTO</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <SelectInput
                    label={'FORMA DE PAGAMENTO'}
                    value={infoHolder.pagamento?.forma ? infoHolder.pagamento?.forma : 'NÃO DEFINIDO'}
                    options={[
                      {
                        label: 'CAPITAL PRÓPRIO',
                        value: 'CAPITAL PRÓPRIO',
                      },
                      {
                        label: 'FINANCIAMENTO',
                        value: 'FINANCIAMENTO',
                      },
                      {
                        label: 'NÃO DEFINIDO',
                        value: 'NÃO DEFINIDO',
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'pagamento.forma': value,
                      })
                      setInfo({
                        ...infoHolder,
                        pagamento: {
                          ...infoHolder.pagamento,
                          forma: value,
                        },
                      })
                    }}
                  />
                  {infoHolder.pagamento?.forma == 'FINANCIAMENTO' && (
                    <SelectInput
                      label={'CREDOR'}
                      value={
                        infoHolder.pagamento?.credor != undefined &&
                        infoHolder.pagamento?.credor != '-----' &&
                        infoHolder.pagamento?.credor != 'QUAL CREDOR?'
                          ? infoHolder.pagamento.credor
                          : 'NÃO DEFINIDO'
                      }
                      options={credores.map((credor) => {
                        return { label: credor.label, value: credor.value }
                      })}
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          'pagamento.credor': value,
                        })
                        setInfo({
                          ...infoHolder,
                          pagamento: {
                            ...infoHolder.pagamento,
                            credor: value,
                          },
                        })
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">Informações da compra</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <SelectInput
                    label={'STATUS DA LIBERAÇÃO'}
                    value={infoHolder.compra?.statusLiberacao ? infoHolder.compra?.statusLiberacao : 'NÃO DEFINIDO'}
                    options={[
                      {
                        label: 'AGUARDAR CONTRATO',
                        value: 'AGUARDAR CONTRATO',
                      },
                      {
                        label: 'AGUARDAR PARECER DE ACESSO',
                        value: 'AGUARDAR PARECER DE ACESSO',
                      },
                      {
                        label: 'PAGO',
                        value: 'PAGO',
                      },
                      {
                        label: 'REALIZAR COMPRA',
                        value: 'REALIZAR COMPRA',
                      },
                      {
                        value: 'AGUARDANDO PAGAMENTO DO BANCO',
                        label: 'AGUARDANDO PAGAMENTO DO BANCO',
                      },
                      {
                        value: 'AGUARDANDO N.F',
                        label: 'AGUARDANDO N.F',
                      },
                      {
                        value: 'AGUARDANDO CLIENTE PAGAR',
                        label: 'AGUARDANDO CLIENTE PAGAR',
                      },
                      {
                        value: 'AGUARDANDO LIBERAÇÃO DE CRÉDITO',
                        label: 'AGUARDANDO LIBERAÇÃO DE CRÉDITO',
                      },
                      {
                        label: 'RESCISÃO DE CONTRATO',
                        value: 'RESCISÃO DE CONTRATO',
                      },
                      {
                        label: 'NÃO DEFINIDO',
                        value: 'NÃO DEFINIDO',
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'compra.statusLiberacao': value,
                      })
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          statusLiberacao: value,
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'Data de liberação p/ compra'}
                    value={
                      infoHolder.compra?.dataLiberacao != undefined && infoHolder.compra?.dataLiberacao != '-'
                        ? new Date(infoHolder.compra.dataLiberacao).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'compra.dataLiberacao': new Date(value).toISOString(),
                      })
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          dataLiberacao: new Date(value).toISOString(),
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'Data do pedido'}
                    value={
                      infoHolder.compra.dataPedido != undefined && infoHolder.compra.dataPedido != '-'
                        ? new Date(infoHolder.compra.dataPedido).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'compra.dataPedido': isNaN(value) ? new Date(value).toISOString() : null,
                      })
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          dataPedido: isNaN(value) ? new Date(value).toISOString() : null,
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'Data do pagamento'}
                    value={
                      infoHolder.compra?.dataPagamento != undefined && infoHolder.compra?.dataPagamento != '-'
                        ? new Date(infoHolder.compra?.dataPagamento).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'compra.dataPagamento': isNaN(value) ? new Date(value).toISOString() : null,
                      })
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          dataPagamento: new Date(value).toISOString(),
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'Previsão de entrega'}
                    value={
                      infoHolder.compra.previsaoEntrega != undefined && infoHolder.compra.previsaoEntrega != '-'
                        ? new Date(infoHolder.compra.previsaoEntrega).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'compra.previsaoEntrega': isNaN(value) ? new Date(value).toISOString() : null,
                      })
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          previsaoEntrega: isNaN(value) ? new Date(value).toISOString() : null,
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'Data de entrega'}
                    value={
                      infoHolder.compra.dataEntrega != undefined && infoHolder.compra.dataEntrega != '-'
                        ? new Date(infoHolder.compra.dataEntrega).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'compra.dataEntrega': isNaN(value) ? new Date(value).toISOString() : null,
                      })
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          dataEntrega: isNaN(value) ? new Date(value).toISOString() : null,
                        },
                      })
                    }}
                  />
                  <SelectInput
                    label={'TIPO DO KIT'}
                    value={
                      infoHolder.compra?.tipoDoKit != undefined && infoHolder.compra.tipoDoKit != '-' ? infoHolder.compra.tipoDoKit : 'NÃO DEFINIDO'
                    }
                    options={[
                      {
                        label: 'NORMAL',
                        value: 'NORMAL',
                      },
                      {
                        label: 'PROMO',
                        value: 'PROMO',
                      },
                      {
                        label: 'NÃO SE APLICA',
                        value: 'NÃO SE APLICA',
                      },
                      {
                        label: 'NÃO DEFINIDO',
                        value: 'NÃO DEFINIDO',
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'compra.tipoDoKit': value,
                      })
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          tipoDoKit: value,
                        },
                      })
                    }}
                  />
                  <SelectInput
                    label={'LOCAL DE ENTREGA'}
                    value={
                      infoHolder.compra?.localEntrega != undefined && infoHolder.compra?.localEntrega != '-'
                        ? infoHolder.compra?.localEntrega
                        : 'NÃO DEFINIDO'
                    }
                    options={localEntregaOptions.map((option) => option)}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'compra.localEntrega': value,
                      })
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          localEntrega: value,
                        },
                      })
                    }}
                  />
                  <SelectInput
                    label={'STATUS DA ENTREGA'}
                    value={infoHolder.compra?.statusEntrega ? infoHolder.compra?.statusEntrega : 'NÃO DEFINIDO'}
                    options={[
                      {
                        label: 'AGUARDANDO COMPRA',
                        value: 'AGUARDANDO COMPRA',
                      },
                      {
                        label: 'ENTREGUE',
                        value: 'ENTREGUE',
                      },
                      {
                        label: 'CANCELADO',
                        value: 'CANCELADO',
                      },
                      {
                        label: 'NÃO DEFINIDO',
                        value: 'NÃO DEFINIDO',
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'compra.statusEntrega': value,
                      })
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          statusEntrega: value,
                        },
                      })
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">DADOS INSTALAÇÃO CEMIG</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <TextInput
                    label={'Titular do projeto'}
                    value={infoHolder.dadosCemig?.titularProjeto ? infoHolder.dadosCemig?.titularProjeto : ''}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'dadosCemig.titularProjeto': value,
                      })
                      setInfo({
                        ...infoHolder,
                        dadosCemig: {
                          ...infoHolder.dadosCemig,
                          titularProjeto: value,
                        },
                      })
                    }}
                  />
                  <TextInput
                    label={'Número da instalação'}
                    value={infoHolder.dadosCemig?.numeroInstalacao ? infoHolder.dadosCemig?.numeroInstalacao : ''}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'dadosCemig.numeroInstalacao': value,
                      })
                      setInfo({
                        ...infoHolder,
                        dadosCemig: {
                          ...infoHolder.dadosCemig,
                          numeroInstalacao: value,
                        },
                      })
                    }}
                  />
                  <SelectInput
                    label={'DISTRIBUIÇÃO DE CRÉDITOS'}
                    value={infoHolder.dadosCemig?.distCreditos ? infoHolder.dadosCemig?.distCreditos : 'NÃO DEFINIDO'}
                    options={[
                      { label: 'SIM', value: 'SIM' },
                      { label: 'NÃO', value: 'NÃO' },
                      { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'dadosCemig.distCreditos': value,
                      })
                      setInfo({
                        ...infoHolder,
                        dadosCemig: {
                          ...infoHolder.dadosCemig,
                          distCreditos: value,
                        },
                      })
                    }}
                  />
                  {infoHolder.dadosCemig?.distCreditos == 'SIM' && (
                    <NumberInput
                      label={'QTDE DE DISTRIBUIÇÕES'}
                      value={
                        infoHolder.dadosCemig?.qtdeDistCreditos != undefined && infoHolder.dadosCemig?.qtdeDistCreditos != '-'
                          ? infoHolder.dadosCemig?.qtdeDistCreditos
                          : 0
                      }
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          'dadosCemig.qtdeDistCreditos': Number(value),
                        })
                        setInfo({
                          ...infoHolder,
                          dadosCemig: {
                            ...infoHolder.dadosCemig,
                            qtdeDistCreditos: Number(value),
                          },
                        })
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">SISTEMA</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <NumberInput
                    label={'NÚMERO DE MÓDULOS'}
                    value={
                      infoHolder.sistema?.qtdeModulos != undefined && infoHolder.sistema?.qtdeModulos != '-' ? infoHolder.sistema?.qtdeModulos : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'sistema.qtdeModulos': Number(value),
                        'sistema.potPico': Number(infoHolder.sistema?.potModulos * value) / 1000,
                      })
                      setInfo({
                        ...infoHolder,
                        sistema: {
                          ...infoHolder.sistema,
                          qtdeModulos: Number(value),
                          potPico: Number(infoHolder.sistema?.potModulos * value) / 1000,
                        },
                      })
                    }}
                  />
                  <NumberInput
                    unit={'W'}
                    label={'POTÊNCIA DOS MÓDULOS'}
                    value={infoHolder.sistema?.potModulos != undefined && infoHolder.sistema?.potModulos != '-' ? infoHolder.sistema?.potModulos : 0}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'sistema.potModulos': Number(value),
                        'sistema.potPico': Number(value * infoHolder.sistema?.qtdeModulos) / 1000,
                      })
                      setInfo({
                        ...infoHolder,
                        sistema: {
                          ...infoHolder.sistema,
                          potModulos: Number(value),
                          potPico: Number(value * infoHolder.sistema?.qtdeModulos) / 1000,
                        },
                      })
                    }}
                  />
                  <NumberInput
                    unit={'kWp'}
                    label={'POTÊNCIA PICO'}
                    value={infoHolder.sistema?.potPico != undefined && infoHolder.sistema?.potPico != '-' ? infoHolder.sistema?.potPico : 0}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'sistema.potPico': Number(value),
                      })
                      setInfo({
                        ...infoHolder,
                        sistema: {
                          ...infoHolder.sistema,
                          potPico: Number(value),
                        },
                      })
                    }}
                  />
                  <SelectInput
                    label={'TOPOLOGIA'}
                    value={infoHolder.sistema?.topologia ? infoHolder.sistema?.topologia : 'NÃO DEFINIDO'}
                    options={[
                      { label: 'INVERSOR', value: 'INVERSOR' },
                      { label: 'MICRO', value: 'MICRO' },
                      { label: 'OUTROS SERV.', value: 'OUTROS SERV.' },
                      { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'sistema.topologia': value,
                      })
                      setInfo({
                        ...infoHolder,
                        sistema: {
                          ...infoHolder.sistema,
                          topologia: value,
                        },
                      })
                    }}
                  />
                  <TextInput
                    label={'QTDE E POTÊNCIA DO(S) INVERSOR(ES)'}
                    value={infoHolder.sistema?.inversor ? infoHolder.sistema?.inversor : ''}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'sistema.inversor': value,
                      })
                      setInfo({
                        ...infoHolder,
                        sistema: {
                          ...infoHolder.sistema,
                          inversor: value,
                        },
                      })
                    }}
                  />
                  <SelectInput
                    label={'INICIAR PROJETO'}
                    value={infoHolder.projeto?.iniciar ? infoHolder.projeto?.iniciar : 'NÃO DEFINIDO'}
                    options={[
                      { label: 'SIM', value: 'SIM' },
                      {
                        label: 'CONTRATO CANCELADO',
                        value: 'CONTRATO CANCELADO',
                      },
                      { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'projeto.iniciar': value,
                      })
                      setInfo({
                        ...infoHolder,
                        projeto: {
                          ...infoHolder.projeto,
                          iniciar: value,
                        },
                      })
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">PROJETO</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <DateInput
                    label={'Data de assinatura da documentação'}
                    value={
                      infoHolder.projeto?.dataAssDocumentacao != undefined && infoHolder.projeto?.dataAssDocumentacao != '-'
                        ? new Date(infoHolder.projeto.dataAssDocumentacao).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'projeto.dataAssDocumentacao': new Date(value).toISOString(),
                      })
                      setInfo({
                        ...infoHolder,
                        projeto: {
                          ...infoHolder.projeto,
                          dataAssDocumentacao: new Date(value).toISOString(),
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'Parecer de acesso'}
                    value={
                      infoHolder.parecer?.dataParecerDeAcesso != undefined && infoHolder.parecer?.dataParecerDeAcesso != '-'
                        ? new Date(infoHolder.parecer?.dataParecerDeAcesso).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'parecer.dataParecerDeAcesso': new Date(value).toISOString(),
                      })
                      setInfo({
                        ...infoHolder,
                        parecer: {
                          ...infoHolder.parecer,
                          dataParecerDeAcesso: new Date(value).toISOString(),
                        },
                      })
                    }}
                  />
                  <SelectInput
                    label={'Status do parecer de acesso'}
                    value={infoHolder.parecer?.statusDoParecerDeAcesso ? infoHolder.parecer?.statusDoParecerDeAcesso : 'NÃO DEFINIDO'}
                    options={[
                      {
                        label: 'AGUARDANDO FATURAMENTO ART',
                        value: 'AGUARDANDO FATURAMENTO ART',
                      },
                      {
                        label: 'AGUARDANDO RESPOSTA DA CONCESSIONARIA',
                        value: 'AGUARDANDO RESPOSTA DA CONCESSIONARIA',
                      },
                      {
                        label: 'CANCELADO',
                        value: 'CANCELADO',
                      },
                      {
                        label: 'INICIAR PROJETO',
                        value: 'INICIAR PROJETO',
                      },
                      {
                        label: 'PARECER DE ACESSO APROVADO',
                        value: 'PARECER DE ACESSO APROVADO',
                      },
                      {
                        label: 'PENDENCIAS',
                        value: 'PENDENCIAS',
                      },
                      {
                        label: 'SOLICITAR ACESSO',
                        value: 'SOLICITAR ACESSO',
                      },
                      {
                        label: 'NÃO DEFINIDO',
                        value: 'NÃO DEFINIDO',
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'parecer.statusDoParecerDeAcesso': value,
                      })
                      setInfo({
                        ...infoHolder,
                        parecer: {
                          ...infoHolder.parecer,
                          statusDoParecerDeAcesso: value,
                        },
                      })
                    }}
                  />
                  <div className="flex w-[350px] flex-col items-center">
                    <span className="font-raleway text-center text-sm font-bold uppercase">AUMENTO DE CARGA</span>
                    <div className="flex">
                      <input
                        disabled={true}
                        checked={infoHolder.projeto?.aumentoDeCarga === 'SIM' ? true : false}
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            'projeto.aumentoDeCarga': e.target.checked ? 'SIM' : 'NÃO',
                            'projeto.acStatus': e.target.checked && infoHolder.acStatus != 'REALIZADO' ? 'PENDÊNCIA' : undefined,
                          })
                          setInfo({
                            ...infoHolder,
                            projeto: {
                              ...infoHolder.projeto,
                              aumentoDeCarga: e.target.checked ? 'SIM' : 'NÃO',
                              acStatus: e.target.checked && infoHolder.acstatus != 'REALIZADO' ? 'PENDÊNCIA' : undefined,
                            },
                          })
                        }}
                        type="checkbox"
                        name="aumentodecarga"
                        id="aumentodecarga"
                      />
                      <label className="ml-2" htmlFor="aumentodecarga">
                        APLICÁVEL?
                      </label>
                    </div>
                  </div>
                  {infoHolder.projeto?.aumentoDeCarga == 'SIM' && (
                    <div className="flex w-[350px] flex-col items-center">
                      <span className="font-raleway text-center text-sm font-bold uppercase">STATUS AUMENTO DE CARGA</span>
                      <div className="flex">
                        <input
                          disabled={true}
                          checked={infoHolder.projeto?.acStatus === 'REALIZADO' ? true : false}
                          onChange={(e) => {
                            setChanges({
                              ...changes,
                              'projeto.acStatus': e.target.checked ? 'REALIZADO' : 'PENDÊNCIA',
                            })
                            setInfo({
                              ...infoHolder,
                              projeto: {
                                ...infoHolder.projeto,
                                acStatus: e.target.checked ? 'REALIZADO' : 'PENDÊNCIA',
                              },
                            })
                          }}
                          type="checkbox"
                          name="acstatus"
                          id="acstatus"
                        />
                        <label className="ml-2" htmlFor="acstatus">
                          REALIZADO
                        </label>
                      </div>
                    </div>
                  )}
                  <DateInput
                    label={'DATA DO PEDIDO DE VISTORIA'}
                    value={
                      infoHolder.vistoria?.dataPedido != undefined && infoHolder.vistoria?.dataPedido != '-'
                        ? new Date(infoHolder.vistoria.dataPedido).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'vistoria.dataPedido': new Date(value).toISOString(),
                      })
                      setInfo({
                        ...infoHolder,
                        vistoria: {
                          ...infoHolder.vistoria,
                          dataPedido: new Date(value).toISOString(),
                        },
                      })
                    }}
                  />
                  <SelectInput
                    label={'STATUS DA VISTORIA'}
                    value={infoHolder.vistoria?.status ? infoHolder.vistoria?.status : 'NÃO DEFINIDO'}
                    options={[
                      { label: 'REALIZADA', value: 'REALIZADA' },
                      {
                        label: 'AGUARDANDO OBRA DE REDE',
                        value: 'AGUARDANDO OBRA DE REDE',
                      },
                      { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'vistoria.status': value,
                      })
                      setInfo({
                        ...infoHolder,
                        vistoria: {
                          ...infoHolder.vistoria,
                          status: value,
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'DATA TROCA DO MEDIDOR'}
                    value={
                      infoHolder.medidor?.data != undefined && infoHolder.medidor?.data != '-'
                        ? new Date(infoHolder.medidor.data).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'medidor.data': new Date(value).toISOString(),
                      })
                      setInfo({
                        ...infoHolder,
                        medidor: {
                          ...infoHolder.medidor,
                          data: new Date(value).toISOString(),
                        },
                      })
                    }}
                  />
                  <SelectInput
                    label={'STATUS DA TROCA DO MEDIDOR'}
                    value={infoHolder.medidor?.status ? infoHolder.medidor?.status : 'NÃO DEFINIDO'}
                    options={[
                      { label: 'REALIZADA', value: 'REALIZADA' },
                      {
                        label: 'AGUARDANDO OBRA DE REDE',
                        value: 'AGUARDANDO OBRA DE REDE',
                      },
                      { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'medidor.status': value,
                      })
                      setInfo({
                        ...infoHolder,
                        medidor: {
                          ...infoHolder.medidor,
                          status: value,
                        },
                      })
                    }}
                  />
                  <div className="flex w-[350px] flex-col items-center">
                    <span className="font-raleway text-center text-sm font-bold uppercase">PROJETO CONCLUÍDO</span>
                    <div className="flex">
                      <input
                        disabled={true}
                        checked={infoHolder.projeto?.projetoConcluido === 'SIM' ? true : false}
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            'projeto.projetoConcluido': e.target.checked ? 'SIM' : 'NÃO',
                          })
                          setInfo({
                            ...infoHolder,
                            projeto: {
                              ...infoHolder.projeto,
                              projetoConcluido: e.target.checked ? 'SIM' : 'NÃO',
                            },
                          })
                        }}
                        type="checkbox"
                        name="projetoconcluido"
                        id="projetoconcluido"
                      />
                      <label className="ml-2" htmlFor="projetoconcluido">
                        SIM
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">Informações sobre a obra</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <SelectInput
                    label={'Laudo'}
                    value={infoHolder.obra?.laudo ? infoHolder.obra?.laudo : 'NÃO DEFINIDO'}
                    options={[
                      { label: 'EM ESTUDO', value: 'EM ESTUDO' },
                      { label: 'EMITIDO', value: 'EMITIDO' },
                      { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'obra.laudo': value,
                      })
                      setInfo({
                        ...infoHolder,
                        obra: {
                          ...infoHolder.obra,
                          laudo: value,
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'ENTRADA NA OBRA'}
                    value={
                      infoHolder.obra?.entrada != undefined && infoHolder.obra?.entrada != '-'
                        ? new Date(infoHolder.obra?.entrada).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'obra.entrada': new Date(value).toISOString(),
                      })
                      setInfo({
                        ...infoHolder,
                        obra: {
                          ...infoHolder.obra,
                          entrada: new Date(value).toISOString(),
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'SAIDA DE OBRA'}
                    value={
                      infoHolder.obra?.saida != undefined && infoHolder.obra?.saida != '-'
                        ? new Date(infoHolder.obra?.saida).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'obra.saida': new Date(value).toISOString(),
                      })
                      setInfo({
                        ...infoHolder,
                        obra: {
                          ...infoHolder.obra,
                          saida: new Date(value).toISOString(),
                        },
                      })
                    }}
                  />
                  <SelectInput
                    label={'STATUS DA OBRA'}
                    value={infoHolder.obra?.statusDaObra ? infoHolder.obra?.statusDaObra : 'NÃO DEFINIDO'}
                    options={[
                      {
                        label: 'AGENDADA',
                        value: 'AGENDADA',
                      },
                      {
                        label: 'AGUARDANDO AGENDAMENTO',
                        value: 'AGUARDANDO AGENDAMENTO',
                      },
                      {
                        label: 'CONCLUIDA',
                        value: 'CONCLUIDA',
                      },
                      {
                        label: 'EM ANDAMENTO',
                        value: 'EM ANDAMENTO',
                      },
                      {
                        label: 'OBRA CANCELADA',
                        value: 'OBRA CANCELADA',
                      },
                      {
                        label: 'CASA EM CONSTRUÇÃO',
                        value: 'CASA EM CONSTRUÇÃO',
                      },
                      {
                        label: 'NÃO DEFINIDO',
                        value: 'NÃO DEFINIDO',
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'obra.statusDaObra': value,
                      })
                      setInfo({
                        ...infoHolder,
                        obra: {
                          ...infoHolder.obra,
                          statusDaObra: value,
                        },
                      })
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">JORNADA</span>
                <div className="flex w-full flex-wrap items-center justify-around gap-2 p-2">
                  <div className="w-fit">
                    <input
                      disabled={true}
                      checked={infoHolder.jornada?.boasVindas ? true : false}
                      onChange={(e) => {
                        handleChanges({
                          'jornada.boasVindas': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          jornada: {
                            ...infoHolder.jornada,
                            boasVindas: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="boasVindas"
                      id="boasVindas"
                    />
                    <label className="ml-2" htmlFor="boasVindas">
                      BOAS VINDAS
                    </label>
                  </div>
                  <div className="w-fit">
                    <input
                      disabled={true}
                      checked={infoHolder.jornada?.assDocumentacoes ? true : false}
                      onChange={(e) => {
                        handleChanges({
                          'jornada.assDocumentacoes': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          jornada: {
                            ...infoHolder.jornada,
                            assDocumentacoes: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="assDocumentacoes"
                      id="assDocumentacoes"
                    />
                    <label className="ml-2" htmlFor="assDocumentacoes">
                      ASSINATURA DAS DOCUMENTAÇÕES
                    </label>
                  </div>
                  <div className="w-fit">
                    <input
                      disabled={true}
                      checked={infoHolder.jornada?.compraDoKit ? true : false}
                      onChange={(e) => {
                        handleChanges({
                          'jornada.compraDoKit': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          jornada: {
                            ...infoHolder.jornada,
                            compraDoKit: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="compraDoKit"
                      id="compraDoKit"
                    />
                    <label className="ml-2" htmlFor="compraDoKit">
                      COMPRA DO KIT
                    </label>
                  </div>
                  <div className="w-fit">
                    <input
                      disabled={true}
                      checked={infoHolder.jornada?.nfFaturada ? true : false}
                      onChange={(e) => {
                        handleChanges({
                          'jornada.nfFaturada': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          jornada: {
                            ...infoHolder.jornada,
                            nfFaturada: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="nfFaturada"
                      id="nfFaturada"
                    />
                    <label className="ml-2" htmlFor="nfFaturada">
                      NF FATURADA
                    </label>
                  </div>
                  <div className="w-fit">
                    <input
                      disabled={true}
                      checked={infoHolder.jornada?.prevChegada ? true : false}
                      onChange={(e) => {
                        handleChanges({
                          'jornada.prevChegada': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          jornada: {
                            ...infoHolder.jornada,
                            prevChegada: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="prevChegada"
                      id="prevChegada"
                    />
                    <label className="ml-2" htmlFor="prevChegada">
                      PREVISÃO DE CHEGADA
                    </label>
                  </div>
                  <div className="w-fit">
                    <input
                      disabled={true}
                      checked={infoHolder.jornada?.respConcessionaria ? true : false}
                      onChange={(e) => {
                        handleChanges({
                          'jornada.respConcessionaria': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          jornada: {
                            ...infoHolder.jornada,
                            respConcessionaria: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="respConcessionaria"
                      id="respConcessionaria"
                    />
                    <label className="ml-2" htmlFor="respConcessionaria">
                      RESP.CONCESSIONÁRIA
                    </label>
                  </div>
                  <div className="w-fit">
                    <input
                      disabled={true}
                      checked={infoHolder.jornada?.entregaDoKit ? true : false}
                      onChange={(e) => {
                        handleChanges({
                          'jornada.entregaDoKit': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          jornada: {
                            ...infoHolder.jornada,
                            entregaDoKit: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="entregaDoKit"
                      id="entregaDoKit"
                    />
                    <label className="ml-2" htmlFor="entregaDoKit">
                      ENTREGA DO KIT
                    </label>
                  </div>
                  <div className="w-fit">
                    <input
                      disabled={true}
                      checked={infoHolder.jornada?.instalacaoAgendada ? true : false}
                      onChange={(e) => {
                        handleChanges({
                          'jornada.instalacaoAgendada': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          jornada: {
                            ...infoHolder.jornada,
                            instalacaoAgendada: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="instalacaoAgendada"
                      id="instalacaoAgendada"
                    />
                    <label className="ml-2" htmlFor="instalacaoAgendada">
                      INST.AGENDADA
                    </label>
                  </div>
                  <div className="w-fit">
                    <input
                      disabled={true}
                      checked={infoHolder.jornada?.vistoriaConcessionaria ? true : false}
                      onChange={(e) => {
                        handleChanges({
                          'jornada.vistoriaConcessionaria': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          jornada: {
                            ...infoHolder.jornada,
                            vistoriaConcessionaria: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="vistoriaConcessionaria"
                      id="vistoriaConcessionaria"
                    />
                    <label className="ml-2" htmlFor="vistoriaConcessionaria">
                      VISTORIA DA CONCESSIONÁRIA
                    </label>
                  </div>
                  <div className="w-fit">
                    <input
                      disabled={true}
                      checked={infoHolder.jornada?.sistemaLigado ? true : false}
                      onChange={(e) => {
                        handleChanges({
                          'jornada.sistemaLigado': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          jornada: {
                            ...infoHolder.jornada,
                            sistemaLigado: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="sistemaLigado"
                      id="sistemaLigado"
                    />
                    <label className="ml-2" htmlFor="sistemaLigado">
                      SISTEMA LIGADO
                    </label>
                  </div>
                </div>
                <div className="flex justify-center">
                  <NumberInput editable={false} label={'NPS'} value={infoHolder.nps != undefined && infoHolder.nps != ' ' ? infoHolder.nps : 0} />
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">PÓS-OBRA</span>
                <div className="flex flex-wrap justify-around gap-2">
                  <DateInput
                    label={'Usina Ligada'}
                    value={
                      infoHolder.conferencias.usinaLigada.data != undefined && infoHolder.conferencias.usinaLigada.data != '-'
                        ? new Date(infoHolder.conferencias.usinaLigada.data).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'conferencias.usinaLigada.data': new Date(value).toISOString(),
                        'conferencias.usinaLigada.status': 'REALIZADO',
                      })
                      setInfo({
                        ...infoHolder,
                        conferencias: {
                          ...infoHolder.conferencias,
                          usinaLigada: {
                            ...infoHolder.usinaLigada,
                            data: new Date(value).toISOString(),
                            status: 'REALIZADO',
                          },
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'Monitoramento feito'}
                    value={
                      infoHolder.conferencias.monitoramentoFeito.data != undefined && infoHolder.conferencias.monitoramentoFeito.data != '-'
                        ? new Date(infoHolder.conferencias.monitoramentoFeito.data).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'conferencias.monitoramentoFeito.data': new Date(value).toISOString(),
                        'conferencias.monitoramentoFeito.status': 'REALIZADO',
                      })
                      setInfo({
                        ...infoHolder,
                        conferencias: {
                          ...infoHolder.conferencias,
                          monitoramentoFeito: {
                            ...infoHolder.monitoramentoFeito,
                            data: new Date(value).toISOString(),
                            status: 'REALIZADO',
                          },
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'Data APP no celular'}
                    value={
                      infoHolder.app.data != undefined && infoHolder.app.data != '-' && infoHolder.app.data != 'CRIAR LOGIN NO APP'
                        ? new Date(infoHolder.app.data).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'app.data': new Date(value).toISOString(),
                      })
                      setInfo({
                        ...infoHolder,
                        app: {
                          ...infoHolder.app,
                          data: new Date(value).toISOString(),
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'Energia Injetada'}
                    value={
                      infoHolder.conferencias.energiaInjetada.data != undefined && infoHolder.conferencias.energiaInjetada.data != '-'
                        ? new Date(infoHolder.conferencias.energiaInjetada.data).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'conferencias.energiaInjetada.data': new Date(value).toISOString(),
                        'conferencias.energiaInjetada.status': 'REALIZADO',
                      })
                      setInfo({
                        ...infoHolder,
                        conferencias: {
                          ...infoHolder.conferencias,
                          energiaInjetada: {
                            ...infoHolder.energiaInjetada,
                            data: new Date(value).toISOString(),
                            status: 'REALIZADO',
                          },
                        },
                      })
                    }}
                  />
                  <TextInput
                    label={'LOGIN NO APP'}
                    value={infoHolder.app.login ? infoHolder.app.login : ''}
                    normalCase={true}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'app.login': value,
                      })
                      setInfo({
                        ...infoHolder,
                        app: {
                          ...infoHolder.app,
                          login: value,
                        },
                      })
                    }}
                  />
                  <TextInput
                    label={'SENHA NO APP'}
                    value={infoHolder.app.senha}
                    normalCase={true}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'app.senha': value,
                      })
                      setInfo({
                        ...infoHolder,
                        app: {
                          ...infoHolder.app,
                          senha: value,
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'RELATÓRIO 1'}
                    value={
                      infoHolder.relatorios.envioUm.data != undefined && infoHolder.relatorios.envioUm.data != '-'
                        ? new Date(infoHolder.relatorios.envioUm.data).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'relatorios.envioUm.data': new Date(value).toISOString(),
                        'relatorios.envioUm.status': 'REALIZADO',
                      })
                      setInfo({
                        ...infoHolder,
                        relatorios: {
                          ...infoHolder.relatorios,
                          envioUm: {
                            data: new Date(value).toISOString(),
                            status: 'REALIZADO',
                          },
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'RELATÓRIO 2'}
                    value={
                      infoHolder.relatorios.envioDois.data != undefined && infoHolder.relatorios.envioDois.data != '-'
                        ? new Date(infoHolder.relatorios.envioDois.data).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'relatorios.envioDois.data': new Date(value).toISOString(),
                        'relatorios.envioDois.status': 'REALIZADO',
                      })
                      setInfo({
                        ...infoHolder,
                        relatorios: {
                          ...infoHolder.relatorios,
                          envioDois: {
                            data: new Date(value).toISOString(),
                            status: 'REALIZADO',
                          },
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'RELATÓRIO 3'}
                    value={
                      infoHolder.relatorios.envioTres.data != undefined && infoHolder.relatorios.envioTres.data != '-'
                        ? new Date(infoHolder.relatorios.envioTres.data).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'relatorios.envioTres.data': new Date(value).toISOString(),
                        'relatorios.envioTres.status': 'REALIZADO',
                      })
                      setInfo({
                        ...infoHolder,
                        relatorios: {
                          ...infoHolder.relatorios,
                          envioTres: {
                            data: new Date(value).toISOString(),
                            status: 'REALIZADO',
                          },
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'RELATÓRIO 4'}
                    value={
                      infoHolder.relatorios.envioQuatro.data != undefined && infoHolder.relatorios.envioQuatro.data != '-'
                        ? new Date(infoHolder.relatorios.envioQuatro.data).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'relatorios.envioQuatro.data': new Date(value).toISOString(),
                        'relatorios.envioQuatro.status': 'REALIZADO',
                      })
                      setInfo({
                        ...infoHolder,
                        relatorios: {
                          ...infoHolder.relatorios,
                          envioQuatro: {
                            data: new Date(value).toISOString(),
                            status: 'REALIZADO',
                          },
                        },
                      })
                    }}
                  />
                  <DateInput
                    label={'MANUTENÇÃO PREVENTIVA'}
                    value={
                      infoHolder.manutencaoPreventiva.data != undefined && infoHolder.manutencaoPreventiva.data != '-'
                        ? new Date(infoHolder.manutencaoPreventiva.data).toISOString().slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        'manutencaoPreventiva.data': new Date(value).toISOString(),
                        'manutencaoPreventiva.status': 'REALIZADO',
                      })
                      setInfo({
                        ...infoHolder,
                        manutencaoPreventiva: {
                          ...infoHolder.manutencaoPreventiva,
                          data: new Date(value).toISOString(),
                          status: 'REALIZADO',
                        },
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalVendas
