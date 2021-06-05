import type { ClientRequest, IncomingMessage } from "http";
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
export const handleResponse = <T extends unknown>(response: IncomingMessage, request: ClientRequest): Promise<T> =>
	new Promise((resolve, reject) => {
		const data: string[] = [];

		// Collect all data chunks
		response.on("data", (chunk: string) => {
			data.push(chunk);
		});

		response.on("end", () => {
			// join all data chunks into one
			const responseData = data.join("");

			let json: InternalResponse | undefined;

			// try to parse the json data
			try {
				json = JSON.parse(responseData);
			} catch (e) {
				// Ignore parse error
			}
			// remove not needed data
			const { success, message, ...content } = json ?? {};

			// extract the status code
			const { statusCode } = response;

			// if everything is okay resolve
			if (statusCode && noError(statusCode) && success === true) {
				return resolve(content as never);
			}

			// find an error message
			const errorMsg =
				imperialResponses(message) ??
				message ??
				statusMessage(statusCode) ??
				`Status code ${statusCode ?? null}`;

			// reject
			reject(new ImperialError({ message: errorMsg, status: statusCode, path: request.path }));
		});

		response.on("error", reject);
	});
