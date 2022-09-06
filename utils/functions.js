export function validateAuth(acessKey, credentials) {
  let acess = credentials.accessibleRoutes.includes(acessKey);
  return acess;
}
