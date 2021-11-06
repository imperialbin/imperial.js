import { ErrorMessages, TypeMessages } from "./Messages";

const errCode = Symbol("code");

const makeImperialError = <T extends Record<string, string>>(messages: T, Base: typeof global.Error) => {
	type MessageKeys = keyof typeof messages;

	return class ImperialError extends Base {
		public [errCode]: string;

		constructor(message: MessageKeys, public status?: number, public path?: string) {
			super(messages[message]);
			this[errCode] = message.toString();

			if (status) this.status = status;
			if (path) this.path = path;
			global.Error.captureStackTrace(this, ImperialError);
		}

		get name() {
			return `${super.name} [${this[errCode]}]`;
		}

		get code() {
			return this[errCode];
		}

		/**
		 *  Base Error class
		 *  @internal
		 */
		static E = Base;
	};
};

export const Error = makeImperialError(ErrorMessages, global.Error);
export const TypeError = makeImperialError(TypeMessages, global.TypeError);
