import axios from 'axios'
import { deleteObject, ref } from 'firebase/storage'
import React, { useState } from 'react'
import { storage } from '../../utils/services/firebase/firebase-storage'
import AnexoArquivo from '../AnexoArquivo'
import FileLinkBlock from '../utils/FileLinkBlock'
import { useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/methods/handlers'

function InfoArquivosBlock({ project, infoHolder, categories, ableToDelete = true }) {
  const queryClient = useQueryClient()

  async function deleteFile(obj, category) {
    if (!ableToDelete) return toast.error('Seu usuário não possui permissão para exclusão desse arquivo.')

    const loadingToastId = toast.loading('Processando...')
    try {
      let fileRef = ref(storage, obj.link)
      let firebaseResponse = await deleteObject(fileRef).catch((err) => {
        throw new Error('Erro ao excluir arquivo no Firebase.')
      })
      let apiResponse = await axios
        .put(`/api/projects/update/${project._id}`, {
          operation: {
            $pull: {
              [`links.${category}`]: obj,
            },
          },
        })
        .catch((err) => {
          throw new Error('Erro ao atualizar links do usuário.')
        })
      await queryClient.invalidateQueries({ queryKey: ['project-by-id', project._id] })
      toast.dismiss(loadingToastId)
      toast.success('Arquivo excluido com sucesso !')
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }
  function renderLinks({ links, category }) {
    if (!links) return null
    return (
      <div className="mt-4 flex w-full flex-wrap justify-around gap-3 px-2">
        {links.map((link, index) => (
          <div key={`${link.title} - ${index}`} className="w-full lg:w-[400px]">
            <FileLinkBlock obj={link} prefix={infoHolder.nomeDoContrato} deleteFile={(link) => deleteFile(link, category)} />{' '}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="flex w-full flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">ARQUIVOS DO PROJETO</span>
      <div className="flex w-full flex-col items-center">
        <AnexoArquivo
          id={project._id}
          prevLinks={project.links ? project.links : {}}
          client={`${infoHolder._id}-${infoHolder.nomeDoContrato}-${infoHolder.codigoSVB}`}
          project={infoHolder}
          categories={categories}
        />
      </div>
      {project.links && (
        <div className="mt-4 grid w-full grid-cols-1 gap-2">
          {Object.keys(project.links).map((category, index) =>
            project.links[category]?.length > 0 ? (
              <div key={index} className="flex w-full flex-col">
                <h1 className="w-full rounded-tl-md rounded-tr-md bg-cyan-700 p-1 text-center font-bold text-white">{category.toUpperCase()}</h1>

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
  )
}

export default InfoArquivosBlock
