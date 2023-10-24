import React from 'react'
import { getGenFactorByOrientation } from '../../../../utils/methods/shared'
import { renderIcon } from '../../../../utils/methods/rendering'
import { orientationIcons } from '../../../../utils/select-options'

function ModuleOrientationBlock({ infoHolder, setInfoHolder, changes, setChanges }) {
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
        <h1 className="font-bold text-white">ALOCAÇÃO DE MÓDULOS</h1>
      </div>
      <div className="mt-2 flex w-full flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="grid grid-cols-3 items-center p-1 rounded border border-cyan-500">
            <div className="flex items-center gap-2 justify-start">
              <div className="flex items-center justify-center p-1 rounded-full border border-cyan-500 text-cyan-500">
                {renderIcon(orientationIcons['NORTE'])}
              </div>

              <p className="text-center font-bold text-gray-700 text-xs lg:text-base">NORTE</p>
            </div>

            <input
              className="outline-none p-2 text-center font-bold text-gray-700"
              type={'number'}
              value={infoHolder.alocacaoModulos.norte}
              onChange={(e) => {
                setInfoHolder((prev) => ({ ...prev, alocacaoModulos: { ...prev.alocacaoModulos, norte: Number(e.target.value) } }))
                setChanges((prev) => ({ ...prev, 'alocacaoModulos.norte': Number(e.target.value) }))
              }}
            />
            <p className="text-center font-bold text-gray-700 text-xs lg:text-base">
              {infoHolder.alocacaoModulos.norte
                ? (
                    (getGenFactorByOrientation({
                      city: infoHolder.localizacao.cidade,
                      uf: infoHolder.localizacao.uf,
                      orientation: 'NORTE',
                    }) *
                      infoHolder.alocacaoModulos.norte *
                      infoHolder.equipamentos.modulos.potencia) /
                    1000
                  ).toFixed(2)
                : false}{' '}
              kWh
            </p>
          </div>
          <div className="grid grid-cols-3 items-center p-1 rounded border border-cyan-500">
            <div className="flex items-center gap-2 justify-start">
              <div className="flex items-center justify-center p-1 rounded-full border border-cyan-500 text-cyan-500">
                {renderIcon(orientationIcons['NORDESTE'])}
              </div>
              <p className="text-center font-bold text-gray-700 text-xs lg:text-base">NORDESTE</p>
            </div>
            <input
              className="outline-none p-2 text-center font-bold text-gray-700"
              type={'number'}
              value={infoHolder.alocacaoModulos.nordeste}
              onChange={(e) => {
                setInfoHolder((prev) => ({ ...prev, alocacaoModulos: { ...prev.alocacaoModulos, nordeste: Number(e.target.value) } }))
                setChanges((prev) => ({ ...prev, 'alocacaoModulos.nordeste': Number(e.target.value) }))
              }}
            />
            <p className="text-center font-bold text-gray-700 text-xs lg:text-base">
              {infoHolder.alocacaoModulos.nordeste
                ? (
                    (getGenFactorByOrientation({
                      city: infoHolder.localizacao.cidade,
                      uf: infoHolder.localizacao.uf,
                      orientation: 'NORDESTE',
                    }) *
                      infoHolder.alocacaoModulos.nordeste *
                      infoHolder.equipamentos.modulos.potencia) /
                    1000
                  ).toFixed(2)
                : false}{' '}
              kWh
            </p>
          </div>
          <div className="grid grid-cols-3 items-center p-1 rounded border border-cyan-500">
            <div className="flex items-center gap-2 justify-start">
              <div className="flex items-center justify-center p-1 rounded-full border border-cyan-500 text-cyan-500">
                {renderIcon(orientationIcons['LESTE'])}
              </div>
              <p className="text-center font-bold text-gray-700 text-xs lg:text-base">LESTE</p>
            </div>
            <input
              className="outline-none p-2 text-center font-bold text-gray-700"
              type={'number'}
              value={infoHolder.alocacaoModulos.leste}
              onChange={(e) => {
                setInfoHolder((prev) => ({ ...prev, alocacaoModulos: { ...prev.alocacaoModulos, leste: Number(e.target.value) } }))
                setChanges((prev) => ({ ...prev, 'alocacaoModulos.leste': Number(e.target.value) }))
              }}
            />
            <p className="text-center font-bold text-gray-700 text-xs lg:text-base">
              {infoHolder.alocacaoModulos.leste
                ? (
                    (getGenFactorByOrientation({
                      city: infoHolder.localizacao.cidade,
                      uf: infoHolder.localizacao.uf,
                      orientation: 'LESTE',
                    }) *
                      infoHolder.alocacaoModulos.leste *
                      infoHolder.equipamentos.modulos.potencia) /
                    1000
                  ).toFixed(2)
                : false}{' '}
              kWh
            </p>
          </div>
          <div className="grid grid-cols-3 items-center p-1 rounded border border-cyan-500">
            <div className="flex items-center gap-2 justify-start">
              <div className="flex items-center justify-center p-1 rounded-full border border-cyan-500 text-cyan-500">
                {renderIcon(orientationIcons['SUDESTE'])}
              </div>
              <p className="text-center font-bold text-gray-700 text-xs lg:text-base">SUDESTE</p>
            </div>
            <input
              className="outline-none p-2 text-center font-bold text-gray-700"
              type={'number'}
              value={infoHolder.alocacaoModulos.sudeste}
              onChange={(e) => {
                setInfoHolder((prev) => ({
                  ...prev,
                  alocacaoModulos: { ...prev.alocacaoModulos, sudeste: Number(e.target.value) },
                }))
                setChanges((prev) => ({ ...prev, 'alocacaoModulos.sudeste': Number(e.target.value) }))
              }}
            />
            <p className="text-center font-bold text-gray-700 text-xs lg:text-base">
              {infoHolder.alocacaoModulos.sudeste
                ? (
                    (getGenFactorByOrientation({
                      city: infoHolder.localizacao.cidade,
                      uf: infoHolder.localizacao.uf,
                      orientation: 'SUDESTE',
                    }) *
                      infoHolder.alocacaoModulos.sudeste *
                      infoHolder.equipamentos.modulos.potencia) /
                    1000
                  ).toFixed(2)
                : false}{' '}
              kWh
            </p>
          </div>
          <div className="grid grid-cols-3 items-center p-1 rounded border border-cyan-500">
            <div className="flex items-center gap-2 justify-start">
              <div className="flex items-center justify-center p-1 rounded-full border border-cyan-500 text-cyan-500">
                {renderIcon(orientationIcons['SUL'])}
              </div>
              <p className="text-center font-bold text-gray-700 text-xs lg:text-base">SUL</p>
            </div>
            <input
              className="outline-none p-2 text-center font-bold text-gray-700"
              type={'number'}
              value={infoHolder.alocacaoModulos.sul}
              onChange={(e) => {
                setInfoHolder((prev) => ({
                  ...prev,
                  alocacaoModulos: { ...prev.alocacaoModulos, sul: Number(e.target.value) },
                }))
                setChanges((prev) => ({ ...prev, 'alocacaoModulos.sul': Number(e.target.value) }))
              }}
            />
            <p className="text-center font-bold text-gray-700 text-xs lg:text-base">
              {infoHolder.alocacaoModulos.sul
                ? (
                    (getGenFactorByOrientation({
                      city: infoHolder.localizacao.cidade,
                      uf: infoHolder.localizacao.uf,
                      orientation: 'SUL',
                    }) *
                      infoHolder.alocacaoModulos.sul *
                      infoHolder.equipamentos.modulos.potencia) /
                    1000
                  ).toFixed(2)
                : false}{' '}
              kWh
            </p>
          </div>
          <div className="grid grid-cols-3 items-center p-1 rounded border border-cyan-500">
            <div className="flex items-center gap-2 justify-start">
              <div className="flex items-center justify-center p-1 rounded-full border border-cyan-500 text-cyan-500">
                {renderIcon(orientationIcons['SUDOESTE'])}
              </div>
              <p className="text-center font-bold text-gray-700 text-xs lg:text-base">SUDOESTE</p>
            </div>
            <input
              className="outline-none p-2 text-center font-bold text-gray-700"
              type={'number'}
              value={infoHolder.alocacaoModulos.sudoeste}
              onChange={(e) => {
                setInfoHolder((prev) => ({
                  ...prev,
                  alocacaoModulos: { ...prev.alocacaoModulos, sudoeste: Number(e.target.value) },
                }))
                setChanges((prev) => ({ ...prev, 'alocacaoModulos.sudoeste': Number(e.target.value) }))
              }}
            />
            <p className="text-center font-bold text-gray-700 text-xs lg:text-base">
              {infoHolder.alocacaoModulos.sudoeste
                ? (
                    (getGenFactorByOrientation({
                      city: infoHolder.localizacao.cidade,
                      uf: infoHolder.localizacao.uf,
                      orientation: 'SUDOESTE',
                    }) *
                      infoHolder.alocacaoModulos.sudoeste *
                      infoHolder.equipamentos.modulos.potencia) /
                    1000
                  ).toFixed(2)
                : false}{' '}
              kWh
            </p>
          </div>
          <div className="grid grid-cols-3 items-center p-1 rounded border border-cyan-500">
            <div className="flex items-center gap-2 justify-start">
              <div className="flex items-center justify-center p-1 rounded-full border border-cyan-500 text-cyan-500">
                {renderIcon(orientationIcons['OESTE'])}
              </div>
              <p className="text-center font-bold text-gray-700 text-xs lg:text-base">OESTE</p>
            </div>
            <input
              className="outline-none p-2 text-center font-bold text-gray-700"
              type={'number'}
              value={infoHolder.alocacaoModulos.oeste}
              onChange={(e) => {
                setInfoHolder((prev) => ({
                  ...prev,
                  alocacaoModulos: { ...prev.alocacaoModulos, oeste: Number(e.target.value) },
                }))
                setChanges((prev) => ({ ...prev, 'alocacaoModulos.oeste': Number(e.target.value) }))
              }}
            />
            <p className="text-center font-bold text-gray-700 text-xs lg:text-base">
              {infoHolder.alocacaoModulos.oeste
                ? (
                    (getGenFactorByOrientation({
                      city: infoHolder.localizacao.cidade,
                      uf: infoHolder.localizacao.uf,
                      orientation: 'OESTE',
                    }) *
                      infoHolder.alocacaoModulos.oeste *
                      infoHolder.equipamentos.modulos.potencia) /
                    1000
                  ).toFixed(2)
                : false}{' '}
              kWh
            </p>
          </div>
          <div className="grid grid-cols-3 items-center p-1 rounded border border-cyan-500">
            <div className="flex items-center gap-2 justify-start">
              <div className="flex items-center justify-center p-1 rounded-full border border-cyan-500 text-cyan-500">
                {renderIcon(orientationIcons['NOROESTE'])}
              </div>
              <p className="text-center font-bold text-gray-700 text-xs lg:text-base">NOROESTE</p>
            </div>
            <input
              className="outline-none p-2 text-center font-bold text-gray-700"
              type={'number'}
              value={infoHolder.alocacaoModulos.noroeste}
              onChange={(e) => {
                setInfoHolder((prev) => ({
                  ...prev,
                  alocacaoModulos: { ...prev.alocacaoModulos, noroeste: Number(e.target.value) },
                }))
                setChanges((prev) => ({ ...prev, 'alocacaoModulos.noroeste': Number(e.target.value) }))
              }}
            />
            <p className="text-center font-bold text-gray-700 text-xs lg:text-base">
              {infoHolder.alocacaoModulos.noroeste
                ? (
                    (getGenFactorByOrientation({
                      city: infoHolder.localizacao.cidade,
                      uf: infoHolder.localizacao.uf,
                      orientation: 'NOROESTE',
                    }) *
                      infoHolder.alocacaoModulos.noroeste *
                      infoHolder.equipamentos.modulos.potencia) /
                    1000
                  ).toFixed(2)
                : false}{' '}
              kWh
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModuleOrientationBlock
