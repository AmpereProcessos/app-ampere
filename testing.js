const arr = [
  {
    title: 'ENTREGA (2)',
    link: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2F66df736cdf1a0f1e22f8cdd8-WHIGNEY%20TIAGO%20DA%20FONSECA%2Fentrega-%7B2%7D-2024-10-28T13%3A19%3A28.679Z?alt=media&token=e4e83d8d-5e68-4278-b1ba-9b29eb63385a',
    category: 'links.equipamentos',
    format: 'IMAGEM(.JPEG)',
  },
  {
    title: 'ENTREGA (3)',
    link: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2F66df736cdf1a0f1e22f8cdd8-WHIGNEY%20TIAGO%20DA%20FONSECA%2Fentrega-%7B3%7D-2024-10-28T13%3A19%3A28.681Z?alt=media&token=97921b55-c0b6-41bc-986a-cb702d51e233',
    category: 'links.equipamentos',
    format: 'IMAGEM(.JPEG)',
  },
  {
    title: 'ENTREGA (5)',
    link: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2F66df736cdf1a0f1e22f8cdd8-WHIGNEY%20TIAGO%20DA%20FONSECA%2Fentrega-%7B5%7D-2024-10-28T13%3A19%3A28.685Z?alt=media&token=e904a10b-7efa-4de2-afbf-93f620b262b4',
    category: 'links.equipamentos',
    format: 'IMAGEM(.JPEG)',
  },
  {
    title: 'ENTREGA (4)',
    link: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2F66df736cdf1a0f1e22f8cdd8-WHIGNEY%20TIAGO%20DA%20FONSECA%2Fentrega-%7B4%7D-2024-10-28T13%3A19%3A28.683Z?alt=media&token=284cf1aa-aab5-4d41-8fa1-ee98b18c2839',
    category: 'links.equipamentos',
    format: 'IMAGEM(.JPEG)',
  },
  {
    title: 'ENTREGA (1)',
    link: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2F66df736cdf1a0f1e22f8cdd8-WHIGNEY%20TIAGO%20DA%20FONSECA%2Fentrega-%7B1%7D-2024-10-28T13%3A19%3A28.668Z?alt=media&token=e623ee1d-9031-427c-ac61-de4cd7e67047',
    category: 'links.equipamentos',
    format: 'IMAGEM(.JPEG)',
  },
  {
    title: 'ENTREGA (6)',
    link: 'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/clientes%2F66df736cdf1a0f1e22f8cdd8-WHIGNEY%20TIAGO%20DA%20FONSECA%2Fentrega-%7B6%7D-2024-10-28T13%3A19%3A28.687Z?alt=media&token=4fe310ad-60e8-4a83-bc1e-7c8a0a7b0ec9',
    category: 'links.equipamentos',
    format: 'IMAGEM(.JPEG)',
  },
]

console.log(
  JSON.stringify(
    arr.map((x) => ({
      idProjeto: '66df736cdf1a0f1e22f8cdd8',
      titulo: x.title,
      formato: x.format,
      url: x.link,
      autor: {
        id: 'holder',
        nome: 'MIGRAÇÃO',
      },
      dataInsercao: new Date().toISOString(),
    }))
  )
)
