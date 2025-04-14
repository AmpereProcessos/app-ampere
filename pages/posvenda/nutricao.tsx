import LoadingComponent from "@/components/utils/LoadingComponent";
import { useSession } from "next-auth/react";

function MainNutritionPage() {
	const { data: session, status } = useSession();

	if (status !== "authenticated") return <LoadingComponent />;

	return (
		<div className="grow p-6 flex flex-col w-full">
			<div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS PARA NUTRIÇÃO</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MainNutritionPage;
