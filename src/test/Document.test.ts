import { Document, Imperial } from "../lib";
import { IMPERIAL_TOKEN, RESPONSE } from "./common";

const DAY = 86_400_000;

describe("Document", () => {
	const content = "test";
	const client = new Imperial(IMPERIAL_TOKEN);
	let document: Document;

	beforeEach(() => {
		document = new Document(client, { ...RESPONSE.document, content });
	});

	it("should be valid", () => {
		expect(document).toBeInstanceOf(Document);
		expect(document.id).toBe(RESPONSE.document.documentId);
		expect(document.link).toBe(`https://${client.rest.hostname}/p/${RESPONSE.document.documentId}`);
		expect(document.content).toBe(content);
		expect(document.creation).toBeInstanceOf(Date);
		expect(document.daysLeft).toBe(null);
	});

	it("should not be null", () => {
		document = new Document(client, { ...document.toJSON(), expirationDate: new Date().valueOf() + DAY });
		expect(document.daysLeft).not.toBe(null);
	});
});
