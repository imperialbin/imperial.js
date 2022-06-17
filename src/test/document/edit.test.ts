import { Document, Imperial } from "../../lib";
import { Error, TypeError } from "../../lib/errors";
import { IMPERIAL_TOKEN, RESPONSE_DOCUMENT } from "../common";
import MockAdapter from "axios-mock-adapter";
import type { AxiosRequestConfig } from "axios";
import { URL } from "url";

describe("createDocument", () => {
	let client: Imperial;
	let mock: MockAdapter;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		mock = new MockAdapter(client.rest.axios);

		mock.onPatch(`${client.rest.api}/document`).reply((config: AxiosRequestConfig) => {
			if (JSON.parse(config.data).id !== RESPONSE_DOCUMENT.data.id) return [400, { success: false }];

			return [200, RESPONSE_DOCUMENT, { "Content-Type": "application/json" }];
		});
	});

	it("should edit a document - fully valid", async () => {
		await client.document.edit(RESPONSE_DOCUMENT.data.id, "i am a valid edit");

		await client.document.edit(
			new URL(`https://${client.rest.hostname}/${RESPONSE_DOCUMENT.data.id}`),
			"i am a valid edit",
		);
	});

	it("should edit a document - text not a string", async () => {
		// @ts-expect-error
		await expect(client.document.edit(RESPONSE_DOCUMENT.data.id, {})).resolves.toBeInstanceOf(Document);

		// @ts-expect-error
		await expect(client.document.edit(RESPONSE_DOCUMENT.data.id, [])).resolves.toBeInstanceOf(Document);

		// @ts-expect-error
		await expect(client.document.edit(RESPONSE_DOCUMENT.data.id, 12345)).resolves.toBeInstanceOf(Document);

		// @ts-expect-error
		await expect(client.document.edit(RESPONSE_DOCUMENT.data.id, () => {})).resolves.toBeInstanceOf(Document);
	});

	it("should fail to edit a document - no token", async () => {
		client.setApiToken(undefined);

		await expect(client.document.edit(RESPONSE_DOCUMENT.data.id, "i am a valid edit")).rejects.toThrow(
			new Error("NO_TOKEN"),
		);
	});

	it("should fail to delete a document - no id", async () => {
		// @ts-expect-error
		await expect(client.document.edit()).rejects.toThrow(new Error("NO_ID"));
	});

	it("should fail to edit a document - wrong type of id", async () => {
		const error = new TypeError("ID_WRONG_TYPE");

		// @ts-expect-error
		await expect(client.document.edit({})).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.document.edit([])).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.document.edit(12345)).rejects.toThrow(error);

		// @ts-expect-error
		await expect(client.document.edit(() => {})).rejects.toThrow(error);
	});

	it("should fail to delete a document - no text", async () => {
		// @ts-expect-error
		await expect(client.document.edit(RESPONSE_DOCUMENT.data.id)).rejects.toThrow(new Error("NO_TEXT"));
	});

	afterEach(() => {
		mock.reset();
	});
});
