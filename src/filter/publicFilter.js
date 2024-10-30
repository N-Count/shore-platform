import util from '@/libs/util.js'
import dayjs from 'dayjs'

/**
 * 阿拉伯数字转换为简写汉字
 * @param Num 数字的字符串格式
 * @param moneyOrQuantity 是格式化成数字还是金额, 默认是money, 可选值为quantity
 * @returns string
 */
export const arabiaToSimplifiedChinese = (Num, moneyOrQuantity) => {
  let newStr = util.Arabia_To_SimplifiedChinese(Num, moneyOrQuantity)
  return newStr
}

/**
 * 千分位格式化
 * @param Num 数字的字符串格式
 * @returns string
 */
export const thousands = (Num) => {
  let newStr = util.thousands(Num)
  return newStr
}

/**
 * 证件有效期的转义
 * @param time 8位数的时间格式yyyymmdd
 * @returns string '永久有效/2020-12-03'
 */
export const permanentTime = (time) => {
  let newStr = util.permanentTime(time)
  return newStr
}
export const timeFormatB = (str) => {
  let newStr = util.time_FormatB(str)
  return newStr
}
export const timeFormatC = (str) => {
  let newStr = util.time_FormatC(str)
  return newStr
}

/**
 * 将数字格式化成无限制/***亿元/***万元/***元
 * @param Num 数字的字符串格式
 * @returns string
 */
export const numberToLiteChineseMoney = (Num) => {
  let newStr = util.numberToLiteChineseMoney(Num)
  return newStr
}

// 加密显示
export const encrypt = (value) => {
  if (!value) return ''
  value = value.toString()

  if (value.length < 8) {
    return value
  }
  let start = value.substring(0, 3)
  let end = value.substring(value.length - 4)
  return start + '****' + end
}

// 格式化日期
export const dayStr = (value) => {
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD')
}

// 日期时间的part1
export const getDate = (value) => {
  if (!value) return ''
  return value.substring(0, 10)
}

// 日期时间的part2
export const getTime = (value) => {
  if (!value) return ''
  return value.substring(11)
}

// toFixed 2
export const fixed2 = (value) => {
  if (!value || isNaN(value)) return 0
  return Number(value).toFixed(2)
}

// 获取时间
export const time = (value) => {
  if (!value) return ''
  const res = dayjs(value).format('YYYY-MM-DD  HH:mm:ss')
  return res.substring(11)
}

// 去除基金后缀
export const filterFundSuffix = (fundCode) => {
  let newCode = fundCode ? fundCode.split('.')[0] : ''
  return newCode
}
