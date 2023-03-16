<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="我的档案"></house-header>
      <formTemplate
        ref="formTemplate"
        :notice="formInfoList"
        :medicalId="medicalCardId"
        :enableValue="enableValue"
        v-show="enableValue"
      ></formTemplate>
      <noFile
        v-show="enableValue === false"
        @changeEnable="changeEnable"
      ></noFile>
      <!-- <vieW class="mask"> <view @click="Ikonw"> 你好</view> </vieW> -->
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
import formTemplate from "@/components/form/formTemplate.vue"
import noFile from "./components/noFile.vue"
import { getPersonalarchivesModule } from "@/api/service"
export default {
  components: {
    formTemplate,
    noFile
  },
  data() {
    return {
      formShow: false,
      loading: true,
      enableValue: null,
      servicePackageId: "",
      medicalCardId: "",
      formInfoList: {
        servicePackageId: "",
        formModuleInfoList: []
      }
    }
  },
  onLoad(option) {
	console.log(option,51111111111111111111111)
    this.medicalCardId = option.medicalCardId
    this.servicePackageId = option.servicePackageId
    this.formInfoList.servicePackageId = this.servicePackageId
    this.getPersonalArchivesModuleInfo(
      this.servicePackageId,
      this.medicalCardId
    )
  },
  methods: {
    changeEnable(data) {
      this.enableValue = data
      this.$nextTick(() => {
        this.$refs["formTemplate"].edit()
      })
    },
    //查询需要填写的检测信息
    getPersonalArchivesModuleInfo(servicePackageId, medicalCardId) {
      getPersonalarchivesModule(servicePackageId, medicalCardId)
        .then(res => {
          this.loading = false
          if (res.code === 200) {
            let sendObj = {}
            sendObj.servicePackageId = this.servicePackageId
            sendObj.formModuleInfoList = res.data
            for (let key in sendObj.formModuleInfoList.question) {
              sendObj.formModuleInfoList.question[key].forEach(item => {
                if (item.expand) {
                  let expand = JSON.parse(item.expand)
                  if (expand.unit) {
                    item.viewTitle = item.viewTitle + "(" + expand.unit + ")"
                  }
                }
              })
            }
            this.formInfoList = sendObj
            this.enableValue = res.data.fillIn
            this.formShow = true
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err)
        })
    }
  }
}
</script>
<style lang="scss">
.u-form-item {
  .u-input {
    text-align: right !important;
  }
}
</style>
<style lang="scss" scoped>
.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-second);
}
.loading-box {
  width: 100vw;
  height: 90vh;
  margin: auto auto;
  text-align: center;
  line-height: 90vh;
}
.mask {
  width: 100%;
  height: 100vh;
  background: #000;
  color: red;
  position: absolute;
  top: 100px;
  z-index: 1001;
}
</style>
