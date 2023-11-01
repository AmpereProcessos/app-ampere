import connectToDatabase from '../../../../utils/services/mongodb/calls'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('pps')
    const after = new Date(req.body.date.after).toJSON()
    const before = new Date(req.body.date.before).toJSON()
    var byType = await collection
      .aggregate([
        {
          $match: {
            status: 'REALIZADO',
          },
        },
        {
          $match: {
            carimboDataHora: {
              $gt: after,
              $lt: before,
            },
          },
        },
        {
          $group: {
            _id: '$tipoDeSolicitacao',
            contagem: {
              $count: {},
            },
          },
        },
      ])
      .toArray()
    var bySeller = await collection
      .aggregate([
        {
          $match: {
            status: 'REALIZADO',
          },
        },
        {
          $match: {
            carimboDataHora: {
              $gt: after,
              $lt: before,
            },
          },
        },
        {
          $group: {
            _id: '$vendedor',
            contagem: {
              $count: {},
            },
          },
        },
      ])
      .toArray()
    var byAttendant = await collection
      .aggregate([
        {
          $match: {
            status: 'REALIZADO',
          },
        },
        {
          $match: {
            carimboDataHora: {
              $gt: after,
              $lt: before,
            },
          },
        },
        {
          $group: {
            _id: '$responsavel',
            contagem: {
              $count: {},
            },
            tempoMedio: {
              $avg: {
                $dateDiff: {
                  startDate: {
                    $dateFromString: { dateString: '$carimboDataHora' },
                  },
                  endDate: {
                    $dateFromString: { dateString: '$dataDeConclusao' },
                  },
                  unit: 'hour',
                },
              },
            },
          },
        },
      ])
      .toArray()

    res.json({ byType, byAttendant, bySeller })
  }
}
