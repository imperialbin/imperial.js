module.exports = {
	roots: ["<rootDir>/src"],
	testMatch: ["**/test/**/*.+(ts|js)"],
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
	setupFiles: ["dotenv/config"],
};
