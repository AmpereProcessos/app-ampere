import React from "react";

function renderPagesIcons({
	totalPages,
	activePage,
	selectPage,
	disabled,
}: {
	totalPages: number;
	activePage: number;
	selectPage: (page: number) => void;
	disabled: boolean;
}) {
	const MAX_RENDER = 5;
	let pages: (number | string)[] = [];
	if (totalPages <= MAX_RENDER) {
		pages = Array.from({ length: totalPages }, (v, i) => i + 1);
	} else {
		// If active page is around the middle of the total pages
		if (totalPages - activePage > 3 && activePage - 1 > 3) {
			console.log("AQUI 1");
			pages = [1, "...", activePage - 1, activePage, activePage + 1, "...", totalPages];
		} else {
			// if active page is 3 elements from the total page
			if (activePage > 3 && totalPages - activePage < MAX_RENDER - 1) pages = [1, "...", ...Array.from({ length: MAX_RENDER }, (v, i) => i + totalPages - MAX_RENDER), totalPages];
			// else, if active page is 3 elements from 1
			else pages = [...Array.from({ length: MAX_RENDER }, (v, i) => i + 1), "...", totalPages];
		}
	}
	return pages.map((p) => (
		<button
			type="button"
			key={p}
			disabled={typeof p !== "number" || disabled}
			onClick={() => {
				if (typeof p !== "number") return;
				return selectPage(p);
			}}
			className={`${
				activePage === p ? "border-black bg-black text-white" : "border-transparent text-black hover:bg-gray-500"
			} max-w-10 min-w-10 min-h-10 h-10 max-h-10 w-10 rounded-full border text-xs font-medium`}
		>
			{p}
		</button>
	));
}

type ClientsPaginationProps = {
	activePage: number;
	totalPages: number;
	projectsMatched?: number;
	projectsShowing?: number;
	selectPage: (page: number) => void;
	queryLoading: boolean;
};
function ProjectsDBPagination({ totalPages, activePage, selectPage, projectsMatched, projectsShowing, queryLoading }: ClientsPaginationProps) {
	return (
		<div className="my-2 flex w-full flex-col items-center gap-3">
			{totalPages > 1 ? (
				<>
					<p className="w-full text-center text-sm leading-none tracking-tight text-gray-500">
						Um número grande de projetos foi encontrado, separamos em páginas para facilitar a visualização. Clique na página desejada para visualizar os demais projetos.
					</p>
					<div className="flex items-center justify-center gap-y-2 gap-x-4 flex-col md:flex-row">
						<button
							disabled={queryLoading}
							onClick={() => {
								if (activePage - 1 > 0) return selectPage(activePage - 1);
								return;
							}}
							className="min-w-fit font-sans flex select-none items-center gap-2 rounded-full py-1 px-6 lg:py-3 text-center align-middle text-xs font-bold uppercase text-gray-900 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none hover:bg-gray-900/10 active:bg-gray-900/20"
							type="button"
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" className="h-4 w-4">
								<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18">
									<title>Página anterior</title>
								</path>
							</svg>
							ANTERIOR
						</button>
						<div className="flex items-center gap-2 grow">{renderPagesIcons({ totalPages, activePage, selectPage, disabled: queryLoading })}</div>
						<button
							disabled={queryLoading}
							onClick={() => {
								if (activePage + 1 <= totalPages) selectPage(activePage + 1);
								else return;
							}}
							className="min-w-fit font-sans flex select-none items-center gap-2 rounded-full py-1 px-6 lg:py-3 text-center align-middle text-xs font-bold uppercase text-gray-900 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none hover:bg-gray-900/10 active:bg-gray-900/20"
							type="button"
						>
							PRÓXIMA
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" className="h-4 w-4">
								<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3">
									<title>Página anterior</title>
								</path>
							</svg>
						</button>
					</div>
				</>
			) : null}

			<p className="w-full text-center text-sm leading-none tracking-tight text-gray-500">
				{projectsMatched ? (projectsMatched > 0 ? `${projectsMatched} clientes encontrados.` : `${projectsMatched} cliente encontrado.`) : "..."}
			</p>
			<p className="w-full text-center text-sm leading-none tracking-tight text-gray-500">
				{projectsShowing ? (projectsShowing > 0 ? `Mostrando ${projectsShowing} clientes.` : `Mostrando ${projectsShowing} cliente.`) : "..."}
			</p>
		</div>
	);
}

export default ProjectsDBPagination;
