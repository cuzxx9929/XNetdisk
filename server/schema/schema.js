const joi = require('joi')

const username = joi.string().alphanum().min(3).max(10).required()

const password = joi.string().pattern(/^[\S]{6,12}$/).required()//常见密码正则表达式有哪些？

exports.login_schema ={
    body:{
        username,
        password
    }
}
