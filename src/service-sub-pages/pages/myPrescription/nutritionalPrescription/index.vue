<template>
  <theme>
    <view class="all" slot="theme">
      <house-header :headTypeTwo="headTitle"></house-header>
      <view class="contents" v-if="!dataShow">
        <view class="tabs-css">
          <view class="title">
            <view class="titleLine"></view>
            <view class="titleName">饮食建议</view>
          </view>
          <u-tabs
            bg-color="var(--bg-color-second)"
            :list="tabsList"
            :current="current"
            @change="tabsChange"
            active-color="var(--text-color-main)"
            inactive-color="#9699a6"
            :is-scroll="true"
          ></u-tabs>
        </view>
        <view class="form-css"></view>
        <view class="stageBox">
          <view class="stageView">
            <energyScheme :freq="stageTotalNutrientList[current]" />
            <view class="stageContentBox" v-if="tabsObj.guide">
              <view class="name">目的</view>
              <view class="smallTitle">
                <view class="roundDot"></view>
                <view class="objective">{{ tabsObj.guide }}</view></view
              >
            </view>
            <view class="stageContentBox">
              <view class="u-tag" v-if="tabsObj.details">
                <view
                  :class="tagIndex == index ? 'tag' : 'tagOne'"
                  v-for="(item, index) in tabsObj.details"
                  :key="index"
                  @click="changeDay(index, item)"
                  >{{ item.name }}
                </view>
              </view>

              <view v-for="(i, aindex) in dayArr" :key="aindex">
                <view class="mealTime">
                  <view class="name">{{ getMealTime(i.type) }}</view>
                  <view
                    v-for="(bitem, bindex) in i.nutritionIntakeList"
                    :key="bindex"
                    class="videoImageBox"
                  >
                    <image
                      class="cover"
                      :src="bitem.foodIngredientResponse.images"
                    ></image>
                    <view class="actionName">
                      <view class="name-line">
                        <view class="foodName">
                          {{ bitem.foodIngredientResponse.name }}
                        </view>
                        <view class="intake"
                          >建议摄入：{{ bitem.quantitationIntake.value
                          }}{{ getUnit(bitem.quantitationIntake.unit) }}</view
                        >
                      </view>
                      <view class="detail">
                        <view class="tag-bg green">
                          <view class="tag">蛋白质</view>
                          {{
                            getNutrientDetail(
                              bitem.foodIngredientResponse.foodNutrientResponse,
                              "protein",
                              bitem.quantitationIntake.value
                            )
                          }}
                        </view>
                        <view class="tag-bg red">
                          <view class="tag">脂肪</view>
                          {{
                            getNutrientDetail(
                              bitem.foodIngredientResponse.foodNutrientResponse,
                              "fat",
                              bitem.quantitationIntake.value
                            )
                          }}
                        </view>
                        <view class="tag-bg blue">
                          <view class="tag">碳水</view>
                          {{
                            getNutrientDetail(
                              bitem.foodIngredientResponse.foodNutrientResponse,
                              "carbohydrates",
                              bitem.quantitationIntake.value
                            )
                          }}
                        </view>
                        <view class="tag-bg orange">
                          <view class="tag">热量</view>
                          {{
                            getNutrientDetail(
                              bitem.foodIngredientResponse.foodNutrientResponse,
                              "heat",
                              bitem.quantitationIntake.value
                            )
                          }}
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="form-css"></view>
        <view class="startSportBtn" @click="clockIn">
          <view>打卡</view>
        </view>
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <view class="empty" v-if="dataShow">
        <x-icon iconName="service-no-data"></x-icon>
      </view>
    </view>
  </theme>
