const formidable = require('formidable');
const fs = require('fs');
const path = require('path')

function store(req,res,next){
    let  form = formidable({
        uploadDir:path.join(__dirname,'../../store',req.auth.username),
        keepExtensions: true,
        maxFileSize: 3 * 1024 * 1024 * 1024
    })

    form.parse(req,(err,fields,files)=>{
        if (err)
            return next(err)
        else{
            req.fields = fields
            req.files = files
            next()
        }
    })
}

module.exports = store