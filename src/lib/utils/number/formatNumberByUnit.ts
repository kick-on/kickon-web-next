export const formatNumberByUnit = (target: number) => {
	const units = [
		{ value: 10000, symbol: '만' },
		{ value: 1000, symbol: '천' },
	];

	// 단위가 천 이상인 경우
	for (const unit of units) {
		if (target >= unit.value) {
			const formattedNumber = (target / unit.value).toFixed(1);

			// 소수점 첫째 자리가 0일 경우 정수로 표시
			const result = formattedNumber.endsWith('.0') ? formattedNumber.slice(0, -2) : formattedNumber;
			return `${result}${unit.symbol}`;
		}
	}

	// 단위가 백 이하인 경우
	return target;
};
