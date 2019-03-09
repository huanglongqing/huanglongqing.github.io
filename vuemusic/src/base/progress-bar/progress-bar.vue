<template>
  <div class="progress-bar-wrapper">
    <div class="progress-bar" ref="progressBar" @click="progressClick">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
          @touchstart.prevent="btnTouchStart" @touchmove.prevent="btnTouchMove" @touchend="btnTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

  const PRO_BTN_WIDTH = 16
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      },
      fullScreen: {
        type: Boolean,
        default: true
      }
    },
    created(){
      this.touch = {}
    },
    methods: {
      btnTouchStart(e){
        this.touch.init = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.proLeft = this.$refs.progress.clientWidth;
      },
      btnTouchMove(e){
        if(!this.touch.init){
          return;
        }
        let deltaX = e.touches[0].pageX - this.touch.startX;
        let offsetWidth = Math.min(Math.max(0, this.touch.proLeft + deltaX), this.$refs.progressBar.clientWidth - PRO_BTN_WIDTH);
        this._changeProAndBtn(offsetWidth);
      },
      btnTouchEnd(){
        this.touch.init = false;
        this._emitChangePercent();
      },
      progressClick(e){
        const rect = this.$refs.progressBar.getBoundingClientRect();
        if(rect.right - e.pageX < PRO_BTN_WIDTH / 6){
          return
        }
        const offsetWidth = e.pageX - rect.left - PRO_BTN_WIDTH / 2;
        this._changeProAndBtn(offsetWidth);
        this._emitChangePercent();
      },
      refresh(){
        this.$nextTick(()=>{
          let barWidth = this.$refs.progressBar.clientWidth - PRO_BTN_WIDTH;
          let offsetWidth = this.percent * barWidth;
          this._changeProAndBtn(offsetWidth);
        })
      },
      _changeProAndBtn(offsetWidth){
        this.$refs.progress.style.width = `${offsetWidth}px`;
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      },
      _emitChangePercent(){
        let barWidth = this.$refs.progressBar.clientWidth - PRO_BTN_WIDTH;
        let percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit('changePercent', percent);
      }
    },
    watch: {
      percent(newVal){
        if(!this.touch.init && this.fullScreen){
          let barWidth = this.$refs.progressBar.clientWidth - PRO_BTN_WIDTH;  //减掉btn宽避免到底遮挡时间
          let offsetWidth = newVal * barWidth;  
          this._changeProAndBtn(offsetWidth);
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar-wrapper
    height: 30px
    .progress-bar
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>