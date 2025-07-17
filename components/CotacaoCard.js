import dayjs from "dayjs";
import React, { useState } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle, IoIosSend } from "react-icons/io";

function CotacaoCard({ info, addToSolarMarket }) {
	const [infoHolder, setInfoHolder] = useState(info);
	const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);
	return (
		<div className="flex flex-col w-full p-2 rounded border border-[#15599a]">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h1 className="text-gray-500 font-bold text-md">{infoHolder.dataDeCotacao ? dayjs(infoHolder.dataDeCotacao).add(4, "hours").format("DD/MM/YYYY") : null}</h1>
					<h1 className="text-[#15599a] font-bold text-xl">
						{infoHolder.nomeDoKit} - ({infoHolder.codigo})
					</h1>
					<h1 className="text-[#fead61] font-bold">{infoHolder.fornecedor}</h1>
					<h1 className="text-green-500 font-bold">{infoHolder.potPico?.toFixed(2).replace(".", ",")} kWp</h1>
				</div>
				<div className="flex items-center gap-2">
					{!info.kitCriadoSVB ? (
						<button onClick={() => addToSolarMarket(info)} className="bg-blue-200 hover:text-white hover:bg-blue-600 p-1 rounded-lg mt-2">
							<IoIosSend style={{ fontSize: "25px" }} />
						</button>
					) : (
						<BsPatchCheckFill
							style={{
								fontSize: "20px",
								color: "rgb(21 128 61)",
								marginLeft: "10px",
							}}
						/>
					)}

					<h1 className="text-[#15599a] font-bold">R$ {infoHolder.valorDoKit.toFixed(2).replace(".", ",")}</h1>
					{dropdownMenuVisible ? (
						<div className="text-gray-600 hover:text-blue-400 cursor-pointer">
							<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(false)} />
						</div>
					) : (
						<div className="text-gray-600 hover:text-blue-400 cursor-pointer">
							<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(true)} />
						</div>
					)}
				</div>
			</div>
			{dropdownMenuVisible ? (
				<div className="flex flex-col w-full mt-2 border-t border-gray-300 pt-2">
					<div className="flex flex-col w-full">
						<h1 className="w-full bg-black border border-black text-white font-bold text-center">MÓDULOS</h1>
						<div className="grid grid-cols-3 items-center border-b border-x border-black">
							<h1 className="font-bold text-center border-r border-white p-1 bg-gray-500 text-white">QTDE</h1>
							<h1 className="font-bold text-center border-r border-white p-1 bg-gray-500 text-white">FABRICANTE</h1>
							<h1 className="font-bold text-center  p-1 bg-gray-500 text-white">MODELO</h1>
						</div>
						<div className="grid grid-cols-3 items-center  border-x border-black">
							<h1 className="text-gray-600 font-bold text-center border-r border-black p-1">{info.qtdeModulo}</h1>
							<h1 className="text-gray-600 font-bold text-center border-r border-black p-1">{info.marcaModulo}</h1>
							<h1 className="text-gray-600 font-bold text-center p-1">{info.descModulo}</h1>
						</div>
					</div>
					<div className="flex flex-col w-full">
						<h1 className="w-full bg-black border border-black text-white font-bold text-center">INVERSORES</h1>
						<div className="grid grid-cols-3 items-center border-b border-x border-black">
							<h1 className="font-bold text-center border-r border-white p-1 bg-gray-500 text-white">QTDE</h1>
							<h1 className="font-bold text-center border-r border-white p-1 bg-gray-500 text-white">FABRICANTE</h1>
							<h1 className="font-bold text-center p-1 bg-gray-500 text-white">MODELO</h1>
						</div>
						{info.inversores?.map((inversor, index) => (
							<div key={index} className="grid grid-cols-3 items-center  border-x border-black">
								<h1 className="text-gray-600 font-bold text-center border-r border-black p-1">{inversor.qtde}</h1>
								<h1 className="text-gray-600 font-bold text-center border-r border-black p-1">{inversor.marca}</h1>
								<h1 className="text-gray-600 font-bold text-center p-1">{inversor.modelo}</h1>
							</div>
						))}
					</div>
					<div className="flex flex-col w-full">
						<h1 className="w-full bg-black border border-black text-white font-bold text-center">COMPONENTES</h1>
						<div className="grid grid-cols-3 items-center border-b border-x border-black">
							<h1 className="font-bold text-center border-r border-white p-1 bg-gray-500 text-white">QTDE</h1>
							<h1 className="font-bold text-center border-r border-white p-1 bg-gray-500 text-white">INSUMO</h1>
							<h1 className="font-bold text-center p-1 bg-gray-500 text-white">TIPO</h1>
						</div>
						{info.componentes?.map((componente, index) => (
							<div key={index} className="grid grid-cols-3 items-center border-b  border-x border-black">
								<h1 className="text-gray-600 font-bold text-center border-r border-black p-1">{componente.qtde}</h1>
								<h1 className="text-gray-600 font-bold text-center border-r border-black p-1">{componente.insumo}</h1>
								<h1 className="text-gray-600 font-bold text-center p-1">{componente.tipo}</h1>
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
}

export default CotacaoCard;
