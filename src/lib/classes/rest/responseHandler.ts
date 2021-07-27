import type { Response } from "node-fetch";
import { URL } from "url";
import { imperialResponses } from "./responseMap";
import { noError, statusMessage } from "./statusCode";
import { ImperialError } from "../../errors/ImperialError";
import type { ImperialResponseCommon } from "../../common/interfaces";

interface InternalResponse extends ImperialResponseCommon {
	success: boolean;
	[key: string]: unknown;
}

/**
 *  @internal
 */
export const handleResponse = async <T extends unknown>(response: Response): Promise<T> => {
	let json: InternalResponse | undefined;

	// try to parse the json data
	try {
		json = await response.json();
	} catch (e) {
		// Ignore parse error
	}

	// remove not needed data
	const { success, message, ...content } = json ?? {};

	// extract the status code
	const { status } = response;

	// if everything is okay resolve
	if (status && noError(status) && success === true) {
		return content as never;
	}

	// find an error message
	const errorMsg = imperialResponses(message) ?? message ?? statusMessage(status) ?? `Status code ${status ?? null}`;

	// throw an error
	throw new ImperialError({ message: errorMsg, status, path: new URL(response.url).pathname });
};
