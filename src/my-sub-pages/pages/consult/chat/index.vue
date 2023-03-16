<template>
  <theme>
    <view slot="theme">
      <view class="content">
        <house-header headTypeTwo="问医生"></house-header>
        <!-- <view class="doctorBox">
          <view class="leftBox">
            <view
              class="leftBox-item"
              v-for="(item, index) in doctorList"
              :key="index"
            >
              <view class="doctorImgBox"
                ><image
                  :src="
                    item.avatar
                      ? item.avatar
                      : 'https://dailydev.oss-cn-chengdu.aliyuncs.com/416/image-icon/my_img_user.png'
                  "
                ></image>
              </view>
              <view class="doctorName">{{ item.nickName }}</view>
            </view>
          </view>
          <view class="rightBox" @click="goDoctorDetails()">
            <view> 共{{ doctorTotal }}位医生</view>
            <u-icon name="arrow-right" color="var(--text-color-grey)"></u-icon>
          </view>
        </view> -->
        <!-- <div
          class="brief"
          v-if="Object.keys(basicInfo).length"
          @click="briefDetail(basicInfo)"
        >
          <div class="brief-avatar">
            <img class="brief-avatar-img" :src="basicInfo.images[0]" />
          </div>
          <div class="brief-text">{{ basicInfo.data }}</div>
        </div> -->
				<scroll-view :scroll-y="true" :scroll-into-view="scrollId" scroll-with-animation="true" :scroll-top="scrollTop" class="wrap" :style="{ height: chatHeight + 'px' }">
					<consultationList @sendQuestion="sendQuestion" :consultId="consultId"/>
					<div class="time" v-if="startTime !== ''">{{ startTime }}</div>
					<div class="chat-list" v-for="(item, index) in chatList" :key="index" :id="`messageWrap${index}`">
						<div class="pos-left" v-if="item.userType === '1'">
							<!-- @click="getDoctorInfo(item)" -->
							<img class="avatar" :src="item.avatar" style="margin-right: 7rpx" />
							<div class="pos-left-info">
								<div class="pos-le.$emit()me pos-left-info-name">
									{{ item.nickName }}
									<text v-if="item.roleNames">·</text>
									{{ item.roleNames ? item.roleNames : '' }}
								</div>
								<div class="says says-left" v-if="item.data.data">{{ item.data.data }}</div>
								<u-image
									v-if="item.data.images"
									:src="item.data.images[0]"
									width="150"
									height="150"
									border-radius="5"
									:indicator="false"
									@click="previewImage(item.data.images)"
								></u-image>
							</div>
						</div>
						<div class="pos-right" v-if="item.userType === '2'">
							<div class="says says-right" v-if="item.data.audio" style="display: flex; justify-content: flex-end">
								<div style="width: 50px"></div>
								<span style="margin-right: 5px">{{ fixAudioData(item.data.audio, 'during') }}</span>
								<u-icon
									name="pause"
									size="32"
									color="white"
									v-if="fixAudioData(item.data.audio, 'isplay')"
									@click="toggleAudioState(item.data.audio, index, false)"
								></u-icon>
								<u-icon name="play-right-fill" v-else size="32" color="#white" @click="toggleAudioState(item.data.audio, index, true)"></u-icon>
							</div>
							<div class="says says-right" v-if="item.data.data">{{ item.data.data }}</div>
							<u-image
								v-if="item.data.images"
								:src="item.data.images[0]"
								width="150"
								height="150"
								border-radius="15rpx"
								:indicator="false"
								@click="previewImage(item.data.images)"
							></u-image>
							<img class="avatar" :src="item.avatar" style="margin-left: 15rpx" />
						</div>
					</div>
					<div class="hold-height" id="holdHeight" :style="{ height: `${holdHeight}px` }"></div>
				</scroll-view>
				<div class="handle-ope" :style="{ bottom: `${keyBoardTop}px` }" v-if="consultState === '1' && endFlag == false">
					<div style="margin-left: 10rpx">
						<u-icon
							name="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/%E5%BD%A2%E7%8A%B6%203%402x.png"
							size="45"
							color="#aaaeb5"
							v-if="inputState"
							@click="toggleMeans"
						></u-icon>
						<u-icon name="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/consult_ic_keyboard.svg" size="45" color="#aaaeb5" @click="toggleMeans" v-else></u-icon>
					</div>
					<div class="handle-input">
						<input
							type="text"
							v-if="inputState"
							v-model="inputMsg"
							class="inputs"
							@confirm="submitMsg"
							:adjust-position="false"
							@focus="onInputFocus"
							@blur="onInputBlur"
						/>
						<div class="say-month" v-else @longpress="longTap" @touchmove="touchMove" @touchend="touchend">按住 说话</div>
					</div>
					<div class="handle-img">
						<u-upload
							:header="header"
							:action="action"
							:file-list="fileList"
							:auto-upload="true"
							:custom-btn="true"
							:disabled="false"
							:multiple="false"
							:deletable="false"
							:show-upload-list="false"
							:preview-full-image="false"
							upload-text=""
							width="65"
							height="65"
							:before-upload="beforeUpload"
							@on-success="uploadImageSuccess"
							@on-error="uploadImageError"
						>
							<view slot="addBtn">
								<u-icon style="margin: 0 6rpx" name="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/add.svg" size="45" color="#aaaeb5"></u-icon>
							</view>
						</u-upload>
					</div>
					<div class="handle-sendBtn"><u-button type="primary" :custom-style="customStyle" @click="submitMsg">发送</u-button></div>
				</div>
				<div class="say-content" v-show="sayContState">
					<img
						class="quit-say"
						v-if="quitActive"
						src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20221011160416.png"
						alt=""
					/>
					<img class="quit-say" v-else src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20221011142828.png" alt="" />
					<img class="say-hand" src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20221011174609.png" alt="" />
				</div>
				<!--        医生详情-->
				<div class="doctor-info" v-if="doctorDetailState">
					<u-icon name="close-circle" size="50" class="close-icon" @click="closeDocDetail"></u-icon>
					<div class="doctor-detail">
						<div class="title">基本信息</div>
						<div class="basic-list">
							<span class="label">姓名</span>
							<span class="label-val">{{ doctorBasicInfo.nickName }}</span>
						</div>
						<div class="basic-list">
							<span class="label">职称</span>
							<span class="label-val">{{ doctorBasicInfo.job }}</span>
						</div>
						<div class="basic-list">
							<span class="label">科室</span>
							<span class="label-val">{{ doctorBasicInfo.office }}</span>
						</div>
					</div>
				</div>
				<u-toast ref="uToast" />
				<view class="handle-end" v-if="endFlag == true">
					<u-popup v-model="show" mode="bottom" closeable safe-area-inset-bottom="true" border-radius="14" mask=false mask-close-able=false>
						<view class="pop-head">处方详情</view>
						<view class="pop-body" @click="detail()">
							<view class="information">
								<image  :src="detailcover" mode="heightFix"></image>
								<view class="describe">
									<view class="name">
										{{productName}}
									</view>
									<view class="num">
										数量：1
									</view>
								</view>
							</view>
							<view class="price">
								￥
								<span class="num">
									{{price}}
								</span>
							</view>
							
						</view>
						<view class="tip" @click="detail()">点击可查看处方笺详情</view>
						<view class="pop-bottom">
							<u-button type="primary" :custom-style="popBtn" @click.stop="goBuy()" v-if="!orderId">去购买</u-button>
							<u-button type="primary" :custom-style="popBtn" @click.stop="goOrderDetail()" v-else>查看订单</u-button>
						</view>
					</u-popup>
					<u-popup v-model="showEdit" mode="center" closeable safe-area-inset-bottom="false" border-radius="14">
						<view class="pop-body-detail">
							<image :src="cover" mode="widthFix"></image>
						</view>
					</u-popup>
					<u-popup v-model="showWmedicine" mode="bottom" closeable safe-area-inset-bottom="true" border-radius="14" mask=false mask-close-able=false>
						<view class="pop-head">处方详情</view>
						<view class="pop-body" @click="detail()">							
						<image  class="Ximg" :src="sliderImage" mode="widthFix"></image>	
						</view>
						<view class="pop-bottom">
							<u-button type="primary" :custom-style="popBtn" @click.stop="goBuy()">去购买</u-button>
						</view>
					</u-popup>
					<view class="handleend">
						已结束咨询
					</view>
				</view>
			</view>
		</view>
	
        
          </theme>
