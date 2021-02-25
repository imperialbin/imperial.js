const parseUrl = (url: URL): string | undefined => {
	const password = url.searchParams.get("password");

	if (!password) return undefined;
	return password;
};

const parsePassword = function (id: string | URL): string | undefined {
	if (id instanceof URL) {
		return parseUrl(id as URL);
	}

	try {
		// Try to parse a url
		const url = new URL(id as string);
		return parseUrl(url);
	} catch (e) {
		/* Don't do anything with the URL prase error */
		return undefined;
	}
};

export default parsePassword;
