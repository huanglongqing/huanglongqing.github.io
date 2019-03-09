<template>
	<div class="countcontrol">
		<transition name="sub-move">
            <div 
            class="count-sub icon-remove_circle_outline"
            v-show="food.count"
            @click.stop.prevent="subCount"
            ></div>
        </transition>
        <div class="count-count" v-if="food.count">{{food.count}}</div>
        <div 
            class="count-add icon-add_circle"
            @click.stop.prevent="addCount"
            >
            <i class="bg"></i>
        </div>
	</div>
</template>

<script>
	export default {
        props:{
            food:{
                type:Object,
                default:{}
            }
        },
        methods:{
            addCount(){
                if(this.food.count){
                    this.food.count++;
                }else{
                    this.$set(this.food,"count",1);
                }
            },
            subCount(){
				if(this.food.count>0){
					this.food.count--;
				}   
            }
        }

    
	}
</script>

<style>

@import url(../../common/css/icon.css);

.countcontrol{
	font-size: 0;
}

.countcontrol .count-sub{
	display: inline-block;
	width: 26px;
	height: 26px;
	font-size: 26px;
	color: #b4b4b4;
}

.countcontrol .count-add .bg{
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: black;
	position: absolute;
	left: 3px;
	top: 3px;
	z-index: -1;
}


.countcontrol .count-count{
	display: inline-block;
	width: 25px;
	text-align: center;
	font-size: 12px;
	line-height: 26px;
	vertical-align: top;
}

.countcontrol .count-add{
	display: inline-block;
	width: 26px;
	height: 26px;
	font-size: 26px;
	color: #ffd161;
	position: relative;
}

.sub-move-enter-active,.sub-move-leave-active{
	transition: all 0.3s linear;
}
.sub-move-enter,.sub-move-leave-to{
	transform: translateX(20px) rotate(180deg);
}
</style>
