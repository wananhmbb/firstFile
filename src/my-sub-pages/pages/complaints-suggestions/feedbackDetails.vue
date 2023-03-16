<template>
  <theme>
    <view class="all" slot="theme">
      <house-header class="title-header" headTypeTwo="详情"></house-header>
      <view class="content" v-if="JSON.stringify(feedbackInfo) !== '{}'">
        <view class="topBox">
          <view class="titleBox">
            <view class="name" v-if="feedbackInfo.type == '反馈'"
              >意见反馈</view
            >
            <view class="name" v-if="feedbackInfo.type == '投诉'">投诉</view>
            <view class="repliedState" v-if="feedbackInfo.status == '已回复'"
              >已回复</view
            >
            <view class="waitState" v-if="feedbackInfo.status == '未回复'"
              >等待回复</view
            >
          </view>
          <view class="infoBox">
            <view class="headline">反馈原因：</view>
            <view class="info">
              {{ feedbackInfo.cause }}
            </view>
          </view>
          <view class="infoBox" v-if="feedbackInfo.user">
            <view class="headline">投诉对象：</view>
            <view class="info">
              {{ feedbackInfo.user }}
            </view>
          </view>
          <view class="infoBox">
            <view class="headline">提交时间：</view>
            <view class="info"> {{ feedbackInfo.createDate }}</view>
          </view>
        </view>
        <view class="centerBox">
          <view class="headline">问题说明：</view>
          <view class="info">{{ feedbackInfo.explain }}</view>
          <view class="imgBox">
            <u-upload
              :fileList="fileList"
              :max-count="maxCount"
              :deletable="false"
              :show-progress="false"
            ></u-upload>
          </view>
        </view>
        <view class="bottomBox">
          <view class="headline">问题回复：</view>
          <view class="info" v-if="feedbackInfo.customerComplaintReplyVo">{{
            feedbackInfo.customerComplaintReplyVo[0].answer
          }}</view>
          <view class="info" v-if="!feedbackInfo.customerComplaintReplyVo">
            暂无回复
          </view>
        </view>
      </view>
      <!-- <view class="empty" v-if="JSON.stringify(feedbackInfo) === '{}'">
        <x-icon iconName="service-no-data"></x-icon>
      </view> -->
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
    </view>
  </theme>
</template>
<script>
import { getComplaintList } from "@/api/personal"
export default {
  data() {
    return {
      id: "",
      feedbackInfo: {},
      maxCount: 0,
      fileList: [],
      loading: true
    }
  },
  onLoad(option) {
    this.id = option.id
    if (this.id) {
      this.getDetails()
    }
  },
  methods: {
    getDetails() {
      this.loading = true
      getComplaintList(this.id)
        .then(res => {
          if (res.code == 200) {
            this.loading = false
            this.feedbackInfo = res.data.rows[0]
            if (this.feedbackInfo.images) {
              let urlList1 = this.feedbackInfo.images.split(",")
              urlList1.forEach(item => this.fileList.push({ url: item }))
            }
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err, "反馈异常")
        })
    }
  }
}
</script>
<style scoped lang="scss">
.all {
  height: 100vh;
  background: var(--bg-color-second);
}
.content {
  border-top: 1px solid var(--bd-color-main);
}
.topBox {
  background: var(--bg-color-main);
  padding: 20px 0 10px 0;
  .titleBox {
    width: 90%;
    margin: auto;
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
    width: 90%;
    margin: auto;
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
.centerBox,
.bottomBox {
  background: var(--bg-color-main);
  margin-top: 10px;
  padding: 15px 0;
  .headline {
    width: 90%;
    margin: auto auto 10px auto;
    color: var(--text-color-grey);
  }
  .info {
    color: var(--text-color-main);
    width: 90%;
    margin: auto;
  }
  .imgBox {
    width: 90%;
    margin: 10px auto auto auto;
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
.empty {
  margin-top: 150px;
  text-align: center;
}
/deep/.u-list-item {
  background: var(--bg-color-second) !important;
}
/deep/.u-preview-wrap {
  border: 1px solid var(--bd--color-main) !important;
}
</style>
