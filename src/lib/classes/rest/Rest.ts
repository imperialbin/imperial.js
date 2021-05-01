import type { OutgoingHttpHeaders } from "http";
import { request } from "https";
import type { Imperial } from "../Imperial";
import { handleResponse } from "./responseHandler";

type Methods = "POST" | "GET" | "PATCH" | "DELETE";

interface Options {
	data?: Record<string, unknown>;
	headers?: OutgoingHttpHeaders;
}

/**
 *  Class for ease of rest Api requests
 */
export class Rest {
	/**
	 *  Imperial's hostname
	 */
	readonly hostname = "imperialb.in";

	/**
	 *  Regular Expression that is used to match against in functions
	 */
	readonly hostnameCheckRegExp = /^(www\.)?imperialb(\.in|in.com)$/i;

	constructor(client: Imperial) {
		this.client = client;
	}

	request<T extends unknown>(method: Methods, path: string, options: Options = {}): Promise<T> {
		return new Promise((resolve, reject) => {
			const defaultHeaders: OutgoingHttpHeaders = {
				// best thing to happen
				"Content-Type": "application/json",
				"User-Agent": "imperial-node; (+https://github.com/imperialbin/imperial-node)",
			};

			if (this.client.apiToken) defaultHeaders.Authorization = this.client.apiToken;

			const headers = {
				...options.headers,
				...defaultHeaders,
			};

			let dataString: string | null = null;

			if (options.data)
				try {
					dataString = JSON.stringify(options.data);
					headers["Content-Length"] = Buffer.byteLength(dataString);
				} catch (e) {
					reject(e);
				}

			// Prepare the request
			const requestOptions = {
				method,
				path: `/api${path}`,
				headers,
				hostname: this.hostname,
				token: this.client.apiToken,
			};

			// Make the request
			const httpRequest = request(requestOptions);

			if (dataString) httpRequest.write(dataString);

			httpRequest.on("response", (response) => {
				// Parse the response
				handleResponse<T>(response, httpRequest).then((data) => {
					// Return the Document class
					resolve(data);
				}, reject);
			});
			httpRequest.on("error", reject);
			httpRequest.end();
		});
	}
}

export interface Rest {
	client: Imperial;
}
