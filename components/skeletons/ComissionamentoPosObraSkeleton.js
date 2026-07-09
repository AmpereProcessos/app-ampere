import React from "react";

function ComissionamentoPosObraSkeleton() {
  return (
    <div className="flex grow flex-col p-6">
      <div className="border-border flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2 font-['Roboto']">
            <p className="xs:w-[370px] xs:h-[36px] h-[72px] w-[250px] animate-pulse bg-gray-200"></p>
            <p className="h-[18px] w-[121] animate-pulse bg-gray-200"></p>
          </div>
          <p className="h-[25px] w-[25px] animate-pulse rounded-full bg-gray-200"></p>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item, index) => (
          <div
            key={index}
            className={`border-border grid grid-cols-1 grid-rows-6 border p-2 lg:grid-cols-10 lg:grid-rows-1`}
          >
            <div className="col-span-1 row-span-1 flex flex-col justify-around">
              <h1 className="h-[50px] w-[180px] animate-pulse bg-gray-200"></h1>
              <div className="h-[32px] w-[184px] animate-pulse bg-gray-200"></div>
            </div>
            <div className="col-span-9 row-span-5 flex flex-col">
              <div className="mb-2 flex items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <p className="h-[18px] w-[121px] animate-pulse bg-gray-200"></p>
                  <p className="h-[15px] w-[62px] animate-pulse bg-gray-200"></p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="h-[18px] w-[121px] animate-pulse bg-gray-200"></p>
                  <p className="h-[15px] w-[62px] animate-pulse bg-gray-200"></p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="h-[18px] w-[121px] animate-pulse bg-gray-200"></p>
                  <p className="h-[15px] w-[62px] animate-pulse bg-gray-200"></p>
                </div>
              </div>

              <div className="col-span-9 flex flex-wrap items-center justify-center gap-1">
                <div className="flex w-[350px] flex-col items-center gap-1">
                  <div className="h-[20px] w-[150px] animate-pulse bg-gray-200"></div>
                  <div className="h-[20px] w-[75px] animate-pulse bg-gray-200"></div>
                </div>
                <div className="flex w-[350px] flex-col items-center gap-1">
                  <div className="h-[20px] w-[150px] animate-pulse bg-gray-200"></div>
                  <div className="h-[20px] w-[75px] animate-pulse bg-gray-200"></div>
                </div>
                <div className="flex w-[350px] flex-col items-center gap-1">
                  <div className="h-[20px] w-[150px] animate-pulse bg-gray-200"></div>
                  <div className="h-[20px] w-[75px] animate-pulse bg-gray-200"></div>
                </div>
                <div className="flex w-[350px] flex-col items-center gap-1">
                  <div className="h-[20px] w-[150px] animate-pulse bg-gray-200"></div>
                  <div className="h-[20px] w-[75px] animate-pulse bg-gray-200"></div>
                </div>
                <div className="flex w-[350px] flex-col items-center gap-1">
                  <div className="h-[20px] w-[150px] animate-pulse bg-gray-200"></div>
                  <div className="h-[20px] w-[75px] animate-pulse bg-gray-200"></div>
                </div>
                <div className="flex w-[350px] flex-col items-center gap-1">
                  <div className="h-[20px] w-[150px] animate-pulse bg-gray-200"></div>
                  <div className="h-[20px] w-[75px] animate-pulse bg-gray-200"></div>
                </div>
                <div className="flex w-[350px] flex-col items-center gap-1">
                  <div className="h-[20px] w-[150px] animate-pulse bg-gray-200"></div>
                  <div className="h-[20px] w-[75px] animate-pulse bg-gray-200"></div>
                </div>
                <div className="flex w-[350px] flex-col items-center gap-1">
                  <div className="h-[20px] w-[150px] animate-pulse bg-gray-200"></div>
                  <div className="h-[20px] w-[75px] animate-pulse bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComissionamentoPosObraSkeleton;
