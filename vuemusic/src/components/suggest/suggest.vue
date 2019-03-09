<template>
  <scroll ref="suggest" class="suggest" :data="result" :pullupRefresh="pullupRefresh" @readyScrollToEnd="searchMore"
    :beforeScroll="beforeScroll" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="iconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getName(item)" :class="{'singer':isSinger(item)}"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result :title="noResultTitle"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong, isValidMusic, processSongsUrl} from 'common/js/song_constructor'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from 'common/js/singer_constructor'

  const TYPE_SINGER = 'singer'
  const PERPAGE = 20

  export default {
    props:{
      query: {
        type: String,
        default: ''
      },
      showSinger:{
        type: Boolean,
        default: true
      }
    },
    data(){
      return{
        page: 1,
        result: [],
        pullupRefresh: true,
        hasMore: true,
        noResultTitle: '暂无搜索结果',
        beforeScroll: true
      }
    },
    methods:{
      isSinger(item){
        return item.type === TYPE_SINGER
      },
      iconClass(item){
        if(this.isSinger(item)){
          return 'icon-mine'
        }else{
          return 'icon-music'
        }
      },
      getName(item){
        if(this.isSinger(item)){
          return `${item.singername} (歌手)---专辑:${item.albumnum} 单曲:${item.songnum}`
        }else{
          return `${item.name}-${item.singer}`
        }
      },
      searchMore(){
        if(!this.hasMore){
          return
        }else{
            this.page++;
            search(this.query, this.page, this.showSinger, PERPAGE).then((res)=>{
            if(res.code === ERR_OK){
              this._genResult(res.data).then((result) => {
                this.result = this.result.concat(result);
              })
              this._checkMore(res.data);
            }
          })
        }
      },
      selectItem(item){
        if(this.isSinger(item)){
          let singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        }else{
          this.insertSong(item)
        }
        this.$emit('selected')
      },
      refresh(){
        this.$refs.suggest.refresh();
      },
      listScroll(){
        this.$emit('listScroll')
      },
      _search(){
        this.hasMore = true;
        this.page = 1;
        this.$refs.suggest.scrollTo(0, 0);
        search(this.query, this.page, this.showSinger, PERPAGE).then((res)=>{
          if(res.code === ERR_OK){
            this._genResult(res.data).then((result) => {
              this.result = result;
              console.log(this.result)
            })
            this._checkMore(res.data);
          }         
        })
      },
      _checkMore(data){
        let song = data.song;
        if(!song.list.length || (song.curnum + song.curpage * PERPAGE) >= song.totalnum){
          this.hasMore = false;
        }
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid && this.page === 1) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          return ret
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    components:{
      Scroll,
      Loading,
      NoResult
    },
    watch:{
      query(newQuery){
        if (!newQuery) {
          this.result = [];
          return;
        }
        this._search();
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
          &.singer
            color: $color-text-l
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>