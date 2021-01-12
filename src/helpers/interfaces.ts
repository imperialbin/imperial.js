/**
 *  `postCode` response that gets return from the Wrapper
 */
export interface ImperialResponsePostCode {
	success: boolean;
	documentId: string;
	rawLink: string;
	formattedLink: string;
	expiresIn: string;
	instantDelete: boolean;
}

/**
 *  `getCode` response that gets return from the Wrapper
 */
export interface ImperialResponseGetCode {
	success: boolean;
	document: string;
}

/**
 *  Options that a user can pass in the `opts` object
 */
export interface postOptions {
	longerUrls?: boolean;
	instantDelete?: boolean;
	imageEmbed?: boolean;
	expiration?: number;
}

export interface prepareParams {
	method: string;
	headers?: Record<string, unknown>;
	path: string;
}
