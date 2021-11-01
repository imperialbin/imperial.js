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
		expect(user.icon).toBe(RESPONSE_USER.data.icon);
		expect(user.banned).toBe(RESPONSE_USER.data.banned);
		expect(user.memberPlus).toBe(RESPONSE_USER.data.memberPlus);
		expect(user.toString()).toBe(RESPONSE_USER.data.username);
	});
});
