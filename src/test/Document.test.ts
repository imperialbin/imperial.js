/* eslint @typescript-eslint/ban-ts-comment:0 */

import { Imperial } from "../lib";
import { Document } from "../lib/Document";
import { createMock } from "../mockHelper";

const IMPERIAL_TOKEN = "IMPERIAL-00000000-0000-0000-0000-000000000000";

const DOCUMENT_ID = "really-valid-id";

const RESPONSE = {
	success: true,
	content: "hi looskie!!!!! pt3",
	document: {
		documentId: DOCUMENT_ID,
		language: null,
		imageEmbed: false,
		instantDelete: true,
		creationDate: 1617465149267,
		expirationDate: 1617897149267,
		allowedEditors: [],
		encrypted: false,
		views: 9,
	},
};

test("validate document", async () => {
	const api = new Imperial(IMPERIAL_TOKEN);

	createMock({
		method: "get",
		path: `/api/document/${DOCUMENT_ID}`,
		responseBody: RESPONSE,
		statusCode: 200,
	});

	const document = await api.getDocument(DOCUMENT_ID);

	expect(document).toBeInstanceOf(Document);

	expect(document.content).toBe(RESPONSE.content);

	expect(document.content).toStrictEqual(document.code);

	expect(document.creation.getTime()).toBe(RESPONSE.document.creationDate);

	expect(document.creation).toStrictEqual(document.creationDate);

	expect(document.expiration.getTime()).toBe(RESPONSE.document.expirationDate);

	expect(document.expiration).toStrictEqual(document.expirationDate);

	expect(document.id).toBe(DOCUMENT_ID);

	expect(document.id).toStrictEqual(document.documentId);

	expect(document.longerUrls).toBeFalsy();

	expect(document.instantDelete).toBeTruthy();

	expect(document.imageEmbed).toBeFalsy();

	expect(document.formattedLink).toBe(`https://${api.hostname}/p/${DOCUMENT_ID}`);
});
