import { z } from "zod";

export const TimeUnitEnumSchema = z.enum(["DIAS", "SEMANAS", "MESES", "ANOS"]);
export type TTimeUnitEnum = z.infer<typeof TimeUnitEnumSchema>;
