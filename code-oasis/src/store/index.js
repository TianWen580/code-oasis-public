import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import lesson from './modules/lesson'
import setting from './modules/setting'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        user,
        lesson,
        setting
    }
})