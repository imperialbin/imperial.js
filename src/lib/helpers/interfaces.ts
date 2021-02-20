/**
 *  Global interfaces that the user can import
 */

/**
 *  `createDocument` response
 */
export interface ImperialResponseCreateDocument {
	success: boolean;
	documentId: string;
	rawLink: string;
	formattedLink: string;
	expiresIn: string;
	instantDelete: boolean;
}

/**
 *  `getDocument` response
 */
export interface ImperialResponseGetDocument {
	success: boolean;
	document: string;
}

/**
 *  Common responses that get returned from the server
 */
export interface ImperialResponseCommon {
	success: boolean;
	message: string;
}

/**
 *  Options for creating the document
 */
export interface createOptions {
	longerUrls?: boolean;
	instantDelete?: boolean;
	imageEmbed?: boolean;
	expiration?: number;
}
