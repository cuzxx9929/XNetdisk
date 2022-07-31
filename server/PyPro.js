const pro = require("child_process")

pro.exec("python createPic.py", function (error, stdout, stderr) {
    if (error) {
        console.info(stderr)
    }
    console.log(stdout)
})