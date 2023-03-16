<template>
  <theme>
    <view slot="theme" class="large">
      <house-header headTypeTwo="健康自评"></house-header>
      <view class="tabs-css" :style="'top:' + top + 'px'">
        <u-tabs
          :list="TabList"
          :is-scroll="false"
          :current="current"
          @change="tabOnChanged"
          active-color="var(--text-color-main)"
          inactive-color="#9699a6"
          bg-color="var(--bg-color-main)"
        >
        </u-tabs>
      </view>

      <view class="main-content" v-if="current == 0">
        <view class="loading-box" v-if="loading">
          <view class="posi">
            <u-loading
              mode="circle"
              :show="loading"
              size="100"
              color="var(--theme-color-dark-blue)"
            >
            </u-loading>
          </view>
        </view>
        <view class="record" v-else>
          <view class="item" v-for="(v, i) in listData" :key="i">
            <img :src="v.url" />
            <view class="title">
              <text class="text">{{ v.title }}</text>
              <view
                class="button-position"
                @click.stop="godDetail(v.id, v.path, v.title)"
                >立即测评</view
              >
            </view>
          </view>
          <view class="empty" v-if="listData.length === 0">
            <x-icon iconName="service-no-data"></x-icon>
          </view>
        </view>
      </view>
      <view class="record-content" v-if="current == 1">
        <view class="loading-box" v-if="loading">
          <view class="posi">
            <u-loading
              mode="circle"
              :show="loading"
              size="100"
              color="var(--theme-color-dark-blue)"
            >
            </u-loading>
          </view>
        </view>
        <view class="record" v-else>
          <record
            :recordData="recordData"
            v-if="recordData.length > 0"
            @popup="popup"
          ></record>
          <view class="empty" v-if="recordData.length == 0">
            <x-icon iconName="service-no-data"></x-icon>
          </view>
        </view>
      </view>
      <view class="model-box">
        <u-popup mode="bottom" v-model="show" height="550px">
          <view class="upmain">
            <view class="picBox">
              <img
                src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/img_result_bg%402x.png"
              />
            </view>
            <view class="box">
              <view class="title"></view>
              <scroll-view scroll-y="true" style="height: 350px">
                <view class="contentBox">
                  <view class="resultName">本次测评结果</view>
                  <view class="result">
                    <view class="">
                      <text class="text">安静心率</text>
                      <text class="num">{{ form.type3.value }}次/分</text>
                    </view>
                    <view :class="getType3Color[form.type3.evaluationResult]">
                      {{ form.type3.evaluationResult }}
                    </view>
                  </view>
                  <view class="result">
                    <view class="">
                      <text class="text">坐位体前屈</text>
                      <text class="num">{{ form.type.value }}cm</text>
                    </view>
                    <view :class="getTypeColor[form.type.evaluationResult]">
                      {{ form.type.evaluationResult }}
                    </view>
                  </view>
                  <view class="result">
                    <view class="">
                      <text class="text">靠墙静蹲</text>
                      <text class="num">{{ form.type1.value }}秒</text>
                    </view>
                    <view :class="getType1Color[form.type1.evaluationResult]">
                      {{ form.type1.evaluationResult }}
                    </view>
                  </view>
                  <view class="result">
                    <view class="">
                      <text class="text">两分钟踏步</text>
                      <text class="num">{{ form.type2.value }}次</text>
                    </view>
                    <view :class="getType2Color[form.type2.evaluationResult]">
                      {{ form.type2.evaluationResult }}
                    </view>
                  </view>
                  <view class="result">
                    <view class="">
                      <text class="text">单腿平衡</text>
                      <text class="num">{{ form.type4.value }}秒</text>
                    </view>
                    <view :class="getType4Color[form.type4.evaluationResult]">
                      {{ form.type4.evaluationResult }}
                    </view>
                  </view>
                </view>
                <view class="name">推荐服务包</view>
                <servicePackageListItem
                  :serveBackgroundItem="serveBackgroundItem"
                  :itemData="goodsData"
                >
                </servicePackageListItem>
                <view class="form-css"></view>
              </scroll-view>
              <view class="basicInfo">
                <u-button
                  type="primary"
                  shape="circle"
                  @click="show = false"
                  throttle-time="5000"
                  >我知道了</u-button
                >
              </view>
            </view>
          </view>
        </u-popup>
      </view>
    </view>
  </theme>
