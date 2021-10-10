import type { Document as IDocument, DocumentEditOptions } from "../../types/document";
import { createFormatedLink, createRawLink } from "../../utils/links";
import { Base } from "../Base";
import type { Imperial } from "../../client/Imperial";
import { DocumentNotFound } from "../../errors/Imperial/DocumentNotFound";
import { Settings } from "./Settings";
import { Timestamps } from "./Timestamps";
/**
 *  Imperial Document,
 *  All data from the Document can be accesed here
 *  @author pxseu <https://github.com/pxseu> & hexiro <https://github.com/Hexiro>
 */
export class Document extends Base {
	constructor(client: Imperial, document: IDocument) {
		super(client);

		if (!document) throw new Error("Document: No data provided");

		this._patch(document);
		this.deleted = false;
	}

	/**
	 *  @internal
	 */
	public _patch(document: IDocument) {
		this.id = document.id;

		if ("content" in document) {
			this.content = document.content;
		} else if (typeof this.content !== "string") {
			// @ts-ignore
			this.content = null;
		}

		if ("views" in document) {
			this.views = document.views;
		} else if (typeof this.views !== "number") {
			this.views = 0;
		}

		if ("settings" in document) {
			this.settings = new Settings(this.client, document.settings);
		}

		if ("timestamps" in document) {
			this.timestamps = new Timestamps(this.client, document.timestamps);
		}
	}

	/**
	 * 	URL of the Document, to view in Imperial
	 */
	public get link(): string {
		return createFormatedLink(this.client, this.id);
	}

	/**
	 * 	URL to a plain text version of the Document
	 */
	public get rawLink(): string {
		return createRawLink(this.client, this.id);
	}

	/**
	 *  Wheather is the Document URL longer
	 */
	public get longerUrls(): boolean {
		return this.id.length === 26;
	}

	/**
	 *  Wheather is the Document URL shorter
	 */
	public get shortUrls(): boolean {
		return this.id.length === 4;
	}

	// Methods

	/**
	 *  Deletes the current Document
	 *  @returns Deleted Document
	 */
	public async delete(): Promise<Document> {
		if (this.deleted) throw new DocumentNotFound();

		await this.client.document.delete(this.id);

		this.deleted = true;

		return this;
	}

	/**
	 *  Duplicates the current Document
	 *  @returns Duplicated Document
	 */
	public duplicate(): Promise<Document>;

	/**
	 *  Duplicates the current Document
	 *  @param options These will override the options from the current Document
	 *  @returns Duplicated Document
	 */
	public duplicate(options: DocumentEditOptions): Promise<Document>;

	public async duplicate(options: DocumentEditOptions = {}): Promise<Document> {
		const currOptions = this.settings.toJSON();

		const documentOptions: DocumentEditOptions = {
			...currOptions,
			...options,
		};

		const document = await this.client.document.create(this.content, documentOptions);

		return document;
	}

	/**
	 *  Edits the content of the current Document
	 *  @param content The new content of the Document
	 *  @returns Edited Document
	 */
	public async edit(text: string): Promise<Document> {
		if (this.deleted) throw new DocumentNotFound();

		const document = await this.client.document.edit(this.id, text);

		const old = this._update(document.toJSON());

		return old;
	}

	/**
	 *  Concatonate the content insted of the object
	 */
	public toString(): string {
		return this.content;
	}

	/**
	 *  Converts the Document to the raw response
	 */
	public toJSON() {
		return super.toJSON({
			deleted: false,
		});
	}

	// Aliases

	/**
	 *  Explode the Document (Alias of `.delete`)
	 */
	public explode(
		...args: Parameters<typeof Document.prototype.delete>
	): ReturnType<typeof Document.prototype.delete> {
		return this.delete(...args);
	}
}

export interface Document {
	/**
	 *  Id of the Document
	 */
	id: string;

	/**
	 *  Content of the Document
	 */
	content: string;

	/**
	 * 	Current view count of the Document
	 */
	views: number;

	/**
	 *  Whether this Document has been deleted
	 */
	deleted: boolean;

	/**
	 *  Settings of the Document
	 */
	settings: Settings;

	/**
	 *  Timestamps of the Document
	 */
	timestamps: Timestamps;
}
