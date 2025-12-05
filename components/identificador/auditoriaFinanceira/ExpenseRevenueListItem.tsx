import { type ExpenseRevenueList, TProjectFinances } from "@/pages/api/stats/financial-auditing";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import React, { useState } from "react";
import { FaDiamond } from "react-icons/fa6";

type ExpenseRevenueListItemProps = {
	finance: ExpenseRevenueList[number];
	tag: "EXPENSE" | "REVENUE";
	initialShowItems?: boolean;
};
function ExpenseRevenueListItem({ finance, tag, initialShowItems = false }: ExpenseRevenueListItemProps) {
	const [showItems, setShowItems] = useState<boolean>(initialShowItems);

	return (
		<div className="border-primary/20 flex w-full flex-col rounded-md border p-2">
			<div className="flex w-full items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<h1 className="cursor-pointer text-xs leading-none font-black tracking-tight lg:text-sm">{finance.categoria}</h1>
					{finance.itens.length > 0 ? (
						<button type="button" onClick={() => setShowItems((prev) => !prev)} className="text-[0.6rem] text-[#ED7D31]">
							{showItems ? "FECHAR" : "EXPANDIR"}
						</button>
					) : null}
				</div>
				<div className={`flex min-w-fit items-center gap-2 rounded-full ${tag === "EXPENSE" ? "bg-[#ed174c]" : "bg-[#70e000]"} px-2 py-1`}>
					<h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(finance.total)}</h1>
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
		</div>
	);
}

export default ExpenseRevenueListItem;
