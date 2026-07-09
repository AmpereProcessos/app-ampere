import CheckboxInput from "@/components/inputs/Checkbox";
import { type TEmployee, TUser } from "@/utils/schemas/users";
import { Blocks } from "lucide-react";
import type React from "react";

type PermissionsPannelProps = {
  infoHolder: TEmployee;
  updateInfoHolder: (changes: Partial<TEmployee>) => void;
};
function EmployeePermissionsPannel({ infoHolder, updateInfoHolder }: PermissionsPannelProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
        <Blocks size={15} />
        <h1 className="text-xs tracking-tight font-medium text-start w-fit">
          PERMISSÕES DO USUÁRIO
        </h1>
      </div>
      <h1 className="text-foreground w-full text-start text-sm">USUÁRIOS</h1>
      <CheckboxInput
        labelFalse="APTO A CRIAR USUÁRIOS"
        labelTrue="APTO A CRIAR USUÁRIOS"
        checked={infoHolder.permissoes.usuarios.criar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              usuarios: { ...infoHolder.permissoes.usuarios, criar: value },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR USUÁRIOS"
        labelTrue="APTO A EDITAR USUÁRIOS"
        checked={infoHolder.permissoes.usuarios.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              usuarios: { ...infoHolder.permissoes.usuarios, editar: value },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A VISUALIZAR TODOS OS USUÁRIOS"
        labelTrue="APTO A VISUALIZAR TODOS OS USUÁRIOS"
        checked={infoHolder.permissoes.usuarios.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              usuarios: {
                ...infoHolder.permissoes.usuarios,
                visualizar: value,
              },
            },
          })
        }
      />

      {/**SETOR COMERCIAL */}
      <h1 className="text-foreground w-full text-start text-sm">SETOR COMERCIAL</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR COMERCIAL"
        labelTrue="APTO A VISUALIZAR SETOR COMERCIAL"
        checked={infoHolder.permissoes.comercial.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              comercial: {
                ...infoHolder.permissoes.comercial,
                visualizar: value,
              },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR COMERCIAL"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR COMERCIAL"
        checked={infoHolder.permissoes.comercial.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              comercial: {
                ...infoHolder.permissoes.comercial,
                editar: value,
              },
            },
          })
        }
      />

      {/**PÓS VENDAS */}
      <h1 className="text-foreground w-full text-start text-sm">SETOR DE PÓS-VENDA</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE PÓS VENDA"
        labelTrue="APTO A VISUALIZAR SETOR DE PÓS VENDA"
        checked={infoHolder.permissoes.posVenda.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              posVenda: {
                ...infoHolder.permissoes.posVenda,
                visualizar: value,
              },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE PÓS VENDA"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE PÓS VENDA"
        checked={infoHolder.permissoes.posVenda.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              posVenda: {
                ...infoHolder.permissoes.posVenda,
                editar: value,
              },
            },
          })
        }
      />

      {/**SETOR SUPRIMENTOS */}
      <h1 className="text-foreground w-full text-start text-sm">SETOR SUPRIMENTOS</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR SUPRIMENTOS"
        labelTrue="APTO A VISUALIZAR SETOR SUPRIMENTOS"
        checked={infoHolder.permissoes.suprimentos.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              suprimentos: {
                ...infoHolder.permissoes.suprimentos,
                visualizar: value,
              },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR SUPRIMENTOS"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR SUPRIMENTOS"
        checked={infoHolder.permissoes.suprimentos.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              suprimentos: {
                ...infoHolder.permissoes.suprimentos,
                editar: value,
              },
            },
          })
        }
      />

      {/**SETOR DE ENGENHARIA */}
      <h1 className="text-foreground w-full text-start text-sm">SETOR DE ENGENHARIA</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE ENGENHARIA"
        labelTrue="APTO A VISUALIZAR SETOR DE ENGENHARIA"
        checked={infoHolder.permissoes.engenharia.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              engenharia: {
                ...infoHolder.permissoes.engenharia,
                visualizar: value,
              },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE ENGENHARIA"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE ENGENHARIA"
        checked={infoHolder.permissoes.engenharia.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              engenharia: {
                ...infoHolder.permissoes.engenharia,
                editar: value,
              },
            },
          })
        }
      />

      {/**SETOR DE OBRAS */}
      <h1 className="text-foreground w-full text-start text-sm">SETOR DE OBRAS</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE OBRAS"
        labelTrue="APTO A VISUALIZAR SETOR DE OBRAS"
        checked={infoHolder.permissoes.execucao.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              execucao: {
                ...infoHolder.permissoes.execucao,
                visualizar: value,
              },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE OBRAS"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE OBRAS"
        checked={infoHolder.permissoes.execucao.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              execucao: {
                ...infoHolder.permissoes.execucao,
                editar: value,
              },
            },
          })
        }
      />

      {/**SETOR DE SUPORTE */}
      <h1 className="text-foreground w-full text-start text-sm">SETOR DE SUPORTE</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE SUPORTE"
        labelTrue="APTO A VISUALIZAR SETOR DE SUPORTE"
        checked={infoHolder.permissoes.suporte.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              suporte: {
                ...infoHolder.permissoes.suporte,
                visualizar: value,
              },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE SUPORTE"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE SUPORTE"
        checked={infoHolder.permissoes.suporte.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              suporte: {
                ...infoHolder.permissoes.suporte,
                editar: value,
              },
            },
          })
        }
      />

      {/**SETOR DE ADMINISTRATIVO */}
      <h1 className="text-foreground w-full text-start text-sm">SETOR DE ADMINISTRATIVO</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE ADMINISTRATIVO"
        labelTrue="APTO A VISUALIZAR SETOR DE ADMINISTRATIVO"
        checked={infoHolder.permissoes.administrativo.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              administrativo: {
                ...infoHolder.permissoes.administrativo,
                visualizar: value,
              },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE ADMINISTRATIVO"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE ADMINISTRATIVO"
        checked={infoHolder.permissoes.administrativo.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              administrativo: {
                ...infoHolder.permissoes.administrativo,
                editar: value,
              },
            },
          })
        }
      />

      {/**SETOR DE FINANCEIRO */}
      <h1 className="text-foreground w-full text-start text-sm">SETOR DE FINANCEIRO</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE FINANCEIRO"
        labelTrue="APTO A VISUALIZAR SETOR DE FINANCEIRO"
        checked={infoHolder.permissoes.financeiro.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              financeiro: {
                ...infoHolder.permissoes.financeiro,
                visualizar: value,
              },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE FINANCEIRO"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE FINANCEIRO"
        checked={infoHolder.permissoes.financeiro.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              financeiro: {
                ...infoHolder.permissoes.financeiro,
                editar: value,
              },
            },
          })
        }
      />

      {/**SETOR DE RH */}
      <h1 className="text-foreground w-full text-start text-sm">SETOR DE RH</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR SETOR DE RH"
        labelTrue="APTO A VISUALIZAR SETOR DE RH"
        checked={infoHolder.permissoes.recursosHumanos.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              recursosHumanos: {
                ...infoHolder.permissoes.recursosHumanos,
                visualizar: value,
              },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR RELACIONADOS A SETOR DE RH"
        labelTrue="APTO A EDITAR RELACIONADOS A SETOR DE RH"
        checked={infoHolder.permissoes.recursosHumanos.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              recursosHumanos: {
                ...infoHolder.permissoes.recursosHumanos,
                editar: value,
              },
            },
          })
        }
      />

      {/**ORDENS DE SERVIÇO */}
      <h1 className="text-foreground w-full text-start text-sm">ORDENS DE SERVIÇO</h1>
      <CheckboxInput
        labelFalse="APTO A CRIAR ORDENS DE SERVIÇO"
        labelTrue="APTO A CRIAR ORDENS DE SERVIÇO"
        checked={infoHolder.permissoes.ordensDeServico.criar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              ordensDeServico: { ...infoHolder.permissoes.ordensDeServico, criar: value },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR ORDENS DE SERVIÇO"
        labelTrue="APTO A EDITAR ORDENS DE SERVIÇO"
        checked={infoHolder.permissoes.ordensDeServico.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              ordensDeServico: { ...infoHolder.permissoes.ordensDeServico, editar: value },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A VISUALIZAR TODOS AS ORDENS DE SERVIÇO"
        labelTrue="APTO A VISUALIZAR TODOS AS ORDENS DE SERVIÇO"
        checked={infoHolder.permissoes.ordensDeServico.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              ordensDeServico: {
                ...infoHolder.permissoes.ordensDeServico,
                visualizar: value,
              },
            },
          })
        }
      />
      {/**CERTIFICAÇÕES */}
      <h1 className="text-foreground w-full text-start text-sm">CERTIFICAÇÕES</h1>
      <CheckboxInput
        labelFalse="APTO A CRIAR CERTIFICAÇÕES"
        labelTrue="APTO A CRIAR CERTIFICAÇÕES"
        checked={infoHolder.permissoes.certificacoes.criar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              certificacoes: { ...infoHolder.permissoes.certificacoes, criar: value },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR CERTIFICAÇÕES"
        labelTrue="APTO A EDITAR CERTIFICAÇÕES"
        checked={infoHolder.permissoes.certificacoes.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              certificacoes: { ...infoHolder.permissoes.certificacoes, editar: value },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A VISUALIZAR TODOS AS CERTIFICAÇÕES"
        labelTrue="APTO A VISUALIZAR TODOS AS CERTIFICAÇÕES"
        checked={infoHolder.permissoes.certificacoes.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              certificacoes: {
                ...infoHolder.permissoes.certificacoes,
                visualizar: value,
              },
            },
          })
        }
      />

      {/**CHATS */}
      <h1 className="text-foreground w-full text-start text-sm">CHATS</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR CHATS"
        labelTrue="APTO A VISUALIZAR CHATS"
        checked={infoHolder.permissoes.chats.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              chats: { ...infoHolder.permissoes.chats, visualizar: value },
            },
          })
        }
      />
      <CheckboxInput
        labelFalse="APTO A ENVIAR MENSAGENS"
        labelTrue="APTO A ENVIAR MENSAGENS"
        checked={infoHolder.permissoes.chats.enviarMensagens}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              chats: { ...infoHolder.permissoes.chats, enviarMensagens: value },
            },
          })
        }
      />

      {/**ALMOXARIFADO */}
      <h1 className="text-foreground w-full text-start text-sm">ALMOXARIFADO</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR ALMOXARIFADO"
        labelTrue="APTO A VISUALIZAR ALMOXARIFADO"
        checked={infoHolder.permissoes.almoxarifado.visualizar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              almoxarifado: { ...infoHolder.permissoes.almoxarifado, visualizar: value },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A EDITAR ALMOXARIFADO"
        labelTrue="APTO A EDITAR ALMOXARIFADO"
        checked={infoHolder.permissoes.almoxarifado.editar}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              almoxarifado: { ...infoHolder.permissoes.almoxarifado, editar: value },
            },
          })
        }
      />

      {/**GESTÃO */}
      <h1 className="text-foreground w-full text-start text-sm">GESTÃO</h1>
      <CheckboxInput
        labelFalse="APTO A VISUALIZAR RESULTADOS"
        labelTrue="APTO A VISUALIZAR RESULTADOS"
        checked={infoHolder.permissoes.gestao.visualizarResultados}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              gestao: {
                ...infoHolder.permissoes.gestao,
                visualizarResultados: value,
              },
            },
          })
        }
      />

      <CheckboxInput
        labelFalse="APTO A RESTRINGIR PROJETOS"
        labelTrue="APTO A RESTRINGIR PROJETOS"
        checked={infoHolder.permissoes.gestao.restringirProjetos}
        justify="justify-start"
        handleChange={(value) =>
          updateInfoHolder({
            permissoes: {
              ...infoHolder.permissoes,
              gestao: {
                ...infoHolder.permissoes.gestao,
                restringirProjetos: value,
              },
            },
          })
        }
      />
    </div>
  );
}

export default EmployeePermissionsPannel;
