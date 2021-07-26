import AbortController from "abort-controller";
import fetch, { Response } from "node-fetch";
import { Aborted } from "../../errors/HTTPErrors/Aborted";
import { Base } from "../Base";
import type { Imperial } from "../Imperial";
import { handleResponse } from "./responseHandler";

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
	 *  Imperial's hostname
	 */
	readonly hostname = "https://imperialb.in/api";

	/**
	 *  Api Vesrion
	 */
	readonly version = ""; // soon "/1"

	/**
	 *  Regular Expression that is used to match against in functions
	 */
	readonly hostnameCheckRegExp = /^(www\.)?imp(erial)?b(\.in|in.com)$/i;

	async request<T extends unknown>(method: Methods, path: string, options: Options = {}): Promise<T> {
		// default headers
		const defaultHeaders: Record<string, any> = {
			"Content-Type": "application/json",
			"User-Agent": "imperial-node; (+https://github.com/imperialbin/imperial-node)",
		};

		// add authorization header if apiToken is set
		if (this.client.apiToken) defaultHeaders.Authorization = this.client.apiToken;

		// set the headers
		const headers = {
			...options.headers,
			...defaultHeaders,
		};

		// set the data
		let body: string | undefined;

		// if `options.data` is set, serialize it to a string
		if (options.data)
			try {
				body = JSON.stringify(options.data);
			} catch (e) {
				throw new Error(`Failed to serialize data to JSON: ${e.message}`);
			}

		const controller = new AbortController();

		const abortTimeout = setTimeout(() => controller.abort(), this.client.options.requestTimeout);

		let response: Response;

		try {
			response = await fetch(`${this.hostname}${this.version}${path}`, {
				headers,
				method,
				body,
				signal: controller.signal,
				redirect: "error",
			});
		} catch (error) {
			if (error.name === "AbortError") throw new Aborted();

			throw error;
		} finally {
			clearTimeout(abortTimeout);
		}

		return handleResponse(response);
	}
}

export interface Rest {
	client: Imperial;
}
