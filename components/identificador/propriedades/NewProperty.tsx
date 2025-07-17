import TextInput from "@/components/inputs/Text";
import { TProperty, TPropertyDTO } from "@/utils/schemas/properties";
import { Session } from "next-auth";
import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import TagsMenu from "./TagsMenu";
import ResponsiblesMenu from "./ResponsiblesMenu";
import NumberInput from "@/components/inputs/Number";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { createProperty } from "@/utils/methods/mutation/properties";
import { useQueryClient } from "@tanstack/react-query";

type NewPropertyProps = {
	session: Session;
	closeModal: () => void;
};
function NewProperty({ session, closeModal }: NewPropertyProps) {
	const queryClient = useQueryClient();
	const [infoHolder, setInfoHolder] = useState<TProperty>({
		nome: "",
		identificador: "",
		quantidade: 1,
		tags: [],
		responsaveis: [],
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
	});
	const { mutate: handleCreateProperty, isPending } = useMutationWithFeedback({
		mutationKey: ["create-property"],
		mutationFn: createProperty,
		queryClient: queryClient,
		affectedQueryKey: ["properties"],
	});
	return (
		<div id="new-property" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
			<div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[60%]">
				<div className="flex h-full flex-col">
					<div className="flex flex-col items-center justify-between border-b border-gray-300 px-2 pb-2 text-lg lg:flex-row">
						<h3 className="text-xl font-bold text-[#353432] dark:text-white ">CADASTRO DE PROPRIEDADE</h3>
						<button onClick={() => closeModal()} type="button" className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200">
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>
					<div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
						<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
							<div className="w-full lg:w-1/3">
								<TextInput
									label="NOME DA PROPRIEDADE"
									placeholder="Preencha o nome da propriedade..."
									value={infoHolder.nome}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-1/3">
								<TextInput
									label="IDENTIFICADOR DA PROPRIEDADE"
									placeholder="Preencha o identificador da propriedade..."
									value={infoHolder.identificador}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, identificador: value }))}
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-1/3">
								<NumberInput
									label="QUANTIDADE DE ITENS"
									placeholder="Preencha a quantidade de itens..."
									value={infoHolder.quantidade}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, quantidade: value }))}
									width="100%"
								/>
							</div>
						</div>
						<TagsMenu propertyHolder={infoHolder as TPropertyDTO} setPropertyHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TPropertyDTO>>} />

						<ResponsiblesMenu propertyHolder={infoHolder as TPropertyDTO} setPropertyHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TPropertyDTO>>} />
					</div>
					<div className="my-1 flex w-full items-center justify-end">
						<button
							disabled={isPending}
							onClick={() => {
								const info = {
									nome: infoHolder.nome.toUpperCase(),
									identificador: infoHolder.identificador.toUpperCase(),
									quantidade: infoHolder.quantidade,
									tags: infoHolder.tags,
									responsaveis: infoHolder.responsaveis,
									autor: {
										id: session.user.id,
										nome: session.user.nome,
										avatar_url: session.user.avatar_url,
									},
									dataInsercao: new Date().toISOString(),
								};
								// @ts-ignore
								handleCreateProperty({ info: info });
							}}
							className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
						>
							CADASTRAR PROPRIEDADE
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NewProperty;
