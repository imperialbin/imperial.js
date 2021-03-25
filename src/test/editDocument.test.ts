/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";

const { IMPERIAL_TOKEN } = process.env;

let documentToEdit = "";

describe("editDocument", () => {
	if (!IMPERIAL_TOKEN) throw new Error("Env was not preparerd");

	beforeAll(async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		try {
			const res = await api.createDocument("Tests: editDocument", { longerUrls: true });
			documentToEdit = res.formattedLink;
		} catch (e) {
			throw new Error("Failed to prepare tests.");
		}
	});

	afterAll(async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		try {
			await api.deleteDocument(documentToEdit);
		} catch (e) {
			throw new Error("Failed to cleanup tests.");
		}
	});
	it("valid with token", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		let res = await api.editDocument(documentToEdit, "Tests: editDocument #2");

		expect(/^successfully(a-zA-Z\s)*/i.test(res.message)).toBeTruthy();

		res = await api.editDocument(new URL(documentToEdit), "Tests: editDocument #3");

		expect(/^successfully(a-zA-Z\s)*/i.test(res.message)).toBeTruthy();
	}, 10000); // timeout 10s

	it("valid without token", async () => {
		const api = new Imperial();

		await expect(
			(async () => {
				await api.editDocument("test jest bro", "test jest bro");
			})()
		).rejects.toThrow(new Error("This method requires a token to be set in the constructor!"));
	}, 10000); // timeout 10s

	it("invalid - first param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `id` must be a string or an URL!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument({}, "bbbbbb");
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument([], "bbbbbb");
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument(12345, "bbbbbb");
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument(() => {}, "bbbbbb"); // eslint-disable-line @typescript-eslint/no-empty-function
			})()
		).rejects.toThrow(err);
	});

	it("invalid - second param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `newText` must be a string!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", {});
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", []);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", 12345);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
			})()
		).rejects.toThrow(err);
	});

	it("invalid - third param with wrong type", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		const err = new TypeError("Parameter `callback` must be callable!");

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", "bbbbbb", {});
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", "bbbbbb", []);
			})()
		).rejects.toThrow(err);

		await expect(
			(async () => {
				// @ts-ignore
				await api.editDocument("bbbbbb", "bbbbbb", 12345);
			})()
		).rejects.toThrow(err);
	});

	it("invalid - no data", async () => {
		const api = new Imperial(IMPERIAL_TOKEN);

		await expect(
			(async () => {
				//@ts-ignore
				await api.editDocument();
			})()
		).rejects.toThrow(new Error("No `id` was provided!"));
	});
});
