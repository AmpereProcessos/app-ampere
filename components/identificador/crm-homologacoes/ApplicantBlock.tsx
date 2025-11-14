import SelectInputWithImages from "@/components/inputs/SelectWithImages";
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
				<SelectInputWithImages
					label={"REQUERENTE"}
					editable={true}
					showLabel={false}
					value={infoHolder.requerente.id}
					options={
						users?.map((resp) => ({
							id: resp._id,
							label: resp.nome,
							value: resp._id,
							url: resp.avatar_url || undefined,
							fallback: formatNameAsInitials(resp.nome),
						})) || []
					}
					handleChange={(value: any) => handleSelect(value)}
					onReset={() => setApplicantHolder(null)}
					selectedItemLabel={"USUÁRIO NÃO DEFINIDO"}
					// @ts-ignore
					width={undefined}
				/>
			</div>
		</div>
	);
}

export default ApplicantBlock;
