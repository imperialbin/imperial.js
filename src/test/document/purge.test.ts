import { Imperial } from "../../lib";
import { Error } from "../../lib/errors";
import { IMPERIAL_TOKEN } from "../common";
import MockAdapter from "axios-mock-adapter";

const numberDeleted = 0;

describe("createDocument", () => {
	let client: Imperial;
	let mock: MockAdapter;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		mock = new MockAdapter(client.rest.axios);
	});

	it.skip("should purge document - valid", async () => {
		// @ts-ignore
		const response = await client.purgeDocuments();

		expect(response.numberDeleted).toBe(numberDeleted);
	});

	it.skip("should not purge document - no token", async () => {
		client.setApiToken();

		// @ts-ignore
		await expect(client.purgeDocuments()).rejects.toThrowError(new Error("NO_TOKEN"));
	});

	afterEach(() => {
		mock.reset();
	});
});
