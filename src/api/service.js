import Vue from "vue"
let VuePro = Vue.prototype

/**
 * 结束咨询获取的id（处方类型，商品信息，规格）
 *
 */
export function getConsultingInfo(medicalCardId,consultId) {
  return VuePro.$http.get({
    url: "/product/consult/user/consultResult",
	params: {
	  medicalCardId: medicalCardId,
	  consultId: consultId
	}
  })
}

/**
 * 服务包信息
 *
 */
export function servicePackageUser() {
  return VuePro.$http.get({
    url: "/product/hjt_service_package_user/info"
  })
}

/**
 * 查询用户拥有的服务包列表
 *
 */
export function getUserServicePackageList() {
  return VuePro.$http.get({
    url: "/product/hjt_service_package_user/getUsedList"
  })
}

/**
 * 查询需要填写的检测信息
 *
 */
export function todayMonitorInfoId(id, medicalCardId) {
  return VuePro.$http.get({
    url: "/product/hjt_health_monitor_info/usre/todayMonitorInfo/" + id,
    params: {
      medicalCardId: medicalCardId
    }
  })
}

/**
 * 查询历史监测信息
 *
 */
export function getHealthMonitorInfo(id, indicatorId, params, medicalCardId) {
  return VuePro.$http.get({
    url:
      "/product/hjt_health_monitor_info/user/getHealthMonitorInfo/" +
      id +
      "/" +
      indicatorId,
    params
  })
}

/**
 * 用户个人档案模块信息
 *
 */
export function getPersonalarchivesModule(servicePackageUserId, medicalCardId) {
  return VuePro.$http.get({
    url:
      "/product/hjt_health_record_info_package/details/" + servicePackageUserId,
    params: {
      medicalCardId: medicalCardId
    }
  })
}

/**
 * 获取用户的随访计划
 * @param id 用户的服务包id
 * @return {Promise<*>}
 */
export function hjtViewFollowUpPlan(id) {
  return VuePro.$http.get({
    url: "/product/hjt/followUp/user/viewPlan",
    params: {
      servicePackageUserId: id
    }
  })
}

/**
 * 获取用户问卷
 * @param id 用户的服务包id
 * @return {Promise<*>}
 */
export function hjtViewHealthTestPlan(id) {
  return VuePro.$http.get({
    url: "/product/hjt/followUp/user/currentFollowUpList",
    params: {
      servicePackageUserId: id
    }
  })
}

/**
 * 获取用户已完成问卷
 * @param servicePackageUserId 用户的服务包id
 * @return {Promise<*>}
 */
export function completeFollowUpList(servicePackageUserId, medicalCardId) {
  return VuePro.$http.get({
    url: "/product/hjt/followUp/user/allFollowUpList",
    params: {
      servicePackageUserId: servicePackageUserId,
      medicalCardId: medicalCardId
    }
  })
}

export function completeFollowUpApi(actionId) {
  return VuePro.$http.post({
    url: `/product/hjt/followUp/doctor/complete/${actionId}`,
    params: {
      advice: null
    }
  })
}

/**
 * 获取金刚区的健康自评的表单
 */
export function getFreeListApi(idList) {
  return VuePro.$http.get({
    url: `/product/survey/getFreeList`,
    params: idList
  })
}

/**
 * 获取用户历史报告详情
 * @param id 用户的服务包id
 * @return {Promise<*>}
 */
export function getHistoricalReport(servicePackageUserId, followUpId) {
  return VuePro.$http.get({
    url: "/product/hjt/followUp/user/userGetDetail",
    params: {
      servicePackageUserId: servicePackageUserId,
      followUpId: followUpId
    }
  })
}

/**
 * 健康教育信息
 *
 */
export function hjtHeDetail(id) {
  return VuePro.$http.post({
    url: "/product/hjt_he/detail/" + id
  })
}

/**
 * 健康教育信息
 *
 */
