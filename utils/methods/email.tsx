import axios from "axios";

type SendEmailParams = {
	emailTo: string;
	subject: string;
	message: string;
	copy?: string[];
};
export async function sendEmail({ emailTo, subject, message, copy }: SendEmailParams) {
	try {
		await axios.post("/api/integracao/email", {
			emailTo: emailTo, // amperecontasareceber@gmail.com
			subject: subject,
			message: message,
			copy: copy,
		});
		return "Email enviado com sucesso !";
	} catch (error) {
		throw error;
	}
}
