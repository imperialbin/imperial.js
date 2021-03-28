/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";
import { createMock } from "../testServer";

const IMPERIAL_TOKEN = "IMPERIAL-00000000-0000-0000-0000-000000000000";

describe("createDocument", () => {
	it("valid - with token", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		createMock({
			method: "post",
			path: "/api/document",
			responseBody: {
				success: true,
				documentId: "The document!",
				instantDelete: true,
			},
			statusCode: 200,
		});

		const res = await api.createDocument("Test: createDocument > valid - with token", { instantDelete: true });

		expect(typeof res.documentId).toBe("string");
		expect(res.instantDelete).toBeTruthy();
	}, 10000); // timeout 10s

	// No need to test without token because it would have done
	// the exact same thing but settings would not be set
	it.skip("valid - without token", async () => {
		const api = new Imperial();

		const res = await api.createDocument("Test: createDocument > valid - without token", { instantDelete: true });

		expect(res.instantDelete).toBeFalsy();
	}, 10000); // timeout 10s

	it("invalid - first param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `text` must be a string!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument({});
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument([]);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument(12345);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
			})()
		).rejects.toThrow(err);
	});

	it("invalid - second param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `options` must be an Object!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument("Test: createDocument > invalid - second param with wrong type #1", "");
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument("Test: createDocument > invalid - second param with wrong type #2", []);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument("Test: createDocument > invalid - second param with wrong type #3", 12345);
			})()
		).rejects.toThrow(err);
	});

	it("invalid - third param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `callback` must be callable!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument("Test: createDocument > invalid - third param with wrong type #1", {}, 12345);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument("Test: createDocument > invalid - third param with wrong type #2", {}, {});
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument("Test: createDocument > invalid - third param with wrong type #3", {}, []);
			})()
		).rejects.toThrow(err);
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
