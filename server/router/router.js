const express = require('express')
const expressJoi = require('@escook/express-joi')
const {login_schema} = require('../schema/schema.js')
const routerHandler = require('./routerHandler')
const store = require('../middleware/filestore.js')
const router = express.Router()
const path = require('path')

router.post('/api/login' ,expressJoi(login_schema),routerHandler.login)

router.post('/api/register' ,expressJoi(login_schema),routerHandler.register)

router.get('/user/getInfo',routerHandler.getInfo)

router.post('/user/getFileInfo',routerHandler.getFileInfo)

router.post('/user/uploadFile',store,routerHandler.uploadFile)

router.post('/user/deleteFile',routerHandler.deleteFile)

router.post('/user/downloadFile',routerHandler.downloadFile)

router.post('/user/createDir',routerHandler.createDir)

router.post('/user/getDirInfo',routerHandler.getDirInfo)

router.post('/user/getDirRoute',routerHandler.getDirRoute)

router.post('/user/deleteDir',routerHandler.deleteDir)



module.exports = router 