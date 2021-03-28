/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";
import { createMock } from "../testServer";

const IMPERIAL_TOKEN = "IMPERIAL-00000000-0000-0000-0000-000000000000";

describe("getDocument", () => {
	it("valid with token", async () => {
		const DOCUMENT_ID = "really-valid-id";

		const api = new Imperial(IMPERIAL_TOKEN);

		createMock({
			method: "get",
			path: `/api/document/${DOCUMENT_ID}`,
			responseBody: {
				success: true,
				document: "The document",
			},
			statusCode: 200,
		});

		let res = await api.getDocument(DOCUMENT_ID);

		expect(typeof res.document).toBe("string");

		createMock({
			method: "get",
			path: `/api/document/${DOCUMENT_ID}`,
			responseBody: {
				success: true,
				document: "The document",
			},
			statusCode: 200,
		});

		res = await api.getDocument(new URL(`https://imperialb.in/p/${DOCUMENT_ID}`));

		expect(typeof res.document).toBe("string");
	}, 10000); // timout 10s

	it.skip("valid without token", async () => {
		const DOCUMENT_ID = "really-valid-id";

		const api = new Imperial();

		createMock({
			method: "get",
			path: `/api/document/${DOCUMENT_ID}`,
			responseBody: {
				success: true,
				message: "The document was deleted!",
			},
			statusCode: 200,
		});

		const res = await api.getDocument(DOCUMENT_ID);

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
