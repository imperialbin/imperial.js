import type { Document } from "./Document";
import type { CreateOptions } from "./helpers/interfaces";

// Import methods
import { validateToken } from "./helpers/validToken";
import { createDocument } from "./methods/createDocument";
import { deleteDocument } from "./methods/deleteDocument";
import { editDocument } from "./methods/editDocument";
import { getDocument } from "./methods/getDocument";
import { purgeDocuments } from "./methods/purgeDocuments";
import { verify } from "./methods/verify";

/**
 *  The API wrapper class
 *  @author https://github.com/pxseu
 */
export class Imperial {
	private _token: string | undefined;

	/**
	 *  `Imperial` constructor
	 *  @param token Your API token
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
	 *  @returns `Promise<Document>`
	 */
	public createDocument(text: string): Promise<Document>;

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @param opts Additional options for the request **Api key is required**
	 *  @returns Promise with the data
	 *  @example createDocument("hi!", { longerUrls: true }).then(console.log); // Prints the response to console
	 *  @returns `Promise<Document>`
	 */
	public createDocument(text: string, opts: CreateOptions): Promise<Document>;

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @param cb Function called after the data is sent or if there was an error
	 *  @example createDocument("hi!", (e, d) => {if (!e) console.log(d);})
	 *  // Prints the response to console
	 *  @returns `void`
	 */
	public createDocument(text: string, cb: (error: unknown, data?: Document) => void): void;

	/**
	 *  Create a document
	 *  @param text The text to be sent
	 *  @param opts Additional options for the request **Api key is required**
	 *  @param cb Function called after the data is sent or if there was an error
	 *  @example createDocument("hi!", { longerUrls: true }, (e, d) => {if (!e) console.log(d);})
	 *  // Prints the response to console
	 *  @returns `void`
	 */
	public createDocument(text: string, opts: CreateOptions, cb: (error: unknown, data?: Document) => void): void;

	/**
	 *  Create a document
	 */
	public createDocument(
		text: string,
		optionsOrCallback?: ((error: unknown, data?: Document) => void) | CreateOptions,
		cb?: (error: unknown, data?: Document) => void
	): Promise<Document> | void {
		return createDocument.call(this, text, optionsOrCallback, cb);
	}

	/**
	 *  Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example getDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 *  @returns `Promise<Document>`
	 */
	public getDocument(id: string | URL): Promise<Document>;

	/**
	 *  Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param password Password to an encrypted document.
	 *  @example getDocument("someid", "you shall not pass"), (e, d) => { if (!e) console.log(d) };
	 *  // Logs the response to the console
	 *  @returns `void`
	 */
	public getDocument(id: string | URL, password: string): Promise<Document>;

	/**
	 *  Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example getDocument("someid", (e, d) => { if (!e) console.log(d) });
	 *  // Logs the response to the console
	 *  @returns `void`
	 */
	public getDocument(id: string | URL, cb: (error: unknown, data?: Document) => void): void;

	/**
	 *  Get a document from the API
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param password Password to an encrypted document.
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example getDocument("someid", "you shall not pass", (e, d) => { if (!e) console.log(d) });
	 *  // Logs the response to the console
	 *  @returns `void`
	 */
	public getDocument(id: string | URL, password: string, cb: (error: unknown, data?: Document) => void): void;

	/**
	 *  Get a document from the API
	 */
	public getDocument(
		id: string | URL,
		passwordOrCallback?: string | ((error: unknown, data?: Document) => void),
		cb?: (error: unknown, data?: Document) => void
	): Promise<Document> | void {
		return getDocument.call(this, id, passwordOrCallback, cb);
	}

	/**
	 *  Delete a document from the API | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example deleteDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 *  @returns `Promise<void>`
	 */
	public deleteDocument(id: string | URL): Promise<void>;

	/**
	 *  Delete a document from the API | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example deleteDocument("someid", (e, d) => { if (!e) console.log(d) });
	 *  // Logs the response to the console
	 *  @returns `void`
	 */
	public deleteDocument(id: string | URL, cb: (error: unknown, data?: void) => void): void;

	/**
	 *  Delete a document from the API | **Requires an API Token**
	 */
	public deleteDocument(id: string | URL, cb?: (error: unknown) => void): Promise<void> | void {
		return deleteDocument.call(this, id, cb);
	}

	/**
	 *  Edit a document from the API | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param newText Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example editDocument("someid", "i am the new text!").then(console.log);
	 *  // Logs the response to the console
	 *  @returns `Promise<Document>`
	 */
	public editDocument(id: string | URL, newText: string): Promise<Document>;

	/**
	 *  Edit a document from the API | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param newText Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example editDocument("someid", "i am the new text!", (e, d) => { if (!e) console.log(d);});
	 *  // Logs the response to the console
	 *  @returns `void`
	 */
	public editDocument(id: string | URL, newText: string, cb: (error: unknown, data?: Document) => void): void;

	/**
	 *  Edit a document from the API | **Requires an API Token**
	 */
	public editDocument(
		id: string | URL,
		newText: string,
		cb?: (error: unknown, data?: Document) => void
	): Promise<Document> | void {
		return editDocument.call(this, id, newText, cb);
	}

	/**
	 *  Check if your token is valid **Only use when provided the token in the constructor**
	 *  @example verify().then(console.log)
	 *  // shows if the token is valid
	 *  @returns `Promise<void>`
	 */
	public verify(): Promise<void>;

	/**
	 *  Check if your token is valid **Only use when provided the token in the constructor**
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example verify((e, d) => {if (!e) console.log(d)})
	 *  // shows if the token is valid
	 *  @returns `void`
	 */
	public verify(cb?: (error: unknown) => void): void;

	/**
	 *  Check if your token is valid | **Requires an API Token**
	 */
	public verify(cb?: (error: unknown) => void): Promise<void> | void {
		return verify.call(this, cb);
	}

	/**
	 *  Purge all documents on the account connected to the Api token **Only use when provided the token in the constructor**
	 *  @example purgeDocuments().then(console.log)
	 *  // shows if the token is valid
	 *  @returns `Promise<void>`
	 */
	public purgeDocuments(): Promise<void>;

	/**
	 *  Purge all documents on the account connected to the Api token **Requires an API Token**
	 *  @param cb Function called after the data is fetched or if there was an error
	 *  @example purgeDocuments((e, d) => {if (!e) console.log(d)})
	 *  // shows if the token is valid
	 *  @returns `void`
	 */
	public purgeDocuments(cb?: (error: unknown) => void): void;

	/**
	 *  Check if your token is valid | **Requires an API Token**
	 */
	public purgeDocuments(cb?: (error: unknown) => void): Promise<void> | void {
		return purgeDocuments.call(this, cb);
	}
}