export function hjtHeFreeList(isNeedTenantId) {
  return VuePro.$http.get({
    url: "/product/hjt_he_free/list",
    isNeedAccessToken: false,
    isNeedTenantId: isNeedTenantId
  })
}

/**
 * 推荐健康教育信息
 *
 */
export function hjtHeRecommendList() {
  return VuePro.$http.get({
    url: "/system/wx/product/free/control/recommendation/list",
    isNeedAccessToken: false
  })
}
/**
 * 睡眠接口
 *
 */
export function getCateList(params) {
  return VuePro.$http.get({
    url: "/product/hjt_he_free/getCateList",
    params
  })
}

/**
 * 健康教育信息
 *
 */
export function isStudy(id) {
  return VuePro.$http.post({
    url: "/product/hjt_he/study/" + id
  })
}

/**
 * 教育点击展示增加
 *
 */
export function hjtHeClick(id) {
  return VuePro.$http.post({
    url: "/product/hjt_he/click/" + id,
    isNeedAccessToken: false
  })
}

/**
 * 学习教育详情
 *
 */
export function detailById(id) {
  return VuePro.$http.get({
    url: "/product/he_resourse/detail/" + id
  })
}

/**
 * 免费教育详情
 *
 */
export function detailFreeById(id) {
  return VuePro.$http.get({
    url: "/product/he_resourse/free/detail/" + id,
    isNeedAccessToken: false
  })
}

/**
 * 填写或修改监测信息
 *
 */
export function fillHealthMonitorInfo(data) {
  return VuePro.$http.post({
    url: "/product/hjt_health_monitor_info/user/fillHealthMonitorInfo",
    data
  })
}

/**
 * 填写档案
 *
 */
export function writeFile(id, medicalCardId, data) {
  return VuePro.$http.post({
    url: "/product/hjt_health_record_info_package/fillIn/" + id,
    params: {
      medicalCardId: medicalCardId
    },
    data
  })
}

/**
 * 查询处方列表
 *
 */
export function listFront(id, medicalCardId) {
  return VuePro.$http.get({
    url: "/product/prescribe/listFront/" + id,
    params: {
      medicalCardId
    }
  })
}

/**
 * 查询处方详情
 *
 */
export function listFrontDetail(servicePackageId, id) {
  return VuePro.$http.get({
    url: "/product/prescribeTage/listFront/" + servicePackageId + "/" + id
  })
}

/**
 * 查询服务步骤
 *
 */
export function getServiceSteps(id) {
  return VuePro.$http.get({
    url: "/product/healthPlan/getList/" + id,
    isCancelRepeat: false
  })
}

/**
 * 查询运动处方视频详情
 *
 */
export function getExercisePrescription(id, servicePackageId) {
  return VuePro.$http.get({
    url: "/product/prescribe/front/details/" + id + "/" + servicePackageId
  })
}

/**
 * 查询预约门店
 *
 */
export function getReservationStore() {
  return VuePro.$http.get({
    url: "/system/dept/team/list"
  })
}
/**
 * 查询预约时间
 *
 */
export function getReservationTime(teamId, date) {
  return VuePro.$http.get({
    url: "/product/shift/user/listByFollow",
    params: {
      date,
      teamId
    }
  })
}
/**
 * 提交预约
 *
 */
export function makeAppointment(data) {
  return VuePro.$http.post({
    url: "/product/shift/user/follow/makeAnAppointment",
    data: data
  })
}
/**
 * 获取问卷详情
 */
export function getQuestionnaireInfo(
  followUpId,
  projectId,
  servicePackageUserId,
  surveyId
) {
  return VuePro.$http.get({
    url: "/product/survey/user/answer/",
    params: {
      followUpId: followUpId,
      projectId: projectId,
      servicePackageUserId: servicePackageUserId,
      surveyId: surveyId
    }
  })
}

/**
 * 用户提交问卷
 */
