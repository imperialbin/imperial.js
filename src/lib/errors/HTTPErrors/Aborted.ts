import { ImperialError } from "../ImperialError";

export class Aborted extends ImperialError {
	constructor(...args: ConstructorParameters<typeof ImperialError>) {
		super(...args);

		this.message = "Requst was aborted.";
	}
}
