/* eslint-disable import/first */
/* eslint-disable import/newline-after-import */
import fetchMockJest from "fetch-mock-jest";
jest.mock("node-fetch", () => fetchMockJest.sandbox());

import { Imperial } from "../lib";
import { NO_TOKEN } from "../lib/errors/Messages";
import { IMPERIAL_TOKEN } from "./common";
const fetchMock: typeof fetchMockJest = require("node-fetch");

const numberDeleted = 420;

describe("createDocument", () => {
	let client: Imperial;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		fetchMock.delete(`${client.rest.api}/purgeDocuments`, {
			body: {
				success: true,
				message: "Deleted a total of 420 documents!",
				numberDeleted,
			},
			headers: { "Content-Type": "application/json" },
		});
	});

	it("should purge document - valid", async () => {
		const response = await client.purgeDocuments();

		expect(response.numberDeleted).toBe(numberDeleted);
	});

	it("should not purge document - no token", async () => {
		client.setApiToken();

		await expect(client.purgeDocuments()).rejects.toThrowError(new Error(NO_TOKEN));
	});

	afterEach(() => {
		fetchMock.reset();
	});
});
