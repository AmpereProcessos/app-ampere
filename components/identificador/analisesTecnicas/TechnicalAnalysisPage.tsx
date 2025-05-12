import { useTechnicalAnalysisByPersonalizedFilters } from "@/utils/methods/query/technical-analysis";
import type { Session } from "next-auth";
import { useState } from "react";
import TechnicalAnalysisPagination from "./Pagination";
import LoadingPage from "@/components/utils/LoadingPage";
import ErrorComponent from "@/components/utils/ErrorComponent";
import TechnicalAnalysisCard from "./TechnicalAnalysisCard";
import ControlTechnicalAnalysis from "./ControlTechnicalAnalysis";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { AiOutlineTeam } from "react-icons/ai";
import FilterMenu from "./FilterMenu";

type TechnicalAnalysisPageProps = {
	session: Session;
};
function TechnicalAnalysisPage({ session }: TechnicalAnalysisPageProps) {
	const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false);
	const [statsBlockIsOpen, setStatsBlockIsOpen] = useState<boolean>(false);
	const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false });

	const [page, setPage] = useState<number>(1);
	const [period, setPeriod] = useState<{ after: string | null; before: string | null }>({ after: null, before: null });

	const { data, isLoading, isError, isSuccess, updateFilters } = useTechnicalAnalysisByPersonalizedFilters({
		after: period.after,
		before: period.before,
		applicants: null,
		analysts: null,
		partners: null,
		page: page,
	});
	const analysis = data?.analysis;
	const analysisMatched = data?.analysisMatched;
	const totalPages = data?.totalPages;
	console.log(totalPages);
	return (
		<div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
			<div className="flex w-full flex-col gap-2 border-b border-black pb-2">
				<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
					<div className="flex items-center gap-1">
						{filterMenuIsOpen ? (
							<div className="cursor-pointer text-gray-600 hover:text-blue-400">
								<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuIsOpen(false)} />
							</div>
						) : (
							<div className="cursor-pointer text-gray-600 hover:text-blue-400">
								<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuIsOpen(true)} />
							</div>
						)}
						<div className="flex flex-col gap-1">
							<h1 className="text-xl font-black leading-none tracking-tight md:text-2xl">CONTROLE DE ANÁLISES TÉCNICAS</h1>
						</div>
					</div>
				</div>
				{filterMenuIsOpen ? (
					<FilterMenu
						updateFilters={updateFilters}
						queryLoading={isLoading}
						session={session}
						analystsOptions={[]}
						applicantsOptions={[]}
						selectedApplicants={[]}
						setApplicants={() => {}}
						selectedAnalysts={[]}
						setAnalysts={() => {}}
						resetSelectedPage={() => setPage(1)}
					/>
				) : null}
				{/* {statsBlockIsOpen ? <Stats closeMenu={() => setStatsBlockIsOpen(false)} /> : null} */}
			</div>
			<TechnicalAnalysisPagination
				activePage={page}
				totalPages={totalPages || 0}
				selectPage={(x) => setPage(x)}
				queryLoading={isLoading}
				analysisMatched={analysisMatched}
				analysisShowing={analysis?.length}
			/>

			<div className="flex flex-wrap justify-between gap-2 py-2">
				{isLoading ? <LoadingPage /> : null}
				{isError ? <ErrorComponent msg={"Erro ao buscar análises técnicas."} /> : null}
				{isSuccess && analysis
					? analysis.map((analysisInfo) => <TechnicalAnalysisCard analysis={analysisInfo} handleClick={(id) => setEditModal({ id: id, isOpen: true })} userHasEditPermission={true} />)
					: null}
			</div>
			{editModal.id && editModal.isOpen ? <ControlTechnicalAnalysis analysisId={editModal.id} session={session} closeModal={() => setEditModal({ id: null, isOpen: false })} /> : null}
		</div>
	);
}

export default TechnicalAnalysisPage;
