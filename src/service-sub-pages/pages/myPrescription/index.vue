<template>
  <theme>
    <view class="all" slot="theme">
      <house-header :headTypeTwo="title"></house-header>
      <view class="cellBox">
        <view
          v-for="(item, index) in prescriptionList"
          :key="index"
          @click="goPrescriptionDetails(item.id, item.prescribeName, item.type)"
        >
          <view class="cell" v-if="item.prescribeName">
            <view class="left">
              <view class="imgBox"><image :src="item.icon"></image></view>
              <view class="title">{{ item.prescribeName }}</view>
            </view>
            <view class="right">
              <u-icon
                name="arrow-right"
                color="var(--text-color-grey)"
              ></u-icon>
            </view>
          </view>
        </view>
      </view>
	  <!-- 没有处方默认图片 -->
      <view class="emply" v-if="prescriptionList.length == 0">
        <image
          src="https://dailydev.oss-cn-chengdu.aliyuncs.com/416/image-icon/no-prescription.png"
        mode="widthFix"></image>
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          show="true"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>

<script>
import { listFront, getCBTIToken } from "@/api/service"
export default {
  data() {
    return {
      title: "",
      servicePackageId: null,
      medicalCardId: null,
      prescriptionList: [],
      loading: true,
      cellListValue: [
        {
          type: "754",
          title: "运动",
          icon: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/ic_recipe_sports.png"
        },
        {
          type: "755",
          title: "康复",
          icon: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/ic_recipe_recovery.png"
        },
        {
          type: "757",
          title: "心理",
          icon: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/ic_recipe_psychology.png"
        },
        {
          type: "756",
          title: "营养",
          icon: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/ic_recipe_nutrition.png"
        },
        {
          type: "759",
          title: "认知",
          icon: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/ic_recipe_cognize.png"
        },
        {
          type: "760",
          title: "生活方式",
          icon: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/ic_recipe_life.png"
        },
        {
          type: "758",
          title: "睡眠",
          icon: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/ic_recipe_sleep.png"
        },
        {
          type: "761",
          title: "CBTI睡眠",
          icon: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/c0308a6b0c5eef2b1f638ac91655050.png"
        }
      ]
    }
  },
  onLoad() {
    this.title = this.$Route.query.headTitle
    this.servicePackageId = this.$Route.query.servicePackageId
    this.medicalCardId = this.$Route.query.medicalCardId
    this.myPrescription(this.servicePackageId, this.medicalCardId)
  },
  methods: {
    //处方列表
    myPrescription(id, medicalCardId) {
      listFront(id, medicalCardId).then(res => {
        if (res.code == 200) {
          this.loading = false
          if (res.data) {
            this.prescriptionList = res.data
            // this.prescriptionList = this.cellListValue.map(item => {
            //   const data = this.prescriptionList.find(i => item.type === i.type)
            //   return { ...data, ...item }
            // })
            this.prescriptionList.forEach(item => {
              this.cellListValue.forEach(i => {
                if (item.type === i.type) {
                  item.icon = i.icon
                }
              })
            })
          }
        }
      })
    },
    //跳转
    goPrescriptionDetails(id, prescribeName, type) {
      if (type === "754") {
        this.$Router.push({
          name: "exercisePrescriptionDetails",
          params: {
            id: id,
            title: prescribeName,
            servicePackageId: this.servicePackageId
          }
        })
      }
      if (type === "756") {
        this.$Router.push({
          name: "nutritionalPrescription",
          params: {
            id: id,
            title: prescribeName,
            servicePackageId: this.servicePackageId
          }
        })
      }
      if (type === "755") {
        this.$Router.push({
          name: "rehabilitationPrescription",
          params: {
            id: id,
            title: prescribeName,
            servicePackageId: this.servicePackageId
          }
        })
      }
      if (
        type === "757" ||
        type === "758" ||
        type === "759" ||
        type === "760"
      ) {
        this.$Router.push({
          name: "rehabilitationPrescription",
          params: {
            id: id,
            title: prescribeName,
            servicePackageId: this.servicePackageId
          }
        })
      }
      if (type === "761") {
        getCBTIToken().then(res => {
          if (res.code === 200) {
            this.$Router.push({
              name: "CbtiPrescriptionDetsils",
              params: {
                token: res.data
              }
            })
          } else {
            this.$refs.uToast.show({
              title: "获取token失败",
              type: "error",
              icon: false
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cellBox {
  margin: 10px 0;
  background: var(--bg-color-second);
  padding-bottom: 15px;
  .cell {
    background: var(--bg-color-main);
    width: 90%;
    margin: auto;
    display: flex;
    border-radius: 10px;
    justify-content: space-between;
    align-items: center;
    padding: 10px 4%;
    margin-bottom: 10px;
    border-bottom: 1px solid var(--bd-color-main);
  }
  .left {
    display: flex;
    align-items: center;
    .imgBox {
      width: 54px;
      height: 54px;
      margin-right: 8px;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      font-size: 30rpx;
      font-weight: 400;
      color: var(--text-color-main);
    }
  }
}
/deep/ .u-cell__right-icon-wrap {
  color: var(--text-color-main) !important;
}
.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-second);
}
.emply {
  width: 60vw;
  height: 190px;
  margin: 150px auto auto auto;
  image {
    width: 100%;
    height: 100%;
  }
}
.loading-box {
  width: 100vw;
  height: 100vh;
  margin: auto auto;
  text-align: center;
  line-height: 90vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  background: var(--bg-color-main);
}
/deep/ .u-cell {
  border-bottom: 1px solid var(--bd-color-main);
}
</style>
