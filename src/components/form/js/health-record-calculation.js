export let SexEnum = {
  MAN: "0",
  WOMAN: "1"
}
export let SexDict = {
  [SexEnum.MAN]: "男",
  [SexEnum.WOMAN]: "女"
}
/**
 * 相对BMI
 * @param ht 身高（cm）
 * @param wt 体重（kg）
 * @constructor
 */
export function BMI(ht, wt) {
  const ht_m = ht / 100
  return (wt / (ht_m * ht_m)).toFixed(2)
}

/**
 * 相对脂肪质量指数(档案里的体脂率)
 * @param ht 身高（cm）
 * @param waist 腰围（cm）
 * @param sex 性别
 * @constructor
 */
export function RFM(ht, waist, sex) {
  const ht_m = ht / 100
  const waist_m = waist / 100
  if (sex === SexEnum.MAN) {
    return (64 - (20 * ht_m) / waist_m).toFixed(1)
  } else if (sex === SexEnum.WOMAN) {
    return (76 - (20 * ht_m) / waist_m).toFixed(1)
  }
}

const PhysicalActivityLevel = {
  [SexEnum.MAN]: {
    几乎不运动: 1.0,
    "低强度运动（散步、遛狗、做家务）": 1.11,
    "中等强度运动（健步走、慢跑、骑自行车）": 1.25,
    "高强度运动（感觉大喊淋漓、气喘吁吁）": 1.48
  },
  [SexEnum.WOMAN]: {
    几乎不运动: 1.0,
    "低强度运动（散步、遛狗、做家务）": 1.12,
    "中等强度运动（健步走、慢跑、骑自行车）": 1.27,
    "高强度运动（感觉大喊淋漓、气喘吁吁）": 1.45
  }
}

/**
 * 每日热量消耗（千卡）
 * @param age 年龄
 * @param wt 体重（kg）
 * @param ht 身高（cm）
 * @param physicalActivityLevel 运动等级
 * @param sex 性别
 * @constructor
 */
export function EER(age, wt, ht, physicalActivityLevel, sex) {
  const ht_m = ht / 100
  const pa = PhysicalActivityLevel[sex][physicalActivityLevel]
  if (sex === SexEnum.MAN) {
    return (662 - 9.53 * age + pa * (15.91 * wt + 539.6 * ht_m)).toFixed(1)
  } else if (sex === SexEnum.WOMAN) {
    return (354 - 6.91 * age + pa * (9.36 * wt + 726 * ht_m)).toFixed(1)
  }
}
