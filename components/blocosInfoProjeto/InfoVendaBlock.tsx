import { useSession } from '@/components/providers/SessionProvider'
import { estadosECidades } from '@/utils/estados_cidades'
import { formatToCEP, formatToCPForCNPJ } from '@/utils/methods/formatting'
import { usePartnersSimplified } from '@/utils/methods/query/crm/partners'
import { useUsers } from '@/utils/methods/query/crm/users'
import { formatDateInputChange, getCEPInfo } from '@/utils/methods/shared'
import type { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import type { TProjectDTO } from '@/utils/schemas/projects'
import { allSellers, insiders, serviceTypes } from '@/utils/select-options'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Link from 'next/link'
import type React from 'react'
import toast from 'react-hot-toast'
import { FaFile } from 'react-icons/fa'
import { formatDate, oemPlans } from '../../utils/constants'
import AllCities from '../../utils/jsons/cidades.json'
import UpdateLogsBlock from '../identificador/registrosAlteracoesProjeto/UpdateLogsBlock'
import Client from '../identificador/registrosAlteracoesProjeto/secao/Client'
import CheckboxInput from '../inputs/Checkbox'
import DateInput from '../inputs/Date'
import NumberInput from '../inputs/Number'
import SelectInput from '../inputs/Select'
import SelectInputVirtualized from '../inputs/SelectVirtualized'
import SelectWithImages from '../inputs/SelectWithImages'
import TextInput from '../inputs/Text'

type InfoClientBlockProps = {
  editor: boolean
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  updateLogs: TProjectUpdateLogDTO[]
  project: TProjectDTO
}
function InfoVendaBlock({ editor, infoHolder, setInfo, changes, setChanges, updateLogs = [], project }: InfoClientBlockProps) {
  const { session } = useSession()
  const { data: partners } = usePartnersSimplified()
  const { data: crmUsers } = useUsers({ includeDeleted: true })
  const queryClient = useQueryClient()

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
        setInfo((prev) => ({
          ...prev,
          logradouro: addressInfo.logradouro,
          bairro: addressInfo.bairro,
          uf: addressInfo.uf,
          cidade: addressInfo.localidade.toUpperCase(),
        }))
        setChanges((prev) => ({
          ...prev,
          logradouro: addressInfo.logradouro,
          bairro: addressInfo.bairro,
          uf: addressInfo.uf,
          cidade: addressInfo.localidade.toUpperCase(),
        }))
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tl-md rounded-tr-md bg-[#15599a] py-2 text-center font-bold text-white">INFORMAÇÕES DO CONTRATO</span>
      <UpdateLogsBlock logs={updateLogs} SectionElement={<Client logs={updateLogs} />} />
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'NOME DO CONTRATO'}
            placeholder="Preencha o nome do contrato..."
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
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'NOME DO PROJETO'}
            placeholder="Preencha o nome do projeto..."
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
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'CÓDIGO CRM'}
            placeholder="Preencha o código SVG do projeto..."
            value={infoHolder.codigoSVB ? infoHolder.codigoSVB.toString() : ''}
            editable={session?.user.permissoes.comercial.visualizar}
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
            width="100%"
          />
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'CPF/CNPJ DO CONTRATO'}
            placeholder="Preencha o CPF do titular do projeto..."
            editable={editor}
            value={infoHolder.cpf_cnpj ? formatToCPForCNPJ(infoHolder.cpf_cnpj?.toString() || '') : ''}
            handleChange={(value) => {
              setChanges({ ...changes, cpf_cnpj: formatToCPForCNPJ(value) })
              setInfo({
                ...infoHolder,
                cpf_cnpj: value,
              })
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <DateInput
            label="DATA DE NASCIMENTO"
            value={formatDate(infoHolder.dataNascimento)}
            handleChange={(value) => {
              setInfo((prev) => ({
                ...prev,
                dataNascimento: formatDateInputChange(value, 'string') as string,
              }))
              setChanges((prev) => ({ ...prev, dataNascimento: formatDateInputChange(value) }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'INSCRIÇÃO RURAL DO CONTRATO'}
            placeholder="Preencha a inscrição rural, se aplicável..."
            editable={editor}
            value={infoHolder.inscricaoRural || ''}
            handleChange={(value) => {
              setChanges({ ...changes, inscricaoRural: value })
              setInfo({
                ...infoHolder,
                inscricaoRural: value,
              })
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <SelectInput
            label="TIPO DE SERVIÇO"
            value={infoHolder.tipoDeServico}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={serviceTypes.map((tipo, index) => ({ id: index + 1, label: tipo.label, value: tipo.value }))}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, tipoDeServico: value }))
              setInfo((prev) => ({ ...prev, tipoDeServico: value }))
            }}
            onReset={() => {
              setChanges((prev) => ({ ...prev, tipoDeServico: 'NÃO DEFINIDO' }))
              setInfo((prev) => ({ ...prev, tipoDeServico: 'NÃO DEFINIDO' }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'EMPRESA/FILIAL'}
            editable={editor}
            value={infoHolder.idParceiro}
            selectedItemLabel="NÃO DEFINIDO"
            options={partners?.map((p) => ({ id: p._id, label: p.nome, value: p._id })) || []}
            handleChange={(value) => {
              const partner = partners?.find((p) => p._id === value)
              setChanges({ ...changes, idParceiro: value, nomeParceiro: partner?.nome })
              setInfo({ ...infoHolder, idParceiro: value, nomeParceiro: partner?.nome })
            }}
            onReset={() => {
              setChanges({ ...changes, idParceiro: null, nomeParceiro: null })
              setInfo({ ...infoHolder, idParceiro: null, nomeParceiro: null })
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'TELEFONE DO CONTRATO'}
            placeholder="Preencha o telefone do titular do projeto..."
            editable={editor}
            value={infoHolder.telefone ? infoHolder.telefone : ''}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, telefone: value }))
              setInfo((prev) => ({ ...prev, telefone: value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'EMAIL DO CONTRATO'}
            placeholder="Preencha o email do cliente..."
            editable={editor}
            value={infoHolder.email ? infoHolder.email : ''}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, email: value }))
              setInfo((prev) => ({ ...prev, email: value }))
            }}
            width="100%"
          />
        </div>
      </div>
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">ENDEREÇO DE EXECUÇÃO</h1>
      <div className="flex w-full items-center justify-center px-2">
        <TextInput
          label={'CEP'}
          placeholder="Preencha o CEP do cliente..."
          editable={editor}
          value={infoHolder.cep ? formatToCEP(infoHolder.cep.toString()) : ''}
          handleChange={(value) => {
            if (value.length === 9) {
              setAddressDataByCEP(value)
            }
            setChanges((prev) => ({ ...prev, cep: value }))
            setInfo((prev) => ({ ...prev, cep: value }))
          }}
        />
      </div>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <SelectInput
            label="ESTADO"
            value={infoHolder.uf}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, uf: value }))
              setChanges((prev) => ({ ...prev, uf: value }))
            }}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => {
              setInfo((prev) => ({ ...prev, uf: 'NÃO DEFINIDO' }))
              setChanges((prev) => ({ ...prev, uf: 'NÃO DEFINIDO' }))
            }}
            options={Object.keys(estadosECidades).map((state, index) => ({ id: index + 1, label: state, value: state }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SelectInputVirtualized
            label={'CIDADE'}
            editable={editor}
            value={infoHolder.cidade}
            selectedItemLabel="NÃO DEFINIDO"
            options={AllCities.map((city, index) => ({ id: index + 1, label: city, value: city }))}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                cidade: value,
              }))
              setInfo((prev) => ({
                ...prev,
                cidade: value,
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                cidade: '',
              }))
              setInfo((prev) => ({
                ...prev,
                cidade: '',
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
            editable={editor}
            value={infoHolder.bairro ? infoHolder.bairro : ''}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, bairro: value }))
              setInfo((prev) => ({ ...prev, bairro: value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'LOGRADOURO'}
            placeholder="Preencha o logradouro do cliente..."
            editable={editor}
            value={infoHolder.logradouro ? infoHolder.logradouro : ''}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, logradouro: value }))
              setInfo((prev) => ({ ...prev, logradouro: value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'NÚMERO DA RESIDÊNCIA'}
            placeholder="Preencha o número da residência do cliente..."
            editable={editor}
            value={infoHolder.numeroResidencia ? infoHolder.numeroResidencia.toString() : ''}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                numeroResidencia: value,
              }))
              setInfo((prev) => ({
                ...prev,
                numeroResidencia: value,
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="LONGITUDE"
            placeholder="Preencha aqui a longitude da localização do projeto..."
            value={infoHolder.longitude || ''}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, longitude: value }))
              setChanges((prev) => ({ ...prev, longitude: value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="LATITUDE"
            placeholder="Preencha aqui a latitude da localização do projeto..."
            value={infoHolder.latitude || ''}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, latitude: value }))
              setChanges((prev) => ({ ...prev, latitude: value }))
            }}
            width="100%"
          />
        </div>
      </div>
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">INFORMAÇÕES DA VENDA</h1>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'CANAL DE VENDA'}
            value={infoHolder.canalVenda}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={[
              { id: 1, label: 'EVENTO', value: 'EVENTO' },
              { id: 2, label: 'INDICAÇÃO DE AMIGO', value: 'INDICAÇÃO DE AMIGO' },
              { id: 3, label: 'INSIDE SALES', value: 'INSIDE SALES' },
              { id: 4, label: 'PASSIVO', value: 'PASSIVO' },
              { id: 5, label: 'PORTA A PORTA', value: 'PORTA A PORTA' },
              { id: 6, label: 'TELEVENDAS', value: 'TELEVENDAS' },
              { id: 7, label: 'NETWORK', value: 'NETWORK' },
              { id: 8, label: 'OUTRO', value: 'OUTRO' },
            ]}
            handleChange={(value) => {
              setChanges({ ...changes, canalVenda: value })
              setInfo({ ...infoHolder, canalVenda: value })
            }}
            onReset={() => {
              setChanges({ ...changes, canalVenda: 'NÃO DEFINIDO' })
              setInfo({ ...infoHolder, canalVenda: 'NÃO DEFINIDO' })
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'SEGMENTO'}
            value={infoHolder.segmento}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={[
              { id: 1, label: 'COMERCIAL', value: 'COMERCIAL' },
              { id: 2, label: 'INDUSTRIAL', value: 'INDUSTRIAL' },
              { id: 3, label: 'RESIDENCIAL', value: 'RESIDENCIAL' },
              { id: 4, label: 'RURAL', value: 'RURAL' },
            ]}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, segmento: value }))
              setInfo((prev) => ({ ...prev, segmento: value }))
            }}
            onReset={() => {
              setChanges((prev) => ({ ...prev, segmento: 'NÃO DEFINIDO' }))
              setInfo((prev) => ({ ...prev, segmento: 'NÃO DEFINIDO' }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectWithImages
            label={'VENDEDOR'}
            value={infoHolder.vendedor.nome}
            selectedItemLabel="NÃO DEFINIDO"
            options={
              crmUsers?.map((u) => ({
                id: u._id,
                label: u.nome,
                value: u.nome,
                url: u.avatar_url || undefined,
              })) || []
            }
            editable={editor}
            handleChange={(value) => {
              const selectedUser = crmUsers?.find((u) => u.nome === value)
              setChanges((prev) => ({
                ...prev,
                'vendedor.nome': value,
                'vendedor.idCRM': selectedUser?._id,
                'vendedor.avatar': selectedUser?.avatar_url,
              }))
              setInfo((prev) => ({
                ...prev,
                vendedor: { ...prev.vendedor, nome: value, idCRM: selectedUser?._id, avatar: selectedUser?.avatar_url },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                'vendedor.nome': 'NÃO DEFINIDO',
                'vendedor.idCRM': null,
                'vendedor.avatar': null,
              }))
              setInfo((prev) => ({
                ...prev,
                vendedor: { ...prev.vendedor, nome: 'NÃO DEFINIDO', idCRM: null, avatar: null },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectWithImages
            label={'INSIDER'}
            value={infoHolder.insider}
            selectedItemLabel="NÃO DEFINIDO"
            options={crmUsers?.map((u) => ({ id: u._id, label: u.nome, value: u.nome, url: u.avatar_url || undefined })) || []}
            editable={editor}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                insider: value,
              }))
              setInfo((prev) => ({
                ...prev,
                insider: value,
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                insider: 'NÃO DEFINIDO',
              }))
              setInfo((prev) => ({
                ...prev,
                insider: 'NÃO DEFINIDO',
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="mt-2 flex w-full items-center justify-center self-center">
        <CheckboxInput
          labelFalse="POSSUIA GD?"
          labelTrue="POSSUIA GD?"
          checked={!!infoHolder.possuiaGD}
          handleChange={(value) => {
            setInfo((prev) => ({ ...prev, possuiaGD: value }))
            setChanges((prev) => ({ ...prev, possuiaGD: value }))
          }}
        />
      </div>

      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">VINCULAÇÕES</h1>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'LINK PASTA NA NUVEM'}
            placeholder="Preencha o link da pasta na nuvem..."
            editable={editor}
            value={infoHolder.linkDrive}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, linkDrive: value }))
              setInfo((prev) => ({ ...prev, linkDrive: value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'ID DA VISITA TÉCNICA'}
            editable={true}
            placeholder="Preencha o ID de visita técnica..."
            value={infoHolder.idVisitaTecnica || ''}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, idVisitaTecnica: value }))
              setInfo((prev) => ({ ...prev, idVisitaTecnica: value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'ID DO PROJETO CRM'}
            editable={editor}
            placeholder="Preencha o ID do projeto CRM..."
            value={infoHolder.idProjetoCRM || ''}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, idProjetoCRM: value }))
              setInfo((prev) => ({ ...prev, idProjetoCRM: value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'ID DA PROPOSTA COMERCIAL'}
            editable={editor}
            placeholder="Preencha o ID da proposta comercial..."
            value={infoHolder.idPropostaCRM || ''}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, idPropostaCRM: value }))
              setInfo((prev) => ({ ...prev, idPropostaCRM: value }))
            }}
            width="100%"
          />
        </div>
      </div>
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">OPERAÇÃO E MANUTENÇÃO</h1>
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2">
        <div className="flex items-center justify-center">
          <div className="w-fit">
            <CheckboxInput
              labelFalse="POSSUI O&M?"
              labelTrue="POSSUI O&M?"
              checked={!!infoHolder.oem?.aplicavel}
              handleChange={(value) => {
                setInfo((prev) => ({ ...prev, oem: { ...(prev.oem || {}), aplicavel: value } }))
                setChanges((prev) => ({ ...prev, 'oem.aplicavel': value }))
              }}
            />
          </div>
        </div>
        {infoHolder.oem?.aplicavel ? (
          <div className="mt-2 flex w-full flex-col items-center justify-center gap-2">
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/3">
                <SelectInput
                  label={'PLANO DE O&M'}
                  editable={editor}
                  value={infoHolder.oem?.plano ? infoHolder.oem.plano : 'NÃO DEFINIDO'}
                  selectedItemLabel="NÃO DEFINIDO"
                  options={oemPlans.map((plan, index) => ({ id: index + 1, ...plan }))}
                  handleChange={(value) => {
                    setChanges((prev) => ({ ...prev, 'oem.plano': value }))
                    setInfo((prev) => ({
                      ...prev,
                      oem: {
                        ...(prev.oem || {}),
                        plano: value,
                      },
                    }))
                  }}
                  onReset={() => {
                    setChanges((prev) => ({ ...prev, 'oem.plano': 'NÃO DEFINIDO' }))
                    setInfo((prev) => ({
                      ...prev,
                      oem: {
                        ...(prev.oem || {}),
                        plano: 'NÃO DEFINIDO',
                      },
                    }))
                  }}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label={'VALOR DO O&M (ADICIONAL)'}
                  placeholder="Preencha o valor do O&M, se adicional."
                  value={infoHolder.oem?.valor ? infoHolder.oem?.valor : 0}
                  editable={editor}
                  handleChange={(value) => {
                    setChanges((prev) => ({
                      ...prev,
                      'oem.valor': value,
                    }))
                    setInfo((prev) => ({
                      ...prev,
                      oem: {
                        ...(prev.oem || {}),
                        valor: value,
                      },
                    }))
                  }}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label={'QTDE DE MANUTENÇÕES'}
                  placeholder="Preencha a quantidade de manutenções"
                  value={infoHolder.oem?.qtdeManutencoes ? infoHolder.oem?.qtdeManutencoes : 0}
                  editable={editor}
                  handleChange={(value) => {
                    setChanges((prev) => ({
                      ...prev,
                      'oem.qtdeManutencoes': value,
                    }))
                    setInfo((prev) => ({
                      ...prev,
                      oem: {
                        ...(prev.oem || {}),
                        qtdeManutencoes: value,
                      },
                    }))
                  }}
                  width="100%"
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <DateInput
                  label="INÍCIO DO PLANO (SE APLICÁVEL)"
                  value={formatDate(infoHolder.oem?.dataInicio)}
                  handleChange={(value) => {
                    setInfo((prev) => ({
                      ...prev,
                      oem: {
                        ...prev.oem,
                        dataInicio: formatDateInputChange(value, 'string') as string,
                        duracao: Math.round(dayjs(formatDateInputChange(prev.oem?.dataFim)).diff(formatDateInputChange(value), 'days') / 365),
                      },
                    }))
                    setChanges((prev) => ({
                      ...prev,
                      'oem.dataInicio': formatDateInputChange(value, 'string') as string,
                      'oem.duracao': Math.round(dayjs(formatDateInputChange(prev.oem?.dataFim)).diff(formatDateInputChange(value), 'days') / 365),
                    }))
                  }}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <DateInput
                  label="FIM DO PLANO (SE APLICÁVEL)"
                  value={formatDate(infoHolder.oem?.dataFim)}
                  handleChange={(value) => {
                    setInfo((prev) => ({
                      ...prev,
                      oem: {
                        ...prev.oem,
                        dataFim: formatDateInputChange(value, 'string') as string,
                        duracao: Math.round(dayjs(formatDateInputChange(value)).diff(prev.oem?.dataInicio, 'days') / 365), //   dayjs(formatDateInputChange(value)).diff(prev.oem.dataInicio),
                      },
                    }))
                    setChanges((prev) => ({
                      ...prev,
                      'oem.dataFim': formatDateInputChange(value, 'string') as string,
                      'oem.duracao': Math.round(dayjs(formatDateInputChange(value)).diff(prev.oem?.dataInicio, 'days') / 365),
                    }))
                  }}
                  width="100%"
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <NumberInput
                  label={'QTDE DE MODULOS'}
                  placeholder="Preencha a quantidade de modulos"
                  value={infoHolder.oem?.qtdeModulos ? infoHolder.oem?.qtdeModulos : 0}
                  editable={editor}
                  handleChange={(value) => {
                    setChanges((prev) => ({
                      ...prev,
                      'oem.qtdeModulos': value,
                    }))
                    setInfo((prev) => ({
                      ...prev,
                      oem: { ...(prev.oem || {}), qtdeModulos: value },
                    }))
                  }}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <NumberInput
                  label={'QTDE DE INVERSORES'}
                  placeholder="Preencha a quantidade de inversores"
                  value={infoHolder.oem?.qtdeInversores ? infoHolder.oem?.qtdeInversores : 0}
                  editable={editor}
                  handleChange={(value) => {
                    setChanges((prev) => ({
                      ...prev,
                      'oem.qtdeInversores': value,
                    }))
                    setInfo((prev) => ({
                      ...prev,
                      oem: { ...(prev.oem || {}), qtdeInversores: value },
                    }))
                  }}
                  width="100%"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">SEGURO</h1>
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2">
        <div className="flex items-center justify-center">
          <div className="w-fit">
            <CheckboxInput
              labelFalse="POSSUI SEGURO"
              labelTrue="POSSUI SEGURO"
              checked={!!infoHolder.seguro?.aplicavel}
              handleChange={(value) => {
                setInfo((prev) => ({ ...prev, seguro: { ...(prev.seguro || {}), aplicavel: value } }))
                setChanges((prev) => ({ ...prev, 'seguro.aplicavel': value }))
              }}
            />
          </div>
        </div>
        {infoHolder.seguro?.aplicavel ? (
          <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <NumberInput
                label={'DURAÇÃO DO SEGURO (EM ANOS)'}
                placeholder="Preencha a duração do seguro em anos..."
                value={infoHolder.seguro?.duracao ? infoHolder.seguro?.duracao : 0}
                editable={editor}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'seguro.duracao': Number(value),
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    seguro: {
                      ...(prev.seguro || {}),
                      duracao: Number(value),
                    },
                  }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <NumberInput
                label={'VALOR DO SEGURO (ADICIONAL)'}
                placeholder="Preencha o valor seguro, se adicional."
                value={infoHolder.seguro?.valor ? infoHolder.seguro?.valor : 0}
                editable={editor}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'seguro.valor': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    seguro: {
                      ...(prev.seguro || {}),
                      valor: value,
                    },
                  }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <DateInput
                label="DATA DE INÍCIO DO SEGURO"
                value={infoHolder.seguro?.dataInicio ? formatDate(infoHolder.seguro.dataInicio) : undefined}
                handleChange={(value) => {
                  setInfo((prev) => ({ ...prev, seguro: { ...(prev.seguro || {}), dataInicio: formatDateInputChange(value, 'string') as string } }))
                  setChanges((prev) => ({ ...prev, 'seguro.dataInicio': formatDateInputChange(value, 'string') as string }))
                }}
                width="100%"
              />
            </div>
          </div>
        ) : null}
      </div>
      <div className="my-1 flex w-full items-center px-2">
        <textarea
          value={infoHolder.obsComercial || ''}
          onChange={(e) => {
            setChanges({ ...changes, obsComercial: e.target.value })
            setInfo({
              ...infoHolder,
              obsComercial: e.target.value,
            })
          }}
          className="border-primary/80 h-[80px] w-full resize-none border bg-gray-200 p-2 text-center text-xs outline-hidden"
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
        <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
          <Link href={`/comercial/pdfProcuracao/${infoHolder.idSolicitacaoContrato}`}>
            <button
              type="button"
              className="border-primary/80 text-primary/80 flex items-center gap-2 rounded border px-4 py-2 duration-300 ease-in-out hover:border-gray-400 hover:text-gray-400"
            >
              <FaFile />
              <p className="text-xs font-bold tracking-tight">TEMPLATE DE PROCURAÇÃO</p>
            </button>
          </Link>
          <Link href={`/comercial/publicoFormulario/${infoHolder.idSolicitacaoContrato}`}>
            <button
              type="button"
              className="flex items-center gap-2 rounded border border-orange-600 px-4 py-2 text-orange-600 duration-300 ease-in-out hover:border-orange-400 hover:text-orange-400"
            >
              <FaFile />
              <p className="text-xs font-bold tracking-tight">SOLICITAÇÃO DE CONTRATO</p>
            </button>
          </Link>
        </div>
      ) : null}
      <div className="flex w-full items-center justify-end gap-2 p-2">
        <Link href={`/publico/formulario-analise-tecnica?projectId=${infoHolder._id}`}>
          <button type="button" className="rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white">
            ANÁLISE TÉCNICA (REQUISIÇÃO PÚBLICA)
          </button>
        </Link>
        <Link href={`/publico/formulario-homologacao?projectId=${infoHolder._id}`}>
          <button type="button" className="rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white">
            HOMOLOGAÇÃO (REQUISIÇÃO PÚBLICA)
          </button>
        </Link>
      </div>
    </div>
  )
}

export default InfoVendaBlock
