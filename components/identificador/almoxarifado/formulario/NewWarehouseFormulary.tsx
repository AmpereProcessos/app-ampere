import CheckboxInput from "@/components/inputs/Checkbox";
import SelectInput from "@/components/inputs/Select";
import SelectVirtualizedInput from "@/components/inputs/SelectVirtualized";
import TextInput from "@/components/inputs/Text";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { equipesTecnicas, serviceOrdersCategories } from "@/utils/constants";
import { formatToCEP } from "@/utils/methods/formatting";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { updateManyMaterials } from "@/utils/methods/mutation/materials";
import { createWarehouseFormulary } from "@/utils/methods/mutation/warehouse-forms";
import { useClients } from "@/utils/methods/query/clients";
import { useMaterials } from "@/utils/methods/query/materials";
import { getCEPInfo } from "@/utils/methods/shared";
import type { TNewWarehouseFormulary } from "@/utils/schemas/warehouse-formularies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { VscChromeClose } from "react-icons/vsc";
import { estadosECidades } from "../../../../utils/estados_cidades";
import MaterialsBlock from "./MaterialsBlock";
type NewWarehouseFormularyProps = {
  session: TAuthSession;
  closeModal: () => void;
  callbacks?: {
    onMutate?: () => void;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
  };
};
function NewWarehouseFormulary({ session, closeModal, callbacks }: NewWarehouseFormularyProps) {
  const queryClient = useQueryClient();
  const [vinculateClient, setVinculateClient] = useState<boolean>(true);
  const [externalResponsible, setExternalResponsible] = useState<boolean>(false);
  const {
    data: clients,
    isLoading: clientsLoading,
    isFetching: clientsFetching,
  } = useClients(!!session.user);
  const [infoHolder, setInfoHolder] = useState<TNewWarehouseFormulary>({
    titulo: "",
    categoria: "",
    responsaveis: "",
    projeto: {
      id: null,
      nome: null,
    },
    localizacao: {
      cep: null,
      uf: null,
      cidade: null,
      bairro: "",
      endereco: "",
      numeroOuIdentificador: "",
      complemento: "",
      distancia: null,
    },
    materiais: [],
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataEfetivacao: null,
    dataInsercao: new Date().toISOString(),
  });
  function resetInfoHolder() {
    setInfoHolder({
      titulo: "",
      categoria: "",
      responsaveis: "",
      projeto: {
        id: null,
        nome: null,
        identificador: null,
      },
      localizacao: {
        cep: null,
        uf: null,
        cidade: null,
        bairro: "",
        endereco: "",
        numeroOuIdentificador: "",
        complemento: "",
        distancia: null,
      },
      materiais: [],
      autor: {
        id: session.user.id,
        nome: session.user.nome,
        avatar_url: session.user.avatar_url,
      },
      dataEfetivacao: null,
      dataInsercao: new Date().toISOString(),
    });
  }
  async function setAddressDataByCEP(cep: string) {
    const addressInfo = await getCEPInfo(cep);
    const toastID = toast.loading("Buscando informações sobre o CEP...", {
      duration: 2000,
    });
    setTimeout(() => {
      if (addressInfo) {
        toast.dismiss(toastID);
        toast.success("Dados do CEP buscados com sucesso.", {
          duration: 1000,
        });
        setInfoHolder((prev) => ({
          ...prev,
          localizacao: {
            ...prev.localizacao,
            endereco: addressInfo.logradouro,
            bairro: addressInfo.bairro,
            uf: addressInfo.uf as keyof typeof estadosECidades,
            cidade: addressInfo.localidade.toUpperCase(),
          },
        }));
      }
    }, 1000);
  }
  async function handleFormularyCreation(info: TNewWarehouseFormulary) {
    if (infoHolder.materiais.length === 0) throw new Error("Adicione ao menos um material.");
    const response = await createWarehouseFormulary({
      warehouseFormulary: info,
    });
    return response;
  }
  const { mutate: handleCreation, isPending } = useMutation({
    mutationKey: ["create-stock-formulary"],
    mutationFn: handleFormularyCreation,
    onMutate: async () => {
      if (callbacks?.onMutate) callbacks.onMutate();
    },
    onSuccess: async (response) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      resetInfoHolder();
      return toast.success(response.message);
    },
    onSettled: async () => {
      if (callbacks?.onSettled) callbacks.onSettled();
    },
    onError: async (error) => {
      if (callbacks?.onError) callbacks.onError(error);
      toast.error(error.message);
    },
  });

  return (
    <ResponsiveDialogDrawer
      menuTitle="NOVO FORMULÁRIO"
      menuDescription="Preencha os campos abaixo para criar um novo formulário."
      menuActionButtonText="CRIAR FORMULÁRIO"
      menuCancelButtonText="CANCELAR"
      actionFunction={() => handleCreation(infoHolder)}
      actionIsPending={isPending}
      stateIsLoading={false}
      closeMenu={closeModal}
      dialogVariant="md"
    >
      {vinculateClient ? (
        <>
          <p className="text-foreground w-full py-2 text-center font-medium tracking-tight">
            Se o formulário de saída de materiais possuir relação com algum cliente, vincule o
            cliente no menu abaixo. Se não,{" "}
            <button
              type="button"
              onClick={() => setVinculateClient(false)}
              className="cursor-pointer text-[#fead41]"
            >
              clique aqui
            </button>{" "}
            para outros tipos de formulário.
          </p>
          <SelectVirtualizedInput
            label="CLIENTE"
            options={
              clients?.map((client) => ({
                id: client._id,
                label: `(${client.qtde}) ${client.nomeDoContrato}`,
                value: client._id,
              })) || []
            }
            value={infoHolder.projeto.id}
            handleChange={(value) => {
              const equivalent = clients?.find((client) => client._id === value);
              if (!equivalent) return;
              const {
                qtde,
                nomeDoContrato,
                cep,
                uf,
                cidade,
                bairro,
                logradouro,
                numeroResidencia,
              } = equivalent;
              setInfoHolder((prev) => ({
                ...prev,
                projeto: { id: value, nome: nomeDoContrato, identificador: qtde },
                localizacao: {
                  ...prev.localizacao,
                  cep: cep as string,
                  uf,
                  cidade,
                  bairro,
                  logradouro,
                  numeroResidencia,
                },
              }));
            }}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() =>
              setInfoHolder((prev) => ({ ...prev, projeto: { ...prev.projeto, id: null } }))
            }
            width="100%"
          />
        </>
      ) : (
        <>
          <p className="text-foreground w-full py-2 text-center font-medium tracking-tight">
            Preencha um titulo para esse formulário de saída de materiais para futura identificação
            e filtro. Caso o formulário estiver relacionado a um cliente,{" "}
            <button
              type="button"
              onClick={() => setVinculateClient(true)}
              className="cursor-pointer text-[#fead41]"
            >
              clique aqui
            </button>
          </p>
          <TextInput
            label="TITULO DO FORMULÁRIO"
            placeholder="Preencha aqui um titulo para identificação e filtro desse formulário posteriomente..."
            value={infoHolder.titulo}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, titulo: value }))}
            width="100%"
          />
        </>
      )}
      <div className="my-2 flex w-full items-center justify-center">
        <CheckboxInput
          labelFalse="RESPONSÁVEL INTERNO"
          labelTrue="RESPONSÁVEL INTERNO"
          checked={!externalResponsible}
          handleChange={(value) => {
            setExternalResponsible((prev) => !prev);
          }}
        />
      </div>
      <div className="flex w-full flex-col gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <SelectInput
            label="CATEGORIA"
            value={infoHolder.categoria}
            options={serviceOrdersCategories}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, categoria: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, categoria: "" }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          {externalResponsible ? (
            <TextInput
              label="RESPONSÁVEL(IS)"
              placeholder="Preencha aqui o nome dos responsáveis pelo material.."
              value={infoHolder.responsaveis}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsaveis: value }))}
              width="100%"
            />
          ) : (
            <SelectInput
              label="RESPONSÁVEL(IS)"
              value={infoHolder.responsaveis}
              options={equipesTecnicas}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsaveis: value }))}
              onReset={() => setInfoHolder((prev) => ({ ...prev, responsaveis: "" }))}
              width="100%"
            />
          )}
        </div>
      </div>

      <MaterialsBlock
        formHolder={infoHolder}
        setFormHolder={setInfoHolder}
        blockDevolution={true}
      />
      <h1 className="mb-2 w-full rounded-md bg-[#15599a] p-1 text-center text-sm font-bold text-white">
        LOCALIZAÇÃO
      </h1>
      <div className="grid grid-cols-1 grid-rows-3 items-center gap-6 px-2 lg:grid-cols-3 lg:grid-rows-1">
        <TextInput
          label="CEP"
          value={infoHolder.localizacao.cep?.toString() || ""}
          placeholder="Preencha aqui o CEP do cliente."
          handleChange={(value) => {
            if (value.length === 9) {
              setAddressDataByCEP(value);
            }
            setInfoHolder((prev) => ({
              ...prev,
              localizacao: {
                ...prev.localizacao,
                cep: formatToCEP(value),
              },
            }));
          }}
          width="100%"
        />

        <SelectInput
          label="ESTADO"
          value={infoHolder.localizacao.uf}
          handleChange={(value) =>
            setInfoHolder((prev) => ({
              ...prev,
              localizacao: {
                ...prev.localizacao,
                uf: value,
                cidade: estadosECidades[value as keyof typeof estadosECidades][0] as string,
              },
            }))
          }
          selectedItemLabel="NÃO DEFINIDO"
          onReset={() =>
            setInfoHolder((prev) => ({
              ...prev,
              localizacao: { ...prev.localizacao, uf: "", cidade: "" },
            }))
          }
          options={Object.keys(estadosECidades).map((state, index) => ({
            id: index + 1,
            label: state,
            value: state,
          }))}
          width="100%"
        />

        <SelectInput
          label="CIDADE"
          value={infoHolder.localizacao.cidade}
          handleChange={(value) =>
            setInfoHolder((prev) => ({
              ...prev,
              localizacao: { ...prev.localizacao, cidade: value },
            }))
          }
          options={
            infoHolder.localizacao.uf
              ? estadosECidades[infoHolder.localizacao.uf as keyof typeof estadosECidades].map(
                  (city, index) => ({
                    id: index + 1,
                    value: city,
                    label: city,
                  }),
                )
              : null
          }
          selectedItemLabel="NÃO DEFINIDO"
          onReset={() => setInfoHolder((prev) => ({ ...prev, cidade: "" }))}
          width="100%"
        />
      </div>
      <div className="grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
        <TextInput
          label="BAIRRO"
          value={infoHolder.localizacao.bairro || ""}
          placeholder="Preencha aqui o bairro do cliente."
          handleChange={(value) =>
            setInfoHolder((prev) => ({
              ...prev,
              localizacao: { ...prev.localizacao, bairro: value },
            }))
          }
          width="100%"
        />

        <TextInput
          label="LOGRADOURO/RUA"
          value={infoHolder.localizacao.endereco || ""}
          placeholder="Preencha aqui o logradouro do cliente."
          handleChange={(value) =>
            setInfoHolder((prev) => ({
              ...prev,
              localizacao: { ...prev.localizacao, endereco: value },
            }))
          }
          width="100%"
        />
      </div>
      <div className="mb-2 grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
        <TextInput
          label="NÚMERO/IDENTIFICADOR"
          value={infoHolder.localizacao.numeroOuIdentificador || ""}
          placeholder="Preencha aqui o número ou identificador da residência do cliente."
          handleChange={(value) =>
            setInfoHolder((prev) => ({
              ...prev,
              localizacao: {
                ...prev.localizacao,
                numeroOuIdentificador: value,
              },
            }))
          }
          width="100%"
        />

        <TextInput
          label="COMPLEMENTO"
          value={infoHolder.localizacao.complemento || ""}
          placeholder="Preencha aqui algum complemento do endereço."
          handleChange={(value) =>
            setInfoHolder((prev) => ({
              ...prev,
              localizacao: { ...prev.localizacao, complemento: value },
            }))
          }
          width="100%"
        />
      </div>
    </ResponsiveDialogDrawer>
  );
}

export default NewWarehouseFormulary;
