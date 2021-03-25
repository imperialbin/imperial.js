/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";

const { IMPERIAL_TOKEN } = process.env;

let documentToDelete = "";

describe("deleteDocument", () => {
	if (!IMPERIAL_TOKEN) throw new Error("Env was not preparerd");

	beforeAll(async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		try {
			const res = await api.createDocument("Tests: deleteDocument");
			documentToDelete = res.formattedLink;
		} catch (e) {
			throw new Error("Failed to prepare tests.");
		}
	});

	it("valid - with token", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const res = await api.deleteDocument(documentToDelete);
		expect(/^successfully(a-zA-Z\s)*/i.test(res.message)).toBeTruthy();
	}, 10000); // timeout 10s

	it("valid - without token", async () => {
		const api = new Imperial();

		await expect(
			(async () => {
				await api.deleteDocument("bbbbbb");
			})()
		).rejects.toThrow(new Error("This method requires a token to be set in the constructor!"));
	}, 10000); // timeout 10s

	it("invalid - first param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `id` must be a string or an URL!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.deleteDocument({});
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.deleteDocument([]);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.deleteDocument(12345);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.deleteDocument(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
			})()
		).rejects.toThrow(err);
	});

	it("invalid - second param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `callback` must be callable!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.deleteDocument("bbbbbb", "");
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.deleteDocument("bbbbbb", []);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.deleteDocument("bbbbbb", 12345);
			})()
		).rejects.toThrow(err);
	});

	it("invalid - no data", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		await expect(
			(async () => {
				//@ts-ignore
				await api.deleteDocument();
			})()
		).rejects.toThrow(new Error("No `id` was provided!"));
	});
});
