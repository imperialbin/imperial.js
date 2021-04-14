/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";
import { OPTIONS_WRONG_TYPE, TEXT_WRONG_TYPE } from "../lib/helper/errors";
import { createMock } from "../mockHelper";

const IMPERIAL_TOKEN = "IMPERIAL-00000000-0000-0000-0000-000000000000";

const RESPONSE = {
	success: true,
	rawLink: "https://imperialb.in/r/bwxUUGyD",
	formattedLink: "https://imperialb.in/p/bwxUUGyD",
	document: {
		documentId: "bwxUUGyD",
		language: null,
		imageEmbed: false,
		instantDelete: true,
		dateCreated: 1617463955786,
		deleteDate: 1617895955786,
		allowedEditors: [],
		encrypted: false,
		password: null,
	},
};

describe("createDocument", () => {
	it("valid - with token", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		createMock({
			method: "post",
			path: "/api/document",
			responseBody: RESPONSE,
			statusCode: 200,
		});

		const res = await api.createDocument("Test: createDocument > valid - with token", { instantDelete: true });

		expect(typeof res.id).toBe("string");
		expect(res.instantDelete).toBeTruthy();
	}, 10000); // timeout 10s

	it("invalid - first param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError(TEXT_WRONG_TYPE);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument({});
			})(),
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument([]);
			})(),
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument(12345);
			})(),
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
			})(),
		).rejects.toThrow(err);
	});

	it("invalid - second param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError(OPTIONS_WRONG_TYPE);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument("Test: createDocument > invalid - second param with wrong type #1", "");
			})(),
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument("Test: createDocument > invalid - second param with wrong type #2", []);
			})(),
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument("Test: createDocument > invalid - second param with wrong type #3", 12345);
			})(),
		).rejects.toThrow(err);
	});

	it("invalid - no data", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		await expect(
			(async () => {
				// @ts-ignore
				await api.createDocument();
			})(),
		).rejects.toThrow(new Error("No `text` was provided!"));
	});
});
