/*
 *  as of the current release editing encrypted documents does not work
 *  api will return an error upon trying to do that
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
		const response = await api.editDocument("really-valid-document-id", "hi! -edited");

		console.log(response);
	} catch (error) {
		console.error(error);
	}
})();

// or with callbacks:
api.editDocument("really-valid-document-id", "hi! -edited", (error, response) => {
	if (error) return console.error(error);

	console.log(response);
});
