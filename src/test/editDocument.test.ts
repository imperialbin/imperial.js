/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";
import { createMock } from "../testServer";

const IMPERIAL_TOKEN = "IMPERIAL-00000000-0000-0000-0000-000000000000";

describe("editDocument", () => {
	it("valid with token", async () => {
		const DOCUMENT_ID = "really-valid-id";

		const api = new Imperial(IMPERIAL_TOKEN);

		createMock({
			method: "patch",
			path: "/api/document/",
			responseBody: {
				success: true,
				message: "The document was deleted!",
			},
			statusCode: 200,
		});

		let res = await api.editDocument(DOCUMENT_ID, "Tests: editDocument #2");

		expect(typeof res.message).toBe("string");

		createMock({
			method: "patch",
			path: "/api/document/",
			responseBody: {
				success: true,
				message: "The document was deleted!",
			},
			statusCode: 200,
		});

		res = await api.editDocument(new URL(`https://imperialb.in/p/${DOCUMENT_ID}`), "Tests: editDocument #3");

		expect(typeof res.message).toBe("string");
	}, 10000); // timeout 10s

	it("valid without token", async () => {
		const api = new Imperial();

		await expect(
			(async () => {
				await api.editDocument("test jest bro", "test jest bro");
			})()
		).rejects.toThrow(new Error("This method requires a token to be set in the constructor!"));
	}, 10000); // timeout 10s

	it("invalid - first param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `id` must be a string or an URL!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument({}, "bbbbbb");
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument([], "bbbbbb");
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument(12345, "bbbbbb");
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument(() => {}, "bbbbbb"); // eslint-disable-line @typescript-eslint/no-empty-function
			})()
		).rejects.toThrow(err);
	});

	it("invalid - second param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `newText` must be a string!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", {});
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", []);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", 12345);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
			})()
		).rejects.toThrow(err);
	});

	it("invalid - third param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `callback` must be callable!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", "bbbbbb", {});
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", "bbbbbb", []);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", "bbbbbb", 12345);
			})()
		).rejects.toThrow(err);
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
