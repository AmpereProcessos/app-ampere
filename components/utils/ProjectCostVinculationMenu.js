import React from "react";
import { useClients } from "../../utils/methods/query/clients";
import SelectInput from "../inputs/Select";

function ProjectCostVinculationMenu({}) {
  const { data: projects } = useClients(true);
  return (
    <div className="flex flex-col w-full gap-2 my-2">
      <SelectInput
        label={"PROJETO PARA VINCULAÇÃO DE CUSTOS"}
        alignLabel="text-center"
        selectedItemLabel={"NÃO DEFINIDO"}
        value={infoHolder.projeto?.id}
        options={
          projects?.map((project) => ({
            id: project._id,
            value: project._id,
            label: `(${project.qtde}) ${project.nomeDoContrato}`,
          })) || []
        }
        handleChange={(value) => {
          const selectedProject = projects.find((p) => p._id == value);
          setInfo((prev) => ({
            ...prev,
            projeto: { id: value, nome: selectedProject.nomeDoContrato },
          }));
        }}
        onReset={() => setInfo((prev) => ({ ...prev, projeto: null }))}
        width={"100%"}
      />
      {infoHolder.projeto ? (
        <SelectInput
          label={"CATEGORIA DO CUSTO"}
          alignLabel="text-center"
          options={[
            { id: 1, label: "PADRÃO", value: "PADRÃO" },
            { id: 2, label: "ESTRUTURA", value: "ESTRUTURA" },
            { id: 3, label: "MONTAGEM", value: "MONTAGEM" },
            {
              id: 3,
              label: "MANUTENÇÃO PREVENTIVA",
              value: "MANUTENÇÃO PREVENTIVA",
            },
            {
              id: 4,
              label: "MANUTENÇÃO CORRETIVA",
              value: "MANUTENÇÃO CORRETIVA",
            },
            {
              id: 5,
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
          ]}
          value={infoHolder.projeto?.categoriaCusto}
          handleChange={(value) =>
            setInfo((prev) => ({
              ...prev,
              projeto: {
                ...prev.projeto,
                categoriaCusto: value,
              },
            }))
          }
          width={"100%"}
        />
      ) : null}
    </div>
  );
}

export default ProjectCostVinculationMenu;
