/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import fetchMockJest from "fetch-mock-jest";
import { URL } from "url";
jest.mock("node-fetch", () => fetchMockJest.sandbox());

import { Imperial } from "../../lib";
import { ErrorMessage } from "../../lib/errors/Messages";
import { IMPERIAL_TOKEN, RESPONSE_DOCUMENT } from "../common";
const fetchMock: typeof fetchMockJest = require("node-fetch");

describe("getDocument", () => {
	let client: Imperial;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		fetchMock.get(`${client.rest.api}/document/${RESPONSE_DOCUMENT.data.id}`, {
			body: RESPONSE_DOCUMENT,
			headers: { "Content-Type": "application/json" },
		});
	});

	it("should fetch a document - fully valid", async () => {
		await client.document.get(RESPONSE_DOCUMENT.data.id);

		await client.document.get(new URL(`https://${client.rest.hostname}/${RESPONSE_DOCUMENT.data.id}`));
	});

	it("should fail to fetch a document - wrong id type", async () => {
		const error = new TypeError(ErrorMessage("ID_WRONG_TYPE"));

		await expect(client.document.get({})).rejects.toThrow(error);

		await expect(client.document.get([])).rejects.toThrow(error);

		await expect(client.document.get(12345)).rejects.toThrow(error);

		await expect(client.document.get(() => {})).rejects.toThrow(error);
	});

	it("should fail to fetch a document - no id", async () => {
		// @ts-expect-error
		await expect(client.document.get()).rejects.toThrow(new Error(ErrorMessage("NO_ID")));
	});

	afterEach(() => {
		fetchMock.reset();
	});
});