</template>

<script>
import { doctorDetail } from "../../../../api/consult"
import { setWebSocketIp,getDoctorMessage } from "@/utils/getWebSocketMessage.js"
import { ACCESS_TOKEN } from "@/const/storage-key"
import { getMessageList, getBasicDetailInfo } from "../../../../api/consult"
import { consultationList } from "./components/consultationList.vue"
import { getProductPreOrder,getPreOrder } from "@/libs/order.js"
import { getConsultingInfo,getServicePackData} from "@/api/service.js"
import { RequestList } from "@/utils/requestCode.js"
export default {
	components: {
		consultationList
	},
	data() {
		return {
			basicInfo: {},
			action: process.env.VUE_APP_BASE_API_IP + 'file/upload',
			fileList: [],
			header: {},
			chatList: [],
			doctorList: [],
			inputMsg: '',
			startTime: '',
			endTime: '',
			scrollTop: 0,
			reConnectTime: 0,
			scrollId: 'messageWrap0',
			keyBoardTop: 0,
			doctorDetailState: false,
			customStyle: {
				width: '74px',
				height: '31px',
				marginLeft: '10rpx',
				backgroud: '#4D9AF3',
				fontSize: '24rpx'
			},
			popBtn:{
				width: '74px',
				height: '31px',
				marginRight: '30rpx',
				backgroud: '#4D9AF3',
				fontSize: '24rpx'
			},
			chatHeight: 0,
			holdHeight: 0,
			doctorBasicInfo: { nickName: '', office: '', job: '' },
			consultState: '1',
			prevPlayInfo: {
				index: null,
				src: null
			},
			inputState: true,
			recorderManager: {},
			innerAudioContext: {},
			sayContState: false,
			startY: 0,
			intervalY: 0,
			quitActive: false,
			consultId: '',
			doctorTotal: 0,
			endFlag: false, //结束标识开关
			show: false ,//弹出层开关,中医
			showWmedicine:false,//西医开关
			showEdit:false,//详情弹出层开关
			attrValueId:"",//规格参数id
			productId:"",//产品id
			cover:'',//详情图片
			detailcover:'',//封面图片
			price:"",//商品价格
			productName:'',//商品名字
			medicalCardId:"",//就诊卡id
			drugType:"",//药类型 1中药 2西药
			sliderImage:"",//西药封面内容（图片）
			orderId:"",//订单id
		};
	},
	methods: {
		//获取商品详情（拿封面图+价格）
		getProductDetail(productId){
			getServicePackData(productId).then(res => {
			        if (res.code === RequestList.SUCCESS_CODE) {
					  let data = res.data
					  if(this.drugType == 1){
						  this.detailcover = data.productInfo.image
						  this.price = data.productInfo.price
						  this.productName = data.productInfo.storeName
						  this.show = true
					  }else if(this.drugType == 2){
						  const sliderImage = JSON.parse(data.productInfo.sliderImage)[0]
						  this.sliderImage = sliderImage
						  this.showWmedicine = true
					  }
					  
			        }
			      })
				  .catch(error => {
				       console.error(error)         
				   })
		},
		//获取结束咨询信息
		getConsultingInfoAll(medicalCardId,consultId){
			// let medicalCardId = "123" // 就诊卡id
            // let consultId = "1632690505025478657"// 当前咨询的id
			getConsultingInfo(medicalCardId,consultId).then(res => {
              if(res.code === RequestList.SUCCESS_CODE){
				  let data = res.data
				  //中药类型
				  if(data.resultTypeCode ==="doctorProduct"){
					  if(data.contentTypeCode === "prescriptionLabel"){
						  let content = data.contentDetails//attrValueId content productId
						  this.attrValueId = content.attrValueId
						  this.productId = content.productId
						  this.cover = content.content
						  this.drugType = 1
						  this.orderId = data.orderId
						  this.getProductDetail(content.productId)				
					  }
					  
				  }else if(data.resultTypeCode === "mallProduct"){
					
					  let content = data.contentDetails//attrValueId content productId
					  this.attrValueId = content.attrValueId
					  this.productId = content.productId
					  this.drugType = 2
					  this.getProductDetail(content.productId)	
				  }
				}
				  
           })
		   .catch(error => {
		        console.error(error)         
		    })
		},
		//点击商品详情(西药不可点开详情)
		detail(){
			if(this.detailcover){
				this.showEdit = true
			}
			
			// this.getConsultingInfoAll()
		},
		//去购买
		goBuy(){
			let preOrderType = "buyNow"
			let orderDetails = [{
				attrValueId: this.attrValueId,
				productId: this.productId,
				productNum: 1
			 }]
			 if(this.attrValueId && this.productId){
				 let obj = {
					 consultId: this.consultId,
					 drugType: this.drugType
				 }
				 this.$store.commit('SET_SERVICE_CONSULT_DATA',obj)
				 // this.$store.commit('CLEAN_SERVICE_CONSULT_DATA')
				 // console.log(this.$store.state.server.consultId,this.$store.state.server.drugType,123)
				 getPreOrder(preOrderType,orderDetails)//预订单
			 }
			
		},
		// goOrderDetail
		//去查看订单
		goOrderDetail(){
			uni.navigateTo({
			  url:
			    "/pages/shopping-mall/order_details/index?order_id=" +
			    this.orderId +
			    "&paid=" +
			    true 
			    
			})
			
		},
		//获取咨询列表
		chatInfo(clientId) {
			const _this = this;
			let medicalCardId = uni.getStorageSync('userInfo').medicalCardList[0].id;
			let token = uni.getStorageSync('access_token');
			let tenantId = uni.getStorageSync('tenantId');
			// let apiIp = process.env.VUE_APP_BASE_API_IP.replace(/(http)s?/, 'ws');
			// if (apiIp.includes('weixin-api')) {
			// 	apiIp = apiIp.replace('weixin-api', 'weixin2-websocket-api');
			// } else if (apiIp.includes('weixin2-demo-api')) {
			// 	apiIp = apiIp.replace('weixin2-demo-api', 'weixin2-demo-websocket-api');
			// } else if (apiIp.includes('hjt/')) {
			// 	apiIp = apiIp.replace('hjt/', 'hjt-websocket/');
			// }
			
			let apiIp = setWebSocketIp()
			const url = `${apiIp}product/websocket/consult/${clientId}/${medicalCardId}?access_token=${token}&tenant_id=${tenantId}`;
			//先发一条  让红点消失
			Promise.resolve()
				.then(() => {
					uni.connectSocket({
						url: url
					});
				})
				.then(() => {
					uni.onSocketOpen(function() {
						_this.connectWs();
					});
				});
		},
		//接受和发soon给消息
		connectWs() {
			const _this = this;
			Promise.resolve().then(() => {
				uni.sendSocketMessage({
					data: JSON.stringify({
						type: 'user_in_consult_page',
						data: { data: true }
					})
				});
			});
			uni.onSocketMessage(function(res) {				
				const resData = JSON.parse(res.data);
				console.log(resData,"接受到的信息")
				if (resData.data.type === 'finish_consult') {
					console.log(resData,"结束咨询")
					_this.endFlag = true;
					_this.getConsultingInfoAll(_this.medicalCardId,resData.data.consultId)
					uni.showToast({ icon: 'none', title: '结束咨询' });
					return;
				}
				_this.chatList.push({
					data: resData.data.data,
					avatar: resData.data.avatar,
					userType: resData.data.userType,
					sendTime: resData.data.sendTime,
					nickName: resData.data.nickName || '',
					roleNames: resData.data.roleNames || ''
				});
				if (_this.chatList?.length > 0) {
					_this.startTime = _this.chatList[0].sendTime.slice(5, 16);
				}
				_this.$nextTick(function() {
					_this.scrollId = `messageWrap${_this.chatList.length - 1}`;
				});
			});
		},
		//接收组件咨询列表问题
		sendQuestion(question) {
			console.log(question, 'question');
			uni.sendSocketMessage({
				data: JSON.stringify({
					type: 'send_message',
					data: { data: question }
				})
			});
		},
		//  发soon给消息
		submitMsg() {
			const _this = this;
			uni.sendSocketMessage({
				data: JSON.stringify({
					type: 'send_message',
					data: { data: _this.inputMsg }
				})
			});
			this.inputMsg = '';
		},
		//切换语音和文字
		toggleMeans() {
			this.inputState = !this.inputState;
		},
		//长按
		longTap(event) {
			this.startY = event.detail.y;
			const _this = this;
			uni.vibrateShort({
				success: function() {
					_this.sayContState = true;
					_this.recorderManager.start({ duration: 60000, format: 'mp3' });
					_this.recorderManager.onStart(function() {});
				},
				fail: function(err) {
					_this.sayContState = false;
				}
			});
		},
		touchMove(event) {
			this.intervalY = this.startY - event.changedTouches[0].pageY;
			if (this.intervalY > 120) {
				this.quitActive = true;
			} else {
				this.quitActive = false;
			}
		},
		//结束语音
		touchend() {
			const _this = this;
			this.sayContState = false;
			this.recorderManager.stop();
			this.recorderManager.onStop(function(res) {
				if (_this.quitActive) {
					_this.quitActive = false;
				} else {
					uploadSing(res);
				}
			});
			this.recorderManager.onError(function(err) {
				console.log('err', err);
			});
          },
   //切换播放
    async toggleAudioState(val, index, state) {
      const _this = this
      this.innerAudioContext.stop()
      if (this.prevPlayInfo.index !== null) {
        const audios = this.prevPlayInfo.src.split("?")
        await playState(
          this.prevPlayInfo.index,
          this.prevPlayInfo.src,
          audios,
          false
        )
      }
      const audio = val.split("?")
      await playState(index, val, audio, state)
      if (state) {
        this.innerAudioContext.src = audio[0]
        this.innerAudioContext.play()
      } else {
        this.innerAudioContext.stop()
      }
      this.innerAudioContext.onEnded(async function () {
        await playState(index, val, audio, false)
      })
      setTimeout(function () {
        _this.prevPlayInfo.index = index
        _this.prevPlayInfo.src = val
      })
      function playState(idx, value, audio, state) {
        const info = JSON.parse(audio[1].split("=")[1])
        info.isPlay = state
        _this.chatList[idx].data.audio = `${
          value.split("?")[0]
        }?info=${JSON.stringify(info)}`
      }
    },
    beforeUpload() {
      uni.showLoading({ title: "上传中...", mask: true })
    },
    //上传图片
    uploadImageSuccess(val) {
      uni.hideLoading()
      uni.sendSocketMessage({
        data: JSON.stringify({
          type: "send_message",
          data: { images: [val.data.url] }
        })
      })
      console.log("send888888888", val)
    },
    //上传图片失败
    uploadImageError() {
      uni.hideLoading()
      uni.showToast({ title: "上传失败", icon: "none" })
    },
    //图片预览
    previewImage(val) {
      uni.previewImage({ current: 0, urls: val })
    },
    // 跳转详情页
    briefDetail(val) {
      this.$Router.push({ path: "/consultChatBasicInfo", query: { val } })
    },
    onInputFocus(e) {
      this.keyBoardTop = e.detail.height
      this.holdHeight = e.detail.height
      this.$nextTick(function () {
        this.scrollId = "holdHeight"
      })
    },
    onInputBlur() {
      this.keyBoardTop = 0
      this.holdHeight = 0
      this.$nextTick(function () {
        if (this.chatList.length)
          this.scrollId = `messageWrap${this.chatList.length - 1}`
      })
    },
    //医生详细信息
    getDoctorInfo(val) {
      doctorDetail(val.from).then(res => {
        const remark = JSON.parse(res.data.remark)
        this.doctorBasicInfo.nickName = res.nickName
        this.doctorBasicInfo.job = remark.job
        this.doctorBasicInfo.office = remark.office
      })
      this.doctorDetailState = true
    },
    //关闭医生详情
    closeDocDetail() {
      this.doctorDetailState = false
    },
    //获取消息列表
    getMessageList(consultId) {
      const _this = this
      getMessageList(consultId).then(res => {
        _this.chatList = res.data.rows || []
        _this.$nextTick(function () {
          if (_this.chatList.length)
            _this.scrollId = `messageWrap${_this.chatList.length - 1}`
        })
      })
    },
    //获取基本信息
    getBasicInfo(consultId) {
      const _this = this
      getBasicDetailInfo(consultId).then(res => {
        // _this.basicInfo = {
        //   ...(JSON.parse(res.data.expand) || {}),
        //   time: res.data.startDate
        // }
        if (res.code === 200) {
			if(res.data.userList?.length){
				_this.doctorList = res.data.userList.slice(0, 4)
          _this.doctorTotal = res.data.userList.length
			}
          _this.medicalCardId = res.data.medicalCardId
		  if(_this.consultState == 2 ){
			  if(_this.medicalCardId){
				  _this.getConsultingInfoAll(_this.medicalCardId,_this.consultId)
			  }
		  	_this.endFlag = true //结束标识
		  }
        }
      })
    },
    fixAudioData(val, type) {
      try {
        const info = JSON.parse(val.split("?")[1].split("=")[1])
        if (type === "during") {
          return String(info.during || 1)
        } else {
          return info.isPlay
        }
      } catch (err) {
        return "0"
      }
    },
    //去医生详情
    goDoctorDetails() {
      this.$Router.push({
        path: "/consultChatdoctorDetails",
        query: {
          consultId: this.consultId
        }
      })
    }
  },
  onUnload() {
    uni.closeSocket()
    getDoctorMessage(false)
  },
  onShow() {
    let message = this.$Route.query.redPointShow
    if (message === "true") {
      this.$store.commit("getMessage", false)
    }
    this.header = {
      Authorization: "Bearer " + uni.getStorageSync(ACCESS_TOKEN)
    }
    const query = this.$Route.query
    this.consultState = query.status
    this.consultId = this.$Route.query.id
    const _this = this
    uni.onSocketError(function () {
      _this.reConnectTime++
      if (_this.reConnectTime > 10) {
        _this.$refs.uToast.show({
          title: "连接失败",
          type: "primary"
        })
        return
      }
      _this.chatInfo(query.id)
    })
    uni.onSocketClose(function () {
      _this.reConnectTime++
      if (_this.reConnectTime > 10) {
        _this.$refs.uToast.show({
          title: "连接失败",
          type: "primary"
        })
        return
      }
      _this.chatInfo(query.id)
    })
    this.chatInfo(query.id)
    this.getMessageList(query.id)
    this.getBasicInfo(query.id)
    this.recorderManager = uni.getRecorderManager()
    this.innerAudioContext = uni.createInnerAudioContext()
  },
  onLoad() {
    this.chatHeight =
      wx.getSystemInfoSync().windowHeight -
      this.$store.state.theme.mescrollUniHeight -
      70 -
      10
	  
  },
  onHide() {
    uni.closeSocket()
  }
}
</script>

