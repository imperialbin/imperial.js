/** @internal */
export const ErrorMessages = {
	NO_TEXT: "No `text` was provided",
	NO_TOKEN: "This method requires a token to be set in the constructor",
	NO_ID: "No `id` was provided",
	NO_USERNAME: "No `username` was provided",
	NOT_FOUND: "The user or document was not found",
	NOT_AUTHORIZED: "You are not allowed to perform this action",
	PASSWORD_REQUIRED: "You must provide a password to decrypt the document",
	ABORTED: "The request was aborted",
	FETCH_ERROR: "There was an error fetching the data",
	FAILED_PARSE: "The response data could not be parsed",
	HTTP_ERROR: "There was an error with the HTTP request",

	// IMPERIAL errors
	UNAUTHORIZED: "You are not authorized to perform this action",
	BAD_AUTH: "You have no permission to perform this action",
	BAD_REQUEST: "The request was malformed",
	INTERNAL_ERROR: "There was an internal error",
} as const;

/** @internal */
export const TypeMessages = {
	TEXT_WRONG_TYPE: "Parameter `text` must be a string",
	ID_WRONG_TYPE: "Parameter `id` must be a string or an URL",
	USERNAME_WRONG_TYPE: "Parameter `username` must be a string",
	PASSWORD_WRONG_TYPE: "Parameter `password` must be a string",
	OPTIONS_WRONG_TYPE: "Parameter `options` must be an Object",
};
