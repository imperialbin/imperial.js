const setParams = (jsonParams: Record<string, unknown>): URLSearchParams => {
	const searchParams = new URLSearchParams();

	for (const prop in jsonParams) {
		searchParams.set(prop, String(jsonParams[prop]));
	}

	return searchParams;
};

export default setParams;
