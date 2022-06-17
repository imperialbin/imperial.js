import type { User as IUser } from "../types/users";
import { User } from "../classes/User";
import { Error, TypeError } from "../errors";
import { Base } from "../client/Base";
import { requireToken } from "../utils/Decorators";

export class UsersManager extends Base {
	/**
	 *  Get a user from Imperial.
	 *  @param username - The username of the user to get.
	 *  @example client.users.get("pxseu").then(console.log) // Logs the user to the console.
	 */
	@requireToken
	public async get(username: string): Promise<User> {
		if (!username) throw new Error("NO_USERNAME");
		if (typeof username !== "string") throw new TypeError("USERNAME_WRONG_TYPE");

		const data = await this.client.rest.request<IUser>("GET", `/users/${encodeURIComponent(username)}`);

		return new User(this.client, data);
	}
}
