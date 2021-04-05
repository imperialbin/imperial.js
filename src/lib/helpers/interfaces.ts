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
	password: string | null;
	views: number;
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

/**
 *  `purgeDocuments` response
 */
export interface ImperialResponsePurgeDocuments extends ImperialResponseCommon {
	numberDeleted: number;
}
// Misc interfaces

/**
 *  Options for creating the document
 */
export interface CreateOptions {
	longerUrls?: boolean;
	instantDelete?: boolean;
	imageEmbed?: boolean;
	expiration?: number;
	encrypted?: boolean;
	password?: string;
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
export interface InternalPostOptions extends CreateOptions {
	code: string;
	[key: string]: unknown;
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
