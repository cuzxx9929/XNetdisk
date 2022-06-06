import {UserLogin,UserInfo,UserRegister} from '@/api'

let state = {
    username: '',
    token: localStorage.getItem("token")?localStorage.getItem("token"):sessionStorage.getItem("token"),
    fileLists:[]
}

let mutations = {
    set_username(state, username) {
        state.username = username
    },

    set_token(state, token) {
        state.token = token
    },

    clear(state){
        state.username= ''
        state.token = ''
        state.fileLists = []
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
    },

    set_autoLogin(state,val){
        state.autoLogin = val
    }
}

let actions = {

    async login({ commit }, payload) {
        let res = await UserLogin(payload.params)
        if(res.status==0){
            commit('set_token',res.token)
            if(payload.autoLogin)
                localStorage.setItem('token',res.token)
            else
                sessionStorage.setItem('token',res.token)
            return 'ok'
        }else{
            return Promise.reject(new Error(res.message))
        }
    },

    async register({commit},data){
        let res = await UserRegister(data)
        if(res.status==0){
            return 'ok'
        }else{
            return Promise.reject(new Error(res.message))
        }
    },

    async getInfo({commit}){
        let res = await UserInfo()
        commit('set_username',res.username)
        return res
    },

    logout({commit}){
        commit('clear')
    }
}

let getters = {

}

export default {
    state,
    mutations,
    actions,
    getters
}