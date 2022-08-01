import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'

Vue.use(VueRouter)

const router =  new VueRouter({
    routes
})

router.beforeEach(async (to,from,next)=>{
let hasToken = store.state.user.token 
let hasUsername = store.state.user.username
console.log(hasUsername)

if(hasToken){
    if(to.path=='/login'){
        next('/home/folder')
    }else{
        if(hasUsername){
            next()
        }else{
            try{
                let res = await store.dispatch('getInfo')
                if(res.status==0)
                    next()
                else{
                    alert('token 已失效,请重新登录')
                    store.dispatch('logout')
                    next('/login')
                }
            }catch(error){
                console.log('登录失败')
                alert(error.message)
                store.dispatch('logout')
                next('/login')
            }
        }
    }
}else{
    if(to.path!='/login')
        next('/login')
    else
        next()
}
})


export default router