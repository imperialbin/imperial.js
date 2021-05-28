// interfaces for most of Imperial responses

/**
 *  All hail document info
 */
interface ResponseDocument {
	documentId: string;
	language: string;
	imageEmbed: boolean;
	instantDelete: boolean;
	creationDate: number;
	expirationDate: number;
	allowedEditors: string[];
	encrypted: boolean;
	password: string | null;
	views: number;
	public: boolean;
}

/**
 *  Common response that get returned from the server
 */
export interface ImperialResponseCommon {
	message: string;
}

/**
 *  `createDocument` response
 */
export interface ImperialResponseCreateDocument {
	rawLink: string;
	formattedLink: string;
	document: ResponseDocument;
}

/**
 *  `getDocument` response
 */
export interface ImperialResponseGetDocument {
	content: string;
	document: ResponseDocument;
}

/**
 *  `editDocument` response
 */
export type ImperialResponseEditDocument = ImperialResponseCreateDocument;

export interface PurgeDocuments {
	numberDeleted: number;
}

/**
 *  `purgeDocuments` response
 */
export interface ImperialResponsePurgeDocuments extends ImperialResponseCommon, PurgeDocuments {}

// Misc interfaces

/**
 *  Options for creating the Document
 */
export interface DocumentOptions {
	editors?: string[];
	longerUrls?: boolean;
	shortUrls?: boolean;
	instantDelete?: boolean;
	imageEmbed?: boolean;
	expiration?: number;

	/**
	 *  Will be overridden to `true` if you provide a password
	 */
	encrypted?: boolean;
	password?: string;
	language?: string;
	public?: boolean;
}

/**
 *  Raw Document json data for the Document class
 */
export interface RawDocument extends ResponseDocument {
	content: string;
}
