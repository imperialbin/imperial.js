/*
 *  for any of these implementation if you pass a URL to the document
 *  either a string or the URL object, the wrapper will try to extract
 *  the password from the query parameters
 */

import { Imperial } from "imperial-node";

/*
 *  the token can be undefined, must be a valid imperial token to work
 *  you can get one in the API section here: https://imperialb.in/account
 */
const IMPERIAL_TOKEN = "IMPERIAL-really-valid-token";

const api = new Imperial(IMPERIAL_TOKEN);

// promise based:
(async () => {
	try {
		// you can also use the ".then" and ".catch"
		const response = await api.getDocument("really-valid-document-id", "password-if-the-document-is-encrypted");

		console.log(response);
	} catch (error) {
		console.error(error);
	}
})();

// or with callbacks:
api.getDocument("really-valid-document-id", "password-if-the-document-is-encrypted", (error, response) => {
	if (error) return console.error(error);

	console.log(response);
});