</template>

<script>
import { record } from "./components/record.vue"
import { getRecord, getServicePackData } from "@/api/service"
import servicePackageListItem from "@/components/components/service-package-list/service_package_list_item.vue"
import { getJinGangDetail } from "@/api/vajra-district"
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    record,
    // eslint-disable-next-line vue/no-unused-components
    servicePackageListItem
  },
  data() {
    return {
      getTypeColor: {
        优秀: "blue",
        很好: "blue",
        好: "yellow",
        一般: "yellow",
        需改进: "red"
      },
      getType1Color: {
        高: "blue",
        中: "yellow",
        低: "red"
      },
      getType2Color: {
        强: "blue",
        标准: "yellow",
        弱: "red"
      },
      getType3Color: {
        运动员: "blue",
        非常好: "blue",
        良好: "yellow",
        较好: "yellow",
        平均: "yellow",
        较差: "red",
        差: "red"
      },
      getType4Color: {
        良好: "blue",
        中等: "yellow",
        中等以下: "yellow",
        差: "red"
      },
      show: false,
      TabList: [
        {
          name: "运动自评"
        },
        {
          name: "历史记录"
        }
      ],
      top: 0,
      serveBackgroundItem: "var(--bg-color-secondhome)",
      form: {},
      current: 0,
      loading: false,
      listData: [],
      recordData: [],
      pageNum: 1,
      total: 0,
      pageSize: 10,
      goodsData: {
        id: "",
        image: "",
        storeName: "",
        storeInfo: [
          {
            useDirection: ""
          }
        ],
        productOrderInfo: {
          teamName: "",
          useDirection: "", //可以为空
          healthTips: "", //可以为空
          servicePackageId: ""
        }
      }
    }
  },
  methods: {
    tabOnChanged(index) {
      this.current = index
      if (this.current == 1) {
        this.getRecordData()
      }
    },
    popup(e) {
      uni.showLoading({
        title: "加载中",
        mask: true
      })
      let data = JSON.parse(e.evaluationContent)
      data.map(v => {
        if (v.type == 0) {
          this.form.type = v
        } else if (v.type == 1) {
          this.form.type1 = v
        } else if (v.type == 2) {
          this.form.type2 = v
        } else if (v.type == 3) {
          this.form.type3 = v
        } else if (v.type == 4) {
          this.form.type4 = v
        }
      })
      getServicePackData(e.productId).then(res => {
        if (res.code == 200) {
          this.goodsData.id = e.productId
          this.goodsData.image = res.data.productInfo.image
          this.goodsData.storeName = res.data.productInfo.storeName
          let text = JSON.parse(res.data.productInfo.storeInfo)
          this.goodsData.storeInfo[0].useDirection = text[0].useDirection
          this.goodsData.productOrderInfo.servicePackageId = e.servicePackageId
          this.show = true
          setTimeout(function () {
            uni.hideLoading()
          }, 100)
        }
      })

      // console.log(e.productId, 12356)
    },
    //获取历史记录
    async getRecordData(e) {
      this.loading = true
      let res = await getRecord({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
      if (res.code == 200) {
        this.loading = false
        this.total = res.total
        if (e == 1) {
          this.recordData = [...this.recordData, ...res.rows]
        } else {
          this.recordData = res.rows
        }
        setTimeout(function () {
          uni.hideLoading()
        }, 100)
      }
      // console.log(this.recordData, 123);
    },
    godDetail(id, item, title) {
      if (item) {
        this.$Router.push({
          path: item,
          query: {
            id: id,
            title: title
          }
        })
      }
    },
    getJinGangDetailList() {
      this.loading = true
      getJinGangDetail(this.detailsId).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.listData = res.data.extra.surveyList
        }
      })
    }
  },

  // 触底触发
  onReachBottom() {
    if (this.recordData.length < this.total) {
      this.pageNum++
      this.getRecordData(1)
    }
  },
  onLoad() {
    this.top = this.$store.state.theme.mescrollUniHeight
    this.detailsId = this.$Route.query.detailsId
    if (this.detailsId) {
      this.getJinGangDetailList()
    }
  }
}
</script>

