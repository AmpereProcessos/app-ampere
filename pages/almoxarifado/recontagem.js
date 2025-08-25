import axios from 'axios'
import { useSession } from '../../components/providers/SessionProvider'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import LoadingPage from '../../components/utils/LoadingPage'

import SaveButton from '../../components/utils/Buttons/SaveButton'
import { FaSave } from 'react-icons/fa'
import dayjs from 'dayjs'

function Recontagem() {
  const router = useRouter()
  const { session, status } = useSession({
    required: true,
  })
  const [showFilter, setShowFilter] = useState(true)
  const [materials, setMaterials] = useState()
  const [hideMaterials, setHideMaterials] = useState([])
  function getMateriais() {
    axios.get('/api/almoxarifado/materiais').then((res) => {
      setMaterials(res.data)
    })
  }
  async function sendAlterations() {
    const onlyMaterialsAltered = materials.filter((mat) => mat.recontagem >= 0)
    const reducedArr = onlyMaterialsAltered.map((mat) => {
      return {
        id: mat._id,
        qtdeAnterior: mat.qtde,
        recontagem: mat.recontagem,
      }
    })
    console.log(reducedArr)
    try {
      const { data } = await axios.post('/api/almoxarifado/recontagem', {
        changes: reducedArr,
      })
      getMateriais()
    } catch (error) {
      alert('Oops, houve um erro na alteração dos itens. Por favor, tente novamente.')
    }
  }
  useEffect(() => {
    if (!materials) {
      getMateriais()
    }
  }, [])

  console.log(materials)
  if (status == 'loading') return <LoadingPage />
  return (
    <div className="flex w-full flex-col gap-2 p-4 px-4">
      <div className="flex items-center justify-center">
        <SaveButton text={'SALVAR'} icon={<FaSave />} handleClick={sendAlterations} />
      </div>
      {/* <div
        className={`flex flex-col items-center w-full gap-2 ${
          !showFilter ? "hidden" : ""
        }`}
      >
        <div className="w-full">
          <Select
            isMulti
            placeholder="ESCONDER ITENS"
            styles={{
              control: (base, state) => ({
                ...base,
                width: "100%",
                minHeight: "41px",
              }),
            }}
            onChange={(e) => setHideMaterials(e.map((x) => x.value))}
            options={
              materials
                ? materials.map((material) => {
                    return {
                      label: material.nome,
                      value: material.nome,
                    };
                  })
                : []
            }
          />
        </div>
      </div>

      <div className="grid items-center grid-cols-3 w-full my-2 px-2">
        <div className="flex items-center justify-center text-2xl hover:text-[#fead61]">
          {showFilter ? (
            <RiArrowDownSFill
              style={{ cursor: "pointer" }}
              onClick={() => setShowFilter(false)}
            />
          ) : (
            <RiArrowUpSFill
              style={{ cursor: "pointer" }}
              onClick={() => setShowFilter(true)}
            />
          )}
        </div>
        <h1 className="text-center font-bold text-xl">RELATÓRIO DE ESTOQUE</h1>
        <Link href={"/almoxarifado/estoque"}>
          <div className="flex items-center justify-end cursor-pointer">
            <Image height={60} width={60} src={Logo} />
          </div>
        </Link>
      </div> */}
      <div className="flex w-full grow flex-col">
        <div className="bg-primary/80 grid w-full grid-cols-9 gap-x-2 border-b">
          <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">INDEX</p>
          <p className="col-span-4 px-6 py-4 text-center text-sm font-medium text-white">NOME</p>
          <p className="col-span-2 px-6 py-4 text-center text-sm font-medium text-white">CÓDIGO</p>
          <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">QTDE PREVISTA</p>
          <p className="col-span-1 px-6 py-4 text-center text-sm font-medium text-white">RECONTAGEM</p>
        </div>
        {materials && materials?.length
          ? materials.map((material, index) => (
              <div key={index} className="border-primary/70 grid grid-cols-9 gap-x-2 border-x border-b">
                <div className="col-span-1 py-4 text-center text-xs font-medium whitespace-nowrap text-gray-900">{index + 1}</div>
                <div className="col-span-4 px-6 py-4 text-center text-xs font-medium whitespace-nowrap text-gray-900">
                  <p>{material.nome}</p>
                  {material.recontagem ? (
                    <p className="text-xs text-gray-400 italic">
                      Recontagem feita pela última vez em{' '}
                      <strong className="text-[#fead61]">{dayjs(material.recontagem.data).format('DD/MM/YYYY HH:mm')}</strong> por{' '}
                      {material.recontagem.responsavel ? material.recontagem.responsavel : session.user.nome}
                    </p>
                  ) : null}
                </div>
                <div className="col-span-2 px-6 py-4 text-center text-xs font-medium break-words whitespace-nowrap text-gray-900">
                  {material.codigo ? material.codigo : '-'}
                </div>
                <div className="col-span-1 px-6 py-4 text-center text-sm font-medium whitespace-nowrap text-gray-900">
                  {material.qtde && material.qtde > 0
                    ? Number(material.qtde).toLocaleString('pt-br', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '-'}
                </div>

                <div className="col-span-1 text-center text-sm font-medium whitespace-nowrap text-gray-900">
                  <input
                    value={material.recontagem}
                    onChange={(e) => {
                      console.log(e.target.value)
                      var materialsCopy = [...materials]
                      materialsCopy[index].recontagem = Number(e.target.value)
                      setMaterials(materialsCopy)
                    }}
                    type="number"
                    className="h-full w-full bg-transparent text-center text-xs outline-hidden"
                  />
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  )
}

export default Recontagem
