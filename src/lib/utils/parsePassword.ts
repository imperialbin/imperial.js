const getPasswordFromUrl = (url: URL): string | undefined => {
	const password = url.searchParams.get("password");

	if (!password) return;
	return password;
};

export const parsePassword = function (id: string | URL): string | undefined {
	if (id instanceof URL) {
		return getPasswordFromUrl(id as URL);
	}

	try {
		// Try to parse a url
		return getPasswordFromUrl(new URL(id as string));
	} catch (e) {
		// Return undefined if the parsing failed
		return;
	}
};
