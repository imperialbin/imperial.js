import { User, Imperial } from "../../lib";
import { IMPERIAL_TOKEN, RESPONSE_USER } from "../common";

describe("Document", () => {
	const client = new Imperial(IMPERIAL_TOKEN);
	let user: User;

	beforeEach(() => {
		user = new User(client, RESPONSE_USER.data);
	});

	it("should be valid", () => {
		expect(user).toBeInstanceOf(User);
		expect(user.id).toBe(RESPONSE_USER.data.id);
		expect(user.icon).toBe(RESPONSE_USER.data.icon);
		expect(user.toString()).toBe(RESPONSE_USER.data.username);
	});
});
