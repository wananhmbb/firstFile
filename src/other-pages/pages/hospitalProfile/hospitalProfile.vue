<template>
  <theme>
    <view slot="theme" class="all">
      <house-header :headTypeTwo="headTitle"></house-header>
      <view v-if="loading" class="loading-style"
        ><u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading
      ></view>
      <view class="listBox"
        ><view
          class="list"
          v-for="(item, index) in hospitalList"
          :key="index"
          @click="goEdit(item)"
        >
          <view class="name">
            {{ item.name }}
          </view>
          <image :src="item.cover" mode="widthFix"></image>
        </view>
      </view>
    </view>
  </theme>
</template>
<script>
import {VajraDistrictEnum} from "@/utils/enums/VajraDistrictEnum"
// import { getJinGangDetail } from '@/api/vajra-district';
export default {
  data() {
    return {
      htmlData: "",
      id: "",
      detailsId: "",
      loading: true,
      headTitle: "",
      hospitalList: []
    }
  },

  onLoad(option) {
    let query = JSON.parse(decodeURIComponent(option.query))
    this.headTitle = query.navname
    this.hospitalList = query.text.list
    if (this.hospitalList?.length) {
      this.loading = false
    }
  },
  methods: {
    goEdit(item) {
      console.log(item, 74)
      this.$Router.push({
        path: "/vajraDistrictDetails",
        query: {
          detailsId: item.id,
          selectType: VajraDistrictEnum.FREE_HEALTH
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.listBox{
	width: 90vw;
	margin: auto;
	margin-top: 40rpx;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	.list{
		position: relative;
		font-size: 30rpx;
		font-weight: 600;
		// padding: 20rpx;
		width: 48%;
		height: 228rpx;
		// border: 1px solid var(--theme-color-linear);
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		.name{
			position: absolute;
			top: 20rpx;
			left: 20rpx;
			z-index: 10;
		}
		image{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: auto;
			z-index: 5;
		}
	}
}
.all {
	width: 100%;
	min-height: 100vh;
	background: var(--bg-color-second);
}
.loading-style {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: rgba(0, 0, 0, 0);
	width: 50vw;
	height: 200rpx;
	z-index: 100;
	border-radius: 20rpx;
	line-height: 150rpx;
	text-align: center;
}
//.no-data {
//	position: fixed;
//	top: 40%;
//	left: 50%;
//	transform: translate(-50%, -50%);
//	height: 150rpx;
//	width: 70vm;
//	.no-data-text {
//		width: 100%;
//		text-align: center;
//		margin-top: 30rpx;
//		color: var(--text-color-grey);
//	}
//}
</style>
