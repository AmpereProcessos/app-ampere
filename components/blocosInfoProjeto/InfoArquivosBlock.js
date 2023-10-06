import axios from 'axios'
import { deleteObject, ref } from 'firebase/storage'
import React, { useState } from 'react'
import { storage } from '../../utils/firebase'
import AnexoArquivo from '../AnexoArquivo'
import FileLinkBlock from '../utils/FileLinkBlock'
import { useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/methods/handlers'

function InfoArquivosBlock({ project, infoHolder, categories }) {
  const queryClient = useQueryClient()

  async function deleteFile(obj, category) {
    let ableToDelete = categories.some((item) => item.value == `links.${category}`)
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
      <div className="w-full flex justify-around gap-3 mt-4 flex-wrap px-2">
        {links.map((link, index) => (
          <div key={`${link.title} - ${index}`} className="w-full lg:w-[400px]">
            <FileLinkBlock obj={link} prefix={infoHolder.nomeDoContrato} deleteFile={(link) => deleteFile(link, category)} />{' '}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg rounded-md w-full">
      <span className="w-full bg-[#15599a] text-white text-center font-bold py-2 rounded-tr-md rounded-tl-md mb-2">ARQUIVOS DO PROJETO</span>
      <div className="flex flex-col items-center w-full">
        <AnexoArquivo
          id={project._id}
          prevLinks={project.links ? project.links : {}}
          client={`${infoHolder._id}-${infoHolder.nomeDoContrato}-${infoHolder.codigoSVB}`}
          categories={categories}
        />
      </div>
      {project.links && (
        <div className="w-full grid grid-cols-1 gap-2 mt-4">
          {Object.keys(project.links).map((category, index) =>
            project.links[category]?.length > 0 ? (
              <div key={index} className="flex flex-col w-full">
                <h1 className="w-full p-1 rounded-tl-md rounded-tr-md bg-cyan-700 text-white font-bold text-center">{category.toUpperCase()}</h1>

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
