import { Error as ImpError } from "../errors";
import { Base } from "../client/Base";
/**
 *  Check if the client has a token provided
 *  @internal
 */
export const requireToken: MethodDecorator = (_target, _key, descriptor) => {
	const originalMethod = descriptor.value as unknown as Function;

	if (!originalMethod) {
		throw new Error("Method not provided!?");
	}

	return {
		value: function value(...args: any[]) {
			if (!(this instanceof Base)) {
				throw new Error("type check");
			}

			if (!this.client._token) throw new ImpError("NO_TOKEN");

			return originalMethod.apply(this, args);
		},
	} as any;
};
