const express = require('express')
const cors = require('cors')
const joi = require('joi')
const {expressjwt} = require('express-jwt')

const UserRouter = require('./router/router.js')
const config = require('./config')

const app = express()

app.use(cors())

app.use(express.static('public'))

app.use(express.json())

app.use(express.urlencoded({extended:false}))


app.use((req,res,next)=>{
    res.cc = function(err,status=1){
        res.send({
            status,
            message:err instanceof Error?err.message:err
        })
    }
    next()
})


app.use(expressjwt({algorithms: ['HS256'],secret:config.jwtSecretKey}).unless({path:[/^\/api\//]}))

app.use(UserRouter)

app.use((err,req,res,next)=>{
    if(err instanceof joi.ValidationError)
        return res.cc('用户名长度需为3-10位,密码长度需为6-12位')

    if(err.name =="UnauthorizedError")
        return res.cc('身份认证失败')
    res.cc(err)
})

app.listen('8888',()=>{
    console.log('server running at http://localhost:8888')
})

