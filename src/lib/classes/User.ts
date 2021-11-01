import type { Imperial } from "../client";
import type { User as IUser } from "../types/users";
import { Base } from "./Base";

export class User extends Base<IUser> {
	constructor(client: Imperial, user: IUser) {
		super(client);

		if (!user) throw new Error("User: No data provided");

		this._patch(user);
	}

	/**
	 *  @internal
	 */
	public _patch(user: IUser) {
		if ("username" in user) {
			this.username = user.username;
		} else if (typeof user.username !== "string") {
			// @ts-ignore
			this.username = null;
		}

		if ("memberPlus" in user) {
			this.memberPlus = user.memberPlus;
		} else if (typeof user.memberPlus !== "boolean") {
			this.memberPlus = false;
		}

		if ("icon" in user) {
			this.icon = user.icon;
		} else if (typeof user.icon !== "string") {
			this.icon = "/assets/img/pfp.png";
		}

		if ("banned" in user) {
			this.banned = user.banned;
		} else if (typeof user.banned !== "boolean") {
			this.banned = false;
		}

		return user;
	}

	/**
	 *  Revalidate the user
	 *  @example user.revalidate().then(console.log);
	 *
	 */
	public async revalidate(): Promise<User> {
		const user = this._clone();
		const data = await this.client.users.get(user.username);
		user._patch(data);
		return user;
	}

	/**
	 *  Concatonate the username insted of the object
	 */
	public toString() {
		return this.username;
	}

	/**
	 *  Convert the user to a JSON object
	 */
	public toJSON() {
		return super.toJSON();
	}
}

export interface User {
	username: string;
	icon: string;
	memberPlus: boolean;
	banned: boolean;
}
