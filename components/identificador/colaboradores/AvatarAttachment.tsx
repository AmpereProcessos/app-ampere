import { formatLongString } from '@/utils/constants'
import { uploadFile } from '@/utils/methods/firebase'
import { updateEmployee } from '@/utils/methods/mutation/employees'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import Image from 'next/image'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BsCheck2All, BsCloudUploadFill } from 'react-icons/bs'
import { useQueryClient } from '@tanstack/react-query'

type AvatarAttachmentProps = {
  userId: string
  userName: string
  avatar_url: string | null
}
function AvatarAttachment({ userId, userName, avatar_url }: AvatarAttachmentProps) {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const [avatarURL, setAvatarURL] = useState<string | null>(avatar_url)
  function handleFileChange(file: File | null) {
    if (!file) {
      setFile(null)
      setAvatarURL(null)
      return
    }
    const previewURL = URL.createObjectURL(file)
    setFile(file)
    setAvatarURL(previewURL)
  }
  async function handleAttachAvatar(file: File | null) {
    try {
      if (!file) return toast.error('Anexe uma imagem para prosseguir.')
      const fixedUserName = userName.toLowerCase().replaceAll('', '_')
      const fileName = `avatar-${fixedUserName}`
      const uploadingFileToastId = toast.loading('Processando arquivo...')
      const { url } = await uploadFile({ file, fileName, vinculationId: userId, prefix: 'usuarios' })
      toast.dismiss(uploadingFileToastId)
      const updatingUserToastId = toast.loading('Atualizando avatar do usuário...')
      await updateEmployee({ id: userId, changes: { avatar_url: url } })
      toast.dismiss(updatingUserToastId)
      setFile(null)
      return 'Usuário atualizado com sucesso !'
    } catch (error) {
      toast.dismiss()
      throw error
    }
  }
  const { mutate: attachAvatar, isPending } = useMutationWithFeedback({
    mutationKey: ['attach-user-avatar', userId],
    mutationFn: handleAttachAvatar,
    queryClient: queryClient,
    affectedQueryKey: ['employees'],
  })
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center gap-2">
        <div style={{ width: 100, height: 100 }} className="flex items-center justify-center rounded-full border border-black">
          {avatarURL ? (
            <Image src={avatarURL} alt="Avatar" width={100} height={100} style={{ borderRadius: '100%' }} />
          ) : (
            <h1 className="text-center text-[0.65rem] font-bold tracking-tight">NÃO DEFINIDO</h1>
          )}
        </div>
        <div className={`relative flex grow flex-col gap-1`}>
          <label htmlFor={'avatar-input'} className="font-sans font-bold text-[#353432]">
            AVATAR
          </label>
          <div className="border-primary/20 flex h-[47px] w-full items-center gap-2 rounded-md border p-3">
            {file ? (
              <p className="text-primary/60 grow text-center leading-none tracking-tight">{formatLongString(file.name, 30)}</p>
            ) : (
              <p className="text-primary/60 grow text-center leading-none tracking-tight">
                <span className="font-semibold text-cyan-500">Clique para escolher um arquivo</span> ou o arraste para a àrea demarcada
              </p>
            )}
            {file ? <BsCheck2All size={25} color={'rgb(34,197,94)'} /> : <BsCloudUploadFill size={25} />}
          </div>
          <input
            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            id="avatar-input"
            type="file"
            className="absolute h-full w-full opacity-0"
            accept=".png, .jpg"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
        <button
          disabled={!file || isPending}
          // @ts-ignore
          onClick={() => attachAvatar(file)}
          className="disabled:bg-primary/60 enabled:hover:bg-primary/70 rounded bg-black px-4 py-1 text-xs font-medium text-white duration-300 ease-in-out"
        >
          VINCULAR AVATAR
        </button>
      </div>
    </div>
  )
}

export default AvatarAttachment
