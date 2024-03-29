import type { Document as IDocument, DocumentEditOptions } from "../../types/document";
import { Util } from "../../utils/Util";
import { Base } from "../Base";
import type { Imperial } from "../../client/Imperial";
import { Settings } from "./Settings";
import { Timestamps } from "./Timestamps";
import { Error as ImpError } from "../../errors";
import { User } from "../User";

/**
 *  Imperial Document,
 *  All data from the Document can be accessed here
 *  @author pxseu <https://github.com/pxseu> & hexiro <https://github.com/Hexiro> & cody <https://github.com/Looskie>
 */
export class Document extends Base<IDocument> {
	constructor(client: Imperial, document: IDocument) {
		super(client);

		if (!document) throw new Error("Document is not defined");

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

		if ("creator" in document && document.creator !== null) {
			this.creator = new User(this.client, document.creator);
		} else {
			this.creator = null;
		}

		if ("gist_url" in document) {
			this.gistUrl = document.gist_url;
		} else if (typeof this.gistUrl !== "string") {
			this.gistUrl = null;
		}

		if ("views" in document) {
			this.views = document.views;
		} else if (typeof this.views !== "number") {
			this.views = 0;
		}

		if ("timestamps" in document) {
			this.timestamps = new Timestamps(this.client, document.timestamps);
		}

		if ("settings" in document) {
			this.settings = new Settings(this.client, document.settings);
		}

		return document;
	}

	/**
	 * 	URL of the Document, to view in Imperial
	 *  @returns {string} The url in format https://{hostname}/{id}
	 */
	public get formatted(): string {
		return Util.createFormattedLink(this.client, this.id);
	}

	/**
	 * 	URL to a plain text version of the Document
	 *  @returns {string} The url in format https://{hostname}/r/{id}
	 */
	public get raw(): string {
		return Util.createRawLink(this.client, this.id);
	}

	/**
	 *  Whether is the Document URL longer
	 */
	public get longerUrls(): boolean {
		return this.id.length === 26;
	}

	/**
	 *  Whether is the Document URL shorter
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
		if (this.deleted) throw new ImpError("NOT_FOUND");

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
	public async edit(content: string): Promise<Document> {
		if (this.deleted) throw new ImpError("NOT_FOUND");

		const document = await this.client.document.edit(this.id, content);

		const old = this._update(document.toJSON());

		return old;
	}

	/**
	 *  Revalidate the Document
	 *  @returns Current document
	 */
	public async revalidate(): Promise<this> {
		const data = await this.client.document.get(this.id);
		this._update(data.toJSON());
		return this;
	}

	/**
	 *  Concatenate the content instead of the object
	 */
	public toString(): string {
		return this.content;
	}

	/**
	 *  Converts the Document to the raw response
	 */
	public toJSON() {
		return super.toJSON({
			longerUrls: true,
			shortUrls: true,
			deleted: false,
		});
	}
}

Document.prototype.explode = Document.prototype.delete;

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
	 *  Creator of the Document
	 */
	creator: User | null;

	/**
	 *  Gist URL of the Document
	 */
	gistUrl: string | null;

	/**
	 * 	Current view count of the Document
	 */
	views: number;

	/**
	 *  Internal value to track if this current object had the .delete method called
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

	/**
	 *  Explode the Document (Alias of `Document#delete`)
	 */
	explode(...args: Parameters<typeof Document.prototype.delete>): ReturnType<typeof Document.prototype.delete>;
}
