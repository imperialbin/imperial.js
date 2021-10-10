import { Document, Imperial } from "../lib";
import { DAY, IMPERIAL_TOKEN, RESPONSE } from "./common";

describe("Document", () => {
	const content = "test";
	const client = new Imperial(IMPERIAL_TOKEN);
	let document: Document;

	beforeEach(() => {
		document = new Document(client, { ...RESPONSE.data, content });
	});

	it("should be valid", () => {
		expect(document).toBeInstanceOf(Document);
		expect(document.id).toBe(RESPONSE.data.id);
		expect(document.link).toBe(`https://${client.rest.hostname}/p/${RESPONSE.data.id}`);
		expect(document.content).toBe(content);
		expect(document.timestamps.creation).toBeInstanceOf(Date);
		expect(document.timestamps.daysLeft).toBe(null);
	});

	it("should not be null", () => {
		const json = document.toJSON();

		document = new Document(client, {
			...json,
			timestamps: { ...json.timestamps, expiration: (new Date().valueOf() + DAY) / 1000 },
		});
		expect(document.timestamps.daysLeft).not.toBe(null);
	});
});
