/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import fetchMockJest from "fetch-mock-jest";
import { URL } from "url";
jest.mock("node-fetch", () => fetchMockJest.sandbox());

import { Imperial } from "../../lib";
import { Error, TypeError } from "../../lib/errors";
import { IMPERIAL_TOKEN, RESPONSE_DOCUMENT } from "../common";
const fetchMock: typeof fetchMockJest = require("node-fetch");

describe("deleteDocument", () => {
	let client: Imperial;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		fetchMock.delete(`${client.rest.api}/document/${RESPONSE_DOCUMENT.data.id}`, {
			body: { success: true },
			headers: { "Content-Type": "application/json" },
		});
	});

	it("should delete a document - fully valid", async () => {
		await client.document.delete(RESPONSE_DOCUMENT.data.id);

		await client.document.delete(new URL(`https://${client.rest.hostname}/${RESPONSE_DOCUMENT.data.id}`));
	});

	it("should fail to delete a document - no token", async () => {
		client.setApiToken(undefined);

		await expect(client.document.delete(RESPONSE_DOCUMENT.data.id)).rejects.toThrow(new Error("NO_TOKEN"));
	});

	it("should fail to delete a document - wrong id type", async () => {
		const error = new TypeError("ID_WRONG_TYPE");

		await expect(client.document.delete({})).rejects.toThrow(error);

		await expect(client.document.delete([])).rejects.toThrow(error);

		await expect(client.document.delete(12345)).rejects.toThrow(error);

		await expect(client.document.delete(() => {})).rejects.toThrow(error);
	});

	it("should fail to delete a document - no id", async () => {
		// @ts-expect-error
		await expect(client.document.delete()).rejects.toThrow(new Error("NO_ID"));
	});

	afterEach(() => {
		fetchMock.reset();
	});
});
