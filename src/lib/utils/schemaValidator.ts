import { ErrorMessage } from "../errors/Messages";

export interface Schema {
	[key: string]: {
		test: (value: unknown) => boolean;
		message: string;
		required?: boolean;
	};
}

/**
 *  @internal
 */
export function validateSchema<T extends Record<string, unknown>>(object: T, schema: Schema): void | Error {
	const validKeys = Object.keys(schema);

	const errors = validKeys
		.filter(
			(key) =>
				(object[key] !== undefined && !schema[key].test(object[key])) ||
				(object[key] === undefined && schema[key].required),
		)
		.map(
			(key) =>
				new Error(ErrorMessage("SCHEMA_FAILED_VALIDATION")(key, schema[key].message, schema[key].required)),
		);

	if (errors.length > 0) return errors[0];

	// Remove the checks for not existing props

	// const invalidKeys = Object.keys(object).filter((key) => !validKeys.includes(key));

	// if (invalidKeys.length > 0) return new Error(SCHEMA_INVALID_KEY(invalidKeys[0]));
}
