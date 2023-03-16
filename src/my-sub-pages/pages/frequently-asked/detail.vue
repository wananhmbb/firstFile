<template>
  <theme>
    <view class="all" slot="theme">
      <view class="main">
        <house-header class="title-header" headTypeTwo="详情"></house-header>
        <view class="content">
          <view class="ask">
            <view class="Qicon-css">
              <image
                src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/%E7%BC%96%E7%BB%84%202%402x.png"
              ></image>
            </view>
            <view class="qText">{{ problem }}</view>
          </view>
          <view class="ask">
            <view class="Qicon-css">
              <image
                src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/%E7%BC%96%E7%BB%84%203%403x%20%282%29.png"
              ></image>
            </view>
            <view class="aText">
              <richTextComponent :htmlData="answer"></richTextComponent>
            </view>
          </view>
        </view>
      </view>
    </view>
  </theme>
</template>
<script>
export default {
  data() {
    return {
      problem: "",
      answer: ""
    }
  },
  onLoad() {
    this.problem = this.$Route.query.problem
    this.answer = this.$Route.query.answer
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.all {
  height: 100vh;
  background: var(--bg-color-main);
}
image {
  width: 18px;
  height: 18px;
}
.qText {
  width: 90%;
  font-size: 32rpx;
  font-weight: 600;
}
.aText {
  width: 90%;
  font-size: 32rpx;
}
.content {
  border-top: 1px solid var(--bd-color-main);
  padding: 32rpx;
}
.ask {
  display: flex;
  color: var(--text-color-main);
  margin-bottom: 20px;
  .Qicon-css {
    width: 10%;
    height: 18px;
    border-radius: 3px;
    margin-right: 20rpx;
  }
}
</style>
