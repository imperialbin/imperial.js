/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";

const { IMPERIAL_TOKEN, IMPERIAL_VALID_DOCUMENT_URL } = process.env;

describe("getDocument", () => {
	if (!IMPERIAL_TOKEN || !IMPERIAL_VALID_DOCUMENT_URL) throw new Error("Env was not preparerd");

	it("valid with token", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const res = await api.getDocument(IMPERIAL_VALID_DOCUMENT_URL);

		expect(res.success).toBeTruthy();
		expect(typeof res.document).toBe(typeof String());
	}, 10000); // timout 10s

	it("valid without token", async () => {
		const api = new Imperial();

		const res = await api.getDocument(IMPERIAL_VALID_DOCUMENT_URL);

		expect(res.success).toBeTruthy();
		expect(typeof res.document).toBe(typeof String());
	}, 10000); // timout 10s

	it("invalid - data with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);
		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument({});
				// @ts-ignore
				await api.getDocument([]);
				// @ts-ignore
				await api.getDocument(12345);
				// @ts-ignore
				await api.getDocument(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
			})()
		).rejects.toThrowError(new TypeError("Parameter `id` must be a string!"));
	});

	it("invalid - no data", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		await expect(
			(async () => {
				//@ts-ignore
				await api.getDocument();
			})()
		).rejects.toThrowError(new Error("No `id` was provided!"));
	});
});
