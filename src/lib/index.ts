import { OutgoingHttpHeaders } from "http";
import { request, RequestOptions } from "https";
import { URL } from "url";
import {
	postOptions,
	ImperialResponseCommon,
	ImperialResponseGetDocument,
	ImperialResponseCreateDocument,
} from "./helpers/interfaces";
import { validateToken } from "./helpers/isValidToken";
import { parseResponse } from "./helpers/responseParser";

export type { ImperialResponseGetDocument, ImperialResponseCreateDocument, postOptions };

/* Internal inetfaces that should not be exported */
interface prepareParams {
	method: string;
	headers?: OutgoingHttpHeaders;
	path: string;
}

interface internalPostOptions extends postOptions {
	code: string;
	[key: string]: unknown;
}

const HOSTNAME = "imperialb.in"; // Domain to do request with
const HOSTNAMEREGEX = /^(www\.)?imperialb(\.in|in.com)$/i; // Simple regex to check if a domain is valid

/**
 *  The API wrapper class
 *  @author https://github.com/pxseu
 */

export class Imperial {
	/**
	 *  `Imperial` constructor
	 *  @param token Your API token
	 */
	constructor(private token?: string) {}

	private _prepareRequest({ method, headers = {}, path }: prepareParams): RequestOptions {
		const defaultHeaders = {
			"Content-Type": "application/json", // best thing to happen
			"User-Agent": "imperial-node; (+https://github.com/imperialbin/imperial-node)",
			Authorization: this.token ?? "",
		};

		headers = Object.assign(headers, defaultHeaders);

		return {
			hostname: HOSTNAME,
			port: 443,
			path: `/api${path}`,
			method,
			headers,
		};
	}

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @returns Promise with the data
	 *  @example createDocument("hi!").then(console.log);
	 *  // Prints the response to console
	 *  @returns `Promise<ImperialResponseCreateDocument>`
	 */
	public createDocument(text: string): Promise<ImperialResponseCreateDocument>;

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @param opts Additional options for the request **Api key is required**
	 *  @returns Promise with the data
	 *  @example createDocument("hi!", { longerUrls: true }).then(console.log); // Prints the response to console
	 *  @returns `Promise<ImperialResponseCreateDocument>`
	 */
	public createDocument(text: string, opts: postOptions): Promise<ImperialResponseCreateDocument>;

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @param cb Function called after the data is sent or if there was an error
	 *  @example createDocument("hi!", (e, d) => {if (!e) console.log(d);})
	 *  // Prints the response to console
	 *  @returns `void`
	 */
	public createDocument(text: string, cb: (error: unknown, data?: ImperialResponseCreateDocument) => void): void;

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @param opts Additional options for the request **Api key is required**
	 *  @param cb Function called after the data is sent or if there was an error
	 *  @example createDocument("hi!", (e, d) => {if (!e) console.log(d);})
	 *  // Prints the response to console
	 *  @returns `void`
	 */
	public createDocument(
		text: string,
		opts: postOptions,
		cb: (error: unknown, data?: ImperialResponseCreateDocument) => void
	): void;

