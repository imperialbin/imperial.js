import { ImperialError } from "../ImperialError";

export class NotFound extends ImperialError {
	constructor(...args: ConstructorParameters<typeof ImperialError>) {
		super(...args);

		this.message = "We could not find that Document or User";
		this.status = 404;
	}
}
