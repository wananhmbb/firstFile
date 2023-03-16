export const sexEnum = {
  MAN:1,
  WOMAN:0,
  UN_KNOW:2
}
export const sexDictType = {
  [sexEnum.MAN]: '男',
 [sexEnum.WOMAN]: '女',
  [sexEnum.UN_KNOW]: '未知',
}
export const setSexList = [
  {
    value:sexEnum.MAN,
    label: sexDictType[sexEnum.MAN]
  },
  {
    value:sexEnum.WOMAN,
    label: sexDictType[sexEnum.WOMAN]
  }

]