	/**
	 *  Create a document
	 */
	public createDocument(
		text: string,
		optionsOrCallback?: ((error: unknown, data?: ImperialResponseCreateDocument) => void) | postOptions,
		cb?: (error: unknown, data?: ImperialResponseCreateDocument) => void
	): Promise<ImperialResponseCreateDocument> | void {
		const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;

		if (!text || text === String()) {
			const err = new Error("No text was provided!");
			if (!callback) return Promise.reject(err);
			return callback(err);
		}

		if (typeof text !== "string") {
			// Throw an error if the data is not a string
			const err = new TypeError("Parameter `text` must be a string!");
			if (!cb) return Promise.reject(err);
			return cb(err);
		}

		let data: internalPostOptions = {
			longerUrls: false,
			instantDelete: false,
			imageEmbed: false,
			expiration: 5,
			code: text,
		};

		if (optionsOrCallback && typeof optionsOrCallback !== "function") {
			data = Object.assign(data, optionsOrCallback);
			data.code = text; // a little backup if someone were to pass code so it doesn't break
		}

		const dataString = JSON.stringify(data);

		const opts = this._prepareRequest({
			method: "POST",
			path: "/document",
			headers: {
				"Content-Length": Buffer.byteLength(dataString),
			},
		});

		if (!callback)
			return new Promise((resolve, reject) => {
				const httpRequest = request(opts, (response) => {
					resolve(parseResponse(response));
				});
				httpRequest.on("error", reject);
				httpRequest.write(dataString);
				httpRequest.end();
			});

		const httpRequest = request(opts, (response) => {
			parseResponse(response).then((data) => callback(null, data), cb);
		});
		httpRequest.on("error", callback);
		httpRequest.write(dataString);
		httpRequest.end();
	}

	/**
	 *  Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example getDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 *  @returns `Promise<ImperialResponseGetDocument>`
	 */
	public getDocument(id: string): Promise<ImperialResponseGetDocument>;

	/**
	 *  Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example getDocument("someid"), (e, d) => { if (!e) console.log(d) };
	 *  // Logs the response to the console
	 *  @returns `void`
	 */
	public getDocument(id: string, cb: (error: unknown, data?: ImperialResponseGetDocument) => void): void;

	/**
	 *  Get a document from the API
	 */
	public getDocument(
		id: string,
		cb?: (error: unknown, data?: ImperialResponseGetDocument) => void
	): Promise<ImperialResponseGetDocument> | void {
		if (!id || id === String()) {
			// Throw an error if the data was empty to not stress the servers
			const err = new Error("No documentId was provided!");
			if (!cb) return Promise.reject(err);
			return cb(err);
		}

		if (typeof id !== "string") {
			// Throw an error if the data is not a string
			const err = new TypeError("Parameter `id` must be a string!");
			if (!cb) return Promise.reject(err);
			return cb(err);
		}

		let documentId = encodeURIComponent(id); // Make the user inputed data encoded so it doesn't break stuff

		try {
			// Try to parse a url
			const url = new URL(id);
			if (HOSTNAMEREGEX.test(url.hostname)) {
				// If the domain matches imperial extract data after last slash
				const splitPath = url.pathname.split("/");
				documentId = splitPath.length > 0 ? splitPath[splitPath.length - 1] : String();
			}
		} catch (e) {
			/* Don't do anything with the URL prase error */
		}

		const opts = this._prepareRequest({
			method: "GET",
			path: `/document/${documentId}`,
		});

		if (!cb)
			return new Promise((resolve, reject) => {
				const httpRequest = request(opts, (response) => {
					resolve(parseResponse(response));
				});
				httpRequest.on("error", reject);
				httpRequest.end();
			});

		const httpRequest = request(opts, (response) => {
			parseResponse(response).then((data) => cb(null, data), cb);
		});
		httpRequest.on("error", cb);
		httpRequest.end();
	}

	/**
	 *  Check if your token is valid **Only use when provided the token in the constructor**
	 *  @example verify().then(console.log)
	 *  // shows if the token is valid
	 *  @returns `Promise<ImperialResponseCommon>`
	 */
	public verify(): Promise<ImperialResponseCommon>;

	/**
	 *  Check if your token is valid **Only use when provided the token in the constructor**
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example verify((e, d) => {if (!e) console.log(d)})
	 *  // shows if the token is valid
	 *  @returns `void`
	 */
	public verify(cb?: (error: unknown, data?: ImperialResponseCommon) => void): void;

