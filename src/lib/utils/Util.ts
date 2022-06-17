import { URL } from "url";
import type { Imperial } from "../client/Imperial";
import { Error, TypeError } from "../errors";
import type { IdResolvable } from "../types/common";

export class Util {
	/**
	 *  Little helper to get done with dates easier
	 *  @param firstDate Current date or the creation date
	 *  @param secondDate The deletion date
	 *  @returns The difference in days
	 *  @internal
	 *  @example
	 *  getDateDifference(new Date(), new Date())
	 *  > 0
	 *  getDateDifference(new Date("1-1-2019"), new Date("1-1-2020"))
	 *  > 365
	 */
	static getDateDifference = (firstDate: Date, secondDate: Date): number =>
		Math.round((secondDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

	/**
	 * @internal
	 */
	static createFormatedLink = (client: Imperial, id: string): string => `https://${client.rest.hostname}/${id}`;

	/**
	 * @internal
	 */
	static createRawLink = (client: Imperial, id: string): string => `https://${client.rest.hostname}/r/${id}`;

	/**
	 * @internal
	 */
	static stringify(data: any): string {
		if (typeof data === "object") {
			return JSON.stringify(data);
		}

		return String(data);
	}

	private static TokenRegex = /^IMPERIAL-[a-zA-Z\d]{8}(-[a-zA-Z\d]{4}){3}-[a-zA-Z\d]{12}$/;

	/**
	 *  Simple token validation function
	 *  @param token The token to check
	 *  @returns `true` if the token is in the valid format and `false` if its' not
	 *  @internal
	 *  @example
	 *  validateToken('IMPERIAL-12345678-1234-1234-1234-123456789ABC')
	 *  > true
	 *  validateToken('blah')
	 *  > false
	 */
	static validateToken(token: unknown): boolean {
		if (typeof token === "undefined" || token === null) return true;
		if (typeof token !== "string") return false;
		return this.TokenRegex.test(token);
	}

	static isObject = (object: unknown) => typeof object === "object" && object !== null;

	static objectify(object: Record<string, unknown>, ...props: Record<string, string | boolean>[]): any {
		if (!this.isObject(object)) return object;

		const objProps = Object.keys(object)
			.filter((key) => !key.startsWith("_"))
			.map((key) => ({ [key]: true }));

		const availableProps: Record<string, string | boolean> = objProps.length
			? Object.assign({}, ...objProps, ...props)
			: Object.assign({}, ...props);

		const out: Record<string, unknown> = {};

		for (const [prop, newProp] of Object.entries(availableProps)) {
			if (newProp) {
				const currProp = newProp === true ? prop : newProp;

				const element = (object as any)[prop] as any;
				const elemIsObj = this.isObject(element);
				const valueOf = elemIsObj && typeof element.valueOf === "function" ? element.valueOf() : null;
				const toJson = elemIsObj && typeof element.toJSON === "function" ? element.toJSON() : null;

				if (Array.isArray(element)) out[currProp] = element.map((e) => this.objectify(e));
				else if (typeof valueOf !== "object") out[currProp] = valueOf;
				else if (toJson !== null) out[currProp] = toJson;
				else if (!elemIsObj) out[currProp] = element;
			}
		}

		return out;
	}

	static getIdFromUrl(url: URL, hostnameRegex: RegExp): string {
		if (!url.protocol.toLowerCase().startsWith("http")) throw new TypeError("ID_WRONG_TYPE");

		const splitPath = url.pathname.split("/");

		if (hostnameRegex.test(url.hostname) && splitPath.length > 0) {
			// If the domain matches imperial extract data after last slash
			return splitPath[splitPath.length - 1];
		}

		throw new Error("NO_ID");
	}

	/**
	 *  Extract the id from a string or URL object
	 *  @internal
	 */
	static parseId(id: IdResolvable, hostnameRegex: RegExp): string {
		if (!id) throw new Error("NO_ID");

		if (id instanceof URL) return this.getIdFromUrl(id, hostnameRegex);

		if (typeof id !== "string") throw new TypeError("ID_WRONG_TYPE");

		try {
			// Try to parse a url
			return this.getIdFromUrl(new URL(id), hostnameRegex);
		} catch (e) {
			return id;
		}
	}

	static getPasswordFromUrl(url: URL): string | null {
		if (!url.protocol.toLowerCase().startsWith("http")) throw new TypeError("PASSWORD_WRONG_TYPE");
		const password = url.searchParams.get("password");

		if (!password) return null;
		return password;
	}

	/**
	 * 	Extract the password the passed id is an URL
	 *  @internal
	 */
	static parsePassword(id: IdResolvable): string | null {
		if (!id) throw new Error("NO_ID");

		if (id instanceof URL) {
			return this.getPasswordFromUrl(id);
		}

		if (typeof id !== "string") throw new TypeError("PASSWORD_WRONG_TYPE");

		try {
			// Try to parse a url
			return this.getPasswordFromUrl(new URL(id));
		} catch (e) {
			// Return undefined if the parsing failed
			return null;
		}
	}
}
