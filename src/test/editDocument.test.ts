/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";

const { IMPERIAL_TOKEN } = process.env;

let documentToEdit = "";

describe("editDocument", () => {
	if (!IMPERIAL_TOKEN) throw new Error("Env was not preparerd");

	beforeAll(async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		try {
			const res = await api.createDocument("test jest bro");
			if (!res.success) throw new Error("Failed to prepare tests.");
			documentToEdit = res.formattedLink;
		} catch (e) {
			throw new Error("Failed to prepare tests.");
		}
	});

	afterAll(async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		try {
			await api.deleteDocument("test jest bro");
		} catch (e) {
			throw new Error("Failed to cleanup tests.");
		}
	});
	it("valid with token", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const res = await api.editDocument(documentToEdit, "test jest bro!!!");
		expect(res.success).toBeTruthy();
		expect(/^successfully(a-zA-Z\s)*/i.test(res.message)).toBeTruthy();
	}, 10000); // timeout 10s

	it("valid without token", async () => {
		const api = new Imperial();

		await expect(
			(async () => {
				await api.editDocument("test jest bro", "test jest bro");
			})()
		).rejects.toThrow(new Error("This method requires a token to be set in the constructor!"));
	}, 10000); // timeout 10s

	it("invalid - data with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);
		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument({}, "bbbbbb");
				// @ts-ignore
				await api.editDocument([], "bbbbbb");
				// @ts-ignore
				await api.editDocument(12345, "bbbbbb");
				// @ts-ignore
				await api.editDocument(() => {}, "bbbbbb"); // eslint-disable-line @typescript-eslint/no-empty-function
			})()
		).rejects.toThrow(new TypeError("Parameter `id` must be a string or an URL!"));
	});

	it("invalid - no data", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		await expect(
			(async () => {
				//@ts-ignore
				await api.editDocument();
			})()
		).rejects.toThrow(new Error("No `id` was provided!"));
	});
});
