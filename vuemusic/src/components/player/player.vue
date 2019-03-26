<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdRotate">
                <img class="image" :src="currentSong.image" />
              </div>
            </div>               
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="curLyric && curLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="curLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': curLyricLineNum === index}"
                   v-for="(line,index) in curLyric.lines"
                   :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':curShow === 'cd'}"></span>
            <span class="dot" :class="{'active':curShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :barCanClick="barCanClick" :percent="percent" :fullScreen="fullScreen" @changePercent="changePercent" ref="progressBar"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableIcon">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableIcon">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableIcon">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="favoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdRotate" />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlay" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updataTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'
  import Playlist from 'components/playlist/playlist'
  import {playerMixin} from 'common/js/mixin'
  import {playMode} from 'common/js/config'
  import { setTimeout } from 'timers';

  const transform = prefixStyle('transform')
  const transition = prefixStyle('transition')

  export default {
    mixins: [playerMixin],
    data(){
      return{
        musicReady: false,
        currentTime: 0,
        radius: 32,
        curLyric: null,
        curLyricLineNum: 0,
        curShow: 'cd',
        playingLyric: '歌词加载中...',
        barCanClick: false
      }
    },
    created(){
      this.touch = {}
    },
    computed:{
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdRotate() {
        if(!this.musicReady){
          return ''
        }
        else{
          return this.playing ? 'rotate' : 'rotate pause'
        }        
      },
      disableIcon(){
        return this.musicReady ? '' : 'disable'
      },
      percent(){
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex',
      ])
    },
    methods:{
      //切换成迷你播放器
      back(){
        this.setFullScreen(false);
      },
      //切换大播放器
      open(){
        this.setFullScreen(true);
        this.$refs.progressBar.refresh();
        this.curShow = 'cd';
        let lyricStyle = this.$refs.lyricList.$el.style;
        let cdStyle = this.$refs.middleL.style;
        lyricStyle[transform] = `translate3d(0, 0, 0)`;
        cdStyle.opacity = 1;
      },
      //cd飞入动画
      enter(el,done){
        const {b2mX,b2mY,b2mScale} = this._getCDPosAndScale();

        let CDAnimation = {
          0: {
            transform: `translate3d(${b2mX}px, ${b2mY}px, 0) scale(${b2mScale})`
          },
          70: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation: CDAnimation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move' , done);
      },
      afterEnter(){
        animations.unregisterAnimation('move');
        this.$refs.cdWrapper.style.animation = '';
      },
      leave(el,done){
        this.$refs.cdWrapper.style.transition = 'all 0.4s';
        const {b2mX,b2mY,b2mScale} = this._getCDPosAndScale();
        this.$refs.cdWrapper.style[transform] = `translate3d(${b2mX}px, ${b2mY}px, 0) scale(${b2mScale})`;
        this.$refs.cdWrapper.addEventListener('transitionend', done);
      },
      afterLeave(){
        this.$refs.cdWrapper.style.transition = '';
        this.$refs.cdWrapper.style[transform] = '';
      },
      //切换播放/暂停
      togglePlay(){
        if(!this.musicReady){
          return;
        }
        this.setPlayingState(!this.playing);
        if(this.curLyric){
          this.curLyric.togglePlay();
        }
      },
      //上一首/下一首
      prev() { 
        if(this.playlist.length === 1){
          this.loop();
          return
        }         
        if(!this.musicReady){
          return;
        }
        this.currentTime = 0;
        if(this.curLyric){
          this.curLyric.stop();
          this.curLyric = null;
        }
        let index = this.currentIndex - 1;
        if(index < 0){
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        if(!this.playing){
          this.togglePlay();
        }
        this.musicReady = false;
      },
      next() {
        if(this.playlist.length === 1){
          this.loop();
          return
        }
        if(!this.musicReady){
          return;
        }
        this.currentTime = 0;
        if(this.curLyric){
          this.curLyric.stop();
          this.curLyric = null;
        }
        let index = this.currentIndex + 1;
        if(index > this.playlist.length - 1){
          index = 0;
        }
        this.setCurrentIndex(index);
        if(!this.playing){
          this.togglePlay();
        }
        this.musicReady = false;      
      },
      //播放结束
      end() {
        if(this.mode === playMode.loop){
          setTimeout(()=>{
            this.loop();
            this.$refs.audio.play();
          }, 0)
        }else{
          setTimeout(()=>{
            this.next();
            this.$refs.audio.play();
          }, 0)
        }
      },
      //单曲循环播放
      loop(){
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        if(this.curLyric){
          this.curLyric.seek(0);
        }
      },
      //歌曲加载就绪/出错
      ready() {
        this.musicReady = true;
        this.barCanClick = true;
        this.savePlayHistory(this.currentSong);
        if(this.curLyric){
          this.curLyric.play();
          this.curLyric.seek(this.currentTime * 1000)
        }
      },
      error() {
        this.musicReady = true;
        this.next();  //歌曲加载失败也不会影响按键的使用
      },
      //歌曲当前时间刷新
      updataTime(e) {
        this.currentTime = e.target.currentTime;
      },
      //格式化时间
      formatTime(time){
        let timeMin = Math.floor(time / 60);
        let timeSec = Math.floor(time % 60);
        let timeText = timeSec < 10 ?
            `${timeMin}: 0${timeSec}` :
            `${timeMin}: ${timeSec}`;
        return timeText;
      },
      //修改歌曲播放进度百分比
      changePercent(percent){
        let curTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = curTime;
        if(!this.playing){
          this.togglePlay();
        }
        if(this.curLyric){
          this.curLyric.seek(curTime * 1000);
        }
      },
      //获取歌词
      getLyric(){
        this.currentSong.getLyric().then((lyric)=>{
          if(this.currentSong.lyric !== lyric){
            return
          }
          this.curLyric = new Lyric(lyric, this.handleLyric);
          this.curLyric.seek(0);
          this.playingLyric = this.curLyric.lines.length ? this.curLyric.lines[0].txt : this.curLyric.lrc.slice(10);
          if(this.playing && this.musicReady){
            this.curLyric.play();
            setTimeout(()=>{
              if(this.playing){
                let curTime = this.$refs.audio.currentTime;
                this.curLyric.seek(curTime * 1000)
              }
            }, 20)
          }
        }).catch(()=>{
          this.curLyric = null;
          this.playingLyric = '获取歌词失败';
          this.curLyricLineNum = 0;
        })
      },
      //歌词处理函数
      handleLyric({lineNum, txt}){
        this.curLyricLineNum = lineNum;
        if(lineNum > 5){
          let highlightEl = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(highlightEl, 1000);
        }else{
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      //大播放器滑动事件
      middleTouchStart(e){
        this.touch.init = true;
        let touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
      },
      middleTouchMove(e){
        if(!this.touch.init){
          return
        }
        let touch = e.touches[0];
        let deltaX = touch.pageX - this.touch.startX;
        let deltaY = touch.pageY - this.touch.startY;
        if(Math.abs(deltaY) > 50){
          return
        }
        let lyricLeft = this.curShow === 'cd' ? 0 : -window.innerWidth;
        let offsetWidth = Math.min(0, Math.max(-window.innerWidth, lyricLeft + deltaX));
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
        let lyricStyle = this.$refs.lyricList.$el.style;
        let cdStyle = this.$refs.middleL.style;
        lyricStyle[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        lyricStyle[transition] = '';
        cdStyle.opacity = 1 - this.touch.percent;
        cdStyle[transition] = '';
      },
      middleTouchEnd(e){
        let offsetWidth, opacity
        if(this.curShow === 'cd'){
          if(this.touch.percent > 0.15){
            offsetWidth = -window.innerWidth;
            opacity = 0;
            this.curShow = 'lyric';
          }else{
            offsetWidth = 0;
            opacity = 1;
          }
        }else{
          if(this.touch.percent < 0.85){
            offsetWidth = 0;
            opacity = 1;
            this.curShow = 'cd';
          }else{
            offsetWidth = -window.innerWidth;
            opacity = 0;
          }
        }
        let lyricStyle = this.$refs.lyricList.$el.style;
        let cdStyle = this.$refs.middleL.style;
        lyricStyle[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        lyricStyle[transition] = 'all 0.3s';
        cdStyle.opacity = opacity;
        cdStyle[transition] = 'all 0.3s';
      },
      showPlaylist(){
        this.$refs.playlist.show();
      },
      //获取大cd和小cd的位置和缩放信息
      _getCDPosAndScale(){
        const minWidth = 40;
        const minLeft = 40;
        const minBottom = 30;
        const bigPaddingTop = 80;
        const bigWidth = window.innerWidth * 0.8;
        const b2mScale = minWidth / bigWidth;
        const b2mX = -(window.innerWidth / 2 - minLeft);
        const b2mY = window.innerHeight - bigPaddingTop - bigWidth / 2 - minBottom;
        return {b2mX,b2mY,b2mScale}
      },
      ...mapMutations({
          setFullScreen: 'SET_FULL_SCREEN'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    watch:{
      currentSong(newSong, oldSong){
        if(!newSong.id || !newSong.url || newSong.id === oldSong.id){
          return
        }
        this.barCanClick = false;
        this.currentTime = 0;
        if(this.curLyric){
          this.curLyric.stop();
          this.playingLyric = '歌词加载中...';
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
          this.getLyric();
          this.$refs.audio.play();
        }, 200)
      },
      playing(newState){
        this.$nextTick(()=>{
          const audio = this.$refs.audio;
          newState ? audio.play() : audio.pause();
        })
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      Playlist
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $play-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-background
            transform: rotate(-90deg)
        .title
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-background-d
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-background-d
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.rotate
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 15px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-background
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-background-d
              font-size: $font-size-medium
              &.current
                color: $color-theme
      .bottom
        position: absolute
        bottom: 30px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-dialog-background
            &.active
              width: 20px
              border-radius: 5px
              background: $color-background
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-background
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-background
            &.disable
              color: rgba(244, 244, 244, 0.3)
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-background
      box-shadow: 0 0 5px #999
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%   
          &.rotate
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
          
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>