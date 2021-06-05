interface ImperialErrorInterface {
	message?: string;
	status?: number;
	path?: string;
}

/**
 *  @internal
 */
export class ImperialError extends Error {
	public status?: number;

	public path?: string;

	constructor(errorData: ImperialErrorInterface = {}) {
		super(errorData?.message);

		this.name = "ImperialError";

		if ("status" in errorData) this.status = errorData.status;
		if ("path" in errorData) this.path = errorData.path;
	}
}
