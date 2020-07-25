// TODO: Convert requests to axios
import config from '../../config'

const BASE_URL = 'https://api.weather.com/v2/pws'
const CURRENT_WEATHER_URL = `/observations/current?stationId=ISYDNE193&format=json&units=m&numericPrecision=decimal&apiKey=${config.wundergroundOptions.apiKey}`
const HOURLY_7_DAY_WEATHER_URL = `/observations/hourly/7day?stationId=ISYDNE193&format=json&units=m&numericPrecision=decimal&apiKey=${config.wundergroundOptions.apiKey}`
const DAILY_7_DAY_WEATHER_URL = `/dailysummary/7day?stationId=ISYDNE193&format=json&units=m&numericPrecision=decimal&apiKey=${config.wundergroundOptions.apiKey}`
const RAPID_1_DAY_WEATHER_URL = `/observations/all/1day?stationId=ISYDNE193&format=json&units=m&numericPrecision=decimal&apiKey=${config.wundergroundOptions.apiKey}`
const UPDATE_INTERVAL = 300000

export default {

	currentConditions: null,
	hourly7DayConditions: null,
	daily7DayConditions: null,
	rapid1DayConditions: null,
	stationOffline: false,

	async init() {
		this.getCurrentConditions()
		this.getHourly7DayConditions()
		this.getDaily7DayConditions()
		this.getRapid1DayConditions()
		setInterval(() => {
			this.getCurrentConditions()
			this.getHourly7DayConditions()
			this.getDaily7DayConditions()
			this.getRapid1DayConditions()
		}, UPDATE_INTERVAL)
	},

	async getCurrentConditions() {
		console.debug('Getting Weather Underground current conditions');
		const response = await fetch(BASE_URL + CURRENT_WEATHER_URL)
		this.stationOffline = false
		switch (response.status) {
			case 200: {
				const json = await response.json()
				this.currentConditions = json.observations[0]
				console.debug('Weather Underground current conditions', this.currentConditions)
				break
			}
			case 204: {
				this.stationOffline = true
				this.currentConditions = null
				console.warn(`Personal weather station ISYDNE193 offline`)
				break
			}
			default: {
				this.currentConditions = null
				console.error('Error retrieving personal weather station data')
				console.error(response)
			}
		}
	},

	async getHourly7DayConditions() {
		console.debug('Getting Weather Underground hourly 7 day conditions');
		const response = await fetch(BASE_URL + HOURLY_7_DAY_WEATHER_URL)
		switch (response.status) {
			case 200: {
				const json = await response.json()
				this.hourly7DayConditions = json.observations
				console.debug('Weather Underground hourly 7 day conditions', this.hourly7DayConditions)
				break
			}
			default: {
				this.hourly7DayConditions = null
				console.error('Error retrieving personal weather station data')
				console.error(response)
			}
		}
	},

	async getDaily7DayConditions() {
		console.debug('Getting Weather Underground daily 7 day conditions');
		const response = await fetch(BASE_URL + DAILY_7_DAY_WEATHER_URL)
		switch (response.status) {
			case 200: {
				const json = await response.json()
				this.daily7DayConditions = json.summaries
				console.debug('Weather Underground daily 7 day conditions', this.daily7DayConditions)
				break
			}
			default: {
				this.daily7DayConditions = null
				console.error('Error retrieving personal weather station data')
				console.error(response)
			}
		}
	},

	async getRapid1DayConditions() {
		console.debug('Getting Weather Underground rapid 1 day conditions');
		const response = await fetch(BASE_URL + RAPID_1_DAY_WEATHER_URL)
		switch (response.status) {
			case 200: {
				const json = await response.json()
				this.rapid1DayConditions = json.observations
				console.debug('Weather Underground rapid 1 day conditions', this.rapid1DayConditions)
				break
			}
			default: {
				this.rapid1DayConditions = null
				console.error('Error retrieving personal weather station data')
				console.error(response)
			}
		}
	},
}