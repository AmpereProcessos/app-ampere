import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { TAuthSession } from "@/lib/authentication/types";
import { type ExpenseRevenueList, TProjectFinances } from "@/pages/api/stats/financial-auditing";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { Eye, EyeOffIcon, Pencil } from "lucide-react";
import React, { useState } from "react";
import { BsCalendarPlus } from "react-icons/bs";
import { FaDiamond } from "react-icons/fa6";
import EditExpense from "../despesas/modals/EditExpense";
import EditRevenue from "../receitas/modals/EditRevenue";

type ExpenseRevenueListItemProps = {
	session: TAuthSession;
	finance: ExpenseRevenueList[number];
	tag: "EXPENSE" | "REVENUE";
	initialShowItems?: boolean;
};
function ExpenseRevenueListItem({ session, finance, tag, initialShowItems = false }: ExpenseRevenueListItemProps) {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [showItems, setShowItems] = useState<boolean>(initialShowItems);

	return (
		<div className="w-full flex flex-col gap-2 rounded-md border border-primary/30 p-2">
			<div className="flex w-full items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<h1 className="cursor-pointer text-xs leading-none font-black tracking-tight lg:text-sm">{finance.categoria}</h1>
				</div>
				<div className={`flex min-w-fit items-center gap-2 rounded-full ${tag === "EXPENSE" ? "bg-[#ed174c]" : "bg-[#70e000]"} px-2 py-1`}>
					<h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(finance.total)}</h1>
				</div>
			</div>

			<div className="w-full flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1">
						<BsCalendarPlus className="text-primary/80 text-xs" />
						<p className="text-primary/80 text-xs font-medium">{formatDateAsLocale(finance.dataInsercao) ?? "N/A"}</p>
					</div>
					<div className="flex items-center gap-1">
						<Avatar className="h-4 w-4 min-h-4 min-w-4">
							<AvatarImage src={finance.autor.avatar_url || undefined} />
							<AvatarFallback className="text-xs">{formatNameAsInitials(finance.autor.nome)}</AvatarFallback>
						</Avatar>
						<p className="text-primary/80 text-xs font-medium">{finance.autor.nome}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{finance.itens.length > 0 ? (
						<Button variant={"ghost"} onClick={() => setShowItems((prev) => !prev)} className="flex items-center gap-1 px-2 py-1 text-xs" size={"fit"}>
							{showItems ? <EyeOffIcon className="w-4 h-4 min-w-4 min-h-4" /> : <Eye className="w-4 h-4 min-w-4 min-h-4" />}
							{showItems ? "ESCONDER ITENS" : "VER ITENS"}
						</Button>
					) : null}
					{finance.id ? (
						<Button variant={"ghost"} onClick={() => setIsEditing((prev) => !prev)} className="flex items-center gap-1 px-2 py-1 text-xs" size={"fit"}>
							<Pencil className="w-4 h-4 min-w-4 min-h-4" />
							EDITAR
						</Button>
					) : null}
				</div>
			</div>
			{showItems
				? finance.itens
						.filter((i) => i.qtde > 0)
						.map((item, index) => (
							<div key={`${item.idMaterial}-${index.toString()}`} className="flex w-full items-center justify-between gap-2">
								<h1 className="text-primary/70 text-xs leading-none tracking-tight font-medium">
									<strong className="text-primary font-black">{formatDecimalPlaces(item.qtde, 1)}</strong> x {item.descricao}{" "}
									<strong className="text-primary">
										({formatToMoney(item.preco)}/ {item.unidade})
									</strong>
								</h1>
								<h1 className="text-primary text-xs font-black">{formatToMoney(item.qtde * item.preco)}</h1>
							</div>
						))
				: null}
			{isEditing && finance.id ? (
				tag === "EXPENSE" ? (
					<EditExpense expenseId={finance.id} session={session} closeModal={() => setIsEditing((prev) => !prev)} />
				) : (
					<EditRevenue revenueId={finance.id} session={session} closeModal={() => setIsEditing((prev) => !prev)} />
				)
			) : null}
		</div>
	);
}

export default ExpenseRevenueListItem;
