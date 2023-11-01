import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Logo from '../../utils//images/logo-texto-azul-vertical.png'
function TermoOeMEmBranco() {
  return (
    <div className="w-[21cm] h-[29.7cm] p-4">
      <Link href="/oem">
        <div className="flex justify-center">
          <Image height="70px" width="70px" src={Logo} />
        </div>
      </Link>
      <h1 className="mt-6 text-center font-bold">TERMO DE REALIZAÇÃO DE MANUTENÇÃO PREVENTIVA</h1>
      <div className="mt-8 px-4">
        <p className="text-center font-raleway">
          Eu, _____________________________________________________, inscrito sob o número de CPF/CNPJ{' '}
          <strong>___________________________________</strong>, declaro que a equipe técnica da empresa{' '}
          <strong>AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA</strong>, inscrita sob o CNPJ nº 27.901.968/0001-45, realizou no dia ____/____/_____ à
          manutenção preventiva, prevista em contrato, do sistema fotovoltaico de ______ kWp instalado na{' '}
          <strong>_______________________, Nº ______, ______________________</strong> , no município de <strong>_____________</strong>.
        </p>
        <p className="mt-12">Por ser verdade assino este termo</p>
        <p className="mt-6 text-end">Ituiutaba, ____/____/_____</p>
        <div className="mt-32 flex flex-col">
          <hr className="border-t-2 border-black" />
          <p className="text-center mt-4 font-raleway font-bold">TÉCNICO</p>
        </div>
        <div className="mt-32 flex flex-col">
          <hr className="border-t-2 border-black" />
          <p className="text-center mt-4 font-raleway font-bold">CLIENTE</p>
        </div>
        <div className="mt-72">
          <p className="text-center font-raleway">Avenida Nove, 233 - Centro, Ituiutaba-MG</p>
          <p className="text-center">ampereenergiascomercial@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

export default TermoOeMEmBranco
