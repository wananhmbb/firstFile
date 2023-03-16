<template>
  <view class="box">
    <view class="feedback">
      <view class="title">反馈类型</view>
      <view class="radio-css">
        <u-radio-group v-model="radioValue">
          <u-radio
            @change="radioChange"
            v-for="(item, index) in list"
            :key="index"
            :name="item.id"
            :disabled="item.disabled"
          >
            {{ item.name }}
          </u-radio>
        </u-radio-group>
      </view>
    </view>
    <view class="contentBox">
      <view v-if="radioValue === 2" class="input-css">
        <u-input
          v-model="complaintUser"
          type="input"
          placeholder="请输入投诉对象(选填)"
          :border="true"
          @click="show = true"
        />
      </view>
      <view class="reason">
        <view class="title">{{
          radioValue === 1 ? "反馈原因" : "投诉原因"
        }}</view>
        <view class="tag-item" v-show="radioValue === 1">
          <u-tag
            v-for="(item, index) in tagListF"
            :key="index"
            :text="item.name"
            shape="circle"
            :type="item.active ? 'primary' : 'info'"
            @click="tagActive(index, item.active)"
          />
        </view>
        <view class="tag-item" v-show="radioValue === 2">
          <u-tag
            v-for="(item, index) in tagListT"
            :key="index"
            :text="item.name"
            shape="circle"
            :type="item.active ? 'primary' : 'info'"
            @click="tagActive(index, item.active)"
          />
        </view>
      </view>
      <view class="description">
        <view class="title">问题说明</view>
        <view class="tag-item">
          <u-input
            v-model="descriptionValue"
            type="textarea"
            placeholder="请输入问题说明"
            :border="true"
            maxlength="50"
            height="160"
            @click="show = true"
          />
        </view>
      </view>
      <view class="description">
        <view class="title">相关截图</view>
        <view class="tag-item">
          <u-upload
            ref="uUpload"
            :action="action"
            :header="header"
            :auto-upload="true"
            :file-list="fileList"
            upload-text=" "
            max-count="6"
            :show-progress="false"
            @on-change="change"
            @on-remove="remove"
            @on-success="success"
            @on-progress="progress"
            @on-error="error"
          ></u-upload>
        </view>
      </view>
      <view class="form-css"></view>
      <view class="basicInfo">
        <u-button
          type="primary"
          shape="circle"
          @click="btnOk"
          throttle-time="5000"
          >提交</u-button
        >
      </view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>
<script>
import { ACCESS_TOKEN } from "@/const/storage-key"
import { getFrequentlyTypeList, addComplaint } from "@/api/personal"

