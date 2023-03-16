<template>
  <theme>
    <view class="all" slot="theme">
      <view class="content">
        <house-header headTypeTwo="核联医"></house-header>
        <view class="main-box">
          <u-form
            :model="form"
            ref="uForm"
            label-width="100"
            :error-type="errorType"
            :border-bottom="true"
          >
            <u-form-item
              :border-bottom="true"
              prop="nickname"
              label="姓名"
              label-width="150">
              <u-input
                :custom-style="customStyle"
                v-model="form.nickname"
                :focus="focus"
                :type="'text'"
                :disabled="false"
                :clearable="true"
                :required="true"
              />
            </u-form-item>
           <u-form-item
             :border-bottom="true"
             prop="sex"
             label="性别"
             label-width="150"
           >
             <view  @click="sexShow = true">{{ form.sex == 0 ? "男" : "女"}}</view>
           </u-form-item>
		   
		   <u-form-item
		     :border-bottom="true"
		     prop="birthday"
		     label="出生日期"
		     label-width="150"
		   >
		     <view  @click="pickTimeshow = true">{{ form.birthday ? form.birthday : '请选择您的生日'}}</view>
		   </u-form-item>
		   
          </u-form>
		  
		  
          <u-button @click="submit"  type="primary" shape="circle">提交</u-button>
         <!-- 性别 -->
         <l-picker
           mode="selector"
            v-model="sexShow"
           :default-selector="[form.sex]"
           :range="selector"
           @confirm="confirmSex"
           @cancel="cancelSex"
         ></l-picker>
		 <l-picker
		   mode="time"
		   v-model="pickTimeshow"
		   :params="params"
		   @confirm="confirmTime"
		   :default-time="[form.birthday]"
		   :end-year="endyear"
		 ></l-picker>
        </view>
      </view>
	  <u-toast ref="uToast"></u-toast>
	  <popUpNotification
	    v-if="show"
	    :content="content"
	    @goWrite="goWrite"
	  ></popUpNotification>
	  <view class="" @click="show = true">
	  	弹框组件
	  </view>
    </view>
    </theme>
</template>
<script>
import {USER_INFO} from "@/const/storage-key"
import {userInfoEdit} from "@/api/user"
import LPicker from "@/components/basic-components/l-picker/l-picker"
// import { basicUser } from "@/utils/user-class/basicUser";
import popUpNotification from "@/components/components/pop_up_notification/pop_up_notification.vue"
export default {
  name: "profile",
  components: {
    LPicker,
	popUpNotification
  },
  data() {
    return {
	  content:'弹框内容',
	  show:false,
      sexShow: false,
      pickTimeshow: false,
	  defaultSelector: [0],
      endyear: "",
      form: {},
      params: {
        year: true,
        month: true,
        day: true
      },
      selector: ["男", "女"],
      errorType: ["toast"],
      customStyle: {
        color: "var(--text-color-main)"
      },
      rules: {
        nickname: [
          {
            type: "string",
            required: true,
            message: "请输入姓名"
          }
        ],
        phone: [
          {
            type: "number",
            required: true,
            len: 11,
            message: "请输入正确的手机号",
            pattern: /^1[3456789]\d{9}$/,
            trigger: ["blur", "change"]
          }
        ],
      }
    }
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  onLoad() {
    this.form = uni.getStorageSync(USER_INFO)
    let startTime = new Date()
    let nowYear = startTime.getFullYear()
    this.endyear = nowYear
  },
  methods: {
	  goWrite(val) {
	    console.log("子传父的值", val)
	    this.show = false
	    // uni.navigateTo({
	    //   url: `/createFile?servicePackageId=${this.servicePackageUserId}
	  		// 	     &medicalCardId=${this.medicalCardId}`
	    // })
	  },
	  timeflag(){
		  console.log(this.form)
		  this.pickTimeshow = true
		  
	  },
    confirmTime(e) {
      this.form.birthday = e.year + "-" + e.month + "-" + e.day
      // let params = {
      //   userId: this.userInfo.user_id,
      //   birthday: this.userInfo.birthday
      // }
    },
    confirmSex(data) {
      this.form.sex = [data[0]]
      // let params = {
      //   userId: this.userInfo.user_id,
      //   sex: data[0]
      // }
    },
    cancelSex() {
      this.sexShow = false
    },
    submit() {
      this.$refs.uForm.validate(valid => {
		  console.log(valid,189)
		  
        if (valid) {
          let params = {
            userId: this.form.user_id,
            nickname: this.form.nickname
          }
          userInfoEdit(params)
            .then(res => {
              if (res.code === 200) {
				  this.$refs.uToast.show({
				    title: '修改成功',
				    type: "success"
				  })
				  setTimeout(() => {
				    uni.setStorageSync(USER_INFO,Object.assign(this.form, {nickname: this.form.nickname}))
                uni.navigateBack({
                  delta: 1
                })
				  }, 1000)
                
              }else{
				   this.$refs.uToast.show({
				     title: '修改失败',
				     type: "error"
				   })
			  }
            })
            .catch(err => {
              console.error(err)
            })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.all {
	position: relative;
  height: 100vh;
  background: var(--bg-color-second);
  // background: var(--bg-color-main);
  .main-box {
    width: 100%;
    box-sizing: border-box;
    // padding: 0 2%;
  }
 
}

u-button{
	position: absolute;
	bottom: 80rpx;
	width: 90vw;
	border-radius: 80rpx !important;
	left: 50%;
	transform: translateX(-50%)
}
/deep/ .u-form{
	background: var(--bg-color-main) !important;
	// width: 100vw;
	padding: 0 2%;
}
// /deep/ info-item{
	
// }
</style>
