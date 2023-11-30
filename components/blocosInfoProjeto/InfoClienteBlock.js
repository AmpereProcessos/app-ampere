import axios from 'axios'
import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { cidadesAtendidas, oemPlans, tiposDeServico, vendedores } from '../../utils/constants'
import NumberInput from '../NumberInput'
import SelectInput from '../SelectInput'
import TextInput from '../TextInput'
import { useSession } from 'next-auth/react'
import { FaFilePdf } from 'react-icons/fa'
import Link from 'next/link'
import { allSellers } from '@/utils/select-options'
import toast from 'react-hot-toast'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { updateProject } from '@/utils/methods/mutation/clients'
import { useQueryClient } from 'react-query'

function formatCnpjCpf(value) {
  const cnpjCpf = value.replace(/\D/g, '')

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
  }

  return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5')
}
function formataCEP(cep) {
  cep = cep
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')

  return cep
}

function InfoClienteBlock({ editor, infoHolder, setInfo, changes, setChanges, project }) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const { mutate } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: updateProject,
    affectedQueryKey: ['project-by-id', infoHolder._id],
    queryClient: queryClient,
  })

  async function findCPF(field) {
    axios.get(`https://viacep.com.br/ws/${infoHolder.cep.replace('-', '')}/json/`).then((res) => {
      if (res.data.erro) {
        return
      } else {
        console.log(cidadesAtendidas.includes(res.data.localidade.toUpperCase()))
        setInfo({
          ...infoHolder,
          bairro: res.data.bairro,
          cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase()) ? res.data.localidade.toUpperCase() : 'NÃO DEFINIDO',
          logradouro: res.data.logradouro,
          uf: res.data.uf,
        })
        setChanges({
          ...changes,
          bairro: res.data.bairro,
          cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase()) ? res.data.localidade.toUpperCase() : 'NÃO DEFINIDO',
          logradouro: res.data.logradouro,
          uf: res.data.uf,
        })
      }
    })
  }
  async function getVisitaInfo(id) {
    const { data } = await axios.post(`/api/solicitacoes/getVisitaTecnica/${id}`, {
      arquivos: 1,
    })

    const analysisFiles = data.arquivos
    if (analysisFiles.length == 0) return toast.error('Visita não possui arquivos vinculados.')
    const formattedFiles = analysisFiles.map((f) => ({ title: f.descricao, link: f.url, category: 'VISITA TÉCNICA', format: f.formato }))
    setInfo((prev) => ({
      ...prev,
      links: {
        ...prev.links,
        visitaTecnica: formattedFiles,
      },
    }))
    setChanges((prev) => ({
      ...prev,
      'links.visitaTecnica': formattedFiles,
    }))
    mutate({ id: infoHolder._id, changes: changes })
  }

  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">INFORMAÇÕES DO CLIENTE</span>
      <div className="flex flex-wrap justify-around gap-2">
        <TextInput
          label={'Nome do contrato'}
          value={infoHolder.nomeDoContrato ? infoHolder.nomeDoContrato : ''}
          editable={editor}
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
          editable={editor}
          handleChange={(value) => {
            setChanges({
              ...changes,
              nomeDoProjeto: value.toUpperCase(),
            })
            setInfo({
              ...infoHolder,
              nomeDoProjeto: value.toUpperCase(),
            })
          }}
        />
        <TextInput
          label={'CÓDIGO CRM'}
          value={infoHolder.codigoSVB ? infoHolder.codigoSVB : ''}
          editable={session?.user.accessibleRoutes.includes('PPS')}
          handleChange={(value) => {
            setChanges({
              ...changes,
              codigoSVB: value.toUpperCase(),
            })
            setInfo({
              ...infoHolder,
              codigoSVB: value.toUpperCase(),
            })
          }}
        />
        <TextInput
          label={'CPF/CNPJ'}
          editable={editor}
          value={infoHolder.cpf_cnpj ? formatCnpjCpf(infoHolder.cpf_cnpj.toString()) : ''}
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
          editable={editor}
          value={infoHolder.telefone ? infoHolder.telefone : ''}
          handleChange={(value) => {
            setChanges({ ...changes, telefone: value })
            setInfo({ ...infoHolder, telefone: value })
          }}
        />
        <SelectInput
          label={'Cidade'}
          editable={editor}
          value={cidadesAtendidas.includes(infoHolder.cidade.toUpperCase()) ? infoHolder.cidade : 'NÃO DEFINIDO'}
          options={[
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            ...cidadesAtendidas.map((cidade) => {
              return { label: cidade, value: cidade }
            }),
          ]}
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
          editable={editor}
          value={infoHolder.cep ? formataCEP(infoHolder.cep.toString()) : ''}
          handleChange={(value) => {
            setChanges({ ...changes, cep: value })
            setInfo({ ...infoHolder, cep: value })
          }}
        />
        {editor && (
          <button onClick={() => findCPF()} className="flex h-[30px] items-center rounded bg-[#fead61] p-1">
            <AiOutlineSearch />
          </button>
        )}

        <TextInput
          label={'Logradouro'}
          editable={editor}
          value={infoHolder.logradouro ? infoHolder.logradouro : ''}
          handleChange={(value) => {
            setChanges({ ...changes, logradouro: value })
            setInfo({ ...infoHolder, logradouro: value })
          }}
        />
        <TextInput
          label={'Bairro'}
          editable={editor}
          value={infoHolder.bairro ? infoHolder.bairro : ''}
          handleChange={(value) => {
            setChanges({ ...changes, bairro: value })
            setInfo({ ...infoHolder, bairro: value })
          }}
        />
        <TextInput
          label={'Número da residência'}
          editable={editor}
          value={infoHolder.numeroResidencia ? infoHolder.numeroResidencia : 0}
          handleChange={(value) => {
            setChanges({
              ...changes,
              numeroResidencia: value,
            })
            setInfo({
              ...infoHolder,
              numeroResidencia: value,
            })
          }}
        />
        <SelectInput
          label={'Regional'}
          editable={editor}
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
          editable={editor}
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
          editable={editor}
          options={[
            { label: 'EVENTO', value: 'EVENTO' },
            {
              label: 'INDICAÇÃO DE AMIGO',
              value: 'INDICAÇÃO DE AMIGO',
            },
            { label: 'INSIDE SALES', value: 'INSIDE SALES' },
            { label: 'PASSIVO', value: 'PASSIVO' },
            { label: 'PORTA A PORTA', value: 'PORTA A PORTA' },
            { label: 'TELEVENDAS', value: 'TELEVENDAS' },
            { label: 'NETWORK', value: 'NETWORK' },
            { label: 'OUTRO', value: 'OUTRO' },
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
          ]}
          handleChange={(value) => {
            setChanges({ ...changes, canalVenda: value })
            setInfo({ ...infoHolder, canalVenda: value })
          }}
        />
        <div className="flex">
          <SelectInput
            label={'VENDEDOR'}
            value={infoHolder.vendedor != undefined && infoHolder.vendedor.nome != '-' ? infoHolder.vendedor.nome : 'NÃO DEFINIDO'}
            options={allSellers.map((vendedor) => {
              return {
                label: vendedor.label,
                value: vendedor.value,
              }
            })}
            editable={editor}
            handleChange={(value) => {
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
        <SelectInput
          label={'INSIDER'}
          value={infoHolder.insider ? infoHolder.insider : 'NÃO DEFINIDO'}
          options={[
            { label: 'NÃO DEFINIDO', valor: 'NÃO DEFINIDO' },
            ...vendedores
              .filter((x) => x.qualificacao?.includes('INSIDE'))
              .map((vendedor) => {
                return {
                  label: vendedor.nome,
                  value: vendedor.nome,
                }
              }),
          ]}
          editable={editor}
          handleChange={(value) => {
            setChanges({
              ...changes,
              insider: value,
            })
            setInfo({
              ...infoHolder,
              insider: value,
            })
          }}
        />
        <SelectInput
          label={'SEGMENTO'}
          value={infoHolder.segmento ? infoHolder.segmento : 'NÃO DEFINIDO'}
          editable={editor}
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
          label={'LINK PASTA DO DRIVE'}
          editable={editor}
          normalCase={true}
          value={infoHolder.linkDrive ? infoHolder.linkDrive : ''}
          handleChange={(value) => {
            setChanges({ ...changes, linkDrive: value })
            setInfo({ ...infoHolder, linkDrive: value })
          }}
        />
        <TextInput
          label={'ID DA VISITA TÉCNICA'}
          editable={true}
          normalCase={true}
          value={infoHolder.idVisitaTecnica ? infoHolder.idVisitaTecnica : ''}
          handleChange={(value) => {
            setChanges({ ...changes, idVisitaTecnica: value })
            setInfo({ ...infoHolder, idVisitaTecnica: value })
          }}
        />
        {!project.links?.visitaTecnica && editor ? (
          <button
            onClick={() => getVisitaInfo(infoHolder.idVisitaTecnica)}
            className="flex h-[30px] items-center rounded bg-[#15599a] p-1 text-white"
          >
            <AiOutlineSearch />
          </button>
        ) : null}

        <SelectInput
          label="TIPO DE SERVIÇO"
          value={infoHolder.tipoDeServico}
          editable={editor}
          options={tiposDeServico.map((tipo) => tipo)}
          handleChange={(value) => {
            setChanges({ ...changes, tipoDeServico: value })
            setInfo({ ...infoHolder, tipoDeServico: value })
          }}
        />
        <div>
          <input
            checked={infoHolder.possuiaGD ? true : false}
            onChange={(e) => {
              setChanges({
                ...changes,
                possuiaGD: e.target.checked,
              })
              setInfo({
                ...infoHolder,
                possuiaGD: e.target.checked,
              })
            }}
            type="checkbox"
            name="possuiaGD"
            id="possuiaGD"
          />
          <label className="ml-2" htmlFor="possuiaGD">
            JÁ POSSUIA GD?
          </label>
        </div>
        <div>
          <input
            disabled={!editor}
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
            name="possuiOEM"
            id="possuiOEM"
          />
          <label className="ml-2" htmlFor="possuiOEM">
            POSSUI O&M?
          </label>
        </div>
        {infoHolder.oem?.aplicavel && (
          <NumberInput
            label={'Duração O&M (anos)'}
            value={infoHolder.oem?.duracao ? infoHolder.oem?.duracao : 0}
            editable={editor}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'oem.duracao': Number(value),
              })
              setInfo({
                ...infoHolder,
                oem: {
                  ...infoHolder.oem,
                  duracao: Number(value),
                },
              })
            }}
          />
        )}
        {infoHolder.oem?.aplicavel && (
          <>
            <NumberInput
              label={'QTDE de manutenções'}
              value={infoHolder.oem?.qtdeManutencoes ? infoHolder.oem?.qtdeManutencoes : 0}
              editable={editor}
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
            <SelectInput
              label={'PLANO DE O&M'}
              editable={editor}
              value={infoHolder.oem?.plano ? infoHolder.oem.plano : 'NÃO DEFINIDO'}
              options={[...oemPlans.map((plan) => plan), { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' }]}
              handleChange={(value) => {
                setChanges({ ...changes, 'oem.plano': value })
                setInfo({
                  ...infoHolder,
                  oem: {
                    ...infoHolder.oem,
                    plano: value,
                  },
                })
              }}
            />
          </>
        )}
      </div>
      <div className="my-1 flex w-full items-center px-2">
        <textarea
          value={infoHolder.obsComercial}
          onChange={(e) => {
            setChanges({ ...changes, obsComercial: e.target.value })
            setInfo({
              ...infoHolder,
              obsComercial: e.target.value,
            })
          }}
          className="h-[80px] w-full resize-none border border-gray-600 bg-gray-200 p-2 text-center text-xs outline-none"
        />
      </div>
      {infoHolder.linkDrive && (
        <div className="flex w-full items-center justify-center py-2">
          <a className="font-medium text-blue-400 hover:text-[#15599a]" href={infoHolder.linkDrive}>
            LINK PASTA NA NUVEM
          </a>
        </div>
      )}
      {infoHolder.idSolicitacaoContrato ? (
        <div className="flex w-full items-center justify-center">
          <Link href={`/comercial/publicoFormulario/${infoHolder.idSolicitacaoContrato}`}>
            <a className="mt-2 flex cursor-pointer items-center rounded border border-orange-200 p-2 py-2 pl-2 duration-300 ease-in hover:scale-[1.02] hover:bg-orange-200">
              <FaFilePdf style={{ color: '#fead41', fontSize: '20px' }} />
              <p className="pl-3 text-sm font-medium text-gray-600">SOLICITAÇÃO DE CONTRATO</p>
            </a>
          </Link>
        </div>
      ) : null}
    </div>
  )
}

export default InfoClienteBlock
