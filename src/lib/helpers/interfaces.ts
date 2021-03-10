/**
 *  Global interfaces that the user can import
 */

// Imperial resonse interfaces

interface ResponseBase {
	success: boolean;
}

/**
 *  Common responses that get returned from the server
 */
export interface ImperialResponseCommon extends ResponseBase {
	message: string;
}

/**
 *  `createDocument` response
 */
export interface ImperialResponseCreateDocument extends ResponseBase {
	documentId: string;
	rawLink: string;
	formattedLink: string;
	expiresIn: string;
	instantDelete: boolean;
	encrypted?: boolean;
	password: string | false;
}

/**
 *  `getDocument` response
 */
export interface ImperialResponseGetDocument extends ResponseBase {
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
export interface createOptions {
	longerUrls?: boolean;
	instantDelete?: boolean;
	imageEmbed?: boolean;
	expiration?: number;
	encrypted?: boolean;
	password?: string;
}
