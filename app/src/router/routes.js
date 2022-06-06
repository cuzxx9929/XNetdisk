// import login from '@/pages/login'
// import home from '@/pages/home'

export default [
    {
        path:'/',
        redirect:'/home/folder'
    },
    {
        path:'/login',
        name:'login',
        component:()=>import('@/pages/login')
    },
    {
        path:'/home/:type/:did?',
        name:'home',
        component:()=>import('@/pages/home')
    },
]