import type { Imperial } from "../client/Imperial";
import AbortController from "abort-controller";
import axios, { AxiosRequestHeaders, AxiosResponse } from "axios";
import { Error } from "../errors";
import { Base } from "../client/Base";
import { URL } from "url";

type Methods = "POST" | "GET" | "PATCH" | "DELETE";

interface Options {
	data?: Record<string, unknown>;
	headers?: AxiosRequestHeaders;
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
	readonly hostname = "api.impb.in";

	/**
	 *  Api Vesrion
	 */
	readonly version = "v1";

	/**
	 *  Imperial Api url
	 */
	readonly api = `https://api.impb.in/${this.version}` as const;

	readonly defaultHeaders: Record<string, any> = {
		"Content-Type": "application/json",
		"User-Agent": this.useragent,
		Accept: "application/json",
	};

	readonly axios = axios.create({
		headers: this.defaultHeaders,
	});

	/**
	 *
	 *  Regular Expression that is used to match against in functions
	 */
	readonly hostnameRe = new RegExp(`${this.hostname}`, "i"); // /^(www\.)?imp(erial)?b(\.in|in.com)$/i;

	public async request<T extends unknown>(method: Methods, path: string, options: Options = {}): Promise<T> {
		const headers = { ...options.headers };

		// add authorization header if apiToken is set
		if (this.client.apiToken) headers.Authorization = this.client.apiToken;

		// set the data
		let data: string | undefined;

		// if `options.data` is set, serialize it to a string
		if (options.data)
			try {
				data = JSON.stringify(options.data);
			} catch (error: any) {
				throw new Error("FAILED_PARSE");
			}

		// create the controller
		const controller = new AbortController();

		// create a timeout to abort the request after
		const abortTimeout = setTimeout(() => controller.abort(), this.client.options.requestTimeout);

		let response: AxiosResponse;

		try {
			// make the request
			response = await this.axios(`${this.api}${path}`, {
				headers,
				method,
				data,
				signal: controller.signal,
			});
		} catch (error: any) {
			// if error was an aborted error, throw a custom error
			if (error?.name === "AbortError") throw new Error("ABORTED");

			const maybeErrorObject = error?.response?.data?.error;

			// else throw the error
			throw new Error(maybeErrorObject?.code?.toUpperCase() ?? "FETCH_ERROR");
		} finally {
			// clear the timeout
			clearTimeout(abortTimeout);
		}

		// handle the response
		return this.handleResponse(response);
	}

	// eslint-disable-next-line class-methods-use-this
	private async handleResponse<T extends unknown>(response: AxiosResponse): Promise<T> {
		// remove not needed data
		const { success, data } = response.data ?? {};

		// extract the status code
		const { status } = response;

		// if everything is okay resolve
		if (status >= 200 && status < 300 && success === true) {
			return data as T;
		}

		// find an error message
		const path = new URL(response.config.url ?? "http://noop").pathname;

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
