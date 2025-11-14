import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { TCalendar, TCalendarDTO } from "@/utils/schemas/calendars";
import connectToDatabase from "@/utils/services/mongodb/auxiliaries";
import createHttpError from "http-errors";
import { Db, ObjectId } from "mongodb";
import { NextApiHandler } from "next";

type GetResponse = {
	data: TCalendar | TCalendar[];
};
const getCalendarsRoute: NextApiHandler<GetResponse> = async (req, res) => {
	// const session = await validateAuthenticationWithSession(req, res)

	const { id } = req.query;
	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const collection = db.collection<TCalendar>("calendarios");

	if (id) {
		if (typeof id !== "string") throw new createHttpError.BadRequest("ID inválido.");
		const result = await collection.findOne({ _id: new ObjectId(id) });
		if (!result) throw new createHttpError.NotFound("Calendário não encontrada.");
		return res.status(200).json({ data: result });
	}

	const calendars = await collection.find({}).toArray();
	return res.status(200).json({ data: calendars });
};

export default apiHandler({
	GET: getCalendarsRoute,
});
