function round(number, precision = 0) {
	const rounded = + (Math.round(number + `e+${precision}`) + `e-${precision}`)
	// return +(number.toFixed(precision))
	return rounded.toFixed(precision)
}

function milesToKms(number) {
	return number * 1.6093
}

function mpsTokmph(speed) {
	return speed / 1000 * 60 * 60
}

function angleToCompass(angle) {
	if (angle >= 348.75 && angle < 11.25)  { return 'N'}
	if (angle >=  11.25 && angle < 33.75)  { return 'NNE'}
	if (angle >=  33.75 && angle < 56.25)  { return 'NE'}
	if (angle >=  56.25 && angle < 78.75)  { return 'ENE'}
	if (angle >=  78.75 && angle < 101.25) { return 'E'}
	if (angle >= 101.25 && angle < 123.75) { return 'ESE'}
	if (angle >= 123.75 && angle < 146.25) { return 'SE'}
	if (angle >= 146.25 && angle < 168.75) { return 'SSE'}
	if (angle >= 168.75 && angle < 191.25) { return 'S'}
	if (angle >= 191.25 && angle < 213.75) { return 'SSW'}
	if (angle >= 213.75 && angle < 236.25) { return 'SW'}
	if (angle >= 236.25 && angle < 258.75) { return 'WSW'}
	if (angle >= 258.75 && angle < 281.25) { return 'W'}
	if (angle >= 281.25 && angle < 303.75) { return 'WNW'}
	if (angle >= 303.75 && angle < 326.25) { return 'NW'}
	if (angle >= 326.25 && angle < 348.75) { return 'NNW'}
}

export { round, milesToKms, angleToCompass, mpsTokmph }