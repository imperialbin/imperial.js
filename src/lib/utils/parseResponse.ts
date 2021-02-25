import { codes as humanReadable } from "../helpers/httpCodes";
import { responses } from "../helpers/imperialResponses";
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

				if (json.message && responses.get(json.message)) {
					json.message = responses.get(json.message);
				}

				if (response.statusCode === 200 && json && json.success) {
					return resolve(json);
				}

				const errorMsg =
					json?.message ?? humanReadable.get(response.statusCode) ?? `Response code ${response.statusCode}`;

				reject(new Error(errorMsg));
			} catch (err) {
				reject(err);
			}
		});

		response.on("error", reject);
	});
};

export default parseResponse;
