import type { DocumentEditOptions, Document as ResponseDocument, DocumentCreateOptions } from "../types/document";
import { Base } from "../client/Base";
import { Error, TypeError } from "../errors";
import { Util } from "../utils/Util";
import { Document } from "../classes/Document";
import { requireToken } from "../utils/Decorators";

export class DocumentManager extends Base {
	/**
	 *  Creates a Document
	 *  @param text The text to be sent
	 *  @returns Promise with the data
	 *  @example createDocument("hi!").then(console.log);
	 *  // Prints the response to console
	 */
	public create(text: string): Promise<Document>;

	/**
	 *  Creates a Document
	 *  @param text The text to be sent
	 *  @param options Options for the document
	 *  @returns Promise with the data
	 *  @example createDocument("hi!", { longerUrls: true }).then(console.log); // Prints the response to console
	 */
	public create(text: string, options: DocumentCreateOptions): Promise<Document>;

	/**
	 *  Create a Document
	 */
	public async create(text: string, options: DocumentCreateOptions = {}): Promise<Document> {
		// If no text or text is an emtpy string reutrn
		if (!text) throw new Error("NO_TEXT");

		if (!options || typeof options !== "object" || Array.isArray(options))
			throw new TypeError("OPTIONS_WRONG_TYPE");

		// Internal options to not modify parameters
		let settings: DocumentCreateOptions = Util.snakeify(options as Record<string, string>);

		// If there is a password provided, make the document default to encypted
		settings.encrypted = !!settings?.password;

		const content = Util.stringify(text);

		const data = await this.client.rest.request<ResponseDocument>("POST", "/document", {
			data: {
				settings,
				content,
			},
		});

		return new Document(this.client, data);
	}

	/**
	 *  Gets a Document from Imperial
	 *  @param id Id of the document
	 *  @example getDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 */
	public get(id: string): Promise<Document>;

	/**
	 *  Gets a Document from Imperial
	 *  @param id Id of the document
	 *  @param password Password to an encrypted document.
	 *  @example getDocument("someid", "you shall not pass").then(console.log);
	 *  // Logs the response to the console
	 */
	public get(id: string, password: string): Promise<Document>;

	public async get(id: string, password?: string): Promise<Document> {
		if (!id) throw new Error("NO_ID");

		if (typeof id !== "string") throw new TypeError("ID_WRONG_TYPE");

		if (password && typeof password !== "string") throw new TypeError("PASSWORD_WRONG_TYPE");

		const data = await this.client.rest.request<ResponseDocument>(
			"GET",
			`/document/${encodeURIComponent(id)}${password ? `?password=${encodeURIComponent(password)}` : ""}`,
		);

		return new Document(this.client, data);
	}

	/**
	 *  Edits the Documents content | **Requires an API Token**
	 *  @param id Id of the document
	 *  @param text Id of the document
	 *  @example editDocument("someid", "i am the new text!").then(console.log);
	 *  // Logs the response to the console
	 */
	public async edit(id: string, text: string): Promise<Document>;

	/**
	 *  Edits the Documents content | **Requires an API Token**
	 *  @param id Id of the document
	 *  @param text Id of the document
	 *  @param options Options for the document
	 *  @example editDocument("someid", "i am the new text!").then(console.log);
	 *  // Logs the response to the console
	 */
	public async edit(id: string, text: string, options: DocumentEditOptions): Promise<Document>;

	@requireToken
	public async edit(id: string, text: string, options: DocumentEditOptions = {}): Promise<Document> {
		// If no token return
		if (!this.client.apiToken) throw new Error("NO_TOKEN");

		if (!id) throw new Error("NO_ID");

		if (typeof id !== "string") throw new TypeError("ID_WRONG_TYPE");

		// If no newText was provided reutrn
		if (!text) throw new Error("NO_TEXT");

		if (!options || typeof options !== "object" || Array.isArray(options))
			throw new TypeError("OPTIONS_WRONG_TYPE");

		// Internal options to not modify parameters
		const settings = options as DocumentEditOptions;

		const content = Util.stringify(text);

		const data = await this.client.rest.request<ResponseDocument>("PATCH", "/document", {
			data: {
				id,
				content,
				settings,
			},
		});

		return new Document(this.client, data);
	}

	/**
	 *  Deletes a Document from Imperial | **Requires an API Token**
	 *  @param id Id of the document
	 *  @example deleteDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 */
	@requireToken
	public async delete(id: string): Promise<void> {
		if (!id) throw new Error("NO_ID");

		if (typeof id !== "string") throw new TypeError("ID_WRONG_TYPE");

		await this.client.rest.request("DELETE", `/document/${encodeURIComponent(id)}`);
	}
}
