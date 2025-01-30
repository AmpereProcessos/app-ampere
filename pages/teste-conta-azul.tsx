import Link from 'next/link'
import React from 'react'

function TestingContaAzul() {
  return (
    <div className="relative flex grow items-center justify-center bg-[#fafafa] p-6">
      <Link href="/api/integracao/conta-azul/authorize">
        <button>INTEGRAR</button>
      </Link>
    </div>
  )
}

export default TestingContaAzul
