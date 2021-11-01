import type { Response } from "node-fetch";
import { URL } from "url";
import { noError, statusMessage } from "./statusCode";
import { ImperialError, NotAllowed, NotFound } from "../errors";

interface InternalResponse<T> {
	success: boolean;
	data: T;
	message?: string;
	[key: string]: unknown;
}

/**
 *  @internal
 */
export const handleResponse = async <T extends unknown>(response: Response): Promise<T> => {
	let json: InternalResponse<T> | undefined;

	// try to parse the json data
	try {
		json = await response.json();
	} catch (e) {
		// Ignore parse error
	}

	// remove not needed data
	const { success, data } = json ?? {};

	// extract the status code
	const { status } = response;

	// console.log(status, data);

	// if everything is okay resolve
	if (status && noError(status) && success === true) {
		return data as T;
	}

	// find an error message
	const { pathname: path } = new URL(response.url);

	switch (status) {
		case 401: {
			throw new NotAllowed({ path });
		}

		case 404: {
			throw new NotFound({ path });
		}

		default: {
			const message = json?.message ?? statusMessage(status) ?? `Status: ${status ?? null}`;

			// throw an error
			throw new ImperialError({ message, status, path });
		}
	}
};
