import type { RawDocument, ConstructorData } from "./helpers/interfaces";
import type { Imperial } from "./Imperial";
import { createFormatedLink, createRawLink } from "./utils/links";

/**
 *  Imperial Document
 *  This is the easiest way users can interact with the api
 *
 */
export class Document {
	private _document: RawDocument;

	constructor(public client: Imperial, data: ConstructorData) {
		this.client;
		this._document = {
			...data,
			formattedLink: createFormatedLink(client, data.documentId),
			rawLink: createRawLink(client, data.documentId),
		};
	}

	/**
	 *  Content of the document
	 */
	public get code(): string {
		return this._document.content;
	}

	/**
	 * 	Get the formated link
	 */
	public get formattedLink(): string {
		return this._document.formattedLink;
	}

	/**
	 *  Id of the document
	 */
	public get id(): string {
		return this._document.documentId;
	}

	/**
	 *  Will the document delete after being viewed
	 */

	public get instantDelete(): boolean {
		return this._document.instantDelete;
	}

	/**
	 *  Delete the current document
	 */
	public delete(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client.deleteDocument(this.id).then(() => {
				resolve();
			}, reject);
		});
	}

	/**
	 *  Duplicate the document
	 */
	public async duplicate(): Promise<Document> {
		return new Promise((resolve, reject) => {
			this.client.createDocument(this.code).then((newDocument) => {
				resolve(newDocument);
			}, reject);
		});
	}

	/**
	 *  Delete the current document
	 */
	public async edit(text: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client.editDocument(this.id, text).then(() => {
				this._document.content = text;
				resolve();
			}, reject);
		});
	}

	/**
	 *  Get raw document data
	 */
	public get raw(): RawDocument {
		return this._document;
	}
}
