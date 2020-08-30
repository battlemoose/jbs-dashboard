import teslajs from 'teslajs'
import * as dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(duration)
dayjs.extend(relativeTime)
import config from '../../config'
import { localStorageWrapper as ls, SET_TIMEOUT_MAX } from '../app-utils'

const UPDATE_DATA_INTERVAL = 3000
const UPDATE_GEOCODE_INTERVAL = 60000
const WAKE_UP_TIMEOUT = 30000
const TESLA_AUTH_TOKEN_KEY = 'tesla_auth_token'
const TESLA_REFRESH_TOKEN_KEY = 'tesla_refresh_token'
const TESLA_AUTH_TOKEN_EXPIRY_KEY = 'tesla_auth_token_expiry'
// const CHECK_STATE_INTERVAL = 60000

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
			this.setTokenRefreshTime()
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
		console.debug('tesla.login()')
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
			this.saveAuthTokens(result)
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
		console.log('tesla.checkLogin()')
		this.options.authToken = ls.retrieve(TESLA_AUTH_TOKEN_KEY)
		this.options.refreshToken = ls.retrieve(TESLA_REFRESH_TOKEN_KEY)
		this.options.authTokenExpiry = dayjs.unix(ls.retrieve(TESLA_AUTH_TOKEN_EXPIRY_KEY))
		if (this.options.refreshToken === null) {
			console.debug('Not logged in to Tesla account - refresh token not found')
			this.loggedIn = false
			throw new Error('Not logged in to Tesla account - refresh token not found')
		}
	},

	saveAuthTokens(result) {
		this.options.authToken = result.authToken
		this.options.refreshToken = result.refreshToken
		this.options.authTokenExpiry = dayjs.unix(result.body.created_at + result.body.expires_in)
		ls.store(TESLA_AUTH_TOKEN_KEY, result.authToken)
		ls.store(TESLA_REFRESH_TOKEN_KEY, result.refreshToken)
		ls.store(TESLA_AUTH_TOKEN_EXPIRY_KEY, this.options.authTokenExpiry.unix())
	},

	setTokenRefreshTime() {
		console.log('tesla.setTokenRefreshTime()')
		let time = this.options.authTokenExpiry.diff(dayjs())
		if (time < SET_TIMEOUT_MAX) {
			console.log(`Setting token refresh time to be ${dayjs.duration(time).humanize()}`)
			setTimeout(() => {
				this.refreshAuthToken()
			}, time) // A negative diff will call the function immediately
		}
	},

	async refreshAuthToken() {
		console.debug('tesla.refreshAuthToken()')
		const result = await this.api.refreshTokenAsync(this.options.refreshToken)
		result.body = JSON.parse(result.body)
		this.saveAuthTokens(result)
	},

	async checkState() {
		console.debug('tesla.checkState()')
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