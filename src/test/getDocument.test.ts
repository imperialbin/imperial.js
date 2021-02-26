/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";

const { IMPERIAL_TOKEN } = process.env;

let documentToRead = "";

describe("getDocument", () => {
	if (!IMPERIAL_TOKEN) throw new Error("Env was not preparerd");

	beforeAll(async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		try {
			const res = await api.createDocument("test jest bro");
			if (!res.success) throw new Error("Failed to prepare tests.");
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

		const res = await api.getDocument(documentToRead);

		expect(res.success).toBeTruthy();
		expect(typeof res.document).toBe("string");
	}, 10000); // timout 10s

	it.skip("valid without token", async () => {
		const api = new Imperial();

		const res = await api.getDocument(documentToRead);

		expect(res.success).toBeTruthy();
		expect(typeof res.document).toBe("string");
	}, 10000); // timout 10s

	it("invalid - first param with wrong type", async () => {
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
		).rejects.toThrowError(new TypeError("Parameter `id` must be a string or an URL!"));
	});

	it("invalid - second param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);
		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument("bbbbbb", {});
				// @ts-ignore
				await api.getDocument("bbbbbb", []);
				// @ts-ignore
				await api.getDocument("bbbbbb", 12345);
			})()
		).rejects.toThrowError(new TypeError("Parameter `password` must be a string!"));
	});

	it("invalid - third param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);
		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument("bbbbbb", "bbbbbb", "");
				// @ts-ignore
				await api.getDocument("bbbbbb", "bbbbbb", {});
				// @ts-ignore
				await api.getDocument("bbbbbb", "bbbbbb", []);
				// @ts-ignore
				await api.getDocument("bbbbbb", "bbbbbb", 12345);
			})()
		).rejects.toThrowError(new TypeError("Parameter `callback` must be callable!"));
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
