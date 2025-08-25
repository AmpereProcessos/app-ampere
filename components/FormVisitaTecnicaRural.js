import React, { useState } from 'react'
import NumberFloatingInput from './NumberFloatingInput'
import SelectFloatingInput from './SelectFloatingInput'
import TextFloatingInput from './TextFloatingInput'

function FormVisitaTecnicaRural({ dados, setDados, images, setImages, uploadImages, sendStatus }) {
  const [msg, setMsg] = useState({ text: '', color: '' })
  function validateFields() {
    if (!images.fotoPadrao) {
      setMsg({
        text: 'Por favor, anexe a foto do padrão.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoLocalizacaoPadraoAntigo) {
      setMsg({
        text: 'Por favor, anexe a foto da localização do padrão antigo.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoDisjuntor) {
      setMsg({
        text: 'Por favor, anexe a foto do disjuntor.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoDisjuntor == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha o tipo do disjuntor',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.amperagem == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha a amperagem.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.numeroMedidor.trim().length < 5) {
      setMsg({
        text: 'Por favor, preencha o número do medidor.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.padraoTrafoAcoplados == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha se o trafo e o padrão são acoplados.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.potTrafo == 0 || dados.potTrafo == '') {
      setMsg({
        text: 'Por favor, preencha a potência do transformador.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoTrafo) {
      setMsg({
        text: 'Por favor, anexe a foto do transformador.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoLocalizacaoTrafo) {
      setMsg({
        text: 'Por favor, anexe a foto da localização do transformador.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoNumeroTrafo) {
      setMsg({
        text: 'Por favor, anexe a foto do número do transformador.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoLocalMontagem) {
      setMsg({
        text: 'Por favor, anexe a foto do local de montagem.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.estruturaMontagem == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha o tipo da estrutura.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoLocalMontagemModulos) {
      setMsg({
        text: 'Por favor, anexe a foto do local de montagem dos módulos.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.orientacaoEstrutura.trim().length < 5) {
      setMsg({
        text: 'Por favor, preencha a orientação da montagem dos módulos.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoEstrutura == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha o tipo de estrutura.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoTelha == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha o tipo de telha.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.localInstalacaoInversor.trim().length < 4) {
      setMsg({
        text: 'Por favor, preencha o local de instalação do inversor.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.distanciaModulosInversores.trim().length < 1) {
      setMsg({
        text: 'Por favor, preencha a distância dos módulos aos inversores.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.distanciaInversorPadrao.trim().length < 1) {
      setMsg({
        text: 'Por favor, preencha a distância dos inversores ao padrão.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.distanciaInversorRoteador.trim().length < 1) {
      setMsg({
        text: 'Por favor, preencha a distância dos inversores ao roteador.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.estudoDeCaso) {
      setMsg({
        text: 'Por favor, anexe o estudo de caso.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.casaDeMaquinas == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha sobre a necessidade de casa de máquinas.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.alambrado == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha sobre a necessidade de alambrado.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.britagem == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha sobre a necessidade de britagem.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.construcaoBarracao == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha sobre a necessidade de construção de barracão.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.instalacaoRoteador == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha sobre a necessidade de instalação de roteador.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.redeReligacao == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha sobre a necessidade de rede para religação da fazenda.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.documentoComFoto) {
      setMsg({
        text: 'Por favor, preencha uma documento com foto do cliente.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.contaDeEnergia) {
      setMsg({
        text: 'Por favor, preencha um documento da conta de energia.',
        color: 'text-red-500',
      })
      return false
    }
    return true
  }
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] p-4 shadow-lg">
      <span className="text-md py-2 text-center font-bold text-[#15599a] uppercase">VISITA TÉCNICA RURAL</span>
      <div className="mt-2 flex flex-col items-center">
        <span className="py-2 text-center text-sm font-bold text-[#fead61] uppercase">PADRÃO</span>
        <div className="mt-4 flex flex-wrap items-center justify-around gap-2">
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              FOTO DO PADRÃO
            </label>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.fotoPadrao ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.fotoPadrao.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    fotoPadrao: {
                      title: 'FOTO DO PADRÃO',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              FOTO LOCALIZAÇÃO PADRÃO ANTIGO
            </label>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.fotoLocalizacaoPadraoAntigo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.fotoLocalizacaoPadraoAntigo.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    fotoLocalizacaoPadraoAntigo: {
                      title: 'FOTO lOCALIZAÇÃO DO PADRÃO ANTIGO',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              FOTO LOCALIZAÇÃO PADRÃO NOVO
            </label>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.fotoLocalizacaoPadraoNovo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.fotoLocalizacaoPadraoNovo.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    fotoLocalizacaoPadraoNovo: {
                      title: 'FOTO DA LOCALIZAÇÃO DO PADRÃO NOVO',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              FOTO DO DISJUNTOR DO PADRÃO
            </label>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.fotoDisjuntor ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.fotoDisjuntor.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    fotoDisjuntor: {
                      title: 'FOTO DO DISJUNTOR DO PADRÃO',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-around gap-2">
          <SelectFloatingInput
            label={'DISJUNTOR DO PADRÃO'}
            editable={true}
            width={'450px'}
            value={dados.tipoDisjuntor}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              { label: 'BIFÁSICO', value: 'BIFÁSICO' },
              { label: 'TRIFÁSICO', value: 'TRIFÁSICO' },
            ]}
            handleChange={(value) => setDados({ ...dados, tipoDisjuntor: value })}
          />
          <SelectFloatingInput
            label={'AMPERAGEM'}
            editable={true}
            width={'450px'}
            value={dados.amperagem}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              { label: '30A', value: '30A' },
              { label: '40A', value: '40A' },
              { label: '50A', value: '50A' },
              { label: '60A', value: '60A' },
              { label: '70A', value: '70A' },
              { label: '80A', value: '80A' },
              { label: '90A', value: '90A' },
              { label: '100A', value: '100A' },
              { label: '125A', value: '125A' },
              { label: '150A', value: '150A' },
              { label: '175A', value: '175A' },
              { label: '200A', value: '200A' },
              {
                label: 'OUTRO(DESCREVA NAS OBSERVAÇÕES)',
                value: 'OUTRO(DESCREVA NAS OBSERVAÇÕES)',
              },
            ]}
            handleChange={(value) => setDados({ ...dados, amperagem: value })}
          />
          <TextFloatingInput
            label={'NÚMERO DO MEDIDOR'}
            editable={true}
            width={'450px'}
            value={dados.numeroMedidor}
            handleChange={(value) => setDados({ ...dados, numeroMedidor: value })}
          />
        </div>
      </div>
      <div className="mt-2 flex flex-col items-center">
        <span className="py-2 text-center text-sm font-bold text-[#fead61] uppercase">TRANSFORMADOR</span>
        <div className="mt-2 flex flex-wrap items-center justify-around gap-2">
          <SelectFloatingInput
            label={'PADRÃO E TRANSFORMADOR ACOPLADOS'}
            editable={true}
            width={'450px'}
            value={dados.padraoTrafoAcoplados ? dados.padraoTrafoAcoplados : 'NÃO DEFINIDO'}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              { label: 'SIM', value: 'SIM' },
              { label: 'NÃO', value: 'NÃO' },
            ]}
            handleChange={(value) => setDados({ ...dados, padraoTrafoAcoplados: value })}
          />
          <NumberFloatingInput
            label={'POTÊNCIA DO TRANSFORMADOR'}
            unit={'kVA'}
            editable={true}
            width={'450px'}
            value={dados.potTrafo ? dados.potTrafo : ''}
            handleChange={(value) => setDados({ ...dados, potTrafo: Number(value) })}
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-around gap-2">
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              FOTO DO TRANSFORMADOR
            </label>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.fotoTrafo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.fotoTrafo.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    fotoTrafo: {
                      title: 'FOTO DO TRANSFORMADOR',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              FOTO DA LOCALIZAÇÃO DO TRANSFORMADOR
            </label>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.fotoLocalizacaoTrafo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.fotoLocalizacaoTrafo.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    fotoLocalizacaoTrafo: {
                      title: 'FOTO DA LOCALIZAÇÃO DO TRAFO',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              FOTO DO NÚMERO DO TRANSFORMADOR
            </label>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.fotoNumeroTrafo ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.fotoNumeroTrafo.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    fotoNumeroTrafo: {
                      title: 'FOTO DO NÚMERO DO TRANSFORMADOR',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col items-center">
        <span className="py-2 text-center text-sm font-bold text-[#fead61] uppercase">CABOS E RAMAIS</span>
        <div className="mt-4 flex flex-wrap items-center justify-around gap-2">
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              FOTO DO RAMAL DO TRAFO AO PADRÃO
            </label>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.fotoRamalTrafoPadrao ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.fotoRamalTrafoPadrao.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    fotoRamalTrafoPadrao: {
                      title: 'FOTO DO RAMAL DO TRAFO AO PADRÃO',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              FOTO DOS CABOS DO PADRÃO PARA RELIGAÇÃO DA FAZENDA
            </label>
            <p className="text-center text-xs">
              SÃO OS CABOS UTILIZADOS PARA LEVAR ENERGIA ATÉ A RESIDÊNCIA RURAL OU ATÉ ALGUMA EDIFICAÇÃO DA FAZENDA
            </p>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.fotoCabosReligacao ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.fotoCabosReligacao.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    fotoCabosReligacao: {
                      title: 'FOTO DOS CABOS DO PADRÃO PARA RELIGAÇÃO DA FAZENDA',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col items-center">
        <span className="py-2 text-center text-sm font-bold text-[#fead61] uppercase">ESTRUTURA DE MONTAGEM</span>
        <div className="mt-4 flex flex-wrap items-center justify-around gap-2">
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              FOTO DO LOCAL DA MONTAGEM
            </label>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.fotoLocalMontagem ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.fotoLocalMontagem.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    fotoLocalMontagem: {
                      title: 'FOTO DO LOCAL DA MONTAGEM',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-around gap-2">
          <SelectFloatingInput
            label={'TIPO DE ESTRUTURA - MONTAGEM DOS MÓDULOS'}
            editable={true}
            width={'450px'}
            value={dados.estruturaMontagem}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              {
                label: 'TELHADO CONVENCIONAL - TELHA BARRO',
                value: 'TELHADO CONVENCIONAL - TELHA BARRO',
              },
              { label: 'BARRACÃO À CONSTRUIR', value: 'BARRACÃO À CONSTRUIR' },
              { label: 'ESTRUTURA DE SOLO', value: 'ESTRUTURA DE SOLO' },
              { label: 'BEZERREIRO', value: 'BEZERREIRO' },
            ]}
            handleChange={(value) => setDados({ ...dados, estruturaMontagem: value })}
          />
          <TextFloatingInput
            label={'ORIENTAÇÃO DA MONTAGEM DOS MÓDULOS'}
            editable={true}
            width={'450px'}
            value={dados.orientacaoEstrutura}
            handleChange={(value) => setDados({ ...dados, orientacaoEstrutura: value.toUpperCase() })}
          />
          <SelectFloatingInput
            label={'TIPO DA ESTRUTURA'}
            editable={true}
            width={'450px'}
            value={dados.tipoEstrutura}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              { label: 'MADEIRA', value: 'MADEIRA' },
              { label: 'FERRO', value: 'FERRO' },
              { label: 'ESTRUTURA DE SOLO', value: 'ESTRUTURA DE SOLO' },
            ]}
            handleChange={(value) => setDados({ ...dados, tipoEstrutura: value })}
          />
          <SelectFloatingInput
            label={'TIPO DA TELHA'}
            editable={true}
            width={'450px'}
            value={dados.tipoTelha}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              { label: 'PORTUGUESA', value: 'PORTUGUESA' },
              { label: 'FRANCESA', value: 'FRANCESA' },
              { label: 'ROMANA', value: 'ROMANA' },
              { label: 'CIMENTO', value: 'CIMENTO' },
              { label: 'ETHERNIT', value: 'ETHERNIT' },
              { label: 'SANDUÍCHE', value: 'SANDUÍCHE' },
              { label: 'AMERICANA', value: 'AMERICANA' },
              { label: 'ZINCO', value: 'ZINCO' },
              { label: 'CAPE E BICA', value: 'CAPE E BICA' },
              { label: 'ESTRUTURA DE SOLO', value: 'ESTRUTURA DE SOLO' },
            ]}
            handleChange={(value) => setDados({ ...dados, tipoTelha: value })}
          />
          <SelectFloatingInput
            label={'CLIENTE POSSUI TELHAS RESERVAS'}
            editable={true}
            width={'450px'}
            value={dados.telhasReservas}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              { label: 'SIM - MUITAS', value: 'SIM - MUITAS' },
              { label: 'SIM - POUCAS', value: 'SIM - POUCAS' },
              { label: 'NÃO', value: 'NÃO' },
            ]}
            handleChange={(value) => setDados({ ...dados, telhasReservas: value })}
          />
          <TextFloatingInput
            label={'LOCAL DE MONTAGEM DO INVERSOR'}
            editable={true}
            width={'450px'}
            value={dados.localInstalacaoInversor}
            handleChange={(value) =>
              setDados({
                ...dados,
                localInstalacaoInversor: value.toUpperCase(),
              })
            }
          />
          <TextFloatingInput
            label={'DISTÂNCIA DOS MÓDULOS ATÉ OS INVERSORES'}
            editable={true}
            width={'450px'}
            value={dados.distanciaModulosInversores ? dados.distanciaModulosInversores : ''}
            handleChange={(value) => setDados({ ...dados, distanciaModulosInversores: value })}
          />
          <TextFloatingInput
            label={'DISTÂNCIA DOS INVERSORES ATÉ O PADRÃO'}
            editable={true}
            width={'450px'}
            value={dados.distanciaInversorPadrao}
            handleChange={(value) => setDados({ ...dados, distanciaInversorPadrao: value })}
          />
          <TextFloatingInput
            label={'DISTÂNCIA MÉDIA DO INVERSOR ATÉ O ROTEADOR'}
            editable={true}
            width={'450px'}
            value={dados.distanciaInversorRoteador}
            handleChange={(value) => setDados({ ...dados, distanciaInversorRoteador: value })}
          />
          <SelectFloatingInput
            label={'TIPO DE PAREDE PARA FIXAÇÃO DOS INVERSORES'}
            editable={true}
            width={'450px'}
            value={dados.tipoFixacaoInversores ? dados.tipoFixacaoInversores : 'NÃO DEFINIDO'}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              { label: 'ALVENARIA', value: 'ALVENARIA' },
              { label: 'LANCE DE MURO', value: 'LANCE DE MURO' },
              { label: 'PILAR', value: 'PILAR' },
              {
                label: 'OUTRO(DESCREVA EM OBSERVAÇÕES)',
                value: 'OUTRO(DESCREVA EM OBSERVAÇÕES)',
              },
            ]}
            handleChange={(value) => setDados({ ...dados, tipoFixacaoInversores: value })}
          />
          <TextFloatingInput
            label={'LINK PARA FOTOS DO DRONE'}
            editable={true}
            width={'450px'}
            value={dados.fotosDrone}
            handleChange={(value) => setDados({ ...dados, fotosDrone: value })}
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-around gap-2">
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              FOTO DA LOCALIZAÇÃO DA MONTAGEM DOS MÓDULOS
            </label>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.fotoLocalMontagemModulos ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.fotoLocalMontagemModulos.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    fotoLocalMontagemModulos: {
                      title: 'FOTO DA LOCALIZAÇÃO DA MONTAGEM DOS MÓDULOS',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              FOTO DO LOCAL DO INVERSOR
            </label>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.fotoLocalInversor ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.fotoLocalInversor.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    fotoLocalInversor: {
                      title: 'FOTO DO LOCAL DO INVERSOR',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
          <div className="flex w-fit flex-col items-center self-center">
            <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
              ARQUIVO DO ESTUDO DE CASO
            </label>
            <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
              <div className="absolute">
                {images.estudoDeCaso ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-center font-normal text-gray-400">{images.estudoDeCaso.file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    estudoDeCaso: {
                      title: 'ESTUDO DE CASO',
                      file: e.target.files[0],
                    },
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col items-center">
        <span className="py-2 text-center text-sm font-bold text-[#fead61] uppercase">SERVIÇOS ADICIONAIS</span>
        <div className="mt-4 flex flex-wrap items-center justify-around gap-2">
          <SelectFloatingInput
            label={'CASA DE MÁQUINAS'}
            editable={true}
            width={'450px'}
            value={dados.casaDeMaquinas ? dados.casaDeMaquinas : 'NÃO DEFINIDO'}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              {
                label: 'SIM - RESPONSABILIDADE AMPÈRE',
                value: 'SIM - RESPONSABILIDADE AMPÈRE',
              },
              {
                label: 'SIM - RESPONSABILIDADE CLIENTE',
                value: 'SIM - RESPONSABILIDADE CLIENTE',
              },
              { label: 'NÃO', value: 'NÃO' },
            ]}
            handleChange={(value) => setDados({ ...dados, casaDeMaquinas: value })}
          />
          <SelectFloatingInput
            label={'ALAMBRADO'}
            editable={true}
            width={'450px'}
            value={dados.alambrado ? dados.alambrado : 'NÃO DEFINIDO'}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              {
                label: 'SIM - RESPONSABILIDADE AMPÈRE',
                value: 'SIM - RESPONSABILIDADE AMPÈRE',
              },
              {
                label: 'SIM - RESPONSABILIDADE CLIENTE',
                value: 'SIM - RESPONSABILIDADE CLIENTE',
              },
              { label: 'NÃO', value: 'NÃO' },
            ]}
            handleChange={(value) => setDados({ ...dados, alambrado: value })}
          />
          <SelectFloatingInput
            label={'BRITAGEM'}
            editable={true}
            width={'450px'}
            value={dados.britagem ? dados.britagem : 'NÃO DEFINIDO'}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              {
                label: 'SIM - RESPONSABILIDADE AMPÈRE',
                value: 'SIM - RESPONSABILIDADE AMPÈRE',
              },
              {
                label: 'SIM - RESPONSABILIDADE CLIENTE',
                value: 'SIM - RESPONSABILIDADE CLIENTE',
              },
              { label: 'NÃO', value: 'NÃO' },
            ]}
            handleChange={(value) => setDados({ ...dados, britagem: value })}
          />
          <SelectFloatingInput
            label={'CONSTRUÇÃO DE BARRACÃO'}
            editable={true}
            width={'450px'}
            value={dados.construcaoBarracao ? dados.construcaoBarracao : 'NÃO DEFINIDO'}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              {
                label: 'SIM - RESPONSABILIDADE AMPÈRE',
                value: 'SIM - RESPONSABILIDADE AMPÈRE',
              },
              {
                label: 'SIM - RESPONSABILIDADE CLIENTE',
                value: 'SIM - RESPONSABILIDADE CLIENTE',
              },
              { label: 'NÃO', value: 'NÃO' },
            ]}
            handleChange={(value) => setDados({ ...dados, construcaoBarracao: value })}
          />
          <SelectFloatingInput
            label={'INSTALAÇÃO DE ROTEADOR'}
            editable={true}
            width={'450px'}
            value={dados.instalacaoRoteador ? dados.instalacaoRoteador : 'NÃO DEFINIDO'}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              {
                label: 'SIM - RESPONSABILIDADE AMPÈRE',
                value: 'SIM - RESPONSABILIDADE AMPÈRE',
              },
              {
                label: 'SIM - RESPONSABILIDADE CLIENTE',
                value: 'SIM - RESPONSABILIDADE CLIENTE',
              },
              { label: 'NÃO', value: 'NÃO' },
            ]}
            handleChange={(value) => setDados({ ...dados, instalacaoRoteador: value })}
          />
          <SelectFloatingInput
            label={'REDE PARA RELIGAÇÃO DA FAZENDA'}
            editable={true}
            width={'450px'}
            value={dados.redeReligacao ? dados.redeReligacao : 'NÃO DEFINIDO'}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              {
                label: 'SIM - RESPONSABILIDADE AMPÈRE',
                value: 'SIM - RESPONSABILIDADE AMPÈRE',
              },
              {
                label: 'SIM - RESPONSABILIDADE CLIENTE',
                value: 'SIM - RESPONSABILIDADE CLIENTE',
              },
              { label: 'NÃO', value: 'NÃO' },
            ]}
            handleChange={(value) => setDados({ ...dados, redeReligacao: value })}
          />
          <SelectFloatingInput
            label={'LIMPEZA DO LOCAL DA USINA DE SOLO'}
            editable={true}
            width={'450px'}
            value={dados.limpezaLocalUsinaSolo ? dados.limpezaLocalUsinaSolo : 'NÃO DEFINIDO'}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              {
                label: 'SIM - RESPONSABILIDADE AMPÈRE',
                value: 'SIM - RESPONSABILIDADE AMPÈRE',
              },
              {
                label: 'SIM - RESPONSABILIDADE CLIENTE',
                value: 'SIM - RESPONSABILIDADE CLIENTE',
              },
              { label: 'NÃO', value: 'NÃO' },
            ]}
            handleChange={(value) => setDados({ ...dados, limpezaLocalUsinaSolo: value })}
          />
          <SelectFloatingInput
            label={'TERRAPLANAGEM PARA USINA DE SOLO'}
            editable={true}
            width={'450px'}
            value={dados.terraplanagemUsinaSolo ? dados.terraplanagemUsinaSolo : 'NÃO DEFINIDO'}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              {
                label: 'SIM - RESPONSABILIDADE AMPÈRE',
                value: 'SIM - RESPONSABILIDADE AMPÈRE',
              },
              {
                label: 'SIM - RESPONSABILIDADE CLIENTE',
                value: 'SIM - RESPONSABILIDADE CLIENTE',
              },
              { label: 'NÃO', value: 'NÃO' },
            ]}
            handleChange={(value) => setDados({ ...dados, terraplanagemUsinaSolo: value })}
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-center gap-2 py-2">
        <div className="flex w-fit flex-col items-center self-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            DOCUMENTO COM FOTO DO CLIENTE
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.documentoComFoto ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.documentoComFoto.file.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                </div>
              )}
            </div>
            <input
              onChange={(e) =>
                setImages({
                  ...images,
                  documentoComFoto: {
                    title: 'DOCUMENTO COM FOTO DO CLIENTE',
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
        <div className="flex w-fit flex-col items-center self-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            FATURA DE ENERGIA
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.contaDeEnergia ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.contaDeEnergia.file.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                </div>
              )}
            </div>
            <input
              onChange={(e) =>
                setImages({
                  ...images,
                  contaDeEnergia: {
                    title: 'FATURA DE ENERGIA',
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
      </div>
      {msg ? <p className={`w-full text-center italic ${msg.color}`}>{msg.text}</p> : null}
      <div className="flex items-center justify-center gap-2">
        <button
          disabled={sendStatus == 'loading'}
          onClick={() => {
            if (validateFields()) uploadImages()
          }}
          className="disabled:bg-primary/60 rounded bg-[#fead61] p-2 font-bold hover:bg-[#15599a] hover:text-white"
        >
          {sendStatus == 'loading' ? 'CARREGANDO' : 'ENVIAR FORMULÁRIO'}
        </button>
      </div>
    </div>
  )
}

export default FormVisitaTecnicaRural
