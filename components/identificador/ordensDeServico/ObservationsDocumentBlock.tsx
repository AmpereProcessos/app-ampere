import { getObservationsGroupedByTopic } from "@/utils/methods/util/service-order";
import { TServiceOrderDTO } from "@/utils/schemas/service-order";
import React from "react";
import { FaDiamond } from "react-icons/fa6";

type ObservationsDocumentBlockProps = {
	description: string;
	observations: TServiceOrderDTO["observacoes"];
};
function ObservationsDocumentBlock({ description, observations }: ObservationsDocumentBlockProps) {
	const observationsGrouped = getObservationsGroupedByTopic(observations);
	return (
		<div className="flex w-full flex-col gap-2">
			<h1 className="text-center font-bold">OBSERVAÇÕES DA OBRA/OS</h1>
			<div className="flex min-h-[50px] flex-col gap-1">
				<p className="text-center text-sm font-bold tracking-tight">{description}</p>

				{observationsGrouped.map((group, groupIndex) => (
					<div key={groupIndex} className="flex w-full flex-col gap-1">
						<div className="flex w-full items-center justify-center rounded bg-black p-0.5 lg:w-full">
							<p className="w-full text-center text-[0.7rem] font-medium text-white">{group.topico}</p>
						</div>
						{group.observacoes.map((obs, obsIndex) => (
							<div key={obsIndex} className="flex items-center gap-1 self-center">
								<FaDiamond size={12} />
								<p className="text-[0.65rem] tracking-tight">{obs}</p>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

export default ObservationsDocumentBlock;
