<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="设备详情"></house-header>
      <view
        class="content"
        v-if="Object.keys(equipmentDetailsInfo).length !== 0"
      >
        <view class="equipmentBox">
          <richTextComponent
            :htmlData="equipmentDetailsInfo.desc"
          ></richTextComponent>
        </view>
      </view>
    </view>
  </theme>
</template>
<script>
import { getEquipmentDetails } from "@/api/myEquipment.js"
export default {
  data() {
    return {
      equipmentDetailsId: "",
      equipmentDetailsInfo: {}
    }
  },
  onLoad(options) {
    this.equipmentDetailsId = options.equipmentDetailsId
    if (this.equipmentDetailsId) {
      this.getEquipmentDetailsInfo(this.equipmentDetailsId)
    }
  },
  methods: {
    getEquipmentDetailsInfo(equipmentDetailsId) {
      getEquipmentDetails(equipmentDetailsId).then(res => {
        if (res.code === 200) {
          this.equipmentDetailsInfo = res.data
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color-second);
  .content {
    width: 95%;
    margin: auto;
    .equipmentBox {
      margin: 10px 0;
    }
  }
}
</style>
