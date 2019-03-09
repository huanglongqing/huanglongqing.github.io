import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'  //mutation修改时会打印logger

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'  //调试工具  检测是不是通过mutation修改state

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})