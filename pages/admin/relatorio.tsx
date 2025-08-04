import DateIntervalInput from "@/components/inputs/DateIntervalInput";
import LoadingComponent from "@/components/utils/LoadingComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import { useOverallReport } from "@/utils/methods/query/stats";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";

import { BarChart3 } from "lucide-react";

import { useState } from "react";

import OverallReportGeneralStats from "@/components/identificador/estatisticas/overall-report/General";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import dayjs from "dayjs";

function ReportPage() {
	const { data: session, status } = useSession({ required: true });

	if (status !== "authenticated") return <LoadingComponent />;

	const hasResultsAccess = session.user.permissoes.gestao.visualizarResultados;
	if (!hasResultsAccess) return <UnauthorizedPage />;

	return <ReportPageContent session={session} />;
}
export default ReportPage;
function ReportPageContent({ session }: { session: Session }) {
	const { data: report, isLoading, isError, error, isSuccess, queryParams, updateQueryParams } = useOverallReport({});

	const reportPeriodPresets = [
		{
			label: "Último mês",
			interval: {
				after: dayjs().subtract(1, "month").startOf("month").subtract(3, "hour").toDate(),
				before: dayjs().subtract(1, "month").endOf("month").subtract(3, "hour").toDate(),
			},
		},

		// Generate year presets from 2017 to current year
		...Array.from({ length: dayjs().year() - 2017 + 1 }, (_, i) => {
			const year = 2017 + i;
			return {
				label: String(year),
				interval: {
					after: dayjs(`${year}-01-01`).startOf("day").subtract(3, "hour").toDate(),
					before: dayjs(`${year}-12-31`).endOf("day").subtract(3, "hour").toDate(),
				},
			};
		}),
	];
	return (
		<div className="flex grow flex-col p-6 bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="flex flex-col items-center border-b border-gray-300 bg-white rounded-lg shadow-sm mb-6 px-6 py-4">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<div className="flex items-center gap-2">
							<BarChart3 className="h-8 w-8 text-[#15599a]" />
							<p className="text-center text-2xl font-black uppercase text-[#15599a]">RELATÓRIO GERAL</p>
						</div>
					</div>
					<DateIntervalInput
						label="Período"
						labelClassName="text-xs font-medium leading-none tracking-tight"
						className="border-none p-0 px-2 h-fit py-0.5 shadow-none"
						value={{
							after: queryParams.period?.after ? new Date(queryParams.period.after) : undefined,
							before: queryParams.period?.before ? new Date(queryParams.period.before) : undefined,
						}}
						handleChange={(v) =>
							updateQueryParams({
								period: {
									after: v.after ? v.after.toISOString() : undefined,
									before: v.before ? v.before.toISOString() : undefined,
								},
							})
						}
						presets={reportPeriodPresets}
					/>
				</div>
			</div>
			{isLoading ? <LoadingComponent /> : null}
			{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
			{isSuccess ? (
				<>
					<OverallReportGeneralStats generalData={report?.geral} />
				</>
			) : null}
		</div>
	);
}
