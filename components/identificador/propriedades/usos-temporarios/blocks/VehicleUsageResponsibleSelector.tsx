import { useEffect } from "react";
import { motion } from "framer-motion";
import { IdCard, Phone, UserRound } from "lucide-react";

import TextInput from "@/components/inputs/Text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SlideMotionVariants } from "@/utils/constants";
import { formatNameAsInitials, formatToCPForCNPJ } from "@/utils/methods/formatting";
import { useEmployeeBySearch } from "@/utils/methods/query/users";
import { usePropertyUsageStore } from "@/utils/stores/property-usage";

export default function VehicleUsageResponsibleSelector() {
  const responsibles = usePropertyUsageStore((state) => state.propertyUsage.responsaveis);
  const updatePropertyUsage = usePropertyUsageStore((state) => state.updatePropertyUsage);
  const currentAuthor = usePropertyUsageStore((state) => state.propertyUsage.autor);
  const { data: employee, isFetched, updateQueryParams } = useEmployeeBySearch();

  useEffect(() => {
    if (employee) {
      const newAuthor = {
        id: employee.id,
        nome: employee.nome,
        avatar_url: employee.avatar_url ?? undefined,
        cpf: employee.cpf,
        telefone: employee.telefone,
      };
      const newResponsibles = Array.from(
        new Map([...responsibles, newAuthor].map((r) => [r.id, r])).values(),
      );
      updatePropertyUsage({
        autor: newAuthor,
        responsaveis: newResponsibles,
      });
      return;
    }

    if (currentAuthor.id !== "" && isFetched) {
      updatePropertyUsage({
        autor: {
          id: "",
          nome: "",
          cpf: "",
          telefone: "",
        },
        responsaveis: [],
      });
    }
  }, [employee, isFetched]);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="bg-primary/20 flex w-fit items-center gap-2 rounded px-2 py-1">
        <UserRound size={15} />
        <h1 className="w-fit text-start text-xs font-medium tracking-tight">
          INFORMAÇÕES DO RESPONSÁVEL
        </h1>
      </div>

      <TextInput
        label="CPF"
        placeholder="Preencha o seu CPF..."
        value={currentAuthor.cpf}
        handleChange={(value) => {
          const formattedCpf = formatToCPForCNPJ(value);
          updatePropertyUsage({ autor: { ...currentAuthor, cpf: formattedCpf } });
          updateQueryParams({ cpf: formattedCpf });
        }}
        width="100%"
      />

      {currentAuthor.id !== "" ? (
        <motion.div
          key={"user-open"}
          variants={SlideMotionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex w-full flex-col items-center justify-center gap-2 gap-y-1 self-center rounded-lg bg-blue-200 px-2 py-2 lg:w-fit lg:flex-row"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 min-h-8 w-8 min-w-8">
              <AvatarImage src={currentAuthor.avatar_url ?? undefined} />
              <AvatarFallback>{formatNameAsInitials(currentAuthor.nome)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grow flex flex-col gap-1">
            <h1 className="text-center text-sm leading-none font-medium tracking-tight">
              {currentAuthor.nome}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex min-w-fit items-center gap-1">
                <IdCard className="h-3 min-h-3 w-3 min-w-3" />
                <p className={"text-primary/80 text-xs font-medium"}>{currentAuthor.cpf}</p>
              </div>
              <div className="flex min-w-fit items-center gap-1">
                <Phone className="h-3 min-h-3 w-3 min-w-3" />
                <p className={"text-primary/80 text-xs font-medium"}>
                  {currentAuthor.telefone || "NÃO DEFINIDO"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
