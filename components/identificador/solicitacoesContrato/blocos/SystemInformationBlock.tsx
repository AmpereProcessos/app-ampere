import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { TContractRequestDTO } from '@/utils/schemas/contract-requests'
import React from 'react'
import { FaSolarPanel } from 'react-icons/fa'
import { TbTopologyFull } from 'react-icons/tb'

function getJoinedInfo({ marca, qtde, pot }: { marca: string; qtde: string; pot: string }) {
  let splitMarca = marca.split('/')
  let splitQtde = qtde.split('/')
  let splitPot = pot.split('/')
  let holder = []
  for (let i = 0; i < splitMarca.length; i++) {
    let str = `${splitQtde[i]}x ${splitMarca[i]}(${splitPot[i]}W)`
    holder.push(str)
  }
  return holder.join(' - ')
}
type SystemInformationBlockProps = {
  infoHolder: TContractRequestDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>
  userHasEditPermission: boolean
}
function SystemInformationBlock({ infoHolder, setInfoHolder, userHasEditPermission }: SystemInformationBlockProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DA COMPOSIÇÃO DO PROJETO</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'TOPOLOGIA'}
            value={infoHolder.topologia}
            editable={userHasEditPermission}
            selectedItemLabel="NÃO DEFINIDO"
            options={[
              { id: 1, label: 'MICRO-INVERSOR', value: 'MICRO' },
              { id: 2, label: 'INVERSOR', value: 'INVERSOR' },
              { id: 3, label: 'OTIMIZADOR', value: 'OTIMIZADOR' },
            ]}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, topologia: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, topologia: 'INVERSOR' }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'MARCA DO INVERSOR'}
            placeholder="Preencha a marca do inversor/driver..."
            editable={userHasEditPermission}
            value={infoHolder.marcaInversor}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, marcaInversor: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'QTDE DE INVERSORES'}
            placeholder="Preencha a quantidade de inversores/drivers..."
            editable={userHasEditPermission}
            value={infoHolder.qtdeInversor}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeInversor: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'POTÊNCIA DO INVERSOR'}
            placeholder="Preencha a potência dos inversores/drivers..."
            editable={userHasEditPermission}
            value={infoHolder.potInversor}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, potInversor: value }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="flex items-center gap-2 rounded-lg border border-cyan-500 px-2 py-1">
          <TbTopologyFull />
          <p className="text-xs font-bold tracking-tight text-cyan-500">
            {getJoinedInfo({
              marca: infoHolder.marcaInversor ? infoHolder.marcaInversor?.toString().toUpperCase() : '',
              qtde: infoHolder.qtdeInversor ? infoHolder.qtdeInversor?.toString() : '',
              pot: infoHolder.potInversor ? infoHolder.potInversor?.toString() : '',
            })}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'MARCA DOS MÓDULOS'}
            placeholder="Preencha a marca dos modulos..."
            editable={userHasEditPermission}
            value={infoHolder.marcaModulos}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, marcaModulos: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'QTDE DE MÓDULOS'}
            placeholder="Preencha a quantidade de módulos..."
            editable={userHasEditPermission}
            value={infoHolder.qtdeModulos.toString()}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeModulos: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'POTÊNCIA DOS MÓDULOS'}
            placeholder="Preencha a potência dos módulos..."
            editable={userHasEditPermission}
            value={infoHolder.potModulos}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, potModulos: value }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="flex items-center gap-2 rounded-lg border border-cyan-500 px-2 py-1">
          <FaSolarPanel />
          <p className="text-xs font-bold tracking-tight text-cyan-500">
            {getJoinedInfo({
              marca: infoHolder.marcaModulos ? infoHolder.marcaModulos?.toString().toUpperCase() : '',
              qtde: infoHolder.qtdeModulos ? infoHolder.qtdeModulos?.toString() : '',
              pot: infoHolder.potModulos ? infoHolder.potModulos?.toString() : '',
            })}
          </p>
        </div>
      </div>
      {infoHolder.tipoDeServico == 'SISTEMA FOTOVOLTAICO (OFF GRID)' ? (
        <>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/4">
              <SelectInput
                label={'TIPO DO CONTROLADOR'}
                value={infoHolder.tipoControlador}
                editable={userHasEditPermission}
                selectedItemLabel="NÃO DEFINIDO"
                options={[
                  { id: 1, label: 'INTEGRADO AO INVERSOR', value: 'INTEGRADO AO INVERSOR' },
                  { id: 2, label: 'COMPRO EM SEPARADO', value: 'SEPARADO' },
                ]}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipoControlador: value }))}
                onReset={() => setInfoHolder((prev) => ({ ...prev, tipoControlador: 'INVERSOR' }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <TextInput
                label={'MARCA DOS CONTROLADORES'}
                placeholder="Preencha a marca do controlador..."
                editable={userHasEditPermission}
                value={infoHolder.marcaControlador || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, marcaControlador: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <TextInput
                label={'QTDE DE CONTROLADORES'}
                placeholder="Preencha a quantidade de controladores..."
                editable={userHasEditPermission}
                value={infoHolder.qtdeControlador?.toString() || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeControlador: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <TextInput
                label={'CORRENTE DE CARGA (em A)'}
                placeholder="Preencha a corrente de carga do controlador..."
                editable={userHasEditPermission}
                value={infoHolder.correnteControlador?.toString() || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, correnteControlador: value }))}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/4">
              <SelectInput
                label={'TIPO DA BATERIA'}
                value={infoHolder.tipoBateria}
                editable={userHasEditPermission}
                selectedItemLabel="NÃO DEFINIDO"
                options={[
                  { id: 1, label: 'LÍTIO', value: 'LÍTIO' },
                  { id: 2, label: 'ESTACIONÁRIA', value: 'ESTACIONÁRIA' },
                ]}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipoBateria: value }))}
                onReset={() => setInfoHolder((prev) => ({ ...prev, tipoBateria: '' }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <TextInput
                label={'MARCA DAS BATERIAS'}
                placeholder="Preencha a marca das baterias..."
                editable={userHasEditPermission}
                value={infoHolder.marcaBateria || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, marcaBateria: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <TextInput
                label={'QTDE DE BATERIAS'}
                placeholder="Preencha a quantidade de baterias..."
                editable={userHasEditPermission}
                value={infoHolder.qtdeBateria?.toString() || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeBateria: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <TextInput
                label={'CAPACIDADE (em Ah)'}
                placeholder="Preencha a capacidade da bateria..."
                editable={userHasEditPermission}
                value={infoHolder.capacidadeBateria?.toString() || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, capacidadeBateria: value }))}
                width="100%"
              />
            </div>
          </div>
        </>
      ) : null}
      {infoHolder.tipoDeServico.includes('AUMENTO') ? (
        <>
          <h1 className="w-full rounded bg-orange-800 p-1 text-center font-bold text-white">INFORMAÇÕES DO SISTEMA ANTERIOR</h1>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/4">
              <SelectInput
                label={'TOPOLOGIA'}
                value={infoHolder.topologiaAnterior}
                editable={userHasEditPermission}
                selectedItemLabel="NÃO DEFINIDO"
                options={[
                  { id: 1, label: 'MICRO-INVERSOR', value: 'MICRO' },
                  { id: 2, label: 'INVERSOR', value: 'INVERSOR' },
                  { id: 3, label: 'OTIMIZADOR', value: 'OTIMIZADOR' },
                ]}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, topologiaAnterior: value }))}
                onReset={() => setInfoHolder((prev) => ({ ...prev, topologiaAnterior: 'INVERSOR' }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <TextInput
                label={'MARCA DO INVERSOR'}
                placeholder="Preencha a marca do inversor/driver..."
                editable={userHasEditPermission}
                value={infoHolder.marcaInversorAnterior || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, marcaInversorAnterior: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <TextInput
                label={'QTDE DE INVERSORES'}
                placeholder="Preencha a quantidade de inversores/drivers..."
                editable={userHasEditPermission}
                value={infoHolder.qtdeInversorAnterior || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeInversorAnterior: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <TextInput
                label={'POTÊNCIA DO INVERSOR'}
                placeholder="Preencha a potência dos inversores/drivers..."
                editable={userHasEditPermission}
                value={infoHolder.potInversorAnterior || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, potInversorAnterior: value }))}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
            <div className="flex items-center gap-2 rounded-lg border border-cyan-500 px-2 py-1">
              <TbTopologyFull />
              <p className="text-xs font-bold tracking-tight text-cyan-500">
                {getJoinedInfo({
                  marca: infoHolder.marcaInversorAnterior ? infoHolder.marcaInversorAnterior?.toString().toUpperCase() : '',
                  qtde: infoHolder.qtdeInversorAnterior ? infoHolder.qtdeInversorAnterior?.toString() : '',
                  pot: infoHolder.potInversorAnterior ? infoHolder.potInversorAnterior?.toString() : '',
                })}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <TextInput
                label={'MARCA DOS MÓDULOS'}
                placeholder="Preencha a marca dos modulos..."
                editable={userHasEditPermission}
                value={infoHolder.marcaModulosAnterior || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, marcaModulosAnterior: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <TextInput
                label={'QTDE DE MÓDULOS'}
                placeholder="Preencha a quantidade de módulos..."
                editable={userHasEditPermission}
                value={infoHolder.qtdeModulosAnterior?.toString() || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeModulosAnterior: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <TextInput
                label={'POTÊNCIA DOS MÓDULOS'}
                placeholder="Preencha a potência dos módulos..."
                editable={userHasEditPermission}
                value={infoHolder.potModulosAnterior || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, potModulosAnterior: value }))}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
            <div className="flex items-center gap-2 rounded-lg border border-cyan-500 px-2 py-1">
              <FaSolarPanel />
              <p className="text-xs font-bold tracking-tight text-cyan-500">
                {getJoinedInfo({
                  marca: infoHolder.marcaModulos ? infoHolder.marcaModulos?.toString().toUpperCase() : '',
                  qtde: infoHolder.qtdeModulos ? infoHolder.qtdeModulos?.toString() : '',
                  pot: infoHolder.potModulos ? infoHolder.potModulos?.toString() : '',
                })}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <SelectInput
                label={'TIPO DO KIT'}
                value={infoHolder.tipoDoKit}
                editable={userHasEditPermission}
                selectedItemLabel="NÃO DEFINIDO"
                options={[
                  { id: 1, label: 'NORMAL', value: 'NORMAL' },
                  { id: 2, label: 'PROMO', value: 'PROMO' },
                  { id: 3, label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
                ]}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipoDoKit: value }))}
                onReset={() => setInfoHolder((prev) => ({ ...prev, tipoDoKit: 'NÃO SE APLICA' }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <NumberInput
                label="PREVISÃO DE CUSTO DO KIT"
                placeholder="Preencha aqui a previsão de custo do kit..."
                value={infoHolder.previsaoValorDoKit || null}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, previsaoValorDoKit: value }))}
              />
            </div>
            <div className="w-full lg:w-1/3">
              <NumberInput
                label="PREVISÃO DE CUSTO DE INSUMOS"
                placeholder="Preencha aqui a previsão de custo de insumos..."
                value={infoHolder.previsaoCustos || null}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, previsaoCustos: value }))}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default SystemInformationBlock
