<template>
  <view class="contentBox">
    <view class="cardBox" v-for="(item, index) in cardList" :key="index">
      <view
        class="viewCard"
        v-if="item.type == '反馈'"
        @click="goDetails(item.id)"
      >
        <view class="titleBox">
          <view class="name">意见反馈</view>
          <view class="repliedState" v-if="item.status == '已回复'"
            >已回复</view
          >
          <view class="waitState" v-else>等待回复</view>
        </view>
        <view class="infoBox">
          <view class="headline">反馈原因：</view>
          <view class="info">
            {{ item.cause }}
          </view>
        </view>
        <view class="infoBox">
          <view class="headline">问题说明：</view>
          <view class="info"> {{ item.explain }}</view>
        </view>
        <view>
          <text class="headline">提交时间：</text>
          <text class="infoTime">{{ item.createDate }}</text>
        </view>
      </view>
      <view
        class="complainCard"
        v-if="item.type == '投诉'"
        @click="goDetails(item.id)"
      >
        <view class="titleBox">
          <view class="name">投诉</view>
          <view class="repliedState" v-if="item.status == '已回复'"
            >已回复</view
          >
          <view class="waitState" v-else>等待回复</view>
        </view>
        <view class="infoBox">
          <view class="headline">反馈原因：</view>
          <view class="info"> {{ item.cause }}</view>
        </view>
        <view class="infoBox" v-if="item.user">
          <view class="headline">投诉对象：</view>
          <view class="info"> {{ item.user }}</view>
        </view>
        <view class="infoBox">
          <view class="headline">问题说明：</view>
          <view class="info">{{ item.explain }}</view>
        </view>
        <view>
          <text class="headline">提交时间：</text>
          <text class="infoTime">{{ item.createDate }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    cardList: {
      type: Array
    }
  },
  data() {
    return {}
  },
  methods: {
    goDetails(id) {
      this.$Router.push({
        name: "feedbackDetails",
        params: {
          id
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.contentBox {
  width: 90%;
  height: 100%;
  margin: auto;
  padding-bottom: 20px;
  .cardBox {
    margin: 10px 0 0;
    padding: 15px;
    border-radius: 8px;
    background: var(--bg-color-main);
    .viewCard,
    .complainCard {
      .titleBox {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .name {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-color-main);
        }
        .waitState {
          color: #fc8c61;
        }
        .repliedState {
          color: var(--theme-color-dark-blue);
        }
      }
      .infoBox {
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        .info {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--text-color-main);
        }
      }
      .headline {
        color: var(--text-color-grey);
      }
    }
  }
}
.infoTime {
  color: var(--text-color-main);
}
</style>
