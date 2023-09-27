import React, { useState } from 'react'

function ConferenciaOutrasCategorias({ saveChanges, index }) {
  const [loading, setLoading] = useState(false)
  async function closeOS() {
    setLoading(true)
    let response = await saveChanges({
      [`ordensDeServico.${index}.dataDeFechamento`]: new Date(),
    })
    console.log('RESPONSE', response)
    if (response.success == true) return
    else {
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
  }
  console.log(loading)
  return (
    <div className="my-2 flex items-center justify-center mt-6">
      {loading ? (
        <></>
      ) : (
        <button
          onClick={() => closeOS()}
          className="p-2 rounded font-bold border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white "
        >
          FINALIZAR OS
        </button>
      )}
    </div>
  )
}

export default ConferenciaOutrasCategorias
