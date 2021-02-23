import { codes as humanReadable } from "../helpers/httpCodes";
import type { IncomingMessage } from "http";

const parseResponse = function (response: IncomingMessage): Promise<never> {
	return new Promise((resolve, reject) => {
		const data: string[] = [];
		// Collect all data chunks
		response.on("data", (chunk: string) => {
			data.push(chunk);
		});

		response.on("end", () => {
			try {
				const responseData = data.join(String());
				let json;

				try {
					json = JSON.parse(responseData);
				} catch (e) {
					/* Ignore parse error */
				}

				if (response.statusCode === 200 && json) {
					return resolve(json);
				}

				if (response.statusCode === 302) {
					/* When we encouter a 302 the request was not correct and the server decied to redirect us */
					response.statusCode = 400;
				}

				reject(
					new Error(
						json?.message
							? json.message
							: humanReadable.get(response.statusCode) ?? `Response code ${response.statusCode}`
					)
				);
			} catch (err) {
				reject(err);
			}
		});

		response.on("error", reject);
	});
};

export default parseResponse;
