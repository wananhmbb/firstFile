<template>
  <view>
    <view>
      <u-input
        :custom-style="customStyle"
        v-model="pickValue"
        @click="chooseTime"
        :disabled="true"
        :focus="false"
        :placeholder="placeholderValue"
        :type="type"
      />
    </view>

    <u-popup v-model="checkBoxShow" mode="bottom" height="35%">
      <view class="popupBox">
        <view class="popupBtnBox">
          <view @click="cancel">取消</view>
          <view>{{ title }}</view>
          <view @click="confirm" class="confirmText">确定</view>
        </view>
        <view class="maskBox"></view>
        <view class="itemBox">
          <view
            :class="item.selected ? 'chooseitem' : 'item'"
            v-for="(item, index) in list"
            :key="index"
            @click="choose(item, index)"
          >
            {{ item.title }}
          </view>
          <view class="item1"> </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  props: ["infoObj", "enable", "infoValue", "formId", "keyValue"],
  data() {
    return {
      customStyle: {
        color: "var(--text-color-main)"
      },
      pickValue: "",
      placeholderValue: "",
      checkBoxShow: false,
      disabled: null,
      title: "",
      list: [],
      type: "textarea",
      height: 100,
      autoHeight: true
    }
  },
  watch: {
    enable(newVal) {
      this.disabled = newVal
    },
    infoValue: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.pickValue = this.infoValue
        }
      }
    }
  },
  created() {
    this.getTimeInfo()
  },
  methods: {
    getTimeInfo() {
      this.placeholderValue = this.infoObj.placeholder
      this.disabled = this.enable
      this.title = this.infoObj.title
      let list = Array.isArray(this.infoObj.expand)
        ? this.infoObj.expand
        : JSON.parse(this.infoObj.expand)
      this.pickValue = this.infoValue
      if (this.infoObj.type === "checkbox.ex") {
        list.forEach(item => {
          this.list.push({ title: item.value, selected: false })
        })
      } else {
        list.forEach(item => {
          this.list.push({ title: item, selected: false })
        })
      }
    },
    chooseTime() {
      wx.hideKeyboard()
      if (!this.disabled) {
        this.checkBoxShow = true
      }
      this.list.forEach(item => {
        let jsonStr = this.infoValue.split(",")
        if (jsonStr) {
          jsonStr.forEach(i => {
            if (item.title === i) {
              item.selected = true
            }
          })
        }
      })
    },
    confirm() {
      let moudleId = this.infoObj.key
      let list = this.list.filter(item => item.selected === true)
      let chooseValue = []
      list.forEach(item => {
        chooseValue.push(item.title)
      })
      let chooseStr = chooseValue.length > 0 ? chooseValue.join(",") : ""
      this.$emit(
        "getRadioData",
        chooseStr,
        moudleId,
        this.formId,
        this.keyValue
      )
      this.checkBoxShow = false
    },
    cancel() {
      this.checkBoxShow = false
    },
    choose(item, index) {
      this.list[index].selected = !item.selected
      let newVal = []
      this.list.forEach(item => {
        if (item.selected === true) {
          newVal.push(item.title)
        }
      })
      this.pickValue = newVal.join(",")
    }
  }
}
</script>

<style lang="scss" scoped>
.popupBox {
  height: 100%;
  background: var(--bg-color-main);
}
.popupBtnBox {
  border-bottom: 1px solid var(--bd-color-main);
  background: var(--bg-color-second);
  z-index: 10;
  display: flex;
  justify-content: space-between;
  line-height: 50px;
  padding: 0 3%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  view:first-child {
    color: var(--text-color-main);
  }
}
.maskBox {
  background: var(--bg-color-main);
  width: 100%;
  height: 50px;
}
.confirmText {
  color: var(--theme-color-dark-blue);
}
.itemBox {
  width: 90%;
  margin: auto;
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  .item {
    align-self: center;
    width: 30%;
    background: var(--bg-color-second);
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 2px;
    text-align: center;
  }
  .chooseitem {
    align-self: center;
    width: 30%;
    background: var(--theme-color-dark-blue);
    color: #fff;
    text-align: center;
    padding: 2px;
    margin-bottom: 10px;
    border-radius: 10px;
  }
  .item1 {
    width: 30%;
    text-align: center;
    margin-bottom: 10px;
  }
}
</style>
