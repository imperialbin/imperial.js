import { ImperialError } from "../ImperialError";

export class DocumentNotFound extends ImperialError {
	constructor(...args: ConstructorParameters<typeof ImperialError>) {
		super(...args);

		this.message = "We could not find that Document!";
		this.status = 404;
	}
}
