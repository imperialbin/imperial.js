/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import fetchMockJest from "fetch-mock-jest";
jest.mock("node-fetch", () => fetchMockJest.sandbox());

import { Document, Imperial } from "../../lib";
import { Error, TypeError } from "../../lib/errors";
import { IMPERIAL_TOKEN, RESPONSE_DOCUMENT } from "../common";
const fetchMock: typeof fetchMockJest = require("node-fetch");

describe("createDocument", () => {
	let client: Imperial;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		fetchMock.post(`${client.rest.api}/document`, {
			body: RESPONSE_DOCUMENT,
			headers: { "Content-Type": "application/json" },
		});
	});

	it("should create a document - fully valid", async () => {
		const document = await client.document.create("i am a valid request");

		expect(document.id).toBe(RESPONSE_DOCUMENT.data.id);
		expect(document.settings.public).toBe(RESPONSE_DOCUMENT.data.settings.public);
		expect(document.settings.imageEmbed).toBe(RESPONSE_DOCUMENT.data.settings.imageEmbed);
	});

	it("should create a document - text not a string", async () => {
		// @ts-expect-error
		await expect(client.document.create({})).resolves.toBeInstanceOf(Document);

		// @ts-expect-error
		await expect(client.document.create([])).resolves.toBeInstanceOf(Document);

		// @ts-expect-error
		await expect(client.document.create(12345)).resolves.toBeInstanceOf(Document);

		// @ts-expect-error
		await expect(client.document.create(() => {})).resolves.toBeInstanceOf(Document);
	});

	it("should fail to create a document - wrong second parameter", async () => {
		const error = new TypeError("OPTIONS_WRONG_TYPE");

		// @ts-expect-error
		await expect(client.document.create("STRING", "")).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.document.create("ARRAY", [])).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.document.create("NUMBER", 12345)).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.document.create("NULL", null)).rejects.toThrow(error);
	});

	it("should fail to create a document - no data", async () => {
		// @ts-expect-error
		await expect(client.document.create()).rejects.toThrow(new Error("NO_TEXT"));
	});

	afterEach(() => {
		fetchMock.reset();
	});
});
