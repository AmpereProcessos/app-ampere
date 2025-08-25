import Image from 'next/image'
import React, { useState } from 'react'
import Logo from '../../utils//images/logo-texto-azul-vertical.png'
import estadosECidades from '../../utils/jsons/estados-cidades.json'
import irradiancia from '../../utils/jsons/irradiancia.json'
import SelectFoatingInput from '../../components/SelectFloatingInput'
import NumberFloatingInput from '../../components/NumberFloatingInput'
function getCities(uf) {
  var filteredState = estadosECidades.filter((item) => item.nome == uf)[0]
  return filteredState.cidades
}
function GeneratioEstimative() {
  const [infoHolder, setInfoHolder] = useState({
    uf: 'MINAS GERAIS',
    cidade: 'ITUIUTABA',
    potPico: 0,
    perda: 0,
  })
  function getGenFactor(city, uf, month) {
    console.log(city, uf)
    const irrad = irradiancia.find((item) => item.STATE == uf && item.NAME.toLowerCase() == city.toLowerCase())
    if (irrad) {
      return (irrad[month] / 1000) * 30 * 0.81
    } else {
      return '-'
    }
  }
  return (
    <div className="flex grow flex-col items-center bg-[#15599a] p-6">
      <div className="bg-background border-primary/20 flex h-full w-[90%] flex-col items-center rounded-lg border p-2 shadow-lg">
        <div className="flex h-[80px] items-center justify-center">
          <Image height={'80px'} width={'80px'} src={Logo} objectFit="fill" />
        </div>
        <h1 className="mt-4 text-lg font-medium text-[#fead61]">ESTUDO DE PERFORMACE DE USINA SOLAR FOTOVOLTAICA</h1>
        <div className="mt-4 flex w-full flex-col items-center">
          <SelectFoatingInput
            label={'UF'}
            editable={true}
            value={infoHolder.uf}
            options={[
              { label: 'MINAS GERAIS', value: 'MINAS GERAIS' },
              { label: 'GOIÁS', value: 'GOIÁS' },
            ]}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                uf: value,
                cidade: getCities(value)[0],
              }))
            }
            width={'50%'}
          />
          <SelectFoatingInput
            label={'CIDADE'}
            editable={true}
            value={infoHolder.cidade}
            options={getCities(infoHolder.uf).map((city) => ({
              label: city,
              value: city,
            }))}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cidade: value }))}
            width={'50%'}
          />
          <NumberFloatingInput
            label={'POTÊNCIA PICO DO SISTEMA'}
            editable={true}
            value={infoHolder.potPico}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, potPico: Number(value) }))}
            width={'50%'}
          />
          <NumberFloatingInput
            label={'PERDA DE GERAÇÃO (%)'}
            editable={true}
            value={infoHolder.perda}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, perda: Number(value) }))}
            width={'50%'}
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="col-span-1 bg-[#15599a] text-center font-medium text-white">MESES</div>
            <div className="col-span-1 bg-[#15599a] text-center font-medium text-white">FATOR DE GERAÇÃO</div>
            <div className="col-span-1 bg-[#15599a] text-center font-medium text-white">EXPECTATIVA (kWh)</div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">JANEIRO</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'JAN').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'JAN') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">FEVEREIRO</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'FEB').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'FEB') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">MARÇO</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'MAR').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'MAR') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">ABRIL</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'APR').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'APR') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">MAIO</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'MAY').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'MAY') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">JUNHO</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'JUN').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'JUN') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">JULHO</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'JUL').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'JUL') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">AGOSTO</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'AUG').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'AUG') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">SETEMBRO</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'SEP').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'SEP') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">OUTUBRO</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'OCT').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'OCT') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">NOVEMBRO</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'NOV').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'NOV') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">DEZEMBRO</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'DEC').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'DEC') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          <div className="border-primary/20 grid w-full grid-cols-3 border-b">
            <div className="text-primary/80 border-primary/20 col-span-1 border-l p-1 text-center font-medium">MÉDIA</div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-x p-1 text-center font-medium">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, 'ANNUAL').toFixed(2)}
            </div>
            <div className="text-primary/80 border-primary/20 col-span-1 border-r p-1 text-center font-medium">
              {infoHolder.potPico
                ? Number((getGenFactor(infoHolder.cidade, infoHolder.uf, 'ANNUAL') * infoHolder.potPico * (100 - infoHolder.perda)) / 100).toFixed(2)
                : '-'}
            </div>
          </div>
          {/* <div className="w-full grid grid-cols-3 border-l border-primary/20">
            <div className="text-primary/80 font-medium col-span-1 p-1 text-center">
              MÉDIA
            </div>
            <div className="text-primary/80 font-medium col-span-1 p-1 text-center">
              FATOR DE GERAÇÃO
            </div>
            <div className="text-primary/80 font-medium col-span-1 p-1 text-center">
              EXPECTATIVA (kWh)
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default GeneratioEstimative
