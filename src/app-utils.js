const localStorageWrapper = {

	store(key, data) {
		window.localStorage.setItem(key, JSON.stringify(data))
	},

	retrieve(key) {
		return JSON.parse(window.localStorage.getItem(key))
	},

	delete(key) {
		window.localStorage.removeItem(key)
	}
}

const SET_TIMEOUT_MAX = 2147483647

export { localStorageWrapper, SET_TIMEOUT_MAX }