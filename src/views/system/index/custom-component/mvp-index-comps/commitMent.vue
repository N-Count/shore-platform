<template>
  <JgyDialog
    :dialogVisible="visible"
    title="承诺函"
    class="jgy-promise-dialog"
    @dialog-cancel="cancelModel"
    :append-to-body="true"
    width="800px"
  >
    <template #content>
      <div class="promise-wrap">
        <p>
          本人/本机构承诺，本人/本机构和本人/本机构委托财产来源的最终投资者（如有）（以下统称“投资人”）均为符合《关于规范金融机构资产管理业务的指导意见》、《证券投资基金法》、《私募投资基金监督管理暂行办法》、《私募投资基金募集行为管理办法》、《关于加强私募投资基金监管的若干规定》及相关法律法规规定的合格投资者。
        </p>
        <p> 一、投资人承诺符合下列条件： </p>
        <p>
          （一）具备相应风险识别能力和风险承受能力，投资于单只私募基金的金额不低于100万元且是符合下列条件的自然人、法人或者其他组织：
        </p>
        <p> 1、净资产不低于1000万元的单位； </p>
        <p> 2、金融资产不低于300万元或者最近三年个人年均收入不低于50万元的个人。 </p>
        <p> （二）下列投资者情形之一： </p>
        <p> 1、社会保障基金、企业年金等养老金，慈善基金等社会公益基金； </p>
        <p> 2、依法设立并在基金业协会备案的投资计划； </p>
        <p> 3、投资于所管理私募基金的私募基金管理人及其从业人员； </p>
        <p> 4、国务院金融监督管理部门监管的机构依法发行的资产管理产品； </p>
        <p> 5、合格境外机构投资者、人民币合格境外机构投资者； </p>
        <p> 6、中国证监会规定的其他投资者。 </p>
        <p>
          二、投资人为合伙企业、契约等非法人形式，通过汇集多数投资者的资金直接或者间接投资于私募基金的，本机构同时承诺已核查最终投资者为合格投资者，合并计算的投资者人数累计不超过特定数量，且投资本基金不会导致多层嵌套的合规风险（包括但不限于《关于规范金融机构资产管理业务的指导意见》第二十二条）。
        </p>
        <p>
          三、投资人以真实身份和自有资金参与私募基金，且委托资金的来源符合法律、行政法规的规定。不存在使用贷款、发行债券等筹集的非自有资金投资本基金的情况。
        </p>
        <p class="confirm-text"> 点击“确定”代表您也仔细阅读以上内容并确认。 </p>
      </div>
    </template>
    <template #footer>
      <el-button size="small" type="primary" @click="enterModel">确 定</el-button>
      <el-button @click="cancelModel" size="small">取消</el-button>
    </template>
  </JgyDialog>
</template>

<script>
import JgyDialog from '@/views/components/jgy-dialog'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    JgyDialog
  },
  watch: {},
  data() {
    return {}
  },
  methods: {
    enterModel() {

      this.$emit('contralModel', 'enter')
    },
    cancelModel() {

      this.$emit('contralModel', 'cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.promise-wrap {
  font-family: PingFang SC, sans-serif;
  font-size: 12px;
  line-height: 20px;
  text-align: justify; /* 浏览器可能不支持 */
  letter-spacing: 0px;
  color: #4e5969;
  padding: 0 8px;
}
.confirm-text {
  /* 点击“确定”代表您也仔细阅读以上内容并确认。 */
  font-weight: bold;
  margin-top: 24px;
}
</style>
