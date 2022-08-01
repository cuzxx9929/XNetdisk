<template>
  <div id="main">
    <div class="title">X 云盘</div>
    <div class="container" v-show="!captchaShow">
      <div class="opt">
        <div :class="unchoosed == 1 ? 'unchoosed' : ''" @click="unchoosed = 2">
          登录
        </div>
        <div :class="unchoosed == 2 ? 'unchoosed' : ''" @click="unchoosed = 1">
          注册
        </div>
      </div>
      <div class="form" v-if="unchoosed == 2">
        <form>
          <div class="input-box">
            <input
              type="text"
              placeholder="请输入用户名"
              class="fm-text"
              v-model="username"
              
            />
          </div>
          <div class="input-box">
            <input
              type="password"
              placeholder="请输入密码"
              class="fm-text"
              v-model="pw"
            />
          </div>
          <div class="input-box">
            <!-- <button @click="login">登录</button> -->
            <button @click="changeCaptchaShow">登录</button>

          </div>
          <div class="check">
            <input type="checkbox" v-model="autoLogin" />下次自动登录
          </div>
        </form>
      </div>
      <div class="form" v-if="unchoosed == 1">
        <form>
          <div class="input-box">
            <input
              type="text"
              placeholder="请输入用户名"
              class="fm-text"
              v-model="username"
            />
          </div>
          <div class="input-box">
            <input
              type="password"
              placeholder="请输入密码"
              class="fm-text"
              v-model="pw"
            />
          </div>
          <div class="input-box">
            <input
              type="password"
              placeholder="请再次输入密码"
              class="fm-text"
              v-model="rpw"
            />
          </div>
          <div class="input-box">
            <button @click="register">注册</button>
            <!-- <button @click="changeCaptchaShow">注册</button> -->

          </div>
        </form>
      </div>
      
    </div>
    <captcha class="captcha" 
    v-show="captchaShow" 
    :username="username"
    :autoLogin="autoLogin" 
    :pw="pw" 
    :changeCaptchaShow="changeCaptchaShow" 
    :captchaShow="captchaShow"
    :unchoosed="unchoosed"
    >
    </captcha>
  </div>
</template>

<script>
import captcha from "@/components/captcha"

export default {
    name: "login",
    components: {captcha},
    data() {
        return {
            unchoosed: 2,
            autoLogin: true,
            username: "",
            pw: "",
            rpw: "",
            captchaShow:false
        };
    },
    watch: {
        unchoosed: {
            handler() {
                this.username = "";
                this.pw = "";
                this.rpw = "";
            },
        },
    },
    methods: {
        changeCaptchaShow(){
          this.captchaShow=!this.captchaShow
        },
        async login() {
            if (this.username != "" && this.pw != "") {
                var params = new URLSearchParams();
                params.append("username", this.username);
                params.append("password", this.pw);
                try {
                    await this.$store.dispatch("login", { params, autoLogin: this.autoLogin });
                    alert("登录成功");
                    this.$router.push("/home/folder");
                }
                catch (err) {
                    alert(err.message);
                }
            }
        },
        async register() {
            if (this.username != "" && this.pw != "" && this.rpw == this.pw) {
                var params = new URLSearchParams();
                params.append("username", this.username);
                params.append("password", this.pw);
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
        }
    },
};
</script>

<style lang="less">
#main {
  text-align: center;
  display: flex;
  flex-direction: column;
  background-color: #ECEFFF;
  height: 100vh;
  .captcha{
    position: absolute;
    top:195px;
    left:50%;
    transform: translateX(-50%);
  }
  
  .title {
    margin-top: 145px;
    height: 50px;
    font-family: STXingkai;
    font-size: 30px;
  }

  .container {
    height: 350px;
    width: 345px;
    background-color: #fff;
    margin: 0 auto;
    border-radius: 12px;
    display: flex;
    flex-direction: column;


    .opt {
      height: 55px;
      display: flex;

      div {
        flex: 1;
        padding: 14px 16px;
        font-size: 18px;
      }

      div:nth-child(1) {
        border-top-left-radius: 12px;
      }

      div:nth-child(2) {
        border-top-right-radius: 12px;
      }
    }

    .form {
      display: flex;
      flex-direction: column;

      .input-box {
        margin-top: 20px;
        padding: 0 22px;

        .fm-text {
          font-size: 14px;
          background: rgba(39, 39, 41, 0.04);
          border-radius: 8px;
          padding-left: 12px;
          width: 304px;
          border: 1px solid transparent;
          height: 46px;
        }

        .fm-text:focus {
          background-color: #fff;
          outline: 1px solid #dae0ff;
        }

        button {
          border-radius: 8px;
          width: 304px;
          border: 1px solid transparent;
          height: 46px;
          background-color: rgba(99, 125, 255, 0.75);
          font-size: 16px;
          color: #fff;
          cursor: pointer;
        }
      }

      .check {
        margin-top: 10px;
        padding: 0 22px;
        text-align: left;
        font-size: 12px;

        input {
          margin-right: 5px;
        }
      }
    }
  }
}
.unchoosed {
  color: rgba(37, 38, 43, 0.36);
  background: #f5f5f6;
  cursor: pointer;
}
</style>