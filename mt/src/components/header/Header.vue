<template>
  <div class="header">
    <!-- 顶部开始 -->

    <div class="top-wrapper">
			<div class="back-wrapper">
				<span class="icon-arrow_lift"></span>
			</div>

			<div class="search-wrapper">
				<span class="search-icon"></span>
				<input class="search-bar" type="text" placeholder="搜索店内商品" />
			</div>

			<div class="more-wrapper">
				<a class="spelling-btn" href="#">拼单</a>
				<div class="more-btn">
					<i class="s-radius"></i>
					<i class="s-radius"></i>
					<i class="s-radius"></i>
				</div>
			</div>
		</div>

    <!-- 顶部结束 -->


    <!-- 主题开始 -->

    <div class="content-wrapper">
			<div class="icon" :style="head_icon">
			</div>
			<div class="name">
				<h3>{{poiInfo.name}}</h3>
			</div>
			<div class="collect" @click="toggleCollect">
				<div class="collect-icon">
          <span class="icon-bg" v-show="isCollect"></span>
        </div>
				<span>{{collectStr}}</span>
			</div>
		</div>

    <!-- 主题结束 -->


    <!-- 公告开始 -->

    <div class="bulletin-wrapper" v-if="poiInfo.discounts2">
			<img class="icon"  :src="poiInfo.discounts2[0].icon_url" />
			<span class="text">
        {{poiInfo.discounts2[0].info}}
      </span>
			<div class="detail" @click="showDetail">
				{{poiInfo.discounts2.length}}个活动
				<span class="icon-keyboard_arrow_right"></span>
			</div>
		</div> 

    <!-- 公告结束 -->


    <!-- 背景开始 -->
    <div class="bg-wrapper" :style="head_bg">
		</div>
    <!-- 背景结束 -->


    <!-- 公告详情开始 -->

    <transition name="show-ani">
      <div class="bulletin-detail" v-show="isShow">
          <div class="detail-wrapper">
            <!-- 相关内容容器 -->
            <div class="main-wrapper" :style="detail_bg">
              <div class="icon" :style="head_icon"></div>
              <h3 class="name">{{this.poiInfo.name}}</h3>
              <!-- 星级评价 -->
              <div class="score">
                <span>
                  <app-star :score="poiInfo.wm_poi_score"></app-star>
                </span>
              </div>

              <p class="tip">
                {{this.poiInfo.shipping_fee_tip}} <i>|</i> {{this.poiInfo.min_price_tip}} <i>|</i> {{this.poiInfo.delivery_time_tip}}
              </p>

              <p class="time">
                配送时间: {{this.poiInfo.shipping_time}}
              </p>

              <div class="discounts" v-if="poiInfo.discounts2">
                <p>
                  <img :src="poiInfo.discounts2[0].icon_url" />
                  <span>{{poiInfo.discounts2[0].info}}</span>
                </p>
              </div>
            </div>

            <!-- 关闭内容容器 -->
            <div class="close-wrapper">
              <span class="icon-close" @click="closeDetail"></span>
            </div>
          </div>
      </div>
    </transition>
    
    <!-- 公告详情结束 -->
  </div> 
</template>

<script>
import Star from '../star/Star'
export default {
  props:{
    poiInfo:{
      type:Object,
      default:{}
    }
  },
  components:{
    "app-star": Star
  },
  data(){
    return({
      isShow: false,
      isCollect: false
    })
  },
  computed:{
    head_bg(){
      return "background-image: url(" + this.poiInfo.head_pic_url + ");"
    },
    head_icon(){
      return "background-image: url(" + this.poiInfo.pic_url + ");"
    },
    detail_bg(){
      return "background-image: url(" + this.poiInfo.poi_back_pic_url + ");"
    },
    collectStr(){
      return this.isCollect ? "已收藏" : "收藏"
    }
  },
  methods:{
    showDetail(){
      this.isShow = true;
    },
    closeDetail(){
      this.isShow = false;
    },
    toggleCollect(){
      this.isCollect = !this.isCollect;
    }
  }
}
</script>


<style scoped>

@import url(../../common/css/icon.css);

.header{
  height: 130px;
  padding-top: 20px;
}

/* 顶部样式 */
.header .top-wrapper {
	position: relative;
}
	
.header .top-wrapper .back-wrapper {
  width: 50px;
  height: 31px;
  position: absolute;
  left: 0;
  top: 0;
  text-align: center;
  line-height: 31px;
}

.header .top-wrapper .back-wrapper span {
  display: inline-block;
  color: white;
}

.header .top-wrapper .search-wrapper {
  width: 100%;
  height: 31px;
  padding: 0 104px 0 50px;
  box-sizing: border-box;
}

.header .top-wrapper .search-wrapper .search-icon {
  width: 28px;
  height: 31px;
  background: url(./img/search.png) no-repeat 11px center/13px 13px;
  position: absolute;
}

