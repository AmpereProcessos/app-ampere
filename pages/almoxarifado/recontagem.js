import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Logo from '../../utils//images/logo-texto-azul-vertical.png'
import LoadingPage from '../../components/utils/LoadingPage'
import Image from 'next/image'
import Link from 'next/link'
import Select from 'react-select'
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri'
import SaveButton from '../../components/utils/Buttons/SaveButton'
import { FaSave } from 'react-icons/fa'
import dayjs from 'dayjs'

function Recontagem() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
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
    // console
    // if (session?.user.accessibleRoutes.includes("Almoxarifado")) {
    if (!materials) {
      getMateriais()
    }
    //   }
    // } else {
    //   if (session?.user) router.push("/");
    // }
  }, [])

  console.log(materials)
  if (status == 'loading') return <LoadingPage />
  return (
    <div className="w-full p-4 px-4 flex flex-col gap-2">
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
      <div className="w-full grow flex flex-col">
        <div className="grid grid-cols-9 gap-x-2 border-b bg-gray-800 w-full">
          <p className="text-sm col-span-1 font-medium text-white px-6 py-4 text-center">INDEX</p>
          <p className="text-sm col-span-4 font-medium text-white px-6 py-4 text-center">NOME</p>
          <p className="text-sm col-span-2 font-medium text-white px-6 py-4 text-center">CÓDIGO</p>
          <p className="text-sm col-span-1 font-medium text-white px-6 py-4 text-center">QTDE PREVISTA</p>
          <p className="text-sm col-span-1 font-medium text-white px-6 py-4 text-center">RECONTAGEM</p>
        </div>
        {materials && materials?.length
          ? materials.map((material, index) => (
              <div key={index} className="grid grid-cols-9 gap-x-2 border-b border-x border-gray-700">
                <div className="col-span-1 py-4 text-center whitespace-nowrap text-xs font-medium text-gray-900">{index + 1}</div>
                <div className="text-xs col-span-4 text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
                  <p>{material.nome}</p>
                  {material.recontagem ? (
                    <p className="text-gray-400 text-xs italic">
                      Recontagem feita pela última vez em{' '}
                      <strong className="text-[#fead61]">{dayjs(material.recontagem.data).format('DD/MM/YYYY HH:mm')}</strong> por{' '}
                      {material.recontagem.responsavel ? material.recontagem.responsavel : session.user?.name}
                    </p>
                  ) : null}
                </div>
                <div className="text-xs col-span-2 break-words text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
                  {material.codigo ? material.codigo : '-'}
                </div>
                <div className="text-sm col-span-1 text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
                  {material.qtde && material.qtde > 0
                    ? Number(material.qtde).toLocaleString('pt-br', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '-'}
                </div>

                <div className="text-sm col-span-1 text-gray-900 font-medium  text-center whitespace-nowrap">
                  <input
                    value={material.recontagem}
                    onChange={(e) => {
                      console.log(e.target.value)
                      var materialsCopy = [...materials]
                      materialsCopy[index].recontagem = Number(e.target.value)
                      setMaterials(materialsCopy)
                    }}
                    type="number"
                    className="w-full h-full bg-transparent text-center outline-none text-xs"
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
