<template>
    <div class="container">
      <!-- 滑块的容器 -->

      <img src="@/assets/img/cropped.jpg" alt="">
      <img src="@/assets/img/slide.jpg" alt="" class="slidePic" ref="slidePic">

      <div class="bn-container"></div>
      <!-- 滑动时遮盖的颜色容器 -->
      <div class="coverBG"></div>
      <!-- 提示文本，层级在滑块容器和颜色容器之上 -->
      <div class="tip">向右滑动完成拼图</div>
      <!-- 滑块 -->
      <div class="slider" @mousedown="sliderMoveStart" ref="slider">>>></div>

    </div>
</template>

<script>
export default {
    name:'captcha',
    methods:{
        sliderMoveStart(){
            console.log(this.$refs.slidePic)
            
        },
        sliderMoveEnd(){
            console.log("end")
        }
    }
}
</script>

<style lang="less" scoped>
 
 
      .container {
        position: relative;
        width: 300px;
        height: 240px;
        /* border: 1px solid rgb(204, 203, 203); */
        // margin: 100px auto;
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
        /* background-color: #000; */
        
      }
      .coverBG {
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 0px;
        height: 36px;
        background-color: rgb(42, 235, 51);
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