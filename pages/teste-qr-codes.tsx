import { useProperties } from "@/utils/methods/query/properties";

function chunkArray<T>(arr: T[], size: number): T[][] {
	if (!arr) return [];
	const result: T[][] = [];
	for (let i = 0; i < arr.length; i += size) {
		result.push(arr.slice(i, i + size));
	}
	return result;
}

function TesteQrCodes() {
	const { data: properties } = useProperties({});

	if (!properties) {
		return (
			<div className="relative grow bg-[#fafafa] p-6 flex flex-col items-center justify-center">
				<p>Carregando propriedades...</p>
			</div>
		);
	}

	const propertyChunks = chunkArray(properties, 25);

	return (
		<div className="relative grow bg-[#fafafa] p-6 flex flex-col items-center justify-center gap-8">
			{propertyChunks.map((chunk, idx) => (
				<div
					key={idx.toString()}
					className="bg-white shadow-lg rounded-lg p-8 mb-8 w-[800px] h-[1120px] flex flex-col justify-center items-center"
					style={{ pageBreakAfter: "always" }}
				>
					<div className="grid grid-cols-5 grid-rows-5 gap-4 w-full h-full">
						{chunk.map((property, i) => (
							<div key={property.identificador || i} className="flex flex-col items-center justify-center border border-gray-200 rounded p-2 min-h-[150px] min-w-[120px] bg-gray-50">
								<div className="text-xs font-semibold text-center mb-2">{property.nome}</div>
								{property.usoTemporarioLinkUrlQRCode ? (
									<div
										// @ts-ignore
										dangerouslySetInnerHTML={{ __html: property.usoTemporarioLinkUrlQRCode }}
										className="size-24"
									/>
								) : (
									<div className="size-24 flex items-center justify-center text-gray-400 text-xs">Sem QR Code</div>
								)}
							</div>
						))}
						{/* Fill empty cells if less than 25 */}
						{Array.from({ length: 25 - chunk.length }).map((_, i) => (
							<div
								key={`empty-${i.toString()}`}
								className="flex flex-col items-center justify-center border border-gray-200 rounded p-2 min-h-[150px] min-w-[120px] bg-gray-50 opacity-0"
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

export default TesteQrCodes;
