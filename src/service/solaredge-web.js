import axios from 'axios'

import config from '../../config'

const UPDATE_INTERVAL = 3000

export default {

	currentPower: null,
	connections: {
		pvToLoad: null,
		loadToGrid: null,
		gridToLoad: null,
	},

	init() {
		this.login().then(() => {
			this.getCurrentPower().then((data) => {
				this.currentPower = data.siteCurrentPowerFlow
				this.getConnections()
			})
			setInterval(() => {
				this.getCurrentPower().then((data) => {
					this.currentPower = data.siteCurrentPowerFlow
					this.getConnections()
					console.debug('SolarEdge current power', this.currentPower)
					console.debug('SolarEdge connections', this.connections)
				})
			}, UPDATE_INTERVAL)
		})
	},

	login() {
		return new Promise(function (resolve, reject) {

			axios.post('https://monitoring.solaredge.com/solaredge-apigw/api/login', `j_username=${config.solaredgeWebOptions.username}&j_password=${config.solaredgeWebOptions.password}`, { withCredentials: true })
				.then(function (response) {
					resolve(response)
				})
				.catch(function (error) {
					console.error(error)
					reject(error)
				})
			})
		},

	getCurrentPower() {
		return new Promise(function (resolve, reject) {

			axios.get(`https://monitoring.solaredge.com/solaredge-apigw/api/site/${config.solaredgeWebOptions.siteId}/currentPowerFlow.json`, { withCredentials: true })
				.then(function (response) {
					resolve(response.data)
				})
				.catch(function (error) {
					console.error(error)
					reject(error)
				})
		})
	},

	getConnections() {
		this.connections.pvToLoad = false
		this.connections.loadToGrid = false
		this.connections.gridToLoad = false
		if (this.currentPower) {
			for (var i = 0; i < this.currentPower.connections.length; i++) {
				if (this.currentPower.connections[i].from == "PV" && this.currentPower.connections[i].to == "Load") {
					this.connections.pvToLoad = true
				}
				if (this.currentPower.connections[i].from == "LOAD" && this.currentPower.connections[i].to == "Grid") {
					this.connections.loadToGrid = true
				}
				if (this.currentPower.connections[i].from == "GRID" && this.currentPower.connections[i].to == "Load") {
					this.connections.gridToLoad = true
				}
			}
		}
	}
}