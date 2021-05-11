/* eslint @typescript-eslint/ban-ts-comment:0 */

import { URL } from "url";
import { Document, Imperial } from "../lib";
import { ID_WRONG_TYPE, PASSWORD_WRONG_TYPE } from "../lib/errors/Messages";
import { createMock } from "./mockHelper";

const IMPERIAL_TOKEN = "IMPERIAL-00000000-0000-0000-0000-000000000000";

const RESPONSE = {
	success: true,
	content: "eqeqeqeqeqeqeq",
	document: {
		documentId: "bwxUUGyD",
		language: null,
		imageEmbed: false,
		instantDelete: false,
		dateCreated: 1617463955786,
		deleteDate: 1617895955786,
		allowedEditors: [],
		encrypted: false,
	},
};

describe("getDocument", () => {
	it("valid with token", async () => {
		const DOCUMENT_ID = "really-valid-id";

		const api = new Imperial(IMPERIAL_TOKEN);

		createMock({
			method: "get",
			path: `/api/document/${DOCUMENT_ID}`,
			responseBody: RESPONSE,
			statusCode: 200,
		});

		let res = await api.getDocument(DOCUMENT_ID);

		expect(res).toBeInstanceOf(Document);

		createMock({
			method: "get",
			path: `/api/document/${DOCUMENT_ID}`,
			responseBody: RESPONSE,
			statusCode: 200,
		});

		res = await api.getDocument(new URL(`https://imperialb.in/p/${DOCUMENT_ID}`));

		expect(res).toBeInstanceOf(Document);
	}, 10000); // timout 10s

	it("invalid - first param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError(ID_WRONG_TYPE);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument({});
			})(),
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument([]);
			})(),
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument(12345);
			})(),
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
			})(),
		).rejects.toThrowError(err);
	});

	it("invalid - second param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError(PASSWORD_WRONG_TYPE);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument("bbbbbb", {});
			})(),
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument("bbbbbb", []);
			})(),
		).rejects.toThrowError(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument("bbbbbb", 12345);
			})(),
		).rejects.toThrowError(err);
	});

	it("invalid - no data", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		await expect(
			(async () => {
				// @ts-ignore
				await api.getDocument();
			})(),
		).rejects.toThrowError(new Error("No `id` was provided!"));
	});
});
