import type { DocumentOptions, PurgeDocuments } from "../helper/interfaces";
import { validateToken } from "../utils/validToken";
import type { Document } from "./Document";
import { createDocument } from "./ImperialMethods/createDocument";
import { deleteDocument } from "./ImperialMethods/deleteDocument";
import { editDocument } from "./ImperialMethods/editDocument";
import { getDocument } from "./ImperialMethods/getDocument";
import { purgeDocuments } from "./ImperialMethods/purgeDocuments";
import { verify } from "./ImperialMethods/verify";

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
	constructor(token: string | undefined = process.env.IMPERIAL_TOKEN) {
		if (validateToken(token)) this._token = token;
	}

	/**
	 *  Token, that was set in the constructor
	 */
	public get token(): string | undefined {
		return this._token;
	}

	/**
	 *  Imperial's hostname
	 */
	// eslint-disable-next-line class-methods-use-this
	public get hostname(): string {
		return "imperialb.in";
	}

	/**
	 *  Regular Expression that is used to match against in functions
	 */
	// eslint-disable-next-line class-methods-use-this
	public get hostnameCheckRegExp(): RegExp {
		return /^(www\.)?imperialb(\.in|in.com)$/i;
	}

	/**
	 *  Creates a Document
	 *  @param text The text to be sent
	 *  @returns Promise with the data
	 *  @example createDocument("hi!").then(console.log);
	 *  // Prints the response to console
	 */
	public createDocument(text: string): Promise<Document>;

	/**
	 *  Creates a Document
	 *  @param text The text to be sent
	 *  @param opts Additional options for the request **Api key is required**
	 *  @returns Promise with the data
	 *  @example createDocument("hi!", { longerUrls: true }).then(console.log); // Prints the response to console
	 */
	public createDocument(text: string, options: DocumentOptions): Promise<Document>;

	/**
	 *  Create a Document
	 */
	public createDocument(text: string, options?: DocumentOptions): Promise<Document> {
		return createDocument.call(this, text, options);
	}

	/**
	 *  Gets a Document from Imperial
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example getDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 */
	public getDocument(id: string | URL): Promise<Document>;

	/**
	 *  Gets a Document from Imperial
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param password Password to an encrypted document.
	 *  @example getDocument("someid", "you shall not pass").then(console.log);
	 *  // Logs the response to the console
	 */
	public getDocument(id: string | URL, password: string): Promise<Document>;

	/**
	 *  Gets the Document from Imperial
	 */
	public getDocument(id: string | URL, password?: string): Promise<Document> {
		return getDocument.call(this, id, password);
	}

	/**
	 *  Deletes a Document from Imperial | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example deleteDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 */
	public deleteDocument(id: string | URL): Promise<void> {
		return deleteDocument.call(this, id);
	}

	/**
	 *  Edits the Documents content | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param text Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example editDocument("someid", "i am the new text!").then(console.log);
	 *  // Logs the response to the console
	 */
	public editDocument(id: string | URL, text: string): Promise<Document> {
		return editDocument.call(this, id, text);
	}

	/**
	 *  Verify if your token is valid | **Requires an API Token**
	 *  @example verify().then(console.log)
	 *  // shows if the token is valid
	 */
	public verify(): Promise<void> {
		return verify.call(this);
	}

	/**
	 *  Delete **all** of your created Documents | **Requires an API Token**
	 *  @example purgeDocuments().then(console.log)
	 *  // shows if the token is valid
	 */
	public purgeDocuments(): Promise<PurgeDocuments> {
		return purgeDocuments.call(this);
	}
}
