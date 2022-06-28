import { Imperial } from "../../lib";
import { Error, TypeError } from "../../lib/errors";
import { IMPERIAL_TOKEN, RESPONSE_DOCUMENT } from "../common";
import MockAdapter from "axios-mock-adapter";

describe("createDocument", () => {
	let client: Imperial;
	let mock: MockAdapter;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		mock = new MockAdapter(client.rest.axios);

		mock.onDelete(`${client.rest.api}/document/${RESPONSE_DOCUMENT.data.id}`).reply(
			200,
			{ success: true },
			{
				"Content-Type": "application/json",
			},
		);
	});

	it("should delete a document - fully valid", async () => {
		await client.document.delete(RESPONSE_DOCUMENT.data.id);
	});

	it("should fail to delete a document - no token", async () => {
		client.setApiToken(undefined);

		await expect(client.document.delete(RESPONSE_DOCUMENT.data.id)).rejects.toThrow(new Error("NO_TOKEN"));
	});

	it("should fail to delete a document - wrong id type", async () => {
		const error = new TypeError("ID_WRONG_TYPE");

		// @ts-expect-error test
		await expect(client.document.delete({})).rejects.toThrow(error);

		// @ts-expect-error test

		await expect(client.document.delete([])).rejects.toThrow(error);

		// @ts-expect-error test
		await expect(client.document.delete(12345)).rejects.toThrow(error);

		// @ts-expect-error test
		await expect(client.document.delete(() => {})).rejects.toThrow(error);
	});

	it("should fail to delete a document - no id", async () => {
		// @ts-expect-error
		await expect(client.document.delete()).rejects.toThrow(new Error("NO_ID"));
	});

	afterEach(() => {
		mock.reset();
	});
});
