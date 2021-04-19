import type { OutgoingHttpHeaders } from "http";

// interfaces for most of Imperial responses

/**
 *  All hail document info
 */
interface ResponseDocument {
	documentId: string;
	language: string | null;
	imageEmbed: boolean;
	instantDelete: boolean;
	creationDate: number;
	expirationDate: number;
	allowedEditors: string[];
	encrypted: boolean;
	password?: string;
	views?: number;
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
	instantDelete?: boolean;
	imageEmbed?: boolean;
	expiration?: number;

	/**
	 *  Will be overridden to `true` if you provide a password
	 */
	encrypted?: boolean;
	password?: string;
	language?: string;
}

/**
 *  Raw Document json data for the Document class
 */
export interface RawDocument extends ResponseDocument {
	content: string;
}

// Bellow are internal interfaces that do not get exported to the dist folder

/**
 *  @internal
 */
export interface InternalPostOptions extends DocumentOptions {
	code: string;
}

/**
 *  @internal
 */
export interface ImperialErrorInterface {
	message?: string;
	status?: number;
	path?: string;
}

/**
 *  @internal
 */
export interface InternalImperialResponse extends ImperialResponseCommon {
	success: boolean;
	[key: string]: unknown;
}

/**
 *  @internal
 */
export interface PrepareRequestParams {
	method: string;
	headers?: OutgoingHttpHeaders;
	path: string;
	hostname: string;
	token: string | undefined;
}

/**
 * 	@internal
 */
export interface Schema {
	[key: string]: {
		test: (value: unknown) => boolean;
		message: string;
		required?: boolean;
	};
}
