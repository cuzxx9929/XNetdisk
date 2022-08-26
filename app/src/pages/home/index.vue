<template>
  <div @click="hideAll">
    <fileInfoMask v-show="filemaskShow"></fileInfoMask>
    <createDirMask v-show="dirmaskShow"></createDirMask>
    <div
      class="main"
      @dragover="dropoverhandller($event)"
      @drop="drophanddler($event)"
    >
      <div class="sidebar" ref="sidebar">
        <p class="xtitle"> X 云盘</p>
        <ul class="menu">
          <li
            v-for="item in menu"
            :key="item.name"
            :class="['menu-item', curtype == item.type ? 'chosed' : '']"
            @click="typeChange(item.type)"
          >
            <i class="iconfont icon" v-html="item.icon"></i>
            {{ item.info }}
          </li>
        </ul>
        <div class="blank"></div>
        <div
          class="userinfo"
          @click.stop="showButton($event)"
          @focus="hideButton()"
        >
          <div>
            {{ $store.state.user.username || "未登录，开发用" }}
          </div>
          <button ref="exitbutton" @click="logout" v-show="logOutButtonShow">
            退出登录
          </button>
        </div>

        <div class="hide iconfont" @click="sidebarChange" v-html="hideicon"></div>
      </div>

      <div class="details">
        <div class="header">

          <div class="type" :style="dirRoute.length>0?'color: rgba(0,0,0,0.5);':''" @click="backtoFolder"> 
            {{$route.params.type}}
          </div>


          <div class="card-list">
            <card v-for="item in dirRoute" :key="item.id" :info="item" :last="item.id==did"></card>        
          </div>

          <div class="iconfont opt-icon" @click="deletechosed" v-show="curtype=='folder'"><p>&#xec7b;</p></div>
          <div class="iconfont opt-icon"    
           @mouseleave="$refs.optlist.style.display = 'none';"
           v-show="curtype=='folder'"
            >
            <p @click="showOptList">&#xe657;</p>
            <ul class="opt-list" ref="optlist">
              <li @click.stop="adddir">新建文件夹</li>
              <li @click="uploadBtnClick">
                上传文件
                 <input
                    type="file"
                    ref="uploadfile"
                    :v-model="file"
                    @change="upload"
                    style="display: none"
                  />
                </li>
            </ul>
          </div>
        </div>

        <div class="options">
          <input type="checkbox" @click="allchoose" v-model="allchosed" />共{{
            fileInfo.length+dirInfo.length
          }}项
        </div>

        <div class="files">
        <!-- 文件夹 -->
          <file
            class="file"
            v-for="item in dirInfo"
            :key="item.id"
            :info="item"
            ftype="dir"
          ></file>

        <!-- 文件 -->
          <file
            class="file"
            v-for="item in fileInfo"
            :key="item.fid"
            :info="item"
            ftype="file"
          ></file>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import file from "@/components/file";
import fileInfoMask from "@/components/fileInfoMask";
import createDirMask from "@/components/createDirMask";
import card from "@/components/card";

import { FileUpload,DirRoute,DirDelete } from "@/api";

