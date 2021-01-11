import { IncomingMessage } from "http";
import https from "https";
import { URL, URLSearchParams } from "url";
import { codes as humanReadable } from "./helpers/httpCodes";

/**
 *  `postCode` response that gets return from the Wrapper
 */
export interface ImperialResponsePostCode {
	success: boolean;
	documentId: string;
	rawLink: string;
	formattedLink: string;
	expiresIn: string;
	instantDelete: boolean;
}

/**
 *  `getCode` response that gets return from the Wrapper
 */
export interface ImperialResponseGetCode {
	success: boolean;
	document: string;
}

export type parsedError = Error & {
	json?: Record<string, unknown>;
	statusCode: number | undefined;
	statusCodeText: string;
	rateLimitReset?: number;
};

interface prepareParams {
	method: string;
	headers?: Record<string, unknown>;
	path: string;
}

interface postOptions {
	longerUrls?: boolean;
	instantDelete?: boolean;
	imageEmbed?: boolean;
	expiration?: number;
}

/**
 *  The API wrapper class
 * @param token Your API token
 */

export class Wrapper {
	constructor(private token: string | null = null) {}

	private _HOSTNAME = "www.imperialb.in";
	private _HOSTNAMEREGEX = /w?w?w?\.?imperialb.in/gi;

	private _prepareRequest({ method, headers, path }: prepareParams): Record<string, unknown> {
		return {
			hostname: this._HOSTNAME,
			port: 443,
			path: `/api${path}`,
			method,
			headers: {
				...headers,
				"User-Agent": "imperial-node; (+https://github.com/pxseu/imperial-node)",
			},
		};
	}

	private _parseResponse(response: IncomingMessage): Promise<never> {
		return new Promise((resolve, reject) => {
			const data: string[] = [];
			response.on("data", (chunk: string) => {
				data.push(chunk);
			});
			response.on("end", () => {
				try {
					const responseData = data.join("");
					let json;

					try {
						json = JSON.parse(responseData);
					} catch (e) {
						/* Ignore parse error */
					}

					if (response.statusCode === 200 && json && json.success === true) {
						resolve(json);
					} else {
						let errorMessage =
							humanReadable.get(response.statusCode) ??
							`Response code ${response.statusCode}`;

						if (json?.message) {
							errorMessage = json.message;
						}

						reject(
							Object.assign(new Error(errorMessage), {
								json,
								statusCode: response.statusCode,
								statusCodeText: humanReadable.get(response.statusCode),
								rateLimitReset: response.headers["x-ratelimit-reset"],
							})
						);
					}
				} catch (err) {
					reject(err);
				}
			});
			response.on("error", reject);
		});
	}

	/**
	 *  Post code the code to the API
	 *  @param text The text to be sent
	 *  @returns Promise with the data
	 *  @example postCode("hi!").then(console.log); // Prints the response to console
	 */
	public postCode(text: string): Promise<ImperialResponsePostCode>;

	/**
	 *  Post code the code to the API
	 *  @param text The text to be sent
	 *  @param opts Additional options for the request **REQUIRES API KEY IN CONSTRUCTOR**
	 *  @returns Promise with the data
	 *  @example postCode("hi!", { longerUrls: true }).then(console.log); // Prints the response to console
	 */
	public postCode(text: string, opts: postOptions): Promise<ImperialResponsePostCode>;
	/**
	 *  Post code the code to the API
	 *  @param text The text to be sent
	 *  @param cb Function called after the data is sent or if there was an error
	 *  @example postCode("hi!", (e, d) => {if (!e) console.log(d);}) // Prints the response to console
	 */

	public postCode(
		text: string,
		cb: (error: unknown, data?: ImperialResponsePostCode) => void
	): void;

	/**
	 *  Post code the code to the API
	 *  @param text The text to be sent
	 *  @param opts Additional options for the request **REQUIRES API KEY IN CONSTRUCTOR**
	 *  @param cb Function called after the data is sent or if there was an error
	 *  @example postCode("hi!", (e, d) => {if (!e) console.log(d);}) // Prints the response to console
	 */
	public postCode(
		text: string,
		opts: postOptions,
		cb: (error: unknown, data?: ImperialResponsePostCode) => void
	): void;

	public postCode(
		text: string,
		optionsOrCallback?:
			| ((error: unknown, data?: ImperialResponsePostCode) => void)
			| postOptions,
		cb?: (error: unknown, data?: ImperialResponsePostCode) => void
	): Promise<ImperialResponsePostCode> | void {
		const callBack = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;

		let params: Record<string, unknown> = {
			code: text,
		};

		if (typeof optionsOrCallback === "object") {
			params = {
				...optionsOrCallback,
				...params,
			};
		}

		if (this.token) {
			params.apiToken = this.token;
		}

		const searchParams = new URLSearchParams();

		for (const prop in params) {
			searchParams.set(prop, String(params[prop]));
		}

		const opts = this._prepareRequest({
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Content-Length": Buffer.byteLength(searchParams.toString()),
			},
			path: "/postCode",
		});

		if (!callBack) {
			return new Promise((resolve, reject) => {
				const request = https.request(opts, (response) => {
					resolve(this._parseResponse(response));
				});
				request.on("error", reject);
				request.write(searchParams.toString());
				request.end();
			});
		}

		const request = https.request(opts, (response) => {
			this._parseResponse(response).then((data) => callBack(null, data), callBack);
		});
		request.on("error", callBack);
		request.write(searchParams.toString());
		request.end();
	}

	/**
	 *	 Get the code from the Api
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *	@example getCode("someid").then(console.log); // Logs the response to the console
	 */
	public getCode(id: string): Promise<ImperialResponseGetCode>;

	/**
	 *	 Get the code from the Api
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param cb Function called after the data is fetched or if there was an error
	 *	@example getCode("someid").then(console.log); // Logs the response to the console
	 */
	public getCode(id: string, cb: (error: unknown, data?: ImperialResponseGetCode) => void): void;

	public getCode(
		id: string,
		cb?: (error: unknown, data?: ImperialResponseGetCode) => void
	): Promise<ImperialResponseGetCode> | void {
		let documentId = encodeURIComponent(id);

		try {
			const url = new URL(id);
			if (this._HOSTNAMEREGEX.test(url.hostname)) {
				const splitPath = url.pathname.split("/");
				documentId = splitPath.length > 0 ? splitPath[splitPath.length - 1] : "";
			}
		} catch (e) {
			/* Don't do anything with the URL prase error */
		}

		const opts = this._prepareRequest({
			method: "GET",
			path: `/getCode/${documentId}`,
		});

		if (!cb)
			return new Promise((resolve, reject) => {
				const request = https.request(opts, (response) => {
					resolve(this._parseResponse(response));
				});
				request.on("error", reject);
				request.end();
			});

		const request = https.request(opts, (response) => {
			this._parseResponse(response).then((data) => cb(null, data), cb);
		});
		request.on("error", cb);
		request.end();
	}
}
