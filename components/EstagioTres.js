import React from "react";

const phoneMask = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
};
function EstagioTres({ infoHolder, setInfoHolder }) {
  return (
    <div className="flex flex-col h-[600px] w-full">
      <div className="w-full flex-1 gap-3 flex flex-col justify-center items-center flex-grow self-stretch font-normal text-[rgba(79,88,96,1)] h-[500px]">
        <div className="gap-1 flex flex-col justify-center items-center text-left w-[350px]">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] lg:w-[350px] text-[15px] leading-[1.2]">
                Seu nome
              </p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <input
              value={infoHolder.nome}
              onChange={(e) =>
                setInfoHolder({
                  ...infoHolder,
                  nome: e.target.value.toUpperCase(),
                })
              }
              type={"text"}
              className="flex-1 bg-white outline-none rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]"
            />
          </div>
        </div>
        <div className="gap-1 flex flex-col justify-center items-center text-left w-full">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] lg:w-[350px] text-[15px] leading-[1.2]">
                Seu melhor e-mail
              </p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <input
              type={"text"}
              value={infoHolder.email}
              onChange={(e) =>
                setInfoHolder({ ...infoHolder, email: e.target.value })
              }
              className="flex-1 bg-white outline-none rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]"
            />
          </div>
        </div>
        <div className="gap-1 flex flex-col justify-center items-center text-left w-full">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] lg:w-[350px] text-[15px] leading-[1.2]">
                Telefone
              </p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <input
              value={infoHolder.telefone}
              onChange={(e) =>
                setInfoHolder({
                  ...infoHolder,
                  telefone: phoneMask(e.target.value),
                })
              }
              type={"text"}
              className="flex-1 bg-white outline-none rounded-lg p-2 text-center self-center h-[47px] w-[300px] lg:w-[350px]"
            />
          </div>
        </div>
        <div className="gap-1 text-center w-[350px]">
          <div className="px-6 w-full h-10 flex flex-col justify-center items-center self-stretch">
            <p className="w-full text-xs m-0 leading-[1.2]">
              Fique tranquilo. Pedimos essas informações para desenvolver uma
              simulação mais exata para você!
            </p>
          </div>
        </div>
      </div>
      <div className="w-full gap-4 flex flex-col justify-center items-center self-stretch text-white text-center font-black h-[100px]">
        <div className="w-full">
          <div className="flex-1 flex flex-col justify-center items-center flex-grow rounded-lg p-3 bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] hover:scale-[1.02] duration-300">
            <p className="w-full m-0 text-[19px] leading-[1.2]">
              Visualizar simulação
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EstagioTres;
