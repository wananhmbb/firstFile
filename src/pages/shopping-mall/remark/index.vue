<template>
  <theme>
    <view class="large" slot="theme">
      <house-header :headTypeTwo="headTitle"></house-header>
      <view class="textarea">
        <textarea
          class="textarea-value"
          @input="bindHideKeyboard"
          :value="textValue"
          :name="textValue"
          :disabled="paid"
          maxlength="150"
          :placeholder="paid ? '无' : '请添加备注(150字以内)'"
        ></textarea>
      </view>
      <view class="btn" @click="finish" v-if="!paid">完成</view>
    </view>
  </theme>
</template>
<script>
export default {
  data() {
    return {
      textValue: "",
      paid: "",
      headTitle: "添加备注"
    }
  },
  onLoad(option) {
    let remark = decodeURIComponent(option.remark)
    this.paid = JSON.parse(option.paid)
    if (remark) {
      this.textValue = remark
    }
    if (this.paid) {
      this.headTitle = "查看备注"
    } else {
      this.headTitle = "添加备注"
    }
  },
  methods: {
    bindHideKeyboard: function (e) {
      this.textValue = e.detail.value
    },
    finish() {
      this.sure()
    },
    sure() {
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2] //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      // 上一个页面最后设置userdata
      prevPage.setData({
        userdata: {
          item: this.textValue
        }
      })
      uni.navigateBack({
        //返回
        delta: 1
      })
    }
  }
}
</script>
<style scoped>
.large {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-main);
}
/* .placeholder {
  color: #ccc;
} */
.textarea {
  width: 92%;
  margin: 32rpx auto;
  background: var(--bg-color-second);
  padding: 20rpx 4%;
  border-radius: 10rpx;
}
.textarea-value {
  color: var(--text-color-main);
}
.btn {
  width: 92%;
  margin: 0 auto;
  text-align: center;
  line-height: 96rpx;
  border-radius: 50rpx;
  height: 96rpx;
  color: #ffffff;
  background: var(--theme-color-dark-blue);
  border-radius: 24px;
}
/* textarea {
  background: var(--text-color-grey);
} */
</style>
