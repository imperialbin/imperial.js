import { NO_ID, NO_TEXT, NO_TOKEN, OPTIONS_WRONG_TYPE, PASSWORD_WRONG_TYPE } from "../errors/Messages";
import type {
	DocumentOptions,
	ImperialResponseCreateDocument,
	ImperialResponseEditDocument,
	ImperialResponseGetDocument,
	PurgeDocuments,
} from "../common/interfaces";
import { OptionsSchema } from "../utils/schemas";
import { validateToken } from "../utils/validToken";
import { parseId } from "../utils/parseId";
import { parsePassword } from "../utils/parsePassword";
import { validateSchema } from "../utils/schemaValidator";
import { Document } from "./Document";
import { Rest } from "./rest/Rest";

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
	constructor(token?: string | null) {
		this.setApiToken(token);

		Object.defineProperty(this, "rest", { value: new Rest(this) });
	}

	/**
	 *  Get the Api Token from the Class
	 */
	public get apiToken(): string | undefined {
		return this._token;
	}

	/**
	 *  Change the Api Token on the Class
	 *
	 */
	public setApiToken(token: string | null | undefined = process.env.IMPERIAL_TOKEN): void {
		if (validateToken(token)) this._token = token as string;

		if (token === null) {
			this._token = undefined;
		}
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
	public async createDocument(text: string, options: DocumentOptions = {}): Promise<Document> {
		const convertedText = String(text);
		// If no text or text is an emtpy string reutrn
		if (!text || !convertedText) throw new Error(NO_TEXT);

		if (!options || typeof options !== "object" || Array.isArray(options)) throw new TypeError(OPTIONS_WRONG_TYPE);

		const validateOptions = validateSchema(options as never, OptionsSchema);

		// If the returned data is an error reject with it
		if (validateOptions instanceof Error) {
			throw validateOptions;
		}

		// Internal options to not modify parameters
		const internalOptions = options as DocumentOptions;

		// If there is a password provided, make the document default to encypted
		if (internalOptions?.password) {
			internalOptions.encrypted = true;
		}

		const data = await this.rest.request<ImperialResponseCreateDocument>("POST", "/document", {
			data: {
				...internalOptions,
				code: text,
			},
		});

		return new Document(this, {
			...data.document,
			content: convertedText,
			password: internalOptions?.password ?? data.document.password,
		});
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
	public async getDocument(id: string | URL, password?: string): Promise<Document> {
		// Make the user inputed data encoded so it doesn't break stuff
		const documentId = parseId(id, this.rest.hostnameCheckRegExp);

		// If the id is emtpy return
		if (!documentId) throw new Error(NO_ID);

		// If no password was set try to extract it from the id
		const documentPassword = password ?? parsePassword(id);

		if (documentPassword && typeof documentPassword !== "string") throw new Error(PASSWORD_WRONG_TYPE);

		const data = await this.rest.request<ImperialResponseGetDocument>(
			"GET",
			`/document/${encodeURIComponent(documentId)}${
				documentPassword ? `?password=${encodeURIComponent(documentPassword)}` : ""
			}`,
		);

		return new Document(this, { content: data.content, ...data.document, password: documentPassword });
	}

	/**
	 *  Deletes a Document from Imperial | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example deleteDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 */
	public async deleteDocument(id: string | URL): Promise<void> {
		// If not token return
		if (!this.apiToken) throw new Error(NO_TOKEN);

		// Make the user inputed data encoded so it doesn't break stuff
		const documentId = parseId(id, this.rest.hostnameCheckRegExp);

		// If the id is emtpy return
		if (!documentId) throw new Error(NO_ID);

		await this.rest.request("DELETE", `/document/${encodeURIComponent(documentId)}`);
	}

	/**
	 *  Edits the Documents content | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param text Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example editDocument("someid", "i am the new text!").then(console.log);
	 *  // Logs the response to the console
	 */
	public async editDocument(id: string | URL, text: string): Promise<Document> {
		// If no token return
		if (!this.apiToken) throw new Error(NO_TOKEN);

		// Make the user inputed data encoded so it doesn't break stuff
		const documentId = parseId(id, this.rest.hostnameCheckRegExp);

		// If the id is emtpy return
		if (!documentId) throw new Error(NO_ID);

		// If no newText was provided reutrn
		if (!text) throw new Error(NO_TEXT);

		const data = await this.rest.request<ImperialResponseEditDocument>("PATCH", "/document", {
			data: {
				document: documentId,
				newCode: String(text),
			},
		});

		return new Document(this, {
			content: text,
			...data.document,
		});
	}

	/**
	 *  Verify if your token is valid | **Requires an API Token**
	 *  @example verify().then(console.log)
	 *  // shows if the token is valid
	 */
	public async verify(): Promise<void> {
		// If no token return
		if (!this.apiToken) throw new Error(NO_TOKEN);

		await this.rest.request("GET", `/checkApiToken/${encodeURIComponent(this.apiToken)}`);
	}

	/**
	 *  Delete **all** of your created Documents | **Requires an API Token**
	 *  @example purgeDocuments().then(console.log)
	 *  // shows if the token is valid
	 */
	public async purgeDocuments(): Promise<PurgeDocuments> {
		// If no token return
		if (!this.apiToken) throw new Error(NO_TOKEN);

		// @ts-ignore
		const { numberDeleted } = await this.rest.request<ImperialResponsePurgeDocuments>("DELETE", "/purgeDocuments");

		return { numberDeleted };
	}
}

export interface Imperial {
	/**
	 * @internal
	 */
	rest: Rest;
}
