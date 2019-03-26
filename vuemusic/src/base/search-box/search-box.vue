<template>
  <div class="search-box" @click="focus">
    <i class="icon-search"></i>
    <input ref="inputBox" class="box" :placeholder="placeholder" v-model="query" />
    <i class="icon-dismiss" v-show="query" @click.stop="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from 'common/js/util'
  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      focus(){
        this.$refs.inputBox.focus();
      },
      clear(){
        this.query = '';
      },
      setQuery(query){
        this.query = query;
      },
      blur(){
        this.$refs.inputBox.blur();
      }
    },
    created(){
      this.$watch('query', debounce((newQuery)=>{
        this.$emit('query', newQuery);
      }, 300));
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-background-d
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-text-d
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-background-d
      color: $color-text-d
      outline-color: $color-theme
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-l
    .icon-dismiss
      font-size: 16px
      color: $color-text-d
</style>