const express = require('express')
const cors = require('cors')
const joi = require('joi')
const {expressjwt} = require('express-jwt')
const session = require("express-session")
const https = require('https')
const http = require('http')

const fs = require('fs')

const UserRouter = require('./router/router.js')
const config = require('./config')

var options = {
    key:fs.readFileSync('./cuzxx.xyz.key'),
    cert:fs.readFileSync('./cuzxx.xyz_bundle.crt')
}


const app = express()

app.use(cors({
    // origin: 'https://cuzxx.xyz',
    // origin: ['http://localhost:8080',"http://192.168.2.102:8080"],
    origin: ['http://localhost:8080',"http://192.168.2.102:8080"],

    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true
 }))


app.use(express.static('public'))

app.use(session({
    secret: config.sessionKey,
    cookie: {
        secure: true ,
        maxAge: 60* 60 * 1000,
        sameSite: 'none'
    },
    resave: false,
    saveUninitialized: true
}))


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
    if(err instanceof joi.ValidationError){
        // console.log(err)
        return res.cc('用户名长度需为3-10位,密码长度需为6-12位')
    }
    if(err.name =="UnauthorizedError")
        return res.cc('身份认证失败')
    res.cc(err)
})


const httpsServer = https.createServer(options,app)
const httpServer = http.createServer(app)

httpsServer.listen('443',()=>{
    console.log('httpsServer running at https://localhost:443')
})

httpServer.listen('8889',()=>{
    console.log('httpServer running at http://localhost:8889')
})

