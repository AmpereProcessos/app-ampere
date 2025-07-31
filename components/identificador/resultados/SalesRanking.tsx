import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { useSalesRanking } from "@/utils/methods/query/stats";
import { FaRankingStar } from "react-icons/fa6";

function SalesRanking() {
	const { data, isLoading, isSuccess, isError, error, queryParams, updateQueryParams } = useSalesRanking({});

	const PERIOD_NAMING_MAP = {
		"current-month": "RANKING DO MÊS",
		"current-semester": "RANKING DO SEMESTRE",
		"current-year": "RANKING DO ANO",
	};
	return (
		<div className="flex w-full flex-col gap-2 border border-gray-300 bg-[#fff] p-4 shadow-xl">
			<div className="flex w-full items-center justify-center gap-2">
				<FaRankingStar />
				<h1 className="text-base font-bold uppercase">{PERIOD_NAMING_MAP[queryParams.type]}</h1>
			</div>
			<div className="flex w-full justify-center gap-2">
				<div className="flex w-full items-center justify-center lg:w-[70%]">
					<div className="flex w-full items-center justify-center">
						<div className="mb-2 flex w-full flex-col items-center">
							<div className="flex h-fit w-full items-end justify-center gap-4 p-0 lg:h-[425px] lg:w-[1200px] lg:gap-10 lg:p-6">
								<div className="hidden h-full w-1/5 flex-col justify-end lg:flex">
									<div className="w-full flex items-center gap-2 justify-center flex-col">
										<Avatar className="w-10 h-10 min-w-10 min-h-10">
											<AvatarImage src={data?.fourth?.avatar} alt={data?.fourth?.name} />
											<AvatarFallback>{data?.fourth?.name ? formatNameAsInitials(data?.fourth?.name) : "NA"}</AvatarFallback>
										</Avatar>
										<h1 className="text-center text-sm font-bold text-gray-500">{data?.fourth?.name}</h1>
									</div>

									<div className="flex h-[30%] w-full items-center justify-center bg-gray-500 text-3xl font-bold text-white">4º</div>
								</div>
								<div className="flex h-full w-1/3 flex-col justify-end lg:w-1/5 gap-2">
									<div className="w-full flex items-center gap-2 justify-center flex-col">
										<Avatar className="w-10 h-10 min-w-10 min-h-10">
											<AvatarImage src={data?.second?.avatar} alt={data?.second?.name} />
											<AvatarFallback>{data?.second?.name ? formatNameAsInitials(data?.second?.name) : "NA"}</AvatarFallback>
										</Avatar>
										<h1 className="text-center text-xs font-bold text-gray-500 lg:text-sm">{data?.second?.name}</h1>
									</div>

									<div className="flex h-[60%] w-full items-center justify-center bg-[#15599a] text-3xl font-bold text-white">2º</div>
								</div>
								<div className="flex h-full w-1/3 flex-col justify-end lg:w-1/5 gap-2">
									<div className="w-full flex items-center gap-2 justify-center flex-col">
										<Avatar className="w-10 h-10 min-w-10 min-h-10">
											<AvatarImage src={data?.first?.avatar} alt={data?.first?.name} />
											<AvatarFallback>{data?.first?.name ? formatNameAsInitials(data?.first?.name) : "NA"}</AvatarFallback>
										</Avatar>
										<h1 className="text-center text-xs font-bold text-gray-500 lg:text-sm">{data?.first?.name}</h1>
									</div>

									<div className="flex w-full grow items-center justify-center bg-[#fead41] text-3xl font-bold text-white">1º</div>
								</div>
								<div className="flex h-full w-1/3 flex-col justify-end lg:w-1/5 gap-2">
									<div className="w-full flex items-center gap-2 justify-center flex-col">
										<Avatar className="w-10 h-10 min-w-10 min-h-10">
											<AvatarImage src={data?.third?.avatar} alt={data?.third?.name} />
											<AvatarFallback>{data?.third?.name ? formatNameAsInitials(data?.third?.name) : "NA"}</AvatarFallback>
										</Avatar>
										<h1 className="text-center text-xs font-bold text-gray-500 lg:text-sm">{data?.third?.name}</h1>
									</div>

									<div className="flex h-[40%] w-full items-center justify-center bg-[#15599a] text-3xl font-bold text-white">3º</div>
								</div>
								<div className="hidden h-full w-1/5 flex-col justify-end lg:flex">
									<div className="w-full flex items-center gap-2 justify-center flex-col">
										<Avatar className="w-10 h-10 min-w-10 min-h-10">
											<AvatarImage src={data?.fifth?.avatar} alt={data?.fifth?.name} />
											<AvatarFallback>{data?.fifth?.name ? formatNameAsInitials(data?.fifth?.name) : "NA"}</AvatarFallback>
										</Avatar>
										<h1 className="text-center text-sm font-bold text-gray-500">{data?.fifth?.name}</h1>
									</div>

									<div className="flex h-[15%] w-full items-center justify-center bg-gray-500 text-3xl font-bold text-white">5º</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-wrap items-center justify-end gap-2">
				<h1 className="text-sm font-bold uppercase text-gray-500">OUTROS</h1>
				<div className="flex flex-wrap items-center justify-end gap-2 overflow-hidden">
					{data?.others
						.sort((a, b) => a.index - b.index)
						.map((item, index) => (
							<Avatar key={`${item.name}-${index}`} className="w-8 h-8 min-w-8 min-h-8">
								<AvatarImage src={item.avatar} alt={item.name} />
								<AvatarFallback>{item.name ? formatNameAsInitials(item.name) : "NA"}</AvatarFallback>
							</Avatar>
						))}
				</div>
			</div>
		</div>
	);
}

export default SalesRanking;
