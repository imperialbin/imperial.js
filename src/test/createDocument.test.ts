/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";

const { IMPERIAL_TOKEN } = process.env;

const createdDocuments: string[] = [];

describe("createDocument", () => {
	if (!IMPERIAL_TOKEN) throw new Error("Env was not preparerd");

	afterAll(async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		for (const document of createdDocuments)
			try {
				await api.deleteDocument(document);
			} catch (_) {
				throw new Error("Failed to delete tested files.");
			}
	});

	it("valid with token", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const res = await api.createDocument("test jest bro", { instantDelete: true });

		expect(res.success).toBeTruthy();
		expect(res.instantDelete).toBeTruthy();

		if (res.success) createdDocuments.push(res.formattedLink);
	}, 10000); // timeout 10s

	// No need to test without token because it would have done
	// the exact same thing but settings would not be set
	it.skip("valid without token", async () => {
		const api = new Imperial();

		const res = await api.createDocument("test jest bro", { instantDelete: true });

		expect(res.success).toBeTruthy();
		expect(res.instantDelete).toBeFalsy();
	}, 10000); // timeout 10s

	it("invalid - first param with wrong type", async () => {
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

	it("invalid - second param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);
		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument("jest test bro", "");
				// @ts-ignore
				await api.createDocument("jest test bro", []);
				// @ts-ignore
				await api.createDocument("jest test bro", 12345);
			})()
		).rejects.toThrow(new TypeError("Parameter `options` must be an Object!"));
	});

	it("invalid - third param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);
		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument("jest test bro", {}, 12345);
				// @ts-ignore
				await api.createDocument("jest test bro", {}, {});
				// @ts-ignore
				await api.createDocument("jest test bro", {}, []);
			})()
		).rejects.toThrow(new TypeError("Parameter `callback` must be callable!"));
	});

	it("invalid - no data", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		await expect(
			(async () => {
				//@ts-ignore
				await api.createDocument();
			})()
		).rejects.toThrow(new Error("No `text` was provided!"));
	});
});
