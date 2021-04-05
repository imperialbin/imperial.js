import type { ConstructorData, CreateOptions, RawDocument } from "./helpers/interfaces";
import type { Imperial } from "./Imperial";
import { getDateDifference } from "./utils/dateDifference";
import { createFormatedLink, createRawLink } from "./utils/links";

/**
 *  Imperial Document
 *  All data can be accesed here
 */
export class Document {
	private _document: RawDocument;

	constructor(private client: Imperial, data: ConstructorData) {
		this.client;
		this._document = {
			...data,
			formattedLink: createFormatedLink(client, data.documentId),
			rawLink: createRawLink(client, data.documentId),
		};
	}

	// Props

	/**
	 *  Content of the Document
	 */
	public get code(): string {
		new Date();
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
	public get allowedEditors(): string[] {
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
	public get creationDate(): Date {
		return new Date(this._document.creationDate);
	}

	/**
	 *  Get the date that the document was created at
	 */
	public get deletionDate(): Date {
		return new Date(this._document.expirationDate);
	}

	/**
	 *  Raw Document data
	 */
	public get raw(): RawDocument {
		return this._document;
	}

	/**
	 *  Get the days left for the document
	 */
	public get daysLeft(): number {
		return getDateDifference(new Date(), this.deletionDate);
	}

	// Methods

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
				expiration: options?.expiration ?? getDateDifference(this.creationDate, this.deletionDate),
				imageEmbed: options?.imageEmbed ?? this.imageEmbed,
				longerUrls: options?.longerUrls ?? this.longerUrls,
				instantDelete: options?.instantDelete ?? this.instantDelete,
				password: options?.password ?? this.password ?? undefined,
			};

			this.client.createDocument(this.code, documentOptions).then((newDocument) => {
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
	 *  Explode the document
	 */
	public explode(): Promise<void> {
		return this.delete();
	}
}
