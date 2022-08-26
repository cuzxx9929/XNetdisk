(function(){"use strict";var e={3228:function(e,t,n){n.d(t,{Eo:function(){return v},hl:function(){return k},rL:function(){return b},NE:function(){return y},mg:function(){return h},kN:function(){return g},UL:function(){return m},p0:function(){return p},cC:function(){return w},ao:function(){return d},K8:function(){return c},zb:function(){return f}});var r=n(6166),o=n.n(r),i=n(2554),a=n(9879),s=n.n(a);let u=o().create({baseURL:"https://localhost:8888",withCredentials:!0});u.interceptors.request.use((e=>(s().start(),i.Z.state.user.token&&(e.headers.Authorization=i.Z.state.user.token),e))),u.interceptors.response.use((e=>(s().done(),e.data)),(e=>(alert(e.message),new Promise)));var l=u;const c=e=>l({url:"/api/login",data:e,method:"post"}),f=e=>l({url:"/api/register",data:e,method:"post"}),d=()=>l({url:"/user/getInfo",method:"get"}),m=e=>l({url:"/user/getFileInfo",data:e,method:"post"}),p=e=>l({url:"/user/uploadFile",data:e,method:"post"}),h=e=>l({url:"/user/deleteFile",data:e,method:"post"}),g=e=>l({url:"/user/downloadFile",data:e,method:"post",responseType:"blob"}),v=e=>l({url:"/user/createDir",data:e,method:"post"}),b=e=>l({url:"/user/getDirInfo",data:e,method:"post"}),y=e=>l({url:"/user/getDirRoute",data:e,method:"post"}),k=e=>l({url:"/user/deleteDir",data:e,method:"post"}),w=()=>l({url:"/api/getCaptcha",method:"get"})},1784:function(e,t,n){var r=n(8935),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},i=[],a={name:"app"},s=a,u=n(1001),l=(0,u.Z)(s,o,i,!1,null,null,null),c=l.exports,f=n(2809),d=[{path:"/",redirect:"/home/folder"},{path:"/login",name:"login",component:()=>n.e(681).then(n.bind(n,6681))},{path:"/home/:type/:did?",name:"home",component:()=>n.e(420).then(n.bind(n,5420))}],m=n(2554);r.Z.use(f.Z);const p=new f.Z({routes:d});p.beforeEach((async(e,t,n)=>{let r=m.Z.state.user.token,o=m.Z.state.user.username;if(console.log(o),r)if("/login"==e.path)n("/login");else if(o)n();else try{let e=await m.Z.dispatch("getInfo");0==e.status?n():(alert("token 已失效,请重新登录"),m.Z.dispatch("logout"),n("/login"))}catch(i){console.log("登录失败"),alert(i.message),m.Z.dispatch("logout"),n("/login")}else"/login"!=e.path?n("/login"):n()}));var h=p;r.Z.config.productionTip=!1,new r.Z({beforeCreate(){r.Z.prototype.$bus=this},router:h,store:m.Z,render:e=>e(c)}).$mount("#app")},2554:function(e,t,n){n.d(t,{Z:function(){return h}});var r=n(8935),o=n(4665),i=(n(1703),n(3228));let a={username:"",token:localStorage.getItem("token")?localStorage.getItem("token"):sessionStorage.getItem("token"),fileLists:[]},s={set_username(e,t){e.username=t},set_token(e,t){e.token=t},clear(e){e.username="",e.token="",e.fileLists=[],localStorage.removeItem("token"),sessionStorage.removeItem("token")},set_autoLogin(e,t){e.autoLogin=t}},u={async login({commit:e},t){let n=await(0,i.K8)(t.params);return 0==n.status?(e("set_token",n.token),t.autoLogin?localStorage.setItem("token",n.token):sessionStorage.setItem("token",n.token),"ok"):Promise.reject(new Error(n.message))},async register({commit:e},t){let n=await(0,i.zb)(t);return 0==n.status?"ok":Promise.reject(new Error(n.message))},async getInfo({commit:e}){let t=await(0,i.ao)();return e("set_username",t.username),t},logout({commit:e}){e("clear")}},l={};var c={state:a,mutations:s,actions:u,getters:l};const f={fileInfo:[],chosedfile:[],dirInfo:[],choseddir:[]},d={set_fileInfo(e,t){e.fileInfo=t},set_dirInfo(e,t){e.dirInfo=t},add_chosedfile(e,t){e.chosedfile.push(t)},delete_chosedfile(e,t){e.chosedfile.splice(e.chosedfile.indexOf(t),1)},add_choseddir(e,t){e.choseddir.push(t)},delete_choseddir(e,t){e.choseddir.splice(e.choseddir.indexOf(t),1)},chooseAll(e){let t=[];for(const n of e.fileInfo)t.push(n.fid);e.chosedfile=t,t=[];for(const n of e.dirInfo)t.push(n.id);e.choseddir=t},deleteAll(e){e.chosedfile=[],e.choseddir=[]}},m={async getFileInfo({commit:e},t){let n=await(0,i.UL)(t);return 0==n.status?(e("set_fileInfo",n.data),"ok"):Promise.reject(new Error(n.message))},async deleteFile({commit:e},t){let n=await(0,i.mg)(t);return 0==n.status?(e("deleteALl_chosedfile"),"ok"):Promise.reject(new Error(n.message))},async getdirInfo({commit:e},t){let n=await(0,i.rL)(t);return 0==n.status?(e("set_dirInfo",n.data),"ok"):Promise.reject(new Error(n.message))}};var p={state:f,mutations:d,actions:m};r.Z.use(o.ZP);var h=new o.ZP.Store({modules:{user:c,file:p}})}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}n.m=e,function(){var e=[];n.O=function(t,r,o,i){if(!r){var a=1/0;for(c=0;c<e.length;c++){r=e[c][0],o=e[c][1],i=e[c][2];for(var s=!0,u=0;u<r.length;u++)(!1&i||a>=i)&&Object.keys(n.O).every((function(e){return n.O[e](r[u])}))?r.splice(u--,1):(s=!1,i<a&&(a=i));if(s){e.splice(c--,1);var l=o();void 0!==l&&(t=l)}}return t}i=i||0;for(var c=e.length;c>0&&e[c-1][2]>i;c--)e[c]=e[c-1];e[c]=[r,o,i]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}}(),function(){n.f={},n.e=function(e){return Promise.all(Object.keys(n.f).reduce((function(t,r){return n.f[r](e,t),t}),[]))}}(),function(){n.u=function(e){return"js/"+e+"."+{420:"aeaf398a",681:"922870f4"}[e]+".js"}}(),function(){n.miniCssF=function(e){return"css/"+e+"."+{420:"67d8c66a",681:"63b623f6"}[e]+".css"}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={},t="app:";n.l=function(r,o,i,a){if(e[r])e[r].push(o);else{var s,u;if(void 0!==i)for(var l=document.getElementsByTagName("script"),c=0;c<l.length;c++){var f=l[c];if(f.getAttribute("src")==r||f.getAttribute("data-webpack")==t+i){s=f;break}}s||(u=!0,s=document.createElement("script"),s.charset="utf-8",s.timeout=120,n.nc&&s.setAttribute("nonce",n.nc),s.setAttribute("data-webpack",t+i),s.src=r),e[r]=[o];var d=function(t,n){s.onerror=s.onload=null,clearTimeout(m);var o=e[r];if(delete e[r],s.parentNode&&s.parentNode.removeChild(s),o&&o.forEach((function(e){return e(n)})),t)return t(n)},m=setTimeout(d.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=d.bind(null,s.onerror),s.onload=d.bind(null,s.onload),u&&document.head.appendChild(s)}}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.p="/"}(),function(){var e=function(e,t,n,r){var o=document.createElement("link");o.rel="stylesheet",o.type="text/css";var i=function(i){if(o.onerror=o.onload=null,"load"===i.type)n();else{var a=i&&("load"===i.type?"missing":i.type),s=i&&i.target&&i.target.href||t,u=new Error("Loading CSS chunk "+e+" failed.\n("+s+")");u.code="CSS_CHUNK_LOAD_FAILED",u.type=a,u.request=s,o.parentNode.removeChild(o),r(u)}};return o.onerror=o.onload=i,o.href=t,document.head.appendChild(o),o},t=function(e,t){for(var n=document.getElementsByTagName("link"),r=0;r<n.length;r++){var o=n[r],i=o.getAttribute("data-href")||o.getAttribute("href");if("stylesheet"===o.rel&&(i===e||i===t))return o}var a=document.getElementsByTagName("style");for(r=0;r<a.length;r++){o=a[r],i=o.getAttribute("data-href");if(i===e||i===t)return o}},r=function(r){return new Promise((function(o,i){var a=n.miniCssF(r),s=n.p+a;if(t(a,s))return o();e(r,s,o,i)}))},o={143:0};n.f.miniCss=function(e,t){var n={420:1,681:1};o[e]?t.push(o[e]):0!==o[e]&&n[e]&&t.push(o[e]=r(e).then((function(){o[e]=0}),(function(t){throw delete o[e],t})))}}(),function(){var e={143:0};n.f.j=function(t,r){var o=n.o(e,t)?e[t]:void 0;if(0!==o)if(o)r.push(o[2]);else{var i=new Promise((function(n,r){o=e[t]=[n,r]}));r.push(o[2]=i);var a=n.p+n.u(t),s=new Error,u=function(r){if(n.o(e,t)&&(o=e[t],0!==o&&(e[t]=void 0),o)){var i=r&&("load"===r.type?"missing":r.type),a=r&&r.target&&r.target.src;s.message="Loading chunk "+t+" failed.\n("+i+": "+a+")",s.name="ChunkLoadError",s.type=i,s.request=a,o[1](s)}};n.l(a,u,"chunk-"+t,t)}},n.O.j=function(t){return 0===e[t]};var t=function(t,r){var o,i,a=r[0],s=r[1],u=r[2],l=0;if(a.some((function(t){return 0!==e[t]}))){for(o in s)n.o(s,o)&&(n.m[o]=s[o]);if(u)var c=u(n)}for(t&&t(r);l<a.length;l++)i=a[l],n.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return n.O(c)},r=self["webpackChunkapp"]=self["webpackChunkapp"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}();var r=n.O(void 0,[998],(function(){return n(1784)}));r=n.O(r)})();