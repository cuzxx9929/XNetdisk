<template>
    <div class="CaptchaContainer">
      <div class="refresh" @click="getCapthcaPic">刷新</div>
      <img src="@/assets/img/cropped.jpg" alt="" ref="captchaPic">
      <img src="@/assets/img/slide.jpg" alt="" class="slidePic" ref="slidePic">

      <!-- 滑块的容器 -->
      <div class="bn-container"></div>

      <!-- 滑动时遮盖的颜色容器 -->
      <div class="coverBG" ref="coverBG"></div>

      <!-- 提示文本，层级在滑块容器和颜色容器之上 -->
      <div class="tip">向右滑动完成拼图</div>

      <!-- 滑块 -->
      <div class="slider" @mousedown="sliderMoveStart($event)" ref="slider">>>></div>

    </div>
</template>

<script>
import { GetCaptcha } from "@/api";
export default {
    name:'captcha',
    props:['username','pw','autoLogin','changeCaptchaShow','captchaShow','unchoosed'],
    data(){
      return{
        MouseStartPos:0,
        MoveFlag:false,
        MouseRoute:[],

      }
    },
    mounted(){
      document.onmousemove = this.sliderMove
      document.onmouseup = this.sliderMoveEnd
    },
    beforeDestroy(){
      document.onmousemove = null
      document.onmouseup = null
    },
    methods:{
        sliderMoveStart(e){
            // console.log(this.$refs.slidePic)
            this.MouseStartPos = e.clientX
            this.MoveFlag = true
        },
        sliderMove(e){
          if(this.MoveFlag){
            this.MouseRoute.push([e.clientX,e.clientY])
            if(e.clientX - this.MouseStartPos>=0 && e.clientX - this.MouseStartPos<=250){
              this.$refs.slidePic.style.left = `${e.clientX - this.MouseStartPos}px`
              this.$refs.slider.style.left = `${e.clientX - this.MouseStartPos}px`
              this.$refs.coverBG.style.width = `${e.clientX - this.MouseStartPos}px`
            }else if(e.clientX - this.MouseStartPos<0){
              this.$refs.slidePic.style.left = 0
              this.$refs.slider.style.left =0
              this.$refs.coverBG.style.width = 0
            }else{
              this.$refs.slidePic.style.left = '250px'
              this.$refs.slider.style.left ='250px'
              this.$refs.coverBG.style.width = '250px'
            }
          }
        },
        async sliderMoveEnd(e){
          console.log(this.unchoosed)
          if(this.MoveFlag){
            this.MoveFlag = false
            if(this.unchoosed==2){
              this.login()
            }
          }
          // console.log(this.MouseRoute)
          // console.log(this.MouseRoute.lengh)
        },
        async login() {
            console.log('logining..')
            if (this.username != "" && this.pw != "") {
                var params = new URLSearchParams();
                params.append("username", this.username);
                params.append("password", this.pw);
                params.append("MouseRoute", this.MouseRoute);
                try {
                    await this.$store.dispatch("login", { params, autoLogin: this.autoLogin });
                    this.$refs.coverBG.style.backgroundColor = 'green'
                    setTimeout(()=>{
                      alert("登录成功");
                      this.$router.push("/home/folder");
                      // this.$refs.coverBG.style.backgroundColor = 'rgba(99, 125, 255, 1)'

                    },100)
                }
                catch (err) { 
                    this.$refs.coverBG.style.backgroundColor = 'red'

                    setTimeout(() => {
                      this.$refs.slidePic.style.left = 0
                      this.$refs.slider.style.left = 0
                      this.$refs.coverBG.style.width = 0
                      alert(err.message);
                      this.$refs.coverBG.style.backgroundColor = 'rgba(99, 125, 255, 1)'

                    }, 100)
                }
            }
        },
        async register() {
            if (this.username != "" && this.pw != "" && this.rpw == this.pw) {
                var params = new URLSearchParams();
                params.append("username", this.username);
                params.append("password", this.pw);
                params.append("MouseRoute", this.MouseRoute);
                try {
                    let res = await this.$store.dispatch("register", params);
                    alert("注册成功");
                    this.unchoosed = 2;
                }
                catch (err) {
                    alert(err.message);
                }
            }
            else {
                alert("用户名密码未填写或两次密码输入不相同");
            }
        },
        async getCapthcaPic(){
          let result = await GetCaptcha()
          console.log(result)
          console.log(result.captchaPic)
          console.log(typeof result.captchaPic)
          let bytes = new Uint8Array(result.captchaPic.data);
          let data = "";
          let len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            data += String.fromCharCode(bytes[i]);
          }
          this.$refs.captchaPic.src = "data:image/png;base64," + window.btoa(data);
          bytes = new Uint8Array(result.sliderPic.data);
          data = "";
          len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            data += String.fromCharCode(bytes[i]);
          }
          this.$refs.slidePic.src = "data:image/png;base64," + window.btoa(data);
        
        }
    },
    watch:{
      captchaShow(val){
        if(val){
          console.log("Iniation to be finished")
        }
      }
    }
}
</script>

<style lang="less" scoped>
      .refresh{
        position: absolute;
        top:0;
        right: 0;
      }
      .CaptchaContainer {
        position: relative;
        width: 300px;
        height: 240px;
        border: 5px;
      } 
      .slidePic{
            position: absolute;
            left: 0px;
            top : 123px;
            z-index: 33;
      }
      .bn-container {
        position: absolute;
        left:0px;
        bottom: 0px;
        width: 100%;
        height: 40px;
        background-color: rgb(218, 214, 214);
       
      }
      .coverBG {
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 0px;
        height: 40px;
        background-color: rgba(99, 125, 255, 1);
        z-index: 25;
      }
      .tip {
        position: absolute;
        bottom: 0px;
        width: 100%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        /* 文本不允许选中 */
        user-select: none;
        -webkit-user-select: none;
      }
      .slider {
        position: absolute;
        left: 0px;
        bottom: 0px; 
        width: 50px;
        height: 40px;
        text-align: center;
        line-height: 36px;
        background-color: #9f9f9f;
        cursor: pointer;
        /* 文本不允许选中 */
        user-select: none;
        -webkit-user-select: none;
      }
</style>