.header .top-wrapper .search-wrapper .search-bar {
  width: 100%;
  height: 31px;
  border: 0;
  box-sizing: border-box;
  background: #cdcdcc;
  border-radius: 25px;
  padding-left: 28px;
  /* 去除选中时蓝色边框*/
  outline: none;
}

.header .top-wrapper .more-wrapper {
  width: 65px;
  height: 24px;
  position: absolute;
  right: 0;
  top: 0;
  padding: 7px 15px 0 24px;
}

.header .top-wrapper .more-wrapper .spelling-btn {
  width: 30px;
  height: 17px;
  float: left;
  color: white;
  line-height: 17px;
  border: 1px solid white;
  text-align: center;
  text-decoration: none;
  font-size: 10px;
}

.header .top-wrapper .more-wrapper .more-btn {
  float: right;
  width: 20px;
  height: 24px;
  margin-left: 13px;
  margin-top: 6px;
}

.header .top-wrapper .more-wrapper .more-btn .s-radius {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  border: 1px solid white;
  display: block;
  float: left;
  margin-right: 1px;
}

/* 背景图片样式 */ 
.header .bg-wrapper {
    width: 100%;
    height: 150px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    background-size: 100% 135%;
		background-position: center -12px;
}

/* 主题内容 样式 */ 
.header .content-wrapper {
  padding: 17px 10px 11px;
  height: 50px;
}

.header .content-wrapper .icon {
  width: 50px;
  height: 50px;
  background-size: 135% 100%;
  background-position: center;
  border-radius: 5px;
  float: left;
}

.header .content-wrapper .name {
  float: left;
  padding: 18px 0 0 12px;
}

.header .content-wrapper .name h3 {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.header .content-wrapper .collect {
  width: 40px;
  height: 45px;
  float: right;
  text-align: center;
  padding-top: 6px;
}

.header .content-wrapper .collect .collect-icon {
  display: inline-block;
  width: 25px;
  height: 20px;
  background: url("./img/star.png") no-repeat 2px center/20px 20px;
}

.header .content-wrapper .collect .collect-icon .icon-bg{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ffbb22;
}

.header .content-wrapper .collect span {
  margin-top: 7px;
  color: white;
  font-size: 11px;
}

/* 公告内容样式 */
.header .bulletin-wrapper {
  height: 16px;
  padding: 0 10px;
}

.header .bulletin-wrapper .icon {
  width: 16px;
  height: 16px;
  float: left;
  margin-right: 6px;
}

.header .bulletin-wrapper .text {
  font-size: 11px;
  color: white;
  float: left;
  line-height: 16px;
}

.header .bulletin-wrapper .detail {
  color: white;
  float: right;
  font-size: 11px;
  line-height: 16px;
}

.header .bulletin-wrapper .detail span {
  font-size: 16px;
  line-height: 16px;
  float: right;
}

/* 公告详情 样式 */ 
.header .bulletin-detail {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background: rgba(98, 98, 98, 0.8);
		z-index: 999;
	}
	
	.header .bulletin-detail .detail-wrapper {
		width: 100%;
		height: 100%;
		padding: 43px 20px 125px;
		box-sizing: border-box;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper {
		width: 100%;
		height: 100%;
		background-size: 100% 100%;
		border-radius: 10px;
		text-align: center;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper .icon {
		width: 60px;
		height: 60px;
		background-size: 135% 100%;
		background-position: center;
		border-radius: 5px;
		display: inline-block;
		margin-top: 40px;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper .name {
		font-size: 15px;
		color: white;
		margin-top: 13px;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper .score {
		height: 10px;
		margin-top: 6px;
		text-align: center;
		font-size: 0;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper .score .star {
		display: inline-block;
		margin-right: 7px;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper .score span {
		display: inline-block;
		font-size: 10px;
		color: white;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper .tip {
		font-size: 11px;
		color: #bababc;
		margin-top: 8px;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper .tip i {
		margin: 0 7px;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper .time {
		font-size: 11px;
		color: #bababc;
		margin-top: 13px;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper .discounts {
		margin-top: 20px;
		padding: 0 20px;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper .discounts p {
		padding-top: 20px;
		border-top: 1px solid #BABABC;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper .discounts img {
		width: 16px;
		height: 16px;
		vertical-align: middle;
	}
	
	.header .bulletin-detail .detail-wrapper .main-wrapper .discounts span {
		font-size: 11px;
		line-height: 16px;
		color: white;
  }
  
  .header .bulletin-detail .detail-wrapper .close-wrapper {
		padding-top: 20px;
		height: 40px;
		text-align: center;
	}
	
	.header .bulletin-detail .detail-wrapper .close-wrapper span {
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  font-size: 14px;
  color: white;
  display: inline-block;
  background: rgba(118, 118, 118, 0.7);
  border: 1px solid rgba(140, 140, 140, 0.9);
}

/* 动画效果 */ 
.show-ani-enter-active,
.show-ani-leave-active {
  transition: .8s all;
}

.show-ani-enter,
.show-ani-leave-to {
  opacity: 0;
}

.show-ani-enter-to,
.show-ani-leave {
  opacity: 1;
}
</style>
