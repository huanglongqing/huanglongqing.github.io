<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll ref="shortcut" class="shortcut" :data="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key" v-show="hotKey">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="(item,index) in hotKey" :key="index" class="item" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @queryItem="addQuery" @deleteItem="deleteHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" :query="query" @listScroll="blurInput" @selected="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearAllHistories" text="是否清空所有搜索历史"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import Suggest from 'components/suggest/suggest'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {playlistMixin,searchMixin} from 'common/js/mixin'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    mixins: [playlistMixin, searchMixin],
    created(){
      this._getHotKey();
    },
    data(){
      return{
        hotKey: [],
      }
    },
    computed:{
      shortcut(){
        return this.hotKey.concat(this.searchHistory)
      },
      ...mapGetters([
        'playlist',
      ])
    },
    methods:{
      handlePlaylist(playlist){
        let bottom = playlist.length ? '60px' : '';

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      clearAllHistories(){
        this.clearAllSearchHistory();
      },
      showConfirm(){
        this.$refs.confirm.show();
      },
      _getHotKey(){
        getHotKey().then((res)=>{
          if(res.code === ERR_OK){
            this.hotKey = res.data.hotkey.slice(0, 10);
          }
        })
      },
      ...mapActions([
        'clearAllSearchHistory'
      ])
    },
    watch:{
      query(newQuery){
        if(!newQuery){
          this.$nextTick(()=>{
            this.$refs.shortcut.refresh();
          })
        }
      }
    },
    components: {
      SearchBox,
      Scroll,
      Suggest,
      SearchList,
      Confirm
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-d
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-background-d
            font-size: $font-size-medium
            color: $color-text-l
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-d
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>