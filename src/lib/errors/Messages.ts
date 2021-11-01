const Messages = {
	NO_TEXT: "No `text` was provided",
	TEXT_WRONG_TYPE: "Parameter `text` must be a string",
	NO_TOKEN: "This method requires a token to be set in the constructor",
	NO_ID: "No `id` was provided",
	NO_USERNAME: "No `username` was provided",
	ID_WRONG_TYPE: "Parameter `id` must be a string or an URL",
	USERNAME_WRONG_TYPE: "Parameter `username` must be a string",
	PASSWORD_WRONG_TYPE: "Parameter `password` must be a string",
	OPTIONS_WRONG_TYPE: "Parameter `options` must be an Object",
	SCHEMA_FAILED_VALIDATION(key: string, message: string, required: boolean = false): string {
		return `Property "${key}" ${required ? "is required and " : ""}must be ${message}`;
	},
	SCHEMA_INVALID_KEY(key: string): string {
		return `They key "${key}" is not on the schema`;
	},
} as const;

type MessageKeys = keyof typeof Messages;

export const ErrorMessage = <T extends MessageKeys>(key: T) => Messages[key] as typeof Messages[T];
