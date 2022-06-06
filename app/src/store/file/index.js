import {FileInfo ,FileDelete,DirInfo} from '@/api'
const state = {
    fileInfo:[],
    chosedfile:[],
    dirInfo:[],
    choseddir:[],
}

const mutations = {
    set_fileInfo(state,data){
        state.fileInfo = data
    },
    set_dirInfo(state,data){
        state.dirInfo = data
    },
    add_chosedfile(state,id){
        state.chosedfile.push(id)
    },
    delete_chosedfile(state,id){
        state.chosedfile.splice(state.chosedfile.indexOf(id),1)
    },
    add_choseddir(state,id){
        state.choseddir.push(id)
    },
    delete_choseddir(state,id){
        state.choseddir.splice(state.choseddir.indexOf(id),1)
    },
    chooseAll(state){
        let tmp = []
        for(const el of state.fileInfo){
            tmp.push(el.fid)
        }
        state.chosedfile = tmp
        tmp=[]
        for(const el of state.dirInfo){
            tmp.push(el.id)
        }
        state.choseddir = tmp
    },
    deleteAll(state){
        state.chosedfile = []
        state.choseddir = []
    }
}

const actions = {
    async getFileInfo({commit},params){
        let res = await FileInfo(params)
        if(res.status==0){
            commit('set_fileInfo',res.data)
            return'ok'
        }else{
            return Promise.reject(new Error(res.message))
        }
    },
    async deleteFile({commit},data){
        let res = await FileDelete(data)
        if (res.status==0){
            commit('deleteALl_chosedfile')
            return 'ok'
        }else{
            return Promise.reject(new Error(res.message))
        }
    },
    async getdirInfo({commit},params){
        let res = await DirInfo(params)
        // console.log(res)
        if(res.status==0){
            commit('set_dirInfo',res.data)
            return'ok'
        }else{
            return Promise.reject(new Error(res.message))
        }
    },
}

export default {
    state,
    mutations,
    actions
}