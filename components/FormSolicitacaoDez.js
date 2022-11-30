import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../utils/firebase";
import { AiOutlineCheck } from "react-icons/ai";
import Image from "next/image";
function FormSolicitacaoDez({ dados, setDados, voltar, avancar }) {
  const [images, setImages] = useState({
    documentoComFoto: null,
  });
  const [checks, setChecks] = useState({
    contaDeEnergiaCheck: false,
    propostaComercialCheck: false,
    carCheck: false,
    matriculaCheck: false,
    comprovanteEnderecoCorrespondenteCheck: false,
    iptuCheck: false,
    documentoComFotoCheck: false,
    contratoSocialCheck: false,
    cartaoCnpjCheck: false,
    comprovanteEnderecoRepresentanteCheck: false,
    documentoComFotoSociosCheck: false,
    relacaoDeCargasCheck: false,
    allChecked: false,
  });
  const [imagesMsg, setImagesMsg] = useState({
    text: "",
    color: "",
  });
  function validateDocuments() {
    if (!images.contaDeEnergia) {
      setImagesMsg({
        text: "Por favor, adicione uma foto da conta de energia",
        color: "text-red-500",
      });
      return false;
    }
    if (!images.propostaComercial) {
      setImagesMsg({
        text: "Por favor, adicione uma foto da proposta comercial",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.tipoDaInstalacao == "RURAL") {
      if (!images.car) {
        setImagesMsg({
          text: "Por favor, adicione uma foto ou PDF do CAR",
          color: "text-red-500",
        });
        return false;
      }
      if (!images.matricula) {
        setImagesMsg({
          text: "Por favor, adicione uma foto da matrícula da inscrição rural",
          color: "text-red-500",
        });
        return false;
      }
      if (!images.comprovanteEnderecoCorrespondente) {
        setImagesMsg({
          text: "Por favor,adicione uma foto do endereço de correspondência",
          color: "text-red-500",
        });
        return false;
      }
    }
    if (dados.tipoDaInstalacao == "URBANO") {
      if (!images.iptu) {
        setImagesMsg({
          text: "Por favor, adicione uma foto ou PDF do IPTU",
          color: "text-red-500",
        });
        return false;
      }
    }
    if (dados.tipoDoTitular == "PESSOA FISICA") {
      if (!images.documentoComFoto) {
        setImagesMsg({
          text: "Por favor, adicione uma foto do documento com foto",
          color: "text-red-500",
        });
        return false;
      }
    }
    if (dados.tipoDoTitular == "PESSOA JURIDICA") {
      if (!images.contratoSocial) {
        setImagesMsg({
          text: "Por favor, adicione uma foto ou PDF do contrato social",
          color: "text-red-500",
        });
        return false;
      }
      if (!images.cartaoCnpj) {
        setImagesMsg({
          text: "Por favor, adicione uma foto ou PDF do cartão CNPJ",
          color: "text-red-500",
        });
        return false;
      }
      if (!images.comprovanteEnderecoRepresentante) {
        setImagesMsg({
          text: "Por favor, adicione uma foto ou PDF do comprovante de endereço do representante legal",
          color: "text-red-500",
        });
        return false;
      }
      if (!images.documentoComFotoSocios) {
        setImagesMsg({
          text: "Por favor, adicione uma foto ou PDF do documento com foto dos sócios",
          color: "text-red-500",
        });
        return false;
      }
    }
    if (dados.aumentoDeCarga == "SIM" || dados.tipoDaLigacao == "NOVA") {
      if (!images.relacaoDeCargas) {
        setImagesMsg({
          text: "Por favor, adicione uma foto ou PDF da relação de cargas",
          color: "text-red-500",
        });
        return false;
      }
    }
    /*if (dados.possuiDistribuicao == "SIM") {
      if (!images.faturasRecebedoras) {
        setImagesMsg({
          text: "Por favor, preencha a conferência das faturas das recebedoras",
          color: "text-red-500",
        });
        return false;
      }
    }*/
    setImagesMsg({ text: "", color: "" });
    return true;
  }
  async function uploadImage() {
    if (validateDocuments()) {
      var links = [];
      var holder;
      setImagesMsg({
        text: "Processando...",
        color: "text-[#15599a]",
      });
      try {
        if (images.contaDeEnergia) {
          var imageRef = ref(
            storage,
            `formSolicitacao/${dados.nomeDoContrato}/contaDeEnergia${(
              Math.random() * 10000
            ).toFixed(0)}`
          );
          let res = await uploadBytes(imageRef, images.contaDeEnergia);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({ title: "CONTA DE ENERGIA", link: url });
        }
        if (images.propostaComercial) {
          var imageRef = ref(
            storage,
            `formSolicitacao/${dados.nomeDoContrato}/propostaComercial${(
              Math.random() * 10000
            ).toFixed(0)}`
          );
          let res = await uploadBytes(imageRef, images.propostaComercial);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({ title: "PROPOSTA COMERCIAL", link: url });
        }
        if (dados.tipoDaInstalacao == "RURAL") {
          if (images.car) {
            var imageRef = ref(
              storage,
              `formSolicitacao/${dados.nomeDoContrato}/car${(
                Math.random() * 10000
              ).toFixed(0)}`
            );
            let res = await uploadBytes(imageRef, images.car);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({ title: "CAR", link: url });
          }
          if (images.matricula) {
            var imageRef = ref(
              storage,
              `formSolicitacao/${dados.nomeDoContrato}/matricula${(
                Math.random() * 10000
              ).toFixed(0)}`
            );
            let res = await uploadBytes(imageRef, images.matricula);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({ title: "MATRÍCULA", link: url });
          }
          if (images.comprovanteEnderecoCorrespondente) {
            var imageRef = ref(
              storage,
              `formSolicitacao/${
                dados.nomeDoContrato
              }/comprovanteEnderecoCorrespondente${(
                Math.random() * 10000
              ).toFixed(0)}`
            );
            let res = await uploadBytes(
              imageRef,
              images.comprovanteEnderecoCorrespondente
            );
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: "COMPROVANTE DE ENDEREÇO - CORRESPONDÊNCIA",
              link: url,
            });
          }
        }
        if (dados.tipoDaInstalacao == "URBANO") {
          if (images.iptu) {
            var imageRef = ref(
              storage,
              `formSolicitacao/${dados.nomeDoContrato}/iptu${(
                Math.random() * 10000
              ).toFixed(0)}`
            );
            let res = await uploadBytes(imageRef, images.iptu);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({ title: "IPTU", link: url });
          }
        }
        if (dados.tipoDoTitular == "PESSOA FISICA") {
          if (images.documentoComFoto) {
            var imageRef = ref(
              storage,
              `formSolicitacao/${dados.nomeDoContrato}/documentoComFoto${(
                Math.random() * 10000
              ).toFixed(0)}`
            );
            let res = await uploadBytes(imageRef, images.documentoComFoto);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({ title: "DOCUMENTO COM FOTO", link: url });
          }
        }
        if (dados.tipoDoTitular == "PESSOA JURIDICA") {
          if (images.contratoSocial) {
            var imageRef = ref(
              storage,
              `formSolicitacao/${dados.nomeDoContrato}/contratoSocial${(
                Math.random() * 10000
              ).toFixed(0)}`
            );
            let res = await uploadBytes(imageRef, images.contratoSocial);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({ title: "CONTRATO SOCIAL", link: url });
          }
          if (images.cartaoCnpj) {
            var imageRef = ref(
              storage,
              `formSolicitacao/${dados.nomeDoContrato}/cartaoCnpj${(
                Math.random() * 10000
              ).toFixed(0)}`
            );
            let res = await uploadBytes(imageRef, images.cartaoCnpj);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({ title: "CARTÃO CNPJ", link: url });
          }
          if (images.comprovanteEnderecoRepresentante) {
            var imageRef = ref(
              storage,
              `formSolicitacao/${
                dados.nomeDoContrato
              }/comprovanteEnderecoRepresentante${(
                Math.random() * 10000
              ).toFixed(0)}`
            );
            let res = await uploadBytes(
              imageRef,
              images.comprovanteEnderecoRepresentante
            );
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: "COMPROVANTE DE ENDEREÇO - REPRESENTANTE",
              link: url,
            });
          }
          if (images.documentoComFotoSocios) {
            var imageRef = ref(
              storage,
              `formSolicitacao/${dados.nomeDoContrato}/documentoComFotoSocios${(
                Math.random() * 10000
              ).toFixed(0)}`
            );
            let res = await uploadBytes(
              imageRef,
              images.documentoComFotoSocios
            );
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: "DOCUMENTO COM FOTO DOS SÓCIOS",
              link: url,
            });
          }
        }
        if (dados.aumentoDeCarga == "SIM" || dados.tipoDaLigacao == "NOVA") {
          if (images.relacaoDeCargas) {
            var imageRef = ref(
              storage,
              `formSolicitacao/${dados.nomeDoContrato}/relacaoDeCargas${(
                Math.random() * 10000
              ).toFixed(0)}`
            );
            let res = await uploadBytes(imageRef, images.relacaoDeCargas);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: "RELAÇÃO DE CARGAS",
              link: url,
            });
          }
        }
        if (dados.possuiDistribuicao == "SIM") {
          for (let i = 0; i < dados.distribuicoes.length; i++) {
            var imageRef = ref(
              storage,
              `formSolicitacao/${dados.nomeDoContrato}/recebedora${i + 1}${(
                Math.random() * 10000
              ).toFixed(0)}`
            );
            let res = await uploadBytes(imageRef, images[`recebedora${i + 1}`]);
            let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
            links.push({
              title: `RECEBEDORA ${i + 1}`,
              link: url,
            });
          }
        }
      } catch (error) {}
      if (holder === undefined) {
        setChecks({ ...checks, allChecked: true });
        setDados({ ...dados, links: links });
        setImagesMsg({ text: "Imagens enviadas!", color: "text-green-500" });
      }
    }
    /*
    if (images.contaDeEnergia == null) return;
    const imageRef = ref(storage, `formSolicitacao/${dados.nomeDoContrato}/${v4()}`);
    uploadBytes(imageRef, images.contaDeEnergia)
      .then((res) => {
        console.log(res);
        setImagesMsg({
          text: "Imagens enviadas!",
          color: "text-green-500",
        });
        getDownloadURL(ref(storage, res.metadata.fullPath)).then((url) =>
          console.log(url)
        );
      })
      .catch((err) =>
        setImagesMsg({
          text: "Um erro ocorreu, por favor tente novamente.",
          color: "text-red-500",
        })
      );*/
  }
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        DOCUMENTAÇÃO
      </span>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex gap-2 justify-around flex-wrap mt-2">
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="contaDeEnergia"
            >
              CONTA DE ENERGIA
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.contaDeEnergia ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.contaDeEnergia.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      Adicione o arquivo aqui...
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    contaDeEnergia: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
            <div className="flex items-center justify-center mt-1 h-[25px]">
              {checks.contaDeEnergiaCheck && (
                <AiOutlineCheck
                  style={{ color: "#49be25", fontSize: "18px" }}
                />
              )}
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label
              className="ml-2 text-center text-[#15599a] font-bold"
              htmlFor="propostaComercial"
            >
              PROPOSTA COMERCIAL ATUALIZADA
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.propostaComercial ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.propostaComercial.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      Adicione o arquivo aqui
                    </span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    propostaComercial: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
            <div className="flex items-center justify-center mt-1 h-[25px]">
              {checks.propostaComercialCheck && (
                <AiOutlineCheck
                  style={{ color: "#49be25", fontSize: "18px" }}
                />
              )}
            </div>
          </div>
          {dados.tipoDaInstalacao == "RURAL" && (
            <>
              <div className="w-fit flex flex-col items-center">
                <label
                  className="ml-2 text-center text-[#15599a] font-bold"
                  htmlFor="propostaComercial"
                >
                  CAR
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.car ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.car.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal">
                          Adicione o arquivo aqui
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setImages({
                        ...images,
                        car: e.target.files[0],
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
                <div className="flex items-center justify-center mt-1 h-[25px]">
                  {checks.carCheck && (
                    <AiOutlineCheck
                      style={{ color: "#49be25", fontSize: "18px" }}
                    />
                  )}
                </div>
              </div>
              <div className="w-fit flex flex-col items-center">
                <label
                  className="ml-2 text-center text-[#15599a] font-bold"
                  htmlFor="propostaComercial"
                >
                  MATRÍCULA
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.matricula ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.matricula.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal">
                          Adicione o arquivo aqui
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setImages({
                        ...images,
                        matricula: e.target.files[0],
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
                <div className="flex items-center justify-center mt-1 h-[25px]">
                  {checks.matriculaCheck && (
                    <AiOutlineCheck
                      style={{ color: "#49be25", fontSize: "18px" }}
                    />
                  )}
                </div>
              </div>
              <div className="w-fit flex flex-col items-center">
                <label
                  className="ml-2 text-center text-[#15599a] font-bold"
                  htmlFor="propostaComercial"
                >
                  COMPROVANTE DE ENDEREÇO CORRESPONDENTE
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.comprovanteEnderecoCorrespondente ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.comprovanteEnderecoCorrespondente.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal">
                          Adicione o arquivo aqui
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setImages({
                        ...images,
                        comprovanteEnderecoCorrespondente: e.target.files[0],
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
                <div className="flex items-center justify-center mt-1 h-[25px]">
                  {checks.comprovanteEnderecoCorrespondenteCheck && (
                    <AiOutlineCheck
                      style={{ color: "#49be25", fontSize: "18px" }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
          {dados.tipoDaInstalacao == "URBANO" && (
            <>
              <div className="w-fit flex flex-col items-center">
                <label
                  className="ml-2 text-center text-[#15599a] font-bold"
                  htmlFor="propostaComercial"
                >
                  IPTU
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.iptu ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.iptu.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal">
                          Adicione o arquivo aqui
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setImages({
                        ...images,
                        iptu: e.target.files[0],
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
                <div className="flex items-center justify-center mt-1 h-[25px]">
                  {checks.iptuCheck && (
                    <AiOutlineCheck
                      style={{ color: "#49be25", fontSize: "18px" }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
          {dados.tipoDoTitular == "PESSOA FISICA" && (
            <>
              <div className="w-fit flex flex-col items-center">
                <label
                  className="ml-2 text-center text-[#15599a] font-bold"
                  htmlFor="propostaComercial"
                >
                  DOCUMENTO COM FOTO
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.documentoComFoto ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.documentoComFoto.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal">
                          Adicione o arquivo aqui
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setImages({
                        ...images,
                        documentoComFoto: e.target.files[0],
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
                <div className="flex items-center justify-center mt-1 h-[25px]">
                  {checks.documentoComFotoCheck && (
                    <AiOutlineCheck
                      style={{ color: "#49be25", fontSize: "18px" }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
          {dados.tipoDoTitular == "PESSOA JURIDICA" && (
            <>
              <div className="w-fit flex flex-col items-center">
                <label
                  className="ml-2 text-center text-[#15599a] font-bold"
                  htmlFor="propostaComercial"
                >
                  CONTRATO SOCIAL
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.contratoSocial ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.contratoSocial.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal">
                          Adicione o arquivo aqui
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setImages({
                        ...images,
                        contratoSocial: e.target.files[0],
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
                <div className="flex items-center justify-center mt-1 h-[25px]">
                  {checks.contratoSocialCheck && (
                    <AiOutlineCheck
                      style={{ color: "#49be25", fontSize: "18px" }}
                    />
                  )}
                </div>
              </div>
              <div className="w-fit flex flex-col items-center">
                <label
                  className="ml-2 text-center text-[#15599a] font-bold"
                  htmlFor="propostaComercial"
                >
                  CARTÃO CNPJ
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.cartaoCnpj ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.cartaoCnpj.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal">
                          Adicione o arquivo aqui
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setImages({
                        ...images,
                        cartaoCnpj: e.target.files[0],
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
                <div className="flex items-center justify-center mt-1 h-[25px]">
                  {checks.cartaoCnpjCheck && (
                    <AiOutlineCheck
                      style={{ color: "#49be25", fontSize: "18px" }}
                    />
                  )}
                </div>
              </div>
              <div className="w-fit flex flex-col items-center">
                <label
                  className="ml-2 text-center text-[#15599a] font-bold"
                  htmlFor="propostaComercial"
                >
                  COMPROVANTE DE ENDEREÇO - REPRESENTANTE LEGAL
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.comprovanteEnderecoRepresentante ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.comprovanteEnderecoRepresentante.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal">
                          Adicione o arquivo aqui
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setImages({
                        ...images,
                        comprovanteEnderecoRepresentante: e.target.files[0],
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
                <div className="flex items-center justify-center mt-1 h-[25px]">
                  {checks.comprovanteEnderecoRepresentanteCheck && (
                    <AiOutlineCheck
                      style={{ color: "#49be25", fontSize: "18px" }}
                    />
                  )}
                </div>
              </div>
              <div className="w-fit flex flex-col items-center">
                <label
                  className="ml-2 text-center text-[#15599a] font-bold"
                  htmlFor="propostaComercial"
                >
                  DOCUMENTO COM FOTO DE TODOS OS SÓCIOS
                </label>
                <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                  <div className="absolute">
                    {images.documentoComFotoSocios ? (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal text-center">
                          {images.documentoComFotoSocios.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal">
                          Adicione o arquivo aqui
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) =>
                      setImages({
                        ...images,
                        documentoComFotoSocios: e.target.files[0],
                      })
                    }
                    className="h-full w-full opacity-0"
                    type="file"
                    accept=".png, .jpeg, .pdf"
                  />
                </div>
                <div className="flex items-center justify-center mt-1 h-[25px]">
                  {checks.documentoComFotoSociosCheck && (
                    <AiOutlineCheck
                      style={{ color: "#49be25", fontSize: "18px" }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
          {dados.aumentoDeCarga == "SIM" ||
            (dados.tipoDaLigacao == "NOVA" && (
              <>
                <div className="w-fit flex flex-col items-center">
                  <label
                    className="ml-2 text-center text-[#15599a] font-bold"
                    htmlFor="propostaComercial"
                  >
                    RELAÇÃO DE CARGAS
                  </label>
                  <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                    <div className="absolute">
                      {images.relacaoDeCargas ? (
                        <div className="flex flex-col items-center">
                          <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                          <span className="block text-gray-400 font-normal text-center">
                            {images.relacaoDeCargas.name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                          <span className="block text-gray-400 font-normal">
                            Adicione o arquivo aqui
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      onChange={(e) =>
                        setImages({
                          ...images,
                          relacaoDeCargas: e.target.files[0],
                        })
                      }
                      className="h-full w-full opacity-0"
                      type="file"
                      accept=".png, .jpeg, .pdf"
                    />
                  </div>
                  <div className="flex items-center justify-center mt-1 h-[25px]">
                    {checks.relacaoDeCargasCheck && (
                      <AiOutlineCheck
                        style={{ color: "#49be25", fontSize: "18px" }}
                      />
                    )}
                  </div>
                </div>
              </>
            ))}
          {dados.possuiDistribuicao == "SIM" && (
            <>
              {dados.distribuicoes.map((dist, index) => (
                <div key={index} className="w-fit flex flex-col items-center">
                  <label
                    className="ml-2 text-center text-[#15599a] font-bold"
                    htmlFor="propostaComercial"
                  >
                    RECEBEDORA {index + 1}
                  </label>
                  <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                    <div className="absolute">
                      {images[`recebedora${index + 1}`] ? (
                        <div className="flex flex-col items-center">
                          <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                          <span className="block text-gray-400 font-normal text-center">
                            {images[`recebedora${index + 1}`].name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                          <span className="block text-gray-400 font-normal">
                            Adicione o arquivo aqui
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      onChange={(e) =>
                        setImages({
                          ...images,
                          [`recebedora${index + 1}`]: e.target.files[0],
                        })
                      }
                      className="h-full w-full opacity-0"
                      type="file"
                      accept=".png, .jpeg, .pdf"
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      {imagesMsg.text && (
        <p className={`text-center italic ${imagesMsg.color}`}>
          {imagesMsg.text}
        </p>
      )}
      <div className="flex justify-center mt-2 gap-2">
        <button
          onClick={voltar}
          className="bg-[#15599a] rounded p-2 font-bold text-white"
        >
          VOLTAR
        </button>
        {checks.allChecked ? (
          <button
            onClick={avancar}
            className="w-fit text-center p-2 rounded bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold "
          >
            PRÓXIMA ETAPA
          </button>
        ) : (
          <button
            onClick={uploadImage}
            className="p-2 bg-[#fead61] hover:bg-[#15599a] hover:text-white rounded font-bold"
          >
            ENVIAR FOTOS
          </button>
        )}
      </div>
    </div>
  );
}

export default FormSolicitacaoDez;
