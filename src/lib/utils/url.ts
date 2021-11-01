import { URL } from "url";
import { isBrowser } from "./browser";

// @ts-expect-error web stuff
URL = isBrowser ? window.URL : URL;

export default URL;
