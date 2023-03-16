<template>
  <view>
    <!-- <u-cell-group class="group-css" :border="false">
      <u-cell-item
        v-for="(item, index) in receiveCellList"
        :key="index"
        :border-bottom="false"
        :class="item.icon ? 'item-css' : ''"
        :border="border"
        :title="item.title"
        :title-style="titleStyle"
        @click="selectCell(item.name, item.title)"
        :arrow="item.name !== 'night-mode'"
      >
        <u-icon
          v-if="item.icon"
          class="icon-css"
          :name="item.icon"
          size="32"
          slot="icon"
        ></u-icon>
        <u-switch
          v-if="item.name == 'night-mode'"
          size="50"
          v-model="checked"
          active-color="var(--theme-color-dark-blue)"
          @change="change"
        ></u-switch>
      </u-cell-item>
    </u-cell-group> -->

		<!-- 更多功能 -->
		<view class="grid-item">
			<view class="title"><text>更多功能</text></view>
			<view class="flex-item-box">
				<view class="flex-item" v-for="(item, index) in receiveCellList" :key="index" @click="selectCell(item.name, item.title)">
					<view class="image-box"><image :src="item.icon" mode="heightFix"></image></view>
					<view class="introduce-box">
						<view class="describe">{{ item.title }}</view>
					</view>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
export default {
	data() {
		return {
			arrow: true,
			checked: false,
			titleStyle: {
				fontSize: '32rpx',
				color: 'var(--text-color-main);',
				lineHeight: '25px'
			},
			border: false
		};
	},
	props: ['receiveCellList'],
	created() {
		let theme = uni.getStorageSync('theme');
		this.checked = theme === 'dark';
	},
	options: { styleIsolation: 'shared' },
	methods: {
		change(status) {
			if (status) {
				let skin = 'dark';
				this.$store.commit('skinPeeler', skin);
			} else {
				let skin = 'default';
				this.$store.commit('skinPeeler', skin);
			}
		},
		selectCell(nameTitle, title) {
			// console.log(title,78888888888888)
			if (nameTitle == 'inquiries' || nameTitle == 'drugs-order' || nameTitle == 'visit-card' || nameTitle == 'share' ) {
				this.$refs.uToast.show({
          title: "暂未开放，敬请期待",
          type: "primary"
        })
      }
      //服务订单
      if (nameTitle === "service-order") {
        this.$Router.push({
          name: "orderList",
          params: {
            title
          }
        })
      }
      if (nameTitle === "account-setting") {
        this.$Router.push({
          name: "systemSetting",
          params: {
            title
          }
        })
      }
      //个人信息修改
      if (nameTitle === "personal-data") {
        this.$Router.push({
          name: "personalInfo",
          params: {
            title
          }
        })
      }
      if (nameTitle === "address-management") {
        this.$Router.push({
          name: "userAddressList",
          params: {
            title
          }
        })
      }
      if (nameTitle === "frequently-asked") {
        this.$Router.push({
          name: "frequentlyAsked",
          params: {
            title
          }
        })
      }
      if (nameTitle === "complaints-suggestions") {
        this.$Router.push({
          name: "complaintsSuggestions",
          params: {
            title
          }
        })
      }
      //我的卡券
      if (nameTitle === "my-coupon") {
        this.$Router.push({
          name: "myCoupon",
          params: {
            title
          }
        })
      }
      if (nameTitle === "my-equipment") {
        this.$Router.push({
          name: "myEquipment",
          params: {
            title
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.item-css {
  /deep/ .u-cell {
    border-bottom: 1px solid var(--bd-color-main);
    padding: 28rpx 4%;
  }
}
/deep/ .u-cell__value {
  line-height: 10px;
}
/deep/.u-icon {
  padding: 1px 5px 0 0 !important;
}

.grid-item {
  padding: 30rpx;
  width: 100%;
  .title {
    font-size: 34rpx;
    font-weight: 600;
    margin-bottom: 40rpx;
    color: var(--text-color-main);
  }
  .flex-item-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    text-align: left;
    .flex-item {
      min-width: 25%;
      height: 200rpx;
      // padding: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      background: var(--bg-color-main);
      .image-box {
        height: 60rpx;
		width: 60rpx;
        image {
          // height: 100%;
		  //TODO 设置图片固定宽高，解决我的页面icon首次加载图片闪屏bug
		  height: 60rpx;
		  width: 60rpx;
        }
      }
      .introduce-box {
        // height: 80rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .describe {
          font-weight: 600;
          font-size: 30rpx;
          color: var(--text-color-main);
        }
      }
    }
  }
}
</style>
