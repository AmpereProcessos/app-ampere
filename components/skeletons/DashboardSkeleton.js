import React from 'react'

function DashboardSkeleton() {
  return (
    <div className="grow p-6">
      <div className="mb-3 flex items-center justify-center gap-2">
        <button className="h-[31px] w-[170px] animate-pulse bg-gray-200"></button>
        <button className="h-[31px] w-[170px] animate-pulse bg-gray-200"></button>
        <button className="h-[31px] w-[60px] animate-pulse bg-gray-200"></button>
      </div>
      <div className="grid w-full grid-cols-1 grid-rows-10 gap-y-2 lg:grid-cols-10 lg:grid-rows-1 lg:gap-x-3">
        <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="h-[24px] w-[226px] animate-pulse bg-gray-200"></h1>
          </div>
          <div className="flex grow items-center justify-center">
            <p className="h-[24px] w-[50px] animate-pulse bg-gray-200"></p>
          </div>
          <p className="h-[24px] w-[205px] animate-pulse bg-gray-200"></p>
        </div>
        <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="h-[24px] w-[226px] animate-pulse bg-gray-200"></h1>
          </div>
          <div className="flex grow items-center justify-center">
            <p className="h-[24px] w-[50px] animate-pulse bg-gray-200"></p>
          </div>
          <p className="h-[24px] w-[205px] animate-pulse bg-gray-200"></p>
        </div>
        <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="h-[24px] w-[226px] animate-pulse bg-gray-200"></h1>
          </div>
          <div className="flex grow items-center justify-center">
            <p className="h-[24px] w-[50px] animate-pulse bg-gray-200"></p>
          </div>
          <p className="h-[24px] w-[205px] animate-pulse bg-gray-200"></p>
        </div>
        <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="h-[24px] w-[226px] animate-pulse bg-gray-200"></h1>
          </div>
          <div className="flex grow items-center justify-center">
            <p className="h-[24px] w-[50px] animate-pulse bg-gray-200"></p>
          </div>
          <p className="h-[24px] w-[205px] animate-pulse bg-gray-200"></p>
        </div>
        <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="h-[24px] w-[226px] animate-pulse bg-gray-200"></h1>
          </div>
          <div className="flex grow items-center justify-center">
            <p className="h-[24px] w-[50px] animate-pulse bg-gray-200"></p>
          </div>
          <p className="h-[24px] w-[205px] animate-pulse bg-gray-200"></p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 grid-rows-2 gap-y-2 lg:grid-cols-10 lg:grid-rows-1 lg:gap-x-3">
        <div className="bg-background border-primary/20 col-span-2 flex h-[400px] flex-col border p-4 shadow-xl">
          <div className="h-[30px] w-[150px] animate-pulse bg-gray-200"></div>
          <div className="flex grow items-center justify-center">
            <div className="h-[150px] w-[150px] animate-pulse rounded-full bg-gray-200"></div>
          </div>
        </div>
        <div className="bg-background border-primary/20 col-span-8 flex h-[400px] flex-col border p-4 shadow-xl">
          <div className="grid grid-cols-2 py-2">
            <h1 className="h-[36px] w-[635x] animate-pulse bg-gray-200"></h1>
            <div className="flex items-center justify-center gap-x-2">
              <p className="h-[36px] w-[44px] animate-pulse bg-gray-200"> </p>
              <p className="h-[36px] w-[44px] animate-pulse bg-gray-200"> </p>
              <p className="h-[36px] w-[44px] animate-pulse bg-gray-200"> </p>
              <p className="h-[36px] w-[44px] animate-pulse bg-gray-200"> </p>
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
          <div className="h-[300px] w-full animate-pulse bg-gray-200"> </div>
        </div>
      </div>
      <div className="bg-background border-primary/20 mt-4 flex grow flex-col border p-4 shadow-xl">
        <div className="flex w-full items-center justify-between">
          <h1 className="h-[25px] w-[200px] animate-pulse bg-gray-200"> </h1>
          <button onClick={() => filterBirthday(!filters.birthdayToday)} className="h-[42px] w-[205px] animate-pulse bg-gray-200 p-2">
            {' '}
          </button>
        </div>
        <div className="mt-2 flex w-full grow flex-wrap justify-between gap-y-2">
          {[1, 2, 3, 4]?.map((item, index) => (
            <div key={index} className="bg-background border-primary/20 flex h-[60px] w-[350px] flex-col items-center border p-2 text-center text-xs">
              <p className="h-[20px] w-[50%] animate-pulse self-center bg-gray-200"> </p>
              <p className="mt-2 h-[20px] w-[50%] animate-pulse self-center bg-gray-200"> </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardSkeleton
