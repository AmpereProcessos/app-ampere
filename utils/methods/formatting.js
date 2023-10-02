export function formatNameAsInitials(name) {
  const splittedName = name.split(' ')
  const firstLetter = splittedName[0][0]
  var secondLetter
  if (['DE', 'DA', 'DO', 'DOS', 'DAS'].includes(splittedName[1])) secondLetter = splittedName[2] ? splittedName[2][0] : ''
  else secondLetter = splittedName[1] ? splittedName[1][0] : ''
  return firstLetter + secondLetter
}