<style scoped lang="scss">
.Ximg{
	width: 95%;
	margin-bottom: 20rpx;
}
.handleend{
		text-align: center;
		line-height: 80rpx;
		width: 100vw;
		height: 80rpx;
		font-size: 30rpx;
}
/deep/ .u-mode-center-box{
	background: none !important;
	border-radius: 0px !important;
}
.pop-head {
	margin-top: 60rpx;
	text-align: center;	
	font-size: 36rpx;
	font-weight: 600;
}
.pop-head-detail {
	width: 90vw;
	height: 140rpx;
	text-align: center;
	line-height: 140rpx;
	font-size: 36rpx;
	font-weight: 600;
}
.pop-body {
	display: flex;
	justify-content: space-between;
	// align-items:center;
	padding: 30rpx;
	padding-bottom: 0;
	height: auto;
	.information{
		width: 500rpx;
		display: flex;
		align-items:center;
		// justify-content: space-between;
		image {
			width: auto;
			height: 120rpx;
			margin-right: 20rpx;
		}
		.describe{
			height: 120rpx;
			display:flex;
			flex-direction: column;
			justify-content:space-around;
			.name{
				font-size: 30rpx;
				font-weight: 600;
			}
			.num{
				font-size: 25rpx;
			}
		}
		
	}
	.price{
		font-size: 24rpx;
		.num{
			font-size: 30rpx;
		    font-weight: 600;
		}
		
	}
	
}
.tip{
	font-size: 24rpx;
	width: 100vw;
	height: 70rpx;
	margin:20rpx 0 20rpx 0; 
	padding-left: 30rpx;
	color: var(--text-color-grey);
	border-bottom: 1px solid var(--bd-color-main);
}
.pop-body-edit{
	background-color: transparent;
	width: 90vw;
	border: 0;
	box-sizing: border-box;
	image {
		width: 100%;
		// margin-bottom: -28rpx;
	}
}
.pop-bottom {
	height: 80rpx;
}

