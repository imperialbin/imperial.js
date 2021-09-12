/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import fetchMockJest from "fetch-mock-jest";
jest.mock("node-fetch", () => fetchMockJest.sandbox());

import { Document, Imperial } from "../lib";
import { NO_TEXT, OPTIONS_WRONG_TYPE } from "../lib/errors/Messages";
import { IMPERIAL_TOKEN, RESPONSE } from "./common";
const fetchMock: typeof fetchMockJest = require("node-fetch");

describe("createDocument", () => {
	let client: Imperial;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		fetchMock.post(`${client.rest.api}/document`, {
			body: RESPONSE,
			headers: { "Content-Type": "application/json" },
		});
	});

	it("should create a document - fully valid", async () => {
		const document = await client.createDocument("i am a valid request");

		expect(document.id).toBe(RESPONSE.document.documentId);
		expect(document.public).toBe(RESPONSE.document.public);
		expect(document.imageEmbed).toBe(RESPONSE.document.imageEmbed);
	});

	it("should create a document - text not a string", async () => {
		// @ts-expect-error
		await expect(client.createDocument({})).resolves.toBeInstanceOf(Document);

		// @ts-expect-error
		await expect(client.createDocument([])).resolves.toBeInstanceOf(Document);

		// @ts-expect-error
		await expect(client.createDocument(12345)).resolves.toBeInstanceOf(Document);

		// @ts-expect-error
		await expect(client.createDocument(() => {})).resolves.toBeInstanceOf(Document);
	});

	it("should fail to create a document - wrong second parameter", async () => {
		const error = new TypeError(OPTIONS_WRONG_TYPE);

		// @ts-expect-error
		await expect(client.createDocument("STRING", "")).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.createDocument("ARRAY", [])).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.createDocument("NUMBER", 12345)).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.createDocument("NULL", null)).rejects.toThrow(error);
	});

	it("should fail to create a document - no data", async () => {
		// @ts-expect-error
		await expect(client.createDocument()).rejects.toThrow(new Error(NO_TEXT));
	});

	afterEach(() => {
		fetchMock.reset();
	});
});
