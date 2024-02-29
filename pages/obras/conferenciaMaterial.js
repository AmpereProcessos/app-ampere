import axios from 'axios'
import React, { useEffect, useState } from 'react'
import MaterialCard from '../../components/MaterialCard'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
function ConferenciaMaterial() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  function getProjects() {
    axios.get('/api/gestaoDeObras/material').then((res) => {
      setProjects(res.data)
      setFilteredProjects(res.data)
    })
  }
  useEffect(() => {
    if (
      session?.user.permissoes.rotas.includes('Obras') ||
      session?.user.permissoes.rotas.includes('Marketing') ||
      session?.user.permissoes.rotas.includes('Suprimentos')
    ) {
      getProjects(session.user)
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])

  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="grow bg-[#fff] p-6">
        <div className="mb-2 flex w-full items-center border-b border-gray-200">
          <h1 className="pb-2 text-xl font-bold text-[#fead61]">CONFERÊNCIA DE MATERIAL</h1>
        </div>
        <div className="flex w-full flex-col flex-wrap gap-y-2">
          {filteredProjects.map((project) => (
            <MaterialCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    )
  }
}

export default ConferenciaMaterial
