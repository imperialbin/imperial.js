/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";

const { IMPERIAL_TOKEN } = process.env;

describe("verify", () => {
	if (!IMPERIAL_TOKEN) throw new Error("Env was not preparerd");

	it("valid", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const res = await api.verify();

		expect(typeof res.message).toBe("string");
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
