const isObject = (object: unknown) => typeof object === "object" && object !== null;

export const objectify = (object: Record<string, unknown>, ...props: Record<string, string | boolean>[]): any => {
	if (!isObject(object)) return object;

	const objProps = Object.keys(object)
		.filter((key) => !key.startsWith("_"))
		.map((key) => ({ [key]: true }));

	const availableProps: Record<string, string | boolean> = objProps.length
		? Object.assign({}, ...objProps, ...props)
		: Object.assign({}, ...props);

	const out: Record<string, unknown> = {};

	for (const [prop, newProp] of Object.entries(availableProps)) {
		if (newProp) {
			const currProp = newProp === true ? prop : newProp;

			const element = (object as any)[prop] as any;
			const elemIsObj = isObject(element);
			const valueOf = elemIsObj && typeof element.valueOf === "function" ? element.valueOf() : null;
			const toJson = elemIsObj && typeof element.toJSON === "function" ? element.toJSON() : null;

			if (Array.isArray(element)) out[currProp] = element.map((e) => objectify(e));
			else if (typeof valueOf !== "object") out[currProp] = valueOf;
			else if (toJson !== null) out[currProp] = toJson;
			else if (!elemIsObj) out[currProp] = element;
		}
	}

	return out;
};
