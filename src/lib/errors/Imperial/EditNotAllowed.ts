import { ImperialError } from "../ImperialError";

export class NotAllowed extends ImperialError {
	constructor(...args: ConstructorParameters<typeof ImperialError>) {
		super(...args);

		this.message = "Sorry! You aren't allowed to modify this document.";
		this.status = 401;
	}
}
