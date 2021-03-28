import nock from "nock";
import { Imperial } from "./lib/Imperial";

interface Params {
	path: string;
	method: ParamMethods;
	statusCode: number;
	responseBody: Record<string, unknown>;
}

type ParamMethods = "get" | "post" | "patch" | "delete";

export const createMock = (mockParams: Params): void => {
	nock(`https://${new Imperial().Hostname}/`)
		[mockParams.method](mockParams.path)
		.reply(mockParams.statusCode, mockParams.responseBody);
};
