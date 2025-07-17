import React from "react";

function DashboardSkeleton() {
	return (
		<div className="p-6 grow">
			<div className="flex items-center justify-center gap-2 mb-3">
				<button className="w-[170px] h-[31px] bg-gray-200 animate-pulse"></button>
				<button className="w-[170px] h-[31px] bg-gray-200 animate-pulse"></button>
				<button className="w-[60px] h-[31px] bg-gray-200 animate-pulse"></button>
			</div>
			<div className="grid grid-rows-10 grid-cols-1 gap-y-2 lg:grid-cols-10 lg:grid-rows-1  lg:gap-x-3 w-full">
				<div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-300 bg-[#fff] shadow-xl">
					<div className="flex justify-between">
						<h1 className="w-[226px] h-[24px] bg-gray-200 animate-pulse"></h1>
					</div>
					<div className="grow flex items-center justify-center">
						<p className="w-[50px] h-[24px] bg-gray-200 animate-pulse"></p>
					</div>
					<p className="w-[205px] h-[24px] bg-gray-200 animate-pulse"></p>
				</div>
				<div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-300 bg-[#fff] shadow-xl">
					<div className="flex justify-between">
						<h1 className="w-[226px] h-[24px] bg-gray-200 animate-pulse"></h1>
					</div>
					<div className="grow flex items-center justify-center">
						<p className="w-[50px] h-[24px] bg-gray-200 animate-pulse"></p>
					</div>
					<p className="w-[205px] h-[24px] bg-gray-200 animate-pulse"></p>
				</div>
				<div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-300 bg-[#fff] shadow-xl">
					<div className="flex justify-between">
						<h1 className="w-[226px] h-[24px] bg-gray-200 animate-pulse"></h1>
					</div>
					<div className="grow flex items-center justify-center">
						<p className="w-[50px] h-[24px] bg-gray-200 animate-pulse"></p>
					</div>
					<p className="w-[205px] h-[24px] bg-gray-200 animate-pulse"></p>
				</div>
				<div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-300 bg-[#fff] shadow-xl">
					<div className="flex justify-between">
						<h1 className="w-[226px] h-[24px] bg-gray-200 animate-pulse"></h1>
					</div>
					<div className="grow flex items-center justify-center">
						<p className="w-[50px] h-[24px] bg-gray-200 animate-pulse"></p>
					</div>
					<p className="w-[205px] h-[24px] bg-gray-200 animate-pulse"></p>
				</div>
				<div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-300 bg-[#fff] shadow-xl">
					<div className="flex justify-between">
						<h1 className="w-[226px] h-[24px] bg-gray-200 animate-pulse"></h1>
					</div>
					<div className="grow flex items-center justify-center">
						<p className="w-[50px] h-[24px] bg-gray-200 animate-pulse"></p>
					</div>
					<p className="w-[205px] h-[24px] bg-gray-200 animate-pulse"></p>
				</div>
			</div>
			<div className="grid grid-rows-2 grid-cols-1 gap-y-2 mt-4 lg:grid-cols-10 lg:grid-rows-1 lg:gap-x-3">
				<div className="flex flex-col p-4 h-[400px] border border-gray-300 bg-[#fff] shadow-xl col-span-2">
					<div className="w-[150px] h-[30px] bg-gray-200 animate-pulse"></div>
					<div className="flex grow items-center justify-center">
						<div className="w-[150px] h-[150px] rounded-full bg-gray-200 animate-pulse"></div>
					</div>
				</div>
				<div className="flex flex-col p-4 h-[400px] border border-gray-300 bg-[#fff] shadow-xl col-span-8">
					<div className="grid grid-cols-2 py-2">
						<h1 className="bg-gray-200 animate-pulse w-[635x] h-[36px]"></h1>
						<div className="flex items-center gap-x-2 justify-center">
							<p className="bg-gray-200 animate-pulse w-[44px] h-[36px]"> </p>
							<p className="bg-gray-200 animate-pulse w-[44px] h-[36px]"> </p>
							<p className="bg-gray-200 animate-pulse w-[44px] h-[36px]"> </p>
							<p className="bg-gray-200 animate-pulse w-[44px] h-[36px]"> </p>
						</div>
					</div>
					{/* <AreaChart
                width={550}
                height={300}
                data={statsData.graphData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15599a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#15599a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  dataKey={"Total"}
                  domain={[0, statsData.maxGraphValue]}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Total"
                  strokeWidth={"1"}
                  stroke="#15599a"
                  fillOpacity={1}
                  fill="#15599a"
                />
              </AreaChart> */}
					<div className="w-full h-[300px] bg-gray-200 animate-pulse"> </div>
				</div>
			</div>
			<div className="flex mt-4 grow flex-col p-4  border border-gray-300 bg-[#fff] shadow-xl">
				<div className="flex w-full items-center justify-between">
					<h1 className="bg-gray-200 animate-pulse w-[200px] h-[25px]"> </h1>
					<button onClick={() => filterBirthday(!filters.birthdayToday)} className="p-2 w-[205px] h-[42px] bg-gray-200 animate-pulse">
						{" "}
					</button>
				</div>
				<div className="w-full grow flex flex-wrap justify-between gap-y-2 mt-2">
					{[1, 2, 3, 4]?.map((item, index) => (
						<div key={index} className="flex flex-col items-center w-[350px] h-[60px] text-xs text-center bg-[#fff] border border-gray-300 p-2">
							<p className="bg-gray-200 animate-pulse w-[50%] h-[20px] self-center"> </p>
							<p className="bg-gray-200 animate-pulse w-[50%] h-[20px] mt-2 self-center"> </p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default DashboardSkeleton;
