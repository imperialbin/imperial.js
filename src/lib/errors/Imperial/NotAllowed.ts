import { ImperialError } from "../ImperialError";

export class NotAllowed extends ImperialError {
	constructor(...args: ConstructorParameters<typeof ImperialError>) {
		super(...args);

		this.message = "You're not authorized for this action";
		this.status = 401;
	}
}
