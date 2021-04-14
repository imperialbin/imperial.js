/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";
import { NO_TOKEN } from "../lib/helper/errors";
import { createMock } from "../mockHelper";

const IMPERIAL_TOKEN = "IMPERIAL-00000000-0000-0000-0000-000000000000";

describe("purgeDocuments", () => {
	it("valid", async () => {
		createMock({
			method: "delete",
			path: "/api/purgeDocuments",
			responseBody: {
				success: true,
				message: "Deleted a total of 420 documents!",
				numberDeleted: 420,
			},
			statusCode: 200,
		});

		const api = new Imperial(IMPERIAL_TOKEN);

		await api.purgeDocuments();
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
