<template>
  <view class="main">
    <view class="text">性别</view>
    <view class="sex">
      <u-input
        v-model="form.sex"
        :custom-style="ipnCustomStyle"
        type="select"
        placeholder="请选择"
        border
        @click="sexShow = true"
      />
      <l-picker
        mode="selector"
        v-model="sexShow"
        :range="selector"
        @confirm="confirmSex"
        @cancel="sexShow = false"
      ></l-picker>
    </view>
    <view class="text mar">年龄</view>
    <u-input
      v-model="form.age"
      type="select"
      :custom-style="ipnCustomStyle"
      placeholder="请选择"
      border
      @click="pickTimeshow = true"
    />
    <l-picker
      mode="time"
      v-model="pickTimeshow"
      :params="params"
      @confirm="confirmTime"
      :end-year="endyear"
      @cancel="pickTimeshow = false"
    >
    </l-picker>

    <view v-if="!(num == 2 || num == 5)">
      <view class="text ipt mar" v-if="num == 1">
        <view> 指尖所能达到的最远位置 </view>
        <view class="title"> 单位cm </view>
      </view>
      <view class="text ipt mar" v-if="num == 3">
        <view> 心率 </view>
        <view class="title"> 次/分 </view>
      </view>
      <view class="text ipt mar" v-if="num == 4">
        <view> 完成双腿踏步 </view>
        <view class="title"> 次 </view>
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
      <view class="overburden" v-if="overburden" @click="handOverburden"></view>
      <u-button
        shape="circle"
        :custom-style="customStyle"
        type="primary"
        @click="sub"
        >提交</u-button
      >
    </view>

    <u-toast ref="uToast" />
  </view>
</template>

<script>
import LPicker from "@/components/basic-components/l-picker/l-picker"
import { SittingBodyFlexion, TwoMinuteStep } from "@/utils/healthy"
import { heartRateScore } from "@/api/service"
export default {
  props: ["num", "endyear"],
  components: {
    LPicker
  },
  options: { styleIsolation: "shared" },
  data() {
    return {
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
        background: "var(--bg-color-grey)",
        color: "var(--text-color-white)",
        fontSize: "16px"
      },
      ipnCustomStyle: {
        color: "var(--text-color-main)"
      },
      //评分
      appraise: "",
      //按钮覆盖层
      overburden: true
    }
  },
  mounted() {
    if (this.num == 1) {
      this.overburden = false
      this.customStyle.background = "var(--theme-color-dark-blue)"
    }
  },
  methods: {
    //未开始倒计时提交
    handOverburden() {
      this.$refs.uToast.show({
        title: "请开始倒计时并等待计时完成!",
        type: "error",
        icon: true
      })
    },
    //提交
    sub() {
      if (!this.form.sex) {
        this.$refs.uToast.show({
          title: "请选择性别!",
          type: "error",
          icon: true
        })
        return
      }
      if (!this.form.age) {
        this.$refs.uToast.show({
          title: "请选择年龄!",
          type: "error",
          icon: true
        })
        return
      }
      if (!this.form.value) {
        this.$refs.uToast.show({
          title: "请输入次数!",
          type: "error",
          icon: true
        })
        return
      } else if (!Number.isInteger(Number(this.form.value))) {
        this.$refs.uToast.show({
          title: "请输入数字次数!",
          type: "error",
          icon: true
        })
        return
      }
      this.evaluate(this.num)
    },
    //获取评分
    evaluate(e) {
      if (e == 1) {
        this.appraise = SittingBodyFlexion(this.form)
        this.$emit("subData", this.appraise)
        this.form.sex = ""
        this.form.age = ""
        this.form.value = ""
      } else if (e == 3) {
        uni.showLoading({
          title: "加载中",
          mask: true
        })
        let data = {
          sex: this.form.sex == "男" ? "man" : "woman",
          age: Number(this.form.age),
          value: Number(this.form.value)
        }
        heartRateScore(data).then(res => {
          if (res.code == 200) {
            this.appraise = res.data.result
            this.success()
            setTimeout(function () {
              uni.hideLoading()
            }, 100)
          }
        })
      } else if (e == 4) {
        this.appraise = TwoMinuteStep(this.form)
        this.success()
      }
    },
    //获取评分成功
    success() {
      this.$emit("subData", this.appraise)
      this.$bus.$emit("reset")
      this.customStyle.background = "var(--bg-color-grey)"
      this.overburden = true
      this.form.sex = ""
      this.form.age = ""
      this.form.value = ""
    },
    //结束倒计时后
    start() {
      this.customStyle.background = "var(--theme-color-dark-blue)"
      this.overburden = false
    },
    //下来框选择
    confirmSex(e) {
      // console.log(e);
      if (e[0] == 0) {
        this.form.sex = "男"
      } else {
        this.form.sex = "女"
      }
    },
    confirmTime(e) {
      let str = e.year + "-" + e.month + "-" + e.day
      let a = this.ages(str)
      this.form.age = String(a)
    },
    //根据生日获取年龄
    ages(str) {
      var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
      if (r == null) return false
      var d = new Date(r[1], r[3] - 1, r[4])
      if (
        d.getFullYear() == r[1] &&
        d.getMonth() + 1 == r[3] &&
        d.getDate() == r[4]
      ) {
        var Y = new Date().getFullYear()
        return Y - r[1]
      }
      return "输入的日期错误！"
    }
  }
}
</script>

<style scoped lang="scss">
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

.overburden {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 99;
}
</style>
