import { Error as ImpError } from "../errors";
import { Base } from "../client/Base";

/**
 *  Check if the client has a token provided
 *  Method must be a promise
 *  @internal
 */
export const requireToken: MethodDecorator = (_target, _key, descriptor) => {
	const originalMethod = descriptor.value as unknown as (...args: any[]) => Promise<any>;

	if (!originalMethod) {
		throw new Error("Method not provided!?");
	}

	return {
		...descriptor,
		value: function value(...args: any[]) {
			// this should never be throw???!?!?!?!
			if (!(this instanceof Base)) {
				return Promise.reject("type check");
			}

			// reject a promise because the method is async
			if (!this.client._token) return Promise.reject(new ImpError("NO_TOKEN"));

			// return the orignal method
			return originalMethod.apply(this, args as string[]);
		},
	} as unknown as PropertyDescriptor;
};
