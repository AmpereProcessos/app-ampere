import CheckboxInput from '@/components/inputs/Checkbox'
import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { credores } from '@/utils/constants'
import { TContractRequestDTO } from '@/utils/schemas/contract-requests'
import { ContractRequestPaymentOptions } from '@/utils/select-options'
import React from 'react'

type PaymentInformationBlockProps = {
  infoHolder: TContractRequestDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>
  userHasEditPermission: boolean
}
function PaymentInformationBlock({ infoHolder, setInfoHolder, userHasEditPermission }: PaymentInformationBlockProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES SOBRE O PAGAMENTO</h1>
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'NOME DO PAGADOR'}
            placeholder="Preencha o nome do pagador..."
            editable={userHasEditPermission}
            value={infoHolder.nomePagador}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nomePagador: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'TELEFONE DO PAGADOR'}
            placeholder="Preencha o nome do pagador..."
            editable={userHasEditPermission}
            value={infoHolder.contatoPagador}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, contatoPagador: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'CPF/CNPJ DO PAGADOR (NF)'}
            placeholder="Preencha o CPF/CNPJ do pagador..."
            editable={userHasEditPermission}
            value={infoHolder.cpf_cnpjNF}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cpf_cnpjNF: value }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="NECESSÁRIO INSCRIÇÃO RURAL NA NF"
            labelTrue="NECESSÁRIO INSCRIÇÃO RURAL NA NF"
            checked={infoHolder.necessidaInscricaoRural == 'SIM'}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, necessidaInscricaoRural: value ? 'SIM' : 'NÃO' }))}
          />
        </div>
        <div className="w-fit">
          <CheckboxInput
            labelFalse="NECESSÁRIO NF ADIANTADA"
            labelTrue="NECESSÁRIO NF ADIANTADA"
            checked={infoHolder.necessidadeNFAdiantada == 'SIM'}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, necessidadeNFAdiantada: value ? 'SIM' : 'NÃO' }))}
          />
        </div>
        <div className="w-fit">
          <CheckboxInput
            labelFalse="NECESSÁRIO CÓDIGO FINAME"
            labelTrue="NECESSÁRIO CÓDIGO FINAME"
            checked={infoHolder.necessidadeCodigoFiname == 'SIM'}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, necessidadeCodigoFiname: value ? 'SIM' : 'NÃO' }))}
          />
        </div>
      </div>
      {infoHolder.necessidaInscricaoRural ? (
        <div className="flex w-full items-center justify-center">
          <TextInput
            label={'INSCRIÇÃO RURAL'}
            placeholder="Preencha a inscrição rural..."
            editable={userHasEditPermission}
            value={infoHolder.inscriçãoRural}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, inscriçãoRural: value }))}
            width="100%"
          />
        </div>
      ) : null}
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <SelectInput
            label={'LOCAL DE ENTREGA'}
            editable={userHasEditPermission}
            value={infoHolder.localEntrega}
            selectedItemLabel="NÃO DEFINIDO"
            options={[
              { id: 1, label: 'MESMO DO PROJETO', value: 'MESMO DO PROJETO' },
              {
                id: 2,
                label: 'LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)',
                value: 'LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)',
              },
              {
                id: 3,
                label: 'ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)',
                value: 'ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)',
              },
            ]}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localEntrega: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, localEntrega: '' }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SelectInput
            label={'RESTRIÇÕES DE ENTREGA'}
            editable={userHasEditPermission}
            value={infoHolder.restricoesEntrega}
            selectedItemLabel="NÃO DEFINIDO"
            options={[
              { id: 1, label: 'SOMENTE HORARIO COMERCIAL', value: 'SOMENTE HORARIO COMERCIAL' },
              { id: 2, label: 'NÃO HÁ RESTRIÇÕES', value: 'NÃO HÁ RESTRIÇÕES' },
              { id: 3, label: 'CASA EM CONSTRUÇÃO', value: 'CASA EM CONSTRUÇÃO' },
              { id: 4, label: 'NÃO PODE RECEBER EM HORARIO COMERCIAL', value: 'NÃO PODE RECEBER EM HORARIO COMERCIAL' },
            ]}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, restricoesEntrega: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, restricoesEntrega: '' }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <NumberInput
            label="VALOR DO CONTRATO (SEM ADICIONAIS)"
            placeholder="Preencher valor do contrato sem adicionais..."
            value={infoHolder.valorContrato || null}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, valorContrato: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SelectInput
            label={'ORIGEM DO RECURSO'}
            editable={userHasEditPermission}
            value={infoHolder.origemRecurso}
            selectedItemLabel="NÃO DEFINIDO"
            options={[
              { id: 1, label: 'FINANCIAMENTO', value: 'FINANCIAMENTO' },
              { id: 2, label: 'CAPITAL PRÓPRIO', value: 'CAPITAL PRÓPRIO' },
            ]}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, origemRecurso: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, origemRecurso: 'CAPITAL PRÓPRIO' }))}
            width="100%"
          />
        </div>
      </div>
      {infoHolder.origemRecurso == 'FINANCIAMENTO' ? (
        <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <SelectInput
              label={'CREDOR'}
              editable={userHasEditPermission}
              value={infoHolder.credor}
              selectedItemLabel="NÃO DEFINIDO"
              options={credores.map((c, index) => ({ id: index + 1, label: c.label, value: c.value }))}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, credor: value }))}
              onReset={() => setInfoHolder((prev) => ({ ...prev, credor: null }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label={'NOME DO GERENTE'}
              placeholder="Preencha o nome do gerente do cliente..."
              editable={userHasEditPermission}
              value={infoHolder.nomeGerente}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nomeGerente: value }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label={'CONTATO DO GERENTE'}
              placeholder="Preencha o contato do gerente do cliente..."
              editable={userHasEditPermission}
              value={infoHolder.contatoGerente}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, contatoGerente: value }))}
              width="100%"
            />
          </div>
        </div>
      ) : null}
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <NumberInput
            label="SE PARCELADO, Nº DE PARCELAS"
            placeholder="Preencher o número de parcelas..."
            value={infoHolder.numParcelas || null}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, numParcelas: value, valorParcela: (prev.valorContrato || 0) / value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <NumberInput
            label="VALOR DAS PARCELAS"
            placeholder="Preencher o valor de parcelas..."
            value={infoHolder.valorParcela || null}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, valorParcela: value }))}
            width="100%"
          />
        </div>
      </div>
      <SelectInput
        label={'FORMA DE PAGAMENTO'}
        editable={userHasEditPermission}
        value={infoHolder.formaDePagamento}
        selectedItemLabel="NÃO DEFINIDO"
        options={ContractRequestPaymentOptions}
        handleChange={(value) => setInfoHolder((prev) => ({ ...prev, formaDePagamento: value }))}
        onReset={() => setInfoHolder((prev) => ({ ...prev, formaDePagamento: null }))}
        width="100%"
      />
      <div className="mt-2 flex w-full flex-col items-center self-center px-2">
        <span className="text-center font-raleway text-sm font-bold uppercase">DESCRIÇÃO DA NEGOCIAÇÃO</span>
        <textarea
          readOnly={!userHasEditPermission}
          placeholder={'Descreva aqui a negociação'}
          value={infoHolder.descricaoNegociacao}
          className="h-[80px] w-full resize-none border border-gray-600 bg-gray-200 p-2 text-center outline-none"
          onChange={(e) =>
            setInfoHolder((prev) => ({
              ...prev,
              descricaoNegociacao: e.target.value,
            }))
          }
        />
      </div>
    </div>
  )
}

export default PaymentInformationBlock
