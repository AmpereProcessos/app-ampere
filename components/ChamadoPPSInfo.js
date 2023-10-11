import React, { useState } from 'react'
import TextInput from './TextInput'
import SelectInput from './SelectInput'
import { cidadesAtendidas, fileTypes, formatProjectCode } from '../utils/constants'
import NumberInput from './NumberInput'
import DateInput from './DateInput'
import { storage } from '../utils/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoMdAddCircle } from 'react-icons/io'
import dayjs from 'dayjs'
import axios from 'axios'

function ChamadosExternoPPSInfo({ dados, setDados, setStage }) {
  var links = []
  const [images, setImages] = useState({})
  const [buttonBlocked, setButtonBlocked] = useState(false)
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })
  const [equipHolder, setEquipHolder] = useState({
    name: '',
    qtde: 1,
    pot: 0,
    hoursOfUse: 0,
  })
  const phoneMask = (value) => {
    if (!value) return ''
    value = value.replace(/\D/g, '')
    value = value.replace(/(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d)(\d{4})$/, '$1-$2')
    return value
  }
  function addEquipment() {
    if (equipHolder.pot == 0 || equipHolder.hoursOfUse == 0 || equipHolder.name.trim().length < 3) {
      setMsg({
        text: 'Por favor, preencha o nome, a potência e as horas de uso.',
        color: 'text-red-500',
      })
    } else {
      let arr = dados.equipamentos ? dados.equipamentos : []
      arr.push({
        qtde: equipHolder.qtde,
        nome: equipHolder.name,
        pot: equipHolder.pot,
        horasDiarias: equipHolder.hoursOfUse,
      })
      setDados({
        ...dados,
        equipamentos: [...arr],
      })
      setEquipHolder({ name: '', qtde: 1, pot: 0, hoursOfUse: 0 })
    }
  }
  function formatCEP(cep) {
    cep = cep
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
    return cep
  }
  function formatCnpjCpf(value) {
    const cnpjCpf = value.replace(/\D/g, '')

    if (cnpjCpf.length === 11) {
      return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
    }

    return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5')
  }
  function validateImages() {
    if (dados.tipoDoCliente == 'CPF') {
      if (!images.comprovanteDeEndereco) {
        setMsg({
          text: 'Por favor, anexe o comprovante de endereço.',
          color: 'text-red-500',
        })
        return false
      }
      if (!images.comprovanteDeRenda) {
        setMsg({
          text: 'Por favor, anexe o comprovante de renda.',
          color: 'text-red-500',
        })
        return false
      }
      if (!images.documentoPessoal) {
        setMsg({
          text: 'Por favor, anexe o documento pessoal.',
          color: 'text-red-500',
        })
        return false
      }
    }
    if (dados.tipoDoCliente == 'CNPJ') {
      if (!images.cartaoCNPJ) {
        setMsg({
          text: 'Por favor, anexe o cartão CNPJ.',
          color: 'text-red-500',
        })
        return false
      }
      if (!images.contratoSocial) {
        setMsg({
          text: 'Por favor, anexe o contrato social.',
          color: 'text-red-500',
        })
        return false
      }
      if (!images.comprovanteDeEndereco) {
        setMsg({
          text: 'Por favor, anexe o comprovante de endereço do representante legal.',
          color: 'text-red-500',
        })
        return false
      }
      if (!images.comprovanteDeRenda) {
        setMsg({
          text: 'Por favor, anexe o comprovante de renda.',
          color: 'text-red-500',
        })
        return false
      }
      if (!images.declaracaoDeFaturamento) {
        setMsg({
          text: 'Por favor, anexe a declaração de faturamento dos últimos 12 meses.',
          color: 'text-red-500',
        })
        return false
      }
      if (!images.documentoPessoal) {
        setMsg({
          text: 'Por favor, anexe o documento pessoal do representante legal.',
          color: 'text-red-500',
        })
        return false
      }
    }
    return true
  }
  function validateFields() {
    if (dados.tipoDeSolicitacao == 'DÚVIDAS E AUXILIOS TÉCNICOS') {
      if (!dados.duvida || dados.duvida.trim().length < 7) {
        setMsg({
          text: 'Por favor, preencha um texto válido.',
          color: 'text-red-500',
        })
        return false
      }
      return true
    } else {
      if (!dados.nomeDoCliente || dados.nomeDoCliente.trim().length < 3) {
        setMsg({
          text: 'Por favor, preencha o nome do cliente.',
          color: 'text-red-500',
        })
        return false
      }
      if (!dados.telefone || dados.telefone.trim().length < 7) {
        setMsg({
          text: 'Por favor, preencha um telefone válido.',
          color: 'text-red-500',
        })
        return false
      }
      if (dados.cidade == 'NÃO DEFINIDO') {
        setMsg({
          text: 'Por favor, preencha a cidade do cliente.',
          color: 'text-red-500',
        })
        return false
      }
      if (dados.tipoDoCliente == 'NÃO DEFINIDO') {
        setMsg({
          text: 'Por favor, preencha o tipo do cliente.',
          color: 'text-red-500',
        })
        return false
      }
      if (dados.tipoDeSolicitacao == 'PROPOSTA COMERCIAL (ON GRID)') {
        if (dados.geracaoEstimada == null || dados.geracaoEstimada == 0) {
          setMsg({
            text: 'Por favor, preencha a geração estimada.',
            color: 'text-red-500',
          })
          return false
        }
        if (dados.topologia == 'NÃO DEFINIDO') {
          setMsg({
            text: 'Por favor, preencha a topologia.',
            color: 'text-red-500',
          })
          return false
        }
        if (dados.tipoDaEstrutura == 'NÃO DEFINIDO') {
          setMsg({
            text: 'Por favor, preencha o tipo da estrutura.',
            color: 'text-red-500',
          })
          return false
        }
      }
      if (dados.tipoDeSolicitacao == 'ANÁLISE DE CRÉDITO') {
        if (!dados.cpf_cnpj || dados.cpf_cnpj.trim().length < 8) {
          setMsg({
            text: 'Por favor, preencha um CPF/CNPJ válido.',
            color: 'text-red-500',
          })
          return false
        }
        if (!dados.email || dados.email.trim().length < 8) {
          setMsg({
            text: 'Por favor, preencha um email válido.',
            color: 'text-red-500',
          })
          return false
        }
        if (dados.dataDeNascimento == null) {
          setMsg({
            text: 'Por favor, preencha uma data de nascimento válida.',
            color: 'text-red-500',
          })
          return false
        }
        if (dados.valorFinanciamento == null || dados.valorFinanciamento == 0) {
          setMsg({
            text: 'Por favor, preencha o valor do financiamento.',
            color: 'text-red-500',
          })
          return false
        }
        if (dados.rendaDoCliente == null || dados.rendaDoCliente == 0) {
          setMsg({
            text: 'Por favor, preencha a renda do cliente.',
            color: 'text-red-500',
          })
          return false
        }
        if (!dados.enderecoDoCliente || dados.enderecoDoCliente?.trim().length < 3) {
          setMsg({
            text: 'Por favor, preencha o endereço do cliente.',
            color: 'text-red-500',
          })
          return false
        }
      }
      if (dados.tipoDeSolicitacao == 'PROPOSTA COMERCIAL (OFF GRID)') {
        if (!dados.localizacao || dados.localizacao.trim().length < 4) {
          setMsg({
            text: 'Por favor, preencha o localização',
            color: 'text-red-500',
          })
          return false
        }
        if (!dados.equipamentos || dados.equipamentos?.length == 0) {
          setMsg({
            text: 'Por favor, adicione os equipamentos a serem alimentados',
            color: 'text-red-500',
          })
          return false
        }
      }
      return true
    }
  }
  async function createCall() {
    if (validateFields()) {
      if (dados.tipoDeSolicitacao == 'ANÁLISE DE CRÉDITO') {
        if (validateImages()) {
          setMsg({ text: 'Processando...', color: 'text-[#15599a]' })
          if (await uploadImages()) {
            setButtonBlocked(true)
            axios
              .post('/api/chamados/pps/mainData', {
                ...dados,
                links: links,
                status: 'PENDENTE',
                responsavel: 'A DEFINIR',
                demanda: 'EXTERNA',
              })
              .then((res) => {
                setMsg({ text: 'Chamado criado!', color: 'text-green-500' })
                setTimeout(() => {
                  location.reload()
                }, 2000)
              })
              .catch((err) => {
                console.log(err)
                setMsg({
                  text: 'Houve um erro na criação do chamado, por favor tente novamente.',
                  color: 'text-red-500',
                })
              })
          }
        }
      } else {
        setMsg({ text: 'Processando...', color: 'text-[#15599a]' })
        setButtonBlocked(true)
        axios
          .post('/api/chamados/pps/mainData', {
            ...dados,
            status: 'PENDENTE',
            responsavel: 'A DEFINIR',
            demanda: 'EXTERNA',
          })
          .then((res) => {
            setMsg({ text: 'Chamado criado!', color: 'text-green-500' })
            setButtonBlocked(false)
            setTimeout(() => {
              location.reload()
            }, 2000)
          })
      }
    }
  }
  async function uploadImages() {
    var holder
    try {
      if (dados.tipoDoCliente == 'CPF') {
        if (images.comprovanteDeEndereco) {
          var imageRef = ref(storage, `chamadosPPS/${dados.nomeDoCliente}/comprovanteDeEndereco${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.comprovanteDeEndereco)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'COMPROVANTE DE ENDEREÇO',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.comprovanteDeRenda) {
          var imageRef = ref(storage, `chamadosPPS/${dados.nomeDoCliente}/comprovanteDeRenda${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.comprovanteDeRenda)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'COMPROVANTE DE RENDA',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.documentoPessoal) {
          var imageRef = ref(storage, `chamadosPPS/${dados.nomeDoCliente}/documentoPessoal${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.documentoPessoal)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'DOCUMENTO PESSOAL',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (dados.tipoDoCliente == 'CNPJ') {
        if (images.cartaoCNPJ) {
          var imageRef = ref(storage, `chamadosPPS/${dados.nomeDoCliente}/cartaoCNPJ${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.cartaoCNPJ)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'CARTÃO CNPJ',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.contratoSocial) {
          var imageRef = ref(storage, `chamadosPPS/${dados.nomeDoCliente}/contratoSocial${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.contratoSocial)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'CONTRATO SOCIAL',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.comprovanteDeEndereco) {
          var imageRef = ref(storage, `chamadosPPS/${dados.nomeDoCliente}/comprovanteDeEndereco${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.comprovanteDeEndereco)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'COMPROVANTE DE ENDEREÇO',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.comprovanteDeRenda) {
          var imageRef = ref(storage, `chamadosPPS/${dados.nomeDoCliente}/comprovanteDeRenda${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.comprovanteDeRenda)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'COMPROVANTE DE RENDA',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.declaracaoDeFaturamento) {
          var imageRef = ref(storage, `chamadosPPS/${dados.nomeDoCliente}/declaracaoDeFaturamento${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.declaracaoDeFaturamento)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'DECLARAÇÃO DE FATURAMENTO',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.documentoPessoal) {
          var imageRef = ref(storage, `chamadosPPS/${dados.nomeDoCliente}/documentoPessoal${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.documentoPessoal)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'DOCUMENTO PESSOAL',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
    } catch (error) {
      setImages({
        text: 'Ocorreu um erro com o envio das mensagens, por favor tente novamente.',
        color: 'text-red-500',
      })
    }
    if (holder === undefined) {
      return true
    }
  }
  async function findCPF(field) {
    axios.get(`https://viacep.com.br/ws/${dados.cep.replace('-', '')}/json/`).then((res) => {
      if (res.data.erro) {
        console.log(res.data.erro)
        return
      } else {
        console.log(cidadesAtendidas.includes(res.data.localidade.toUpperCase()))
        console.log(res.data.localidade)
        setDados({
          ...dados,
          bairro: res.data.bairro,
          cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase()) ? res.data.localidade.toUpperCase() : 'ITUIUTABA',
          logradouro: res.data.logradouro,
        })
      }
    })
  }
  console.log(dados)
  return (
    <div className="mt-12 w-full self-center lg:w-[75%] min-h-[275px] gap-2 flex flex-col items-center flex-wrap  border border-[#15599a] p-2 shadow-lg bg-[#fff]">
      {dados.tipoDeSolicitacao != 'DÚVIDAS E AUXILIOS TÉCNICOS' ? (
        <>
          {' '}
          <TextInput
            label={'NOME COMPLETO DO CLIENTE'}
            editable={true}
            value={dados.nomeDoCliente}
            handleChange={(value) => setDados({ ...dados, nomeDoCliente: value.toUpperCase() })}
          />
          <TextInput
            label={'TELEFONE DO CLIENTE'}
            editable={true}
            value={dados.telefone}
            handleChange={(value) => setDados({ ...dados, telefone: phoneMask(value) })}
          />
          <SelectInput
            label={'CIDADE'}
            editable={true}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              ...cidadesAtendidas.map((cidade) => {
                return { label: cidade, value: cidade }
              }),
            ]}
            handleChange={(value) => setDados({ ...dados, cidade: value })}
          />
          <SelectInput
            label={'CPF ou CNPJ?'}
            editable={true}
            value={dados.tipoDoCliente}
            options={[
              { label: 'CPF', value: 'CPF' },
              { label: 'CNPJ', value: 'CNPJ' },
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            ]}
            handleChange={(value) => setDados({ ...dados, tipoDoCliente: value })}
          />
          <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">OBSERVAÇÕES</span>
            <textarea
              placeholder={'Descrição da solicitação aqui..'}
              value={dados.observacoes}
              onChange={(e) => setDados({ ...dados, observacoes: e.target.value })}
              className="w-full text-center h-[80px] bg-gray-100 resize-none p-2 outline-none border border-gray-600"
            />
          </div>
          {dados.tipoDeSolicitacao == 'PROPOSTA COMERCIAL (ON GRID)' && (
            <>
              <NumberInput
                label={'GERAÇÃO'}
                editable={true}
                unit={'kWh'}
                value={dados.geracaoEstimada}
                handleChange={(value) => setDados({ ...dados, geracaoEstimada: Number(value) })}
              />
              <SelectInput
                label={'TOPOLOGIA'}
                editable={true}
                value={dados.topologia ? dados.topologia : 'NÃO DEFINIDO'}
                options={[
                  { label: 'INVERSOR', value: 'INVERSOR' },
                  { label: 'MICRO', value: 'MICRO' },
                  { label: 'OUTROS SERV.', value: 'OUTROS SERV.' },
                  { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                ]}
                handleChange={(value) => setDados({ ...dados, topologia: value })}
              />
              <SelectInput
                label={'ESTRUTURA'}
                editable={true}
                value={dados.tipoDaEstrutura ? dados.tipoDaEstrutura : 'NÃO DEFINIDO'}
                options={[
                  {
                    label: 'TELHADO',
                    value: 'TELHADO',
                  },
                  {
                    label: 'CARPORT',
                    value: 'CARPORT',
                  },
                  {
                    label: 'SOLO',
                    value: 'SOLO',
                  },
                  {
                    label: 'ESTRUTURA PERSONALIZADA',
                    value: 'ESTRUTURA PERSONALIZADA',
                  },
                  {
                    label: 'NÃO DEFINIDO',
                    value: 'NÃO DEFINIDO',
                  },
                ]}
                handleChange={(value) => setDados({ ...dados, tipoDaEstrutura: value })}
              />
            </>
          )}
          {dados.tipoDeSolicitacao == 'ANÁLISE DE CRÉDITO' && (
            <>
              <TextInput
                label={'CPF/CPNJ'}
                editable={true}
                value={dados.cpf_cnpj}
                handleChange={(value) => setDados({ ...dados, cpf_cnpj: formatCnpjCpf(value) })}
              />
              <TextInput
                label={'EMAIL'}
                editable={true}
                value={dados.email}
                normalCase={true}
                handleChange={(value) => setDados({ ...dados, email: value })}
              />
              <DateInput
                label={'DATA DE NASCIMENTO'}
                editable={true}
                value={dados.dataDeNascimento ? new Date(dados.dataDeNascimento).toISOString().slice(0, 10) : null}
                handleChange={(value) =>
                  setDados({
                    ...dados,
                    dataDeNascimento: dayjs(value).isValid() ? new Date(value).toISOString() : null,
                  })
                }
              />
              <NumberInput
                label={'VALOR FINANCIADO'}
                tag={'R$'}
                editable={true}
                value={dados.valorFinanciamento}
                handleChange={(value) => setDados({ ...dados, valorFinanciamento: Number(value) })}
              />
              <NumberInput
                label={'RENDA'}
                tag={'R$'}
                editable={true}
                value={dados.rendaDoCliente}
                handleChange={(value) => setDados({ ...dados, rendaDoCliente: Number(value) })}
              />
              <TextInput
                label={'ENDEREÇO'}
                editable={true}
                value={dados.enderecoDoCliente ? dados.enderecoDoCliente : ''}
                handleChange={(value) => setDados({ ...dados, enderecoDoCliente: value.toUpperCase() })}
              />
              <TextInput
                label={'PROFISSÃO'}
                editable={true}
                value={dados.profissaoDoCliente ? dados.profissaoDoCliente : ''}
                handleChange={(value) =>
                  setDados({
                    ...dados,
                    profissaoDoCliente: value.toUpperCase(),
                  })
                }
              />
              {dados.tipoDoCliente == 'CPF' && (
                <>
                  <div className="w-fit flex flex-col items-center">
                    <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="comprovanteDeEndereco">
                      COMPROVANTE DE ENDEREÇO
                    </label>
                    <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                      <div className="absolute">
                        {images.comprovanteDeEndereco ? (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal text-center">{images.comprovanteDeEndereco.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                          </div>
                        )}
                      </div>
                      <input
                        onChange={(e) =>
                          setImages({
                            ...images,
                            comprovanteDeEndereco: e.target.files[0],
                          })
                        }
                        className="h-full w-full opacity-0"
                        type="file"
                        accept=".png, .jpeg, .pdf"
                      />
                    </div>
                  </div>
                  <div className="w-fit flex flex-col items-center">
                    <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="comprovanteDeRenda">
                      COMPROVANTE DE RENDA
                    </label>
                    <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                      <div className="absolute">
                        {images.comprovanteDeRenda ? (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal text-center">{images.comprovanteDeRenda.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                          </div>
                        )}
                      </div>
                      <input
                        onChange={(e) =>
                          setImages({
                            ...images,
                            comprovanteDeRenda: e.target.files[0],
                          })
                        }
                        className="h-full w-full opacity-0"
                        type="file"
                        accept=".png, .jpeg, .pdf"
                      />
                    </div>
                  </div>
                  <div className="w-fit flex flex-col items-center">
                    <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="documentoPessoal">
                      DOCUMENTO COM CPF E RG
                    </label>
                    <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                      <div className="absolute">
                        {images.documentoPessoal ? (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal text-center">{images.documentoPessoal.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                          </div>
                        )}
                      </div>
                      <input
                        onChange={(e) =>
                          setImages({
                            ...images,
                            documentoPessoal: e.target.files[0],
                          })
                        }
                        className="h-full w-full opacity-0"
                        type="file"
                        accept=".png, .jpeg, .pdf"
                      />
                    </div>
                  </div>
                </>
              )}
              {dados.tipoDoCliente == 'CNPJ' && (
                <>
                  <div className="w-fit flex flex-col items-center">
                    <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="cartaoCNPJ">
                      CARTÃO CNPJ
                    </label>
                    <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                      <div className="absolute">
                        {images.cartaoCNPJ ? (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal text-center">{images.cartaoCNPJ.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                          </div>
                        )}
                      </div>
                      <input
                        onChange={(e) =>
                          setImages({
                            ...images,
                            cartaoCNPJ: e.target.files[0],
                          })
                        }
                        className="h-full w-full opacity-0"
                        type="file"
                        accept=".png, .jpeg, .pdf"
                      />
                    </div>
                  </div>
                  <div className="w-fit flex flex-col items-center">
                    <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="contratoSocial">
                      CONTRATO SOCIAL
                    </label>
                    <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                      <div className="absolute">
                        {images.contratoSocial ? (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal text-center">{images.contratoSocial.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                          </div>
                        )}
                      </div>
                      <input
                        onChange={(e) =>
                          setImages({
                            ...images,
                            contratoSocial: e.target.files[0],
                          })
                        }
                        className="h-full w-full opacity-0"
                        type="file"
                        accept=".png, .jpeg, .pdf"
                      />
                    </div>
                  </div>
                  <div className="w-fit flex flex-col items-center">
                    <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="comprovanteDeEndereco">
                      COMPROVANTE DE ENDEREÇO DA INSTALAÇÃO
                    </label>
                    <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                      <div className="absolute">
                        {images.comprovanteDeEndereco ? (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal text-center">{images.comprovanteDeEndereco.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                          </div>
                        )}
                      </div>
                      <input
                        onChange={(e) =>
                          setImages({
                            ...images,
                            comprovanteDeEndereco: e.target.files[0],
                          })
                        }
                        className="h-full w-full opacity-0"
                        type="file"
                        accept=".png, .jpeg, .pdf"
                      />
                    </div>
                  </div>
                  <div className="w-fit flex flex-col items-center">
                    <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="comprovanteDeRenda">
                      COMPROVANTE DE RENDA (REPRESENTANTE LEGAL)
                    </label>
                    <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                      <div className="absolute">
                        {images.comprovanteDeRenda ? (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal text-center">{images.comprovanteDeRenda.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                          </div>
                        )}
                      </div>
                      <input
                        onChange={(e) =>
                          setImages({
                            ...images,
                            comprovanteDeRenda: e.target.files[0],
                          })
                        }
                        className="h-full w-full opacity-0"
                        type="file"
                        accept=".png, .jpeg, .pdf"
                      />
                    </div>
                  </div>
                  <div className="w-fit flex flex-col items-center">
                    <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="declaracaoDeFaturamento">
                      DECLARAÇÃO DE FATURAMENTO DA EMPRESA(12 MESES)
                    </label>
                    <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                      <div className="absolute">
                        {images.declaracaoDeFaturamento ? (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal text-center">{images.declaracaoDeFaturamento.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                          </div>
                        )}
                      </div>
                      <input
                        onChange={(e) =>
                          setImages({
                            ...images,
                            declaracaoDeFaturamento: e.target.files[0],
                          })
                        }
                        className="h-full w-full opacity-0"
                        type="file"
                        accept=".png, .jpeg, .pdf"
                      />
                    </div>
                  </div>
                  <div className="w-fit flex flex-col items-center">
                    <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="documentoPessoal">
                      DOCUMENTO PESSOAL DO REPRESENTANTE LEGAL
                    </label>
                    <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                      <div className="absolute">
                        {images.documentoPessoal ? (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal text-center">{images.documentoPessoal.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                            <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                          </div>
                        )}
                      </div>
                      <input
                        onChange={(e) =>
                          setImages({
                            ...images,
                            documentoPessoal: e.target.files[0],
                          })
                        }
                        className="h-full w-full opacity-0"
                        type="file"
                        accept=".png, .jpeg, .pdf"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {dados.tipoDeSolicitacao == 'PROPOSTA COMERCIAL (OFF GRID)' && (
            <>
              <TextInput
                label={'LOCALIZACAO (NOME OU COORDENADAS)'}
                editable={true}
                value={dados.localizacao}
                handleChange={(value) => setDados({ ...dados, localizacao: value })}
              />
              <SelectInput
                label={'ESTRUTURA'}
                editable={true}
                value={dados.tipoDaEstrutura ? dados.tipoDaEstrutura : 'NÃO DEFINIDO'}
                options={[
                  {
                    label: 'TELHADO',
                    value: 'TELHADO',
                  },
                  {
                    label: 'CARPORT',
                    value: 'CARPORT',
                  },
                  {
                    label: 'SOLO',
                    value: 'SOLO',
                  },
                  {
                    label: 'ESTRUTURA PERSONALIZADA',
                    value: 'ESTRUTURA PERSONALIZADA',
                  },
                  {
                    label: 'NÃO DEFINIDO',
                    value: 'NÃO DEFINIDO',
                  },
                ]}
                handleChange={(value) => setDados({ ...dados, tipoDaEstrutura: value })}
              />
              <div className="flex flex-col w-full mt-2">
                <h1 className="text-center text-[#15599a] font-bold">EQUIPAMENTOS A SEREM ALIMENTADOS</h1>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <TextInput
                    label={'EQUIPAMENTO'}
                    editable={true}
                    value={equipHolder.name}
                    handleChange={(value) =>
                      setEquipHolder({
                        ...equipHolder,
                        name: value.toUpperCase(),
                      })
                    }
                  />
                  <NumberInput
                    label={'QUANTIDADE DE EQUIPAMENTOS'}
                    unit={'UNIDADES'}
                    editable={true}
                    value={equipHolder.qtde}
                    handleChange={(value) => setEquipHolder({ ...equipHolder, qtde: Number(value) })}
                  />
                  <NumberInput
                    label={'POTÊNCIA DO EQUIPAMENTO'}
                    unit={'W'}
                    editable={true}
                    value={equipHolder.pot}
                    handleChange={(value) => setEquipHolder({ ...equipHolder, pot: Number(value) })}
                  />
                  <NumberInput
                    label={'HORAS DE USO DIÁRIAS'}
                    unit="HORAS"
                    editable={true}
                    value={equipHolder.hoursOfUse}
                    handleChange={(value) =>
                      setEquipHolder({
                        ...equipHolder,
                        hoursOfUse: Number(value),
                      })
                    }
                  />
                  <button onClick={addEquipment} className="p-1 rounded border border-green-500 text-green-500 hover:text-white hover:bg-green-500">
                    <IoMdAddCircle />
                  </button>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-center text-[#fead61] font-bold">LISTA</h1>
                  {dados.equipamentos?.length > 0 ? (
                    dados.equipamentos.map((item, index) => (
                      <p key={index} className="text-gray-500 text-center">
                        ({item.qtde}) {item.nome} - {item.pot}W, {item.horasDiarias} horas diárias{' '}
                      </p>
                    ))
                  ) : (
                    <p className="text-center italic text-gray-500">SEM ITENS ADICIONADOS...</p>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">DESCREVA AQUI SUA DÚVIDA</span>
            <textarea
              placeholder={'Descrição da dúvida aqui..'}
              value={dados.duvida}
              onChange={(e) => setDados({ ...dados, duvida: e.target.value })}
              className="w-full text-center h-[80px] bg-gray-100 resize-none p-2 outline-none border border-gray-600"
            />
          </div>
        </>
      )}
      {msg.text && <p className={`text-center italic text-sm ${msg.color}`}>{msg.text}</p>}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button onClick={() => setStage(0)} className="bg-[#15599a] text-white font-bold p-2 rounded hover:bg-[#fead61] hover:text-black">
          VOLTAR
        </button>
        <button disabled={buttonBlocked} onClick={createCall} className="bg-[#fead61] font-bold p-2 rounded hover:bg-[#15599a] hover:text-white">
          ENVIAR
        </button>
      </div>
    </div>
  )
}

export default ChamadosExternoPPSInfo
