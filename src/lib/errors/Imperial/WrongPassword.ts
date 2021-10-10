import { ImperialError } from "../ImperialError";

export class WrongPassword extends ImperialError {
	constructor(...args: ConstructorParameters<typeof ImperialError>) {
		super(...args);

		this.message = "You need to provide a password, since this document is encrypted!";
		this.status = 401;
	}
}
