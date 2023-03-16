<template>
  <theme>
    <view slot="theme" class="main">
      <house-header :headTypeTwo="headTypeTwo"></house-header>
      <view class="content-box">
        <u-upload
          :fileList="fileList"
          :max-count="maxCount"
          :deletable="true"
          :show-progress="false"
          @on-change="change"
          @on-remove="remove"
          :action="action"
          :header="header"
          :auto-upload="true"
          @on-success="success"
          @on-progress="progress"
          @on-error="error"
        ></u-upload>
        <view>请上传你的影像文件</view>
      </view>
      <view class="bottom-btn">
        <u-button type="primary" shape="circle" @click="uploadImageBtn"
          >点击上传</u-button
        >
      </view>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>

<script>
import {ACCESS_TOKEN} from "@/const/storage-key"
import {RequestList} from "@/utils/requestCode"
import {createReportApi} from "@/api/report-interpretation"

export default {
  name: "index",
  data() {
    return {
      headTypeTwo: "上传报告",
      fileList: [],
      maxCount: 1,

      action: process.env.VUE_APP_BASE_API_IP + "file/upload",
      header: {
        Authorization: "Bearer " + uni.getStorageSync(ACCESS_TOKEN)
      }
    }
  },
  methods: {
    change(res, index, lists, name) {
      this.showLists = lists
    },
    progress(res) {
      uni.showLoading({
        mask: true,
        title: "上传中..."
      })
    },
    success(res, index) {
      this.fileList[index] = res.data.url
	  this.$refs.uToast.show({
	    title: "上传成功",
	    type: "success"
	  })
    },
    error(res, index) {
      this.fileList.splice(index, 1)
    },
    remove(index) {
      this.fileList.splice(index, 1)
    },
    validateData() {
      let that = this
      if (this.fileList?.length) {
        return true
      } else {
        that.$refs.uToast.show({
          title: "请上传文件",
          type: "error"
        })
        return false
      }
    },
    uploadImageBtn() {
      if (!this.validateData()) {
        return
      }
      let that = this
      const obj = {
        url: this.fileList[0],
        title: null,
        subjoin: null,
        suffix: this.fileList[0]
          .substring(this.fileList[0].lastIndexOf("."))
          .split(".")[1],
        medicalCardId: uni.getStorageSync("userInfo").medicalCardList[0].id,
        doctorId: null
      }
      createReportApi(obj)
        .then(res => {
          if (res.code === RequestList.SUCCESS_CODE) {
            that.$refs.uToast.show({
              title: "上传成功",
              type: "success"
            })
            uni.navigateBack({
              delta: 1
            })
          } else {
            that.$refs.uToast.show({
              title: res.msg,
              type: "error"
            })
          }
        })
        .catch(err => {
          this.$refs.uToast.show({
            title: "上传失败",
            type: "error"
          })
          console.error(err)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  box-sizing: border-box;
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 4%;
    box-sizing: border-box;
  }
  .bottom-btn {
    position: fixed;
    bottom: 3vh;
    left: 50%;
    transform: translateX(-50%);
    width: 92%;
    margin: 0 auto;
  }
}
</style>
