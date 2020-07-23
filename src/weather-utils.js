import SunCalc from 'suncalc'
import * as dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

const LATITUDE = -34.0476266
const LONGITUDE = 151.0976441
const TIME_OF_DAY = { DAY: 'day', NIGHT: 'night' }

function timeOfDay(time) {

	if (!time) {
		time = dayjs()
	}
	const times = SunCalc.getTimes(time.toDate(), LATITUDE, LONGITUDE)

	return time.isBetween(
		dayjs(times.dawn),
		dayjs(times.dusk)
	) ? TIME_OF_DAY.DAY : TIME_OF_DAY.NIGHT
}

// function sunrise(date) {
	
// }

// function sunset(date) {

// }

function getSunTime(date, type) {
	
	if (!date) {
		date = dayjs()
	}
	const times = SunCalc.getTimes(date.toDate(), LATITUDE, LONGITUDE)
	return dayjs(times[type])
}


export { timeOfDay, TIME_OF_DAY, getSunTime }