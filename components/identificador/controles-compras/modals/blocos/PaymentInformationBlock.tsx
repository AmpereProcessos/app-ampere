import DateInput from "@/components/inputs/Date";
import TextInput from "@/components/inputs/Text";
import { formatDate, formatToPhone } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import { TPurchaseControl } from "@/utils/schemas/purchases";
import React from "react";

type PurchaseControlPaymentInformationBlockProps = {
	infoHolder: TPurchaseControl;
	setInfoHolder: React.Dispatch<React.SetStateAction<TPurchaseControl>>;
};
function PurchaseControlPaymentInformationBlock({ infoHolder, setInfoHolder }: PurchaseControlPaymentInformationBlockProps) {
	return (
		<div className="flex w-full grow flex-col gap-4">
			<h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES DE PAGAMENTO</h1>
			<div className="flex w-full grow flex-col gap-2">
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<DateInput
							label="DATA COBRANÇA DO PAGAMENTO"
							value={formatDate(infoHolder.dataRequisicaoPagamento)}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, dataRequisicaoPagamento: formatDateInputChange(value) as string }))}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<DateInput
							label="DATA DE PAGAMENTO (RECURSOS)"
							value={formatDate(infoHolder.dataLiberacaoPagamento)}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, dataLiberacaoPagamento: formatDateInputChange(value) as string }))}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<DateInput
							label="DATA DE PAGAMENTO (COMPRA)"
							value={formatDate(infoHolder.dataPagamento)}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, dataPagamento: formatDateInputChange(value) as string }))}
							width="100%"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PurchaseControlPaymentInformationBlock;
