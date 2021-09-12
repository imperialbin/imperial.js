import { getDateDifference } from "../utils/dateDifference";
import type { DocumentOptions, RawDocument } from "../common/interfaces";
import { createFormatedLink, createRawLink } from "../utils/links";
import { Base } from "./Base";
import type { Imperial } from "./Imperial";
import { DocumentNotFound } from "../errors/HTTPErrors/DocumentNotFound";

/**
 *  Imperial Document,
 *  All data from the Document can be accesed here
 *  @author pxseu <https://github.com/pxseu> & hexiro <https://github.com/Hexiro>
 */
export class Document extends Base {
	constructor(client: Imperial, document: RawDocument) {
		super(client);

		if (!document) throw new Error("NO DATA WAS PROVIDED");

		this._patch(document);
		this.deleted = false;
	}

	/**
	 *  @internal
	 */
	public _patch(documentData: RawDocument) {
		this.id = documentData.documentId;

		if ("content" in documentData) {
			this.content = documentData.content;
		} else if (typeof this.content !== "string") {
			// @ts-ignore
			this.content = null;
		}

		if ("instantDelete" in documentData) {
			this.instantDelete = documentData.instantDelete;
		} else if (typeof this.instantDelete !== "boolean") {
			this.instantDelete = false;
		}

		if ("encrypted" in documentData) {
			this.encrypted = documentData.encrypted;
		} else if (typeof this.encrypted !== "boolean") {
			this.encrypted = false;
		}

		if ("views" in documentData) {
			this.views = documentData.views;
		} else if (typeof this.views !== "number") {
			this.views = 0;
		}

		if ("allowedEditors" in documentData) {
			this.editors = documentData.allowedEditors;
		} else if (!Array.isArray(documentData.allowedEditors)) {
			this.editors = [];
		}

		if ("imageEmbed" in documentData) {
			this.imageEmbed = documentData.imageEmbed;
		} else if (typeof this.imageEmbed !== "boolean") {
			this.imageEmbed = false;
		}

		if ("language" in documentData) {
			this.language = documentData.language;
		} else if (typeof this.language !== "string") {
			this.language = "auto";
		}

		if ("password" in documentData) {
			this.password = documentData.password;
		} else if (typeof this.password !== "string") {
			this.password = null;
		}

		if ("public" in documentData) {
			this.public = documentData.public;
		} else if (typeof this.public !== "boolean") {
			this.public = false;
		}

		if ("creationDate" in documentData) {
			this.creation = new Date(documentData.creationDate);
		}

		if ("expirationDate" in documentData) {
			this.expiration = new Date(documentData.expirationDate);
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

	/**
	 *  The ammount of days the Doucment will expire at from the current moment
	 */
	public get daysLeft(): number | null {
		const daysLeft = getDateDifference(new Date(), this.expiration);
		if (daysLeft < 0) return null;
		return daysLeft;
	}

	// Methods

	/**
	 *  Deletes the current Document
	 *  @returns Deleted Document
	 */
	public async delete(): Promise<Document> {
		if (this.deleted) throw new DocumentNotFound();

		await this.client.deleteDocument(this.id);

		this.deleted = true;
		this.expiration = new Date();

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
	public duplicate(options: DocumentOptions): Promise<Document>;

	public async duplicate(options: DocumentOptions = {}): Promise<Document> {
		const currOptions = this.toJSON() as RawDocument;

		const documentOptions = {
			...currOptions,
			editors: this.editors,
			password: currOptions.password ?? undefined,
			...options,
		};

		const document = await this.client.createDocument(this.content, documentOptions);

		return document;
	}

	/**
	 *  Edits the content of the current Document
	 *  @param content The new content of the Document
	 *  @returns Edited Document
	 */
	public async edit(text: string): Promise<Document> {
		if (this.deleted) throw new DocumentNotFound();

		const document = await this.client.editDocument(this.id, text);

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
			id: "documentId",
			creation: "creationDate",
			expiration: "expirationDate",
			editors: "allowedEditors",
			deleted: false,
		});
	}

	// Aliases
	/**
	 *  ALias of `.content`
	 */
	public get code(): typeof Document.prototype.content {
		return this.content;
	}

	/**
	 * 	ALias of `.id`
	 */
	public get documentId(): typeof Document.prototype.id {
		return this.id;
	}

	/**
	 *  Alias of `.editors`
	 */
	public get allowedEditors(): typeof Document.prototype.editors {
		return this.editors;
	}

	/**
	 *  Alias of `.creation`
	 */
	public get creationDate(): typeof Document.prototype.creation {
		return this.creation;
	}

	/**
	 *  Alias of `.expiration`
	 */
	public get expirationDate(): typeof Document.prototype.expiration {
		return this.expiration;
	}

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
	 *  Whether the Document will be deleted after being viewed
	 */
	instantDelete: boolean;

	/**
	 * 	Whether the document is encrypted
	 */
	encrypted: boolean;

	/**
	 * 	Current view count of the Document
	 */
	views: number;

	/**
	 *  List of allowed editors of the Document
	 */
	editors: string[];

	/**
	 *  Whether the Document will embed an image of the content
	 */
	imageEmbed: boolean;

	/**
	 * 	The Programming langauge that was set to the Document
	 */
	language: string;

	/**
	 * 	Password for the Document
	 */
	password: string | null;

	/**
	 *  The date that the Document was created at
	 */
	creation: Date;

	/**
	 *  The date that the Document will be deleted at
	 */
	expiration: Date;

	/**
	 * Whether this Document has been deleted
	 */
	deleted: boolean;

	/**
	 * Whether this Document is public
	 */
	public: boolean;
}
