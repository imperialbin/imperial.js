/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import fetchMockJest from "fetch-mock-jest";
import { URL } from "url";
jest.mock("node-fetch", () => fetchMockJest.sandbox());

import { Document, Imperial } from "../lib";
import { ID_WRONG_TYPE, NO_ID, NO_TEXT, NO_TOKEN } from "../lib/errors/Messages";
import { IMPERIAL_TOKEN, RESPONSE } from "./common";
const fetchMock: typeof fetchMockJest = require("node-fetch");

describe("createDocument", () => {
	let client: Imperial;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		fetchMock.patch(`${client.rest.hostname}${client.rest.version}/document`, (_: any, req: any) => {
			if (JSON.parse(req.body).document !== RESPONSE.document.documentId)
				return {
					body: { success: false },
					status: 400,
				};

			return {
				body: RESPONSE,
				headers: { "Content-Type": "application/json" },
			};
		});
	});

	it("should edit a document - fully valid", async () => {
		await client.editDocument(RESPONSE.document.documentId, "i am a valid edit");

		await client.editDocument(
			new URL(`https://imperialb.in/p/${RESPONSE.document.documentId}`),
			"i am a valid edit",
		);
	});

	it("should edit a document - text not a string", async () => {
		// @ts-expect-error
		await expect(client.editDocument(RESPONSE.document.documentId, {})).resolves.toBeInstanceOf(Document);

		// @ts-expect-error
		await expect(client.editDocument(RESPONSE.document.documentId, [])).resolves.toBeInstanceOf(Document);

		// @ts-expect-error
		await expect(client.editDocument(RESPONSE.document.documentId, 12345)).resolves.toBeInstanceOf(Document);

		// @ts-expect-error
		await expect(client.editDocument(RESPONSE.document.documentId, () => {})).resolves.toBeInstanceOf(Document);
	});

	it("should fail to edit a document - no token", async () => {
		client.setApiToken(undefined);

		await expect(async () => {
			await client.editDocument(RESPONSE.document.documentId, "i am a valid edit");
		}).rejects.toThrow(new Error(NO_TOKEN));
	});

	it("should fail to delete a document - no id", async () => {
		// @ts-expect-error
		await expect(client.editDocument()).rejects.toThrow(new Error(NO_ID));
	});

	it("should fail to edit a document - wrong type of id", async () => {
		const error = new Error(ID_WRONG_TYPE);

		// @ts-expect-error
		await expect(client.editDocument({})).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.editDocument([])).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.editDocument(12345)).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.editDocument(() => {})).rejects.toThrow(error);
	});

	it("should fail to delete a document - no text", async () => {
		// @ts-expect-error
		await expect(client.editDocument(RESPONSE.document.documentId)).rejects.toThrow(new Error(NO_TEXT));
	});

	afterEach(() => {
		fetchMock.reset();
	});
});
