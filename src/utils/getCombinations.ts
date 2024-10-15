export function getCombinations<T extends unknown[]>(valuesArray: T) {
	if (!Array.isArray(valuesArray)) return [];
	const combination: T[] = [];
	let temp = [] as any;
	const combinationsLength = Math.pow(2, valuesArray.length);

	for (let i = 0; i < combinationsLength; i++) {
		temp = [] as any;
		for (let j = 0; j < valuesArray.length; j++) {
			if (i & Math.pow(2, j)) {
				temp.push(valuesArray[j]);
			}
		}
		if (temp.length > 0) {
			combination.push(temp);
		}
	}

	combination.sort((a, b) => a.length - b.length);
	return combination;
}
