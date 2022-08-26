<template>
  <div
    id="file"
    @mouseenter="actionbtnShow = true"
    @mouseleave="
      actionbtnShow = false;
      $refs.menu.style.display = 'none';
    "
    @click="choose"
    @dblclick="selectDir"
  >
    <transition-group name="trans" class="action-btn">
      <div class="choose-btn btn" v-show="actionbtnShow || chosed" key="1">
        <div
          class="circle"
          :style="
            chosed
              ? `background-color: #7990ff; border: 2px solid #7990ff;`
              : ''
          "
        ></div>
      </div>
      <div
        class="info-btn btn"
        v-show="actionbtnShow"
        key="2"
        @click.stop="showmenu"
      >
        ...
        <ul class="menu" ref="menu">
          <li @click.stop="showinfo" v-if="this.ftype == 'file'">详细信息</li>
          <li @click.stop="downloadfile" v-if="this.ftype == 'file'">下载</li>
          <li @click.stop="deletefile">删除</li>
        </ul>
      </div>
    </transition-group>

    <!-- <img :src="`@/assets/img/${ftype}.png`" alt="" /> -->
    <img
      :src="require(`@/assets/img/${ftype}.png`)"
      alt=""
      :class="`${ftype}`"
    />

    <p class="name">{{ info.filename || info.dirname }}</p>
    <p class="time">{{ info.time }}</p>
  </div>
</template>

<script>
import { FileDownload, DirDelete } from "@/api";
export default {
  name: "file",
  props: ["info", "ftype"],
  data() {
    return {
      actionbtnShow: false,
      doubleClickTimer: null,
    };
  },
  computed: {
    chosed() {
      if (this.ftype == "file") {
        if (this.$store.state.file.chosedfile.indexOf(this.info.fid) >= 0)
          return true;
        else return false;
      } else {
        if (this.$store.state.file.choseddir.indexOf(this.info.id) >= 0)
          return true;
        else return false;
      }
    },
  },
  methods: {
    selectDir() {
      // if(doubleClickTimer)
      //   clearTimeout(doubleClickTimer)
      if(this.ftype =='dir')
        this.$router.push(`/home/folder/${this.info.id}`);
    },
    async downloadfile() {
      let params = new URLSearchParams();
      params.append("fid", this.info.fid);
      if(this.$route.params.did!=undefined)
        params.append("did", this.$route.params.did);
      else
        params.append("did", '/');

      let res = await FileDownload(params);
      let blob = new Blob([res]);
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = this.info.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    choose() {
      // doubleClickTimer = setTimeout(()=>{
      if (!this.chosed) {
        this.$store.commit(
          "add_chosed" + this.ftype,
          this.info.fid === undefined ? this.info.id : this.info.fid
        );
      } else {
        this.$store.commit(
          "delete_chosed" + this.ftype,
          this.info.fid === undefined ? this.info.id : this.info.fid
        );
      }
      // },300)
    },
    async deletefile() {
      if (this.ftype == "file") {
        const params = new URLSearchParams();
        params.append("list", [this.info.fid]);
        params.append("did", "/");
        try {
          await this.$store.dispatch("deleteFile", params);
          alert("文件删除成功");
          this.$bus.$emit("reget");
        } catch (err) {
          alert(err.message);
        }
      } else {
        // console.log('dir delete')
        const params = new URLSearchParams();
        params.append("id", this.info.id);
        let res = await DirDelete(params);
        if (res.status == 0) {
          alert('文件夹删除成功')
          this.$bus.$emit("reget");
        } else {
          alert(res.message);
        }
      }
    },
    showinfo() {
      this.$bus.$emit("showFileInfo", this.info);
    },
    showmenu() {
      this.$refs.menu.style.display = "block";
    },
  },
};
</script>

<style lang="less" scoped>
#file {
  width: 120px;
  height: 170px;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  position: relative;
  &:hover {
    background-color: #f5f5f6;
  }

  .action-btn {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;

    .choose-btn {
      margin: 4px 0 0 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      .circle {
        height: 16px;
        width: 16px;
        border-radius: 16px;
        border: 2px solid #f5f5f6;

        &:hover {
          border: 2px solid #7990ff;
        }
      }
    }

    .info-btn {
      margin: 4px 4px 0 0;
      position: relative;
      .menu {
        position: absolute;
        left: 0;
        top: 24px;
        width: 110px;
        text-align: left;
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.5);
        background-color: #fff;
        z-index: 5;
        display: none;

        li {
          padding: 5px 5px;
          border-radius: 5px;

          &:hover {
            background-color: #f5f5f6;
          }
        }
      }
    }

    .btn {
      height: 24px;
      width: 24px;
      border-radius: 4px;
      background-color: #fff;
    }
  }

  .dir{
    height: 90px;
    // width: 115px;
    margin: 10px 0 10px 0;
  }

  .file {
    height: 90px;
    margin: 10px 0 10px 0;
  }

  .name {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .time {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
  }
}

.trans-enter-active,
.trans-leave-active {
  transition: 0.2s;
}

.trans-enter,
.trans-leave-to {
  opacity: 0;
}

.trans-enter-to,
.trans-leave {
  opacity: 1;
}
</style>