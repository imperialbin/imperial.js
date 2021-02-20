/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";

const { IMPERIAL_TOKEN } = process.env;

describe("createDocument", () => {
	if (!IMPERIAL_TOKEN) throw new Error("Env was not preparerd");

	it("valid with token", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const res = await api.createDocument("test jest bro", { instantDelete: true });

		expect(res.success).toBeTruthy();
		expect(res.instantDelete).toBeTruthy();
	}, 10000); // timeout 10s

	it("valid without token", async () => {
		const api = new Imperial();

		const res = await api.createDocument("test jest bro", { instantDelete: true });

		expect(res.success).toBeTruthy();
		expect(res.instantDelete).toBeFalsy();
	}, 10000); // timeout 10s

	it("invalid - data with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);
		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument({});
				// @ts-ignore
				await api.createDocument([]);
				// @ts-ignore
				await api.createDocument(12345);
				// @ts-ignore
				await api.createDocument(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
			})()
		).rejects.toThrow(new TypeError("Parameter `text` must be a string!"));
	});

	it("invalid - no data", async () => {
		const api = new Imperial();

		await expect(
			(async () => {
				//@ts-ignore
				await api.createDocument();
			})()
		).rejects.toThrow(new Error("No `text` was provided!"));
	});
});
