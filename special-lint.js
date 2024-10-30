const fs = require("fs")
const chalk = require("chalk")
const packageJsonData = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const {
  dependencies
} = packageJsonData
let flag = false

const args = process.argv.slice(2);

Object.values(dependencies).forEach(val => {
  if (flag) return
  if (val.includes("~") || val.includes("^")) {
    flag = true
  }
})
if (flag) {
  const lintType = args[0]
  if (lintType === 'commitlint') {
    console.log(
      `${chalk.red.white(" ERROR ")} ${chalk.bold.red(
          `无效的commit提交`
        )}\n\n` +
      chalk.red(
        `请检查package.json, 确认生产npm包版本已锁定`
      )
    )
    process.exit(1)
  }
  throw Error('请检查package.json, 确认生产npm包版本已锁定')
}
