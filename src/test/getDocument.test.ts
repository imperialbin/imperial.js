/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";

const { IMPERIAL_TOKEN } = process.env;

let documentToRead = "";

describe("getDocument", () => {
	if (!IMPERIAL_TOKEN) throw new Error("Env was not preparerd");

	beforeAll(async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		try {
			const res = await api.createDocument("Tests: getDocument");
			documentToRead = res.formattedLink;
		} catch (e) {
			throw new Error("Failed to prepare tests.");
		}
	});

	afterAll(async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		try {
			await api.deleteDocument(documentToRead);
		} catch (_) {
			throw new Error("Failed to delete tested files.");
		}
	});

	it("valid with token", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		let res = await api.getDocument(documentToRead);

		expect(typeof res.document).toBe("string");

		res = await api.getDocument(new URL(documentToRead));

		expect(typeof res.document).toBe("string");
	}, 10000); // timout 10s

	it.skip("valid without token", async () => {
		const api = new Imperial();

		const res = await api.getDocument(documentToRead);

		expect(typeof res.document).toBe("string");
	}, 10000); // timout 10s

	it("invalid - first param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `id` must be a string or an URL!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument({});
			})()
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument([]);
			})()
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument(12345);
			})()
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
			})()
		).rejects.toThrowError(err);
	});

	it("invalid - second param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `password` must be a string!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument("bbbbbb", {});
			})()
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument("bbbbbb", []);
			})()
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument("bbbbbb", 12345);
			})()
		).rejects.toThrowError(err);
	});

	it("invalid - third param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `callback` must be callable!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument("bbbbbb", "bbbbbb", "");
			})()
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument("bbbbbb", "bbbbbb", {});
			})()
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument("bbbbbb", "bbbbbb", []);
			})()
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument("bbbbbb", "bbbbbb", 12345);
			})()
		).rejects.toThrowError(err);
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
