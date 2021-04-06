import type { CreateOptions, RawDocument } from "./helpers/interfaces";
import type { Imperial } from "./Imperial";
import { getDateDifference } from "./utils/dateDifference";
import { createFormatedLink, createRawLink } from "./utils/links";

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
	 * 	Get the formated link for the Document
	 */
	public get formattedLink(): string {
		return createFormatedLink(this._client, this.id);
	}

	/**
	 * 	Get the raw link for the Document
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
	 *  Will the Document delete after being viewed
	 */
	public get instantDelete(): boolean {
		return this._document.instantDelete;
	}

	/**
	 * 	Is the document encrypted
	 */
	public get encrypted(): boolean {
		return this._document.encrypted;
	}

	/**
	 * 	Current view count of the Document
	 */
	public get views(): number {
		return this._document.views;
	}

	/**
	 *  Username list of allowed editors
	 */
	public get editors(): string[] {
		return this._document.allowedEditors;
	}

	/**
	 *  Is the image embed turned on for this document
	 */
	public get imageEmbed(): boolean {
		return this._document.imageEmbed;
	}

	/**
	 * 	Programming langauge that is used for syntax highlighting
	 * 	Will return null if none was provided
	 */
	public get langauge(): string | null {
		return this._document.language;
	}

	/**
	 *  Is the url
	 */
	public get longerUrls(): boolean {
		return this._document.documentId.length === 26;
	}

	/**
	 * 	Password for the document
	 */
	public get password(): string | null {
		return this._document.password;
	}

	/**
	 *  Get the date that the document was created at
	 */
	public get creation(): Date {
		return new Date(this._document.creationDate);
	}

	/**
	 *  Get the date that the document will delete at
	 */
	public get expiration(): Date {
		return new Date(this._document.expirationDate);
	}

	/**
	 *  Get the days left for the document
	 */
	public get daysLeft(): number {
		return getDateDifference(new Date(), this.expiration);
	}

	/**
	 *  Raw Document data
	 */
	public get raw(): RawDocument {
		return this._document;
	}

	// Methods

	/**
	 *  Delete the current document
	 */
	public delete(): Promise<void> {
		return new Promise((resolve, reject) => {
			this._client.deleteDocument(this.id).then(() => {
				resolve();
			}, reject);
		});
	}

	/**
	 *  Duplicate the document
	 */
	public async duplicate(): Promise<Document>;

	/**
	 *  Duplicate the document
	 *  @param options These will override the options from the current document
	 */
	public async duplicate(options: CreateOptions): Promise<Document>;

	public async duplicate(options?: CreateOptions): Promise<Document> {
		return new Promise((resolve, reject) => {
			// Easier to extract it here
			const documentOptions: CreateOptions = {
				encrypted: options?.encrypted ?? this.encrypted,
				expiration: options?.expiration ?? getDateDifference(this.creation, this.expiration),
				imageEmbed: options?.imageEmbed ?? this.imageEmbed,
				longerUrls: options?.longerUrls ?? this.longerUrls,
				instantDelete: options?.instantDelete ?? this.instantDelete,
				password: options?.password ?? this.password ?? undefined,
			};

			this._client.createDocument(this.content, documentOptions).then((newDocument) => {
				resolve(newDocument);
			}, reject);
		});
	}

	/**
	 *  Edit the current document
	 */
	public async edit(text: string): Promise<void> {
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
	 *  Explode the document (Alias of `.delete`)
	 */
	explode: typeof Document.prototype.delete;
}