export default {
  data() {
    return {
      list: [
        {
          id: 1,
          name: "意见反馈",
          disabled: false
        },
        {
          id: 2,
          name: "投诉",
          disabled: false
        }
      ],
      complaintUser: "",
      tagListF: [],
      tagListT: [],
      radioValue: 1,
      descriptionValue: "",
      loading: false,
      action: process.env.VUE_APP_BASE_API_IP + "file/upload",
      header: {},
      fileList: [],
      dictTypef: "hjt_customer_complaint_type_f",
      dictTypet: "hjt_customer_complaint_type_t",

      images: ""
    }
  },
  options: { styleIsolation: "shared" },
  created() {
    this.frequentlyTypeListF(this.dictTypef)
    this.frequentlyTypeListT(this.dictTypet)

    this.header = {
      Authorization: "Bearer " + uni.getStorageSync(ACCESS_TOKEN)
    }
  },
  methods: {
    frequentlyTypeListF(dictType) {
      let params = {
        dictType: dictType
      }
      this.loading = true
      getFrequentlyTypeList(params)
        .then(res => {
          if (res.code === 200) {
            this.loading = false
            this.tagListF = []
            res.rows.map(item => {
              this.tagListF.push({
                name: item.dictLabel,
                id: item.dictCode,
                active: false
              })
            })
          } else {
            this.$refs.uToast.show({
              title: res.msg,
              type: "error"
            })
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err, "反馈原因异常")
        })
    },
    frequentlyTypeListT(dictType) {
      let params = {
        dictType: dictType
      }
      this.loading = true
      getFrequentlyTypeList(params)
        .then(res => {
          if (res.code === 200) {
            this.loading = false
            this.tagListT = []
            res.rows.map(item => {
              this.tagListT.push({
                name: item.dictLabel,
                id: item.dictCode,
                active: false
              })
            })
          } else {
            this.$refs.uToast.show({
              title: res.msg,
              type: "error"
            })
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err, "反馈原因异常")
        })
    },
    radioChange(e) {
      this.radioValue = e
      this.complaintUser = ""
      this.descriptionValue = ""
      this.images = ""
      if (e === 1) {
        this.tagListF.map(item => {
          item.active = false
        })
      }
      if (e === 2) {
        this.tagListT.map(item => {
          item.active = false
        })
      }
    },
    tagActive(index, active) {
      if (this.radioValue === 1) {
        if (active) {
          this.tagListF[index].active = false
        } else {
          this.tagListF[index].active = true
        }
      } else if (this.radioValue === 2) {
        if (active) {
          this.tagListT[index].active = false
        } else {
          this.tagListT[index].active = true
        }
      }
    },
    change(res, index, lists) {
      this.showLists = lists
    },
    remove(index, lists) {
      let allUrlArry = []
      lists.forEach(item => {
        allUrlArry.push(item.response.data.url)
      })
      this.images = allUrlArry
    },
    success(data, index, lists) {
      let allUrlArry = []
      var uploadImgSuccessArry = lists.filter(item => !item.response)
      uploadImgSuccessArry.forEach(item => {
        allUrlArry.push(item.url)
      })
      var uploadImgSuccessIng = lists.filter(item => item.response)
      uploadImgSuccessIng.forEach(item => {
        allUrlArry.push(item.response.data.url)
      })
      //图片去重
      let deleteSame = []
      for (var i = 0; i < allUrlArry.length; i++) {
        if (deleteSame.indexOf(allUrlArry[i]) === -1) {
          deleteSame.push(allUrlArry[i])
        } else {
          this.$refs.uUpload.remove(i)
          this.$refs.uToast.show({
            title: "图片已存在，请勿重复上传",
            type: "default"
          })
        }
      }
      this.images = deleteSame
    },
    progress() {
      uni.showLoading({
        mask: true,
        title: "上传中..."
      })
    },
    error(res, index, lists, name) {
      console.log(res, index, lists, name, "erro")
    },
    btnOk() {
      let causeList = []
      if (this.radioValue === 1) {
        this.tagListF.map(item => {
          if (item.active) {
            causeList.push(item.id)
          }
        })
      } else if (this.radioValue === 2) {
        this.tagListT.map(item => {
          if (item.active) {
            causeList.push(item.id)
          }
        })
      }

      this.cause = causeList.join()
      if (this.images) {
        this.images = this.images.join()
      }

      if (!this.cause) {
        this.$refs.uToast.show({
          title: this.radioValue === 1 ? "请选择反馈原因" : "请选择投诉原因",
          type: "warning"
        })
        return
      }
      if (!this.descriptionValue) {
        this.$refs.uToast.show({
          title: "请输入问题说明",
          type: "warning"
        })
        return
      }

      let data = {
        type: this.radioValue,
        cause: this.cause,
        user: this.complaintUser,
        images: this.images,
        explain: this.descriptionValue
      }
      // console.log(data, "data")
      addComplaint(data).then(res => {
        if (res.code === 200) {
          this.$refs.uToast.show({
            title: "提交成功",
            type: "success",
            duration: 1000
          })
        }
        setTimeout(() => {
          this.$emit("getTabData", true)
        }, 1000)
      })
    }
  }
}
</script>
<style scoped lang="scss">
.box {
  background: var(--bg-color-second);
}
/deep/.u-radio {
  margin-left: 24rpx;
}
/deep/.u-radio__label {
  margin-right: 0 !important;
}
.feedback {
  display: flex;
  height: 50px;
  align-items: center;
  background-color: var(--bg-color-main);
  justify-content: space-between;
  .title {
    font-size: 32rpx;
    font-weight: 600;
    padding-left: 5%;
    color: var(--text-color-main);
  }
  .radio-css {
    padding-right: 5%;
  }
}
.contentBox {
  margin-top: 20rpx;
  background-color: var(--bg-color-main);
  padding: 30rpx 5%;
  .input-css {
    margin: 10rpx 0 40rpx 0;
    /deep/ .u-input__input {
      min-height: 28px !important;
    }
  }
  .reason {
    .title {
      font-size: 32rpx;
      font-weight: 600;
      color: var(--text-color-main);
    }
    .tag-item {
      /deep/ .u-tag {
        margin: 20rpx 30rpx 0 0;
        padding: 10px 20px;
      }
    }
  }
  .description {
    margin-top: 40rpx;
    .title {
      font-size: 32rpx;
      font-weight: 600;
      margin-bottom: 20rpx;
      color: var(--text-color-main);
    }
  }
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
/deep/.u-add-wrap {
  color: var(--text-color-main) !important;
  background: var(--bg-color-second);
}
/deep/.u-delete-icon {
  background: #090909 !important;
  color: var(--text-color-white) !important;
  opacity: 0.6 !important;
}
/deep/.u-error-btn {
  background-color: var(--text-color-main) !important;
  color: var(--text-color-white) !important;
}
/deep/.u-input--border {
  border: 1px solid var(--bd-color-main) !important;
  background: var(--bg-color-second);
}
/deep/.u-mode-light-info {
  border: 1px solid var(--bd-color-main) !important;
  background-color: var(--bg-color-second) !important;
}
/deep/.u-input__textarea {
  color: var(--text-color-grey) !important;
}
.form-css {
  width: 100%;
  height: 85px;
  background: var(--bg-color-main);
}
</style>
