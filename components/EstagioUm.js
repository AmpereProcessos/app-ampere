import React, { useState } from "react";

function EstagioUm({ next, infoHolder, setInfoHolder }) {
	const [err, setErr] = useState("");
	function validateFields() {
		if (infoHolder.valorFatura < 30) {
			setErr("Oops, valor de fatura inválido. Por favor, confira o valor preenchido.");
		} else {
			setErr("");
			return true;
		}
	}
	function goNext() {
		if (validateFields()) {
			next();
		}
	}
	return (
		<div className="flex h-[400px] w-full flex-col">
			<div className="flex h-[300px] flex-col items-center text-center">
				<div className="flex h-[146px] w-[300px] flex-col items-center justify-center lg:w-[350px]">
					<div className="relative w-full leading-none">
						<p className="m-0 inline text-[19px] leading-[1.2] font-normal text-[rgba(79,88,96,1)]">
							Simule a economia que você terá com um{" "}
							<strong className="m-0 inline text-[19px] leading-[1.2] font-black text-[rgba(21,89,154,1)]">Sistema Ampère de Energia Solar</strong>!
						</p>
					</div>
				</div>
				<div className="flex h-[300px] w-[300px] flex-col items-center justify-center gap-1 font-normal lg:w-[350px]">
					<div className="flex w-full items-center text-[rgba(79,88,96,1)]">
						<p className="m-0 w-[365px] text-[15px] leading-[1.2]">Qual o valor da sua conta de energia?</p>
					</div>
					<div className="w-full text-[rgba(3,11,19,1)]">
						<div className={`${err ? "border border-red-500 bg-red-200" : "bg-background"} flex items-center rounded-lg p-3 shadow-xs`}>
							<p className="m-0 text-[19px] leading-[1.2]">R$</p>
							<input
								value={infoHolder.valorFatura}
								type={"number"}
								onChange={(e) => {
									if (Number(e.target.value) < 0) {
										setInfoHolder({ ...infoHolder, valorFatura: 0 });
									} else {
										setErr("");
										setInfoHolder({
											...infoHolder,
											valorFatura: Number(e.target.value),
										});
									}
								}}
								className={`grow bg-transparent text-center outline-hidden`}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="flex h-[100px] w-full flex-col items-center justify-center gap-4 self-stretch text-center font-black text-white">
				{err ? <p className="text-center text-red-500 italic">{err}</p> : null}
				<div className="w-full">
					<div className="flex flex-1 grow flex-col items-center justify-center rounded-lg bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] p-3 duration-300 hover:scale-[1.02]">
						<p onClick={() => goNext()} className="m-0 w-full cursor-pointer text-[19px] leading-[1.2]">
							Próximo
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EstagioUm;
