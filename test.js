const dayjs = require('dayjs')
const z = require('zod')
const fs = require('fs')
function getFirstDayOfYearString({ year, resetHour = true }) {
  var currentDate = dayjs()
  if (year) currentDate = currentDate.set('year', year)
  var firstDay = currentDate.startOf('year')
  if (resetHour) firstDay = firstDay.subtract(3, 'hour')
  return firstDay.toISOString()
}
function getFirstDayOfMonth({ year, month, resetHour = true }) {
  var currentDate = dayjs()
  if (year) currentDate = currentDate.set('year', year)
  if (month) currentDate = currentDate.set('month', month - 1)
  var firstDay = currentDate.startOf('month')
  if (resetHour) firstDay = firstDay.subtract(3, 'hour')
  return firstDay.toISOString()
}
function getLastDayOfMonth({ year, month, resetHour = true }) {
  var currentDate = dayjs()
  if (year) currentDate = currentDate.set('year', year)
  if (month) currentDate = currentDate.set('month', month - 1)
  var firstDay = currentDate.endOf('month')
  if (resetHour) firstDay = firstDay.subtract(3, 'hour')
  return firstDay.toISOString()
}

const initialYear = 2020
const currentYear = 2024
const arr = Array.from({ length: currentYear - initialYear + 1 }, (_, index) => initialYear + index)
const max = Math.max.apply(null, arr)
console.log(max)

const filesDozeA = [
  {
    descricao: 'LOCALIZAÇÃO',
    url: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2FNarcisio%20e%20fam%C3%ADlia-CRM-1826%2FLOCALIZA%C3%87%C3%83O-2408?alt=media&token=addd3056-e946-40ad-92c7-c3f07a12edd2',
    formato: 'IMAGEM(.JPEG)',
  },
  {
    descricao: 'FOTO DO TRANSFORMADOR',
    url: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2FNarcisio%20e%20fam%C3%ADlia-CRM-1826%2FFOTO%20DO%20TRANSFORMADOR-2814?alt=media&token=278e6654-1943-45e4-90e2-cb7ce41ce3e7',
    formato: 'IMAGEM(.JPEG)',
  },
  {
    descricao: 'FOTO DO PADRÃO',
    url: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2FNarcisio%20e%20fam%C3%ADlia-CRM-1826%2FFOTO%20DO%20PADR%C3%83O-2612?alt=media&token=cc65649f-23ed-4da2-8def-0925734159df',
    formato: 'IMAGEM(.JPEG)',
  },
  {
    descricao: 'FOTO DO QUADRO DE DISTRIBUIÇÃO',
    url: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2FNarcisio%20e%20fam%C3%ADlia-CRM-1826%2FFOTO%20DO%20QUADRO%20DE%20DISTRIBUI%C3%87%C3%83O-788?alt=media&token=70e55296-8ac6-45c3-a61c-df139d4cb8b1',
    formato: 'IMAGEM(.JPEG)',
  },
  {
    descricao: 'FOTO DAS TELHAS',
    url: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2FNarcisio%20e%20fam%C3%ADlia-CRM-1826%2FFOTO%20DAS%20TELHAS-9760?alt=media&token=f063216e-01c8-40d6-bcfe-a202676ab6db',
    formato: 'IMAGEM(.JPEG)',
  },
  {
    descricao: 'FOTO DO NÚMERO DO TRANSFORMADOR',
    url: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2FNarcisio%20e%20fam%C3%ADlia-CRM-1826%2FFOTO%20DO%20N%C3%9AMERO%20DO%20TRANSFORMADOR-2147?alt=media&token=11fc880e-6172-40f7-b14f-19b0d52fb7ef',
    formato: 'IMAGEM(.JPEG)',
  },
  {
    descricao: 'FOTO DO DISJUNTOR DO PADRÃO',
    url: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2FNarcisio%20e%20fam%C3%ADlia-CRM-1826%2FFOTO%20DO%20DISJUNTOR%20DO%20PADR%C3%83O-3212?alt=media&token=b7b943d7-2597-41b3-a7c1-8b8efcc3c443',
    formato: 'IMAGEM(.JPEG)',
  },
  {
    descricao: 'FOTO DA LOCALIZAÇÃO DO TRANSFORMADOR',
    url: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2FNarcisio%20e%20fam%C3%ADlia-CRM-1826%2FFOTO%20DA%20LOCALIZA%C3%87%C3%83O%20DO%20TRANSFORMADOR-5316?alt=media&token=5e2f5329-4b4a-4472-8f63-7c40b6903e28',
    formato: 'IMAGEM(.JPEG)',
  },
  {
    descricao: 'FOTO DA ESTRUTURA DO TELHADO',
    url: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2FNarcisio%20e%20fam%C3%ADlia-CRM-1826%2FFOTO%20DA%20ESTRUTURA%20DO%20TELHADO-5995?alt=media&token=5ecd4f03-f9df-4d55-a2c1-820eb522dd33',
    formato: 'IMAGEM(.JPEG)',
  },
  {
    descricao: 'FOTO DA FACHADA',
    url: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2FNarcisio%20e%20fam%C3%ADlia-CRM-1826%2FFOTO%20DA%20FACHADA-214?alt=media&token=c0fe7661-4051-4e41-ba70-6133c9bed803',
    formato: 'IMAGEM(.JPEG)',
  },
  {
    descricao: 'FOTO DO CABOS DO PADRÃO',
    url: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2FNarcisio%20e%20fam%C3%ADlia-CRM-1826%2FFOTO%20DO%20CABOS%20DO%20PADR%C3%83O-3897?alt=media&token=b5bea1c6-6e64-4d04-9ad9-b51ebbf775ad',
    formato: 'IMAGEM(.JPEG)',
  },
]
const filesFixed = filesDozeA.map((f) => ({ title: f.descricao, link: f.url, format: f.formato }))
console.log(filesFixed)
fs.writeFile('./files.json', JSON.stringify(filesFixed), 'utf8', function (err) {
  if (err) {
    return console.log(err)
  }

  console.log('The file was saved!')
})
