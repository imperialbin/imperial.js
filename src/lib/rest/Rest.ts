import type { Imperial } from "../client/Imperial";
import AbortController from "abort-controller";
import fetch, { Response } from "node-fetch";
import { URL } from "url";
import { Error } from "../errors";
import { Base } from "../client/Base";

type Methods = "POST" | "GET" | "PATCH" | "DELETE";

interface Options {
	data?: Record<string, unknown>;
	headers?: Record<string, unknown>;
}

/**
 *  Class for ease of rest Api requests
 *  @internal
 */
export class Rest extends Base {
	/**
	 *  Useragent
	 */
	readonly useragent: string = `imperial.js; (+https://github.com/imperialbin/imperial.js) NodeJS ${process.versions.node} on ${process.platform}`;

	/**
	 *  Imperial's hostname
	 */
	readonly hostname = "staging.impb.in";

	/**
	 *  Api Vesrion
	 */
	readonly version = "v1"; // soon "/1"

	/**
	 *  Imperial Api url
	 */
	readonly api = `https://staging-balls-api.impb.in/${this.version}` as const;

	readonly defaultHeaders: Record<string, any> = {
		"Content-Type": "application/json",
		"User-Agent": this.useragent,
		Accept: "application/json",
	};

	/**
	 *  Regular Expression that is used to match against in functions
	 */
	readonly hostnameRe = new RegExp(`${this.hostname}`, "i"); // /^(www\.)?imp(erial)?b(\.in|in.com)$/i;

	public async request<T extends unknown>(method: Methods, path: string, options: Options = {}): Promise<T> {
		// set the headers
		const headers = {
			...options.headers,
			...this.defaultHeaders,
		};

		// add authorization header if apiToken is set
		if (this.client.apiToken) headers.Authorization = this.client.apiToken;

		// set the data
		let body: string | undefined;

		// if `options.data` is set, serialize it to a string
		if (options.data)
			try {
				body = JSON.stringify(options.data);
			} catch (error: any) {
				throw new Error("FAILED_PARSE");
			}

		// create the controller
		const controller = new AbortController();

		// create a timeout to abort the request after
		const abortTimeout = setTimeout(() => controller.abort(), this.client.options.requestTimeout);

		let response: Response;

		try {
			// make the request
			response = await fetch(`${this.api}${path}`, {
				headers,
				method,
				body,
				signal: controller.signal,
				redirect: "error",
				compress: true,
			});
		} catch (error: any) {
			// if error was an aborted error, throw a custom error
			if (error?.name === "AbortError") throw new Error("ABORTED");

			// else throw the error
			throw new Error("FETCH_ERROR");
		} finally {
			// clear the timeout
			clearTimeout(abortTimeout);
		}

		// handle the response
		return this.handleResponse(response);
	}

	// eslint-disable-next-line class-methods-use-this
	private async handleResponse<T extends unknown>(response: Response): Promise<T> {
		let json: { success: true; data: unknown } | undefined;

		// try to parse the json data
		try {
			json = await response.json();
		} catch (e) {
			// Ignore parse error
		}

		// remove not needed data
		const { success, data } = json ?? {};

		// extract the status code
		const { status } = response;

		// if everything is okay resolve
		if (status && response.ok && success === true) {
			return data as T;
		}

		// find an error message
		const { pathname: path } = new URL(response.url);

		switch (status) {
			case 401: {
				throw new Error("NOT_AUTHORIZED", status, path);
			}

			case 404: {
				throw new Error("NOT_FOUND", status, path);
			}

			default: {
				// throw an error
				throw new Error("HTTP_ERROR", status, path);
			}
		}
	}
}

export interface Rest {
	readonly client: Imperial;
}