<style scoped lang="scss">
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}
.large {
  background: var(--bg-color-main);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  // background: var(--bg-color-main);
}

.tabs-css {
  position: fixed;
  overflow-x: scroll;
  width: 100%;
  height: 40px;
  z-index: 20;
  background: var(--bg-color-main);
}

.main-content {
  margin-top: 40px;
  font-size: 14px;
  flex: 1;
  padding: 15px 15px 0 15px;
  background-color: var(--bg-color-second);
  overflow-y: scroll;
  overflow-x: hidden;
}

.item {
  display: flex;
  background-color: var(--bg-color-main);
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;

  img {
    width: 120px;
    height: 90px;
    border-radius: 5px;
    margin-right: 15px;
  }

  .title {
    flex: 1;
    position: relative;

    .button-position {
      position: absolute;
      bottom: 0rpx;
      right: 0rpx;
      color: var(--text-color-white);
      height: 32px;
      padding: 0 20px;
      line-height: 32px;
      text-align: center;
      border-radius: 16px;
      background: var(--theme-color-linear);
    }

    .text {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color-main);
    }
  }
}

.record-content {
  margin-top: 40px;
  font-size: 14px;
  flex: 1;
  padding: 15px 15px 0 15px;
  background-color: var(--bg-color-second);
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.record {
  flex: 1;
}

.loading-box {
  flex: 1;
  position: relative;
  .posi {
    position: absolute;
    text-align: center;
    line-height: 50vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 20;
  }
}

.empty {
  margin-top: 150px;
  text-align: center;
}

//弹窗
/deep/.u-mode-center-box {
  background-color: transparent !important;
}

.model-box {
  /deep/ .u-drawer-content {
    width: 100%;
    background-color: transparent !important;
  }
}

.upmain {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  overflow: hidden;
  .picBox {
    width: 150px;
    height: 150px;
    position: absolute;
    top: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .box {
    width: 100%;
    height: 100%;
    background: var(--bg-color-main);
    margin-top: 120px;
    border-radius: 10px;
    .title {
      padding-bottom: 15px;
      margin-top: 90px;
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: var(--text-color-main);
    }
    .name {
      margin-top: 20px;
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: var(--text-color-main);
    }
    .resultName {
      margin-bottom: 12px;
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: var(--text-color-main);
    }
    .result {
      color: var(--text-color-main);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 35px;
      font-size: 16px;

      .num {
        margin-left: 10px;
        font-size: 14px;
        color: var(--text-color-grey);
      }

      .text {
        display: inline-block;
      }

      .red {
        border: 1px solid #ff7874;
        padding: 2px 5px;
        border-radius: 5px;
        color: #ff7874;
      }

      .blue {
        border: 1px solid #68a0ff;
        padding: 2px 5px;
        border-radius: 5px;
        color: #68a0ff;
      }

      .yellow {
        border: 1px solid #faac4e;
        padding: 2px 5px;
        border-radius: 5px;
        color: #faac4e;
      }

      .green {
        border: 1px solid #4dd4b8;
        padding: 2px 5px;
        border-radius: 5px;
        color: #4dd4b8;
      }
    }
  }
}
.contentBox {
  color: var(--text-color-main);
  text-align: center;
}
.form-css {
  width: 100%;
  height: 85px;
  background: var(--bg-color-main);
}
.basicInfo {
  position: fixed;
  z-index: 999;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 40rpx 5%;
  background: var(--bg-color-main);
}
</style>
