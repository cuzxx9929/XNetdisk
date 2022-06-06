<template>
  <div class="mask">
    <div class="fileInfo" @click.stop="">
      <div class="tittle">
        <p class="filename">{{fileinfo.filename.info}}</p>
        <div class="close iconfont " @click="$bus.$emit('hidemask')">&#xeaf2;</div>
      </div>
      <div class="info-item" v-for="(item,index) in fileinfo" :key="index">
        <p class="item-name">{{item.cn}}</p>
        <p class="item-content">
          {{item.info}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "fileInfoMask",
  data(){
      return {
          fileinfo:{
            filename:{
                cn:'文件名',
                info:''
            },
            type:{
                cn:'文件类型',
                info:''
            },
            size:{
                cn:'文件大小',
                info:''
            },
            time:{ 
                cn:'创建时间',
                info:''
            },
          },
      }
  },
  mounted(){
      this.$bus.$on('showFileInfo',(info)=>{
          for(const el in info)
          {
            if(this.fileinfo[el])
            this.fileinfo[el].info = info[el]
          }
      })
  }
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

  .fileInfo {
    width: 320px;
    height: 400px;
    background-color: #fff;
    border-radius: 5px;
    margin-top: 100px;
    position: relative;
    padding: 20px;
    .tittle {
      display: flex;
        margin-bottom: 30px;
      .filename {
        height: 24px;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 20px;
        flex:1;
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

    .info-item {
    
    
      .item-name {
        font-size: 14px;
        margin-bottom: 10px;
        color: rgba(0, 0, 0, 0.7);
      }

      .item-content {
          width:100%;
        font-size: 12px;
        margin-bottom: 20px;
        color: #000;
        word-break: break-all;
      }
    }
  }
}
</style>

