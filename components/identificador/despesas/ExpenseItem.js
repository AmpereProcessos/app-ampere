import dayjs from "dayjs";
import React, { useState } from "react";
import { BsCalendarFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaFilePdf, FaUserAlt } from "react-icons/fa";
import { formatToMoney } from "../../../utils/constants";
import { format } from "util";
import Link from "next/link";

function ExpenseItem({ expense }) {
	const [showItems, setShowItems] = useState(false);
	return (
		<div className="flex w-full flex-col items-center gap-2 border border-gray-300 p-3 shadow-sm lg:w-[40%]">
			<div className="w-full">
				<p className="text-center font-bold text-[#fead41]">{expense.categoria}</p>
			</div>
			<div className="flex w-full items-center justify-center gap-2">
				<div className="flex items-center gap-2">
					<BsCalendarFill color="#15599a" />
					<p className="text-xs font-medium text-gray-500">Criada em: {dayjs(expense.dataInsercao).format("DD/MM/YYYY HH:mm")}</p>
				</div>
				<div className="flex items-center gap-2">
					<FaUserAlt color="rgb(34,197,94)" />
					<p className="text-xs font-medium text-gray-500">Por {expense.autor.nome}</p>
				</div>
			</div>
			{expense.idFormularioAlmoxarifado ? (
				<Link href={`/almoxarifado/pdfFormulario/${expense.idFormularioAlmoxarifado}`}>
					<div className="mt-2 flex cursor-pointer items-center rounded border border-orange-200 p-2 py-2 pl-2 duration-300 ease-in hover:scale-[1.02] hover:bg-orange-200">
						<FaFilePdf style={{ color: "#fead41", fontSize: "15px" }} />
						<p className="pl-3 text-xs font-medium text-gray-600">FORMULÁRIO (PDF)</p>
					</div>
				</Link>
			) : null}
			{showItems ? (
				<div className="flex w-full flex-col items-center">
					<button onClick={() => setShowItems(false)} className="flex items-center gap-2 text-sm font-medium text-blue-300 hover:text-blue-700">
						ESCONDER ITENS <BsEyeSlashFill />
					</button>
					{expense.itens.map((item, index) => (
						<div key={index} className="flex w-full items-center justify-between text-xs">
							<p>
								{item.qtde?.toLocaleString("pt-br", {
									maximumFractionDigits: 2,
								})}{" "}
								x {item.descricao} ({item.unidade})
							</p>
							<p>
								{/* R${" "}
                {item.preco.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
								{formatToMoney(item.preco)}/{item.unidade}
							</p>
							<p className="font-medium">
								{formatToMoney(item.qtde * item.preco)}
								{/* R${" "}
                {(item.qtde * item.preco).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
							</p>
						</div>
					))}
				</div>
			) : (
				<div className="flex w-full items-center justify-center">
					<button onClick={() => setShowItems(true)} className="flex items-center gap-2 text-sm font-medium text-blue-300 hover:text-blue-700">
						MOSTRAR ITENS <BsEyeFill />
					</button>
				</div>
			)}
			{expense.descricao ? <p className="w-full text-center text-sm italic text-gray-500">{expense.descricao}</p> : null}
			<h1 className="mt-1 w-full text-center text-sm text-gray-500">TOTAL DA DESPESA</h1>
			<h1 className="w-full text-center font-raleway font-bold text-red-500">
				R${" "}
				{Number(expense.total).toLocaleString("pt-br", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}
			</h1>
		</div>
	);
}

export default ExpenseItem;
