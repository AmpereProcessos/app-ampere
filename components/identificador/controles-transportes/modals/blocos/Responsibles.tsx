import TextInput from "@/components/inputs/Text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { formatNameAsInitials, formatToCPForCNPJ } from "@/utils/methods/formatting";
import { useEmployeeBySearch } from "@/utils/methods/query/users";
import type { TUseTransportControlState } from "@/utils/state/transport-controls";
import { IdCard, Phone, Trash2, UserRound } from "lucide-react";

type ResponsiblesBlockProps = {
	responsaveis: TUseTransportControlState["state"]["transportControl"]["responsaveis"];
	updateTransportControl: TUseTransportControlState["updateTransportControl"];
};

export default function ResponsiblesBlock({ responsaveis, updateTransportControl }: ResponsiblesBlockProps) {
	const { data: employeeByCpf, isFetching, isFetched, queryParams, updateQueryParams } = useEmployeeBySearch();

	const cpf = queryParams.cpf;
	const cpfLooksComplete = cpf.trim().length >= 14;
	const cpfNotFound = cpfLooksComplete && isFetched && !employeeByCpf && !isFetching;
	const employeeAlreadyAdded = !!employeeByCpf && responsaveis.some((responsible) => responsible.id === employeeByCpf.id);

	function handleAddResponsible() {
		if (!employeeByCpf) return;
		const nextResponsibles = Array.from(
			new Map(
				[
					...responsaveis,
					{
						id: employeeByCpf.id,
						nome: employeeByCpf.nome,
						avatar_url: employeeByCpf.avatar_url ?? null,
						telefone: employeeByCpf.telefone,
					},
				].map((responsible) => [responsible.id, responsible]),
			).values(),
		);
		updateTransportControl({ responsaveis: nextResponsibles });
	}

	function handleRemoveResponsible(responsibleId: string) {
		updateTransportControl({ responsaveis: responsaveis.filter((responsible) => responsible.id !== responsibleId) });
	}

	return (
		<ResponsiveDialogDrawerSection sectionTitleText="RESPONSÁVEIS" sectionTitleIcon={<UserRound size={15} />}>
			<div className="w-full rounded-lg px-3 py-3 flex flex-col items-center gap-2 bg-primary/10">
				<div className="w-full">
					<input
						type="text"
						placeholder="Preencha o CPF para buscar colaborador..."
						value={cpf}
						onChange={(e) => updateQueryParams({ cpf: formatToCPForCNPJ(e.target.value), email: "" })}
						className="w-full rounded-md border border-primary/20 p-3 text-sm shadow-xs outline-hidden duration-500 ease-in-out placeholder:italic focus:border-primary"
					/>
				</div>
				{isFetching ? <p className="text-primary/80 text-xs font-medium">Validando CPF...</p> : null}
				{cpfNotFound ? <p className="text-red-500 text-xs font-medium">Nenhum colaborador encontrado para o CPF informado.</p> : null}
				{employeeByCpf ? (
					<div className="w-full rounded-lg bg-green-300 px-2 py-2 flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<Avatar className="h-7 min-h-7 w-7 min-w-7">
								<AvatarImage src={employeeByCpf.avatar_url ?? undefined} />
								<AvatarFallback>{formatNameAsInitials(employeeByCpf.nome)}</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p className="text-xs font-medium">{employeeByCpf.nome}</p>
								<div className="flex items-center gap-2">
									<div className="flex items-center gap-1">
										<IdCard className="h-3 w-3" />
										<p className="text-[0.65rem] text-primary/80">{employeeByCpf.cpf}</p>
									</div>
									<div className="flex items-center gap-1">
										<Phone className="h-3 w-3" />
										<p className="text-[0.65rem] text-primary/80">{employeeByCpf.telefone}</p>
									</div>
								</div>
							</div>
						</div>
						{employeeAlreadyAdded ? <p className="text-[0.65rem] text-primary/80 font-medium">Já adicionado</p> : null}
					</div>
				) : null}
				<Button
					onClick={handleAddResponsible}
					type="button"
					size="fit"
					className="w-fit px-3 py-1 self-center"
					disabled={!employeeByCpf || employeeAlreadyAdded}
				>
					ADICIONAR
				</Button>
			</div>
			<div className="w-full flex flex-col gap-2">
				{responsaveis.length > 0 ? (
					responsaveis.map((responsible) => (
						<div key={responsible.id} className="w-full border border-primary/20 rounded-lg px-2 py-2 flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<Avatar className="h-7 min-h-7 w-7 min-w-7">
									<AvatarImage src={responsible.avatar_url ?? undefined} />
									<AvatarFallback>{formatNameAsInitials(responsible.nome)}</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<p className="text-xs font-medium">{responsible.nome}</p>
									<p className="text-[0.65rem] text-primary/80">{responsible.telefone}</p>
								</div>
							</div>
							<Button type="button" variant="ghost" size="fit" className="px-2 py-1" onClick={() => handleRemoveResponsible(responsible.id)}>
								<Trash2 className="h-4 w-4 text-red-500" />
							</Button>
						</div>
					))
				) : (
					<p className="text-xs text-primary/70 font-medium">Nenhum responsável adicionado.</p>
				)}
			</div>
		</ResponsiveDialogDrawerSection>
	);
}
