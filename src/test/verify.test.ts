/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";
import { createMock } from "../testServer";

const IMPERIAL_TOKEN = "IMPERIAL-00000000-0000-0000-0000-000000000000";

describe("verify", () => {
	it("valid", async () => {
		createMock({
			method: "get",
			path: `/api/checkApiToken/${IMPERIAL_TOKEN}`,
			responseBody: {
				success: true,
				message: "Token is valid!!!!!",
			},
			statusCode: 200,
		});

		const api = new Imperial(IMPERIAL_TOKEN);

		await api.verify();
	}, 10000);

	it("invalid", async () => {
		const api = new Imperial();

		await expect(
			(async () => {
				await api.verify();
			})()
		).rejects.toThrowError(new Error("No or invalid token was provided in the constructor!"));
	});
});
