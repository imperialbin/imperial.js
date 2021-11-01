import fetch from "node-fetch";
import { isBrowser } from "./browser";

// @ts-expect-error web stuff
fetch = isBrowser ? window.fetch.bind(window) : fetch;

export default fetch;
