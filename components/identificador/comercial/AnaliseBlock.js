import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle, IoMdDocument, IoMdPower } from 'react-icons/io'
import { FaSolarPanel, FaUserAlt } from 'react-icons/fa'
import { ImPower } from 'react-icons/im'
import FileLinkBlock from '../../utils/FileLinkBlock'
import { formatDecimalPlaces, formatLongString, formatToMoney } from '../../../utils/constants'
import { MdElectricMeter, MdOutlineAttachMoney, MdRoofing } from 'react-icons/md'
import { BsHouse } from 'react-icons/bs'
import ProposeProjectVinculation from './ProposeProjectVinculation'

function getBarColor(project) {
  const contractValue = project.valorContrato
  const proposeValue = project.proposta.valor
  const contractPeakPower = project.potenciaPico
  const proposePeakPower = project.proposta.potenciaPico
  if (contractValue == proposeValue && contractPeakPower == proposePeakPower) return 'bg-green-500'
  return 'bg-red-500'
}
function AnaliseBlock({ project }) {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
  function renderLinks({ links, category }) {
    if (!links) return null
    return (
      <div className="w-full flex justify-around gap-3 mt-4 flex-wrap px-2">
        {links.map((link, index) => (
          <div key={`${link.title} - ${index}`} className="w-full lg:w-[400px]">
            <FileLinkBlock obj={link} prefix={project.nome} deleteFile={(link) => deleteFile(link, category)} showDeleteMenu={false} />{' '}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="flex gap-2 w-full shadow-sm border border-gray-300 rounded-md">
      <div className={`h-full w-[7px] ${getBarColor(project)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex flex-col w-full grow p-3">
        <div className="flex items-center w-full gap-2">
          <div className="flex flex-col min-w-[350px]">
            <div className="flex items-center gap-1">
              <h1 className="text-[#fead41] font-black">{project.identificadorCRM}</h1>
              <h1 className="font-bold leading-none tracking-tight">{project.nome}</h1>
            </div>
            <p className="text-xs text-gray-500">{project.tipoServico}</p>
          </div>
          <div className="grow flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaUserAlt />
              <p className="text-gray-500 font-medium">{project.vendedor}</p>
            </div>
            <div className="flex items-center gap-2">
              <ImPower />
              <p className="text-gray-500 font-medium">{formatDecimalPlaces(project.potenciaPico)}W</p>
            </div>
            <div className="flex items-center gap-2">
              <FaSolarPanel />
              <p className="text-gray-500 font-medium">{formatToMoney(project.valorProjeto)}</p>
            </div>
            <div className="flex items-center gap-2">
              <MdElectricMeter />
              <p className="text-gray-500 font-medium">{formatToMoney(project.valorPadrao)}</p>
            </div>
            <div className="flex items-center gap-2">
              <BsHouse />
              <p className="text-gray-500 font-medium">{formatToMoney(project.valorEstrutura)}</p>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineAttachMoney />
              <p className="text-gray-500 font-medium">{formatToMoney(project.valorContrato)}</p>
            </div>
          </div>
        </div>
        {project.proposta.id ? (
          <div className="flex flex-col w-full rounded mt-1 bg-gray-100 p-1">
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-2">
                <IoMdDocument />
                <h1 className="text-gray-500 font-medium text-xs">PROPOSTA VINCULADA</h1>
              </div>
            </div>
            <div className="flex items-center w-full gap-2">
              <div className="flex flex-col min-w-[350px]">
                <h1 className="font-bold leading-none tracking-tight text-[#15599a] text-sm">{formatLongString(project.proposta.nome, 30)}</h1>
              </div>
              <div className="grow flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImPower />
                  <p className={`${project.potenciaPico == project.proposta.potenciaPico ? 'text-green-500' : 'text-[#F31559]'} font-medium`}>
                    {project.proposta.potenciaPico}W
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlineAttachMoney />
                  <p className={`${project.valorContrato == project.proposta.valor ? 'text-green-500' : 'text-[#F31559]'} font-medium`}>
                    {formatToMoney(project.proposta.valor)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full items-center justify-center p-1">
            <h1 className="p-1 text-xs rounded text-[#F31559] font-bold border border-red-500">SEM PROPOSTA VINCULADA</h1>
            <ProposeProjectVinculation
              idProject={project.id}
              idSolicitation={project.idSolicitacaoContrato}
              idProjectCRM={project.idProjetoCRM}
              signatureDate={project.dataAssinatura}
              contractRequestDate={project.dataSolicitacao}
            />
          </div>
        )}
        <div className="w-full flex items-center justify-start mt-1">
          <div className="flex items-center gap-1">
            {showAdditionalInfo ? (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropupCircle style={{ fontSize: '15px' }} onClick={() => setShowAdditionalInfo(false)} />
              </div>
            ) : (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropdownCircle style={{ fontSize: '15px' }} onClick={() => setShowAdditionalInfo(true)} />
              </div>
            )}
            <p className="text-xs text-gray-500">MAIS INFORMAÇÕES</p>
          </div>
        </div>
        {showAdditionalInfo ? (
          <div className="w-full flex flex-col">
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center">
                <h1 className="text-center text-gray-600 text-xs">CPF/CNPJ</h1>
                <h1 className="text-center text-gray-600 text-sm font-medium">{project.cpfCnpj ? project.cpfCnpj : '-'}</h1>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-center text-gray-600 text-xs">CIDADE</h1>
                <h1 className="text-center text-gray-600 text-sm font-medium">{project.cidade ? project.cidade : '-'}</h1>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-center text-gray-600 text-xs">BAIRRO</h1>
                <h1 className="text-center text-gray-600 text-sm font-medium">{project.bairro ? project.bairro : '-'}</h1>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-center text-gray-600 text-xs">LOGRADOURO</h1>
                <h1 className="text-center text-gray-600 text-sm font-medium">{project.logradouro ? project.logradouro : '-'}</h1>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-center text-gray-600 text-xs">Nº</h1>
                <h1 className="text-center text-gray-600 text-sm font-medium">
                  {project.numeroOuIdentificador ? project.numeroOuIdentificador : '-'}
                </h1>
              </div>
            </div>
            {project.links && (
              <div className="w-full grid grid-cols-1 gap-2 mt-4">
                {Object.keys(project.links).map((category, index) =>
                  project.links[category]?.length > 0 ? (
                    <div key={index} className="flex flex-col w-full">
                      <h1 className="w-full p-1 rounded-tl-md rounded-tr-md bg-cyan-700 text-white font-bold text-center">
                        {category.toUpperCase()}
                      </h1>

                      {renderLinks({ links: project.links[category], category: category })}
                      {/* {project.links[category].map((obj, index2) => (
                    <div className="w-full lg:w-[50%]">
                      <FileLinkBlock
                        key={`${obj.title} - ${index2}`}
                        obj={obj}
                        prefix={infoHolder.nomeDoContrato}
                        deleteFile={(obj) => deleteFile(obj, category)}
                      />
                    </div>
                  ))} */}
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
  return (
    <div className="flex flex-col w-full p-1 border border-gray-200">
      <div className="w-full grid grid-cols-8 items-center">
        <div className="flex flex-col col-span-2">
          <div className="flex items-center gap-2 col-span-2">
            {showAdditionalInfo ? (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropupCircle style={{ fontSize: '15px' }} onClick={() => setShowAdditionalInfo(false)} />
              </div>
            ) : (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropdownCircle style={{ fontSize: '15px' }} onClick={() => setShowAdditionalInfo(true)} />
              </div>
            )}
            <div className="text-sm gap-2 flex items-center">
              <strong className="text-[#fead61]">({project.identificadorCRM})</strong>
              {project.nome} <strong className="text-[#15599a]">{project.identificador}</strong> -{' '}
            </div>
          </div>
          {project.proposta ? <h1 className={`text-blue-700 text-xs font-medium text-center`}>{project.proposta.nome}</h1> : null}
        </div>

        <div className="flex flex-col items-center col-span-1">
          <h1 className="text-center text-gray-600 text-xs">TIPO DE SERVIÇO</h1>
          <h1 className="text-center text-gray-600 text-sm font-medium">{project.tipoServico}</h1>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <h1 className="text-center text-gray-600 text-xs">POTÊNCIA PICO</h1>
          <h1 className="text-center text-gray-600 text-sm font-medium">{project.potenciaPico}kWp</h1>
          {project.proposta ? (
            <h1 className={`${project.proposta.potenciaPico == project.potenciaPico ? 'text-green-500' : 'text-red-500'} text-xs font-medium`}>
              {project.proposta.potenciaPico}
            </h1>
          ) : null}
        </div>
        <div className="flex flex-col items-center col-span-1">
          <h1 className="text-center text-gray-600 text-xs">VALOR DO PROJETO</h1>
          <h1 className="text-center text-gray-600 text-sm font-medium">{formatToMoney(project.valorProjeto)}</h1>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <h1 className="text-center text-gray-600 text-xs">VALOR DO PADRÃO</h1>
          <h1 className="text-center text-gray-600 text-sm font-medium">{formatToMoney(project.valorPadrao)}</h1>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <h1 className="text-center text-gray-600 text-xs">VALOR DA ESTRUTURA</h1>
          <h1 className="text-center text-gray-600 text-sm font-medium">{formatToMoney(project.valorEstrutura)}</h1>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <h1 className="text-center text-gray-600 text-xs">VALOR DO CONTRATO</h1>
          <h1 className="text-center text-gray-600 text-sm font-medium">{formatToMoney(project.valorContrato)}</h1>
          {project.proposta ? (
            <h1 className={`${project.proposta.valor == project.valorContrato ? 'text-green-500' : 'text-red-500'} text-xs font-medium`}>
              {formatToMoney(project.proposta.valor)}
            </h1>
          ) : null}
        </div>
      </div>
      {showAdditionalInfo ? (
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center">
              <h1 className="text-center text-gray-600 text-xs">CPF/CNPJ</h1>
              <h1 className="text-center text-gray-600 text-sm font-medium">{project.cpfCnpj ? project.cpfCnpj : '-'}</h1>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-center text-gray-600 text-xs">CIDADE</h1>
              <h1 className="text-center text-gray-600 text-sm font-medium">{project.cidade ? project.cidade : '-'}</h1>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-center text-gray-600 text-xs">BAIRRO</h1>
              <h1 className="text-center text-gray-600 text-sm font-medium">{project.bairro ? project.bairro : '-'}</h1>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-center text-gray-600 text-xs">LOGRADOURO</h1>
              <h1 className="text-center text-gray-600 text-sm font-medium">{project.logradouro ? project.logradouro : '-'}</h1>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-center text-gray-600 text-xs">Nº</h1>
              <h1 className="text-center text-gray-600 text-sm font-medium">{project.numeroOuIdentificador ? project.numeroOuIdentificador : '-'}</h1>
            </div>
          </div>
          {/* {project.links && (
            <div className="flex justify-center gap-2 gap-y-4 mt-3 flex-wrap">
              {Object.keys(project.links).map((category, index) =>
                project.links[category]?.length > 0 ? (
                  <div key={index} className="flex flex-col w-full lg:w-[45%] p-1 shadow-sm">
                    <h1 className="font-bold text-center text-green-500">{category.toUpperCase()}</h1>
                    <div className="flex flex-col items-center gap-1">
                      {project.links[category].map((obj, index2) => (
                        <FileLinkBlock key={index2} obj={obj} deleteFile={(obj) => alert('Exclusão de arquivos não permitida nessa área.')} />
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )} */}
        </div>
      ) : null}
    </div>
  )
}

export default AnaliseBlock
