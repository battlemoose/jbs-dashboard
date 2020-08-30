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

export { localStorageWrapper }