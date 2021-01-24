import { codes as humanReadable } from "./httpCodes";

/**
 *  Parsed errors that are made if there was an issue with the API
 */
export interface parsedError extends Error {
	json?: Record<string, unknown>;
	statusCode?: number;
	statusCodeText?: string;
	rateLimitReset?: number;
}

interface niceErrorParams {
	errorMessage?: string;
	statusCode?: number;
	json?: Record<string, unknown>;
}

/**
 *  Little helper function to create neat errors
 */
const niceError = ({ errorMessage, statusCode, json }: niceErrorParams): parsedError => {
	let _errorMessage = errorMessage;

	if (!_errorMessage && statusCode) {
		_errorMessage = humanReadable.get(statusCode);
	}

	return Object.assign(new Error(errorMessage), {
		json,
		statusCode: statusCode,
		statusCodeText: humanReadable.get(statusCode),
	});
};

export default niceError;
