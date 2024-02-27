import CheckboxInput from '@/components/inputs/Checkbox'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { TUser } from '@/utils/schemas/users'
import { VisualizationTypes } from '@/utils/select-options'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import PermissionsPannel from '../PermissionsPannel'

type SystemAccessProps = {
  infoHolder: TUser
  setInfoHolder: React.Dispatch<React.SetStateAction<TUser>>
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
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <TextInput
                label="SENHA DO COLABORADOR"
                placeholder="Preencha aqui a senha de acesso..."
                value={infoHolder.senha}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, senha: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
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
            <div className="w-full lg:w-1/3">
              <TextInput
                label="REFERÊNCIA DA VISUALIZAÇÃO"
                editable={infoHolder.visualizacao.tipo != 'OPERACIONAL'}
                placeholder="Preencha aqui a referência do visualização..."
                value={infoHolder.visualizacao.tipo == 'OPERACIONAL' ? 'NÃO APLICÁVEL' : infoHolder.visualizacao.referencia || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, visualizacao: { ...prev.visualizacao, referencia: value } }))}
                width="100%"
              />
            </div>
          </div>
          <PermissionsPannel infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
        </>
      ) : null}
    </div>
  )
}

export default SystemAccess
