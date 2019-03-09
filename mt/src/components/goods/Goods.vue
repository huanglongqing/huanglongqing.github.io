<template>
  <div class="goods">
    <!-- 分类列表 -->
    <div class="menu-wrapper" ref="menu_scroll">
      <ul>
        <!-- 专场 -->
        <li class="menu-item" :class="{current:curIndex === 0}" @click="scrollTo(0)">
          <p class="text">
            <img class="icon" :src="special.tag_icon">
            {{special.tag_name}}
          </p>
        </li>
        <!-- 其他 -->
        <li
          class="menu-item"
          v-for="(good,index) in goods"
          :key="index"
          :class="{current:curIndex === index + 1}"
          @click="scrollTo(index + 1)"
        >
          <p class="text">
            <img class="icon" :src="good.icon" v-if="good.icon">
            {{good.name}}
          </p>
          <i class="num" v-show="calcCount(good.spus)">{{calcCount(good.spus)}}</i>
        </li>
      </ul>
    </div>
    <!-- 商品列表 -->
    <div class="foods-wrapper" ref="foods_scroll">
      <ul>
        <!-- 专场 -->
        <li class="container-list food-list-hook">
          <div v-for="(item,index) in special.operation_source_list" :key="index">
            <img :src="item.pic_url">
          </div>
        </li>
        <!-- 具体分类 -->
        <li class="food-list food-list-hook" v-for="(good,index) in goods" :key="index">
          <h3 class="title">{{good.name}}</h3>

          <!-- 具体的商品列表 -->
          <ul>
            <li class="food-item" v-for="(food,index) in good.spus" :key="index"
              @click="showDetail(food)"
            >
              <div class="icon" :style="food_icon(food.picture)"></div>
              <div class="content">
                <h3 class="name">{{food.name}}</h3>
                <p class="desc" v-if="food.description">{{food.description}}</p>
                <div class="extra">
                  <span class="saled">{{food.month_saled_content}}</span>
                  <span class="praise">{{food.praise_content}}</span>
                </div>
                <img class="product">
                <p class="price">
                  <span class="text">￥{{food.min_price}}</span>
                  <span class="unit">/{{food.unit}}</span>
                </p>
              </div>
              <!-- 商品数量控制 -->
              <div class="countcontrol-wrapper">
                <app-countcontrol :food="food"></app-countcontrol>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- 购物车 -->
    <app-shopcart :poiInfo="poiInfo" :cartList="calcCartList"></app-shopcart>

    <!-- 商品详情 -->
    <app-fooddetail :food="detail_food" ref="food_detail"></app-fooddetail>

  </div>
</template>

<script>
import BScroll from "better-scroll";
import CountControl from "../countControl/CountControl";
import ShopCart from "../shopCart/ShopCart";
import FoodDetail from "../foodDetail/FoodDetail";
export default {
  components: {
    "app-countcontrol": CountControl,
    "app-shopcart": ShopCart,
    "app-fooddetail": FoodDetail
  },
  data() {
    return {
      special: {},
      goods: [],
      poiInfo: {},
      menuScroll: {},
      foodsScroll: {},
      heightList: [],
      scrollY: 0,
      menuIndex: 0,
      detail_food:{}
    };
  },
  created() {
    fetch("/api/goods")
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.code === 0) {
          this.special = response.data.container_operation_source;
          this.goods = response.data.food_spu_tags;
          this.poiInfo = response.data.poi_info;

          this.$nextTick(() => {
            this.initScroll();
            this.calcHeight();
          });
        }
      });
  },
  methods: {
    food_icon(imgName) {
      return "background-image: url(" + imgName + ");";
    },
    initScroll() {
      this.menuScroll = new BScroll(this.$refs.menu_scroll, {
        click: true
      });

      this.foodsScroll = new BScroll(this.$refs.foods_scroll, {
        click: true,
        probeType: 3
      });

      //监听滚动
      this.foodsScroll.on("scroll", pos => {
        if (pos.y > 0) {
          this.scrollY = 0;
        } else {
          this.scrollY = Math.floor(-pos.y);
        }
      });
    },
    calcCount(spus) {
      //计算每个类型商品数量(左侧显示)
      let count = 0;
      spus.forEach(food => {
        if (food.count) {
          count += food.count;
        }
      });
      return count;
    },
    calcHeight() {
      //计算每类商品占的高度
      let foodList = this.$refs.foods_scroll.getElementsByClassName(
          "food-list-hook"
        ),
        oHeight = 0;

      this.heightList.push(oHeight);
      for (let i = 0; i < foodList.length; i++) {
        oHeight += foodList[i].clientHeight;
        this.heightList.push(oHeight);
      }
    },
    scrollTo(index) {
      let foodlist = this.$refs.foods_scroll.getElementsByClassName(
        "food-list-hook"
      );
      this.foodsScroll.scrollToElement(foodlist[index], 250);
    },
    showDetail(food){
      this.detail_food = food;
      this.$refs.food_detail.show();
    }
  },
  computed: {
    curIndex() {
      let heightList = this.heightList;

      for (let i = 0; i < heightList.length - 1; i++) {
        let Height_1 = heightList[i],
          Height_2 = heightList[i + 1];
        if (
          this.index != i &&
          this.scrollY >= Height_1 &&
          this.scrollY < Height_2
        ) {
          // let menuList = this.$refs.menu_scroll.getElementsByClassName("menu-item");
          this.index = i;
          // this.menuScroll.scrollToElement(menuList[this.index],250);
        }
      }
      return this.index;
    },
    calcCartList() {
      let cartList = [];
      this.goods.forEach(item => {
        item.spus.forEach(food => {
          if (food.count > 0) {
            cartList.push(food);
          }
        });
      });
      return cartList;
    }
    
  }
};
</script>


