<template>
  <theme>
    <view slot="theme" class="large">
      <house-header headTypeTwo="坐位体前屈"></house-header>
      <view class="main-content">
        <view class="present">
          <view class="main">
            <img :src="presentData.url" mode="widthFix" />
            <view class="text">
              <view class="round"></view>
              <view class="title">
                {{ presentData.action }}
              </view>
            </view>
            <view class="text" v-if="presentData.equipment">
              <view class="round"></view>
              <view class="title">
                {{ presentData.equipment }}
              </view>
            </view>
          </view>
        </view>
        <view class="kong"></view>
        <view class="submit">
          <view class="main">
            <view>
              <view class="text ipt mar">
                <view> 指尖所能达到的最远位置 </view>
                <view class="title"> 单位cm </view>
              </view>
              <u-input
                v-model="form.value"
                :custom-style="ipnCustomStyle"
                type="number"
                border
                placeholder="请输入"
              />
            </view>

            <view class="btn">
              <u-button
                shape="circle"
                :custom-style="customStyle"
                type="primary"
                @click="sub"
                >下一步
              </u-button>
            </view>
          </view>
        </view>
      </view>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>

<script>
import LPicker from "@/components/basic-components/l-picker/l-picker"
export default {
  components: {
    LPicker
  },
  data() {
    return {
      presentData: {
        url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/jkzp%E5%9D%90%E4%BD%8D%E4%BD%93%E5%89%8D%E5%B1%88.png",
        action: "动作要求：膝关节保持伸直",
        equipment: "设备要求：瑜伽垫"
      },
      form: {
        sex: "",
        age: "",
        value: ""
      },
      //性别
      sexShow: false,
      selector: ["男", "女"],
      //年龄
      pickTimeshow: false,
      params: {
        year: true,
        month: true,
        day: true
      },
      customStyle: {
        background: "var(--theme-color-dark-blue)",
        color: "var(--text-color-white)",
        fontSize: "16px"
      },
      ipnCustomStyle: {
        color: "var(--text-color-main)"
      },
      multipleData: {}
    }
  },
  methods: {
    //提交
    sub() {
      if (!this.form.value) {
        this.$refs.uToast.show({
          title: "请输入次数!",
          type: "error",
          icon: true
        })
        return
      }
      this.multipleData.evaluationContent.push({
        value: this.form.value * 1,
        type: 0
      })
      this.$Router.push({
        path: "/squatAgainstTheWall",
        query: {
          data: this.multipleData
        }
      })
      // console.log(this.multipleData, 111);
      // console.log("坐位体前屈", this.form);
    }
  },
  onLoad() {
    this.multipleData = this.$Route.query.data
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
  // display: flex;
  // flex-direction: column;

  .present {
    width: 100%;

    .main {
      padding: 15px;
      background-color: var(--bg-color-main);

      img {
        height: 206px;
        width: 100%;
      }

      .text {
        display: flex;
        align-items: center;
        margin-top: 15px;

        .round {
          width: 8px;
          height: 8px;
          background-color: var(--theme-color-dark-blue);
          border-radius: 4px;
          margin-right: 5px;
        }

        .title {
          flex: 1;
          color: var(--text-color-main);
        }
      }
    }
  }

  .submit {
    /deep/.u-icon__icon {
      color: var(--bg-color-main) !important;
    }

    .main {
      padding: 15px;
      background-color: var(--bg-color-main);

      .text {
        color: var(--text-color-grey);
        margin-bottom: 5px;
      }

      .mar {
        margin-top: 15px;
      }

      .title {
        color: var(--text-color-grey);
        font-size: 16px;
      }
    }

    .ipt {
      display: flex;
      justify-content: space-between;
    }

    .btn {
      margin-top: 20px;
      position: relative;
    }
  }

  .kong {
    background-color: var(--bg-color-second);
    height: 15px;
  }

  .bottom {
    flex: 1;
    display: flex;
  }
}
</style>
