// Property descriptors are lost when using Object.assign or spread operator. This function re-applies them to the target object. (getter, setter, enumerable, configurable, writable)

export function reApplyPropertyDescriptors(original: object, target: object) {
	Object.keys(original).forEach((key) => {
		if (['set', 'update', 'subscribe'].includes(key)) return;
		const descriptor = Object.getOwnPropertyDescriptor(original, key);
		Object.defineProperty(target, key, {
			...descriptor,
		});
	});
}
