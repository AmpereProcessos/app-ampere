import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import EstagioDois from "../../../components/EstagioDois";
import EstagioTres from "../../../components/EstagioTres";
import EstagioUm from "../../../components/EstagioUm";
import Logo from "../../../utils/logoBranco.png";
import LogoSemTexto from "../../../utils/logoBrancoSemTexto.png";
import estadosCidades from "../../../utils/estados_cidades.json";
import Head from "next/head";
import * as fbq from "../../../utils/fpixel";
import FacebookPixel from "../../../components/Head/facebook/pixel-1";
function Calculadora() {
  const [estagio, setEstagio] = useState(1);
  const [infoHolder, setInfoHolder] = useState({
    valorFatura: null,
    uf: null,
    cidade: null,
    nome: "",
    email: "",
    telefone: "",
  });
  console.log(infoHolder);
  return (
    <>
      <FacebookPixel />

      <div
        className={`bg-white inline-flex flex-col h-full items-start overflow-clip font-['Raleway']`}
      >
        <div className="w-full flex justify-center items-center self-stretch h-[82px] bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
          <div className="w-11 h-[46px]">
            <div className="w-11">
              <Image src={LogoSemTexto} />
            </div>
          </div>
        </div>
        <div className="px-3 w-full flex flex-col grow justify-center items-center self-stretch pt-[18px] pb-[12px] gap-[18px]">
          <div className="px-6 py-1 w-full flex flex-col justify-center items-center self-stretch rounded-lg lg:h-full drop-shadow-lg bg-[rgba(245,245,245,1)]">
            <div className="w-full text-white text-center h-[100px]">
              <div className="w-full flex-1 flex justify-center items-center flex-grow self-stretch">
                <div className="relative w-[300px] lg:w-[350px] h-[30.05px]">
                  {estagio > 1 ? (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute w-[150px] left-[3.38%] right-[50.23%] top-[42.5%] bottom-[45%] bg-[rgba(21,89,154,1)]"
                    />
                  ) : (
                    <div className="absolute w-[150px] left-[3.38%] right-[50.23%] top-[42.5%] bottom-[45%] bg-[rgba(79,88,96,1)]" />
                  )}
                  {estagio > 2 ? (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute w-[150px] left-1/2 right-[50.23%] top-[42.5%] bottom-[45%] bg-[rgba(21,89,154,1)]"
                    />
                  ) : (
                    <div className="left-1/2 absolute w-[150px] right-[3.6%] top-[42.5%] bottom-[45%] bg-[rgba(79,88,96,1)]" />
                  )}
                  <div className="inset-y-0 absolute left-0 font-black w-[30px] right-[90.99%]">
                    <div className="inset-0 absolute rounded-full w-[30px] bg-[rgba(21,89,154,1)]" />
                    <p className="inset-x-0 absolute inline m-0 top-[20%] bottom-[20%] h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">
                      1
                    </p>
                  </div>
                  <div
                    className={`${
                      estagio > 1 ? "font-black" : ""
                    } inset-y-0 absolute font-normal left-[45.5%] right-[45.5%] w-[30px]`}
                  >
                    {estagio > 1 ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="inset-0 absolute rounded-full w-[30px] bg-[rgba(21,89,154,1)]"
                        />
                        <p className="inset-x-0 absolute inline m-0 top-[20%] bottom-[20%] h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">
                          2
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="inset-0 absolute rounded-full w-[30px] bg-[rgba(79,88,96,1)]" />
                        <p className="inset-x-0 absolute inline m-0 top-[20%] bottom-[20%] h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">
                          2
                        </p>
                      </>
                    )}
                  </div>
                  <div
                    className={`${
                      estagio > 2 ? "font-black" : ""
                    } inset-y-0 absolute right-0 font-normal w-[30px] left-[90.99%]`}
                  >
                    {estagio > 2 ? (
                      <>
                        <div className="inset-0 absolute rounded-full w-[30px] bg-[rgba(21,89,154,1)]" />
                        <p className="inset-x-0 absolute inline m-0 top-[20%] bottom-[20%] h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">
                          3
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="inset-0 absolute rounded-full w-[30px] bg-[rgba(79,88,96,1)]" />
                        <p className="inset-x-0 absolute inline m-0 top-[20%] bottom-[20%] h-[18.03px] w-[30.05px] text-[15px] leading-[1.2]">
                          3
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <form>
              {estagio == 1 && (
                <EstagioUm
                  infoHolder={infoHolder}
                  setInfoHolder={setInfoHolder}
                  next={() => setEstagio((prev) => prev + 1)}
                />
              )}
              {estagio == 2 && (
                <EstagioDois
                  infoHolder={infoHolder}
                  setInfoHolder={setInfoHolder}
                  previous={() => setEstagio((prev) => prev - 1)}
                  next={() => setEstagio((prev) => prev + 1)}
                />
              )}
              {estagio == 3 && (
                <EstagioTres
                  infoHolder={infoHolder}
                  setInfoHolder={setInfoHolder}
                />
              )}
            </form>
          </div>
        </div>
        <div className="flex justify-center gap-3 px-10 w-full h-[100px] bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
          <div className="flex flex-col justify-center items-center w-[80px]">
            <Image src={Logo} />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="w-full leading-none relative">
              <p className="font-normal text-white inline m-0 text-[15px] leading-[1.2]">
                A energia que move o mundo
              </p>
              <p className="text-xs font-normal text-white inline m-0 leading-[1.2]">
                {" "}
              </p>
              <p className="font-black inline m-0 text-[15px] leading-[1.2] text-[rgba(254,173,65,1)]">
                vem de você
              </p>
              <p className="text-xs font-normal text-white inline m-0 leading-[1.2]">
                !
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calculadora;
