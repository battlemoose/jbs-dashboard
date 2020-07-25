import teslajs from 'teslajs'
import config from '../../config'

const UPDATE_DATA_INTERVAL = 3000
const UPDATE_GEOCODE_INTERVAL = 60000
// const CHECK_STATE_INTERVAL = 60000

export default {

	options: config.teslaOptions,
	api: teslajs,

	vehicle: null,
	locality: null,

	async init() {
		// TODO: Call checkState on an interval
		// TODO: Fix check state and timeout issues
		await this.checkState()
		await this.getVehicleData()
		setInterval(() => {
			this.getVehicleData()
		}, UPDATE_DATA_INTERVAL)
		
		await this.getGeocode()
		setInterval(() => {
			this.getGeocode()
		}, UPDATE_GEOCODE_INTERVAL)
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
		if (vehicle.state != 'online') {
			console.debug(`Vehicle ${vehicle.vin} is not online, waking up`)
			vehicle = await this.api.wakeUpAsync(options)
			console.debug(`Attempting to wake vehicle ${vehicle.vin}`)
			console.debug(vehicle)
		}

		return vehicle
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