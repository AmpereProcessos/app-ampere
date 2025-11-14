import axios from "axios";
export default async function handler(req, res) {
	if (req.method == "GET") {
		try {
			const { authorization } = req.query;
			const { data } = await axios.post(
				"https://globalpro.solarmanpv.com/maintain-s/operating/station/v2/search?page=1&size=500&order.direction=ASC&order.property=name",
				{ station: { powerTypeList: ["PV"] } },
				{
					headers: {
						Authorization: authorization,
						"Access-Control-Allow-Origin": "*",
						"Content-Type": "application/json;charset=UTF-8",
					},
				},
			);
			res.json(data);
		} catch (error) {
			console.log(error);
			res.json("ERRO");
		}
	}
}
