<template>
  <IpmcDialog
    title="上传研报信息"
    :close="close"
    width="800px"
    destroy-on-close
    ref="dialogRef"
    class="mvp-show-dialog"
  >
    <div v-loading="loadingDialog" class="info-form">
      <div style="display: flex; padding-bottom: 20px" v-if="(!openId && !isSuper) || openId">
        <p style="width: 100px">基金公司</p>
        <p v-if="openId">{{ reportDetail.compSimpName || '--' }}</p>
        <p v-else>{{ info.compSimpName || '--' }}</p>
      </div>
      <div style="display: flex; padding-bottom: 20px" v-if="(!openId && !isSuper) || openId">
        <p style="width: 100px">备注</p>
        <p v-if="openId">{{ info.title || '--' }}</p>
      </div>
      <IpmcForm type="Form" :config="formCol" ref="form">
        <!-- 上传 -->
        <template #fileId>
          <div class="upload">
            <el-upload
              action=""
              drag
              :before-upload="beforeUpload"
              :http-request="httpRequest"
              :show-file-list="false"
              :on-change="handleChange"
              :multiple="false"
            >
              <em class="el-icon-plus"></em>
              <div class="el-upload__text">
                <p>将文件拖到此处，或点击 <span>上传文件</span></p>
                <p class="jgt-fs-12 jgt-mt-10">
                  只能上传格式为pdf的文件，且不超过
                  <em style="color: #dd2e2e; font-style: normal">20MB</em>
                </p>
              </div>
            </el-upload>
          </div>
        </template>
        <!-- 研报标题 -->
        <template #fileName="{ scope }">
          <div class="upload-res-list">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.fileName"
              :disabled="!(scope.fileName.length > 30)"
              placement="top"
            >
              <p class="file-name">
                {{ substrLength(scope.fileName) }}
              </p>
            </el-tooltip>
            <div class="el-form-item__error" v-if="sensitiveWordsStr"
              >检测到敏感词:{{ sensitiveWordsStr }}</div
            >
            <div class="upload-res-btn">
              <el-link
                :disabled="!scope.fileId"
                type="primary"
                style="margin-right: 20px"
                :underline="false"
                @click="download(scope.fileId)"
                >下载</el-link
              >
              <el-link type="primary" :underline="false" @click="delPdf" :disabled="!scope.fileId"
                >删除</el-link
              >
            </div>
          </div>
        </template>
        <!-- <template #secondCategoryId="{ scope }">
          <el-select
            v-model="scope.secondCategoryId"
            style="width: 100%"
            ref="secondSelectRef"
            placeholder="请选择研报二级分类"
            @visible-change="twoApi"
            @change="changeCategory(scope.secondCategoryId)"
          >
            <el-option
              v-for="item in towLabel"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template> -->

        <!-- 选择机构 -->
        <!-- <template #reportOrgName="{ scope }">
          <el-select
            v-model="scope.reportOrgName"
            filterable
            remote
            allow-create
            default-first-option
            reserve-keyword
            placeholder="请输入基金公司"
            :remote-method="firmRemoteMethod"
            clearable
            :popper-append-to-body="false"
            @change="changeFirm(scope.reportOrgName)"
            @clear="clearReportOrgName()"
          >
            <el-option
              v-for="(item, index) in firmOptions"
              :key="`${item.id}_${index}`"
              :label="item.reportOrgName"
              :value="{
                value: item.compId || item.reportOrgName,
                label: item.reportOrgName,
                reportOrgLogo: item.reportOrgLogo,
                reportOrgLogoId: item.id
              }"
            >
            </el-option>
          </el-select>
        </template> -->
        <!-- 上传机构logo -->
        <!-- <template #reportOrgLogo="{ scope }">
          <div class="upload">
            <UploadCode
              :measurement="['100px', '100px']"
              @httpRequest="httpRequestCode"
              :img="scope.reportOrgLogo"
            />
          </div>
        </template> -->

        <!-- 研报标签 -->
        <!-- <template #labels="{ scope }">
          <div id="tagid">
            <el-select
              v-model="scope.labels"
              multiple
              ref="select"
              allow-create
              style="width: 100%; height: auto"
              filterable
              default-first-option
              @input.native="addTag"
              remote
              clearable
              @change="labelChange"
              placeholder="请搜索研报标签"
            >
              <el-option
                v-for="item in labelOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </div>
        </template> -->
        <!-- 发布日期 -->
        <template #publishDate="{ scope }">
          <el-date-picker
            v-model="scope.publishDate"
            type="datetime"
            style="width: 100%"
            placeholder="选择发布日期"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          >
          </el-date-picker>
        </template>
        <!-- 发布日期 -->
        <template #summaryViewpoint="{ scope }">
          <el-input type="textarea" show-word-limit v-model="scope.summaryViewpoint"> </el-input>
        </template>
        <!-- 可查看机构 -->
        <!-- <template #orgIds="{ scope }">
          <div id="orgid">
            <el-select
              v-model="scope.orgIds"
              multiple
              filterable
              remote
              style="width: 100%"
              reserve-keyword
              placeholder="请搜索机构名称"
              @change="orgChange"
            >
              <el-option
                v-for="item in orgOptions"
                :key="item.orgName"
                :label="item.orgName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </template> -->
        <template #fundList="{ scope }">
          <el-select
            v-model="scope.fundList"
            remote
            multiple
            filterable
            :popper-append-to-body="false"
            reserve-keyword
            placeholder="请输入代表产品"
            :remote-method="queryFundListByManager"
            clearable
            style="width: 100%"
            :multiple-limit="10"
            id="select-product"
            value-key="simpleName"
            v-limitLength
          >
            <el-option
              v-for="(item, i) in productOptionList"
              :key="`${i}_${item.originCode}}`"
              :label="`${item.originCode}/${item.simpleName}`"
              :value="item"
            >
              <div>
                <span :class="item.innerCode ? `` : `is-bold`">{{ item.simpleName || '-' }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 16px">{{
                  item.originCode
                }}</span>
              </div>
            </el-option>
          </el-select>
        </template>
      </IpmcForm>
    </div>
    <template slot="footer">
      <div>
        <el-button type="primary" @click="submit" :loading="butLoading">{{
          uploadBtnText
        }}</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </template>
  </IpmcDialog>
