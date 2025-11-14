import { z } from "zod";

export const CalendarSchema = z.object({
	nome: z.string({ required_error: "Nome do calendário não informado.", invalid_type_error: "Tipo não válido para o nome do calendário." }).min(1),
	descricao: z.string({ invalid_type_error: "Tipo não válido para a descrição do calendário." }).optional().nullable(),
	googleCalendarId: z.string({
		required_error: "ID do calendário do Google não informado.",
		invalid_type_error: "Tipo não válido para o ID do calendário do Google.",
	}),
	googleRefreshToken: z.string({
		required_error: "Token de refresh do Google não informado.",
		invalid_type_error: "Tipo não válido para o token de refresh do Google.",
	}),
	autorId: z.string({ required_error: "ID do autor não informado.", invalid_type_error: "Tipo não válido para o ID do autor." }),
	dataInsercao: z.date({ invalid_type_error: "Tipo não válido para a data de inserção do calendário." }).optional(),
});

export type TCalendar = z.infer<typeof CalendarSchema>;
export type TCalendarDTO = TCalendar & { _id: string };
