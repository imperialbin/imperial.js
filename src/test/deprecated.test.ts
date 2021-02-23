/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";

const { IMPERIAL_TOKEN } = process.env;

describe("deprecated tests", () => {
	if (!IMPERIAL_TOKEN) throw new Error("Env was not preparerd");

	it("postCode", async () => {
		const handleWarning = (e: Error) => {
			expect(e.name).toBe("DeprecationWarning");
			process.removeListener("warning", handleWarning);
		};

		process.on("warning", handleWarning);

		const api = new Imperial();

		await expect(
			(async () => {
				//@ts-ignore
				await api.postCode();
			})()
		).rejects.toThrowError(new Error("No `text` was provided!"));
	});

	it("getCode", async () => {
		const handleWarning = (e: Error) => {
			expect(e.name).toBe("DeprecationWarning");
			process.removeListener("warning", handleWarning);
		};

		process.on("warning", handleWarning);

		const api = new Imperial();

		await expect(
			(async () => {
				//@ts-ignore
				await api.getCode();
			})()
		).rejects.toThrowError(new Error("No `id` was provided!"));
	});
});