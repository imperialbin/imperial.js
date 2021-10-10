import { Base } from "./Base";
import { NO_ID, NO_TEXT, NO_TOKEN, OPTIONS_WRONG_TYPE, PASSWORD_WRONG_TYPE } from "../../errors/Messages";
import type { IdResolvable } from "../../types/common";
import type { DocumentEditOptions, Document as ResponseDocument, DocumentCreateOptions } from "../../types/document";
import { CreateOptionsSchema, EditOptionsSchema } from "../../utils/schemas";
import { parseId } from "../../utils/parseId";
import { parsePassword } from "../../utils/parsePassword";
import { validateSchema } from "../../utils/schemaValidator";
import { Document } from "../../classes/Document";
import { stringify } from "../../utils/stringify";
import { WrongPassword, NotAllowed, DocumentNotFound, ImperialError } from "../../errors";

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
		if (!text) throw new Error(NO_TEXT);

		if (!options || typeof options !== "object" || Array.isArray(options)) throw new TypeError(OPTIONS_WRONG_TYPE);

		const validateOptions = validateSchema(options as never, CreateOptionsSchema);

		// If the returned data is an error reject with it
		if (validateOptions instanceof Error) {
			throw validateOptions;
		}

		// Internal options to not modify parameters
		const settings = options as DocumentCreateOptions;

		// If there is a password provided, make the document default to encypted
		settings.encrypted = !!settings?.password;

		const content = stringify(text);

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
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example getDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 */
	public get(id: IdResolvable): Promise<Document>;

	/**
	 *  Gets a Document from Imperial
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param password Password to an encrypted document.
	 *  @example getDocument("someid", "you shall not pass").then(console.log);
	 *  // Logs the response to the console
	 */
	public get(id: IdResolvable, password: string): Promise<Document>;

	/**
	 *  Gets the Document from Imperial
	 */
	public async get(id: IdResolvable, password?: string): Promise<Document> {
		// Make the user inputed data encoded so it doesn't break stuff
		const documentId = parseId(id, this.client.rest.hostnameCheckRegExp);

		// If the id is emtpy return
		if (!documentId) throw new Error(NO_ID);

		// If no password was set try to extract it from the id
		const documentPassword = password ?? parsePassword(id);

		if (documentPassword && typeof documentPassword !== "string") throw new Error(PASSWORD_WRONG_TYPE);

		try {
			const data = await this.client.rest.request<ResponseDocument>(
				"GET",
				`/document/${encodeURIComponent(documentId)}${
					documentPassword ? `?password=${encodeURIComponent(documentPassword)}` : ""
				}`,
			);

			return new Document(this.client, data);
		} catch (error) {
			if (error instanceof ImperialError) {
				switch (error.status) {
					case 404:
						throw new DocumentNotFound(error);

					case 401:
						throw new WrongPassword(error);

					default: // Empty because we throw bellow
				}
			}

			throw error;
		}
	}

	/**
	 *  Edits the Documents content | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param text Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example editDocument("someid", "i am the new text!").then(console.log);
	 *  // Logs the response to the console
	 */
	public async edit(id: IdResolvable, text: string): Promise<Document>;

	/**
	 *  Edits the Documents content | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param text Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @param options Options for the document
	 *  @example editDocument("someid", "i am the new text!").then(console.log);
	 *  // Logs the response to the console
	 */
	public async edit(id: IdResolvable, text: string, options: DocumentEditOptions): Promise<Document>;

	public async edit(id: IdResolvable, text: string, options: DocumentEditOptions = {}): Promise<Document> {
		// If no token return
		if (!this.client.apiToken) throw new Error(NO_TOKEN);

		// Make the user inputed data encoded so it doesn't break stuff
		const documentId = parseId(id, this.client.rest.hostnameCheckRegExp);

		// If the id is emtpy return
		if (!documentId) throw new Error(NO_ID);

		// If no newText was provided reutrn
		if (!text) throw new Error(NO_TEXT);

		if (!options || typeof options !== "object" || Array.isArray(options)) throw new TypeError(OPTIONS_WRONG_TYPE);

		const validateOptions = validateSchema(options as never, EditOptionsSchema);

		// If the returned data is an error reject with it
		if (validateOptions instanceof Error) {
			throw validateOptions;
		}

		// Internal options to not modify parameters
		const settings = options as DocumentEditOptions;

		const content = stringify(text);

		try {
			const data = await this.client.rest.request<ResponseDocument>("PATCH", "/document", {
				data: {
					id: documentId,
					content,
					settings,
				},
			});

			return new Document(this.client, data);
		} catch (error) {
			if (error instanceof ImperialError) {
				switch (error.status) {
					case 404:
						throw new DocumentNotFound(error);

					case 401:
						throw new NotAllowed(error);

					default: // Empty because we throw bellow
				}
			}

			throw error;
		}
	}

	/**
	 *  Deletes a Document from Imperial | **Requires an API Token**
	 *  @param id Id of the document or a URL to it. It will try to parse a URL and extract the Id.
	 *  @example deleteDocument("someid").then(console.log);
	 *  // Logs the response to the console
	 */
	public async delete(id: IdResolvable): Promise<void> {
		// If not token return
		if (!this.client.apiToken) throw new Error(NO_TOKEN);

		// Make the user inputed data encoded so it doesn't break stuff
		const documentId = parseId(id, this.client.rest.hostnameCheckRegExp);

		// If the id is emtpy return
		if (!documentId) throw new Error(NO_ID);

		try {
			await this.client.rest.request("DELETE", `/document/${encodeURIComponent(documentId)}`);
		} catch (error) {
			if (error instanceof ImperialError) {
				switch (error.status) {
					case 404:
						throw new DocumentNotFound(error);

					case 401:
						throw new NotAllowed(error);

					default: // Empty because we throw bellow
				}
			}

			throw error;
		}
	}
}
