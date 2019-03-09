<template>
  <div id="app">

    <!-- 头部 -->
      <app-header :poiInfo="poiInfo"></app-header>

    <!-- 导航 -->
      <app-nav :commentNum="commentNum"></app-nav>
      
    <!-- 内容 -->
      <div class="content">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>

  </div>
</template>

<script>
import Header from './components/header/Header'
import Nav from './components/nav/Nav'


export default {
  name: 'App',
  components: {
   "app-header": Header,
   "app-nav": Nav
  },
  data(){
    return({
      poiInfo:{},
      commentNum:0
    })
  },
  created(){
    fetch("/api/goods")
    .then(res => {
      return res.json()
    })
    .then(response=> {
      if(response.code === 0){
        this.poiInfo = response.data.poi_info;
      }
    });
     fetch("/api/ratings")
    .then(res => {
      return res.json()
    })
    .then(response=> {
      if(response.code === 0){
        this.commentNum = response.data.comment_num;
      }
    });
  }
}
</script>

<style>

</style>
