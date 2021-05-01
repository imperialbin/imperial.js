import { getDateDifference } from "../utils/dateDifference";
import type { DocumentOptions, RawDocument } from "../common/interfaces";
import { createFormatedLink, createRawLink } from "../utils/links";
import { Base } from "./Base";
import type { Imperial } from "./Imperial";

/**
 *  Imperial Document,
 *  All data from the Document can be accesed here
 *  @author https://github.com/pxseu & https://github.com/Hexiro
 */
export class Document extends Base {
	constructor(client: Imperial, document: RawDocument) {
		super(client);

		if (document) this._setDocument(document);
	}

	private _setDocument(document: RawDocument) {
		this.id = document.documentId ?? null;
		this.content = document.content ?? null;
		this.instantDelete = document.instantDelete ?? false;
		this.encrypted = document.encrypted ?? false;
		this.views = document.views ?? 0;
		this.editors = document.allowedEditors ?? [];
		this.imageEmbed = document.imageEmbed ?? false;
		this.language = document.language ?? "auto";
		this.password = document.password ?? null;
		this.creation = new Date(document.creationDate);
		this.expiration = new Date(document.expirationDate);
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
	 */
	public async delete(): Promise<Document> {
		await this.client.deleteDocument(this.id);

		return this;
	}

	/**
	 *  Duplicates the current Document
	 */
	public duplicate(): Promise<Document>;

	/**
	 *  Duplicates the current Document
	 *  @param options These will override the options from the current Document
	 */
	public duplicate(options: DocumentOptions): Promise<Document>;

	public async duplicate(options: DocumentOptions = {}): Promise<Document> {
		const documentOptions: DocumentOptions = {
			encrypted: options?.encrypted ?? this.encrypted,
			expiration: options?.expiration ?? getDateDifference(this.creation, this.expiration),
			imageEmbed: options?.imageEmbed ?? this.imageEmbed,
			longerUrls: options?.longerUrls ?? this.longerUrls,
			instantDelete: options?.instantDelete ?? this.instantDelete,
			password: options?.password ?? this.password ?? undefined,
			editors: options?.editors ?? this.editors,
			language: options?.language ?? this.language ?? undefined,
		};

		const document = await this.client.createDocument(this.content, documentOptions);

		return document;
	}

	/**
	 *  Edits the content of the current Document
	 */
	public async edit(text: string): Promise<Document> {
		const document = await this.client.editDocument(this.id, text);
		this._setDocument(document.toJSON());
		return this;
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
	public toJSON(): RawDocument {
		return {
			documentId: this.id,
			content: this.content,
			creationDate: this.creation.valueOf(),
			expirationDate: this.expiration.valueOf(),
			allowedEditors: this.editors,
			encrypted: this.encrypted,
			imageEmbed: this.imageEmbed,
			instantDelete: this.instantDelete,
			language: this.language,
			password: this.password,
			views: this.views,
		};
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
}
