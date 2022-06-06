<template>
  <div class="carditem">
      <div class="next">></div>
      <div class="dirname" @click="changeDir" :style="last?'color:#000;':''">{{info.dirname}}</div>
  </div>
</template>

<script>
export default {
    name:'card',
    props:['info','last'],
    methods:{
        changeDir(){
            if(!this.last)
                this.$router.push(`/home/folder/${this.info.id}`)
            // alert(this.info.id)
        }
    }
}
</script>

<style lang="less" scoped>
    .carditem{
        display: flex;
        color: rgba(0,0,0,0.5);
        .next{ 
            padding: 0 10px;
        }
        .dirname{ 
            &:hover{
                cursor: pointer;
                color:#748BFB;
            }
        }
    }
</style>