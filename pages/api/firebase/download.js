import getBucket from '../../../utils/services/firebase/firebase-bucket'

export default async function handler(req, res) {
  const { filePath } = req.query

  if (req.method == 'GET') {
    try {
      const bucket = await getBucket()
      const file = bucket.file(filePath)
      const stream = file.createReadStream()
      stream.pipe(res)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to download file' })
    }
  }
}
