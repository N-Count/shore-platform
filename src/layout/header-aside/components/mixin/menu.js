import util from '@/libs/util.js'
import request from '@/plugin/axios'
// 九鞅接入 跳转携带token
const jumpPage = async (newPageUrl) => {
  let res = await request.get('api/bus-frp-auth/auth/user/get-9m-token')
  console.log(res, '用户token')
  util.open(`${newPageUrl}?token=${res}`)
}

export default {
  methods: {
    handleMenuSelect (index, indexPath) {
      if (/^d2-menu-empty-\d+$/.test(index) || index === undefined) {
        this.$message.warning('临时菜单')
      } else if (/^https:\/\/|http:\/\//.test(index)) {
        jumpPage(index)
        // util.open(index)
      } else {
        this.$router.push({
          path: index
        })
      }
    }
  }
}
