import type { DocumentOptions, RawDocument } from "../helper/interfaces";
import { createFormatedLink, createRawLink } from "../helper/links";
import { getDateDifference } from "../helper/dateDifference";
import type { Imperial } from "./Imperial";

/**
 *  Imperial Document,
 *  All data from the Document can be accesed here
 *  @author https://github.com/pxseu & https://github.com/Hexiro
 */
export class Document {
	private _client: Imperial;

	private _document: RawDocument;

	constructor(client: Imperial, document: RawDocument) {
		this._client = client;
		this._document = document;
	}

	// Props

	/**
	 *  Content of the Document
	 */
	public get content(): string {
		return this._document.content;
	}

	/**
	 * 	URL of the Document, to view in Imperial
	 */
	public get formattedLink(): string {
		return createFormatedLink(this._client, this.id);
	}

	/**
	 * 	URL to a plain text version of the Document
	 */
	public get rawLink(): string {
		return createRawLink(this._client, this.id);
	}

	/**
	 *  Id of the Document
	 */
	public get id(): string {
		return this._document.documentId;
	}

	/**
	 *  Whether the Document will be deleted after being viewed
	 */
	public get instantDelete(): boolean {
		return this._document.instantDelete;
	}

	/**
	 * 	Whether the document is encrypted
	 */
	public get encrypted(): boolean {
		return this._document.encrypted;
	}

	/**
	 * 	Current view count of the Document
	 */
	public get views(): number | null {
		return this._document.views ?? null;
	}

	/**
	 *  List of allowed editors of the Document
	 */
	public get editors(): string[] {
		return this._document.allowedEditors;
	}

	/**
	 *  Whether the Document will embed an image of the content
	 */
	public get imageEmbed(): boolean {
		return this._document.imageEmbed;
	}

	/**
	 * 	The Programming langauge that was set to the Document
	 */
	public get langauge(): string | null {
		return this._document.language ?? null;
	}

	/**
	 *  Wheather is the Document URL longer
	 */
	public get longerUrls(): boolean {
		return this._document.documentId.length === 26;
	}

	/**
	 * 	Password for the Document
	 */
	public get password(): string | null {
		return this._document.password ?? null;
	}

	/**
	 *  The date that the Document was created at
	 */
	public get creation(): Date {
		return new Date(this._document.creationDate);
	}

	/**
	 *  The date that the Document will be deleted at
	 */
	public get expiration(): Date {
		return new Date(this._document.expirationDate);
	}

	/**
	 *  The ammount of days the Doucment will expire at from the current moment
	 */
	public get daysLeft(): number | null {
		const daysLeft = getDateDifference(new Date(), this.expiration);
		if (daysLeft < 0) return null;
		return daysLeft;
	}

	/**
	 *  The raw JSON data of the Document
	 */
	public get raw(): RawDocument {
		return this._document;
	}

	// Methods

	/**
	 *  Deletes the current Document
	 */
	public delete(): Promise<void> {
		return new Promise((resolve, reject) => {
			this._client.deleteDocument(this.id).then(() => {
				resolve();
			}, reject);
		});
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

	public duplicate(options?: DocumentOptions): Promise<Document> {
		return new Promise((resolve, reject) => {
			// Easier to extract it here
			const documentOptions: DocumentOptions = {
				encrypted: options?.encrypted ?? this.encrypted,
				expiration: options?.expiration ?? getDateDifference(this.creation, this.expiration),
				imageEmbed: options?.imageEmbed ?? this.imageEmbed,
				longerUrls: options?.longerUrls ?? this.longerUrls,
				instantDelete: options?.instantDelete ?? this.instantDelete,
				password: options?.password ?? this.password ?? undefined,
				editors: options?.editors ?? this.editors,
				language: options?.language ?? this.langauge ?? undefined,
			};

			this._client.createDocument(this.content, documentOptions).then((newDocument) => {
				resolve(newDocument);
			}, reject);
		});
	}

	/**
	 *  Edits the content of the current Document
	 */
	public edit(text: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this._client.editDocument(this.id, text).then(() => {
				this._document.content = text;
				resolve();
			}, reject);
		});
	}

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
}

// Method aliases
Document.prototype.explode = Document.prototype.delete;

export interface Document {
	/**
	 *  Explode the Document (Alias of `.delete`)
	 */
	explode: typeof Document.prototype.delete;
}
