<template>
	<theme>
		<view class="all" slot="theme">
			<view class="content">
				<house-header class="title-header"  headTypeOne="核联医"></house-header>
				<view class="header">
					<view class="user-info">
						<view class="user-center">
							<view class="user-name" v-if="userInfo.nickname !== ''">{{ userInfo.nickname }}</view>
							<view class="user-name"v-else>{{ userInfo.phone }}</view>
						</view>
						<view class="user-img" @click.stop="userInfoEdit()">
							<img :src="userInfo.avatar" @error="imgError($event)" />
							<view class="user-edit" >编辑</view>
						</view>
					</view>
					<view class="user-num">
						<view class="follow-num">
							关注
							<view class="num">0</view>
						</view>
						<view class="follow-num">
							点赞文章
							<view class="num">0</view>
						</view>
						<view class="follow-num" @click.stop="goCard()">
							优惠券
							<view class="num">{{ num }}</view>
						</view>
					</view>
				</view>

				<view class="cell-list"><cellList class="cell-item" :receiveCellList="cellListValue"></cellList></view>
			</view>
			<u-tabbar :border-top="true" bg-color="var(--bg-color-main)" active-color="var(--text-color-main)" :list="tabbarList"></u-tabbar>
		</view>
	</theme>
</template>
<script>
import { tabbarList } from '@/utils/tabbar/tabbarList';
import cellList from '@/components/components/cell-list/cell-list';
import { USER_INFO } from '@/const/storage-key';
import { userInfo } from 'os';
import { getMyToBeUsedCardList } from '@/api/myCard.js';
import { Address } from '@/utils/Resource_public_port.js';
export default {
	components: {
		cellList
	},
	data() {
		return {
			tabbarList,
			userInfo: {},
			num: 0, //卡券数
			cellListValue: [
				{
					name: 'inquiries',
					title: '我的问诊',
					icon: `${Address()}my/profile.png`
				},
				{
					name: 'service-order',
					title: '服务订单',
					icon: `${Address()}my/buy.png`
				},
				{
					name: 'drugs-order',
					title: '药品订单',
					icon: `${Address()}my/wallet.png`
				},
				{
					name: 'visit-card',
					title: '就诊卡',
					icon: `${Address()}my/lock.png`
				},
				{
					name: 'address-management',
					title: '地址管理',
					icon: `${Address()}my/location.png`
				},
				// {
				// 	name: 'night-mode',
				// 	title: '夜间模式',
				// 	icon: 'https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/xicondarktheme.png'
				// },
				// {
				// 	name: 'my-coupon',
				// 	title: '我的卡劵',
				// 	icon: 'https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/kaquan%402x.png'
				// },
				// {
				// 	name: 'my-equipment',
				// 	title: '我的设备',
				// 	icon: 'https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/ic_equipment%402x.png'
				// },
				{
					name: 'frequently-asked',
					title: '常见问题',
					icon: `${Address()}my/menu.png`
				},
				{
					name: 'complaints-suggestions',
					title: '投诉反馈',
					icon: `${Address()}my/paper.png`
				},
				{
					name: 'share',
					title: '分享',
					icon: `${Address()}my/Heart.png`
				}
			]
		};
	},
	watch: {
		message: {
			immediate: true,
			deep: true,
			handler(val) {
				this.tabbarList[2].isDot = val;
			}
		}
	},
	computed: {
		message() {
			return this.$store.state.theme.message;
		}
	},
	onShow() {
		this.userInfo = uni.getStorageSync(USER_INFO);
		this.getCardnum();
		
	},
	methods: {
		//图片加载失败 显示默认图片
		imgError(e) {
			this.userInfo.avatar = 'https://dailydev.oss-cn-chengdu.aliyuncs.com/416/image-icon/my_img_user.png' ;
		},
		//头像编辑按钮
		userInfoEdit() {
			this.$Router.push({
				name: 'personalInfo',
				params: {
					title: '个人资料'
				}
			});
		},
		//去我的卡券
		goCard(){
			this.$Router.push({
				name: 'myCoupon',
				params: {
					title: '我的卡券'
				}
			});
		},
		//查询优惠券
		getCardnum() {
			getMyToBeUsedCardList(1, 10, 'usable').then(res => {
				if (res.code === 200) {
					if (res.data != '' && res.data != null) {			
						this.num = Number(res.data.total);
					}else{
						this.num = 0
					}
				}
			});
		}
	}
};
</script>
<style scoped lang="scss">
.all {
	height: 100vh;
	background: var(--bg-color-second);
}
.header {
	width: 100%;
	min-height: 300rpx;
	// outline: 1px solid red;
	// background-color: green;
	// margin-top: 37rpx;
	// padding-top: 48rpx;
	// background: url("https://s4.ax1x.com/2022/02/17/HI6Gxe.png") no-repeat;
	background-size: 100%;
}
.user-info {
	height: 220rpx;
	// margin-top: 75rpx;
	
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.user-img {
		position: relative;
		margin-right: 33rpx;
		img {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			border: 1px solid var(--text-color-white);
		}
		.user-edit {
			width: 72rpx;
			height: 40rpx;
			font-size: 24rpx;
			line-height: 40rpx;
			background: var(--theme-color-dark-purple);
			color: var(--text-color-white);
			border-radius: 20rpx;
			text-align: center;
			position: absolute;
			bottom: 0;
			right: 0;
		}
	}
	.user-center {
		margin-left: 32rpx;
		color: var(--text-color-main);
		.user-name {
			font-size: 44rpx;
			font-weight: 600;
			margin-bottom: 10rpx;
		}
		// .user-phone {
		//   font-size: 32rpx;
		// }
	}
	.user-right {
		width: 260rpx;
		height: 260rpx;
		img {
			width: 260rpx;
			height: 260rpx;
			position: absolute;
			right: 2rpx;
		}
	}
}

.user-num {
	width: 690rpx;
	height: 60rpx;
	margin: auto;
	margin-top: -30rpx;
	padding: 0 31rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 26rpx;
	font-weight: 600;
	color: var(--text-color-grey);
	.follow-num {
		display: flex;
	}
	.num {
		margin-left: 10rpx;
		color: var(--theme-color-dark-purple);
	}
}

.cell-list {
	width: 90%;
	margin: 0 auto;
	position: relative;
	background: var(--bg-color-main);
	border-radius: 20rpx;
	.cell-item {
		width: 100%;

		position: absolute;
		top: -30rpx;
		background: var(--bg-color-main);
		border-radius: 20rpx;
		overflow: hidden;
	}
}
.content {
	// position: relative;
}
.title-header {
	// position: absolute;
	z-index: 1;
	/deep/ .head-view {
		background: var(--bg-color-main);
	}
	/deep/ .head-box-bg {
		background: var(--bg-color-main);
	}
}
</style>
