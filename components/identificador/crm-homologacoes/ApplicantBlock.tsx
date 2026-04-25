import SelectInput from "@/components/inputs/Select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { useUsers } from "@/utils/methods/query/crm/users";
import type { THomologation } from "@/utils/schemas/crm/homologation.schema";
import { useState } from "react";

type ApplicantBlockProps = {
	infoHolder: THomologation;
	setInfoHolder: React.Dispatch<React.SetStateAction<THomologation>>;
};
function ApplicantBlock({ infoHolder, setInfoHolder }: ApplicantBlockProps) {
	const [applicantHolder, setApplicantHolder] = useState<string | null>(null);
	const { data: users, isLoading, isError, isSuccess } = useUsers({ includeDeleted: false });
	function handleSelect(selected: string) {
		const equivalentUser = users?.find((u) => u._id === selected);
		if (!equivalentUser) return;
		setInfoHolder((prev) => ({
			...prev,
			requerente: {
				id: equivalentUser._id,
				nome: equivalentUser.nome,
				apelido: equivalentUser.nome,
				contato: equivalentUser.telefone || "",
				avatar_url: equivalentUser.avatar_url,
			},
		}));
	}
	return (
		<div className="flex w-full flex-col gap-2">
			<h1 className="bg-primary/80 w-full rounded p-1 text-center font-bold text-white">REQUERENTE</h1>
			<div className="flex w-full items-center justify-center">
				<SelectInput
					label={"REQUERENTE"}
					editable={true}
					showLabel={false}
					value={infoHolder.requerente.id}
					options={
						users?.map((resp) => ({
							id: resp._id,
							label: resp.nome,
							value: resp._id,
							startContent: (
								<Avatar className="h-5 w-5 min-h-5 min-w-5">
									<AvatarImage src={resp.avatar_url ?? undefined} />
									<AvatarFallback className="text-xs">{formatNameAsInitials(resp.nome)}</AvatarFallback>
								</Avatar>
							),
						})) || []
					}
					handleChange={(value: any) => handleSelect(value)}
					onReset={() => setApplicantHolder(null)}
					selectedItemLabel={"USUÁRIO NÃO DEFINIDO"}
					width="100%"
				/>
			</div>
		</div>
	);
}

export default ApplicantBlock;
