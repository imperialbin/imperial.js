import type { ImperialOptions } from "../types/common";
import { validateToken } from "../utils/validToken";
import { Rest } from "../rest/Rest";
import { defaultOptions } from "../utils/defaultOptions";
import { DocumentManager } from "../managers/Document";
import { UsersManager } from "../managers/Users";
import { MeManager } from "../managers/Me";
import { ErrorMessage } from "../errors/Messages";

/**
 *  The Imperial class
 *  Easiest way to interact with the Api
 *  @author `pxseu` <https://github.com/pxseu>
 */
export class Imperial {
	/**
	 *  `Imperial` constructor
	 *  @param token Your API token
	 */
	constructor(token?: string | null);

	/**
	 *  `Imperial` constructor
	 *  @param options Options for the class
	 */
	constructor(options?: ImperialOptions);

	/**
	 *  `Imperial` constructor
	 *  @param token Your API token
	 *  @param options Options for the class
	 */
	constructor(token?: string, options?: ImperialOptions);

	constructor(tokenOrOptions?: ImperialOptions | string | null, paramOptions: ImperialOptions = {}) {
		const options = typeof tokenOrOptions === "object" && tokenOrOptions !== null ? tokenOrOptions : paramOptions;
		const token = typeof tokenOrOptions === "string" || tokenOrOptions === null ? tokenOrOptions : undefined;

		this.setApiToken(token);
		this.options = { ...defaultOptions, ...options };

		Object.defineProperty(this, "rest", { value: new Rest(this) });
		Object.defineProperty(this, "document", { value: new DocumentManager(this) });
		Object.defineProperty(this, "users", { value: new UsersManager(this) });
		Object.defineProperty(this, "me", { value: new MeManager(this) });
	}

	/**
	 *  Get the Api Token from the Class
	 */
	public get apiToken(): string | undefined {
		return this._token;
	}

	/**
	 *  Change the Api Token on the Class
	 *
	 */
	public setApiToken(token: string | null | undefined = null): void {
		if (validateToken(token)) Object.defineProperty(this, "_token", { value: token, configurable: true });
	}

	/**
	 *  Verify if your token is valid | **Requires an API Token**
	 *  @example verify().then(console.log)
	 *  // shows if the token is valid
	 */
	public async verify(): Promise<void> {
		// If no token return
		if (!this.apiToken) throw new Error(ErrorMessage("NO_TOKEN"));

		await this.rest.request("GET", `/checkApiToken/${encodeURIComponent(this.apiToken)}`);
	}
}

export interface Imperial {
	/**
	 *  The token
	 *  @internal
	 */
	_token: string | undefined;

	/**
	 *  Main Class to handle interactions with the REST Api
	 *  @internal
	 */
	readonly rest: Rest;

	/**
	 *  Client options
	 *  @internal
	 */
	options: ImperialOptions;

	/**
	 *  Document Manager
	 */
	readonly document: DocumentManager;

	/**
	 *  Users Manager
	 */
	readonly users: UsersManager;

	/**
	 *  User Manager
	 */
	readonly me: MeManager;
}
