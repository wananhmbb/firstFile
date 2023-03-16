<template>
  <theme>
    <view class="contact" slot="theme">
      <house-header headTypeTwo=" "></house-header>
      <view class="no-data">
        <x-icon iconName="service-no-data icon-font"></x-icon>
      </view>
    </view>
  </theme>
</template>
<script>
export default {}
</script>
<style scoped lang="scss">
.contact {
  width: 100%;
  background: var(--bg-color-main);
  height: 100vh;
}
.no-data {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 150rpx;
  width: 70vm;
  .no-data-text {
    width: 100%;
    text-align: center;
    margin-top: 30rpx;
    color: var(--text-color-grey);
  }
}
</style>
