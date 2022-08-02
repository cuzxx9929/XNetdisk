<template>
  <div class="CaptchaContainer">
    <div class="refresh" @click="getCapthcaPic">刷新</div>
    <div class="close" @click="close">X</div>
    <img src="" alt="" ref="captchaPic">
    <img src="" alt="" class="slidePic" ref="slidePic">

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
  name: 'captcha',
  props: ['username', 'pw', 'autoLogin', 'changeCaptchaShow', 'captchaShow', 'unchoosed'],
  data() {
    return {
      MouseStartPos: 0,
      MoveFlag: false,
      MouseRoute: [],
    }
  },
  beforeDestroy() {
    console.log('cap destroy')
    document.onmousemove = null
    document.onmouseup = null
  },
  methods: {
    close() {
      this.$bus.$emit('closeCaptcha')
    },
    sliderMoveStart(e) {
      // console.log(this.$refs.slidePic)
      this.MouseStartPos = e.clientX
      this.MoveFlag = true
    },
    sliderMove(e) {
      if (this.MoveFlag) {
        this.MouseRoute.push([e.clientX, e.clientY])
        if (e.clientX - this.MouseStartPos >= 0 && e.clientX - this.MouseStartPos <= 250) {
          this.$refs.slidePic.style.left = `${e.clientX - this.MouseStartPos}px`
          this.$refs.slider.style.left = `${e.clientX - this.MouseStartPos}px`
          this.$refs.coverBG.style.width = `${e.clientX - this.MouseStartPos}px`
        } else if (e.clientX - this.MouseStartPos < 0) {
          this.$refs.slidePic.style.left = 0
          this.$refs.slider.style.left = 0
          this.$refs.coverBG.style.width = 0
        } else {
          this.$refs.slidePic.style.left = '250px'
          this.$refs.slider.style.left = '250px'
          this.$refs.coverBG.style.width = '250px'
        }
      }
    },
    async sliderMoveEnd(e) {
      console.log(this.unchoosed)
      if (this.MoveFlag) {
        this.MoveFlag = false
        if (this.unchoosed == 2) {
          this.login()
        } else {
          this.register()
        }
      }
      // console.log(this.MouseRoute)
      // console.log(this.MouseRoute.lengh)
    },
    async login() {
      console.log('logining..')
      var params = new URLSearchParams();
      params.append("username", this.username);
      params.append("password", this.pw);
      params.append("mouseroute", this.MouseRoute.toString());
      params.append("sliderPos", this.$refs.slider.style.left);
      try {
        await this.$store.dispatch("login", { params, autoLogin: this.autoLogin });
        this.$refs.coverBG.style.backgroundColor = 'green'
        setTimeout(() => {
          alert("登录成功");
          this.$router.push("/home/folder");
        }, 100)
      }
      catch (err) {
        this.$refs.coverBG.style.backgroundColor = 'red'
        if (err.message == 'CaptchaError') {
          setTimeout(() => {
            this.$refs.slidePic.style.left = 0
            this.$refs.slider.style.left = 0
            this.$refs.coverBG.style.width = 0
            this.$refs.coverBG.style.backgroundColor = 'rgba(99, 125, 255, 1)'
            this.getCapthcaPic()
          }, 200)
        } else {
          setTimeout(() => {
            alert(err.message);
            this.close()
          }, 100);
        }

      }

    },
    async register() {
      // if (this.username != "" && this.pw != "" && this.rpw == this.pw) {

      var params = new URLSearchParams();
      params.append("username", this.username);
      params.append("password", this.pw);
      params.append("mouseroute", this.MouseRoute);
      params.append("sliderPos", this.$refs.slider.style.left);
      try {
        let res = await this.$store.dispatch("register", params);
        this.$refs.coverBG.style.backgroundColor = 'green'
        setTimeout(() => {
          alert("注册成功");
          this.$bus.$emit('resetunchoosed')
          this.close()
        }, 200);
      }
      catch (err) {
        this.$refs.coverBG.style.backgroundColor = 'red'
        if (err.message == 'CaptchaError') {
          setTimeout(() => {
            this.$refs.slidePic.style.left = 0
            this.$refs.slider.style.left = 0
            this.$refs.coverBG.style.width = 0
            this.$refs.coverBG.style.backgroundColor = 'rgba(99, 125, 255, 1)'
            this.getCapthcaPic()
          }, 200)
        } else {
          setTimeout(() => {
            alert(err.message);
            this.close()
          }, 100);
        }
      }
      // }
      // else {
      //     alert("用户名密码未填写或两次密码输入不相同");
      // }
    },
    async getCapthcaPic() {
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
      this.$refs.slidePic.style.top = result.posY + 'px'
    }
  },
  watch: {
    captchaShow(val) {
      if (val) {
        this.$refs.slidePic.style.left = 0
        this.$refs.slider.style.left = 0
        this.$refs.coverBG.style.width = 0
        this.$refs.coverBG.style.backgroundColor = 'rgba(99, 125, 255, 1)'

        document.onmousemove = this.sliderMove
        document.onmouseup = this.sliderMoveEnd
        this.getCapthcaPic()
      }

      if (!val) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.refresh {
  border: 1px solid #000;
  position: absolute;
  top: 0;
  right: 60px;
  cursor: pointer;
}

.close {
  border: 1px solid #000;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
}

.CaptchaContainer {
  position: relative;
  width: 300px;
  height: 240px;
  border: 5px;
}

.slidePic {
  position: absolute;
  left: 0px;
  top: 123px;
  z-index: 33;
}

.bn-container {
  position: absolute;
  left: 0px;
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