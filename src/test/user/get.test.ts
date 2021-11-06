/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import fetchMockJest from "fetch-mock-jest";
jest.mock("node-fetch", () => fetchMockJest.sandbox());

import { Imperial } from "../../lib";
import { Error, TypeError } from "../../lib/errors";
import { IMPERIAL_TOKEN, RESPONSE_USER, TEST_USERNAME } from "../common";
const fetchMock: typeof fetchMockJest = require("node-fetch");

describe("getDocument", () => {
	let client: Imperial;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		fetchMock.get(`${client.rest.api}/user/${TEST_USERNAME}`, {
			body: RESPONSE_USER,
			headers: { "Content-Type": "application/json" },
		});
	});

	it("should fetch a document - fully valid", async () => {
		await client.users.get(TEST_USERNAME);
	});

	it("should fail to fetch a document - wrong id type", async () => {
		const error = new TypeError("USERNAME_WRONG_TYPE");

		// @ts-expect-error
		await expect(client.users.get({})).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.users.get([])).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.users.get(12345)).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.users.get(() => {})).rejects.toThrow(error);
	});

	it("should fail to fetch a document - no id", async () => {
		// @ts-expect-error
		await expect(client.users.get()).rejects.toThrow(new Error("NO_USERNAME"));
	});

	afterEach(() => {
		fetchMock.reset();
	});
});
