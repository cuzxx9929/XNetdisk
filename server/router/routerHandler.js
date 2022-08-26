const fs = require('fs')
const path = require('path')
const db = require('../db/db.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { v4 } = require('uuid')
const { getDate } = require('../date/date.js')
const pro = require("child_process")



//获取图片验证码
exports.getCaptha = (req,res) =>{
    console.log(getDate(),req.ip, 'getCaptcha...')

    pro.exec("python ./createCaptha/createPic.py", function (error, stdout, stderr) {
        if (error) {
            console.info(stderr)
        }
        console.log(stdout)
        let captchaPic = fs.readFileSync('./createCaptha/cropped.jpg')
        let sliderPic = fs.readFileSync('./createCaptha/slide.jpg')
        req.session.posX = parseInt(stdout.split(' ')[0].trim())
        console.log(req.session)
        // console.log(req.session.cookie)

        console.log(req.session.id)

        res.send({
            status: 0,
            posY:stdout.split(' ')[1].trim(),
            message: "success",
            captchaPic:captchaPic,
            sliderPic:sliderPic
        })
    })
}

//验证验证码鼠标轨迹
function verifyCaptcha(mouseroute,sliderPos,posX){
    let route = mouseroute.split(',')
    route.forEach((element,index) => {
        route[index] =  parseInt(element)
    });
    if(route.length==0 || route.length%2==1)
        return false
    if(Math.abs(parseInt(sliderPos)-posX)>3)
        return false
    return true
}

//用户注册 
exports.register = (req, res) => {
    try {
        var info = req.body, p
        console.log(getDate(),req.ip, 'register...')
        let verifyRes = verifyCaptcha(info.mouseroute,info.sliderPos,req.session.posX)
        if (!verifyRes){
           return res.cc('CaptchaError')
        }
    
        req.session.destroy();
        const selectSqlStr = 'select * from users where username= ?'
        db.query(selectSqlStr, info.username, (err, results) => {
            if (err) {
                return res.cc(err)
            }

            if (results.length > 0) {
                return res.cc('用户名已被占用')
            }

            p = bcrypt.hashSync(info.password, 10)

            const insertSqlStr = 'insert into users set ?'
            db.query(insertSqlStr, { username: info.username, password: p, uid: v4() }, (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows !== 1)
                    return res.send({ status: 1, message: '用户创建失败' })

                fs.mkdir(path.join(__dirname, '../../', 'store', info.username), (err) => {
                    if (err)
                        res.cc(err)
                    else {
                        res.send({
                            status: 0,
                            message: "注册成功"
                        })
                    }
                })

            })
        })
    } catch (err) {
        console.log(err)
    }
}

//用户登录 
exports.login = (req, res) => {
    try {
        let info = req.body
        let selectSqlStr = 'select * from users where username = ?'
        console.log(getDate(),req.ip, 'login...')

        if(req.session.posX==undefined)
            return res.cc('CaptchaError')

        let verifyRes = verifyCaptcha(info.mouseroute,info.sliderPos,req.session.posX)
        if (!verifyRes){
           return res.cc('CaptchaError')
        }
        db.query(selectSqlStr, info.username, (err, results) => {
            if (err)
                return res.cc(err)

            if (results.length == 0) {
                return res.cc('用户不存在')
            }

            bcrypt.compare(info.password, results[0].password)
                .then(r => {
                    if (!r) {
                        res.cc('密码错误')
                    } else {

                        const user = {
                            uid: results[0].uid,
                            username: results[0].username,
                        }

                        tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expires })
                        res.send({
                            status: 0,
                            message: "登录成功",
                            token: "Bearer " + tokenStr
                        })
                    }

                })
                .catch(e => {
                    res.cc(e)
                })
        })
    } catch (err) {
        console.log(err)
    }
}

//获取用户信息 
exports.getInfo = (req, res) => {
    try {
        console.log(getDate(),req.ip, req.auth, 'getUserInfo...')
        res.send({
            status: 0,
            message: '获取用户信息成功',
            username: req.auth.username
        })
    } catch (err) {
        console.log(err)
    }
}

//获取用户文件信息 
exports.getFileInfo = (req, res) => {
    try {
        console.log(getDate(),req.ip, req.auth, 'getFileInfo...')
        let uid = req.auth.uid
        let type = req.body.type
        let did = req.body.did
        let sql

        if (type == 'folder')
            sql = `select fid,filename,time,size,type from files where uid=? && did =? `
        else
            sql = `select fid,filename,time,size,type from files where uid=? && type like '${type}%'`
        db.query(sql, [uid, did, type], (err, results) => {
            if (err)
                return res.cc(err)
            res.send({
                status: 0,
                message: '获取文件信息成功',
                data: results
            })
        })
    } catch (err) {
        console.log(err)
    }
}

