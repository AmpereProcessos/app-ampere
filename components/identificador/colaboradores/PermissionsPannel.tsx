import CheckboxInput from '@/components/inputs/Checkbox'
import { TEmployee, TEmployeeDTO, TUser } from '@/utils/schemas/users'
import React from 'react'

type PermissionsPannelProps = {
  infoHolder: TEmployeeDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TEmployeeDTO>>
}
function PermissionsPannel({ infoHolder, setInfoHolder }: PermissionsPannelProps) {
  return (
    <>
      <h1 className="w-full pt-4 text-center text-sm font-medium">PERMISSÕES DO USUÁRIO</h1>
      {/**USUÁRIOS */}
      <h1 className="w-full text-start text-sm text-gray-500">USUÁRIOS</h1>
      <CheckboxInput
        labelFalse="APTO A CRIAR USUÁRIOS"
        labelTrue="APTO A CRIAR USUÁRIOS"
        checked={infoHolder.permissoes.usuarios.criar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              usuarios: { ...prev.permissoes.usuarios, criar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR USUÁRIOS"
        labelTrue="APTO A EDITAR USUÁRIOS"
        checked={infoHolder.permissoes.usuarios.editar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              usuarios: { ...prev.permissoes.usuarios, editar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR TODOS OS USUÁRIOS"
        labelTrue="APTO A VISUALIZAR TODOS OS USUÁRIOS"
        checked={infoHolder.permissoes.usuarios.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              usuarios: {
                ...prev.permissoes.usuarios,
                visualizar: value,
              },
            },
          }))
        }
      />
      {/**SETOR COMERCIAL */}
      <h1 className="w-full text-start text-sm text-gray-500">SETOR COMERCIAL</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR COMERCIAL"
        labelTrue="APTO A VISUALIZAR SETOR COMERCIAL"
        checked={infoHolder.permissoes.comercial.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              comercial: {
                ...prev.permissoes.comercial,
                visualizar: value,
              },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR COMERCIAL"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR COMERCIAL"
        checked={infoHolder.permissoes.comercial.editar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              comercial: {
                ...prev.permissoes.comercial,
                editar: value,
              },
            },
          }))
        }
      />
      {/**PÓS VENDAS */}
      <h1 className="w-full text-start text-sm text-gray-500">SETOR DE PÓS-VENDA</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE PÓS VENDA"
        labelTrue="APTO A VISUALIZAR SETOR DE PÓS VENDA"
        checked={infoHolder.permissoes.posVenda.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              posVenda: {
                ...prev.permissoes.posVenda,
                visualizar: value,
              },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE PÓS VENDA"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE PÓS VENDA"
        checked={infoHolder.permissoes.posVenda.editar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              posVenda: {
                ...prev.permissoes.posVenda,
                editar: value,
              },
            },
          }))
        }
      />
      {/**SETOR SUPRIMENTOS */}
      <h1 className="w-full text-start text-sm text-gray-500">SETOR SUPRIMENTOS</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR SUPRIMENTOS"
        labelTrue="APTO A VISUALIZAR SETOR SUPRIMENTOS"
        checked={infoHolder.permissoes.suprimentos.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              suprimentos: {
                ...prev.permissoes.suprimentos,
                visualizar: value,
              },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR SUPRIMENTOS"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR SUPRIMENTOS"
        checked={infoHolder.permissoes.suprimentos.editar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              suprimentos: {
                ...prev.permissoes.suprimentos,
                editar: value,
              },
            },
          }))
        }
      />
      {/**SETOR DE ENGENHARIA */}
      <h1 className="w-full text-start text-sm text-gray-500">SETOR DE ENGENHARIA</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE ENGENHARIA"
        labelTrue="APTO A VISUALIZAR SETOR DE ENGENHARIA"
        checked={infoHolder.permissoes.engenharia.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              engenharia: {
                ...prev.permissoes.engenharia,
                visualizar: value,
              },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE ENGENHARIA"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE ENGENHARIA"
        checked={infoHolder.permissoes.engenharia.editar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              engenharia: {
                ...prev.permissoes.engenharia,
                editar: value,
              },
            },
          }))
        }
      />
      {/**SETOR DE OBRAS */}
      <h1 className="w-full text-start text-sm text-gray-500">SETOR DE OBRAS</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE OBRAS"
        labelTrue="APTO A VISUALIZAR SETOR DE OBRAS"
        checked={infoHolder.permissoes.execucao.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              execucao: {
                ...prev.permissoes.execucao,
                visualizar: value,
              },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE OBRAS"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE OBRAS"
        checked={infoHolder.permissoes.execucao.editar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              execucao: {
                ...prev.permissoes.execucao,
                editar: value,
              },
            },
          }))
        }
      />
      {/**SETOR DE SUPORTE */}
      <h1 className="w-full text-start text-sm text-gray-500">SETOR DE SUPORTE</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE SUPORTE"
        labelTrue="APTO A VISUALIZAR SETOR DE SUPORTE"
        checked={infoHolder.permissoes.suporte.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              suporte: {
                ...prev.permissoes.suporte,
                visualizar: value,
              },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE SUPORTE"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE SUPORTE"
        checked={infoHolder.permissoes.suporte.editar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              suporte: {
                ...prev.permissoes.suporte,
                editar: value,
              },
            },
          }))
        }
      />
      {/**SETOR DE ADMINISTRATIVO */}
      <h1 className="w-full text-start text-sm text-gray-500">SETOR DE ADMINISTRATIVO</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE ADMINISTRATIVO"
        labelTrue="APTO A VISUALIZAR SETOR DE ADMINISTRATIVO"
        checked={infoHolder.permissoes.administrativo.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              administrativo: {
                ...prev.permissoes.administrativo,
                visualizar: value,
              },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE ADMINISTRATIVO"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE ADMINISTRATIVO"
        checked={infoHolder.permissoes.administrativo.editar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              administrativo: {
                ...prev.permissoes.administrativo,
                editar: value,
              },
            },
          }))
        }
      />
      {/**SETOR DE FINANCEIRO */}
      <h1 className="w-full text-start text-sm text-gray-500">SETOR DE FINANCEIRO</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE FINANCEIRO"
        labelTrue="APTO A VISUALIZAR SETOR DE FINANCEIRO"
        checked={infoHolder.permissoes.financeiro.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              financeiro: {
                ...prev.permissoes.financeiro,
                visualizar: value,
              },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE FINANCEIRO"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE FINANCEIRO"
        checked={infoHolder.permissoes.financeiro.editar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              financeiro: {
                ...prev.permissoes.financeiro,
                editar: value,
              },
            },
          }))
        }
      />
      {/**SETOR DE RH */}
      <h1 className="w-full text-start text-sm text-gray-500">SETOR DE RH</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE RH"
        labelTrue="APTO A VISUALIZAR SETOR DE RH"
        checked={infoHolder.permissoes.recursosHumanos.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              recursosHumanos: {
                ...prev.permissoes.recursosHumanos,
                visualizar: value,
              },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE RH"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE RH"
        checked={infoHolder.permissoes.recursosHumanos.editar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              recursosHumanos: {
                ...prev.permissoes.recursosHumanos,
                editar: value,
              },
            },
          }))
        }
      />
      {/**ORDENS DE SERVIÇO */}
      <h1 className="w-full text-start text-sm text-gray-500">ORDENS DE SERVIÇO</h1>
      <CheckboxInput
        labelFalse="APTO A CRIAR ORDENS DE SERVIÇO"
        labelTrue="APTO A CRIAR ORDENS DE SERVIÇO"
        checked={infoHolder.permissoes.ordensDeServico.criar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              ordensDeServico: { ...prev.permissoes.ordensDeServico, criar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A EDITAR ORDENS DE SERVIÇO"
        labelTrue="APTO A EDITAR ORDENS DE SERVIÇO"
        checked={infoHolder.permissoes.ordensDeServico.editar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              ordensDeServico: { ...prev.permissoes.ordensDeServico, editar: value },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR TODOS AS ORDENS DE SERVIÇO"
        labelTrue="APTO A VISUALIZAR TODOS AS ORDENS DE SERVIÇO"
        checked={infoHolder.permissoes.ordensDeServico.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              ordensDeServico: {
                ...prev.permissoes.ordensDeServico,
                visualizar: value,
              },
            },
          }))
        }
      />
      {/**GESTÃO */}
      <h1 className="w-full text-start text-sm text-gray-500">GESTÃO</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR RESULTADOS"
        labelTrue="APTO A VISUALIZAR RESULTADOS"
        checked={infoHolder.permissoes.gestao.visualizarResultados}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              gestao: {
                ...prev.permissoes.gestao,
                visualizarResultados: value,
              },
            },
          }))
        }
      />
      <CheckboxInput
        labelFalse="APTO A RESTRINGIR PROJETOS"
        labelTrue="APTO A RESTRINGIR PROJETOS"
        checked={infoHolder.permissoes.gestao.restringirProjetos}
        justify="justify-start"
        handleChange={(value) =>
          setInfoHolder((prev) => ({
            ...prev,
            permissoes: {
              ...prev.permissoes,
              gestao: {
                ...prev.permissoes.gestao,
                restringirProjetos: value,
              },
            },
          }))
        }
      />
    </>
  )
}

export default PermissionsPannel
