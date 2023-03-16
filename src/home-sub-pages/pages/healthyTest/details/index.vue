<template>
  <theme>
    <view slot="theme" class="large">
      <house-header :headTypeTwo="listData[id]"></house-header>
      <view class="main-content">
        <present :presentData="detailsData[id - 1]"></present>
        <view class="kong"></view>
        <timing
          :num="id"
          :endyear="endyear"
          class="bottom"
          v-if="!(id == 1)"
          @bwCountdown="bwCountdown"
          @end="end"
        >
        </timing>
        <submit
          :num="id"
          ref="child"
          :endyear="endyear"
          v-if="!(id == 2 || id == 5)"
          @subData="end"
        ></submit>
      </view>
      <view class="model-box">
        <u-modal
          v-model="show"
          :show-confirm-button="false"
          :show-title="false"
        >
          <view class="upmain">
            <view class="picBox">
              <img
                src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/img_result_bg%402x.png"
              />
            </view>
            <view class="box">
              <view class="title">本次测评结果</view>
              <view class="result">
                {{ result }}
              </view>
              <view class="ikonwBox">
                <u-button type="primary" shape="circle" @click="show = false"
                  >我知道了</u-button
                >
              </view>
            </view>
          </view>
        </u-modal>
      </view>
    </view>
  </theme>
</template>

<script>
import present from "./components/present.vue"
import submit from "./components/submit.vue"
import timing from "./components/timing.vue"
export default {
  components: {
    present,
    submit,
    timing
  },
  data() {
    return {
      listData: [
        "基础健康问卷",
        "坐位体前屈",
        "靠墙静蹲",
        "安静心率",
        "两分钟踏步",
        "单腿站立平衡"
      ],
      detailsData: [
        {
          url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/jkzp%E5%9D%90%E4%BD%8D%E4%BD%93%E5%89%8D%E5%B1%88.png",
          action: "动作要求：膝关节保持伸直",
          equipment: "设备要求：瑜伽垫"
        },
        {
          url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/jkzp%E9%9D%A0%E5%A2%99%E9%9D%99%E8%B9%B2.png",
          action: "动作要求：大腿与地面接近平行",
          equipment: "设备要求：墙壁"
        },
        {
          url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/jkzp%E9%9D%99%E5%AE%89%E5%BF%83%E7%8E%87.png",
          action:
            "动作要求：请您静坐3min，用手指腹侧触摸颈部气管外侧的凹陷中，感受颈动脉的搏动",
          equipment: ""
        },
        {
          url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/jkzp2%E5%88%86%E9%92%9F%E8%B8%8F%E6%AD%A5%E6%B5%8B%E8%AF%95.gif",
          action: "动作要求：膝盖需抬高至大腿长度的中点以上高度",
          equipment: ""
        },
        {
          url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/jkzp%E5%8D%95%E8%85%BF%E5%B9%B3%E8%A1%A1.png",
          action:
            "动作要求：站立位，双手放松放在身体两侧，缓慢抬起右腿离开地面，保持身体平衡，避免晃动",
          equipment: ""
        }
      ],
      id: "",
      subFlag: false,
      show: false,
      result: "",
      endyear: ""
    }
  },
  methods: {
    //结束倒计时
    bwCountdown() {
      this.$refs.child.start()
    },
    //弹出弹窗
    end(e) {
      this.result = e
      this.show = true
    }
  },
  onLoad(options) {
    this.id = this.$Route.query.id
    // this.id = options.id
    let startTime = new Date()
    let nowYear = startTime.getFullYear()
    this.endyear = nowYear
  }
}
</script>

<style scoped lang="scss">
.large {
  background: var(--bg-color-main);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background-color: var(--bg-color-second);
  display: flex;
  flex-direction: column;

  .kong {
    background-color: var(--bg-color-second);
    height: 15px;
  }

  .bottom {
    flex: 1;
    display: flex;
  }
}
/deep/.u-mode-center-box {
  background-color: transparent !important;
}
.model-box {
  /deep/ .u-model {
    background-color: transparent !important;
  }
}
.upmain {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  position: relative;
  .picBox {
    width: 150px;
    height: 150px;
    position: absolute;
    top: 0;
  }
  img {
    width: 100%;
    height: 100%;
  }

  .box {
    width: 100%;
    height: 80%;
    background: var(--bg-color-main);
    margin-top: 60px;
    border-radius: 10px;
    .title {
      margin-top: 105px;
      text-align: center;
      font-size: 32rpx;
      color: var(--text-color-main);
      padding: 10px 0;
    }

    .result {
      color: var(--text-color-main);
      padding: 30px 0;
      font-size: 34rpx;
      font-weight: 600;
      text-align: center;
    }
  }
}
.ikonwBox {
  width: 80%;
  margin: 15px auto;
}
</style>