</template>
<script>
import energyScheme from "@/service-sub-pages/pages/myPrescription/nutritionalPrescription/components/energyScheme"
import { getExercisePrescription } from "@/api/service"
export default {
  components: {
    energyScheme
  },
  data() {
    return {
      tagIndex: 0,
      shadowStyle: {
        backgroundImage:
          "linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 80%)",
        textAlign: "center"
      },
      headTitle: "",
      tabsObj: {},
      dayObj: {},
      dayArr: [],
      nutritionoList: [],
      stageTotalNutrientList: [],
      tabsList: [],
      current: 0,
      //有无数据
      dataShow: false,
      loading: true,
      guide: ""
    }
  },
  watch: {
    dayObj: {
      deep: true,
      handler(val) {
        let dayArr = val.data.filter(
          item => item.nutritionIntakeList.length !== 0
        )
        this.dayArr = dayArr.filter(
          item => item.nutritionIntakeList[0].foodIngredientResponse !== null
        )
      }
    }
  },
  onLoad() {
    this.headTitle = this.$Route.query.title
    this.prescribeId = this.$Route.query.id
    this.servicePackageUserId = this.$Route.query.servicePackageId
    this.getNutritionoList(this.servicePackageUserId, this.prescribeId)
  },
  methods: {
    //获取
    getNutritionoList(servicePackageUserId, prescribeId) {
      this.loading = true
      getExercisePrescription(servicePackageUserId, prescribeId).then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.loading = false
            this.nutritionoList = res.data.stages
            this.guide = res.data.guide
            this.stageTotalNutrientList = []
            if (this.nutritionoList) {
              this.nutritionoList.forEach(item => {
                if (item.totalNutrient) {
                  item.totalNutrient.carbohydrates.name = "碳水化合物"
                  item.totalNutrient.fat.name = "脂肪"
                  item.totalNutrient.protein.name = "蛋白质"
                  item.totalNutrient.quantityHeat.name = "热量"
                  this.stageTotalNutrientList.push(item.totalNutrient)
                }
                this.tabsList.push({ name: item.stageName })
              })
              this.tabsObj = this.nutritionoList[0]
              this.dayObj = this.tabsObj.details[0]
              this.stagesName = this.nutritionoList[0].stageName
              console.log(this.tabsObj, this.dayObj, "tabsObj")
            } else {
              this.dataShow = true
            }
          } else {
            this.loading = false
            this.dataShow = true
          }
          // console.log(this.nutritionoList, "查看数据")
        } else {
          console.log("视频数据获取失败")
        }
      })
    },
    startSport() {
      this.$Router.push({
        name: "videoPage"
      })
    },
    tabsChange(index) {
      this.current = index
      this.tabsObj = this.nutritionoList[index]
      this.tagIndex = 0
      this.dayObj = this.tabsObj.details[this.tagIndex]
      this.stagesName = this.nutritionoList[index].stageName
      uni.pageScrollTo({
        duration: 100, //过渡时间
        scrollTop: 0 //到达距离顶部的top值
      })
    },
    changeDay(index, item) {
      this.tagIndex = index
      this.dayObj = this.tabsObj.details[index]
    },
    //单位转换,表示单位的枚举值更变。在支撑数据变化的过程中暂时还加上原来的单位值
    getUnit(unit) {
      if (unit === "0" || unit === "g") {
        return "克"
      }
      if (unit === "1" || unit === "kg") {
        return "千克"
      }
      if (unit === "2" || unit === "grain") {
        return "粒"
      }
    },
    //早午餐转换
    getMealTime(type) {
      if (type === "0") {
        return "早餐"
      }
      if (type === "1") {
        return "午餐"
      }
      if (type === "2") {
        return "晚餐"
      }
      if (type === "3") {
        return "加餐"
      }
    },
    clockIn() {
      this.$Router.push({
        name: "feedback",
        params: {
          prescribeId: this.prescribeId,
          twoInputShow: false,
          stagesName: this.stagesName,
          recordType: 2
        }
      })
    },
    getComputeOneNutrientDisplay(v, unit, intakeWeight) {
      if (!v) {
        return "未知"
      }
      const value = Number(v) * intakeWeight
      if (value > 100) {
        return `${value.toFixed(0)}${unit}`
      } else {
        return `${value.toFixed(1)}${unit}`
      }
    },
    getNutrientDetail(listData, type, intakeWeight) {
      if (!listData) {
        return "未知"
      }
      if (type === "protein") {
        const protein = listData.find(item => item.name === "蛋白质")
        return this.getComputeOneNutrientDisplay(
          protein.value,
          protein.unit,
          intakeWeight
        )
      } else if (type === "fat") {
        const fat = listData.find(item => item.name === "脂肪")
        return this.getComputeOneNutrientDisplay(
          fat.value,
          fat.unit,
          intakeWeight
        )
      } else if (type === "carbohydrates") {
        const carbohydrates = listData.find(item => item.name === "碳水化合物")
        return this.getComputeOneNutrientDisplay(
          carbohydrates.value,
          carbohydrates.unit,
          intakeWeight
        )
      } else if (type === "heat") {
        const heat = listData.find(item => item.name === "热量")
        return this.getComputeOneNutrientDisplay(
          heat.value,
          heat.unit,
          intakeWeight
        )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}
/deep/.u-flex {
  justify-content: center !important;
}
.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-main);
  .tabs-css {
    position: fixed;
    overflow-x: scroll;
    width: 100%;
    z-index: 20;
    background: var(--bg-color-main);
    height: 120px;
  }
  .contents {
    width: 100%;
    margin: auto;
    background: var(--bg-color-main);
    .startSportBtn {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      background: var(--bg-color-main);
      view {
        width: 90%;
        line-height: 45px;
        margin: 20px auto;
        border-radius: 30px;
        background: cornflowerblue;
        color: #ffff;
        font-size: 34rpx;
        text-align: center;
      }
    }
    .title {
      width: 90%;
      margin: 20px auto;
      display: flex;
      align-items: center;
      .titleLine {
        width: 6px;
        height: 18px;
        border-radius: 4px;
        margin-right: 10px;
        background: var(--theme-color-dark-blue);
      }
      .titleName {
        font-size: 34rpx;
        font-weight: bolder;
        color: var(--text-color-main);
      }
    }
    .stageBox {
      width: 90%;
      margin: 15px auto;
      .stageView {
        width: 100%;
        margin: auto;
        .stageContentBox {
          width: 100%;
          margin-top: 40rpx;
          .name {
            color: var(--text-color-main);
            font-size: 30rpx;
            font-weight: bolder;
          }
          .smallTitle {
            display: flex;
            align-items: center;
            margin: 15px 0 15px 0;
            .roundDot {
              width: 8px;
              height: 8px;
              background: var(--theme-color-dark-blue);
              margin-right: 8px;
              border-radius: 50%;
            }
            .objective {
              color: var(--text-color-grey);
            }
          }
          .mealTime {
            margin: 15px 0 15px -2%;
            border-radius: 20rpx;
            width: 104%;
            padding-bottom: 1rpx;

            .name {
              color: var(--text-color-main);
              font-size: 30rpx;
              font-weight: bolder;
              padding: 15px;
            }
          }
          .u-tag {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            margin-top: 15px;
            .tag {
              width: 23%;
              padding: 8px;
              background: var(--theme-color-dark-blue);
              color: var(--text-color-white);
              text-align: center;
              margin: 0 2% 10px 0;
            }
            .tagOne {
              width: 23%;
              padding: 8px;
              text-align: center;
              background: var(--bg-color-opacity01);
              color: var(--theme-color-dark-blue);
              margin: 0 2% 10px 0;
            }
          }
          .videoImageBox {
            margin: 0 15rpx;
            display: flex;
            align-items: flex-start;
            column-gap: 10rpx;
            padding: 12rpx 0;
            background: var(--bg-color-second);
            margin-bottom: 15px;
            border-radius: 20rpx;

            .cover {
              margin-left: 2%;
              width: 28%;
              height: 130rpx;
            }
            .actionName {
              width: 70%;
              font-size: 30rpx;

              .name-line {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 90%;

                .foodName {
                  color: var(--text-color-main);
                  margin: 10rpx 0;
                  font-weight: 600;
                }
                .intake {
                  font-size: 27rpx;
                  color: var(--text-color-grey);
                }
              }
              .detail {
                display: grid;
                grid-template-columns: repeat(2, 48%);
                column-gap: 10rpx;
                row-gap: 10rpx;
                grid-template-rows: auto auto;

                .tag-bg {
                  height: 50rpx;
                  line-height: 50rpx;
                  border-radius: 25rpx;
                  display: inline;
                  font-size: 12px;

                  .tag {
                    display: inline-block;
                    border-radius: 25rpx;
                    color: var(--bg-color-main);
                    padding: 0rpx 10rpx;
                    margin-right: 10rpx;
                    width: 110rpx;
                    text-align: center;
                  }

                  &.green {
                    background-color: #d3f1ee;
                    color: #4dd4b8;
                    .tag {
                      background: linear-gradient(180deg, #49d2bd, #4fd5b8);
                    }
                  }

                  &.red {
                    background-color: #f7dfe1;
                    color: #ff7c74;
                    .tag {
                      background: linear-gradient(180deg, #ff9074, #ff7874);
                    }
                  }

                  &.blue {
                    background-color: #d9e7fd;
                    color: #6ba5ff;
                    .tag {
                      background: linear-gradient(180deg, #75b7ff, #68a0ff);
                    }
                  }

                  &.orange {
                    background-color: #f6eadc;
                    color: #fcb45d;
                    .tag {
                      background: linear-gradient(180deg, #febd6f, #faac4e);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .empty {
    width: 230px;
    height: 170px;
    margin: 30px auto auto auto;
    text-align: center;
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
  .form-css {
    width: 100%;
    height: 120px;
    background: var(--bg-color-main);
  }
}
</style>
