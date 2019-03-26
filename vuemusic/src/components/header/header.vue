<template>
  <div class="header">
    <div class="icon"></div>
    <h1 class="text">LQ Music</h1>
    <router-link to='/user' class="mine" tag="div">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .header
    position: relative
    box-sizing: border-box 
    height: 44px
    text-align: center
    background-color: $color-theme
    color: $color-background
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 32px
      height: 32px
      margin-right: 9px
      bg-image('logo')
      background-repeat: no-repeat
      background-size: 30px 32px
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-background
</style>