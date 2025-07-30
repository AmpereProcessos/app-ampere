import type { Session } from "next-auth";
import { DragDropContext, Draggable, Droppable, type DropResult } from "react-beautiful-dnd";
import { useState } from "react";
import { FaRotate } from "react-icons/fa6";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useEngineeringProjectsKanban } from "@/utils/methods/query/engineering";
import ModalProjetos from "@/components/ModalProjetos";
import type { TEngineeringProjectsKanbanOutput } from "@/pages/api/projects/engenharia/kanban";
import { MdDashboard } from "react-icons/md";
import { Tag, Pencil } from "lucide-react";

type EngineeringKanbanModePageProps = {
	session: Session;
	handleSetMode: (mode: "kanban" | "database") => void;
};
function EngineeringKanbanModePage({ session, handleSetMode }: EngineeringKanbanModePageProps) {
	const [editProjectModal, setEditProjectModal] = useState<{ id: string | null; isOpen: boolean }>({
		id: null,
		isOpen: false,
	});
	const { data: kanbanProjects, isLoading, isError, error, isSuccess } = useEngineeringProjectsKanban();

	function onDragEnd(dragEndResult: DropResult) {}
	return (
		<div className="flex grow flex-col gap-2 p-6">
			<div className="flex flex-col items-center justify-between border-b border-gray-300 p-1">
				<div className="flex w-full flex-col items-center justify-between gap-2 gap-y-3 lg:flex-row ">
					<div className="flex flex-col items-center  gap-1 lg:flex-row">
						<div className="flex items-center gap-1">
							<p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS EM ENGENHARIA</p>
						</div>
						<button type="button" onClick={() => handleSetMode("database")} className="flex items-center gap-1 px-2 text-xs text-gray-500 duration-300 ease-out hover:text-gray-800">
							<FaRotate />
							<h1 className="font-medium">ALTERAR MODO</h1>
						</button>
					</div>
				</div>
			</div>

			<DragDropContext onDragEnd={(e) => onDragEnd(e)}>
				<div className="flex max-h-[600px] w-full gap-3 overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
					{isLoading ? <LoadingComponent /> : null}
					{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
					{isSuccess ? Object.entries(kanbanProjects.data).map(([key, value]) => <EngineeringKanbanFunnelList key={key} listTitle={key} listItems={value} />) : null}
				</div>
			</DragDropContext>
			{editProjectModal.isOpen && editProjectModal.id && (
				<ModalProjetos projectId={editProjectModal.id} modalIsOpen={editProjectModal.isOpen} closeModal={() => setEditProjectModal({ id: null, isOpen: false })} />
			)}
		</div>
	);
}

export default EngineeringKanbanModePage;

type EngineeringKanbanFunnelListProps = {
	listTitle: string;
	listItems: TEngineeringProjectsKanbanOutput["data"][string];
	handleItemClick: (id: string) => void;
};
function EngineeringKanbanFunnelList({ listTitle, listItems, handleItemClick }: EngineeringKanbanFunnelListProps) {
	return (
		<Droppable droppableId={listTitle.toString()}>
			{(provided) => (
				<div className="flex w-full min-w-[390px] flex-col p-2 px-4 lg:w-[390px]">
					<div className="flex w-full flex-col rounded bg-[#15599a] px-2 lg:h-[60px]">
						<div className="flex w-full items-center gap-2">
							<h1 className="w-full rounded p-1 text-center font-medium text-white">{listTitle}</h1>
						</div>
						<div className="mt-1 flex w-full flex-col items-center justify-center px-2 pb-2 lg:flex-row">
							<div className="w-full lg:w-1/3" />
							<div className="flex w-full items-center justify-center gap-1 text-[0.65rem] text-white lg:w-1/3  lg:text-[0.7rem]">
								<MdDashboard />
								<p>{listItems.length}</p>
							</div>
						</div>
					</div>
					<div ref={provided.innerRef} {...provided.droppableProps} className="my-1 flex flex-col gap-2 ">
						{listItems.map((item, index) => (
							<EngineeringKanbanListItem key={item._id} item={item} index={index} handleClick={handleItemClick} />
						))}
						{provided.placeholder}
					</div>
				</div>
			)}
		</Droppable>
	);
}

type EngineeringKanbanListItemProps = {
	item: TEngineeringProjectsKanbanOutput["data"][string][number];
	index: number;
	handleClick: (id: string) => void;
};
function EngineeringKanbanListItem({ item, index, handleClick }: EngineeringKanbanListItemProps) {
	return (
		<Draggable draggableId={item._id.toString()} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className="relative flex min-h-[110px] w-full flex-col justify-between gap-1 rounded border border-gray-500 bg-[#fff] p-2 shadow-sm"
				>
					<div className="flex w-full items-center justify-between gap-2">
						<div className="flex items-center gap-1">
							<h1 className="text-sm font-bold leading-none tracking-tight">{item.nomeDoContrato}</h1>
						</div>
						<button type="button" onClick={() => handleClick(item._id)} className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary">
							<Pencil width={10} height={10} />
							<p>EDITAR</p>
						</button>
					</div>
					<div className="flex w-full grow flex-col gap-2 px-2">
						{item.etiquetas && item.etiquetas.length > 0 ? (
							<div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
								<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ETIQUETAS</h1>
								{item.etiquetas.map((tag, index) => (
									<div
										key={`${tag.id}-${index}`}
										style={{
											border: "1px solid",
											borderColor: tag.cores.primaria,
											color: tag.cores.primaria,
											backgroundColor: tag.cores.secundaria,
										}}
										className={cn("flex items-center gap-1 rounded px-2 py-0.5")}
									>
										<Tag width={10} height={10} />
										<h1 className="text-[0.5rem] font-bold tracking-tight">{tag.titulo}</h1>
									</div>
								))}
							</div>
						) : null}
					</div>
					<div className="flex w-full items-center justify-between gap-2" />
				</div>
			)}
		</Draggable>
	);
}
