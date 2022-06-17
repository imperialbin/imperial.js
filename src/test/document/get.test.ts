import { Imperial } from "../../lib";
import { Error, TypeError } from "../../lib/errors";
import { IMPERIAL_TOKEN, RESPONSE_DOCUMENT } from "../common";
import { URL } from "url";
import MockAdapter from "axios-mock-adapter";

describe("createDocument", () => {
	let client: Imperial;
	let mock: MockAdapter;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		mock = new MockAdapter(client.rest.axios);

		mock.onGet(`${client.rest.api}/document/${RESPONSE_DOCUMENT.data.id}`).reply(200, RESPONSE_DOCUMENT, {
			"Content-Type": "application/json",
		});
	});

	it("should fetch a document - fully valid", async () => {
		await client.document.get(RESPONSE_DOCUMENT.data.id);

		await client.document.get(new URL(`https://${client.rest.hostname}/${RESPONSE_DOCUMENT.data.id}`));
	});

	it("should fail to fetch a document - wrong id type", async () => {
		const error = new TypeError("ID_WRONG_TYPE");

		await expect(client.document.get({})).rejects.toThrow(error);

		await expect(client.document.get([])).rejects.toThrow(error);

		await expect(client.document.get(12345)).rejects.toThrow(error);

		await expect(client.document.get(() => {})).rejects.toThrow(error);
	});

	it("should fail to fetch a document - no id", async () => {
		// @ts-expect-error
		await expect(client.document.get()).rejects.toThrow(new Error("NO_ID"));
	});

	afterEach(() => {
		mock.reset();
	});
});