<style scoped>
.goods {
  display: flex;
  position: absolute;
  top: 190px;
  bottom: 51px;
  overflow: hidden;
  width: 100%;
}

.goods .menu-wrapper {
  flex: 0 0 85px;
  background: #f4f4f4;
}

.goods .foods-wrapper {
  flex: 1;
}

/* Menu item */
.goods .menu-wrapper .menu-item {
  padding: 16px 23px 15px 10px;
  border-bottom: 1px solid #e4e4e4;
  position: relative;
}

.goods .menu-wrapper .menu-item .text {
  font-size: 13px;
  color: #333333;
  line-height: 17px;
  /* 文本超出显示省略号 */
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods .menu-wrapper .menu-item .text .icon {
  width: 15px;
  height: 15px;
  vertical-align: middle;
}

/* 专场样式 */
.goods .foods-wrapper .container-list {
  padding: 11px 11px 0 11px;
  border-bottom: 1px solid #e4e4e4;
}

.goods .foods-wrapper .container-list img {
  width: 100%;
  margin-bottom: 11px;
  border-radius: 5px;
}

/* 具体分类商品布局 */
.goods .foods-wrapper .food-list {
  padding: 11px;
}

.goods .foods-wrapper .food-list .title {
  height: 13px;
  font-size: 13px;
  background: url(./img/btn_yellow_highlighted@2x.png) no-repeat left center;
  background-size: 2px 10px;
  padding-left: 7px;
  margin-bottom: 12px;
}

.goods .foods-wrapper .food-list .food-item {
  display: flex;
  margin-bottom: 25px;
  position: relative;
}

.goods .foods-wrapper .food-list .food-item .icon {
  flex: 0 0 63px;
  background-position: center;
  background-size: 120% 100%;
  background-repeat: no-repeat;
  margin-right: 11px;
  height: 75px;
}
.goods .foods-wrapper .food-list .food-item .content {
  flex: 1;
}

/* 具体内容样式 */
.goods .foods-wrapper .food-list .food-item .content .name {
  font-size: 16px;
  line-height: 21px;
  color: #333333;
  margin-bottom: 10px;
  padding-right: 27px;
}

.goods .foods-wrapper .food-list .food-item .content .desc {
  font-size: 10px;
  line-height: 19px;
  color: #bfbfbf;
  margin-bottom: 8px;

  /* 超出部分显示省略号*/
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods .foods-wrapper .food-list .food-item .content .extra {
  font-size: 10px;
  color: #bfbfbf;
  margin-bottom: 7px;
}
.goods .foods-wrapper .food-list .food-item .content .extra .saled {
  margin-right: 14px;
}
.goods .foods-wrapper .food-list .food-item .content .product {
  height: 15px;
  margin-bottom: 6px;
}
.goods .foods-wrapper .food-list .food-item .content .price {
  font-size: 0;
}
.goods .foods-wrapper .food-list .food-item .content .price .text {
  font-size: 14px;
  color: #fb4e44;
}
.goods .foods-wrapper .food-list .food-item .content .price .unit {
  font-size: 12px;
  color: #bfbfbf;
}

/* 当前选中 */
.goods .menu-wrapper .menu-item.current {
  background: white;
  font-weight: bold;
  margin-top: -1px;
}
.goods .menu-wrapper .menu-item:first-child.current {
  margin-top: 1px;
}

.goods .foods-wrapper .food-list .food-item .countcontrol-wrapper {
  position: absolute;
  right: 0;
  bottom: 0;
}

.goods .menu-wrapper .menu-item .num {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  color: white;
  background: red;
  text-align: center;
  font-size: 7px;
  line-height: 13px;
}
</style>