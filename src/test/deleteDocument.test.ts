/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";
import { ID_WRONG_TYPE, NO_TOKEN } from "../lib/errors/Messages";
import { createMock } from "../mockHelper";

const IMPERIAL_TOKEN = "IMPERIAL-00000000-0000-0000-0000-000000000000";

describe("deleteDocument", () => {
	it("valid - with token", async () => {
		const DOCUMENT_ID = "really-valid-id";

		const api = new Imperial(IMPERIAL_TOKEN);

		createMock({
			method: "delete",
			path: `/api/document/${DOCUMENT_ID}`,
			responseBody: {
				success: true,
				message: "Successfully deleted the document!",
			},
			statusCode: 200,
		});

		await api.deleteDocument(DOCUMENT_ID);

		createMock({
			method: "delete",
			path: `/api/document/${DOCUMENT_ID}`,
			responseBody: {
				success: true,
				message: "Successfully deleted the document!",
			},
			statusCode: 200,
		});

		await api.deleteDocument(new URL(`https://imperialb.in/p/${DOCUMENT_ID}`));
	}, 10000); // timeout 10s

	it("valid - without token", async () => {
		const api = new Imperial();

		await expect(
			(async () => {
				await api.deleteDocument("bbbbbb");
			})(),
		).rejects.toThrow(new Error(NO_TOKEN));
	}, 10000); // timeout 10s

	it("invalid - first param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError(ID_WRONG_TYPE);

		await expect(
			(async () => {
				// @ts-ignore
				await api.deleteDocument({});
			})(),
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.deleteDocument([]);
			})(),
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.deleteDocument(12345);
			})(),
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.deleteDocument(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
			})(),
		).rejects.toThrow(err);
	});

	it("invalid - no data", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		await expect(
			(async () => {
				// @ts-ignore
				await api.deleteDocument();
			})(),
		).rejects.toThrow(new Error("No `id` was provided!"));
	});
});
