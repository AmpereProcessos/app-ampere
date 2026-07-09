import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { estadosECidades } from "@/utils/estados_cidades";
import { formatToCEP } from "@/utils/methods/formatting";
import { useEquipments } from "@/utils/methods/query/crm/equipments";
import { renderProductCategoryIcon } from "@/utils/methods/rendering";
import { getCEPInfo } from "@/utils/methods/shared";
import { TFileHolder } from "@/utils/schemas/crm/file-reference.schema";
import { TInverter, TModule } from "@/utils/schemas/crm/kits.schema";
import { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import { TEquipment, TTechnicalAnalysis } from "@/utils/schemas/technical-analysis";
import { ProductItemCategories } from "@/utils/select-options";
import type { TAuthSession } from "@/lib/authentication/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaIndustry } from "react-icons/fa";
import { ImPower } from "react-icons/im";
import { MdDelete } from "react-icons/md";

type InlocoProps = {
  infoHolder: TTechnicalAnalysis;
  setInfoHolder: React.Dispatch<React.SetStateAction<TTechnicalAnalysis>>;
  resetSolicitationType: () => void;
  files: TFileHolder;
  setFiles: React.Dispatch<React.SetStateAction<TFileHolder>>;
  activeProposalId: TOpportunity["idPropostaAtiva"];
  handleRequestAnalysis: ({
    info,
    files,
  }: {
    info: TTechnicalAnalysis;
    files: TFileHolder;
  }) => void;
};
function Inloco({
  infoHolder,
  setInfoHolder,
  files,
  setFiles,
  activeProposalId,
  resetSolicitationType,
  handleRequestAnalysis,
}: InlocoProps) {
  const { data: equipments, isLoading, isError, isSuccess } = useEquipments({ category: null });

  const [showKits, setShowKits] = useState<boolean>(false);
  const [selectedKitId, setSelectedKitId] = useState<string | null>(null);
  const [inverterHolder, setInverterHolder] = useState<TInverter>({
    id: "",
    fabricante: "",
    modelo: "",
    qtde: 1,
    garantia: 10,
    potencia: 0,
  });
  const [moduleHolder, setModuleHolder] = useState<TModule>({
    id: "",
    fabricante: "",
    modelo: "",
    qtde: 1,
    potencia: 0,
    garantia: 10,
  });
  const [personalizedProductHolder, setPersonalizedProductHolder] = useState<TEquipment>({
    id: null,
    categoria: "OUTROS",
    fabricante: "",
    modelo: "",
    qtde: 1,
    potencia: 0,
  });
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

  function addInverterToEquipments(info: TInverter) {
    if (!info.id && !info.fabricante && !info.modelo) {
      return toast.error("Inversor inválido. Por favor, tente novamente.");
    }
    if (info.qtde <= 0) {
      return toast.error("Por favor, preencha um quantidade de inversores válida.");
    }
    var productsArr = [...infoHolder.equipamentos];
    const productInfo: TEquipment = {
      id: info.id,
      categoria: "INVERSOR",
      fabricante: info.fabricante,
      modelo: info.modelo,
      qtde: info.qtde,
      potencia: info.potencia,
    };
    productsArr.push(productInfo);
    const orderProducts = productsArr.sort((a, b) => a.categoria.localeCompare(b.categoria));
    setInfoHolder((prev) => ({ ...prev, equipamentos: orderProducts }));
    setInverterHolder({
      id: "",
      fabricante: "",
      modelo: "",
      qtde: 1,
      garantia: 10,
      potencia: 0,
    });
  }
  function addModuleToEquipments(info: TModule) {
    if (!info.id && !info.fabricante && !info.modelo) {
      return toast.error("Módulo inválido. Por favor, tente novamente.");
    }
    if (info.qtde <= 0) {
      return toast.error("Por favor, preencha um quantidade de módulos válida.");
    }
    var productsArr = [...infoHolder.equipamentos];
    const productInfo: TEquipment = {
      id: info.id,
      categoria: "MÓDULO",
      fabricante: info.fabricante,
      modelo: info.modelo,
      qtde: info.qtde,
      potencia: info.potencia,
    };
    productsArr.push(productInfo);
    const orderProducts = productsArr.sort((a, b) => a.categoria.localeCompare(b.categoria));
    setInfoHolder((prev) => ({ ...prev, equipamentos: orderProducts }));
    setModuleHolder({
      id: "",
      fabricante: "",
      modelo: "",
      qtde: 1,
      potencia: 0,
      garantia: 10,
    });
  }
  function addPersonalizedEquipment(info: TEquipment) {
    if (info.fabricante.trim().length < 3)
      return toast.error("Fabricante do produto não específicado.");
    if (info.modelo.trim().length < 3) return toast.error("Modelo do produto não específicado.");
    if (info.qtde <= 0) return toast.error("Quantidade do produto inválida.");

    var productsArr = [...infoHolder.equipamentos];
    const productInfo: TEquipment = {
      id: info.id,
      categoria: info.categoria,
      fabricante: info.fabricante,
      modelo: info.modelo,
      qtde: info.qtde,
      potencia: info.potencia,
    };
    productsArr.push(productInfo);
    const orderProducts = productsArr.sort((a, b) => a.categoria.localeCompare(b.categoria));
    setInfoHolder((prev) => ({ ...prev, equipamentos: orderProducts }));
    setPersonalizedProductHolder({
      id: null,
      categoria: "OUTROS",
      fabricante: "",
      modelo: "",
      qtde: 1,
      potencia: 0,
    });
    return;
  }
  function removeEquipment(index: number) {
    const currenTEquipmentList = [...infoHolder.equipamentos];
    currenTEquipmentList.splice(index, 1);
    setInfoHolder((prev) => ({ ...prev, equipamentos: currenTEquipmentList }));
  }

  return (
    <div className="bg-background scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex w-full grow flex-col gap-2 overflow-y-auto overscroll-y-auto px-2 py-1">
      <h1 className="bg-primary/70 w-full rounded-md p-1 text-center font-medium text-white">
        INFORMAÇÕES GERAIS
      </h1>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
          <TextInput
            label={"NOME DO CLIENTE"}
            placeholder="Digite aqui o nome do cliente..."
            width={"100%"}
            value={infoHolder.nome}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
          />
        </div>
        <p className="text-foreground my-2 w-full text-center text-sm leading-none tracking-tight">
          Preencha abaixo a localização de <strong className="text-cyan-500">instalação</strong> do
          sistema fotovoltaico.
        </p>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <TextInput
              label={"CEP"}
              placeholder="Digite aqui o CEP do cliente..."
              width={"100%"}
              value={infoHolder.localizacao.cep || ""}
              handleChange={(value) => {
                if (value.length == 9) {
                  setAddressDataByCEP(value);
                }
                setInfoHolder((prev) => ({
                  ...prev,
                  localizacao: { ...prev.localizacao, cep: formatToCEP(value) },
                }));
              }}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SelectInput
              width={"100%"}
              label={"UF"}
              editable={true}
              options={Object.keys(estadosECidades).map((state, index) => ({
                id: index + 1,
                label: state,
                value: state,
              }))}
              value={infoHolder.localizacao.uf}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  localizacao: { ...prev.localizacao, uf: value },
                }))
              }
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => {
                setInfoHolder((prev) => ({
                  ...prev,
                  localizacao: { ...prev.localizacao, uf: null },
                }));
              }}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SelectInput
              width={"100%"}
              label={"CIDADE"}
              editable={true}
              value={infoHolder.localizacao.cidade}
              options={
                infoHolder.localizacao.uf
                  ? estadosECidades[infoHolder.localizacao.uf as keyof typeof estadosECidades].map(
                      (city, index) => {
                        return {
                          id: index,
                          value: city,
                          label: city,
                        };
                      },
                    )
                  : null
              }
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  localizacao: { ...prev.localizacao, cidade: value },
                }))
              }
              onReset={() => {
                setInfoHolder((prev) => ({
                  ...prev,
                  localizacao: { ...prev.localizacao, cidade: null },
                }));
              }}
              selectedItemLabel="NÃO DEFINIDO"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <TextInput
              label={"BAIRRO"}
              placeholder="Digite aqui o bairro do cliente.."
              width={"100%"}
              value={infoHolder.localizacao.bairro}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  localizacao: { ...prev.localizacao, bairro: value },
                }))
              }
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label={"LOGRADOURO"}
              placeholder="Digite o logradouro do cliente..."
              width={"100%"}
              value={infoHolder.localizacao.endereco}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  localizacao: { ...prev.localizacao, endereco: value },
                }))
              }
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label={"NÚMERO OU IDENTIFICADOR"}
              placeholder="Digite aqui o número/identificador da residência..."
              width={"100%"}
              value={infoHolder.localizacao.numeroOuIdentificador}
              handleChange={(value) => {
                setInfoHolder((prev) => ({
                  ...prev,
                  localizacao: { ...prev.localizacao, numeroOuIdentificador: value },
                }));
              }}
            />
          </div>
        </div>
      </div>
      <h1 className="bg-primary/70 w-full rounded-md p-1 text-center font-medium text-white">
        INFORMAÇÕES DOS EQUIPAMENTOS
      </h1>
      <p className="text-foreground my-2 w-full text-center text-sm leading-none tracking-tight">
        Preencha abaixo os <strong className="text-cyan-500">equipamentos</strong> a serem
        análisados, ou, escolha um dos kits ativos.
      </p>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-2/4">
            <SelectInput
              label="INVERSOR"
              value={
                equipments?.find((e) => e.categoria == "INVERSOR" && e._id == inverterHolder.id) ||
                null
              }
              handleChange={(value) =>
                setInverterHolder((prev) => ({
                  ...prev,
                  id: value._id,
                  fabricante: value.fabricante,
                  modelo: value.modelo,
                  potencia: value.potencia || 0,
                }))
              }
              onReset={() =>
                setInverterHolder({
                  id: "",
                  fabricante: "",
                  modelo: "",
                  qtde: 1,
                  garantia: 10,
                  potencia: 0,
                })
              }
              selectedItemLabel="NÃO DEFINIDO"
              options={
                equipments
                  ?.filter((e) => e.categoria == "INVERSOR")
                  .map((inverter) => {
                    return {
                      id: inverter._id,
                      label: `${inverter.fabricante} - ${inverter.modelo}`,
                      value: inverter,
                    };
                  }) || []
              }
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label="QTDE"
              value={inverterHolder.qtde}
              handleChange={(value) =>
                setInverterHolder((prev) => ({
                  ...prev,
                  qtde: Number(value),
                }))
              }
              placeholder="QTDE"
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label="GARANTIA"
              value={inverterHolder.garantia || null}
              handleChange={(value) =>
                setInverterHolder((prev) => ({
                  ...prev,
                  garantia: Number(value),
                }))
              }
              placeholder="GARANTIA"
              width="100%"
            />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button
            className="hover:bg-primary/70 rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out"
            onClick={() => addInverterToEquipments(inverterHolder)}
          >
            ADICIONAR INVERSOR
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-2/4">
            <SelectInput
              label="MÓDULO"
              value={
                equipments?.find((e) => e.categoria == "MÓDULO" && e._id == moduleHolder.id) || null
              }
              handleChange={(value) =>
                setModuleHolder((prev) => ({
                  ...prev,
                  id: value._id,
                  fabricante: value.fabricante,
                  modelo: value.modelo,
                  potencia: value.potencia || 0,
                }))
              }
              onReset={() =>
                setModuleHolder({
                  id: "",
                  fabricante: "",
                  modelo: "",
                  qtde: 1,
                  potencia: 0,
                  garantia: 10,
                })
              }
              selectedItemLabel="NÃO DEFINIDO"
              options={
                equipments
                  ?.filter((e) => e.categoria == "MÓDULO")
                  .map((module) => {
                    return {
                      id: module._id,
                      label: `${module.fabricante} - ${module.modelo}`,
                      value: module,
                    };
                  }) || []
              }
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label="QTDE"
              value={moduleHolder.qtde}
              handleChange={(value) =>
                setModuleHolder((prev) => ({
                  ...prev,
                  qtde: Number(value),
                }))
              }
              placeholder="QTDE"
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label="GARANTIA"
              value={moduleHolder.garantia || null}
              handleChange={(value) =>
                setModuleHolder((prev) => ({
                  ...prev,
                  garantia: Number(value),
                }))
              }
              placeholder="GARANTIA"
              width="100%"
            />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button
            className="hover:bg-primary/70 rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out"
            onClick={() => addModuleToEquipments(moduleHolder)}
          >
            ADICIONAR MÓDULO
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-[30%]">
            <SelectInput
              label="CATEGORIA"
              selectedItemLabel="NÃO DEFINIDO"
              options={ProductItemCategories}
              value={personalizedProductHolder.categoria}
              handleChange={(value) =>
                setPersonalizedProductHolder((prev) => ({
                  ...prev,
                  categoria: value,
                }))
              }
              onReset={() => {
                setPersonalizedProductHolder((prev) => ({
                  ...prev,
                  categoria: "OUTROS",
                }));
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[40%]">
            <TextInput
              label="FABRICANTE"
              placeholder="FABRICANTE"
              value={personalizedProductHolder.fabricante}
              handleChange={(value) =>
                setPersonalizedProductHolder((prev) => ({
                  ...prev,
                  fabricante: value,
                }))
              }
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[40%]">
            <TextInput
              label="MODELO"
              placeholder="MODELO"
              value={personalizedProductHolder.modelo}
              handleChange={(value) =>
                setPersonalizedProductHolder((prev) => ({
                  ...prev,
                  modelo: value,
                }))
              }
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[15%]">
            <NumberInput
              label="POTÊNCIA"
              value={personalizedProductHolder.potencia || null}
              handleChange={(value) =>
                setPersonalizedProductHolder((prev) => ({
                  ...prev,
                  potencia: Number(value),
                }))
              }
              placeholder="POTÊNCIA"
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[15%]">
            <NumberInput
              label="QTDE"
              value={personalizedProductHolder.qtde}
              handleChange={(value) =>
                setPersonalizedProductHolder((prev) => ({
                  ...prev,
                  qtde: Number(value),
                }))
              }
              placeholder="QTDE"
              width="100%"
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            className="hover:bg-primary/70 rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out"
            onClick={() => addPersonalizedEquipment(personalizedProductHolder)}
          >
            ADICIONAR PRODUTO PERSONALIZADO
          </button>
        </div>
      </div>

      <h1 className="mt-2 w-full text-start font-sans font-bold text-cyan-500">
        EQUIPAMENTOS ESCOLHIDOS
      </h1>
      <div className="flex w-full flex-col flex-wrap justify-around gap-2 lg:flex-row">
        {infoHolder.equipamentos.length > 0 ? (
          infoHolder.equipamentos.map((equipment, index) => (
            <div
              key={index}
              className="border-border mt-1 flex w-full flex-col rounded-md border p-2 lg:w-[350px]"
            >
              <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
                <div className="flex items-center gap-1">
                  <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1 text-[15px]">
                    {renderProductCategoryIcon(equipment.categoria, 18)}
                  </div>
                  <p className="text-[0.6rem] leading-none font-medium tracking-tight lg:text-xs">
                    <strong className="text-[#FF9B50]">{equipment.qtde}</strong> x{" "}
                    {equipment.modelo}
                  </p>
                </div>
                <button
                  onClick={() => removeEquipment(index)}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                >
                  <MdDelete color="red" size={15} />
                </button>
              </div>
              <div className="flex w-full items-center justify-end gap-2 pl-2">
                <div className="flex items-center gap-1">
                  <FaIndustry size={15} />
                  <p className="text-foreground text-[0.6rem] font-light">{equipment.fabricante}</p>
                </div>
                <div className="flex items-center gap-1">
                  <ImPower size={15} />
                  <p className="text-foreground text-[0.6rem] font-light">{equipment.potencia} W</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-foreground w-full text-center text-sm font-medium tracking-tight">
            Nenhum equipamento adicionado à lista.
          </p>
        )}
      </div>
      <div className="mt-2 flex w-full flex-wrap justify-between gap-2">
        <button
          onClick={() => resetSolicitationType()}
          className="text-foreground rounded p-2 font-bold duration-300 hover:scale-105"
        >
          Voltar
        </button>
        <button
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
          onClick={() => handleRequestAnalysis({ info: infoHolder, files: files })}
        >
          SOLICITAR ANÁLISE
        </button>
      </div>
    </div>
  );
}

export default Inloco;