export default {
  components: { file, fileInfoMask, createDirMask, createDirMask,card },
  name: "home",
  data() {
    return {
      menu: [
        { type: "folder", info: "文件" ,icon:"&#xe631;"},
        { type: "text", info: "文档",icon:"&#xe66b;" },
        { type: "audio", info: "音乐" ,icon:"&#xe600;"},
        { type: "image", info: "图片" ,icon:"&#xe63e;"},
        { type: "video", info: "视频" ,icon:"&#xeafb;"},
      ],
      logOutButtonShow: false,
      sidebarShow: true,
      filemaskShow: false,
      dirmaskShow: false,
      file: {},
      did: "",
      curtype: "",
      dirRoute:[],
      hideicon:'&#xe66c;'
    };
  },
  mounted() {
    this.$bus.$on("showFileInfo", () => {
      this.filemaskShow = true;
    });
    this.$bus.$on("hidemask", () => {
      this.filemaskShow = false;
      this.dirmaskShow = false;
    });
    this.$bus.$on("reget", () => {
      // console.log("reget");
      this.getAllinfo();
    });
    if(this.$route.params.did!=undefined)
      this.did = this.$route.params.did;
    else
      this.did = '/'
    this.curtype = this.$route.params.type;
    this.getAllinfo();
    if(this.$route.params.type=='folder')
      this.getDirRoute()
  },
  methods: {
    showOptList() {
      this.$refs.optlist.style.display = "block";
    },
    backtoFolder(){
      if(this.dirRoute.length>0)
        this.$router.push('/home/folder')
    },
    async getDirRoute(){
      let params = new URLSearchParams()
      params.append('id',this.did)
      let res = await DirRoute(params)
      if (res.status=='0'){
        this.dirRoute = res.data
      }else{
        alert(res.message)
      }
    },
    getAllinfo(){
      this.getFileInfo();
      if(this.curtype=="folder")
        this.getDirInfo();
    },
    async getDirInfo() {
      let params = new URLSearchParams();
      params.append("type", this.curtype);
      if (this.did === undefined) {
        params.append("id", "/");
      } else params.append("id", this.did);
      try {
        await this.$store.dispatch("getdirInfo", params);
      } catch (err) {
        alert(err.message);
      }
    },
    adddir() {

      this.dirmaskShow = true;
    },
    async getFileInfo() {
      let params = new URLSearchParams();
      params.append("type", this.curtype);
      if (this.did === undefined) {
        params.append("did", "/");
      } else params.append("did", this.did);
      try {
        await this.$store.dispatch("getFileInfo", params);
        // alert('文件信息获取成功')
      } catch (err) {
        alert(err.message);
      }
    },
    dropoverhandller(e) {
      e.preventDefault();
    },
    async drophanddler(e) {
      var files = e.dataTransfer.files;
      e.preventDefault();
      for (const file of files) {
        if (file.size > 50 * 1024 * 1024) {
          alert("文件不能超过50MB");
          continue;
        }
        let formdata = new FormData();
        formdata.append("did", this.did);
        formdata.append("file", file);
        let res = await FileUpload(formdata);
        if (res.status == 0) {
          continue;
        } else {
          alert(res.message);
        }
      }
      this.getFileInfo();
    },
    allchoose() {
      if (!this.allchosed) this.$store.commit("chooseAll");
      else this.$store.commit("deleteAll");
    },
    uploadBtnClick() {
      this.$refs.uploadfile.click();
    },
    async upload() {
      if (this.$refs.uploadfile.files.length > 0) {
        let file = this.$refs.uploadfile.files[0];
        if (file.size > 50 * 1024 * 1024 ) {
          alert("文件不能超过50MB");
          return;
        }
        let formdata = new FormData();
        formdata.append("file", file);
        formdata.append("did", this.did);
        let res = await FileUpload(formdata);
        if (res.status == 0) {
          alert("文件上传成功");
          this.getFileInfo();
        } else {
          alert(res.message);
        }
        this.$refs.uploadfile.value = "";
      }
    },
    sidebarChange() {
      this.sidebarShow = !this.sidebarShow;
      if (!this.sidebarShow){
        this.$refs.sidebar.style.cssText =
          "  width: 0px;  transition: width .3s ease-in;";
        setTimeout(() => {
          this.hideicon='&#xe8f1;'
        }, 300);
        

      }
      else{
        setTimeout(() => {
          this.hideicon='&#xe66c;'
        }, 300);

        this.$refs.sidebar.style.cssText =
          "  width: 240px;  transition: width .3s ease-in;";
      }
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
    typeChange(type) {
      if (type !== this.curtype||this.dirRoute.length>0) this.$router.push(`/home/${type}`);
    },
    showButton(e) {
      this.logOutButtonShow = true;
      let str = `left:${e.offsetX}px; top:${e.offsetY}px;`;
      this.$refs.exitbutton.style.cssText = str;
    },
    hideAll() {
      this.logOutButtonShow = false;
      this.filemaskShow = false;
      this.dirmaskShow = false;
    },
    async deletechosed() {
      if (this.$store.state.file.chosedfile.length == 0 && this.$store.state.file.choseddir.length == 0) {
        alert("没有选中文件或文件夹");
      } else {
        if(this.$store.state.file.chosedfile.length != 0){
          let params = new URLSearchParams();
          params.append("list", this.$store.state.file.chosedfile);
          params.append("did", this.did);
          try {
            await this.$store.dispatch("deleteFile", params);
            alert("文件删除成功");
          } catch (err) {
            alert(err.message);
          }
        }
        if(this.$store.state.file.choseddir.length != 0){
          let params = new URLSearchParams();
          for(const id of this.$store.state.file.choseddir){
            params.set('id',id)
            let res = await DirDelete(params);
            if (res.status == 0) {
              continue
            } else {
              alert(res.message);
            }
          }
        }
        this.getAllinfo()
      }
    },

  },
  computed: {
    fileInfo() {
      return this.$store.state.file.fileInfo;
    },
    allchosed() {
      if (
        this.$store.state.file.fileInfo.length == this.$store.state.file.chosedfile.length &&
        this.$store.state.file.dirInfo.length == this.$store.state.file.choseddir.length &&
        (this.$store.state.file.chosedfile.length != 0 || this.$store.state.file.dirInfo.length !=0)
      )
        return true;
      else return false;
    },
    dirInfo(){
      return this.$store.state.file.dirInfo;
    }
  },
  watch: {
    $route(oldval, newval) {
      if(this.$route.params.did!=undefined)
        this.did = this.$route.params.did;
      else 
        this.did = '/'
      this.curtype = this.$route.params.type;
      this.$store.commit("set_dirInfo",[]); 
      this.$store.commit("deleteAll"); 
      this.getDirRoute()
      this.getAllinfo();
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  display: flex;

  .sidebar {
    width: 240px;
    flex-shrink: 0;
    background-color: #f5f5f6;
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    &:hover .hide{
        opacity: 1;
    }
    .xtitle{
      font-family: STXingkai;
      font-size: 30px;
    }

    .hide {
      color: rgba(0,0,0,0.5);
      z-index: 5;
      font-size: 50px;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(100%, -50%);
      // border: 1px solid black; //后面删除
      cursor: pointer;
      opacity: 0;
      transition: .2s;
    }

    p {
      text-align: center;
      width: 240px;
      font-size: 16px;
      height: 86px;
      padding: 30px 24px;
    }

    .menu {
      display: flex;
      flex-direction: column;
      align-items: center;

      .menu-item {
        text-align: left;
        padding-left: 40px;
        width: 216px;
        height: 44px;
        // background-color: #fff;
        border-radius: 10px;
        line-height: 44px;
        font-size: 14px;
        cursor: pointer;

        &:hover {
          transition: 0.2s;
          background-color: #ececee;
        }

        .icon{
          font-size: 16px;
          margin-right: 10px ;
        }
      }
    }

    .blank {
      flex: 1;
    }

    .userinfo {
      text-align: center;
      border-top: 2px solid #e3e3e5;
      flex: 0 0 100px;

      cursor: pointer;
      line-height: 100px;

      position: relative;

      button {
        z-index: 5;
        position: absolute;

        border-radius: 3px;
        width: 100px;
        height: 30px;
        border: none;
        background-color: #fff;
        box-shadow: 0 0 5px rgba(28, 28, 32, 0.8);
        cursor: pointer;
      }
    }
  }

  .details {
    transition: 0.2s;
    flex: 1;
    background-color: #fff;
    position: relative;
    height: 100vh;
    padding-top: 28px;
    overflow-y: scroll;

    .header {
      padding: 0 40px;
      margin-bottom: 24px;
      font-size: 22px;
      font-weight: 400;
      display: flex;

      .opt-icon{
        font-size: 22px;
        margin-left: 16px;
        line-height: 30px;
        position:relative;
        cursor: pointer;
        vertical-align: bottom;
        &:hover>p{
          color: #7B8FFB;
        }
      }
      .type{ 
        cursor: pointer;
        line-height: 30px;

      }
      .card-list{ 
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      .opt-list {
        font-size:16px;
        position: absolute;
        right: 0;
        width: 110px;
        text-align: left;
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.5);
        background-color: #fff;
        z-index: 5;
        display: none;
        transition: .2s;

        li {
          padding: 5px 5px;
          border-radius: 5px;

          &:hover {
            background-color: #f5f5f6;
          }
        }
      }
    }

    .options {
      padding: 0 40px;
      margin-bottom: 10px;
    }

    .files {
      display: flex;
      padding: 10px 0 0 50px;
      width: 100%;
      flex-wrap: wrap;
      .file {
        margin: 0 50px 40px 0;
      }
    }
  }
}

.chosed {
  background-color: #e3e3e5;
}
</style>