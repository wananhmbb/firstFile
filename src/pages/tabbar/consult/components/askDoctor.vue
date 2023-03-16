<template>
  <view>
    <view class="myConsultation" v-if="myConsultList.length !== 0">
      <view class="title">我的咨询服务</view>
      <view class="cardbox">
        <view class="card" v-for="(item, index) in myConsultList" :key="index">
			<view class="headImg">
				<image :src="item.image" mode="" ></image>
			</view>
          <view class="cardLeft">
            <view class="nameBox">
              <text class="name">{{ item.storeName }}</text>
              <u-badge
                v-if="item.unreadCount"
                type="error"
                :count="item.unreadCount"
                size="default"
                offset="[0,0]"
              ></u-badge>
            </view>
            <!-- <view class="times"
              >剩余咨询<text>{{ item.count ? item.count : 0 }}</text
              >次</view
            > -->
          </view>
          <view class="cardRight">
            <u-button
              v-if="item.usingCount == '0'"
              size="default"
              type="primary"
              shape="circle"
              :custom-style="customStyle"
              @click="createConsultation(item)"
              >问医生</u-button
            >
            <u-button
              v-if="item.usingCount != '0'"
              size="default"
              type="primary"
              shape="circle"
              :custom-style="customStyle"
              @click="continueConsultation(item)"
              >继续问诊</u-button
            >
          </view>
        </view>
      </view>
    </view>
    <view
      class="recommendationConsultation"
      v-if="recommendationConsultList.length !== 0"
    >
      <view class="title">推荐咨询服务</view>
      <view class="cardbox">
        <view
          class="card"
          v-for="(item, index) in recommendationConsultList"
          :key="index"
          @click="createConsultationAndPay(item)"
        >
		<view class="headImg">
			<image :src="item.image" mode="" ></image>
		</view>
		   
          <view class="cardLeft">
            <view class="nameBox">{{ item.storeName }}</view>
            <!-- <view class="times"
              >剩余咨询<text>{{ item.count }}</text
              >次数</view
            > -->
          </view>
          <view class="cardRight">
            <u-button
              size="default"
              type="primary"
              shape="circle"
              @click="createConsultationAndPay(item)"
              :custom-style="customStyle"
              >￥{{ item.price }}元</u-button
            >
          </view>
        </view>
      </view>
    </view>
    <view class="empty" v-if="askDoctorList.length === 0">
      <x-icon iconName="service-no-data"></x-icon>
    </view>
  </view>
</template>

<script>
import { getDoctorMessage } from "@/utils/getWebSocketMessage.js"
export default {
  props: {
    myConsultList: {
      type: Array
    },
    recommendationConsultList: {
      type: Array
    }
  },
  data() {
    return {
      customStyle: {
        width: "156rpx",
        background: "var(--theme-color-linear)",
        fontSize: "28rpx",
        height: "64rpx",
        lineHeight: "40rpx"
      },
      url: ""
    }
  },
  methods: {
    createConsultation(item) {
      console.log(item, "djiuh ")
      this.$Router.push({
        path: "/createConsultation",
        query: {
          payBtnshow: false,
          ShopDetailId: item.id,
          consultPackageId: item.consultPackageId
        }
      })
    },
    createConsultationAndPay(item) {
      this.$Router.push({
        path: "/createConsultation",
        query: {
          payBtnshow: true,
          ShopDetailId: item.id,
          consultPackageId: item.consultPackageId
        }
      })
    },
    continueConsultation(item) {
      if (item.consultId) {
        let list = this.myConsultList.filter(i => i.id !== item.id)
        var redPoint = list.every(i => i.unreadCount === null)
        // console.log(redPoint, "redPoint=====================")
        getDoctorMessage(true)
        this.$Router.push({
          path: "/chat",
          query: {
            id: item.consultId,
            redPointShow: redPoint,
            type: "my",
            status: 1
          }
        })
      } else {
        console.log("咨询id为空")
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.headImg{
	width: 85rpx;
	height: 85rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 30rpx;
	image{
		width: 100%;
		height: 100%;
	}
}
.myConsultation {
  margin-bottom: 15px;
}
.title {
  font-size: 36rpx;
  font-weight: bolder;
  color: var(--text-color-main);
  margin-bottom: 15px;
}
.nameBox {
  font-size: 32rpx;
  font-weight: bolder;
  color: var(--text-color-main);
  // margin-bottom: 10px;
  position: relative;
  .name {
    padding-right: 5px;
  }
}
.button-position {
  position: absolute;
  bottom: 0;
  right: 0;
  font-weight: 400;
  color: var(--text-color-main);
}
.times {
  color: var(--text-color-grey);
  font-size: 26rpx;
  text {
    color: var(--theme-color-dark-blue);
  }
}
.cardbox {
  border-radius: 8px;
  .card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-bottom: 15px;
    background: var(--bg-color-main);
    border-radius: 8px;
    .cardLeft {
      width: 60%;
    }
    .cardRight {
      width: 28%;
    }
  }
}
.empty {
  margin-top: 150px;
  text-align: center;
}
</style>
