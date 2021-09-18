/**
 *  @internal
 */
export const imperialResponses = (message?: string) => {
	if (typeof message !== "string") return;

	return new Map<string, string>([
		[
			"You need to pass ?password=PASSWORD with your request, since this paste is encrypted!",
			"You need to provide a password, since this document is encrypted!",
		],
	]).get(message);
};
