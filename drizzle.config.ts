export default {
	schema: "./utils/services/drizzle/schema/*",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.IGREEN_DATABASE_URL,
	},
	tablesFilter: ["project-manager_*"],
};