.content {
  background: var(--bg-color-second);
  height: 100vh;
  .brief {
    width: calc(100% - 60rpx);
    margin: 30rpx 30rpx 0;
    height: 172rpx;
    background: var(--bg-color-main);
    border-radius: 16rpx;
    padding: 20rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .brief-avatar {
      width: 132rpx;
      height: 132rpx;
      border-radius: 16rpx;
      background: #706f6f;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      .brief-avatar-img {
        display: inline-block;
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
      }
    }
    .brief-text {
      width: calc(100% - 152rpx);
      height: 132rpx;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      word-break: break-all;
      font-size: 30rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: var(--text-color-main);
      line-height: 44rpx;
    }
  }
  .doctorBox {
    width: 100%;
    height: 80px;
    background: var(--bg-color-main);
    border-top: 1px solid var(--bd-color-main);
    padding: 15rpx 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .leftBox {
      width: 70%;
      display: flex;
      align-items: flex-start;
      .leftBox-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 25%;
        .doctorImgBox {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          image {
            border: 1px solid var(--bd-color-main);
            border-radius: 50%;
            width: 100%;
            height: 100%;
          }
        }
        .doctorName {
          width: 90%;
          color: var(--text-color-grey);
          margin-top: 6px;
          overflow: hidden;
          white-space: nowrap;
          text-align: center;
          text-overflow: ellipsis;
        }
      }
    }
    .rightBox {
      width: 25%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: var(--text-color-main);
    }
  }
  .wrap {
    margin-top: 10px;
    overflow: auto;
    padding: 0 30rpx 15rpx;
    box-sizing: border-box;
    .time {
      margin: 0 auto 25rpx;
      width: 180rpx;
      height: 36rpx;
      background: #e3e6e9;
      border-radius: 18rpx;
      text-align: center;
      font-size: 24rpx;
      color: #9699a6;
    }
    .chat-list {
      margin-bottom: 25rpx;
      .pos-left {
        display: flex;
        justify-content: flex-start;
		// align-items: center;
      }
      .pos-left-info {
        margin-left: 15rpx;
		min-width: 50rpx;
		//TODO 名字撑开父元素，内容气泡就会跟着父元素默认宽度；如果不继承父元素宽度那么气泡高度不会影响父元素，信息直接挨着就没有拉开间隙
		//解决：给名字不继承父元素宽度
		display: inline-block;
        .pos-left-info-name {
		  position: absolute;
          // font-size: 24rpx;
          // font-family: PingFangSC-Regular, PingFang SC;
          // font-weight: 400;
          // color: #9699a6;
          // margin-bottom: 20rpx;
        }
      }
      .pos-right {
        display: flex;
        justify-content: flex-end;
      }
      .says-left {
		// position: absolute;
		margin-top: 50rpx;
        background: var(--bg-color-main);
        border-radius: 50rpx 50rpx 50rpx 0;
        font-size: 30rpx;
        color: var(--text-color-main);
      }
      .says-right {
        background: #4381cf;
        border-radius: 50rpx 50rpx 0 50rpx;
        color: white;
      }
      .says {
        max-width: 500rpx;
        padding: 20rpx 40rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 38rpx;
        word-break: break-all;
      }
      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        background: #d9dada;
        border: 1rpx solid #4381cf;
      }
    }
  }
  .handle-ope {
    width: 100%;
    height: 70px;
    background: var(--bg-color-main);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid #e8e8e8;
    box-shadow: -2px 0px 9px 0px rgba(179, 179, 179, 0.28);
    position: absolute;
    bottom: 0;
    padding: 10px 5px 20px 5px;
    .handle-input {
      width: calc(100% - 135rpx);
      height: 40px;
      background: var(--bg-color-second);
      border-radius: 6px;
      border: 2rpx solid #eff0ef;
      margin-left: 10rpx;
      .inputs {
        display: inline-block;
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        padding: 0 10px;
        box-sizing: border-box;
      }
      .say-month {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30rpx;
      }
    }
    .handle-img {
      margin-left: 7rpx;
    }
  }
  .doctor-info {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    .doctor-detail {
      width: 92vw;
      height: 70vh;
      background: var(--bg-color-second);
      border-radius: 12rpx;
      margin-top: 300rpx;
      opacity: 1;
      .title {
        text-align: center;
        line-height: 100rpx;
        font-size: 40rpx;
        font-weight: bolder;
        color: var(--text-color-main);
      }
      .basic-list {
        height: 100rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 60rpx);
        margin-left: 30rpx;
        border-bottom: 1px solid var(--bd-color-main);
      }
      .label {
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        color: var(--text-color-main);
        font-weight: bolder;
      }
      .label-val {
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #9699a6;
      }
    }
    .close-icon {
      position: absolute;
      right: 30rpx;
      top: 200rpx;
      z-index: 10;
    }
  }
  .say-content {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 10;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    .say-hand {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 250rpx;
    }
    .quit-say {
      position: absolute;
      bottom: 270rpx;
      left: 60rpx;
      width: 120rpx;
      height: 120rpx;
    }
  }
  ::v-deep .u-add-tips {
    display: none;
  }
  .add-icon {
    width: 10rpx;
    height: 10rpx;
  }
}
</style>
