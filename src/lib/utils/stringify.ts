export const stringify = (data: any): string => {
	if (typeof data === "object") {
		return JSON.stringify(data, null, 2);
	}

	return String(data);
};
