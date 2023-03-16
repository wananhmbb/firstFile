<template>
	<view class="popup-all">
		<u-popup v-model="show" mode="center" width="85vw" borderRadius="40" close-icon-size="35rpx" closeable="true" class="popup">
			<view class="popup-title">温馨提示</view>

			<view class="popup-body">
				{{ content }}
				<view class="main-box">
					<u-form :model="form" ref="uForm" label-width="100" :error-type="errorType" :border-bottom="true">
						<u-form-item :border-bottom="true" prop="nickname" label="姓名" label-width="150">
							<u-input :custom-style="customStyle" v-model="form.nickname" :focus="focus" :type="'text'" :disabled="false" :clearable="true" :required="true" />
						</u-form-item>
						<u-form-item :border-bottom="true" prop="sex" label="性别" label-width="150">
							<view @click="sexShow = true">{{ form.sex == 0 ? '男' : '女' }}</view>
						</u-form-item>

						<u-form-item :border-bottom="true" prop="birthday" label="出生日期" label-width="150">
							<view @click="pickTimeshow = true">{{ form.birthday ? form.birthday : '请选择您的生日' }}</view>
						</u-form-item>
						<u-form-item :border-bottom="true" prop="birthday" label="出生日期" label-width="150">
							<view @click="pickTimeshow = true">{{ form.birthday ? form.birthday : '请选择您的生日' }}</view>
						</u-form-item>
						<u-form-item :border-bottom="true" prop="birthday" label="出生日期" label-width="150">
							<view @click="pickTimeshow = true">{{ form.birthday ? form.birthday : '请选择您的生日' }}</view>
						</u-form-item>
						<u-form-item :border-bottom="true" prop="birthday" label="出生日期" label-width="150">
							<view @click="pickTimeshow = true">{{ form.birthday ? form.birthday : '请选择您的生日' }}</view>
						</u-form-item>
						<u-form-item :border-bottom="true" prop="birthday" label="出生日期" label-width="150">
							<view @click="pickTimeshow = true">{{ form.birthday ? form.birthday : '请选择您的生日' }}</view>
						</u-form-item>
						<u-form-item :border-bottom="true" prop="birthday" label="出生日期" label-width="150">
							<view @click="pickTimeshow = true">{{ form.birthday ? form.birthday : '请选择您的生日' }}</view>
						</u-form-item>
					</u-form>

					<u-button @click="submit" type="primary" shape="circle">提交</u-button>
					<!-- 性别 -->
					<l-picker mode="selector" v-model="sexShow" :default-selector="[form.sex]" :range="selector" @confirm="confirmSex" @cancel="cancelSex"></l-picker>
					<l-picker mode="time" v-model="pickTimeshow" :params="params" @confirm="confirmTime" :default-time="[form.birthday]" :end-year="endyear"></l-picker>
				</view>
			</view>
			<!-- <view class="bottom-box">
  	          <button @click="confirm" class="popup-btn">确定</button>
  	        </view> -->
		</u-popup>
	</view>
</template>

<script>
import { USER_INFO } from '@/const/storage-key';
import { userInfoEdit } from '@/api/user';
import LPicker from '@/components/basic-components/l-picker/l-picker';
export default {
	props: {
		content: {
			type: String,
			default: ''
		}
	},
	components: {
	  LPicker
	},
	data() {
		return {
			show: true,
			flag: true,
			sexShow: false,
			pickTimeshow: false,
			defaultSelector: [0],
			endyear: '',
			form: {},
			params: {
				year: true,
				month: true,
				day: true
			},
			selector: ['男', '女'],
			errorType: ['toast'],
			customStyle: {
				color: 'var(--text-color-main)'
			},
			rules: {
				nickname: [
					{
						type: 'string',
						required: true,
						message: '请输入姓名'
					}
				],
				phone: [
					{
						type: 'number',
						required: true,
						len: 11,
						message: '请输入正确的手机号',
						pattern: /^1[3456789]\d{9}$/,
						trigger: ['blur', 'change']
					}
				]
			}
		};
	},
	methods: {
		confirm() {
			this.$emit('goWrite', this.flag);
		},
		timeflag() {
			console.log(this.form);
			this.pickTimeshow = true;
		},
		confirmTime(e) {
			this.form.birthday = e.year + '-' + e.month + '-' + e.day;
			// let params = {
			//   userId: this.userInfo.user_id,
			//   birthday: this.userInfo.birthday
			// }
		},
		confirmSex(data) {
			this.form.sex = [data[0]];
			// let params = {
			//   userId: this.userInfo.user_id,
			//   sex: data[0]
			// }
		},
		cancelSex() {
			this.sexShow = false;
		},
		submit() {
			this.$refs.uForm.validate(valid => {
				console.log(valid, 189);

				if (valid) {
					let params = {
						userId: this.form.user_id,
						nickname: this.form.nickname
					};
					userInfoEdit(params)
						.then(res => {
							if (res.code === 200) {
								this.$refs.uToast.show({
									title: '修改成功',
									type: 'success'
								});
								setTimeout(() => {
									uni.setStorageSync(USER_INFO, Object.assign(this.form, { nickname: this.form.nickname }));
									uni.navigateBack({
										delta: 1
									});
								}, 1000);
							} else {
								this.$refs.uToast.show({
									title: '修改失败',
									type: 'error'
								});
							}
						})
						.catch(err => {
							console.error(err);
						});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
u-button {
	// position: absolute;
	// bottom: 80rpx;
	width: 90%;
	margin: auto;
	border-radius: 80rpx !important;
	// left: 50%;
	// transform: translateX(-50%)
}
/deep/ .u-form {
	background: var(--bg-color-main) !important;
	// width: 100vw;
	padding: 0 2%;
}
/deep/ .u-drawer__scroll-view {
	border-radius: 15rpx;
	font-size: 30rpx;
	padding: 0 15rpx;
	color: var(--text-color-main);
}
.popup-title {
	width: 80vw;
	position: sticky;
	text-align: center;
	font-size: 40rpx;
	font-weight: 600;
	padding: 20rpx 0;
	padding-bottom: 0;
	color: var(--text-color-main);
	background: var(--bg-color-main);
}
.popup-btn {
	width: 60%;
	text-align: center;
	line-height: 70rpx;
	height: 70rpx;
	color: #ffffff;
	background: var(--theme-color-dark-blue);
	border-radius: 24px;
}
/deep/ scroll-view {
	// width: 80vw !important;
	text-align: center;
	height: 800rpx !important;
	overflow-y: scroll;
}
.popup-body {
	// outline: 1px solid red;
	text-align: center;
	// height: 180rpx;
	line-height: 180rpx;
	overflow-y: scroll;
}
</style>
