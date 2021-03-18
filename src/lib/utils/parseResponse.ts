import { codes as humanReadable } from "../helpers/httpCodes";
import { responses } from "../helpers/imperialResponses";
import type { IncomingMessage, ClientRequest } from "http";
import type { ImperialResponseCommon } from "../helpers/interfaces";

/**
 *  @internal
 */
interface InternalImperial extends ImperialResponseCommon {
	[key: string]: unknown;
}

/**
 *  @internal
 */
interface ImperialErrorInterface {
	message?: string;
	status?: number;
	path?: string;
}

class ImperialError extends Error {
	public status?: number;
	public path?: string;

	constructor({ message, status, path }: ImperialErrorInterface) {
		super(message);
		this.name = "ImperialError";
		this.status = status;
		this.path = path;
	}
}

export const parseResponse = function (response: IncomingMessage, request: ClientRequest): Promise<never> {
	return new Promise((resolve, reject) => {
		const data: string[] = [];

		// Collect all data chunks
		response.on("data", (chunk: string) => {
			data.push(chunk);
		});

		response.on("end", () => {
			const responseData = data.join("");
			let json: InternalImperial | undefined;

			try {
				json = JSON.parse(responseData);
			} catch (e) {
				// Ignore parse error
			}

			if (typeof json?.message === "string") {
				json.message = responses.get(json.message) ?? json.message;
			}

			if (response.statusCode === 200 && json?.success === true) {
				return resolve(json as never);
			}

			const errorMsg =
				json?.message ?? humanReadable.get(response.statusCode) ?? `Status code ${response.statusCode ?? null}`;

			reject(new ImperialError({ message: errorMsg, status: response.statusCode, path: request.path }));
		});

		response.on("error", reject);
	});
};
