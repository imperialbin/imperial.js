import type { Document } from "./Document";
import type { CreateOptions } from "./helpers/interfaces";
import { createDocument } from "./methods/createDocument";
import { deleteDocument } from "./methods/deleteDocument";
import { editDocument } from "./methods/editDocument";
import { getDocument } from "./methods/getDocument";
import { purgeDocuments } from "./methods/purgeDocuments";
import { verify } from "./methods/verify";
// Import methods
import { validateToken } from "./utils/validToken";

/**
 *  The Imperial class
 *  Easiest way to interact with the Api
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
	public get hostname(): string {
		return "imperialb.in";
	}

	/**
	 *  Regex to check if the domain provided is part of imperial
	 */
	public get hostnameCheckRegExp(): RegExp {
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
	public createDocument(text: string, options: CreateOptions): Promise<Document>;

	/**
	 *  Create a document
	 */
	public createDocument(text: string, options?: CreateOptions): Promise<Document> {
		return createDocument.call(this, text, options);
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
	 */
	public getDocument(id: string | URL, password?: string): Promise<Document> {
		return getDocument.call(this, id, password);
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
	 */
	public deleteDocument(id: string | URL): Promise<void> {
		return deleteDocument.call(this, id);
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
	 */
	public editDocument(id: string | URL, newText: string): Promise<Document> {
		return editDocument.call(this, id, newText);
	}

	/**
	 *  Check if your token is valid **Only use when provided the token in the constructor**
	 *  @example verify().then(console.log)
	 *  // shows if the token is valid
	 *  @returns `Promise<void>`
	 */
	public verify(): Promise<void>;

	/**
	 *  Check if your token is valid | **Requires an API Token**
	 */
	public verify(): Promise<void> {
		return verify.call(this);
	}

	/**
	 *  Purge all documents on the account connected to the Api token **Only use when provided the token in the constructor**
	 *  @example purgeDocuments().then(console.log)
	 *  // shows if the token is valid
	 *  @returns `Promise<void>`
	 */
	public purgeDocuments(): Promise<void>;

	/**
	 *  Check if your token is valid | **Requires an API Token**
	 */
	public purgeDocuments(): Promise<void> {
		return purgeDocuments.call(this);
	}
}
