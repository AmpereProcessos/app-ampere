import axios from 'axios'
import { useSession } from '../../components/providers/SessionProvider'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import LoadingPage from '../../components/utils/LoadingPage'

function SvpControl() {
  const router = useRouter()
  const { session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const [projects, setProjects] = useState([])
  function getProjects() {
    axios.get('/api/o&m/svpControl').then((res) => {
      console.log(res.data)
      setProjects(res.data)
    })
  }
  useEffect(() => {
    if (session?.user.permissoes.rotas.includes('O&M')) {
      getProjects()
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="grow p-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <p className="font-raleway text-2xl font-bold uppercase text-[#15599a]">CLIENTES SVP</p>
          </div>
          <div className="flex flex-col gap-y-2">
            {projects?.map((project) => (
              <div key={project._id} className="flex w-full justify-between border border-gray-300 p-2 shadow-lg">
                <h1 className="font-bold text-[#15599a]">
                  ({project.qtde}) {project.nomeDoContrato}
                </h1>
                <h1>{project.email}</h1>
                <h1>{project.telefone}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default SvpControl
