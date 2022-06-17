import type { Imperial } from "../client/Imperial";
import type { User as IUser } from "../types/users";
import { Base } from "./Base";
import { UserFlagsBitfield } from "../utils/UserFlagsBitfield";

export class User extends Base<IUser> {
	constructor(client: Imperial, user: IUser) {
		super(client);

		if (!user) throw new Error("User: No data provided");

		// @ts-expect-error fallback to null
		this.flags = null;

		this._patch(user);
	}

	/**
	 *  @internal
	 */
	public _patch(user: IUser) {
		this.id = user.id;

		if ("username" in user) {
			this.username = user.username;
		} else if (typeof this.username !== "string") {
			// @ts-expect-error fallback to null
			this.username ??= null;
		}

		if ("icon" in user) {
			this.icon = user.icon;
		} else if (typeof this.icon !== "string") {
			this.icon = null;
		}

		if ("flags" in user) {
			this.flags = new UserFlagsBitfield(user.flags);
		}

		if ("documents_made" in user || "documentsMade" in user) {
			// @ts-expect-error documentsMade is used when copying from a class
			this.documentsMade = user.documents_made ?? user.documentsMade;
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
		user._patch(data.toJSON());
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
	id: number;
	username: string;
	icon: string | null;
	flags: UserFlagsBitfield;
	documentsMade: number;
}
