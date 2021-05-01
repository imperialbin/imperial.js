/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";
import { NO_TOKEN } from "../lib/errors/Messages";
import { createMock } from "../mockHelper";

const IMPERIAL_TOKEN = "IMPERIAL-00000000-0000-0000-0000-000000000000";

const RESPONSE = {
	success: true,
	message: "Deleted a total of 420 documents!",
	numberDeleted: 420,
};

describe("purgeDocuments", () => {
	it("valid", async () => {
		createMock({
			method: "delete",
			path: "/api/purgeDocuments",
			responseBody: RESPONSE,
			statusCode: 200,
		});

		const api = new Imperial(IMPERIAL_TOKEN);

		const response = await api.purgeDocuments();

		expect(response.numberDeleted).toBe(RESPONSE.numberDeleted);
	}, 10000);

	it("invalid", async () => {
		const api = new Imperial();

		await expect(
			(async () => {
				await api.purgeDocuments();
			})(),
		).rejects.toThrowError(new Error(NO_TOKEN));
	});
});
