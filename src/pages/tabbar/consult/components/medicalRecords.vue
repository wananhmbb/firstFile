<template>
  <view>
    <view
      class="cardBox"
      @click="toChat(v)"
      v-for="v in recordList"
      :key="v.id"
    >
      <view class="top">
        <view class="title">{{ v.consultPackageName }}</view>
        <view class="ing" v-if="v.status == 1">进行中</view>
        <view class="end" v-if="v.status == 2">已完成</view>
        <view class="end" v-if="v.status == 3">已暂停</view>
      </view>
      <view class="date">{{ v.createDate }}</view>
    </view>
    <view class="empty" v-if="recordList.length === 0">
      <x-icon iconName="service-no-data"></x-icon>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    recordList: {
      type: Array
    }
  },
  data() {
    return {}
  },
  methods: {
    toChat(val) {
      this.$Router.push({
        path: "/chat",
        query: {
          id: val.id,
          redPointShow: true,
          type: "history",
          status: val.status
        }
      })
      // status: val.status
    }
  }
}
</script>
<style lang="scss" scoped>
.cardBox {
  background: var(--bg-color-main);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  .top {
    display: flex;
    justify-content: space-between;
    .title {
      color: var(--text-color-main);
      font-size: 32rpx;
      font-weight: 600;
      width: 60%;
    }
    .ing {
      color: var(--theme-color-dark-blue);
    }
    .end {
      color: var(--text-color-grey);
    }
  }
  .date {
    margin-top: 10px;
    color: var(--text-color-grey);
  }
}
.empty {
  margin-top: 150px;
  text-align: center;
}
</style>
