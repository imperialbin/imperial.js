import { URL } from "url";
import { TypeError } from "../errors";
import type { IdResolvable } from "../types/common";

const getPasswordFromUrl = (url: URL): string | null => {
	if (!url.protocol.toLowerCase().startsWith("http")) throw new TypeError("PASSWORD_WRONG_TYPE");
	const password = url.searchParams.get("password");

	if (!password) return null;
	return password;
};

/**
 * 	Extract the password the passed id is an URL
 *  @internal
 */
export const parsePassword = function (id: IdResolvable): string | null {
	if (!id) throw new Error("NO_ID");

	if (id instanceof URL) {
		return getPasswordFromUrl(id);
	}

	if (typeof id !== "string") throw new TypeError("PASSWORD_WRONG_TYPE");

	try {
		// Try to parse a url
		return getPasswordFromUrl(new URL(id));
	} catch (e) {
		// Return undefined if the parsing failed
		return null;
	}
};
