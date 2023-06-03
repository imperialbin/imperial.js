import { Imperial } from "../../lib";
import { Error, TypeError } from "../../lib/errors";
import { IMPERIAL_TOKEN, RESPONSE_USER, TEST_USERNAME } from "../common";
import MockAdapter from "axios-mock-adapter";

describe("createDocument", () => {
	let client: Imperial;
	let mock: MockAdapter;

	beforeEach(() => {
		client = new Imperial(IMPERIAL_TOKEN);

		mock = new MockAdapter(client.rest.axios);

		mock.onGet(`${client.rest.api}/users/${TEST_USERNAME}`).reply(200, RESPONSE_USER, {
			"Content-Type": "application/json",
		});
	});

	it("should fetch a user - fully valid", async () => {
		await client.users.get(TEST_USERNAME);
	});

	it("should fail to fetch a user - wrong username type", async () => {
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

	it("should fail to fetch a usert - no username", async () => {
		// @ts-expect-error
		await expect(client.users.get()).rejects.toThrow(new Error("NO_USERNAME"));
	});

	afterEach(() => {
		mock.reset();
	});
});
