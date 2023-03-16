<template>
	<theme>
		<view class="all" slot="theme">
			<house-header :headTypeTwo="headTypeTwo"></house-header>
			<view class="content" v-if="followUpAppointmentList">
				<view class="topBox" :style="{ top: top + 'px' }">
					<view class="Box" v-for="(item, index) in followUpAppointmentList" :key="index">
						<!-- <view class="u-node"> -->
						<!-- <view class="u-node-time">第{{ index + 1 }}次</view> -->
						<view class="u-node-pic">
							<view class="u-node-yuan">
								<view class="number">{{ index + 1 }}</view>
							</view>
							<view class="u-node-xian" v-if="index !== followUpAppointmentList.length - 1"></view>
						</view>
						<!-- </view> -->
						<view class="u-content">
							<!-- 阶段+时间 -->
							<view class="u-content-left">
								<view class="u-order-title">{{ item.subject }}</view>

								<view class="u-order-time" v-if="item.stateCode == 'toBeImplemented'">{{ item.timeDesc.about }}</view>

								<view class="u-order-time" v-if="item.stateCode == 'appointed'">{{ item.timeDesc.about + ':' +  item.timeDesc.time }}</view>
								<view class="u-order-time" v-if="item.stateCode == 'implemented'">{{ item.timeDesc.time  + '开始服务' }}</view>
								<view class="u-order-time" v-if="item.stateCode == 'done'">{{ item.timeDesc.about + ':' + item.timeDesc.time }}</view>
							</view>
							<!-- 预约状态 -->
							<view class="appointmentState" v-if="item.estimateTime != '请填写手术时间'">
								<!-- <view class="finish" v-if="item.stateCode == ''">已完成</view> -->
								<view class="goAppointment" v-if="item.stateCode == 'toBeImplemented'" @click="goSubscribe(item)">去预约</view>
								<view class="appointed" v-if="item.stateCode == 'appointed'" @click="appointed(item)">{{ item.state }}</view>
								<view class="appointed" v-if="item.stateCode == 'implemented'" >{{ item.state }}</view>
								<view class="appointed" v-if="item.stateCode == 'done'" >{{ item.state }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="callBox">
					<view class="box-title">温馨提示</view>
					<view class="box-text">我们会提前三个工作日提醒您进行随访时间确认</view>
					<!-- <view class="box-text">
            您也可主动与我们联系：<text @click="phoneCall" class="phone"
              >15881189695</text
            ></view
          > -->
					<view class="Tips">以上仅为预估随访日期，具体随访日期根据短信提示为准</view>
				</view>
			</view>
			<view class="loading-box" v-if="loading"><u-loading mode="circle" :show="loading" size="100" color="var(--theme-color-dark-blue)"></u-loading></view>
			<view v-if="!followUpAppointmentList" class="no-data"><x-icon iconName="service-no-data"></x-icon></view>
			<u-modal v-model="appointedShow" confirm-text="我知道了" :title="modelTitle" :title-style="titleStyle">
				<view class="modalBox">
					<view>时间：{{ modelTime ? modelTime : '时间未知' }}</view>
					<view>地点：{{ modelPlace ? modelPlace : '地点未知' }}</view>
					<view>联系电话：{{ DepartmentPhone ? DepartmentPhone : '联系电话未知' }}</view>
				</view>
			</u-modal>
		</view>
	</theme>
</template>
<script>
import { hjtViewFollowUpPlan, departmentDetails } from '@/api/service';
import { RequestList } from '@/utils/requestCode.js';
export default {
	data() {
		return {
			titleStyle: {
				color: 'var(--text-color-main)'
			},
			modelTime: '',
			modelPlace: '',
			modelTitle: '',
			appointedShow: false,
			top: null,
			line: null,
			loading: true,
			medicalCardId: '',
			servicePackageUserId: '',
			followUpAppointmentList: [],
			DepartmentPhone: null, //部门电话
      headTypeTwo: ''
		};
	},
	onLoad() {
    const option = this.$Route.query
    if (option.headTitle) {
      this.headTypeTwo = option.headTitle
    }
		this.servicePackageUserId = this.$Route.query.servicePackageId;
		this.medicalCardId = this.$Route.query.medicalCardId;
		this.line = this.followUpAppointmentList.slice(-1);
		this.top = this.$store.state.theme.mescrollUniHeight + 15;
	},
	onShow() {
		this.getDetail();
	},
	methods: {
		//获取部门详情信息（电话）
		getDepartmentDetail(deptId) {
			departmentDetails(deptId)
				.then(response => {
					this.loading = false;
					const { code, data } = response;
					if (code == RequestList.SUCCESS_CODE) {
						this.DepartmentPhone = data.phone;
					} else {
						// TODO
					}
				})
				.catch(e => {
					console.error(e);
					this.loading = false;
				});
		},
		// 截取时间
		getTime(item) {
			if (item) {
				return item.substring(0, 10);
			}
		},
		phoneCall() {
			uni.makePhoneCall({
				phoneNumber: '15881189695'
			});
		},
		getDetail() {
			this.loading = true;
			this.followUpAppointmentList = [];
			hjtViewFollowUpPlan(this.servicePackageUserId)
				.then(response => {
					this.loading = false;
					const { code, data } = response;
					if (code == RequestList.SUCCESS_CODE) {
						this.followUpAppointmentList = data;
						console.log(this.followUpAppointmentList, ' this.followUpAppointmentList');
					} else {
						// TODO
					}
				})
				.catch(e => {
					console.error(e);
					this.loading = false;
				});
		},
		goSubscribe(item) {
			this.$Router.push({
				name: 'subscribe',
				params: {
					title: item.subject,
					actionId: item.actionId,
					medicalCardId: this.medicalCardId,
					estimateTime: this.getTime(item.estimateTime),
					servicePackageUserId: this.servicePackageUserId
				} 
			});
		},
		appointed(item) {
			this.getDepartmentDetail(item.appointmentDept);
			this.appointedShow = true;
			this.modelPlace = item.location;
			this.modelTime = item.appointmentTime;
			this.modelTitle = item.subject;
		}
	}
};
</script>
<style lang="scss" scoped>
.all {
	height: 100vh;
	background: var(--bg-color-second);
}
.content {
	margin-top: 20px;
}
.modalBox {
	width: 80%;
	margin: 20px auto 20px auto;
	color: var(--text-color-main);
	view {
		padding: 10px 0;
	}
}
.topBox {
	width: 100%;
	overflow-y: scroll;
	position: absolute;
	bottom: 120px;
}
.Box {
	width: 90%;
	margin: auto;
	display: flex;
	align-items: flex-start;
}
.u-node {
	display: flex;
	width: 30%;
}
.u-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	.u-content-left {
		width: 65%;
		margin-right: 8%;
	}
	.appointmentState {
		width: 28%;
		text-align: center;
		.goAppointment {
			padding: 8px 0;
			background: var(--theme-color-linear);
			color: #fff;
			border-radius: 100px;
			font-size: 24rpx;
		}
		.appointed {
			padding: 8px 0;
			background: var(--bg-color-second);
			border: 1px solid var(--theme-color-dark-blue);
			color: var(--text-color-main);
			border-radius: 100px;
			font-size: 24rpx;
		}
	}
}
.u-node-pic {
	width: 15%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 15px;
}
.u-node-yuan {
	width: 28px;
	line-height: 24px;
	border-radius: 100rpx;
	text-align: center;
	border: 2px solid var(--theme-color-dark-blue);
	.number {
		font-size: 12px;
		color: var(--text-color-main);
	}
}
.u-node-xian {
	width: 1px;
	min-height: 70px;
	background: var(--bg-color-grey);
}
.u-order-title {
	color: var(--text-color-main);
	font-weight: bold;
	font-size: 32rpx;
	padding-bottom: 3px;
}

.u-order-desc {
	color: var(--text-color-shallow-grey);
	font-size: 28rpx;
	margin-bottom: 6rpx;
}

.u-order-time {
	color: var(--text-color-grey);
	font-size: 26rpx;
}
.u-node-time {
	width: 50px;
	height: 24px;
	font-size: 24rpx;
	border-radius: 60px;
	// border: 1px solid var(--text-color-grey);
	margin-right: 28rpx;
	color: var(--text-color-grey);
	text-align: center;
}
.Tips {
	font-size: 12px;
	margin-top: 35rpx;
}
.callBox {
	width: 100%;
	max-height: 100px;
	color: var(--text-color-grey);
	text-align: center;
	position: fixed;
	bottom: 20px;
	.box-text {
		font-size: 12px;
		text-align: center;
		margin: 10px 0;
	}
	.box-title {
		font-size: 18px;
		font-weight: 600;
		color: var(--text-color-main);
	}
	.phone {
		text-decoration: underline;
		color: var(--theme-color-dark-blue);
	}
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
.no-data {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 70vh;
}
</style>
