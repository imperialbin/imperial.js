import type { ClientRequest, IncomingMessage } from "http";
import { codes as humanReadable } from "../helpers/httpCodes";
import { responses } from "../helpers/imperialResponses";
import type { InternalImperialResponse } from "../helpers/interfaces";
import { ImperialError } from "./ImperialError";

export const parseResponse = function (response: IncomingMessage, request: ClientRequest): Promise<never> {
	return new Promise((resolve, reject) => {
		const data: string[] = [];

		// Collect all data chunks
		response.on("data", (chunk: string) => {
			data.push(chunk);
		});

		response.on("end", () => {
			const responseData = data.join("");
			let json: InternalImperialResponse | undefined;

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
