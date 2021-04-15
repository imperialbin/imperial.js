export const NO_TEXT = "No `text` was provided!";

export const TEXT_WRONG_TYPE = "Parameter `text` must be a string!";

export const NO_TOKEN = "This method requires a token to be set in the constructor!";

export const NO_ID = "No `id` was provided!";

export const ID_WRONG_TYPE = "Parameter `id` must be a string or an URL!";

export const PASSWORD_WRONG_TYPE = "Parameter `password` must be a string!";

export const OPTIONS_WRONG_TYPE = "Parameter `options` must be an Object!";

export const SCHEMA_FAILED_VALIDATION = (key: string, message: string, required: boolean = false): string =>
	`Property "${key}" ${required ? "is required and " : ""}must be ${message}`;

export const SCHEMA_INVALID_KEY = (key: string): string => `They key ${key} is not on the schema`;
