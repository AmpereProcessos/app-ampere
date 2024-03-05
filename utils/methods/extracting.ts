import { TUserDTO } from '../schemas/users'

type GetUserAvatarUrlParams = {
  users: TUserDTO[]
  userName: string
}
export function getUserAvatarUrl({ users, userName }: GetUserAvatarUrlParams) {
  if (!users) return undefined
  const user = users.find((p) => p.nome == userName)

  if (!user) return undefined
  return user.avatar_url
}