	/**
	 *  Check if your token is valid **Only use when provided the token in the constructor**
	 */
	public verify(
		cb?: (error: unknown, data?: ImperialResponseCommon) => void
	): Promise<ImperialResponseCommon> | void {
		if (!this.token || !validateToken(this.token)) {
			const err = new Error("No or invalid token was provided in the constructor!");
			if (!cb) return Promise.reject(err);
			return cb(err);
		}

		const opts = this._prepareRequest({
			method: "GET",
			path: `/checkApiToken/${encodeURIComponent(this.token)}`,
		});

		if (!cb)
			return new Promise((resolve, reject) => {
				const httpRequest = request(opts, (response) => {
					resolve(parseResponse(response));
				});
				httpRequest.on("error", reject);
				httpRequest.end();
			});

		const httpRequest = request(opts, (response) => {
			parseResponse(response).then((d) => cb(null, d), cb);
		});
		httpRequest.on("error", cb);
		httpRequest.end();
	}

	/* Deprecated stuff */

	/**
	 *  Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example getDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 *  @returns `Promise<ImperialResponseGetDocument>`
	 *  @deprecated Since 1.2.3, use `getDocument` instead
	 */
	public getCode(id: string): Promise<ImperialResponseGetDocument>;

	/**
	 *  Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example getDocument("someid"), (e, d) => { if (!e) console.log(d) };
	 *  // Logs the response to the console
	 *  @returns `void`
	 *  @deprecated Since 1.2.3, use `getDocument` instead
	 */
	public getCode(id: string, cb: (error: unknown, data?: ImperialResponseGetDocument) => void): void;

	/**
	 *  @deprecated Since 1.2.3, use `getDocument` instead
	 */
	public getCode(
		id: string,
		cb?: (error: unknown, data?: ImperialResponseGetDocument) => void
	): Promise<ImperialResponseGetDocument> | void {
		process.emitWarning(
			"Using `getCode` will soon stop working. " + "Use the new `getDocument` instead.",
			"DeprecationWarning"
		);

		// @ts-expect-error eqeqeq
		return this.getDocument(id, cb);
	}

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @returns Promise with the data
	 *  @example postCode("hi!").then(console.log);
	 *  // Prints the response to console
	 *  @deprecated Since 1.2.3, use `createDocument` instead
	 */
	public postCode(text: string): Promise<ImperialResponseCreateDocument>;

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @param opts Additional options for the request **Api key is required**
	 *  @returns Promise with the data
	 *  @example postCode("hi!", { longerUrls: true }).then(console.log);
	 *  // Prints the response to console
	 *  @deprecated Since 1.2.3, use `createDocument` instead
	 */
	public postCode(text: string, opts: postOptions): Promise<ImperialResponseCreateDocument>;

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @param cb Function called after the data is sent or if there was an error
	 *  @example postCode("hi!", (e, d) => {if (!e) console.log(d);})
	 *  // Prints the response to console
	 *  @deprecated Since 1.2.3, use `createDocument` instead
	 */
	public postCode(text: string, cb: (error: unknown, data?: ImperialResponseCreateDocument) => void): void;

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @param opts Additional options for the request **Api key is required**
	 *  @param cb Function called after the data is sent or if there was an error
	 *  @example postCode("hi!", (e, d) => {if (!e) console.log(d);})
	 *  // Prints the response to console
	 *  @deprecated Since 1.2.3, use `createDocument` instead
	 */
	public postCode(
		text: string,
		opts: postOptions,
		cb: (error: unknown, data?: ImperialResponseCreateDocument) => void
	): void;

	/**
	 *  Create a document
	 *  @deprecated Since 1.2.3, use `createDocument` instead
	 */
	public postCode(
		text: string,
		optionsOrCallback?: ((error: unknown, data?: ImperialResponseCreateDocument) => void) | postOptions,
		cb?: (error: unknown, data?: ImperialResponseCreateDocument) => void
	): Promise<ImperialResponseCreateDocument> | void {
		process.emitWarning(
			"Using `postCode` will soon stop working. " + "Use the new `createDocument` instead.",
			"DeprecationWarning"
		);

		// @ts-expect-error eqeqeq
		return this.createDocument(text, optionsOrCallback, cb);
	}
}
