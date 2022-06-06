l = ['124','234']
l = l.map(el=>{
    el = "\'"+el+"\'"
    return el
}).join(',')
l = l

console.log(l)