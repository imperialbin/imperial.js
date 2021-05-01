/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";
import { ID_WRONG_TYPE, NO_TOKEN } from "../lib/errors/Messages";
import { createMock } from "../mockHelper";

const IMPERIAL_TOKEN = "IMPERIAL-00000000-0000-0000-0000-000000000000";

const DOCUMENT_ID = "really-valid-id";

const RESPONSE = {
	success: true,
	message: "Successfully edit the document!",
	rawLink: "https://imperialb.in/r/bwxUUGyD",
	formattedLink: "https://imperialb.in/p/bwxUUGyD",
	document: {
		documentId: DOCUMENT_ID,
		language: null,
		imageEmbed: false,
		instantDelete: false,
		dateCreated: 1617463955786,
		deleteDate: 1617895955786,
		allowedEditors: [],
		encrypted: false,
	},
};

describe("editDocument", () => {
	it("valid with token", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		createMock({
			method: "patch",
			path: "/api/document",
			responseBody: RESPONSE,
			statusCode: 200,
		});

		let res = await api.editDocument(DOCUMENT_ID, "Tests: editDocument #2");

		expect(res.id).toBe(DOCUMENT_ID);

		createMock({
			method: "patch",
			path: "/api/document",
			responseBody: RESPONSE,
			statusCode: 200,
		});

		res = await api.editDocument(new URL(`https://imperialb.in/p/${DOCUMENT_ID}`), "Tests: editDocument #3");

		expect(res.id).toBe(DOCUMENT_ID);
	}, 10000); // timeout 10s

	it("valid without token", async () => {
		const api = new Imperial();

		await expect(
			(async () => {
				await api.editDocument("test jest bro", "test jest bro");
			})(),
		).rejects.toThrow(new Error(NO_TOKEN));
	}, 10000); // timeout 10s

	it("invalid - first param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError(ID_WRONG_TYPE);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument({}, "bbbbbb");
			})(),
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument([], "bbbbbb");
			})(),
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument(12345, "bbbbbb");
			})(),
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument(() => {}, "bbbbbb"); // eslint-disable-line @typescript-eslint/no-empty-function
			})(),
		).rejects.toThrow(err);
	});

	it("invalid - no data", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument();
			})(),
		).rejects.toThrow(new Error("No `id` was provided!"));
	});
});
