import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import actions from './actions.js'
import mutations from './mutations'
import getters from './getters'

/* veux plugin */
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const initialState = {
  room: {}, // information of the running room
  me: {}, // information of the user on that client
  rooms: [], // array of all rooms in db
  // initialCardNumbers: [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  initialCardNumbers: [1, 2, 4, 4, 4, 4, 4, 4, 3, 2, 1, 1, 1, 1],
  cardsType: ['-10', '-5', '0', '1', '2', '3', '4', '5', '10', '15', '20', '×2', 'MAX → 0', '?']
}


export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [createPersistedState({storage: window.sessionStorage})]
})
