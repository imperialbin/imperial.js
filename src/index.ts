import { IncomingMessage, OutgoingHttpHeaders } from "http";
import https from "https";
import { URL } from "url";
import { codes as humanReadable } from "./helpers/httpCodes";
import niceError from "./helpers/niceError";
import {
	ImperialResponseGetCode,
	ImperialResponsePostCode,
	ImperialResponseCommon,
	postOptions,
	_internalPostOptions,
} from "./helpers/interfaces";
import setParams from "./helpers/setPostCodeParams";

export type { ImperialResponseGetCode, ImperialResponsePostCode, postOptions } from "./helpers/interfaces";

interface prepareParams {
	method: string;
	headers?: OutgoingHttpHeaders;
	path: string;
}

/**
 *  The API wrapper class
 * @param token Your API token
 */

export class Imperial {
	private _token: string | null = null;

	constructor(token?: string) {
		if (token) {
			this._token = token;

			this._checkToken(token).then((data) => {
				if (!data.success) {
					/* Mock status to show that the user is unauthorized */
					const mockStatus = 401;

					throw niceError({ errorMessage: data.message, statusCode: mockStatus });
				}
			});
		}
	}

	private _HOSTNAME = "www.imperialb.in";
	private _HOSTNAMEREGEX = /^(www\.)?imperialb\.in$/i;
	private _prepareRequest({ method, headers, path }: prepareParams): https.RequestOptions {
		const defaultHeaders = {
			"User-Agent": "imperial-node; (+https://github.com/pxseu/imperial-node)",
		};

		headers = Object.assign(headers, defaultHeaders);

		return {
			hostname: this._HOSTNAME,
			port: 443,
			path: `/api${path}`,
			method,
			headers,
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

					if (response.statusCode === 200 && json) {
						resolve(json);
					} else {
						if (response.statusCode === 302) {
							/* If there was a 302 it means the request failed */
							response.statusCode = 400;
						}

						let errorMessage =
							humanReadable.get(response.statusCode) ?? `Response code ${response.statusCode}`;

						if (json?.message) {
							errorMessage = json.message;
						}

						reject(niceError({ errorMessage, json, statusCode: response.statusCode }));
					}
				} catch (err) {
					reject(err);
				}
			});
			response.on("error", reject);
		});
	}

	private _checkToken(token: string): Promise<ImperialResponseCommon> {
		const params = setParams({ apiToken: token });

		const opts = this._prepareRequest({
			method: "GET",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Content-Length": Buffer.byteLength(params.toString()),
				Accept: "application/json",
			},
			path: "/checkApiToken",
		});

		return new Promise((resolve, reject) => {
			const request = https.request(opts, (response) => {
				resolve(this._parseResponse(response));
			});
			request.on("error", reject);
			request.write(params.toString());
			request.end();
		});
	}

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @returns Promise with the data
	 *  @example postCode("hi!").then(console.log); // Prints the response to console
	 */
	public postCode(text: string): Promise<ImperialResponsePostCode>;

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @param opts Additional options for the request **REQUIRES API KEY IN CONSTRUCTOR**
	 *  @returns Promise with the data
	 *  @example postCode("hi!", { longerUrls: true }).then(console.log); // Prints the response to console
	 */
	public postCode(text: string, opts: postOptions): Promise<ImperialResponsePostCode>;
	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @param cb Function called after the data is sent or if there was an error
	 *  @example postCode("hi!", (e, d) => {if (!e) console.log(d);}) // Prints the response to console
	 */

	public postCode(text: string, cb: (error: unknown, data?: ImperialResponsePostCode) => void): void;

	/**
	 *  Create a document
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
		optionsOrCallback?: ((error: unknown, data?: ImperialResponsePostCode) => void) | postOptions,
		cb?: (error: unknown, data?: ImperialResponsePostCode) => void
	): Promise<ImperialResponsePostCode> | void {
		const callBack = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;

		let jsonParams: _internalPostOptions = {
			longerUrls: false,
			instantDelete: false,
			imageEmbed: false,
			expiration: 5,
			code: text,
		};

		if (this._token) {
			jsonParams.apiToken = this._token;
		}

		if (typeof optionsOrCallback !== "function") {
			console.log(jsonParams);
			jsonParams = Object.assign(jsonParams, optionsOrCallback);
			console.log(jsonParams);
		}

		const params = setParams(jsonParams);

		const opts = this._prepareRequest({
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Content-Length": Buffer.byteLength(params.toString()),
				Accept: "application/json",
			},
			path: "/postCode",
		});

		if (!callBack) {
			return new Promise((resolve, reject) => {
				const request = https.request(opts, (response) => {
					resolve(this._parseResponse(response));
				});
				request.on("error", reject);
				request.write(params.toString());
				request.end();
			});
		}

		const request = https.request(opts, (response) => {
			this._parseResponse(response).then((data) => callBack(null, data), callBack);
		});
		request.on("error", callBack);
		request.write(params.toString());
		request.end();
	}

	/**
	 *	 Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *	@example getCode("someid").then(console.log); // Logs the response to the console
	 */
	public getCode(id: string): Promise<ImperialResponseGetCode>;

	/**
	 *	 Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param cb Function called after the data is fetched or if there was an error
	 *	@example getCode("someid"), (e, d) => { if (!e) console.log(d) }; // Logs the response to the console
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
			headers: {
				Accept: "application/json",
			},
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
