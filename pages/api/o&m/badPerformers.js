import axios from "axios";

export default async function handler(req, res) {
  if (req.method == "GET") {
    try {
      let { data } = await axios.post(
        "https://api-v2.solarview.com.br/unitList?page=1",
        {
          pageSize: 942,
        },
        {
          headers: {
            "solarview-tokenUniversal": req.query.token,
          },
        }
      );
      var arr = [];
      data.data.map((user) => {
        var parsed = JSON.parse(user.consumerUnit30dPerformance);
        if (parsed != null && typeof parsed == "object") {
          let dados30d = JSON.parse(user.consumerUnit30dPerformance);
          let reg = dados30d[4];
          let nomeUsina = user.consumerUnitName;
          if (Number(reg) <= 80) {
            arr.push({ nomeUsina: nomeUsina, performance: Number(reg) });
          }
        }
      });
      res.json(arr);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
