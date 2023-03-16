export const ProductTypeEnum = {
  //后端暂时还没有这个枚举
  OTC_DRUG: "OTC_DRUG",
  R_DRUG: " R_DRUG"
}
export const ProductTypeDictType = {
  [ProductTypeEnum.OTC_DRUG]: "非处方药",
  [ProductTypeEnum.R_DRUG]: "处方药"
}
