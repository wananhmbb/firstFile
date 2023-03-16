<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="心理"></house-header>
      <view class="content">
        <view
          class="cardBox"
          v-for="(item, index) in cardList"
          :key="index"
          @click="goQuestionnaireDetails(item)"
        >
          <view class="image-box">
            <image :src="item.url"></image>
          </view>
          <view class="rightBox">
            <view class="name">{{ item.name }}</view>
            <view>
              <u-button
                size="default"
                type="primary"
                shape="circle"
                class="button-position"
                :custom-style="customStyle"
                @click="goQuestionnaireDetails(item)"
                >去填写</u-button
              >
            </view>
          </view>
        </view>
      </view>
      <view class="emply" v-if="!cardList || cardList.length == 0">
        <image
          src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/ipImage/1.png"
        ></image>
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          show="true"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
    </view>
  </theme>
</template>
<script>
import { getPsychologyList } from "@/api/vajra-district"
export default {
  data() {
    return {
      customStyle: {
        background: "var( --theme-color-linear)",
        width: "156rpx",
        fontSize: "28rpx",
        lineHeight: "40rpx",
        height: "64rpx"
      },
      loading: true,
      cardList: [],
      extra: [],
      urlList: [
        {
          url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/sds.png",
          id: "1536590404802330625"
        },
        {
          url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E7%9B%96%E6%B4%9B%E6%99%AE.png",
          id: "1536590678686187522"
        },
        {
          url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E7%84%A6%E8%99%91.png",
          id: "1536590987940610049"
        },
        {
          url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E6%8A%91%E9%83%81.png",
          id: "1536591133495541761"
        }
      ]
    }
  },
  onLoad() {
    this.extra = this.$Route.query.text.surveyList
    console.log(this.extra, "this.extra")
    this.getCardList()
  },
  methods: {
    getCardList() {
      let str = ""
      this.extra.forEach(item => {
        str += "idList=" + item.id + "&"
      })
      str = str.substring(0, str.length - 1)
      getPsychologyList(str)
        .then(res => {
          if (res.code === 200) {
            this.loading = false
            this.cardList = res.data
            this.cardList = this.urlList.map(item => {
              const data = this.cardList.find(i => item.id === i.id)
              return { ...data, ...item }
            })
            console.log(this.cardList, " this.cardList")
          }
        })
        .catch(err => {
          console.log(err, "金刚区心理问卷异常请求")
        })
    },
    goQuestionnaireDetails(item) {
      this.$Router.push({
        name: "basicHealthQuestionnaire",
        params: {
          id: item.id,
          title: item.name,
          noAnswer: true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-second);
  .content {
    margin-top: 15px;
    .cardBox {
      width: 90%;
      margin: auto;
      margin-bottom: 15px;
      background: var(--bg-color-main);
      padding: 15px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      .image-box {
        width: 38%;
        border-radius: 16rpx;
        height: 180rpx;
        overflow: hidden;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .rightBox {
        width: 58%;
        position: relative;
        .name {
          font-size: 32rpx;
          font-weight: 600;
          color: var(--text-color-main);
        }
        .button-position {
          position: absolute;
          bottom: 0;
          right: 0;
          font-weight: 400;
          color: var(--text-color-main);
        }
      }
    }
  }
}
.emply {
  width: 230px;
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
</style>
