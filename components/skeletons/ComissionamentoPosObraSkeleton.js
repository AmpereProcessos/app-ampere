import React from "react";

function ComissionamentoPosObraSkeleton() {
  return (
    <div className="p-6 grow flex flex-col">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
            <p className="w-[250px] h-[72px] xs:w-[370px] xs:h-[36px] bg-gray-200 animate-pulse"></p>
            <p className="w-[121] h-[18px] bg-gray-200 animate-pulse"></p>
          </div>
          <p className="w-[25px] h-[25px] rounded-full bg-gray-200 animate-pulse"></p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item, index) => (
          <div
            key={index}
            className={`grid grid-rows-6 grid-cols-1 lg:grid-cols-10 lg:grid-rows-1 border border-gray-200 p-2`}
          >
            <div className="flex flex-col justify-around row-span-1 col-span-1">
              <h1 className="w-[180px] h-[50px] bg-gray-200 animate-pulse"></h1>
              <div className="w-[184px] h-[32px] bg-gray-200 animate-pulse"></div>
            </div>
            <div className="col-span-9 flex flex-col row-span-5">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="flex flex-col items-center gap-1">
                  <p className="w-[121px] h-[18px] bg-gray-200 animate-pulse"></p>
                  <p className="w-[62px] h-[15px] bg-gray-200 animate-pulse"></p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="w-[121px] h-[18px] bg-gray-200 animate-pulse"></p>
                  <p className="w-[62px] h-[15px] bg-gray-200 animate-pulse"></p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="w-[121px] h-[18px] bg-gray-200 animate-pulse"></p>
                  <p className="w-[62px] h-[15px] bg-gray-200 animate-pulse"></p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 flex-wrap col-span-9">
                <div className="flex flex-col gap-1 w-[350px] items-center">
                  <div className="w-[150px] h-[20px] bg-gray-200 animate-pulse"></div>
                  <div className="w-[75px] h-[20px] bg-gray-200 animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-1 w-[350px] items-center">
                  <div className="w-[150px] h-[20px] bg-gray-200 animate-pulse"></div>
                  <div className="w-[75px] h-[20px] bg-gray-200 animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-1 w-[350px] items-center">
                  <div className="w-[150px] h-[20px] bg-gray-200 animate-pulse"></div>
                  <div className="w-[75px] h-[20px] bg-gray-200 animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-1 w-[350px] items-center">
                  <div className="w-[150px] h-[20px] bg-gray-200 animate-pulse"></div>
                  <div className="w-[75px] h-[20px] bg-gray-200 animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-1 w-[350px] items-center">
                  <div className="w-[150px] h-[20px] bg-gray-200 animate-pulse"></div>
                  <div className="w-[75px] h-[20px] bg-gray-200 animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-1 w-[350px] items-center">
                  <div className="w-[150px] h-[20px] bg-gray-200 animate-pulse"></div>
                  <div className="w-[75px] h-[20px] bg-gray-200 animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-1 w-[350px] items-center">
                  <div className="w-[150px] h-[20px] bg-gray-200 animate-pulse"></div>
                  <div className="w-[75px] h-[20px] bg-gray-200 animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-1 w-[350px] items-center">
                  <div className="w-[150px] h-[20px] bg-gray-200 animate-pulse"></div>
                  <div className="w-[75px] h-[20px] bg-gray-200 animate-pulse"></div>
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
