import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import permission from './modules/permission'
import globalVar from './modules/globalVar'

Vue.use(Vuex)

/* const store = new Vuex.Store({
  modules: {
    app,
    user
  },
  getters
})*/

// export default store
export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    globalVar
  },
  getters
})
