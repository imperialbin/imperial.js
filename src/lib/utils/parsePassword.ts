import URL from "./url";

const getPasswordFromUrl = (url: URL): string | null => {
	const password = url.searchParams.get("password");
	if (!password) return null;
	return password;
};

/**
 * 	Extract the password the passed id is an URL
 *  @internal
 */
export const parsePassword = function (id: string | URL): string | null {
	if (id instanceof URL) {
		return getPasswordFromUrl(id);
	}

	try {
		// Try to parse a url
		return getPasswordFromUrl(new URL(id));
	} catch (e) {
		// Return undefined if the parsing failed
		return null;
	}
};
