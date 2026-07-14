import CheckboxInput from "@/components/inputs/Checkbox";
import NumberInput from "@/components/inputs/Number";
import TextInput from "@/components/inputs/Text";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { formatDecimalPlaces } from "@/utils/constants";
import type { TContractRequestDTO } from "@/utils/schemas/contract-requests";
import { GitBranch } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";

type ElectricalInstallationDependentsInformationBlockProps = {
  infoHolder: TContractRequestDTO;
  setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>;
  userHasEditPermission: boolean;
};
function ElectricalInstallationDependentsInformationBlock({
  infoHolder,
  setInfoHolder,
  userHasEditPermission,
}: ElectricalInstallationDependentsInformationBlockProps) {
  const [distributionHolder, setDistributionHolder] = useState<
    TContractRequestDTO["distribuicoes"][number]
  >({
    numInstalacao: "",
    excedente: 0,
  });

  function addDistribution(info: TContractRequestDTO["distribuicoes"][number]) {
    const distributions = [...(infoHolder.distribuicoes || [])];
    distributions.push(info);
    setInfoHolder((prev) => ({ ...prev, distribuicoes: distributions }));
  }
  function removeDistribution(index: number) {
    const distributions = [...(infoHolder.distribuicoes || [])];
    distributions.splice(index, 1);
    setInfoHolder((prev) => ({ ...prev, distribuicoes: distributions }));
  }
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="INFORMAÇÕES SOBRE DISTRIBUIÇÕES DE CRÉDITO"
      sectionTitleIcon={<GitBranch className="h-4 w-4 min-h-4 min-w-4" />}
    >
      <div className="flex items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="POSSUI DISTRIBUIÇÕES DE CRÉDITO"
            labelTrue="POSSUI DISTRIBUIÇÕES DE CRÉDITO"
            checked={infoHolder.possuiDistribuicao === "SIM"}
            handleChange={(value) =>
              setInfoHolder((prev) => ({ ...prev, possuiDistribuicao: value ? "SIM" : "NÃO" }))
            }
          />
        </div>
      </div>
      {infoHolder.possuiDistribuicao === "SIM" ? (
        <>
          <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="NÚMERO DA INSTALAÇÃO"
                placeholder="Preencha o número da instalação.."
                value={distributionHolder.numInstalacao}
                handleChange={(value) =>
                  setDistributionHolder((prev) => ({ ...prev, numInstalacao: value }))
                }
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <NumberInput
                label="PORCENTAGEM DO EXCEDENTE P/ ENVIO"
                placeholder="Preencha a porcentagem de envio.."
                value={distributionHolder.excedente || null}
                handleChange={(value) =>
                  setDistributionHolder((prev) => ({ ...prev, excedente: value }))
                }
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <button
              onClick={() => addDistribution(distributionHolder)}
              type="button"
              className="rounded bg-black px-2 py-1 font-bold text-white ease-out hover:bg-gray-900"
            >
              ADICIONAR
            </button>
          </div>
          <div className="flex w-full items-start justify-around gap-4">
            {infoHolder.distribuicoes.map((dist, index) => (
              <div
                key={`${dist.numInstalacao}-${index}`}
                className="group border-primary/60 flex items-center gap-2 rounded border p-2 shadow-xs"
              >
                <h1 className="text-foreground text-xs font-medium">
                  INSTALAÇÃO Nº {dist.numInstalacao}
                </h1>
                <h1 className="rounded-lg bg-black px-2 py-1 text-[0.65rem] font-bold text-white">
                  {formatDecimalPlaces(dist.excedente || 0)} %
                </h1>
                <button
                  onClick={() => removeDistribution(index)}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 opacity-0 duration-300 ease-linear group-hover:opacity-100 hover:scale-105 hover:bg-red-200"
                >
                  <VscChromeClose style={{ color: "red" }} />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </ResponsiveDialogDrawerSection>
  );
}

export default ElectricalInstallationDependentsInformationBlock;
