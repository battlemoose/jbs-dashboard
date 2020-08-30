import teslajs from 'teslajs'
import config from '../../config'
import { localStorageWrapper as ls } from '../app-utils'

const UPDATE_DATA_INTERVAL = 3000
const UPDATE_GEOCODE_INTERVAL = 60000
const WAKE_UP_TIMEOUT = 30000
const TESLA_AUTH_TOKEN_KEY = 'tesla_auth_token'
const TESLA_REFRESH_TOKEN_KEY = 'tesla_refresh_token'
// const CHECK_STATE_INTERVAL = 60000

// TODO: Use refresh token if auth token expired
const tesla = {

	options: config.teslaOptions,
	api: teslajs,

	vehicle: null,
	locality: null,
	loggedIn: true,
	loginLoading: false,
	loginError: { error: false, message: "" },

	CHARGING_STATE_DISCONNECTED: 'Disconnected',
	CHARGING_STATE_CHARGING: 'Charging',

	async init() {
		try {
			this.checkLogin()
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
		this.loginLoading = true
		this.loginError.error = false
		this.loginError.message = ''

		let result = await teslajs.loginAsync(username, password)
		console.debug('Tesla login result', result)

		if (result.error) {
			this.loginLoading = false
			throw new Error(result.error)
		}
		if (result.response.statusCode == 401) {
			this.loginLoading = false
			this.loginError.error = true
			this.loginError.message = 'Invalid email or password'
			throw new Error('Invalid email or password')
		}
		if (result.response.statusCode > 299) {
			this.loginLoading = false
			throw new Error(`Unexpected status code: ${result.response.statusCode}`)
		}
		
		if (result.authToken && result.refreshToken) {
			this.options.authToken = result.authToken
			this.options.refreshToken = result.refreshToken
			ls.store(TESLA_AUTH_TOKEN_KEY, result.authToken)
			ls.store(TESLA_REFRESH_TOKEN_KEY, result.refreshToken)
			this.loggedIn = true
			this.loginLoading = false
			console.info('Logged in to Tesla API successfully')
			this.init()
		} else {
			this.loginLoading = false
			throw new Error('Tesla API login failed')
		}
	},

	checkLogin() {
		console.log('checkLogin()')
		this.options.authToken = ls.retrieve(TESLA_AUTH_TOKEN_KEY)
		this.options.refreshToken = ls.retrieve(TESLA_REFRESH_TOKEN_KEY)
		if (this.options.refreshToken === null) {
			console.debug('Not logged in to Tesla account - refresh token not found')
			this.loggedIn = false
			throw new Error('Not logged in to Tesla account - refresh token not found')
		}
	},

	async checkState() {
		console.debug('checkState()')
		const { options } = this

		let vehicle = await this.api.vehicleAsync(options)
		console.debug(vehicle.state)

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

tesla.login = tesla.login.bind(tesla)

export default tesla

async function delay(delay = 1000) {
	await new Promise(resolve => {
		setTimeout(() => { resolve() }, delay)
	})
}