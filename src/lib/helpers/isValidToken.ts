const tokenRegex = /^IMPERIAL-[a-zA-Z\d]{8}(-[a-zA-Z\d]{4}){3}-[a-zA-Z\d]{12}$/;

export const validateToken = (token: string | null): boolean => {
	return !!token && tokenRegex.test(token);
};
