import nodemailer from "nodemailer";
export default async function handler(req, res) {
	if (req.method == "POST") {
		const msg = {
			from: "ampereprocessos@email.com",
			cc: req.body.copy,
			to: req.body.emailTo,
			subject: req.body.subject,
			text: req.body.message,
		};
		console.log(msg);
		try {
			let data = await nodemailer
				.createTransport({
					service: "gmail",
					auth: {
						user: "ampereprocessos@gmail.com",
						pass: "ccyecqdvssayztwe",
					},
					port: 587,
					host: "smtp.gmail.com",
				})
				.sendMail(msg);
			console.log("RESPOSTA EMAIL", data);
			res.json("FOI");
		} catch (error) {
			res.json(error);
		}
	}
}
