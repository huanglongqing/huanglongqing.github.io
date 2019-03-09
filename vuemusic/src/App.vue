<template>
  <div id="app">
    <app-header></app-header>

    <app-tab></app-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Header from 'components/header/header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
  components:{
    "app-header": Header,
    "app-tab": Tab,
    Player
  }
}
</script>

<style>

</style>
