import * as dayjs from 'dayjs'

import config from '../../config'
import { timeOfDay, TIME_OF_DAY } from '@/weather-utils'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const CURRENT_WEATHER_URL = `/weather?lat=-34.0476266&lon=151.0976441&units=metric&appid=${config.openWeatherOptions.appid}`
const ONE_CALL_URL = `/onecall?lat=-34.0476266&lon=151.0976441&units=metric&appid=${config.openWeatherOptions.appid}`
const UPDATE_INTERVAL = 300000

export default {

	currentConditions: null,
	hourlyForecast: null,
	dailyForecast: null,

	async init() {
		this.getCurrentConditions()
		this.getOneCallData()
		setInterval(() => {
			this.getCurrentConditions()
			this.getOneCallData()
		}, UPDATE_INTERVAL)
	},

	// Documentation: https://openweathermap.org/current
	async getCurrentConditions() {
		console.debug('Getting OpenWeather current conditions');
		const response = await fetch(BASE_URL + CURRENT_WEATHER_URL)
		this.currentConditions = await response.json()
		console.debug('OpenWeather current conditions', this.currentConditions)
	},

	// Documentation: https://openweathermap.org/api/one-call-api
	async getOneCallData() {
		console.debug('Getting OpenWeather one call data');
		const response = await fetch(BASE_URL + ONE_CALL_URL)
		const data = await response.json()
		this.hourlyForecast = data.hourly
		this.dailyForecast = data.daily
		console.debug('OpenWeather hourly', this.hourlyForecast)
		console.debug('OpenWeather daily', this.dailyForecast)
	},

	currentIcon() {
		return this.currentConditions !== null
			? this.conditionIcon(
				this.currentConditions.weather[0].id,
				timeOfDay(dayjs.unix(this.currentConditions.dt))
			) : null
	},

	conditionIcon(conditionId, timeOfDay) {
		if (conditionId > 200 && conditionId <= 299) {
			return 'wi-storm-showers'
		} else if (conditionId >= 300 && conditionId < 399) {
			return 'wi-showers'
		} else if (conditionId >= 500 && conditionId < 599) {
			return 'wi-rain'
		} else if (conditionId >= 600 && conditionId < 699) {
			return 'wi-snow'
		} else if (conditionId >= 700 && conditionId < 799) {
			return 'wi-windy'
		} else if (conditionId == 800) {
			if (timeOfDay == TIME_OF_DAY.DAY) {
				return 'wi-day-sunny'
			} else if (timeOfDay == TIME_OF_DAY.NIGHT) {
				return 'wi-night-clear'
			}
		} else if (conditionId == 801 || conditionId == 802) {
			if (timeOfDay == TIME_OF_DAY.DAY) {
				return 'wi-day-cloudy'
			} else if (timeOfDay == TIME_OF_DAY.NIGHT) {
				return 'wi-night-alt-cloudy'
			}
		} else if (conditionId == 803 || conditionId == 804) {
			return 'wi-cloud'
		} else {
			return 'wi-day-sunny'
		}
	},

}