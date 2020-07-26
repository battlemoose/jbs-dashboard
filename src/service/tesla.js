import teslajs from 'teslajs'
import config from '../../config'

const UPDATE_DATA_INTERVAL = 3000
const UPDATE_GEOCODE_INTERVAL = 60000
const WAKE_UP_TIMEOUT = 30000
// const CHECK_STATE_INTERVAL = 60000

export default {

	options: config.teslaOptions,
	api: teslajs,

	vehicle: null,
	locality: null,

	CHARGING_STATE_DISCONNECTED: 'Disconnected',
	CHARGING_STATE_CHARGING: 'Charging',

	async init() {
		try {
			await this.checkState()
			await this.getVehicleData()
			setInterval(() => {
				this.getVehicleData()
			}, UPDATE_DATA_INTERVAL)
			
			await this.getGeocode()
			setInterval(() => {
				this.getGeocode()
			}, UPDATE_GEOCODE_INTERVAL)
		} catch (error) {
			console.error(error)
		}
	},

	async login(username, password) {
		let result = await teslajs.loginAsync(username, password)
		console.debug('Tesla login result', result)

		if (result.error) {
			throw new Error(result.error)
		}
		if (result.response.statusCode > 299) {
			throw new Error(`Unexpected status code: ${result.response.statusCode}`)
		}
		if (result.token) {
			this.authToken = result.authToken
			console.info('Logged in to Tesla API successfully')
		} else {
			throw new Error('Tesla API login failed')
		}
	},

	async checkState() {
		console.debug('checkState()')
		const { options } = this

		let vehicle = await this.api.vehicleAsync(options)
		console.debug(vehicle.state);

		let canceled = false
		setTimeout(() => { canceled = true }, WAKE_UP_TIMEOUT);
		while (vehicle.state != 'online' && !canceled) {
			console.debug(`Vehicle ${vehicle.vin} is not online, waking up`)
			vehicle = await this.api.wakeUpAsync(options)
			console.debug(`Attempted to wake vehicle ${vehicle.vin}`)
			console.debug(vehicle)
			await delay(1000)
		}
		if (!canceled) {
			return vehicle
		} else {
			throw Error(`Vehicle wake up timed out after ${WAKE_UP_TIMEOUT / 1000} seconds`)
		}
	},

	async getVehicleData() {
		console.debug('Getting Tesla vehicle data')
		const data = await this.api.vehicleDataAsync(this.options)
		console.debug('Tesla vehicle data', data)
		this.vehicle = data
	},

	async getGeocode() {
		console.debug('Updating Tesla geocode')
		let google = window.google
		if (this.vehicle) {
			const geocoder = new google.maps.Geocoder()
			geocoder.geocode({
				location: new google.maps.LatLng(this.vehicle.drive_state.latitude, this.vehicle.drive_state.longitude)
			}, (results, status) => {
				if (status === "OK") {
					this.locality = results.find(location => location.types.includes('locality')).address_components[0].long_name
				}
			})
		}
	}
}

async function delay(delay = 1000) {
	await new Promise(resolve => {
		setTimeout(() => { resolve() }, delay)
	})
}