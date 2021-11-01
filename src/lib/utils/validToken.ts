const TokenRegex = /^IMPERIAL-[a-zA-Z\d]{8}(-[a-zA-Z\d]{4}){3}-[a-zA-Z\d]{12}$/;

/**
 *  Simple token validation function
 *  @param token The token to check
 *  @returns `true` if the token is in the valid format and `false` if its' not
 *  @internal
 *  @example
 *  validateToken('IMPERIAL-12345678-1234-1234-1234-123456789ABC')
 *  > true
 *  validateToken('blah')
 *  > false
 */
export const validateToken = (token: unknown): boolean => {
	if (typeof token === "undefined" || token === null) return true;
	if (typeof token !== "string") return false;
	return TokenRegex.test(token);
};
