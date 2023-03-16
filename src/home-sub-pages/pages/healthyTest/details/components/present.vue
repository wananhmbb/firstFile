<template>
  <view class="main">
    <img :src="presentData.url" mode="widthFix" />
    <view class="text">
      <view class="round"></view>
      <view class="title">
        {{ presentData.action }}
      </view>
    </view>
    <view class="text" v-if="presentData.equipment">
      <view class="round"></view>
      <view class="title">
        {{ presentData.equipment }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ["presentData"],
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.main {
  padding: 15px;
  background-color: var(--bg-color-main);

  img {
    height: 206px;
    width: 100%;
  }

  .text {
    display: flex;
    align-items: center;
    margin-top: 15px;

    .round {
      width: 8px;
      height: 8px;
      background-color: var(--theme-color-dark-blue);
      border-radius: 4px;
      margin-right: 5px;
    }

    .title {
      flex: 1;
      color: var(--text-color-main);
    }
  }
}
</style>
