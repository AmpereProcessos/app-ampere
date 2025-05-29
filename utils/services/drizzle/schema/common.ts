import { pgTableCreator } from "drizzle-orm/pg-core";
import { IGREEN_DATABASE_PREFIX as prefix } from '@/utils/constants'

export const pgTable = pgTableCreator((name) => `${prefix}_${name}`);
