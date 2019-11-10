import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		messages: []
	},
	mutations: {
		addMessage({messages}, message) {
			messages.push(message);
		}
	},
	actions: {
	},
	modules: {
	}
})
