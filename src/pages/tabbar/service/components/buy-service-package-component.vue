<template>
	<view class="contact">
		<!-- 续费盒子 -->
		<!-- <view
      class="renewalBox"
      v-if="(renewalBoxShow || status === 3) && isExperience"
    >
      <view class="name">服务包{{ dueMask ? "已" : "即将" }}到期</view>
      <view class="button-position" @click="toRenew">去续费></view>
      <view class="closeBox" @click="closeRenewalBox"></view>
    </view> -->
		<view class="maskBox">
			<view v-if="dueMask" class="dueMask"></view>
			<!-- 健康任务 -->
			<!-- <view class="task-box" v-if="taskList.length > 0">
        <view class="title">今日任务</view>
        <view class="task-item-box">
          <view
            class="task-item"
            v-for="(item, index) in taskList"
            :key="index"
          >
            <view class="taskTitle">{{ item.name }}</view>
            <view class="taskBtn">
              <view
                class="button-position"
                v-if="item.type == 'JKSF'"
                @click="gotoAppointment(item)"
              >
                去预约
              </view>
              <view
                class="button-position"
                v-if="item.type == 'JKCP'"
                @click="gotoJKCP(item)"
              >
                去填写
              </view>
            </view>
          </view>
        </view>
      </view> -->
			<!-- 客服 -->
			<!-- <button
        open-type="contact"
        :session-from="sessionFrom"
        hover-class="none"
        class="server-image"
      >
        <view class="server-image-view">
          <image
            class="image"
            object-fit="contain"
            src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/wxappservicekjefu.png"
          />
        </view>
      </button> -->


			<!-- <view class="iconfont icon-kefu"></view> -->
			<!-- <view>
      <u-icon name="account-fill" size="45"></u-icon>
      <view>咨询客服</view>
    </view> -->

			<!-- 健康服务 -->
			<view class="grid-item">
				<!-- <view class="title">
					<text>健康服务</text>
					<text class="tenantNameBox" v-if="tenantName">({{ tenantName }}为您服务)</text>
				</view> -->
				<view class="flex-item-box">
					<view class="flex-item" v-for="(item, index) in projectList" :key="index"
						@click="goPage(item.moduleLink, item.name)">
						<view class="image-box">
							<image :src="item.img"></image>
						</view>
						<view class="introduce-box">
							<view class="describe">{{ item.name }}</view>
							<!-- <view class="time">{{ item.description }}</view> -->
						</view>
						
						<view class="posi-item-box">
							<view class="posi-item blue" v-if=" item.moduleLink == 'JKDA' && isfillIn == false">
								去完善
							</view>
							<view class="posi-item pink" v-if=" item.moduleLink == 'JKJY' && item.count > 0 && item.count !=null ">
								有更新
							</view>
						</view>
					</view>
					
				</view>

			</view>
			<!-- 服务步骤 -->

			<!-- <view class="health-plan">
				<view class="title">服务步骤</view>
				<scroll-view :scroll-top="planitemboxScrollTop" scroll-y="true" scroll-x="false" class="scroll-Y"
					v-if="dataShow == false">
					<view class="plan-item-box">
						<view class="plan-item" v-for="(item, index) in planList" :key="index">
							<view class="plan-item-color">
								<view :class="index == signCheckIndex ? 'signCheck' : 'sign'">
									<view class="signSpot"></view>
								</view>
								<view class="signXian" v-if="index !== planList.length - 1"></view>
							</view>
							<view :class="
                  index == signCheckIndex
                    ? 'plan-right-box-color'
                    : 'plan-right-box'
                ">
								<view>{{ item.time }}</view>
								<view>{{ item.plan }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view v-if="dataShow == true" class="emply">
					<view class="img">
						<image src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/ipImage/1.png"></image>
					</view>
					<view class="center"> 如您已完成手术</view>
					<view class="center">
						<text class="">请填写手术时间</text>
						<text class="goCreatFile" @click="goCreatFile">去填写</text>
					</view>
				</view>
			</view> -->
			<!-- <view v-if="dataShow == false" class="service-package-deadline">当前服务包的有效期至：{{
          /\d{4}-\d{1,2}-\d{1,2}/g.exec(expireTime)
        }}</view> -->
			<!-- <renewPayment ref="renewPayment" @onChangeFun="onChangeFun"></renewPayment> -->
		</view>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import renewPayment from "@/components/renew-payment/index.vue"
	import { RequestList } from '@/utils/requestCode.js'
	import {
		getServiceSteps,
		getHealthTask,
		listFront,
		getCBTIToken,
		getPersonalarchivesModule
	} from "@/api/service"
	export default {
		components: {
			renewPayment
		},
		data() {
			return {
				planList: [],
				dataShow: false,
				renewalBoxShow: false,
				taskList: [],
				planItemBox: "",
				servicePackageDeadlineHeight: "",
				sessionFrom: "msgfrom:order",
				goPrescribeDdetails: false,
				prescriptionName: "",
				prescriptionId: "",
				type: "",
				dueMask: false,
				isExperience: false,
				planitemboxScrollTop: 0,
				signCheckIndex: null,
				isfillIn:null,//档案是否完善标识
			}
		},
		props: {
			projectList: {
				type: Array,
				default: () => {
					return []
				}
			},
			servicePackageId: {
				type: String,
				default: ""
			},
			expireTime: {
				type: String,
				default: ""
			},
			medicalCardId: {
				type: String,
				default: ""
			},
			status: {
				type: Number
			},
			stopTime: {
				type: String,
				default: ""
			},
			experience: {
				type: Boolean,
				default: false
			},
			tenantName: {
				type: String,
				default: ""
			}
		},
		watch: {
			projectList: {
				immediate: true,
				handler(val) {
					this.myPrescription(this.servicePackageId, this.medicalCardId)
				}
			},
			status: {
				immediate: true,
				handler(val) {
					if (val === 3) {
						this.dueMask = true
					} else {
						this.dueMask = false
					}
				}
			},
			stopTime: {
				immediate: true,
				handler(val) {
					if (val) {
						this.dueTime = this.getTime(val)
						var now = this.getNowFormatDay()
						if (
							this.getDiffDay(now, this.dueTime) === 5 ||
							this.getDiffDay(now, this.dueTime) < 5
						) {
							this.renewalBoxShow = true
						} else {
							this.renewalBoxShow = false
						}
					} else {
						this.renewalBoxShow = false
					}
				}
			},
			experience: {
				immediate: true,
				handler(val) {
					if (val) {
						this.isExperience = val
					}
				}
			},
			planList: {
				immediate: true,
				handler(val) {
					if (val) {
						var now = this.getNowFormatDay()
						let indexArr = []
						this.planitemboxScrollTop = 0
						val.forEach((item, index) => {
							if (
								this.getDiffDay(now, item.time) ||
								this.getDiffDay(now, item.time) === 0
							) {
								indexArr.push(index)
								this.signCheckIndex = indexArr[0]
								this.planitemboxScrollTop = (indexArr[0] - 1) * 50
							}
						})
					}
				}
			}
		},
		created() {
			this.dataShow = false
			if (this.planList) {
				var now = this.getNowFormatDay()
				let indexArr = []
				this.planitemboxScrollTop = 0
				this.planList.forEach((item, index) => {
					if (
						this.getDiffDay(now, item.time) ||
						this.getDiffDay(now, item.time) === 0
					) {
						indexArr.push(index)
						this.signCheckIndex = indexArr[0]
						this.planitemboxScrollTop = (indexArr[0] - 1) * 50
					}
				})
			}
			this.getPersonalArchivesModuleInfo()
		},
		mounted() {
			// this.$nextTick(() => {
			//   this.getClientHeight()
			// })
			// this.getPersonalArchivesModuleInfo()
		},
		methods: {
			//查询用户档案是否完善
			getPersonalArchivesModuleInfo() {
			  getPersonalarchivesModule(this.servicePackageId, this.medicalCardId)
			    .then(res => {
			      if (res.code === RequestList.SUCCESS_CODE) {
			        // console.log(res.data.fillIn,302222222)
					this.isfillIn = res.data.fillIn
			      }
			    })
			    .catch(err => {
			      console.error(err)
			    })
			},
			getDiffDay(date_1, date_2) {
				if (date_1 < date_2 || date_1 === date_2) {
					// 计算两个日期之间的差值
					let diffDate
					let myDate_1 = Date.parse(date_1)
					let myDate_2 = Date.parse(date_2)
					// 将两个日期都转换为毫秒格式，然后做差
					diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
					let totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
					return totalDays
				}
			},
			getNowFormatDay(nowDate) {
				var char = "-"
				if (nowDate == null) {
					nowDate = new Date()
				}
				var day = nowDate.getDate()
				var month = nowDate.getMonth() + 1 //注意月份需要+1
				var year = nowDate.getFullYear()
				//补全0，并拼接
				return this.getTime(
					year + char + this.completeDate(month) + char + this.completeDate(day)
				)
			},
			completeDate(value) {
				return value < 10 ? "0" + value : value
			},
			//关闭续费
			closeRenewalBox() {
				this.isExperience = false
			},
			//获取处方的长度一条时直接跳入运动处方
			myPrescription(id, medicalCardId) {
				listFront(id, medicalCardId).then(res => {
					if (res.code === 200) {
						if (res.data.length === 1) {
							this.goPrescribeDdetails = true
							this.prescriptionName = res.data[0].prescribeName
							this.prescriptionId = res.data[0].id
							this.type = res.data[0].type
						} else {
							this.goPrescribeDdetails = false
						}
					}
				})
			},
			// 截取时间
			getTime(item) {
				if (item) {
					return item.substring(0, 10)
				}
			},
			whenServiceTabShow() {
				this.getServiceStepsList()
				this.getHealthTaskList()
			},
			//获取服务步骤
			getServiceStepsList() {
				// let itemType = [{ JKCP: "健康测评", JKSF: "随访", JKDA: "健康档案" }]
				if (this.servicePackageId) {
					getServiceSteps(this.servicePackageId).then(res => {
						if (res.code === 200) {
							if (res.data.length !== 0) {
								this.dataShow = false
								this.planList = []
								res.data.forEach(item => {
									this.planList.push({
										time: item.planTime,
										plan: item.title
									})
								})
							} else {
								this.dataShow = true
							}
						} else {
							this.dataShow = true
						}
					})
				} else {
					console.log("未找到服务包id")
				}
			},
			//获取健康任务
			getHealthTaskList() {
				if (this.servicePackageId && this.medicalCardId) {
					getHealthTask(this.servicePackageId, this.medicalCardId).then(res => {
						if (res.code == 200) {
							if (res.data.length !== 0) {
								this.taskList = res.data
							} else {
								this.taskList = []
							}
						}
					})
				} else {
					console.log("未找到服务包id")
				}
			},
			goCreatFile() {
				this.$Router.push(
					"/createFile?servicePackageId=" +
					this.servicePackageId +
					"&medicalCardId=" +
					this.medicalCardId
				)
			},
			// getClientHeight() {
			//   var that = this

			//   const query = uni.createSelectorQuery().in(that)
			//   query
			//     .select(".service-package-deadline")
			//     .boundingClientRect(data => {
			//       this.servicePackageDeadlineHeight = data.height - 15
			//     })
			//     .exec()
			//   query
			//     .select(".plan-item-box")
			//     .boundingClientRect(data => {
			//       this.planItemBox = data.top
			//     })
			//     .exec()
			// },
			//服务跳转
			goPage(moduleLink, name) {
				if (moduleLink == "JKDA") {
					this.$Router.push(
						"/createFile?servicePackageId=" +
						this.servicePackageId +
						"&medicalCardId=" +
						this.medicalCardId
					)
				}
				if (moduleLink == "JKJY") {
					this.$Router.push(
						"/healthEducation?servicePackageId=" +
						this.servicePackageId +
						"&headTitle=" +
						name
					)
				}
				if (moduleLink == "JKJC") {
					this.$Router.push(
						"/healthMonitoring?servicePackageId=" +
						this.servicePackageId +
						"&headTitle=" +
						name +
						"&medicalCardId=" +
						this.medicalCardId
					)
				}
				if (moduleLink == "JKCF") {
					console.log(this.goPrescribeDdetails, "this.goPrescribeDdetails")
					if (!this.goPrescribeDdetails) {
						this.$Router.push(
							"/myPrescription?servicePackageId=" +
							this.servicePackageId +
							"&headTitle=" +
							name +
							"&medicalCardId=" +
							this.medicalCardId
						)
					} else {
						if (this.type === "754") {
							this.$Router.push({
								name: "exercisePrescriptionDetails",
								params: {
									id: this.prescriptionId,
									title: this.prescriptionName,
									servicePackageId: this.servicePackageId
								}
							})
						}
						if (this.type === "756") {
							this.$Router.push({
								name: "nutritionalPrescription",
								params: {
									id: this.prescriptionId,
									title: this.prescriptionName,
									servicePackageId: this.servicePackageId
								}
							})
						}
						if (this.type === "755") {
							this.$Router.push({
								name: "rehabilitationPrescription",
								params: {
									id: this.prescriptionId,
									title: this.prescriptionName,
									servicePackageId: this.servicePackageId
								}
							})
						}
						if (
							this.type === "757" ||
							this.type === "758" ||
							this.type === "759" ||
							this.type === "760"
						) {
							this.$Router.push({
								name: "rehabilitationPrescription",
								params: {
									id: this.prescriptionId,
									title: this.prescriptionName,
									servicePackageId: this.servicePackageId
								}
							})
						}
						if (this.type === "761") {
							getCBTIToken().then(res => {
								if (res.code === 200) {
									this.$Router.push({
										name: "CbtiPrescriptionDetsils",
										params: {
											token: res.data
										}
									})
								} else {
									this.$refs.uToast.show({
										title: "获取token失败",
										type: "error",
										icon: false
									})
								}
							})
						}
					}
				}
				if (moduleLink == "JKSF") {
					this.$Router.push(
						"/followUpAppointment?servicePackageId=" +
						this.servicePackageId +
						"&headTitle=" +
						name +
						"&medicalCardId=" +
						this.medicalCardId
					)
				}
				if (moduleLink == "JKCP") {
					this.$Router.push(
						"/evaluationQuestionnaire?servicePackageId=" +
						this.servicePackageId +
						"&headTitle=" +
						name +
						"&medicalCardId=" +
						this.medicalCardId
					)
				}
			},
			// 健康任务去预约
			gotoAppointment(task) {
				this.$Router.push({
					name: "subscribe",
					params: {
						title: task.name,
						actionId: task.followUpId,
						medicalCardId: this.medicalCardId,
						estimateTime: task.estimateTime,
						servicePackageUserId: this.servicePackageId
					}
				})
			},
			gotoJKCP() {
				const module = this.projectList.find(item => item.moduleLink === "JKCP")
				this.goPage(module.moduleLink, module.name)
			},
			//去续费
			toRenew() {
				this.$refs["renewPayment"].goPay(this.servicePackageId)
			},
			onChangeFun: function(e) {
				let opt = e
				let action = opt.action || null
				let value = opt.value !== undefined ? opt.value : null
				let msg = opt.msg !== undefined ? opt.msg : null
				action && this[action] && this[action](msg, value)
				if (opt.complete) {
					let complete = true
					this.$emit("onGrandfather", complete)
				}
			}
		}
	}
</script>
<style scoped lang="scss">
	.contact {
		width: 100%;
		margin-top: 10px;
		background: var(--bg-color-second);
	}

	.button-position {
		width: 78px;
		line-height: 32px;
		background: var(--theme-color-linear);
		color: #fff;
		border-radius: 30px;
		text-align: center;
	}

	.task-box {
		margin: 20rpx 0 0;
		width: 100%;
		background: var(--bg-color-main);

		.task-item-box {
			max-height: 150px;
			overflow: scroll;

			.task-item {
				width: 95%;
				margin: auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px;
				border-bottom: 1px solid var(--bd-color-main);

				.taskTitle {
					width: 60%;
					color: var(--text-color-main);
				}
			}
		}
	}

	.title {
		width: 100%;
		padding: 48rpx 4%;
		background: var(--bg-color-main);
		font-size: 36rpx;
		font-weight: 600;
		color: var(--text-color-main);
		line-height: 30rpx;

		.tenantNameBox {
			margin-left: 5px;
			font-size: 30rpx;
			font-weight: bold;
			color: var(--text-color-grey);
		}
	}

	.server-image {
		height: 82px;
		width: 90%;
		margin: 13px auto;
		padding: 0;
		border: none;

		.server-image-view {
			width: 100%;
			height: 100%;

			.image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.name {
		font-size: 30rpx;
		color: var(--text-color-main);
	}

	.grid-item {
		padding: 0rpx 0 0;
		width: 100%;
	}

	.flex-item-box {
		display: flex;
		justify-content: center;
		flex-direction: row;
		flex-wrap: wrap;
		text-align: left;
		
	}

	.flex-item {
		height: 120rpx;
		width: 90%;
		padding: 0px 18px;
		margin-bottom: 25rpx;
		border-radius: 10px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background: var(--bg-color-main);
		position: relative;
		.posi-item-box{
			position: absolute;
			width: 140rpx;
			height: 46rpx;
			top:50%;
			right: 40rpx;
			transform: translateY(-50%);
			font-size: 28rpx;
			font-weight: 600;
			.posi-item{
				// text-align: center;
				// line-height: 46rpx;
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				// padding-top: 3rpx;
				justify-content: center;
			}
		}
		.blue{
			// padding: 2px 11px;
			border-radius:15px;
			color: var(--theme-color-dark-purple);
			background-color: var(--bg-color-purple);
		}
		.pink{
			// padding: 2px 11px;
			border-radius:15px;
			color: var(--text-color-pink);
			// color: var(--text-color-purple);
			background-color: var(--bg-color-pink);
		}
	}

	.image-box {
		width: 65rpx;
		height: 65rpx;
		margin-right: 25rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.introduce-box {
		height: 80rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.describe {
		font-weight: 600;
		font-size: 30rpx;
		color: var(--text-color-main);
	}

	.time {
		font-size: 24rpx;
		font-weight: 400;
		color: var(--text-color-grey);
		line-height: 32rpx;
	}

	.health-plan {
		margin-top: 20rpx;
	}

	.plan-item-box,
	.scroll-Y {
		min-height: 50px;
		max-height: 220px;
		background: var(--bg-color-main);
	}

	.plan-item {
		width: 92%;
		margin: auto;
		display: flex;
		justify-content: space-between;
		background: var(--bg-color-main);
		height: 50px;
	}

	.service-package-deadline {
		width: 100%;
		text-align: center;
		color: var(--text-color-grey);
		padding: 10px 0 15px 0;
		background: var(--bg-color-main);
	}

	.plan-item-color {
		width: 35px;
		padding: 10rpx;
		font-size: 12px;
		font-weight: 400;
		color: var(--text-color-main);
	}

	.plan-right-box {
		padding: 5.5rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		color: var(--text-color-main);
	}

	.plan-right-box-color {
		padding: 6rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		color: var(--theme-color-dark-blue);
		border: 1px solid transparent;
	}

	.sign {
		width: 14px;
		height: 14px;
		background: #dae6f6;
		border-radius: 50%;
		position: relative;

		.signSpot {
			position: absolute;
			left: 3px;
			right: 3px;
			top: 3px;
			bottom: 3px;
			width: 8px;
			height: 8px;
			background: var(--theme-color-dark-blue);
			border-radius: 50%;
		}
	}

	.signCheck {
		width: 20px;
		height: 16px;
		background-image: url("https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/%E5%BD%A2%E7%8A%B6%202%402x%20%281%29.png");
		background-size: 100% 100%;
		position: relative;
		margin-left: -2rpx;

		.signSpot {
			position: absolute;
			left: 4px;
			top: 4px;
			bottom: 4px;
			width: 8px;
			height: 8px;
			background: #dae6f6;
			border-radius: 50%;
		}
	}

	.signXian {
		width: 1px;
		height: 36px;
		margin-left: 6px;
		background: var(--theme-color-dark-blue);
	}

	.emply {
		padding: 30rpx 0;

		.img {
			text-align: center;

			image {
				width: 240rpx;
				height: 200rpx;
			}
		}

		view:nth-child(3) {
			text:first-child {
				padding-right: 10px;
			}

			.goCreatFile {
				text-decoration: underline;
				color: var(--theme-color-dark-blue);
			}
		}

		.center {
			width: 300rpx;
			padding: 2px 0;
			margin: auto;
			font-size: 28rpx;
			color: var(--text-color-main);
		}
	}

	.plan-item-plan-box {
		width: 50%;
		text-align: right;
	}

	.renewalBox {
		width: 90%;
		padding: 20px 0;
		margin: auto;
		display: flex;
		align-items: center;
		// background-color: rgba(255, 113, 114, 0.7);
		background-image: url("https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220919112957.png");
		background-size: 100% 100%;
		position: relative;

		.name {
			width: 95%;
			color: #323953;
			font-size: 30rpx;
			text-align: center;
			font-weight: bolder;
		}

		.button-position {
			width: 72px;
			background-image: url("https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220919134512.png");
			background-size: 100% 100%;
			color: #fff;
			border-radius: 30px;
			text-align: center;
			position: absolute;
			right: 8%;
		}

		.closeBox {
			width: 20px;
			height: 20px;
			position: absolute;
			right: 0;
			top: 0;
		}
	}

	.maskBox {
		position: relative;

		.dueMask {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba($color: #333, $alpha: 0.1);
			z-index: 10;
		}
	}
</style>
