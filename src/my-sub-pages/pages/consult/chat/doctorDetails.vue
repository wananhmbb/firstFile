<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="医生列表"></house-header>
      <view class="content">
        <view class="itemBox" v-for="(item, index) in doctorList" :key="index">
          <view class="item">
            <view class="imgBox">
              <image
                :src="
                  item.avatar
                    ? item.avatar
                    : 'https://dailydev.oss-cn-chengdu.aliyuncs.com/416/image-icon/my_img_user.png'
                "
              ></image>
            </view>
            <view class="textBox">
              <view>{{ item.nickName }}</view>
              <view>{{ item.roleNames }} </view>
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
      <view class="empty" v-if="!doctorList || doctorList.length === 0">
        <x-icon iconName="service-no-data"></x-icon>
      </view>
    </view>
  </theme>
</template>

<script>
import { getBasicDetailInfo } from "@/api/consult"
export default {
  data() {
    return {
      loading: true,
      doctorList: []
    }
  },
  onLoad() {
    this.consultId = this.$Route.query.consultId
    if (this.consultId) {
      this.getBasicInfo(this.consultId)
    }
  },
  methods: {
    //获取基本信息
    getBasicInfo(consultId) {
      const _this = this
      _this.loading = true
      getBasicDetailInfo(consultId).then(res => {
        if (res.code === 200) {
          _this.loading = false
          _this.doctorList = res.data.userList
        } else {
          _this.loading = false
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
    border-top: 1px solid var(--bd-color-main);
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
  margin: 120px auto auto auto;
  text-align: center;
}
</style>
