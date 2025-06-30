import { apiHandler } from "@/utils/api";
import type { NextApiHandler } from "next";

const handleContaAzulAuthorize: NextApiHandler<any> = async (req, res) => {
	console.log("[INFO] [CONTAAZULV2] Running Authorization Flow");
	const redirect_uri = "https://app.ampereenergias.com.br/api/integracao/conta-azul-v2/callback";

	const url = `https://auth.contaazul.com/oauth2/authorize?response_type=code&client_id=${process.env.CONTAAZULV2_CLIENT_ID}&redirect_uri=${redirect_uri}&state=12345678&scope=openid+profile+aws.cognito.signin.user.admin`;
	console.log("[INFO] [CONTAAZULV2] Redirecting URL: ", url);
	return res.redirect(url);
};

export default apiHandler({ GET: handleContaAzulAuthorize });
