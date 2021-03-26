import type { OutgoingHttpHeaders } from "http";

// interfaces for most of Imperial responses

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
	documentId: string;
	rawLink: string;
	formattedLink: string;
	expiresIn: string;
	instantDelete: boolean;
	encrypted?: boolean;
	password?: string;
}

/**
 *  `getDocument` response
 */
export interface ImperialResponseGetDocument {
	document: string;
}

/**
 *  `editDocument` response
 */
export interface ImperialResponseEditDocument extends ImperialResponseCreateDocument, ImperialResponseCommon {}

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
