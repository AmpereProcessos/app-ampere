import DateIntervalInput from "@/components/inputs/DateIntervalInput";
import LoadingComponent from "@/components/utils/LoadingComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import { useOverallReport } from "@/utils/methods/query/stats";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, MapPin, Zap, DollarSign, Home, CheckCircle, Building2, Earth, Building } from "lucide-react";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { MdDashboard } from "react-icons/md";
import { FaSolarPanel } from "react-icons/fa";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import OverallReportGeneralStats from "@/components/identificador/estatisticas/overall-report/General";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";

function ReportPage() {
	const { data: session, status } = useSession({ required: true });

	if (status !== "authenticated") return <LoadingComponent />;

	const hasResultsAccess = session.user.permissoes.gestao.visualizarResultados;
	if (!hasResultsAccess) return <UnauthorizedPage />;

	return <ReportPageContent session={session} />;
}
export default ReportPage;
function ReportPageContent({ session }: { session: Session }) {
	const [activeSegmentMode, setActiveSegmentMode] = useState<"instalacoes" | "homologacoes">("instalacoes");
	const { data: report, isLoading, isError, error, isSuccess, queryParams, updateQueryParams } = useOverallReport({});
	console.log(report);
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
