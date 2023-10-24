export function getUserAvatarUrl({ users, userName }) {
  if (!users) return undefined
  const user = users.find((p) => p.nome == userName)

  if (!user) return undefined
  return user.avatar_url
}
