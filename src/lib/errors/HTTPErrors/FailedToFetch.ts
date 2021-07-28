import { ImperialError } from "../ImperialError";

export class FailedToFetch extends ImperialError {
	constructor({ message, ...args }: ConstructorParameters<typeof ImperialError>[0] = {}) {
		super(args);

		this.message = "Requst was aborted.";
	}
}
