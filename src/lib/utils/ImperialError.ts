/**
 *  @internal
 */
interface ImperialErrorInterface {
	message?: string;
	status?: number;
	path?: string;
}

export class ImperialError extends Error {
	public status?: number;
	public path?: string;

	constructor(errorData?: ImperialErrorInterface) {
		super(errorData?.message);
		this.name = "ImperialError";
		this.status = errorData?.status;
		this.path = errorData?.path;
	}
}
