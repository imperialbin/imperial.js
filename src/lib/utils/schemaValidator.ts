import { SCHEMA_FAILED_VALIDATION, SCHEMA_INVALID_KEY } from "../helper/errors";
import type { Schema } from "../helper/interfaces";

export function validateSchema<T extends Record<string, unknown>>(object: T, schema: Schema): void | Error {
	const validKeys = Object.keys(schema);

	const errors = validKeys
		.filter(
			(key) =>
				(object[key] !== undefined && !schema[key].test(object[key])) ||
				(object[key] === undefined && schema[key].required),
		)
		.map((key) => new Error(SCHEMA_FAILED_VALIDATION(key, schema[key].message, schema[key].required)));

	if (errors.length > 0) return errors[0];

	const invalidKeys = Object.keys(object).filter((key) => !validKeys.includes(key));

	if (invalidKeys.length > 0) return new Error(SCHEMA_INVALID_KEY(invalidKeys[0]));
}
