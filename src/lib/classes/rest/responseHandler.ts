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
 *  Thank you stackoverflow for the generic example <3333
 */
export const handleResponse = <T extends unknown>(response: IncomingMessage, request: ClientRequest): Promise<T> =>
	new Promise((resolve, reject) => {
		const data: string[] = [];

		// Collect all data chunks
		response.on("data", (chunk: string) => {
			data.push(chunk);
		});

		response.on("end", () => {
			const responseData = data.join("");

			let json: InternalResponse | undefined;

			try {
				json = JSON.parse(responseData);
			} catch (e) {
				// Ignore parse error
			}

			if (typeof json?.message === "string") {
				json.message = imperialResponses.get(json.message) ?? json.message;
			}

			/*
			 *  This basically removes the success and message from all of
			 *  the responses because it would not matter anyway
			 *
			 *  I also added the emtpy object so it doesn't cry if
			 *  the json object is undefined
			 */
			const { success, message, ...content } = json ?? {};

			const { statusCode } = response;

			if (statusCode && noError(statusCode) && success === true) {
				return resolve(content as never);
			}

			const errorMsg = message ?? statusMessage(statusCode) ?? `Status code ${statusCode ?? null}`;

			reject(new ImperialError({ message: errorMsg, status: statusCode, path: request.path }));
		});

		response.on("error", reject);
	});
