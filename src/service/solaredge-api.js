import * as dayjs from 'dayjs'

import config from '../../config'

const SITE_ID = config.solaredgeOptions.siteId
const BASE_URL = `https://monitoringapi.solaredge.com/site/${SITE_ID}`
const API_KEY = config.solaredgeOptions.api_key
const UPDATE_ENERGY_TODAY_INTERVAL = 60000

// const TIME_FRAME_ENERGY_URL = `/timeFrameEnergy`

export default {

	energyToday: null,

	async init() {
		await this.getEnergyToday()
		setInterval(() => {
			this.getEnergyToday()
		}, UPDATE_ENERGY_TODAY_INTERVAL)
	},

	async getEnergyToday() {
		const today = dayjs().format('YYYY-MM-DD')
		const energy = await this.getEnergy(today, today)
		this.energyToday = energy.values[0].value ?? 0
	},

	async getEnergy(startDate, endDate) {
		console.debug('Getting SolarEdge monitoring API energy')
		const ENERGY_URL = `/energy`

		const response = await fetch(BASE_URL + ENERGY_URL + `?startDate=${startDate}&endDate=${endDate}&api_key=${API_KEY}`)
		const json = await response.json()
		console.debug('SolarEdge monitoring API energy', json.energy)
		return json.energy
	},
}