export function submitQuestionnaire(followUpId, servicePackageUserId, data) {
  return VuePro.$http.post({
    url:
      "/product/survey/user/followUp/answer?followUpId=" +
      followUpId +
      "&servicePackageUserId=" +
      servicePackageUserId,
    data
  })
}

/**
 * 处方反馈
 */
export function feedback(data) {
  return VuePro.$http.post({
    url: "/product/prescribeUserDaily/add",
    data: data
  })
}

/**
 * 处方反馈回显数据查询
 */
export function getFeedbackInfo(id, askDate) {
  return VuePro.$http.get({
    url: "/product/prescribeUserDaily/user/" + id + "/" + askDate
  })
}

/**
 * 获取健康任务
 */
export function getHealthTask(servicePackageUserId, medicalCardId) {
  return VuePro.$http.get({
    url: "/product/hjt_service_package_user/healthTask",
    params: {
      servicePackageUserId: servicePackageUserId,
      medicalCardId: medicalCardId
    }
  })
}

/**
 * 获取预约门店信息
 */
export function getDoctorStore(servicePackageUserId, medicalCardId) {
  return VuePro.$http.get({
    url: "/product/hjt_service_package_user/getDeptsByServicePackageUserIdAndStrategy",
    params: {
      servicePackageUserId: servicePackageUserId,
      medicalCardId: medicalCardId
    }
  })
}

/**
 * 查询部门详情
 */
export function departmentDetails(deptId) {
  return VuePro.$http.get({
    url: `/system/dept/front/${deptId}`,
  })
}

/**
 * 提交全部问卷
 */
export function submitAll(followUpId, servicePackageUserId, medicalCardId) {
  return VuePro.$http.post({
    url: "/product/hjt/followUp/doctor/complete/" + followUpId,
    params: {
      servicePackageUserId: servicePackageUserId,
      medicalCardId: medicalCardId
    }
  })
}

/**
 * 安静心率评分
 *
 */
export function heartRateScore(data) {
  return VuePro.$http.post({
    url: "/product/survey/getScoreAndResult?surveyId=1",
    data: data
  })
}
/**
 * 健康总评分
 *
 */
export function healthTotalScore(data) {
  return VuePro.$http.post({
    url: "/product/evaluation/add",
    data: data
  })
}
/**
 * 获取健康自评历史记录
 */
export function getRecord(data) {
  return VuePro.$http.get({
    url: "/product/evaluation/list",
    params: data
  })
}
/**
 * 获取健康服务包信息
 */
export function getServicePackData(id) {
  return VuePro.$http.get({
    url: `/mall/api/front/product/detail/${id}`
  })
}

/**
 * 获取下一题
 */
export function getNextQuestion(data) {
  return VuePro.$http.post({
    url: "/product/new/survey/user/followUp/next",
    data
  })
}

/**
 *查询新的问卷详情
 */
export function getNewSurvey(surveyId) {
  return VuePro.$http.get({
    url: "/product/new/survey/user/detail",
    params: {
      surveyId: surveyId
    }
  })
}

/**
 * 用户提交新问卷
 */
export function submitNewQuestionnaire(followUpId, servicePackageUserId, data) {
  return VuePro.$http.post({
    url:
      "/product/new/survey/user/followUp/answer?followUpId=" +
      followUpId +
      "&servicePackageUserId=" +
      servicePackageUserId,
    data
  })
}

/**
 * 服务包过期支付
 */
export function paymentByStage(data) {
  return VuePro.$http.post({
    url: "/mall/api/front/pay/paymentByStage",
    data: data
  })
}

/**
 * 微信查询支付结果
 */
export function queryPayResult(data) {
  return VuePro.$http.get({
    url: "/mall/api/front/pay/queryPayResult?orderNo=" + data
  })
  // return VuePro.$http.get("pay/queryPayResult?orderNo=" + data)
}

/**
 * 获取睡眠处方token
 *
 */
export function getCBTIToken() {
  return VuePro.$http.get({
    url: "/product/prescribe/getCBTIToken"
  })
}
