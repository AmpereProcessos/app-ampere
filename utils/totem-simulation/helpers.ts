export function getUFVSystemInvestmentByEnergyBill(bill: number) {
	const INVESTIMENT_BY_KWP = 3200;

	const energyConsumption = Number(Number((bill / 0.85).toFixed(2)));

	const suggestedPeakPower = Number(energyConsumption / 120);

	var effectivePeakPower = 0;
	var investiment = 0;

	const moduleQty = Math.ceil((energyConsumption * 1000) / (120 * 565));
	const modulePower = 565;
	effectivePeakPower = (moduleQty * modulePower) / 1000;
	console.log(effectivePeakPower);
	investiment = effectivePeakPower * INVESTIMENT_BY_KWP;

	return { moduleQty, modulePower, effectivePeakPower, investiment };
}

export function getOeMInvestimentByModuleQty(moduleQty: number) {
	const FIXED_DISTANCE = 30;
	const PricesByModuleQty = [
		{
			min: 0,
			max: 12,
			price: 19.9,
		},
		{
			min: 13,
			max: 19,
			price: 18.91,
		},
		{
			min: 20,
			max: 29,
			price: 17.96,
		},
		{
			min: 30,
			max: 49,
			price: 17.06,
		},
		{
			min: 50,
			max: 79,
			price: 16.21,
		},
		{
			min: 80,
			max: 109,
			price: 15.4,
		},
		{
			min: 110,
			max: 149,
			price: 13.86,
		},
		{
			min: 150,
			max: 199,
			price: 12.47,
		},
		{
			min: 200,
			max: 299,
			price: 11.23,
		},
		{
			min: 300,
			max: 499,
			price: 10.1,
		},
		{
			min: 500,
			max: 2000,
			price: 9.09,
		},
	];
	const PriceByModule = PricesByModuleQty.find((p) => moduleQty >= p.min && moduleQty <= p.max)?.price || 19.9;

	return {
		simpleMaintenance: PriceByModule * moduleQty + 1.5 * 2 * FIXED_DISTANCE,
		sunPlan: 1.3 * PriceByModule * moduleQty + 1.5 * 2 * FIXED_DISTANCE,
		sunPlusPlan: 1.5 * PriceByModule * moduleQty + 1.5 * 4 * FIXED_DISTANCE,
	};
}

export function getInsuranceInvestmentByReferenceValue(referenceValue: number) {
	return referenceValue * 0.03;
}
