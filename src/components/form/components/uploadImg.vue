<template>
  <view>
    <view class="titleBox">
      <view v-show="!enable"></view>
      <view class="uploadType">{{ categoryName }}</view>
    </view>
    <view v-if="!enable">
      <view class="uploadExplain">
        <richTextComponent :htmlData="description"></richTextComponent>
      </view>
      <view class="InstanceTitle">
        <view></view>
        <view>示例</view>
        <view
          @click="lookClaim()"
          v-if="
            fileList.length == 0 && !enable && showLists.length == 0 && exTips
          "
          ><image
            src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/eac3d0bab73970542d2866fbfbe7827.png"
          ></image
        ></view>
      </view>
      <view class="upload">
        <u-upload
          :fileList="fileList1"
          :max-count="maxCount1"
          :deletable="false"
          :show-progress="false"
        ></u-upload>
      </view>
      <view class="InstanceTitle">
        <view></view>
        <view>请上传</view>
      </view>
    </view>
    <view class="uUploadBox">
      <u-upload
        ref="uUpload"
        :action="action"
        :header="header"
        :auto-upload="true"
        :file-list="fileList"
        upload-text=" "
        :show-progress="false"
        :max-count="maxCount"
        :deletable="!enable"
        @on-change="change"
        @on-remove="remove"
        @on-success="success"
        @on-progress="progress"
        @on-error="error"
      ></u-upload>
      <view
        class="plusBox"
        v-if="
          fileList.length == 0 && !enable && showLists.length == 0 && exTips
        "
        @click="toUpload"
      >
        <view class="u-list-item u-add-wrap">
          <u-icon name="plus" class="u-add-btn" size="40"></u-icon>
        </view>
      </view>
    </view>
    <u-popup v-model="popupShow" width="100%">
      <house-header headTypeTwo=" "></house-header>
      <view class="htmlBox">
        <view class="parse">
          <richTextComponent :htmlData="exTips"></richTextComponent>
        </view>
      </view>
      <view class="form-css"></view>
      <view class="button">
        <u-button type="primary" shape="circle" @click="close()">
          我知道了
        </u-button>
      </view>
    </u-popup>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { ACCESS_TOKEN } from "@/const/storage-key"
export default {
  props: ["infoObj", "enable", "infoValue"],
  data() {
    return {
      showLists: [],
      popupShow: false,
      categoryName: "",
      description: "",
      exTips: null,
      fileList1: [],
      fileList: [],
      maxCount: 6,
      maxCount1: null,
      action: process.env.VUE_APP_BASE_API_IP + "file/upload",
      header: {},
      noUpload: null
    }
  },
  watch: {
    enable: {
      handler(val) {
        if (!this.enable) {
          this.maxCount = 6
        }
      }
    }
  },
  options: { styleIsolation: "shared" },
  created() {
    this.header = {
      Authorization: "Bearer " + uni.getStorageSync(ACCESS_TOKEN)
    }
    this.getPictureInfo()
    if (this.enable == true) {
      this.maxCount = this.fileList.length
    }

    // console.log(this.fileList.length, this.maxCount, this.enable, "zkppp")
  },
  methods: {
    toUpload() {
      this.popupShow = true
      this.noUpload = true
    },
    lookClaim() {
      this.popupShow = true
      this.noUpload = false
    },
    close() {
      this.popupShow = false
      if (this.noUpload) {
        this.$refs.uUpload.selectFile()
      }
    },
    //获取上传图片信息
    getPictureInfo() {
      let arr = []
      if (this.infoValue) {
        let urlList = this.infoValue.split(",")
        urlList.forEach(item => arr.push({ url: item }))
        this.fileList = arr
      }
      let exampleArr = []
      //上传图片分类型的数据
      if (this.infoObj.expand) {
        this.typeUploadInfo = JSON.parse(this.infoObj.expand)
        this.categoryName = this.infoObj.title
        this.exTips = this.typeUploadInfo.exTips
        this.description = this.typeUploadInfo.description
        let urlList1 = this.typeUploadInfo.example.split(",")
        urlList1.forEach(item => exampleArr.push({ url: item }))
        this.fileList1 = exampleArr
        this.maxCount1 = this.fileList1.length
      }
    },
    remove(index, lists, name) {
      console.log(index, lists, name)
      let moudleId = this.infoObj.key
      // console.log(index, lists, name, "移出")
      let allUrlArry = []
      let allUrl = ""
      lists.forEach(item => {
        // console.log(item.url, "item")
        allUrlArry.push(item.url)
      })
      allUrl = allUrlArry.join(",")
      this.$emit("getRadioData", allUrl, moudleId)
    },
    success(data, index, lists) {
      console.log(data, index, lists, "success")
      let moudleId = this.infoObj.key
      let allUrlArry = []
      let allUrl = ""
      var uploadImgSuccessArry = lists.filter(item => !item.response)
      // console.log(uploadImgSuccessArry, "uploadImgSuccessArry")
      uploadImgSuccessArry.forEach(item => {
        allUrlArry.push(item.url)
      })
      var uploadImgSuccessIng = lists.filter(item => item.response)
      // console.log(uploadImgSuccessIng, "uploadImgSuccessIng")
      uploadImgSuccessIng.forEach(item => {
        // console.log(item.response.data.url, "uploadImgSuccessIng")
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
      this.$emit("getRadioData", allUrl, moudleId)
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
.upload {
  /deep/.u-list-item {
    height: 70px !important;
  }
}
.uploadType {
  font-size: 16px;
  font-weight: 400;
  color: var(--text-color-main);
}
.uploadExplain {
  font-size: 14px;
  color: var(--text-color-grey);
}
.InstanceTitle {
  display: flex;
  align-items: center;
  view:first-child {
    width: 8px;
    height: 8px;
    background: #d8d8d8;
    border: 1px solid #979797;
    margin-right: 3px;
    border-radius: 50%;
  }
  view:nth-child(2) {
    padding-left: 5px;
    color: var(--text-color-mian);
    margin-right: 8px;
  }
  view:nth-child(3) {
    width: 20px;
    height: 20px;
    image {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }
}
.titleBox {
  display: flex;
  align-items: center;
  view:first-child {
    width: 4px;
    height: 12px;
    background: var(--theme-color-dark-blue);
    border-radius: 2px;
    margin-right: 8px;
  }
}
.uUploadBox {
  position: relative;
  .plusBox {
    position: absolute;
    top: 0;
    .u-list-item {
      width: 200rpx;
      height: 200rpx;
      overflow: hidden;
      margin: 10rpx;
      background: var(--bg-color-second);
      position: relative;
      border-radius: 10rpx;
      /* #ifndef APP-NVUE */
      display: flex;
      /* #endif */
      align-items: center;
      justify-content: center;
    }
    .u-add-wrap {
      flex-direction: column;
      font-size: 26rpx;
    }
  }
}
.button {
  width: 100%;
  padding: 10px 5%;
  margin: auto;
  position: fixed;
  bottom: 0;
  background: var(--bg-color-main);
}
.form-css {
  width: 100%;
  height: 60px;
  background: var(--bg-color-main);
}
.htmlBox {
  width: 100%;
  background: var(--bg-color-main);
}
.parse {
  width: 90%;
  margin: auto;
}
</style>
