import type { User as IUser } from "../types/users";
import { User } from "../classes/User";
import { ErrorMessage } from "../errors/Messages";
import { Base } from "./Base";

export class UsersManager extends Base {
	/**
	 *  Get a user from Imperial.
	 *  @param username - The username of the user to get.
	 *  @example client.users.get("pxseu").then(console.log) // Logs the user to the console.
	 */
	public async get(username: string): Promise<User> {
		if (!this.client.apiToken) throw new Error(ErrorMessage("NO_TOKEN"));
		if (!username) throw new Error(ErrorMessage("NO_USERNAME"));
		if (typeof username !== "string") throw new TypeError(ErrorMessage("USERNAME_WRONG_TYPE"));

		const data = await this.client.rest.request<IUser>("GET", `/user/${encodeURIComponent(username)}`);

		return new User(this.client, data);
	}
}