//上传文件 
exports.uploadFile = (req, res) => {
    try {
        console.log(getDate(),req.ip, req.auth, 'uploadFile...')

        let uid = req.auth.uid

        let did = req.fields.did
        let file = req.files.file

        const fileinfo = {
            fid: v4(),
            did: did,
            uid: uid,
            filename: file.originalFilename,
            type: file.mimetype,
            size: file.size,
            time: getDate(),
            path: file.filepath
        }

        const insertSqlStr = `insert into files set ?`

        db.query(insertSqlStr, fileinfo, (err, results) => {
            if (err)
                return res.cc(err)
            res.send({
                status: 0,
                message: "文件上传成功"
            })
        })
    } catch (err) {
        console.log(err)
    }

}

//删除文件 
exports.deleteFile = (req, res) => {
    try {
        console.log(getDate(),req.ip, req.auth, 'deleteFile...')

        const uid = req.auth.uid

        let list = req.body.list.split(',')
        list = list.map(el => {
            el = '\'' + el + '\''
            return el
        }).join(',')
        const did = req.body.did


        const selectSqlStr = `select path from files where fid in (${list}) && did=? && uid =?`
        const deleteSqlStr = `delete from files where fid in (${list}) && did=? && uid =?`

        db.query(selectSqlStr, [did, uid], (err, results) => {
            if (err)
                return res.cc(err)
            else {
                for (el of results) {
                    fs.unlink(el.path, (err) => {
                        if (err)
                            return res.cc(err)
                    })
                }
            }

            db.query(deleteSqlStr, [did, uid], (err) => {
                if (err)
                    return res.cc(err)
                else {
                    res.send({
                        status: 0,
                        message: '文件删除成功'
                    })
                }
            })
        })
    } catch (err) {
        console.log(err)
    }

}

//下载文件 
exports.downloadFile = (req, res) => {
    try {
        console.log(getDate(),req.ip, req.auth, 'downloadFile...')

        const uid = req.auth.uid
        const fid = req.body.fid
        const did = req.body.did

        const filename = req.body.filename
        const SearchPathSql = `select path from files where fid=? && did =? && uid =?`

        db.query(SearchPathSql, [fid, did, uid], (err, results) => {
            if (err)
                return res.cc(err)

            try {
                const path = results[0].path

                const f = fs.createReadStream(path)

                res.writeHead(200, {
                    'Content-Type': 'application/force-download'
                })

                f.pipe(res)
            } catch (err) {
                res.cc(err)
            }
        })
    } catch (err) {
        console.log(err)
    }

}
//新建文件夹
exports.createDir = (req, res) => {
    try {
        console.log(getDate(),req.ip, req.auth, 'createDir...')

        const uid = req.auth.uid
        const dirname = req.body.dirname
        const did = req.body.did

        let searchSqlStr = 'select * from dirs where dirname = ? && did =? && uid =?'

        db.query(searchSqlStr, [dirname, did, uid], (err, results) => {
            if (err)
                return res.cc(err)
            if (results.length > 0)
                return res.cc('当前目录下已存在该文件夹')
            let info = {
                id: v4(),
                dirname,
                did,
                time: getDate(),
                uid
            }

            const insertSqlStr = 'insert into dirs set ?'
            db.query(insertSqlStr, info, (err) => {
                if (err)
                    return res.cc(err)
                else
                    res.send({
                        status: 0,
                        message: "新建文件夹成功"
                    })
            })
        })
    } catch (err) {
        console.log(err)
    }
}
//获取文件夹信息
exports.getDirInfo = (req, res) => {
    try {
        console.log(getDate(),req.ip, req.auth, 'getDirInfo...')

        const uid = req.auth.uid
        const id = req.body.id
        const searchSqlStr = 'select id,dirname,time from dirs where uid=? && did = ?'

        db.query(searchSqlStr, [uid, id], (err, results) => {
            if (err)
                return res.cc(err)
            res.send({
                status: 0,
                message: '获取文件信息成功',
                data: results
            })
        })
    } catch (err) {
        console.log(err)
    }
}

//获取文件夹路径
exports.getDirRoute = (req, res) => {
    try {
        console.log(getDate(),req.ip, req.auth, 'getDirRoute...')


        const uid = req.auth.uid
        const id = req.body.id

        const selectSql = 'select id,dirname from dirs where FIND_IN_SET(id, GET_PARENT_NODE(?,?)) order by time'

        db.query(selectSql, [id, uid], (err, results) => {
            if (err)
                return res.cc(err)
            res.send({
                status: 0,
                message: '获取文件夹路径成功',
                data: results
            })
        })
    } catch (err) {
        console.log(err)
    }
}

//删除文件夹
exports.deleteDir = (req, res) => {
    try {
        console.log(getDate(),req.ip, req.auth, 'deleteDir...')
        const uid = req.auth.uid
        const id = req.body.id

        const deleteSqlStr = 'select DELETE_CHILD_NODE(?,?) as paths'

        db.query(deleteSqlStr, [id, uid], (err, results) => {

            if (err)
                return res.cc(err)

            if (results[0].paths != null) {
                let path = results[0].paths.split(',')
                for (const el of path) {
                    fs.unlink(el, (err) => {
                        if (err)
                            return res.cc(err)
                    })
                }

            }
            res.send({
                status: '0',
                message: '文件夹删除成功'
            })

        })
    } catch (err) {
        console.log(err.message)
    }
}