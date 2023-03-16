<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="请选择"></house-header>
      <view class="content">
        <view class="titleBox">
          <view class="goHomeBox" @tap="goHome">
            <image
              src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/back%402x.png"
            ></image>
          </view>
          <view class="titleText">当前机构:</view>
          <view class="itemBox">
            <view class="item">
              <view class="imgBox">
                <image :src="nowlogo"></image>
              </view>
              <view class="textBox">
                <view>{{ nowMechanism }}</view>
                <view>{{ nowDesc }} </view>
              </view>
            </view>
          </view>
        </view>
        <view
          class="itemBox"
          v-for="(item, index) in tenantList"
          :key="index"
          @click="change(item)"
        >
          <view class="item">
            <view class="imgBox">
              <image :src="item.logo"></image>
            </view>
            <view class="textBox">
              <view>{{ item.name }}</view>
              <view>{{ item.desc }} </view>
            </view>
          </view>
        </view>
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <view class="empty" v-if="!tenantList || tenantList.length === 0">
        <x-icon iconName="service-no-data"></x-icon>
      </view>
    </view>
  </theme>
</template>

<script>
import { getTenantList } from "@/api/login"
export default {
  data() {
    return {
      loading: false,
      tenantList: [],
      nowMechanism: "",
      nowDesc: "",
      nowlogo: ""
    }
  },
  onLoad() {
    this.getTenantInfo()
  },
  methods: {
    //获取租户列表
    getTenantInfo() {
      this.loading = true
      getTenantList().then(res => {
        if (res.code === 200) {
          this.loading = false
          this.tenantList = res.data
          let tenantId = uni.getStorageSync("tenantId")
          this.tenantList.forEach(item => {
            if (item.id === tenantId) {
              this.nowMechanism = item.name
              this.nowDesc = item.desc
              this.nowlogo = item.logo
            }
          })
        }
      })
    },
    //切换租户
    change(item) {
      let tenantId = item.id
      this.$store.commit("getenants", tenantId)
      setTimeout(() => {
        uni.switchTab({ url: "/pages/tabbar/index/index" })
      }, 1000)
    },
    goHome() {
      uni.reLaunch({
        url: "/pages/residentInstitution/index"
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
    border-top: 1px solid var(--bd-color-main);
    .titleBox {
      padding: 10px 0 0 0;
      margin: 0 0 12px 0;
      background: var(--bg-color-home);
      .titleText {
        margin-left: 5%;
        color: var(--text-color-main);
      }
      .goHomeBox {
        margin: 5px auto 15px auto;
        width: 90%;
        height: 96rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
    .itemBox {
      background: var(--bg-color-home);
      padding: 0 5%;
      .item {
        display: flex;
        align-items: center;
        padding: 20px 0;
        border-bottom: 1px solid var(--bd-color-main);
        .imgBox {
          border-radius: 50%;
          margin-right: 15px;
          image {
            border: 1px solid var(--bd-color-main);
            border-radius: 50%;
            width: 48px;
            height: 48px;
          }
        }
        .textBox {
          view:first-child {
            font-size: 36rpx;
            color: var(--text-color-main);
            padding-bottom: 2px;
          }
          view:last-child {
            color: var(--text-color-grey);
          }
        }
      }
    }
  }
}
.loading-box {
  width: 100vw;
  height: 100vh;
  margin: 40px auto auto;
  text-align: center;
  line-height: 90vh;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--bg-color-main);
  z-index: 10;
}
.empty {
  width: 230px;
  height: 170px;
  margin: 30px auto auto auto;
  text-align: center;
}
</style>
