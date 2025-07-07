import { useDebounce, useDebounceMemo } from "@/lib/hooks/debounce";
import { useVinculationProjectsSearch } from "@/utils/methods/query/projects";
import type { TProjectDTODBSimplified, TQueryVinculationProjectsFilter } from "@/utils/schemas/projects";
import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { Input } from "@/components/ui/input";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import { FaLink, FaPhone, FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { formatLocation } from "@/utils/methods/formatting";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { Button } from "@/components/ui/button";

type ProjectVinculationMenuProps = {
	closeModal: () => void;
	handleSelect: (projectSimplified: TProjectDTODBSimplified) => void;
};
function ProjectVinculationMenu({ closeModal, handleSelect }: ProjectVinculationMenuProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [queryParams, setQueryParams] = useState<TQueryVinculationProjectsFilter>({
		search: "",
	});
	const debouncedQueryParams = useDebounceMemo(queryParams, 350);
	const { data: projects, isLoading, isFetching, isError, isSuccess, isStale, error } = useVinculationProjectsSearch(debouncedQueryParams);

	const MENU_TITLE = "NOVA CONDIÇÃO";
	const MENU_DESCRIPTION = "Preencha os campos abaixo para criar uma nova condição.";
	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DialogContent className="flex flex-col h-fit min-h-[60vh] max-h-[70vh]">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-auto">
					<Input
						value={queryParams.search}
						placeholder="Pesquisa aqui pelo nome ou código do projeto..."
						onChange={(e) => setQueryParams((prev) => ({ ...prev, search: e.target.value }))}
						className="w-full"
					/>

					{isLoading || isFetching ? <LoadingComponent /> : null}
					{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
					{isSuccess && !isFetching ? (
						<div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
							{projects.length > 0 ? (
								projects.map((project) => (
									<div key={project._id} className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
										<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
											<div className="flex flex-wrap items-center gap-2">
												<h1 className="rounded-lg bg-[#fead41] px-2 py-0.5 text-[0.6rem] font-bold text-white">{project.qtde}</h1>
												<p className="text-sm font-bold leading-none tracking-tight">{project.nomeDoContrato}</p>
											</div>
											<button
												type="button"
												onClick={() => handleSelect(project)}
												className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white duration-300 ease-in-out hover:bg-blue-700"
											>
												<FaLink />
												<h1>VINCULAR</h1>
											</button>
										</div>
										<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
											<div className="flex grow flex-wrap items-center justify-center gap-2 lg:justify-start">
												<div className="flex items-center gap-1">
													<FaUser width={10} height={10} />
													<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.nomeDoContrato}</h1>
												</div>
												<div className="flex items-center gap-1">
													<FaPhone width={10} height={10} />
													<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.telefone}</h1>
												</div>
												<div className="flex items-center gap-1">
													<FaLocationDot width={10} height={10} />
													<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">
														{formatLocation({
															location: {
																uf: project.uf || "",
																cidade: project.cidade || "",
																cep: project.cep?.toString() || "",
																bairro: project.bairro,
																endereco: project.logradouro,
																numeroOuIdentificador: project.numeroResidencia?.toString() || "",
																complemento: null,
																latitude: null,
																longitude: null,
															},
															includeCity: true,
															includeUf: true,
														})}
													</h1>
												</div>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum projeto encontrado.</div>
							)}
						</div>
					) : null}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DrawerContent className="h-fit max-h-[70vh] flex flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>{MENU_TITLE}</DrawerTitle>
					<DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-auto">
					<Input
						value={queryParams.search}
						placeholder="Pesquisa aqui pelo nome ou código do projeto..."
						onChange={(e) => setQueryParams((prev) => ({ ...prev, search: e.target.value }))}
						className="w-full"
					/>

					{isLoading || isFetching ? <LoadingComponent /> : null}
					{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
					{isSuccess && !isFetching ? (
						<div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
							{projects.length > 0 ? (
								projects.map((project) => (
									<div key={project._id} className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
										<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
											<div className="flex flex-wrap items-center gap-2">
												<h1 className="rounded-lg bg-[#fead41] px-2 py-0.5 text-[0.6rem] font-bold text-white">{project.qtde}</h1>
												<p className="text-sm font-bold leading-none tracking-tight">{project.nomeDoContrato}</p>
											</div>
											<button
												type="button"
												onClick={() => handleSelect(project)}
												className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white duration-300 ease-in-out hover:bg-blue-700"
											>
												<FaLink />
												<h1>VINCULAR</h1>
											</button>
										</div>
										<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
											<div className="flex grow flex-wrap items-center justify-center gap-2 lg:justify-start">
												<div className="flex items-center gap-1">
													<FaUser width={10} height={10} />
													<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.nomeDoContrato}</h1>
												</div>
												<div className="flex items-center gap-1">
													<FaPhone width={10} height={10} />
													<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.telefone}</h1>
												</div>
												<div className="flex items-center gap-1">
													<FaLocationDot width={10} height={10} />
													<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">
														{formatLocation({
															location: {
																uf: project.uf || "",
																cidade: project.cidade || "",
																cep: project.cep?.toString() || "",
																bairro: project.bairro,
																endereco: project.logradouro,
																numeroOuIdentificador: project.numeroResidencia?.toString() || "",
																complemento: null,
																latitude: null,
																longitude: null,
															},
															includeCity: true,
															includeUf: true,
														})}
													</h1>
												</div>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum projeto encontrado.</div>
							)}
						</div>
					) : null}
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default ProjectVinculationMenu;
