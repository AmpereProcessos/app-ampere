import React from "react";

function ComercialSkeleton() {
	return (
		<div className="grow p-6">
			<div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
				<div className="flex w-full items-center justify-between gap-2">
					<div className="flex flex-wrap items-center justify-center gap-2 font-['Roboto']">
						<p className="h-[72px] w-[290px] animate-pulse bg-gray-200 lg:h-[36px] lg:w-[440px]"></p>
						<p className="h-[24px] w-[38px] animate-pulse bg-gray-200"></p>
						<p className="h-[24px] w-[103px] animate-pulse bg-gray-200"></p>
						<p className="h-[24px] w-[143px] animate-pulse bg-gray-200"></p>
					</div>
					<p className="h-[25px] w-[25px] animate-pulse rounded-full bg-gray-200"></p>
				</div>
			</div>
			<div className="mt-4 flex flex-wrap justify-around gap-3">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((project, index) => (
					<div key={index} className="border-primary/20 h-[180px] w-full border md:w-[350px] lg:w-[450px]">
						<div className="h-[18px] w-full animate-pulse rounded-br-lg rounded-bl-lg bg-gray-200"></div>
						<div className="flex flex-col p-2">
							<div className="flex items-center justify-between pb-2">
								<p className="h-[18px] w-[155px] animate-pulse bg-gray-200"></p>
								<p className="h-[18px] w-[28px] animate-pulse bg-gray-200"></p>
							</div>
							<div className="flex items-center justify-between pb-2">
								<div className="flex flex-col gap-1">
									<span className="h-[12px] w-[70px] animate-pulse bg-gray-200 pb-1"></span>
									<p className="h-[18px] w-[156px] animate-pulse bg-gray-200"></p>
								</div>
								<div className="flex flex-col items-end gap-1">
									<span className="h-[12px] w-[70px] animate-pulse bg-gray-200 pb-1"></span>
									<p className="h-[18px] w-[156px] animate-pulse bg-gray-200"></p>
								</div>
							</div>
							<div className="flex items-center justify-between pb-2">
								<div className="flex flex-col gap-1">
									<span className="h-[12px] w-[70px] animate-pulse bg-gray-200 pb-1"></span>
									<p className="h-[18px] w-[156px] animate-pulse bg-gray-200"></p>
								</div>
								<div className="flex flex-col items-end gap-1">
									<span className="h-[12px] w-[70px] animate-pulse bg-gray-200 pb-1"></span>
									<p className="h-[18px] w-[156px] animate-pulse bg-gray-200"></p>
								</div>
							</div>
							<div className="flex items-center justify-center">
								<div className="flex flex-col items-center gap-1">
									<span className="h-[12px] w-[90px] animate-pulse bg-gray-200"></span>
									<p className="h-[18px] w-[70px] animate-pulse bg-gray-200"></p>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default ComercialSkeleton;
