import type {
	CreateOptions,
	ImperialResponseCommon,
	ImperialResponseCreateDocument,
	ImperialResponseEditDocument,
	ImperialResponseGetDocument,
} from "./helpers/interfaces";

// Import methods
import { validateToken } from "./helpers/validToken";
import { createDocument } from "./methods/createDocument";
import { deleteDocument } from "./methods/deleteDocument";
import { editDocument } from "./methods/editDocument";
import { getDocument } from "./methods/getDocument";
import { verify } from "./methods/verify";

/**
 *  The API wrapper class
 *  @author https://github.com/pxseu
 */
export class Imperial {
	private _token: string | undefined;

	/**
	 *  `Imperial` constructor
	 *  @param {String} token Your API token
	 */
	constructor(token?: string) {
		if (validateToken(token)) this._token = token;
	}

	/**
	 *  The token you provided in the constructor
	 */
	public get token(): string | undefined {
		return this._token;
	}

	/**
	 *  Imperial's domain name
	 */
	public get Hostname(): string {
		return "imperialb.in";
	}

	/**
	 *  Regex to check if the domain provided is part of imperial
	 */
	public get HostnameCheckRegExp(): RegExp {
		return /^(www\.)?imperialb(\.in|in.com)$/i;
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
	public createDocument(text: string, opts: CreateOptions): Promise<ImperialResponseCreateDocument>;

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
	 *  @example createDocument("hi!", { longerUrls: true }, (e, d) => {if (!e) console.log(d);})
	 *  // Prints the response to console
	 *  @returns `void`
	 */
	public createDocument(
		text: string,
		opts: CreateOptions,
		cb: (error: unknown, data?: ImperialResponseCreateDocument) => void
	): void;

	/**
	 *  Create a document
	 */
	public createDocument(
		text: string,
		optionsOrCallback?: ((error: unknown, data?: ImperialResponseCreateDocument) => void) | CreateOptions,
		cb?: (error: unknown, data?: ImperialResponseCreateDocument) => void
	): Promise<ImperialResponseCreateDocument> | void {
		return createDocument.call(this, text, optionsOrCallback, cb);
	}

	/**
	 *  Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example getDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 *  @returns `Promise<ImperialResponseGetDocument>`
	 */
	public getDocument(id: string | URL): Promise<ImperialResponseGetDocument>;

	/**
	 *  Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param password Password to an encrypted document.
	 *  @example getDocument("someid", "you shall not pass"), (e, d) => { if (!e) console.log(d) };
	 *  // Logs the response to the console
	 *  @returns `void`
	 */
	public getDocument(id: string | URL, password: string): Promise<ImperialResponseGetDocument>;

	/**
	 *  Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example getDocument("someid", (e, d) => { if (!e) console.log(d) });
	 *  // Logs the response to the console
	 *  @returns `void`
	 */
	public getDocument(id: string | URL, cb: (error: unknown, data?: ImperialResponseGetDocument) => void): void;

	/**
	 *  Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param password Password to an encrypted document.
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example getDocument("someid", "you shall not pass", (e, d) => { if (!e) console.log(d) });
	 *  // Logs the response to the console
	 *  @returns `void`
	 */
	public getDocument(
		id: string | URL,
		password: string,
		cb: (error: unknown, data?: ImperialResponseGetDocument) => void
	): void;

	/**
	 *  Get a document from the API
	 */
	public getDocument(
		id: string | URL,
		passwordOrCallback?: string | ((error: unknown, data?: ImperialResponseGetDocument) => void),
		cb?: (error: unknown, data?: ImperialResponseGetDocument) => void
	): Promise<ImperialResponseGetDocument> | void {
		return getDocument.call(this, id, passwordOrCallback, cb);
	}

	/**
	 *  Delete a document from the API | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example deleteDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 *  @returns {Promise<ImperialResponseCommon>} `Promise<ImperialResponseCommon>`
	 */
	public deleteDocument(id: string | URL): Promise<ImperialResponseCommon>;

	/**
	 *  Delete a document from the API | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example deleteDocument("someid", (e, d) => { if (!e) console.log(d) });
	 *  // Logs the response to the console
	 *  @returns {void} `void`
	 */
	public deleteDocument(id: string | URL, cb: (error: unknown, data?: ImperialResponseCommon) => void): void;

	/**
	 *  Delete a document from the API | **Requires an API Token**
	 */
	public deleteDocument(
		id: string | URL,
		cb?: (error: unknown, data?: ImperialResponseCommon) => void
	): Promise<ImperialResponseCommon> | void {
		return deleteDocument.call(this, id, cb);
	}

	/**
	 *  Edit a document from the API | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param newText Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example editDocument("someid", "i am the new text!").then(console.log);
	 *  // Logs the response to the console
	 *  @returns {Promise<ImperialResponseEditDocument>} `Promise<ImperialResponseEditDocument>`
	 */
	public editDocument(id: string | URL, newText: string): Promise<ImperialResponseEditDocument>;

	/**
	 *  Edit a document from the API | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param newText Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example editDocument("someid", "i am the new text!", (e, d) => { if (!e) console.log(d);});
	 *  // Logs the response to the console
	 *  @returns {void} `void`
	 */
	public editDocument(
		id: string | URL,
		newText: string,
		cb: (error: unknown, data?: ImperialResponseEditDocument) => void
	): void;

	/**
	 *  Edit a document from the API | **Requires an API Token**
	 */
	public editDocument(
		id: string | URL,
		newText: string,
		cb?: (error: unknown, data?: ImperialResponseEditDocument) => void
	): Promise<ImperialResponseEditDocument> | void {
		return editDocument.call(this, id, newText, cb);
	}

	/**
	 *  Check if your token is valid **Only use when provided the token in the constructor**
	 *  @example verify().then(console.log)
	 *  // shows if the token is valid
	 *  @returns `Promise<ImperialResponseCommon>`
	 */
	public verify(): Promise<ImperialResponseCommon>;

	/**
	 *  Check if your token is valid | **Requires an API Token**
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example verify((e, d) => {if (!e) console.log(d)})
	 *  // shows if the token is valid
	 *  @returns `void`
	 */
	public verify(cb?: (error: unknown, data?: ImperialResponseCommon) => void): void;

	/**
	 *  Check if your token is valid | **Requires an API Token**
	 */
	public verify(
		cb?: (error: unknown, data?: ImperialResponseCommon) => void
	): Promise<ImperialResponseCommon> | void {
		return verify.call(this, cb);
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
	 *  @example getDocument("someid", (e, d) => { if (!e) console.log(d) });
	 *  // Logs the response to the console
	 *  @returns `void`
	 *  @deprecated Since 1.2.3, use `getDocument` instead
	 */
	public getCode(id: string, cb: (error: unknown, data?: ImperialResponseGetDocument) => void): void;

	/**
	 *  Get a document from the API
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

		return getDocument.call(this, id, undefined, cb);
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
	public postCode(text: string, opts: CreateOptions): Promise<ImperialResponseCreateDocument>;

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
		opts: CreateOptions,
		cb: (error: unknown, data?: ImperialResponseCreateDocument) => void
	): void;

	/**
	 *  Create a document
	 *  @deprecated Since 1.2.3, use `createDocument` instead
	 */
	public postCode(
		text: string,
		optionsOrCallback?: ((error: unknown, data?: ImperialResponseCreateDocument) => void) | CreateOptions,
		cb?: (error: unknown, data?: ImperialResponseCreateDocument) => void
	): Promise<ImperialResponseCreateDocument> | void {
		process.emitWarning(
			"Using `postCode` will soon stop working. " + "Use the new `createDocument` instead.",
			"DeprecationWarning"
		);

		return createDocument.call(this, text, optionsOrCallback, cb);
	}
}
