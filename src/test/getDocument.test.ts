/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import fetchMockJest from "fetch-mock-jest";
import { URL } from "url";
jest.mock("node-fetch", () => fetchMockJest.sandbox());

import { Imperial } from "../lib";
import { ID_WRONG_TYPE, NO_ID } from "../lib/errors/Messages";
import { IMPERIAL_TOKEN, RESPONSE } from "./common";
const fetchMock: typeof fetchMockJest = require("node-fetch");

describe("createDocument", () => {
	let client: Imperial;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		fetchMock.get(`${client.rest.api}/document/${RESPONSE.document.documentId}`, {
			body: { success: true },
			headers: { "Content-Type": "application/json" },
		});
	});

	it("should fetch a document - fully valid", async () => {
		await client.getDocument(RESPONSE.document.documentId);

		await client.getDocument(new URL(`https://${client.rest.hostname}/p/${RESPONSE.document.documentId}`));
	});

	it("should fail to fetch a document - wrong id type", async () => {
		const error = new Error(ID_WRONG_TYPE);

		await expect(client.getDocument({})).rejects.toThrow(error);

		await expect(client.getDocument([])).rejects.toThrow(error);

		await expect(client.getDocument(12345)).rejects.toThrow(error);

		await expect(client.getDocument(() => {})).rejects.toThrow(error);
	});

	it("should fail to fetch a document - no id", async () => {
		// @ts-expect-error
		await expect(client.getDocument()).rejects.toThrow(new Error(NO_ID));
	});

	afterEach(() => {
		fetchMock.reset();
	});
});
