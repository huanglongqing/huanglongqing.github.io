<template>
  <div class="star">
    <span class="star-item" 
        v-for="(itemClass,index) in itemClassList"
        :key="index" 
        :class="itemClass">
    </span>
  </div>
</template>

<script>

const LEN = 5;

const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';

export default {
    props:{
        score:{
            type:Number
        }
    },
    computed:{
        itemClassList(){
            let classList = [],
                oScore = Math.floor(this.score*2) / 2;

            for(let i = 0; i < LEN; i++){
                if(oScore > i+1){
                    classList.push(CLS_ON)
                }else if(oScore - i > 0){
                    classList.push(CLS_HALF)
                }else{
                    classList.push(CLS_OFF)
                }
            }

            return classList;
        }
    }
}
</script>


<style scoped>

.star{
		font-size: 0;
	}
	.star .star-item{
		display: inline-block;
		width: 10px;
		height: 10px;
		margin-right: 3px;
		background-repeat: no-repeat;
		background-size: 10px 10px;
	}
	.star .star-item:last-child{
		margin-right: 0;
	}
	
	/* 三种图片类型*/
	.star .on{
		background-image: url(img/star24_on@2x.png);
	}
	.star .half{
		background-image: url(img/star24_half@2x.png);
	}
	.star .off{
		background-image: url(img/star24_off@2x.png);
	}

</style>