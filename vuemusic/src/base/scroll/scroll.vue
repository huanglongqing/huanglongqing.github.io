<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
import { setInterval, setTimeout } from 'timers';

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullupRefresh: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted() {
      this.$nextTick(()=>{
        this._initScroll();
        // setInterval(this.refresh(),20000);
      })
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if(this.listenScroll){
          let _vue = this;
          this.scroll.on("scroll",(pos)=>{
            _vue.$emit("scroll", pos)
          })
        }
        if(this.pullupRefresh){
          this.scroll.on('scrollEnd',()=>{
            if(this.scroll.y <= (this.scroll.maxScrollY + 50)){
              this.$emit('readyScrollToEnd')
            }
          })
        }
        if(this.beforeScroll){
          this.scroll.on('beforeScrollStart',()=>{
            this.$emit('beforeScroll')
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable();
      },
      disable() {
        this.scroll && this.scroll.disable();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      }
    },
    watch: {
      data() {
        setTimeout(()=>{
          this.refresh();
        },this.refreshDelay)
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>