</template>

<script>
// import UploadCode from './uploadLogo.vue'

import {
  getDownload,
  addEditReport,
  getNewUpload,
  getLabels,
  getReportById,
  // getLogoByOrg,
  getFirmOptionsList,
  getLikeFundList
} from '@/api/bus-frp-agg'
// import { getOrgLike } from '@/api/modules/user-management-api'
// import { getUpload } from '@/api/modules/road-show-api'
import dayjs from 'dayjs'

// 常量
import util from '@/libs/util'
import { PROD, findColumns, transformKey } from './config'
import { mapState } from 'vuex'
export default {
  // components: {
  //   UploadCode
  // },
  data() {
    return {
      isSafe: false,
      sensitiveWordLists: [],
      changeUploadFileFlag: false,
      xdapId: '',
      forcePublish: false,
      sensitiveWordsStr: '',
      formCol: {
        columns: findColumns('abjk', PROD.uploadFormConfig),
        footer: false,
        labelWidth: '100px'
      },
      compResult: {},
      time_d: null,
      labelOptions: [],
      towLabel: [],
      fileUrl: '',
      openId: '',
      loadingDialog: false,
      butLoading: false,
      orgOptions: [],
      firmOptions: [],
      compId: '',
      reportDetail: {},
      productOptionList: []
    }
  },
  computed: {
    ...mapState('d2admin/user', ['info']),
    isSuper() {
      return this.info?.roleName === '运营超级管理'
    },
    uploadBtnText() {
      return this.butLoading ? '上传报告中' : '立即上传'
    }
  },
  async mounted() {},
  methods: {
    // 模糊查询基金经理代表产品
    async queryFundListByManager(keyword) {
      this.productOptionList = []
      keyword = keyword.replace(/\s*/g, '')
      if (!keyword) return
      const { compId = '' } = this.$refs.form.form
      const params = {
        fundNameOrCode: keyword,
        compId: compId || this.info.compId
      }
      const res = await getLikeFundList(params)
      if (res && res.length > 0) {
        this.productOptionList = res.map(item => {
          const { innerCode = '', fundCode = '', simpName = '' } = item

          return {
            innerCode: innerCode,
            originCode: fundCode,
            simpleName: simpName
          }
        })
      }
    },
    // 基金公司搜索
    remoteMethod(keyword) {
      keyword = keyword?.replace(/\s*/g, '')
      if (!keyword) return
      const params = { compName: keyword }
      this.firmOptions = []
      return new Promise(resolve => {
        getFirmOptionsList(params).then(list => {
          this.firmOptions = list
          resolve(transformKey(list, 'compId', 'compSimpName'))
        })
      })
    },
    // changeCategory(id) {
    //   const val = this.$refs.form.form
    //   const form = {
    //     fileId: val.fileId || '',
    //     labels: val.labels || [],
    //     reCommandFlag: val.reCommandFlag || '',
    //     publishDate: val.publishDate || '',
    //     notificationFlag: val.notificationFlag,
    //     reportOrgName: val.reportOrgName,
    //     reportOrgLogo: val.reportOrgLogo,
    //     synchronizeWechatFlag: val.synchronizeWechatFlag,
    //     orgIds: val.orgIds || ['0'],
    //     summaryViewpoint: val.summaryViewpoint || '',
    //     secondCategoryId: val.secondCategoryId || ''
    //   }
    //   const list = this.towLabel.filter(item => item.id === id)
    //   let columns = ''
    //   if (list[0].categoryName === '机构观点') {
    //     this.showLogo = true
    //     columns = this.getColumns('apbcdmleifjhk', val.synchronizeWechatFlag === '1')
    //   } else {
    //     this.showLogo = false
    //     columns = this.getColumns('apbcdeifjhk', val.synchronizeWechatFlag === '1')
    //   }
    //   this.$nextTick(() => {
    //     this.$refs.form.setColumns(columns)
    //     this.$refs.form.setData(form)
    //   })
    // },
    // clearReportOrgName() {
    //   this.$refs.form.setData({
    //     reportOrgLogo: ''
    //   })
    //   this.reportOrgLogoId = ''
    //   this.compId = ''
    // },
    // 清除公司和经理事件 1是公司，2是经理
    // clear(index) {
    //   // 判断是否是专场
    //   if (this.specialValue === '0') {
    //     // 非专场
    //     //  如果清空的是经理则清空清空照片
    //     this.imageUrl = {
    //       // 图片地址
    //       value: '',
    //       label: ''
    //     }
    //     // 清空管理规模和嘉宾简介
    //     this.form.introduction = ''
    //     this.form.product = ''
    //     this.form.manageScale = ''
    //   } else {
    //     // 专场
    //     if (index === 1) {
    //       this.imageUrl = {
    //         // 图片地址
    //         value: '',
    //         label: ''
    //       }
    //     }
    //   }
    // },
    // 基金公司模糊搜索
    // async firmRemoteMethod(query) {
    //   query = query.replace(/\s*/g, '')
    //   const params = {
    //     keyword: query
    //   }
    //   try {
    //     const res = await getLogoByOrg(params)

    //     if (!res?.length) return

    //     this.firmOptions = res
    //   } catch (error) {}
    // },

    // 上传logo
    async httpRequestCode(file) {
      const _file = file.file
      const formData = new FormData()
      formData.append('file', _file)
      try {
        const res = await getNewUpload(formData, { 'Content-Type': 'image/jpeg' })
        if (res.fileUrl && res.fileId) {
          this.xdapId = res.xdapId
          this.$refs.form.setData({
            reportOrgLogo: res.fileUrl
          })
        }
      } catch (error) {}
    },
    // 基金公司触发事件
    changeFirm(obj) {
      this.compId = obj.value
      this.reportOrgLogoId = obj.reportOrgLogoId
      this.$refs.form.setData({
        reportOrgLogo: obj.reportOrgLogo
      })
    },
    // 查询研报标签
    async getTagLabels(keyword) {
      const params = {
        keyword
      }
      try {
        const list = await getLabels(params)
        this.labelOptions = list || []
      } catch (error) {}
    },
    // //  添加研报标签
    // addTag(el) {
    //   //  处理输入tag长度限制
    //   el.target.setAttribute('maxLength', 20)
    //   el.target.value = el.target.value?.trim()
    //   this.$refs.select.query = el.target.value
    //   if (!el.target.value) return
    //   if (this.time_d) {
    //     clearTimeout(this.time_d)
    //   }
    //   this.time_d = setTimeout(() => {
    //     this.getTagLabels(el.target.value)
    //   }, 1000)
    // },
    // labelChange() {
    //   this.$nextTick(() => {
    //     const labels = this.$refs.form.form.labels || []
    //     if (labels.length > 20) {
    //       this.$message.warning('单篇标签最多支持20个!')
    //       this.$refs.form.setData({
    //         labels: labels.slice(0, 20)
    //       })
    //     }
    //   })
    // },
    // 查询一级标签
    // oneApi() {
    //   console.log(11111111111111)
    //   return new Promise(resolve => {
    //     getCategoryPage({}).then(list => {
    //       resolve(transformKey(list.records, 'id', 'categoryName'))
    //     })
    //   })
    // },
    // orgChange(orgIds = []) {
    //   this.$nextTick(() => {
    //     if (Array.isArray(orgIds) && orgIds.length) {
    //       const item = orgIds[orgIds.length - 1]
    //       if (item === '0') {
    //         this.$refs.form.setData({
    //           orgIds: ['0']
    //         })
    //       } else {
    //         this.$refs.form.setData({
    //           orgIds: orgIds.filter(i => i !== '0') || []
    //         })
    //       }
    //     }
    //   })
    // },
    // // 机构模糊搜索
    // remoteMethodOrg (orgName) {
    //   const params = { orgName }

    //   getOrgLike(params).then((list = []) => {
    //     this.orgOptions = [
    //       { orgName: '全部(' + this.orgTotal + ')', id: '0' },
    //       ...list
    //     ]
    //   })
    // },
    getStyle() {
      const el = document.querySelector('#tagid .el-input input')
      if (!el || !el.classList) return
      el.classList && el.classList.remove('el-input__inner')
      el.className = 'el-input__inners'
      const el1 = document.querySelector('#orgid .el-input input')
      if (!el1) return
      el1 && el1.classList.remove('el-input__inner')
      el1.className = 'el-input__inners'
    },
    // oneChange(val) {
    //   this.oneClear()
    // },
    // 一级分类清空事件
    // oneClear(val) {
    //   this.$nextTick(() => {
    //     this.$refs.form.setData({
    //       secondCategoryId: ''
    //     })
    //   })
    // },
    // 查询二级标签
    // async twoApi(v) {
    //   const categoryId = this.$refs.form.form.categoryId
    //   if (v && categoryId) {
    //     const params = {
    //       parentId: categoryId
    //     }
    //     try {
    //       const { records } = await getSecondCategoryPage({ params })
    //       this.towLabel = records || []
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }
    // },
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      // const pattern = /[+/\\?#&=？]/
      const name = file.name.split('.')
      // const overallName = file.name
      const type = name[name.length - 1]
      if (type !== 'pdf') {
        this.$message.error('格式非PDF，无法上传。')
        return false
      }
      if (!isLt20M) {
        this.$message.error('最大支持20MB。')
        return false
      }
      // if (pattern.test(overallName)) {
      //   this.$message.error('文件上传失败: 文件名称不能包含特殊字符+/?#&=？')
      //   return false
      // }
      // return isLt20M && type === 'pdf' && !pattern.test(overallName)
      return isLt20M && type === 'pdf'
    },
    // 上传
    async httpRequest(file) {
      this.butLoading = true
      const _file = file.file
      const str = file.file.name
      const name = str.substring(0, str.lastIndexOf('.'))
      if (!name) return this.$message.error('上传文件名不能为空！')
      const formData = new FormData()
      formData.append('file', _file)
      try {
        const res = await getNewUpload(formData, {
          'Content-Type': 'multipart/form-data'
        })
        this.xdapId = res.xdapId
        this.fileUrl = res.fileUrl || ''
        this.$nextTick(() => {
          this.butLoading = false
          this.$message.success('上传成功')
          this.$refs.form.setData({
            fileId: res.fileId || '',
            fileName: name
          })
        })
      } catch (error) {
        this.butLoading = false
      }
    },
    // 下载
    async download(fileId) {
      if (fileId) {
        try {
          const blob = await getDownload(
            {
              fileId
            },
            {
              responseType: 'blob'
            }
          )
          util.blob2Excel(blob && blob.blob, blob.fileName)
        } catch (error) {
          console.log(error)
        }
      }
    },
    // 删除
    delPdf() {
      this.fileUrl = ''
      this.$refs.form.setData({
        fileId: '',
        fileName: ''
      })
    },
    setReportName(name) {
      const list = this.firmOptions.filter(item => item.reportOrgName === name)
      return {
        value: list[0]?.compId || null,
        label: list[0]?.reportOrgName || null,
        reportOrgLogo: list[0]?.reportOrgLogo || null,
        reportOrgLogoId: list[0]?.id || null
      }
    },
    // 弹窗打开事件
    async open(id) {
      this.$refs.dialogRef.open()
      this.sensitiveWordsStr = ''
      this.changeUploadFileFlag = false
      this.forcePublish = false
      this.sensitiveWordLists = []
      this.compResult = {}
      if (id) {
        this.openId = id
        const params = {
          id
        }
        this.loadingDialog = true
        try {
          const list = await getReportById(params)
          this.productOptionList = list.fundList || []
          const sensitiveWords = list?.sensitiveWords ? list?.sensitiveWords.split(';') : []
          this.sensitiveWordLists = sensitiveWords
          let sensitiveWordsStr = ''
          sensitiveWords.map(item => {
            sensitiveWordsStr += item + '、'
          })
          this.sensitiveWordsStr = sensitiveWordsStr.substring(0, sensitiveWordsStr.length - 1)
          this.$nextTick(() => {
            this.reportDetail = list
            this.fileUrl = list.fileUrl || ''
            this.$refs.form.setData({
              fileId: list.fileId || '',
              fileName: list.fileName || '',
              labels: list.labelNameList || [],
              publishDate: list.publishDate || '',
              compId: list.compId || '',
              fundList: list.fundList || []
            })
            this.compResult.compId = list.compId || ''
            this.getStyle()
            // 编辑初始化
            // this.changeCategory(list.secondCategory.id)
            // this.statusChange(list.synchronizeWechatFlag, list)
          })
        } finally {
          this.loadingDialog = false
        }
      } else {
        this.$nextTick(() => {
          this.$refs.form.setData({
            publishDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm')
          })
        })
      }
      if (!this.openId && this.isSuper) {
        let columns = findColumns('dabjk', PROD.uploadFormConfig, ({ d }) => {
          Object.assign(d, {
            api: this.remoteMethod.bind(this),
            on: {
              change: this.compChange.bind(this)
            }
          })
        })
        this.$nextTick(() => {
          this.$refs.form.setColumns(columns)
        })
      }
      await this.$nextTick()
      this.getStyle1()
    },
    getStyle1() {
      // 代表产品
      const el3 = document.getElementById('select-product')
      if (el3) {
        el3.classList.remove('el-input__inner')
        el3.className = 'el-input__inners'
      }
    },
    handleChange(file, fileList) {
      this.changeUploadFileFlag = true
    },
    // 编辑新增
    async addEditForm(form) {
      this.butLoading = true
      try {
        await addEditReport(form)
        this.$message.success('修改成功！')
        // this.clearReportOrgName()
        this.close()
        this.$emit('uploadTable')
      } finally {
        this.butLoading = false
      }
    },
    sbmitRelease(form) {
      const data = {
        ...form,
        orgIds: ['0'],
        reCommandFlag: '0',
        synchronizeWechatFlag: '1',
        notificationFlag: '0',
        isPublic: '1',
        fileUrl: this.fileUrl,
        id: this.openId ? this.openId : '',
        compId: this.isSuper ? form.compId || this.compResult?.compId : this.info?.compId,
        compName: this.isSuper ? this.compResult?.compName : this.info?.compName,
        compSimpName: this.isSuper ? this.compResult?.compSimpName : this.info?.compSimpName,
        xdapId: this.xdapId,
        forcePublish: this.forcePublish
      }
      this.addEditForm(data)
    },
    // 发布
    submit() {
      this.$refs.form.submit(form => {
        if (this.sensitiveWordLists.length && !this.changeUploadFileFlag) {
          this.$confirm('文章中存在敏感词，继续提交将进入人工审核流程，是否确认提交?', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning'
          })
            .then(() => {
              this.forcePublish = true
              this.sbmitRelease(form)
            })
            .catch(() => {})
        } else {
          this.forcePublish = false
          this.sbmitRelease(form)
        }
      })
    },
    // 关闭重置
    close() {
      this.labelOptions = []
      this.towLabel = []
      this.fileUrl = ''
      this.openId = ''
      this.$refs.dialogRef.cancel()
    },
    substrLength(val) {
      let str = '--'
      if (val) {
        str = val
        if (val.length > 30) {
          str = val.substr(0, 30) + '...'
        }
      }
      return str
    },
    compChange(v) {
      this.$refs.form.setData({ fundList: [] })
      this.productOptionList = []
      let findResult = this.firmOptions.find(item => item.compId === v)
      if (findResult) this.compResult = findResult
    }
    // 是否同步小程序
    // statusChange(value, data) {
    //   const val = this.$refs.form.form
    //   let reportOrgName = null
    //   let reportOrgLogo = null
    //   if (data) {
    //     reportOrgName = data.reportOrgName
    //     reportOrgLogo = data.reportOrgLogo
    //   } else {
    //     reportOrgName = val.reportOrgName
    //     reportOrgLogo = val.reportOrgLogo
    //   }
    //   // const reportOrgName = this.setReportName(val.reportOrgName)
    //   const form = {
    //     fileId: val.fileId || '',
    //     fileName: val.fileName || '',
    //     categoryId: val.categoryId || '',
    //     labels: val.labels || [],
    //     orgIds: val.orgIds || ['0'],
    //     reCommandFlag: val.reCommandFlag || '',
    //     publishDate: val.publishDate || '',
    //     notificationFlag: val.notificationFlag,
    //     reportOrgName,
    //     reportOrgLogo,
    //     synchronizeWechatFlag: value,
    //     summaryViewpoint: val.summaryViewpoint || '',
    //     secondCategoryId: val.secondCategoryId || ''
    //   }

    //   const list = this.towLabel.filter(item => item.id === val.secondCategoryId)
    //   let columns = ''
    //   if (list[0]?.categoryName === '机构观点') {
    //     this.showLogo = true
    //     columns = 'apbcdmleifjhk'
    //   } else {
    //     this.showLogo = false
    //     columns = 'apbcdeifjhk'
    //   }
    //   if (value === '1') {
    //     const newCol = this.getColumns(columns, true)
    //     this.$nextTick(() => {
    //       this.$refs.form.setColumns(newCol)
    //       this.$refs.form.setData(form)
    //     })
    //   } else {
    //     this.$nextTick(() => {
    //       const newCol = this.getColumns(columns, false)
    //       this.$refs.form.setColumns(newCol)
    //       this.$refs.form.setData(form)
    //     })
    //   }
    // },
    // getColumns(col, isRequired) {
    //   console.log(isRequired)
    //   const columns = findColumns(col, PROD.uploadFormConfig, ({ c, i, k }) => {
    //     Object.assign(c, {
    //       api: this.oneApi.bind(this),
    //       on: {
    //         clear: this.oneClear.bind(this),
    //         change: this.oneChange.bind(this)
    //       }
    //     })
    //     Object.assign(i, {
    //       on: { change: this.statusChange.bind(this) }
    //     })
    //     Object.assign(k, {
    //       rules: {
    //         required: isRequired,
    //         message: '请输入周度权益调研观点总结'
    //       }
    //     })
    //   })
    //   return columns
    // }
  },
  destroyed() {
    clearTimeout(this.time_d)
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__label {
  overflow: initial;
}

.mvp-show-dialog {
  ::v-deep .el-input__inners {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #c0c0c0;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }

  .upload-res-list {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 36px;
    .file-name {
      white-space: nowrap;
      font-size: 14px;
    }
    .upload-res-btn {
      white-space: nowrap;
      margin-left: 150px;
      // width: 100%;
      display: flex;
      a {
        white-space: nowrap;
        font-size: 14px;
      }
      .delete-upload {
        margin-left: 10px;
      }
    }
  }
  .upload {
    .el-icon-plus {
      margin-top: 20px;
      font-size: 35px;
    }
  }
  ::v-deep .el-textarea {
    textarea {
      max-height: 100px;
      padding: 7.5px 0 7.5px 8px;
      line-height: 20px;
    }
    .el-input__count {
      line-height: 20px;
    }
  }
  ::v-deep div.el-dialog {
    .el-dialog__footer {
      display: flex;
      justify-content: center;
      padding: 16px;
      border-width: 1px 0px 0px 0px;
      border-style: solid;
      border-color: rgba(0, 0, 0, 0.1);
      .el-button {
        padding: 9px 20px;
        height: auto;
      }
    }
  }
  ::v-deep .el-dialog__header {
    padding: 16px !important;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    color: rgba(0, 0, 0, 0.9);
    .el-dialog__headerbtn {
      top: 20px;
      right: 18px;
      font-size: 16px;
      .el-dialog__close {
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }
}
::v-deep {
  // 重构el-input样式
  .el-select .el-input__inners {
    cursor: pointer;
  }

  .el-input--suffix .el-input__inners {
    padding-right: 30px;
  }

  .el-input__inners {
    width: 100%;
    // -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #38383b;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:hover {
      border-color: #d60010;
    }
  }

  .el-input__inners::placeholder {
    @include color(A8);
    // font-size: 16px;
  }

  .el-select .is-focus .el-input__inners {
    border-color: #d60010;
  }

  .el-scrollbar {
    .is-disabled {
      color: #c0c4cc !important;
      &:hover {
        color: #c0c4cc !important;
        background-color: #ffff !important;
      }
    }
  }
}
</style>
