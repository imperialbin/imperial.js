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
	errorMessage: Error;
	statusCode: number | undefined;
	json: Record<string, unknown>;
}

/**
 *  Little helper function to create neat errors
 */
const errorParser = ({ errorMessage, statusCode, json }: niceErrorParams): parsedError => {
	return Object.assign(errorMessage, {
		json,
		statusCode: statusCode,
		statusCodeText: humanReadable.get(statusCode),
	});
};

export default errorParser;
