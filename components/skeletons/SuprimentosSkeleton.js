import React from "react";

function SuprimentosSkeleton() {
  return (
    <div className="p-6 grow">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex flex-col lg:flex-row items-center gap-2 font-['Roboto']">
            <p className="w-[290px] lg:w-[440px] h-[72px] lg:h-[36px] bg-gray-200 animate-pulse"></p>
            <p className="w-[38px] h-[24px] bg-gray-200 animate-pulse"></p>
            <p className="w-[103px] h-[24px] bg-gray-200 animate-pulse"></p>
          </div>
          <p className="w-[25px] h-[25px] rounded-full bg-gray-200 animate-pulse"></p>
        </div>
      </div>
      <div className="flex  justify-around gap-3 mt-4 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((project, index) => (
          <div
            key={index}
            className="w-full md:w-[350px] lg:w-[450px] h-[220px]  border border-gray-200"
          >
            <div className="w-full h-[18px] bg-gray-200 animate-pulse rounded-br-lg rounded-bl-lg"></div>
            <div className="flex flex-col p-2">
              <div className="flex items-center justify-between pb-2">
                <p className="w-[155px] h-[18px] bg-gray-200 animate-pulse"></p>
                <p className="w-[28px] h-[18px] bg-gray-200 animate-pulse"></p>
              </div>
              <div className="flex items-center justify-between pb-2">
                <div className="flex flex-col gap-1">
                  <span className="w-[70px] h-[12px] bg-gray-200 animate-pulse pb-1"></span>
                  <p className="w-[156px] h-[18px] bg-gray-200 animate-pulse"></p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="w-[70px] h-[12px] bg-gray-200 animate-pulse pb-1"></span>
                  <p className="w-[156px] h-[18px] bg-gray-200 animate-pulse"></p>
                </div>
              </div>
              <div className="flex items-center justify-between pb-2">
                <div className="flex flex-col gap-1">
                  <span className="w-[70px] h-[12px] bg-gray-200 animate-pulse pb-1"></span>
                  <p className="w-[80px] h-[18px] bg-gray-200 animate-pulse"></p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="w-[70px] h-[12px] bg-gray-200 animate-pulse pb-1"></span>
                  <p className="w-[80px] h-[18px] bg-gray-200 animate-pulse"></p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="w-[70px] h-[12px] bg-gray-200 animate-pulse pb-1"></span>
                  <p className="w-[80px] h-[18px] bg-gray-200 animate-pulse"></p>
                </div>
              </div>
              <div className="flex items-center justify-center pb-1">
                <div className="flex flex-col items-center gap-1 ">
                  <span className="w-[90px] h-[12px] bg-gray-200 animate-pulse"></span>
                  <p className="w-[70px] h-[18px] bg-gray-200 animate-pulse"></p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center gap-1 ">
                  <span className="w-[110px] h-[12px] bg-gray-200 animate-pulse"></span>
                  <p className="w-[70px] h-[18px] bg-gray-200 animate-pulse"></p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuprimentosSkeleton;
