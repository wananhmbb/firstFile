<template>
  <view class="listBox" v-if="problemList.length > 0">
    <view class="titleBox">
      <view class="imgBox">
        <image
          src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E5%9B%BE%E5%B1%82%204%402x.png"
        ></image>
      </view>
      <view class="titleText">常见问题</view>
    </view>
    <view class="listItem">
      <view
        class="cell-group"
        v-for="(item, index) in problemList"
        :key="index"
        @click="sendQuestion(item.title)"
      >
        <view class="question">
          {{ item.title }}
        </view>
        <u-icon name="arrow-right" color="var(--text-color-grey)"></u-icon>
      </view>
    </view>
  </view>
</template>
<script>
import { getQuestionList } from "@/api/consult"
export default {
  props: {
    consultId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      problemList: [],
    }
  },
  options: { styleIsolation: "shared" },
  watch: {
	
	  consultId: {
	        immediate: true,
	        deep: true,
	        handler(val) {
			  if(val){
				  this.getBasicInfo()
			  }
	         
	        }
		}
	      
  },
  methods: {
    //获取问题信息
    getBasicInfo() {
      const _this = this
	getQuestionList(_this.consultId).then(res => {
        if (res.code === 200) {
          _this.problemList = res.data
        }
    })	        
    },
    sendQuestion(item) {
      this.$emit("sendQuestion", item)
    }
  }
}
</script>
<style scoped lang="scss">
.listBox {
  width: 598rpx;
  background: var(--bg-color-main);
  color: var(--text-color-main);
  margin-bottom: 25rpx;
  border-radius: 20px;
  .titleBox {
    display: flex;
    align-items: center;
    padding: 10px 5%;
    .imgBox {
      width: 27px;
      height: 28px;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .titleText {
      margin-left: 8px;
      font-size: 32rpx;
      font-weight: 800;
    }
  }
  .listItem {
    padding: 0 5%;
    .cell-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx 0;
      border-bottom: 1px solid var(--bd-color-main);
    }
  }
}
</style>
