<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="list_group">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item,index_1) in group.items" :key="index_1" class="list-group-item" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-title-cut" @touchstart.stop.prevent="onTitleCutTouchStart" 
          @touchmove.stop.prevent="onTitleCutTouchMove"
          @touchend.stop="onTitleCutTouchEnd"
          >
      <ul>
        <li v-for="(item,index) in titleCutArr" 
        :key="index" class="item" :data-index="index" :class="{'current':curCutIndex===index}">{{item}}
        <div class="bigTitle" v-show="curCutIndex===index&&bigTShow">{{item}}</div>
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'
  import { setTimeout, clearTimeout } from 'timers';

  const TITLE_HEIGHT = 30
  const CUT_HEIGHT = 18

  export default {
    created(){
      this.touch = {};   //不需要监控变化，不需要定义在data
      this.listenScroll = true;
      this.heightList = [];
      this.probeType = 3;
      this.touchTimer = null;
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data(){
      return{
        scrollY: 0,
        curCutIndex: 0,
        bigTShow: false,
        diff: 0    //title区块上限和fixedtitle的偏移差
      }
    },
    components: {
      Scroll,
      Loading
    },
    computed: {
      titleCutArr(){
        return this.data.map((group)=>{
          return group.title.substr(0, 1);
        })
      },
      fixedTitle(){
        if(this.scrollY > 0){
          return ""
        }
        return this.data[this.curCutIndex] ? this.data[this.curCutIndex].title : ""
      }
    },
    methods: {
      onTitleCutTouchStart(e){
        this.touchTimer = setTimeout(()=>{
          this.bigTShow = true;
        },150)        
        let cutIndex = getData(e.target, "index");
        let firstTouch = e.touches[0]; //第一次触碰的手指位置
        this.touch.y1 = firstTouch.pageY;
        this.touch.cutIndex = cutIndex;
        this._scrollTo(cutIndex);
      },
      onTitleCutTouchMove(e){
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        let delta = (this.touch.y2 - this.touch.y1)/CUT_HEIGHT | 0;  //或0相当于向下取整
        let cutIndex = parseInt(this.touch.cutIndex) + delta;
        this._scrollTo(cutIndex);
      },
      onTitleCutTouchEnd(){
        clearTimeout(this.touchTimer);
        this.bigTShow = false;
      },
      scroll(pos){
        this.scrollY = pos.y;
      },
      selectItem(item){
        this.$emit('select',item);
      },
      refresh(){
        this.$refs.listview.refresh();
      },
      _scrollTo(index){
        this.$refs.listview.scrollToElement(this.$refs.list_group[index], 0);
      },
      _calcHeight(){
        this.heightList = [];
        const list = this.$refs.list_group;
        let height = 0;
        this.heightList.push(height);
        for(let i = 0; i < list.length; i++){
          height += list[i].clientHeight;
          this.heightList.push(height);
        }
      }
    },
    watch:{
      data(){
        this.$nextTick(()=>{
          this._calcHeight();
        })
      },
      scrollY(newY){
        const heightList = this.heightList;
        let y = newY>0 ? 0 : -newY;
        for(let i = 0; i < heightList.length-1; i++){
          let height1 = heightList[i],
              height2 = heightList[i+1];
          if(y>=height1 && y<height2){
            this.curCutIndex = i;
            this.diff = height2 - y;
            return;
          }
        }
      },
      diff(nVal){
        let fixedTop = (nVal>0 && nVal<TITLE_HEIGHT) ? nVal - TITLE_HEIGHT : 0
        if(this.fixedTop === fixedTop){
          return;
        }
        this.fixedTop = fixedTop;
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
      }
    }

  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 10px 0 10px 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-title-cut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        position: relative
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
        .bigTitle
          position: absolute
          left: -40px
          top: -5px
          width: 30px
          height: 30px
          border-radius: 50%
          text-align: center
          line-height: 30px
          background: $color-dialog-background
          color: $color-theme
          font-size: $font-size-large
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
