import CheckboxInput from '@/components/inputs/Checkbox'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { TEmployee, TEmployeeDTO, TUser } from '@/utils/schemas/users'
import { VisualizationTypes, allActiveSellers, allSellers } from '@/utils/select-options'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import PermissionsPannel from '../PermissionsPannel'
import { equipesTecnicas } from '@/utils/constants'

type SystemAccessProps = {
  infoHolder: TEmployeeDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TEmployeeDTO>>
  initialMode: boolean
}
function SystemAccess({ infoHolder, setInfoHolder, initialMode }: SystemAccessProps) {
  const [showMenu, setShowMenu] = useState<boolean>(initialMode)
  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="flex w-full items-center gap-2 rounded bg-gray-800 py-1 text-white">
        <div className="min-w-[50px]"></div>
        <h1 className="grow text-center font-bold">INFORMAÇÕES DE ACESSO DE SISTEMA</h1>
        <div className="flex min-w-[50px] items-center justify-center">
          {showMenu ? (
            <button className="text-white hover:text-cyan-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setShowMenu(false)} />
            </button>
          ) : (
            <button className="text-white hover:text-cyan-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setShowMenu(true)} />
            </button>
          )}
        </div>
      </div>

      {showMenu ? (
        <>
          <div className="flex w-full items-center justify-center">
            <div className="w-fit">
              <CheckboxInput
                checked={infoHolder.acessoAtivo}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    acessoAtivo: value,
                    visualizacao: { ...prev.visualizacao, tipo: !prev.visualizacao.tipo ? 'OPERACIONAL' : prev.visualizacao.tipo },
                  }))
                }
                labelFalse="ACESSO ATIVO"
                labelTrue="ACESSO ATIVO"
                justify="justify-center"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="NOME DO USUÁRIO"
                placeholder="Preencha aqui o nome do usuário.."
                value={infoHolder.usuario}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, usuario: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <TextInput
                label="SENHA DO COLABORADOR"
                placeholder="Preencha aqui a senha de acesso..."
                value={infoHolder.senha}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, senha: value }))}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <SelectInput
                label="TIPO DE VISUALIZAÇÃO"
                value={infoHolder.visualizacao.tipo || undefined}
                selectedItemLabel="NÃO DEFINIDO"
                options={VisualizationTypes}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    visualizacao: { ...prev.visualizacao, tipo: value, referencia: value == 'OPERACIONAL' ? null : prev.visualizacao.referencia },
                  }))
                }
                onReset={() => setInfoHolder((prev) => ({ ...prev, visualizacao: { ...prev.visualizacao, tipo: null, referencia: null } }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              {infoHolder.visualizacao.tipo == 'OPERACIONAL' ? (
                <div className={`relative flex w-full flex-col gap-1`}>
                  <h1 className="font-sans text-start  font-bold text-[#353432]">REFERÊNCIA DA VISUALIZAÇÃO</h1>
                  <h1 className="h-[47px] w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic">NÃO APLICÁVEL</h1>
                </div>
              ) : null}
              {infoHolder.visualizacao.tipo == 'EXECUÇÃO' ? (
                <SelectInput
                  label="REFERÊNCIA DA VISUALIZAÇÃO"
                  value={infoHolder.visualizacao.referencia || undefined}
                  selectedItemLabel="NÃO DEFINIDO"
                  options={equipesTecnicas}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, visualizacao: { ...prev, referencia: value } }))}
                  onReset={() => setInfoHolder((prev) => ({ ...prev, visualizacao: { ...prev.visualizacao, referencia: null } }))}
                  width="100%"
                />
              ) : null}
              {infoHolder.visualizacao.tipo == 'VENDAS' ? (
                <SelectInput
                  label="REFERÊNCIA DA VISUALIZAÇÃO"
                  value={infoHolder.visualizacao.referencia || undefined}
                  selectedItemLabel="NÃO DEFINIDO"
                  options={allSellers}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, visualizacao: { ...prev, referencia: value } }))}
                  onReset={() => setInfoHolder((prev) => ({ ...prev, visualizacao: { ...prev.visualizacao, referencia: null } }))}
                  width="100%"
                />
              ) : null}
              {/* <TextInput
              label="REFERÊNCIA DA VISUALIZAÇÃO"
              editable={infoHolder.visualizacao.tipo != 'OPERACIONAL'}
              placeholder="Preencha aqui a referência do visualização..."
              value={infoHolder.visualizacao.tipo == 'OPERACIONAL' ? 'NÃO APLICÁVEL' : infoHolder.visualizacao.referencia || ''}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, visualizacao: { ...prev.visualizacao, referencia: value } }))}
              width="100%"
              /> */}
            </div>
          </div>
          <PermissionsPannel infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
        </>
      ) : null}
    </div>
  )
}

export default SystemAccess
