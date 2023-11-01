import React, { useState } from 'react'
import { AiOutlineSearch, AiOutlineCheck } from 'react-icons/ai'
import { cidadesAtendidas, credores, customersAcquisitionChannels, vendedores } from '../utils/constants'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'
import { storage } from '../utils/services/firebase/firebase-storage'
import axios from 'axios'
import { Router, useRouter } from 'next/router'
import TextFloatingInput from './TextFloatingInput'
import SelectFloatingInput from './SelectFloatingInput'
import DateFloatingInput from './DateFloatingInput'
import NumberFloatingInput from './NumberFloatingInput'
const phoneMask = (value) => {
  if (!value) return ''
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d)(\d{4})$/, '$1-$2')
  return value
}
function formatCnpjCpf(value) {
  const cnpjCpf = value.replace(/\D/g, '')

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
  }

  return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5')
}
function formatCEP(cep) {
  cep = cep
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')
  return cep
}
function VisualizacaoOFFGrid({ dados, voltar, setDados, formVisitaId, linksVisita }) {
  const router = useRouter()
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })
  async function criarSolicitacao() {
    try {
      setMsg({ text: 'Em progresso...', color: 'text-[#15599a]' })
      await axios.post('/api/solicitacoes/contrato', {
        ...dados,
        idVisitaTecnica: formVisitaId,
        linksVisita: linksVisita,
      })
      setMsg({ text: 'Solicitação enviada!', color: 'text-green-500' })
      setTimeout(() => {
        location.reload()
        router.push('/publico/formSolicitacao')
      }, 2000)
    } catch (error) {
      setMsg({
        text: 'Um erro ocorreu durante a criação do formulário, por favor, tente novamente.',
        color: 'text-red-500',
      })
      setTimeout(() => {
        setMsg({ text: '', color: '' })
      }, 1800)
    }
  }
  return (
    <>
      <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
        <h1 className="text-center font-bold text-[#fead61] mt-1 text-xl">REVISÃO DAS INFORMAÇÕES</h1>
      </div>
      <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
        <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">DADOS PARA CONTRATO</span>
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 justify-around flex-wrap p-2">
          <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">SOBRE O CLIENTE</h1>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'NOME/RAZÃO SOCIAL'}
              value={dados.nomeDoContrato}
              editable={true}
              handleChange={(value) => setDados({ ...dados, nomeDoContrato: value.toUpperCase() })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'TELEFONE'}
              editable={true}
              value={dados.telefone}
              handleChange={(value) => setDados({ ...dados, telefone: phoneMask(value) })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'CPF/CNPJ'}
              editable={true}
              value={dados.cpf_cnpj}
              handleChange={(value) => setDados({ ...dados, cpf_cnpj: formatCnpjCpf(value) })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'RG'}
              editable={true}
              value={dados.rg}
              handleChange={(value) => setDados({ ...dados, rg: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <DateFloatingInput
              width={'450px'}
              label={'DATA DE NASCIMENTO'}
              editable={true}
              value={dados.dataDeNascimento ? new Date(dados.dataDeNascimento).toISOString().slice(0, 10) : null}
              handleChange={(value) =>
                setDados({
                  ...dados,
                  dataDeNascimento: value,
                })
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'ESTADO CIVIL'}
              options={[
                {
                  label: 'CASADO(A)',
                  value: 'CASADO(A)',
                },
                {
                  label: 'SOLTEIRO(A)',
                  value: 'SOLTEIRO(A)',
                },
                {
                  label: 'UNIÃO ESTÁVEL',
                  value: 'UNIÃO ESTÁVEL',
                },
                {
                  label: 'DIVORCIADO(A)',
                  value: 'DIVORCIADO(A)',
                },
                {
                  label: 'VIUVO(A)',
                  value: 'VIUVO(A)',
                },
                {
                  label: 'NÃO DEFINIDO',
                  value: 'NÃO DEFINIDO',
                },
              ]}
              editable={true}
              value={dados.estadoCivil}
              handleChange={(value) => setDados({ ...dados, estadoCivil: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'EMAIL'}
              editable={true}
              normalCase={true}
              value={dados.email}
              handleChange={(value) => setDados({ ...dados, email: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'PROFISSÃO'}
              editable={true}
              value={dados.profissao}
              handleChange={(value) => setDados({ ...dados, profissao: value.toUpperCase() })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'ONDE TRABALHA'}
              editable={true}
              value={dados.ondeTrabalha}
              handleChange={(value) => setDados({ ...dados, ondeTrabalha: value })}
            />
          </div>
          {dados.tipoDeServico == 'SISTEMA FOTOVOLTAICO (OFF GRID)' && (
            <div className="flex items-center justify-center col-span-3">
              <SelectFloatingInput
                label={'TIPO DO CLIENTE'}
                width={'450px'}
                editable={true}
                value={dados.tipoDoTitular}
                handleChange={(value) => setDados({ ...dados, tipoDoTitular: value })}
                options={[
                  {
                    label: 'PESSOA FISICA',
                    value: 'PESSOA FISICA',
                  },
                  {
                    label: 'PESSOA JURIDICA',
                    value: 'PESSOA JURIDICA',
                  },
                  {
                    label: 'NÃO DEFINIDO',
                    value: 'NÃO DEFINIDO',
                  },
                ]}
              />
            </div>
          )}
          <div className="flex items-center justify-center gap-2 col-span-3">
            <SelectFloatingInput
              width={'450px'}
              label={'POSSUI ALGUMA DEFICIÊNCIA'}
              editable={true}
              value={dados.possuiDeficiencia}
              handleChange={(value) => setDados({ ...dados, possuiDeficiencia: value })}
              options={[
                {
                  label: 'SIM',
                  value: 'SIM',
                },
                {
                  label: 'NÃO',
                  value: 'NÃO',
                },
              ]}
            />
            {dados.possuiDeficiencia == 'SIM' && (
              <>
                {' '}
                <TextFloatingInput
                  width={'450px'}
                  label={'SE SIM, QUAL ?'}
                  editable={true}
                  value={dados.qualDeficiencia}
                  handleChange={(value) => setDados({ ...dados, qualDeficiencia: value })}
                />
              </>
            )}
          </div>
          <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">ENDEREÇO</h1>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <TextFloatingInput
              width={'450px'}
              label={'CEP'}
              editable={true}
              value={dados.cep}
              handleChange={(value) => setDados({ ...dados, cep: formatCEP(value) })}
            />
          </div>
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'CIDADE'}
              editable={true}
              value={dados.cidade}
              options={[
                { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                ...cidadesAtendidas.map((cidade) => {
                  return { label: cidade, value: cidade }
                }),
              ]}
              handleChange={(value) => setDados({ ...dados, cidade: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'UF'}
              editable={true}
              value={dados.uf}
              handleChange={(value) => setDados({ ...dados, uf: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'ENDEREÇO DE COBRANÇA'}
              editable={true}
              value={dados.enderecoCobranca}
              handleChange={(value) => setDados({ ...dados, enderecoCobranca: value.toUpperCase() })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'Nº'}
              tag={'R$'}
              value={dados.numeroResCobranca}
              editable={true}
              handleChange={(value) => setDados({ ...dados, numeroResCobranca: Number(value) })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'BAIRRO'}
              editable={true}
              value={dados.bairro}
              handleChange={(value) => setDados({ ...dados, bairro: value.toUpperCase() })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'PONTO DE REFERÊNCIA'}
              editable={true}
              value={dados.pontoDeReferencia}
              handleChange={(value) => setDados({ ...dados, pontoDeReferencia: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'SEGMENTO'}
              value={dados.segmento}
              editable={true}
              options={[
                {
                  value: 'RESIDENCIAL',
                  label: 'RESIDENCIAL',
                },
                {
                  value: 'COMERCIAL',
                  label: 'COMERCIAL',
                },
                {
                  value: 'INDUSTRIAL',
                  label: 'INDUSTRIAL',
                },
                {
                  value: 'RURAL',
                  label: 'RURAL',
                },
              ]}
              handleChange={(value) => setDados({ ...dados, segmento: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'FORMA DE ASSINATURA'}
              editable={true}
              options={[
                {
                  value: 'FISICO',
                  label: 'FISICO',
                },
                {
                  value: 'DIGITAL',
                  label: 'DIGITAL',
                },
              ]}
              handleChange={(value) => setDados({ ...dados, formaAssinatura: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <NumberFloatingInput
              width={'450px'}
              label={'CÓDIGO DO PROJETO CRM'}
              editable={true}
              value={dados.codigoSVB}
              handleChange={(value) => setDados({ ...dados, codigoSVB: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'CANAL DE VENDA'}
              editable={true}
              value={dados.canalVenda}
              handleChange={(value) => setDados({ ...dados, canalVenda: value })}
              options={customersAcquisitionChannels}
            />
          </div>

          {dados.canalVenda == 'INDICAÇÃO DE AMIGO' && (
            <>
              <div className="flex items-center justify-center">
                <TextFloatingInput
                  width={'450px'}
                  label={'NOME INDICADOR'}
                  editable={true}
                  value={dados.nomeIndicador}
                  handleChange={(value) => setDados({ ...dados, nomeIndicador: value.toUpperCase() })}
                />
              </div>
              <div className="flex items-center justify-center">
                <TextFloatingInput
                  width={'450px'}
                  label={'TELEFONE INDICADOR'}
                  editable={true}
                  value={dados.telefoneIndicador}
                  handleChange={(value) => setDados({ ...dados, telefoneIndicador: phoneMask(value) })}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">COMO VOCÊ CHEGOU A ESSE CLIENTE?</span>
          <textarea
            placeholder={'Descrição aqui..'}
            value={dados.comoChegouAoCliente}
            onChange={(e) => setDados({ ...dados, comoChegouAoCliente: e.target.value })}
            className="block p-2.5 w-full h-[80px] outline-none resize-none text-center text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>
      <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
        <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">DADOS PARA CONTATO</span>
        <div className="flex gap-2 justify-around flex-wrap p-2">
          <TextFloatingInput
            label={'NOME DO CONTATO 1'}
            editable={true}
            value={dados.nomeContatoJornadaUm}
            handleChange={(value) => setDados({ ...dados, nomeContatoJornadaUm: value.toUpperCase() })}
          />
          <TextFloatingInput
            label={'TELEFONE DO CONTATO 1'}
            editable={true}
            value={dados.telefoneContatoUm}
            handleChange={(value) => setDados({ ...dados, telefoneContatoUm: phoneMask(value) })}
          />
          <TextFloatingInput
            label={'NOME DO CONTATO 2'}
            editable={true}
            value={dados.nomeContatoJornadaDois}
            handleChange={(value) =>
              setDados({
                ...dados,
                nomeContatoJornadaDois: value.toUpperCase(),
              })
            }
          />
          <TextFloatingInput
            label={'TELEFONE DO CONTATO 2'}
            editable={true}
            value={dados.telefoneContatoDois}
            handleChange={(value) => setDados({ ...dados, telefoneContatoDois: phoneMask(value) })}
          />
          <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">CUIDADOS PARA CONTATO COM O CLIENTE</span>
            <textarea
              placeholder={
                'Descreva aqui cuidados em relação ao contato do cliente durante a jornada. Melhores horários para contato, texto ou aúdio, etc...'
              }
              value={dados.cuidadosContatoJornada}
              onChange={(e) =>
                setDados({
                  ...dados,
                  cuidadosContatoJornada: e.target.value,
                })
              }
              className="block p-2.5 w-full h-[80px] outline-none resize-none text-center text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
        <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">ENDEREÇO DA INSTALAÇAO</span>
        <div className="flex flex-col lg:grid grid-cols-3 gap-2">
          <div className="flex items-center justify-center col-span-3 mt-2">
            <SelectFloatingInput
              label={'TIPO DA INSTALAÇÃO'}
              editable={true}
              value={dados.tipoDaInstalacao}
              handleChange={(value) => setDados({ ...dados, tipoDaInstalacao: value })}
              options={[
                {
                  label: 'RURAL',
                  value: 'RURAL',
                },
                {
                  label: 'URBANO',
                  value: 'URBANO',
                },
                {
                  label: 'NÃO DEFINIDO',
                  value: 'NÃO DEFINIDO',
                },
              ]}
            />
          </div>
          <div className="flex items-center justify-center gap-x-2 flex-wrap">
            <TextFloatingInput
              editable={true}
              label={'CEP INSTALAÇÃO'}
              value={dados.cepInstalacao}
              handleChange={(value) => setDados({ ...dados, cepInstalacao: formatCEP(value) })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              label={'ENDEREÇO DE INSTALAÇÃO'}
              editable={true}
              value={dados.enderecoInstalacao}
              handleChange={(value) => setDados({ ...dados, enderecoInstalacao: value.toUpperCase() })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              label={'Nº'}
              editable={true}
              value={dados.numeroResInstalacao}
              handleChange={(value) => setDados({ ...dados, numeroResInstalacao: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              label={'BAIRRO'}
              editable={true}
              value={dados.bairroInstalacao}
              handleChange={(value) => setDados({ ...dados, bairroInstalacao: value.toUpperCase() })}
            />
          </div>
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              label={'CIDADE'}
              editable={true}
              value={dados.cidadeInstalacao}
              options={[
                { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                ...cidadesAtendidas.map((cidade) => {
                  return { label: cidade, value: cidade }
                }),
              ]}
              handleChange={(value) => setDados({ ...dados, cidadeInstalacao: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              label={'UF'}
              editable={true}
              value={dados.ufInstalacao}
              handleChange={(value) => setDados({ ...dados, ufInstalacao: value })}
            />
          </div>
          <div className="flex items-center justify-center col-span-3">
            <TextFloatingInput
              label={'PONTO DE REFERÊNCIA DA INSTALAÇÃO'}
              width={'450px'}
              editable={true}
              value={dados.pontoDeReferenciaInstalacao}
              handleChange={(value) => setDados({ ...dados, pontoDeReferenciaInstalacao: value })}
            />
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap col-span-3">
            <TextFloatingInput
              label={'LATITUDE'}
              value={dados.latitude}
              editable={true}
              handleChange={(value) => setDados({ ...dados, latitude: value })}
            />
            <TextFloatingInput
              label={'LONGITUDE'}
              editable={true}
              value={dados.longitude}
              handleChange={(value) => setDados({ ...dados, longitude: value })}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
        <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">DADOS DO SISTEMA OFF GRID</span>
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-x-2 gap-y-1 mt-3">
          <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">INVERSOR</h1>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              label={'MARCA DO INVERSOR'}
              editable={true}
              value={dados.marcaInversor}
              handleChange={(value) => setDados({ ...dados, marcaInversor: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              label={'QTDE INVERSOR'}
              editable={true}
              value={dados.qtdeInversor}
              handleChange={(value) => setDados({ ...dados, qtdeInversor: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              label={'POTÊNCIA INVERSOR'}
              unit={'W'}
              editable={true}
              value={dados.potInversor}
              handleChange={(value) => setDados({ ...dados, potInversor: value })}
            />
          </div>
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-x-2 gap-y-1 mt-3">
          <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">MÓDULOS</h1>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              label={'MARCA DOS MÓDULOS'}
              editable={true}
              value={dados.marcaModulos}
              handleChange={(value) => setDados({ ...dados, marcaModulos: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              label={'Nº DE MÓDULOS'}
              editable={true}
              value={dados.qtdeModulos}
              handleChange={(value) => setDados({ ...dados, qtdeModulos: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              label={'POTÊNCIA DOS MÓDULOS'}
              unit={'W'}
              editable={true}
              value={dados.potModulos}
              handleChange={(value) => setDados({ ...dados, potModulos: value })}
            />
          </div>
        </div>
        <div className="flex flex-col border-t border-gray-200 p-2">
          <h1 className="text-[#fead61] text-center font-bold py-2">CONTROLADORES</h1>
          <div className="flex flex-col lg:grid lg:grid-cols-4 items-center mt-2">
            <div className="flex justify-center items-center w-full">
              <TextFloatingInput
                label={'MARCA DO CONTROLADOR'}
                editable={true}
                value={dados.marcaControlador}
                handleChange={(value) =>
                  setDados({
                    ...dados,
                    marcaControlador: value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <NumberFloatingInput
                label={'QTDE DE CONTROLADORES'}
                editable={true}
                value={dados.qtdeControlador}
                handleChange={(value) => setDados({ ...dados, qtdeControlador: Number(value) })}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <SelectFloatingInput
                label={'TIPO DO CONTROLADOR'}
                editable={true}
                value={dados.tipoControlador ? dados.tipoControlador : 'NÃO DEFINIDO'}
                options={[
                  {
                    label: 'INTEGRADO AO INVERSOR',
                    value: 'INTEGRADO AO INVERSOR',
                  },
                  { label: 'COMPRO EM SEPARADO', value: 'SEPARADO' },
                  { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                ]}
                handleChange={(value) => setDados({ ...dados, tipoControlador: value })}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <NumberFloatingInput
                label={'CORRENTE DE CARGA (em A)'}
                editable={true}
                value={dados.correnteControlador}
                handleChange={(value) => setDados({ ...dados, correnteControlador: Number(value) })}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col border-t border-gray-200 p-2">
          <h1 className="text-[#fead61] text-center font-bold py-2">BATERIAS</h1>
          <div className="flex flex-col lg:grid lg:grid-cols-4 items-center mt-2">
            <div className="flex justify-center items-center w-full">
              <TextFloatingInput
                label={'MARCA DA BATERIA'}
                editable={true}
                value={dados.marcaBateria}
                handleChange={(value) => setDados({ ...dados, marcaBateria: value.toUpperCase() })}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <NumberFloatingInput
                label={'QTDE DE BATERIAS'}
                editable={true}
                value={dados.qtdeBateria}
                handleChange={(value) => setDados({ ...dados, qtdeBateria: Number(value) })}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <SelectFloatingInput
                label={'TIPO DA BATERIA'}
                editable={true}
                value={dados.tipoBateria ? dados.tipoBateria : 'NÃO DEFINIDO'}
                options={[
                  { label: 'LÍTIO', value: 'LÍTIO' },
                  { label: 'ESTACIONÁRIA', value: 'ESTACIONÁRIA' },
                  { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                ]}
                handleChange={(value) => setDados({ ...dados, tipoBateria: value })}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <NumberFloatingInput
                label={'CAPACIDADE (em Ah)'}
                editable={true}
                value={dados.capacidadeBateria}
                handleChange={(value) => setDados({ ...dados, capacidadeBateria: Number(value) })}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="col-span-3 text-center font-bold text-[#fead61]">VENDA</h1>
          <div className="flex items-center justify-center col-span-3 mt-2">
            <SelectFloatingInput
              label={'TIPO DE VENDA'}
              editable={true}
              value={dados.tipoVenda ? dados.tipoVenda : 'NÃO DEFINIDO'}
              handleChange={(value) => setDados({ ...dados, tipoVenda: value })}
              options={[
                { label: 'SOMENTE MATERIAL', value: 'SOMENTE MATERIAL' },
                { label: 'MATERIAL+INSTALAÇÃO', value: 'MATERIAL+INSTALAÇÃO' },
                { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
        <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">ESTRUTURA DE MONTAGEM</span>
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 p-2">
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'TIPO DA ESTRUTURA'}
              editable={true}
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
              value={dados.tipoEstrutura}
              handleChange={(value) => setDados({ ...dados, tipoEstrutura: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              label={'ADEQUAÇÃO OU CONSTRUÇÃO DE ESTRUTURA?'}
              width={'450px'}
              editable={true}
              options={[
                {
                  label: 'NÃO',
                  value: 'NÃO',
                },
                {
                  label: 'SIM',
                  value: 'SIM',
                },
                {
                  label: 'NÃO DEFINIDO',
                  value: 'NÃO DEFINIDO',
                },
              ]}
              value={dados.estruturaAmpere}
              handleChange={(value) => setDados({ ...dados, estruturaAmpere: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'RESPONSÁVEL PELA ESTRUTURA'}
              editable={true}
              options={[
                {
                  label: 'AMPERE',
                  value: 'AMPERE',
                },
                {
                  label: 'CLIENTE',
                  value: 'CLIENTE',
                },
                {
                  label: 'NÃO SE APLICA',
                  value: 'NÃO SE APLICA',
                },
              ]}
              value={dados.responsavelEstrutura}
              handleChange={(value) => setDados({ ...dados, responsavelEstrutura: value })}
            />
          </div>

          {dados.responsavelEstrutura != 'NÃO SE APLICA' && (
            <>
              <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">PAGAMENTO DA ESTRUTURA</h1>
              <div className="flex items-center justify-center col-span-3 gap-2 flex-wrap">
                <SelectFloatingInput
                  width={'450px'}
                  label={'FORMA DE PAGAMENTO'}
                  editable={true}
                  options={[
                    {
                      label: 'INCLUSO NO FINANCIAMENTO',
                      value: 'INCLUSO NO FINANCIAMENTO',
                    },
                    {
                      label: 'DIRETO PRO FORNECEDOR',
                      value: 'DIRETO PRO FORNECEDOR',
                    },
                    {
                      label: 'A VISTA PARA AMPÈRE',
                      value: 'A VISTA PARA AMPÈRE',
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
                  value={dados.formaPagamentoEstrutura}
                  handleChange={(value) => setDados({ ...dados, formaPagamentoEstrutura: value })}
                />
                <NumberFloatingInput
                  width={'450px'}
                  label={'VALOR DA ESTRUTURA'}
                  editable={true}
                  value={dados.valorEstrutura}
                  handleChange={(value) => setDados({ ...dados, valorEstrutura: Number(value) })}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
        <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">DADOS FINANCEIROS E NEGOCIAÇÃO</span>
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 mt-2 p-2">
          <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">DADOS DO PAGADOR</h1>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'NOME DO PAGADOR'}
              editable={true}
              value={dados.nomePagador}
              handleChange={(value) => setDados({ ...dados, nomePagador: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'CONTATO DO PAGADOR'}
              editable={true}
              value={dados.contatoPagador}
              handleChange={(value) => setDados({ ...dados, contatoPagador: phoneMask(value) })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'CPF/CNPJ PARA NF'}
              editable={true}
              value={dados.cpf_cnpjNF}
              handleChange={(value) => setDados({ ...dados, cpf_cnpjNF: formatCnpjCpf(value) })}
            />
          </div>
        </div>
        <div className="flex flex-col p-2">
          <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">SOBRE N.F</h1>
          <div className="flex gap-2 justify-around flex-wrap mt-2">
            <SelectFloatingInput
              width={'450px'}
              label={'NECESSIDADE N.F ADIANTADA'}
              editable={true}
              value={dados.necessidadeNFAdiantada}
              options={[
                {
                  label: 'NÃO',
                  value: 'NÃO',
                },
                {
                  label: 'SIM',
                  value: 'SIM',
                },
              ]}
              handleChange={(value) => setDados({ ...dados, necessidadeNFAdiantada: value })}
            />
            <SelectFloatingInput
              width={'450px'}
              label={'NECESSIDADE DE INSCRIÇÃO RURAL NA N.F?'}
              editable={true}
              value={dados.necessidaInscricaoRural}
              handleChange={(value) => setDados({ ...dados, necessidaInscricaoRural: value })}
              options={[
                {
                  label: 'NÃO',
                  value: 'NÃO',
                },
                {
                  label: 'SIM',
                  value: 'SIM',
                },
              ]}
            />
            {dados.necessidaInscricaoRural == 'SIM' && (
              <TextFloatingInput
                width={'450px'}
                label={'INSCRIÇÃO RURAL'}
                editable={true}
                value={dados.inscriçãoRural}
                handleChange={(value) => setDados({ ...dados, inscriçãoRural: value })}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col p-2">
          <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">SOBRE A ENTREGA</h1>
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 mt-2">
            <div className="flex items-center justify-center">
              <SelectFloatingInput
                width={'450px'}
                label={'LOCAL DE ENTREGA'}
                options={[
                  {
                    label: 'MESMO DO PROJETO',
                    value: 'MESMO DO PROJETO',
                  },
                  {
                    label: 'LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)',
                    value: 'LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)',
                  },
                  {
                    label: 'ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)',
                    value: 'ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)',
                  },
                  {
                    label: 'NÃO DEFINIDO',
                    value: 'NÃO DEFINIDO',
                  },
                ]}
                editable={true}
                value={dados.localEntrega}
                handleChange={(value) => setDados({ ...dados, localEntrega: value })}
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectFloatingInput
                width={'450px'}
                label={'END. ENTREGA IGUAL COBRANÇA?'}
                editable={true}
                value={dados.entregaIgualCobranca}
                handleChange={(value) => setDados({ ...dados, entregaIgualCobranca: value })}
                options={[
                  {
                    label: 'SIM',
                    value: 'SIM',
                  },
                  {
                    label: 'NÃO',
                    value: 'NÃO',
                  },
                  {
                    label: 'NÃO DEFINIDO',
                    value: 'NÃO DEFINIDO',
                  },
                ]}
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectFloatingInput
                width={'450px'}
                label={'HÁ RESTRIÇÕES PARA ENTREGA?'}
                editable={true}
                value={dados.restricoesEntrega}
                handleChange={(value) => setDados({ ...dados, restricoesEntrega: value })}
                options={[
                  {
                    label: 'SOMENTE HORARIO COMERCIAL',
                    value: 'SOMENTE HORARIO COMERCIAL',
                  },
                  {
                    label: 'NÃO HÁ RESTRIÇÕES',
                    value: 'NÃO HÁ RESTRIÇÕES',
                  },
                  {
                    label: 'CASA EM CONSTRUÇÃO',
                    value: 'CASA EM CONSTRUÇÃO',
                  },
                  {
                    label: 'NÃO PODE RECEBER EM HORARIO COMERCIAL',
                    value: 'NÃO PODE RECEBER EM HORARIO COMERCIAL',
                  },
                  {
                    label: 'NÃO DEFINIDO',
                    value: 'NÃO DEFINIDO',
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col p-2">
          <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">SOBRE O PAGAMENTO</h1>
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 mt-2">
            <div className="flex items-center justify-center col-span-3 gap-2 flex-wrap">
              <NumberFloatingInput
                width={'450px'}
                label={'VALOR DO CONTRATO FOTOVOLTAICO(SEM CUSTOS ADICIONAIS)'}
                editable={true}
                tag={'R$'}
                value={dados.valorContrato}
                handleChange={(value) => setDados({ ...dados, valorContrato: Number(value) })}
              />
              <SelectFloatingInput
                width={'450px'}
                label={'ORIGEM DO RECURSO'}
                editable={true}
                value={dados.origemRecurso}
                handleChange={(value) => setDados({ ...dados, origemRecurso: value })}
                options={[
                  {
                    label: 'NÃO DEFINIDO',
                    value: 'NÃO DEFINIDO',
                  },
                  {
                    label: 'FINANCIAMENTO',
                    value: 'FINANCIAMENTO',
                  },
                  {
                    label: 'CAPITAL PRÓPRIO',
                    value: 'CAPITAL PRÓPRIO',
                  },
                ]}
              />
            </div>
            {dados.origemRecurso == 'FINANCIAMENTO' && (
              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 mt-2 col-span-3">
                <div className="flex items-center justify-center">
                  <SelectFloatingInput
                    width={'450px'}
                    label={'CREDOR'}
                    editable={true}
                    options={credores.map((credor) => credor)}
                    value={dados.credor}
                    handleChange={(value) => setDados({ ...dados, credor: value })}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <TextFloatingInput
                    width={'450px'}
                    label={'NOME DO GERENTE'}
                    editable={true}
                    value={dados.nomeGerente}
                    handleChange={(value) => setDados({ ...dados, nomeGerente: value })}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <TextFloatingInput
                    width={'450px'}
                    label={'CONTATO DO GERENTE'}
                    editable={true}
                    value={dados.contatoGerente}
                    handleChange={(value) => setDados({ ...dados, contatoGerente: phoneMask(value) })}
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-center">
              <NumberFloatingInput
                width={'450px'}
                label={'SE CARTÃO OU CHEQUE, QUANTAS PARCELAS?'}
                editable={true}
                value={dados.numParcelas}
                handleChange={(value) =>
                  setDados({
                    ...dados,
                    numParcelas: Number(value),
                    valorParcela: dados.valorContrato / Number(value),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <NumberFloatingInput
                width={'450px'}
                label={'VALOR DA PARCELA'}
                editable={true}
                value={dados.valorParcela}
                tag={'R$'}
                handleChange={(value) => setDados({ ...dados, valorParcela: Number(value) })}
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectFloatingInput
                width={'450px'}
                label={'NECESSIDADE CÓDIGO FINAME?'}
                editable={true}
                value={dados.necessidadeCodigoFiname}
                options={[
                  {
                    label: 'NÃO',
                    value: 'NÃO',
                  },
                  {
                    label: 'SIM',
                    value: 'SIM',
                  },
                ]}
                handleChange={(value) => setDados({ ...dados, necessidadeCodigoFiname: value })}
              />
            </div>
            <div className="flex items-center justify-center col-span-3">
              <SelectFloatingInput
                width={'450px'}
                label={'FORMA DE PAGAMENTO'}
                editable={true}
                options={
                  dados.tipoDeServico == 'SISTEMA FOTOVOLTAICO (OFF GRID)'
                    ? [
                        {
                          label: '70% A VISTA NA ENTRADA + 30% NA FINALIZAÇÃO DA INSTALAÇÃO',
                          value: '70% A VISTA NA ENTRADA + 30% NA FINALIZAÇÃO DA INSTALAÇÃO',
                        },
                        {
                          label: '100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO',
                          value: '100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO',
                        },
                        {
                          label: 'NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)',
                          value: 'NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)',
                        },
                        {
                          label: 'NÃO DEFINIDO',
                          value: 'NÃO DEFINIDO',
                        },
                      ]
                    : [
                        {
                          label: '70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR',
                          value: '70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR',
                        },
                        {
                          label: '100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO',
                          value: '100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO',
                        },
                        {
                          label: 'NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)',
                          value: 'NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)',
                        },
                        {
                          label: 'NÃO DEFINIDO',
                          value: 'NÃO DEFINIDO',
                        },
                      ]
                }
                value={dados.formaDePagamento}
                handleChange={(value) => setDados({ ...dados, formaDePagamento: value })}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">DESCRIÇÃO DA NEGOCIAÇÃO</span>
          <textarea
            placeholder={'Descreva aqui a negociação'}
            value={dados.descricaoNegociacao}
            onChange={(e) =>
              setDados({
                ...dados,
                descricaoNegociacao: e.target.value,
              })
            }
            className="block p-2.5 w-full h-[80px] outline-none resize-none text-center text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>
      <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
        <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">DOCUMENTAÇÃO</span>
        <div className="flex flex-col items-center gap-2">
          {dados.links?.length > 0 &&
            dados.links.map((x, index) => (
              <div key={index} className="flex items-center gap-x-2">
                <p className="text-blue-300">{x.title}</p>
                <AiOutlineCheck style={{ color: '#49be25', fontSize: '18px' }} />
              </div>
            ))}
        </div>
      </div>
      {msg.text ? (
        <p className={`text-sm text-center font-bold ${msg.color}`}>{msg.text}</p>
      ) : (
        <div className="flex justify-center flex-wrap gap-2">
          <button onClick={voltar} className="bg-[#15599a] rounded p-2 font-bold text-white">
            VOLTAR
          </button>
          <button onClick={criarSolicitacao} className="bg-[#fead61] rounded p-2 font-bold">
            CRIAR SOLICITAÇÃO
          </button>
        </div>
      )}
    </>
  )
}

export default VisualizacaoOFFGrid
