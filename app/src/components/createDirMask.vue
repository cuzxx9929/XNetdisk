<template>
  <div class="mask">
    <div class="box" @click.stop="">
      <div class="tittle">
        <p>新建文件夹</p>
        <div
          class="close iconfont"
          @click="
            dirname = '';
            $bus.$emit('hidemask');
          "
        >
          &#xeaf2;
        </div>
      </div>
      <div class="info">
        <img
          src="@/assets/img/dir.png"
          alt=""
          style="width: 115px; height: 90px; margin-bottom: 35px"
        />
        <form>
          <input
            type="text"
            placeholder="新建文件夹"
            v-model="dirname"
            class="fm-text"
            required
          />
        </form>
        <button @click="addDir">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import { DirCreate } from "@/api";
export default {
  name: "createDirMask",
  data() {
    return {
      dirname: "",
    };
  },
  methods: {
    async addDir() {
      if(this.dirname==''){
        alert('文件名不能为空')
        return 
      }
      let params = new URLSearchParams();
      params.append("dirname", this.dirname);
      if (this.$route.params.did === undefined) {
        params.append("did", "/");
      } else params.append("did", this.$route.params.did);
      let res = await DirCreate(params);
      if (res.status == 0) alert("新建文件夹成功");
      else alert(res.message);
      this.dirname = '';
      this.$bus.$emit('hidemask');
      this.$bus.$emit('reget');

    },
  },
};
</script>

<style lang="less" scoped>
.mask {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  .box {
    height: 330px;
    width: 340px;
    border-radius: 10px;
    background-color: #fff;
    margin-top: 100px;
    position: relative;
    padding: 20px;

    .tittle {
      display: flex;
      margin-bottom: 30px;
      p {
        height: 24px;
        font-size: 16px;
        margin-right: 20px;
        flex: 1;
      }

      .close {
        flex: 0 0 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.6);
        transition: 0.2s;
        &:hover {
          background-color: #f5f5f6;
          color: #000;
        }
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      .fm-text {
        font-size: 14px;
        background: rgba(39, 39, 41, 0.04);
        border-radius: 8px;
        padding-left: 12px;
        width: 304px;
        border: 1px solid transparent;
        height: 46px;
        margin-bottom: 24px;
        &:focus {
          outline: 1px solid #dae0ff;
        }
      }
      button {
        border-radius: 6px;
        width: 60px;
        border: 1px solid transparent;
        height: 30px;
        background-color: rgba(99, 125, 255, 0.9);
        font-size: 16px;
        color: #fff;
        cursor: pointer;
        align-self: flex-end;

        &:hover {
          background-color: rgba(99, 125, 255, 0.75);
        }
      }
    }
  }
}
</style>