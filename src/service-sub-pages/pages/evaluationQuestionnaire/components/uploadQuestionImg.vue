<template>
  <view class="uUploadBox">
    <view class="questionnaireTitle">{{ title }}</view>
    <view class="optionBox">
      <u-upload
        ref="uUpload"
        :action="action"
        :header="header"
        :auto-upload="true"
        :file-list="fileList"
        upload-text=" "
        :show-progress="false"
        :max-count="maxCount"
        :deletable="enable"
        @on-change="change"
        @on-remove="remove"
        @on-success="success"
        @on-progress="progress"
        @on-error="error"
      ></u-upload>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { ACCESS_TOKEN } from "@/const/storage-key"
export default {
  props: {
    questionList: {
      type: Object
    },
    allAnswerObj: {
      type: Object
    }
  },
  data() {
    return {
      enable: true,
      showLists: [],
      title: "",
      fileList: [],
      maxCount: 9,
      action: process.env.VUE_APP_BASE_API_IP + "file/upload",
      header: {},
      questionCode: "",
      value: ""
    }
  },
  watch: {
    questionList: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.value = ""
          this.title = val.title
          this.questionCode = val.code
          this.optionCode = val.option[0].optionCode
          //数据回显
          if (Object.keys(this.allAnswerObj).length > 0) {
            this.enable = false
            let answerCode = this.allAnswerObj[this.questionCode]
            if (answerCode) {
              let arr = []
              this.value = answerCode[this.optionCode]
              let urlList = this.value.split(",")
              urlList.forEach(item => arr.push({ url: item }))
              this.fileList = arr
              this.maxCount = this.fileList.length
              this.byval(this.value)
            }
          }
          //存在本地填写过的答案
          else {
            let storageSubmitObj = uni.getStorageSync("formListSubmitObj")
            if (storageSubmitObj[this.questionCode]) {
              let arr = []
              let answerCode = storageSubmitObj[this.questionCode]
              this.value = answerCode[this.optionCode]
              let urlList = this.value.split(",")
              urlList.forEach(item => arr.push({ url: item }))
              this.fileList = arr
              this.byval(this.value)
            }
          }
        }
      }
    }
  },
  created() {
    this.header = {
      Authorization: "Bearer " + uni.getStorageSync(ACCESS_TOKEN)
    }
  },
  options: { styleIsolation: "shared" },
  methods: {
    remove(index, lists, name) {
      let allUrlArry = []
      let allUrl = ""
      lists.forEach(item => {
        allUrlArry.push(item.url)
      })
      allUrl = allUrlArry.join(",")
      this.byval(allUrl)
    },
    success(data, index, lists) {
      let allUrlArry = []
      let allUrl = ""
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
      //向父组件传图片值
      allUrl = deleteSame.join(",")
      this.byval(allUrl)
    },
    change(res, index, lists, name) {
      this.showLists = lists
    },
    progress(res) {
      uni.showLoading({
        mask: true,
        title: "上传中..."
      })
    },
    error(res, index, lists, name) {
      console.log(res, index, lists, name, "erro")
    },
    byval(value) {
      let answerObj = {}
      let valueObj = {}
      valueObj[this.optionCode] = value
      answerObj[this.questionCode] = valueObj
      this.$emit("getAnswers", this.questionCode, valueObj, value)
    },
    clear() {
      this.$refs.uUpload.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
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
/deep/.u-list-item {
  background: var(--bg-color-second) !important;
}
.upload {
  /deep/.u-list-item {
    height: 70px !important;
  }
}
.uUploadBox {
  margin-top: 25px;
  .questionnaireTitle {
    font-size: 34rpx;
    font-weight: bold;
    color: var(--text-color-main);
  }
  .optionBox {
    margin: 20px auto auto auto;
  }
}
</style>
