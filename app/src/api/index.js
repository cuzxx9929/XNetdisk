import requests from "./http"

export const UserLogin = (data) => requests({url:'/api/login',data,method:'post'})

export const UserRegister = (data) => requests({url:'/api/register',data,method:'post'})

export const UserInfo = ()=> requests({url:'/user/getInfo',method:'get'})

export const FileInfo = (data)=> requests({url:'/user/getFileInfo',data,method:'post'})

export const FileUpload = (data) => requests({url:'/user/uploadFile',data,method:'post'})

export const FileDelete = (data) => requests({url:'/user/deleteFile',data,method:'post'})

export const FileDownload = (data) => requests({url:'/user/downloadFile',data,method:'post',responseType: 'blob'})

export const DirCreate = (data) => requests({url:'/user/createDir',data,method:'post'})

export const DirInfo = (data) => requests({url:'/user/getDirInfo',data,method:'post'})

export const DirRoute = (data) => requests({url:'/user/getDirRoute',data,method:'post'})

export const DirDelete = (data) => requests({url:'/user/deleteDir',data,method:'post'})