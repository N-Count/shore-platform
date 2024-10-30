<template>
  <el-drawer
    title="发布资讯"
    :visible.sync="drawer"
    :size="1000"
    :direction="direction"
    @open="opened"
    custom-class="release-drawer"
    :before-close="handleClose"
  >
    <div class="container" v-loading="submitLoading">
      <el-form v-if="drawer" :model="newsForm" :rules="rules" ref="newsForm" label-width="100px">
        <el-form-item label="基金公司" label-width="100px" prop="compId" v-if="isCompShow">
          <el-select
            style="width: 100%"
            v-model="newsForm.compId"
            filterable
            :popper-append-to-body="true"
            remote
            reserve-keyword
            placeholder="请输入基金公司"
            v-limit-length="20"
            @change="compChange"
            :remote-method="firmRemoteMethod"
            clearable
          >
            <el-option
              v-for="item in firmOptions"
              :key="item.compId"
              :label="item.compSimpName"
              :value="item.compId"
            >
              <span :class="item.compId ? `` : `is-bold`">{{ item.compSimpName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="基金公司" v-if="!isCompShow">
          <span>{{
            newsForm.compSimpName ? newsForm.compSimpName : info.compSimpName || '--'
          }}</span>
        </el-form-item>
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model.trim="newsForm.title"
            maxlength="50"
            placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="副标题" prop="remark">
          <el-input v-model="newsForm.remark" maxlength="60" placeholder="选填"></el-input>
        </el-form-item>

        <el-form-item label="上传封面" prop="cover">
          <el-upload
            drag
            action=""
            :http-request="httpRequest"
            :show-file-list="false"
            :accept="'image/*'"
            :multiple="false"
            :before-upload="beforeUpload"
          >
            <el-image
              v-if="newsForm.cover"
              class="image"
              alt="#"
              :src="newsForm.cover"
              fit="contain"
            ></el-image>
            <template v-else>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__text" style="font-size: 12px; margin-top: -15px"
                >(图片比例2.35：1)</div
              >
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px" label="添加附件" prop="fileId">
          <div class="upload">
            <el-upload
              action=""
              :before-upload="beforeUploadPdf"
              :http-request="httpRequestPdf"
              :file-list="fileList"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :limit="1"
              :multiple="false"
            >
              <el-button size="small" type="primary" :loading="butLoading">{{
                uploadBtnText
              }}</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <div class="waring-text" v-if="sensitiveWordsStr"
          >详情内容或附件检测到敏感词:{{ sensitiveWordsStr }}</div
        >
        <el-form-item label="详细内容" prop="content">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 800px; overflow-y: hidden"
              v-model="html"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
              @onChange="onChange"
            />
          </div>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button class="release-btn" @click="release" :disabled="butLoading">发布</el-button>
        <el-button class="preview-btn" @click="preview" :disabled="butLoading">预览</el-button>
        <el-button class="save-btn" @click="save" :disabled="butLoading">保存为草稿</el-button>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      :before-close="
        () => {
          dialogVisible = false
        }
      "
    >
      <span>确认发布该条资讯？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </el-drawer>
</template>

<script>
// 组件引入
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// 常规JS引入
import {
  editFundCompanyNews,
  getFundCompanyNewsDetail,
  getNewUpload,
  getFirmOptionsList
} from '@/api/bus-frp-agg'
// 常量引入
import { toolbarConfig, mode, rules } from './config'
// 混入引入
// VueX引入
import { mapState } from 'vuex'
// 埋点混入
export default {
  mixins: [],
  props: {
    id: String,
    editOrgCode: String,
    row: [String, Object]
  },
  components: { Editor, Toolbar },
  data() {
    return {
      onlyPdf: false,
      isSafe: false,
      sensitiveWordLists: [],
      changeUploadFileFlag: false,
      xdapId: '',
      forcePublish: false,
      sensitiveWordsStr: '',
      submitLoading: false,
      butLoading: false,
      dialogVisible: false,
      drawer: false,
      manualReview: false,
      direction: 'rtl',
      newsForm: {},
      compResult: {},
      editor: null,
      html: null,
      toolbarConfig,
      editorFlag: false,
      compSimpName: '',
      firmOptions: [],
      fileList: [],
      // editor配置
      editorConfig: {
        placeholder: '',
        MENU_CONF: {
          uploadImage: {
            base64LimitSize: 5 * 1024 * 1024 * 1024 // 5G 以下插入 base64
          }
          // uploadVideo: {
          //   // 自定义图片上传
          //   async customUpload(file, insertFn) {
          //     // file 即选中的文件
          //     const fd = new FormData()
          //     fd.append('file', file)
          //     console.log(fd)
          //     getNewUpload(fd)
          //       .then(res => {
          //         // const url = process.env.VUE_APP_BASE_IMG + response
          //         // 插入图片
          //         this.xdapId = res.xdapId
          //         insertFn(res.fileUrl)
          //       })
          //       .catch(() => {})
          //   }
          // }
        }
      },
      mode,
      rules
    }
  },
  watch: {},
  computed: {
    ...mapState('d2admin/user', ['info']),
    isCompShow() {
      return this.info?.roleName === '运营超级管理' && !this.id
    },
    isSuper() {
      return this.info?.roleName === '运营超级管理'
    },
    uploadBtnText() {
      return this.butLoading ? '上传附件中' : '点击上传'
    }
  },

  methods: {
    confirm() {
      this.dialogVisible = false
      this.releaseHttpRequest('published')
    },
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('最大支持20MB。')
        return false
      }
      return isLt20M
    },
    async releaseHttpRequest(status, preview = false) {
      try {
        const params = {
          ...this.newsForm,
          orgCode: this.editOrgCode || this.info.orgCode,
          // status: status,
          draft: status === 'un_publish',
          compId: this.isSuper ? this.newsForm?.compId : this.info?.compId,
          compName: this.compResult?.compName,
          compSimpName: this.compResult?.compSimpName,
          forcePublish: this.forcePublish,
          xdapId: this.xdapId
        }
        if (this.id) params.id = this.id
        this.submitLoading = true
        const res = await editFundCompanyNews(params)
        this.submitLoading = false
        this.drawer = false
        if (preview) {
          this.$router.push({
            path: '/release-info/release-preview?id=' + (this.id || res)
          })
        }
        this.$emit('save')
        this.$emit('resetCode')
        if (!preview) this.$message.success(status === 'published' ? '发布成功' : '保存成功')
      } catch (err) {
        this.submitLoading = false
      }
    },
    // 判断富文本编辑器输入是否为空或回车
    getText(str) {
      if(!str) return
      return str
        .replace(/<[^<p>]+>/g, '') // 将所有<p>标签 replace ''
        .replace(/<[</p>$]+>/g, '') // 将所有</p>标签 replace ''
        .replace(/&nbsp;/gi, '') // 将所有 空格 replace ''
        .replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
    },
    isNull(str) {
      if (str === '') return true
      var regu = '^[ ]+$'
      var re = new RegExp(regu)
      return re.test(str)
    },
    sbmitRelease(valid, text) {
      if (valid && text) {
        this.dialogVisible = true
        return true
      } else {
        // 富文本为空插入提示
        if (this.isNull(text)) {
          const level = !this.isCompShow ? 4 : 5
          // console.log(level,  this.$refs.newsForm.fields[level])
          // -------------- 每次修改表单配置项需要修改获取子组件的顺序-------------
          this.$refs.newsForm.fields[level].validateMessage = '请输入内容'
          this.$refs.newsForm.fields[level].validateState = 'error'
          this.editorFlag = false
        }
        return false
      }
    },
    // 检查表单数据是否包含敏感词
    checkSensitiveWords(formValues) {
      // 遍历敏感词列表
      for (let i = 0; i < this.sensitiveWordLists.length; i++) {
        const sensitiveWord = this.sensitiveWordLists[i]
        // 如果字段值包含敏感词，则返回 false
        if (formValues.includes(sensitiveWord)) {
          return false
        }
      }
      // 如果所有字段都不包含敏感词，则返回 true
      return true
    },
    release() {
      this.$refs.newsForm.validate(valid => {
        const text = this.getText(this.newsForm.content)?.trim()
        const title = this.getText(this.newsForm.title)?.trim()
        const remark = this.getText(this.newsForm.remark)?.trim()
        if (this.sensitiveWordLists.length && this.row.status !== 'publish_off') {
          // 检查表单数据是否包含敏感词
          this.isSafe = this.checkSensitiveWords(text)
          const isSafe2 = this.checkSensitiveWords(title)
          const isSafe3 = this.checkSensitiveWords(remark)

          if (this.isSafe && isSafe2 && isSafe3) {
            if (this.onlyPdf) {
              if (!this.changeUploadFileFlag) {
                this.$confirm(
                  `附件中存在敏感词，继续提交将进入人工审核流程，是否确认提交?`,
                  '提示',
                  {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                  }
                )
                  .then(() => {
                    this.sbmitRelease(valid, text)
                    this.forcePublish = true
                  })
                  .catch(() => {})
              }
              else{
                this.forcePublish = !this.changeUploadFileFlag
                this.sbmitRelease(valid, text)
              }
            } else {
              this.forcePublish = false
              this.sbmitRelease(valid, text)
            }
          } else {
            this.$confirm(
              `发布内容中存在敏感词，继续提交将进入人工审核流程，是否确认提交?`,
              '提示',
              {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
              }
            )
              .then(() => {
                this.sbmitRelease(valid, text)
                this.forcePublish = true
              })
              .catch(() => {})
          }
        } else {
          this.forcePublish = false
          this.sbmitRelease(valid, text)
        }
      })
    },
    preview() {
      this.validateForm('un_publish', true)
    },
    validateForm(status, preview = false) {
      this.$refs.newsForm.validate(valid => {
        if (valid) {
          this.releaseHttpRequest(status, preview)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    save() {
      this.validateForm('un_publish', false)
    },
    onCreated(editor) {
      this.editor = Object.seal(editor)
      // this.toolbarConfig = {
      //   excludeKeys: ['insertVideo', 'uploadVideo', 'group-video']
      // }
    },
    onChange(editor) {
      this.newsForm.content = this.html
    },

    // 上传
    async httpRequest(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      try {
        const res = await getNewUpload(formData, {
          'Content-Type': 'multipart/form-data'
        })
        this.xdapId = res.xdapId
        this.$set(this.newsForm, 'cover', res.fileUrl || '')
      } catch (error) {}
    },
    async opened() {
      this.onlyPdf = false
      this.forcePublish = false
      this.changeUploadFileFlag = false
      this.sensitiveWordsStr = ''
      this.sensitiveWordLists = []
      this.html = null
      this.newsForm = {}
      this.compResult = {}
      this.fileList = []
      if (!this.id) return
      const res = await getFundCompanyNewsDetail({ id: this.id })
      const sensitiveWords = res?.sensitiveWords ? res?.sensitiveWords.split(';') : []
      this.sensitiveWordLists = sensitiveWords
      let sensitiveWordsStr = ''
      sensitiveWords.map(item => {
        sensitiveWordsStr += item + '、'
      })
      this.sensitiveWordsStr = sensitiveWordsStr.substring(0, sensitiveWordsStr.length - 1)
      // console.log(, 11111111)
      this.newsForm = {
        title: res.title,
        cover: res.cover,
        content: res.content,
        compId: res.compId,
        compSimpName: res?.compSimpName,
        compName: res?.compName,
        fileId: res?.fileId,
        fileUrl: res?.fileUrl,
        fileName: res?.fileName,
        remark: res.remark
      }
      this.xdapId = res.xdapId
      const text = this.getText(this.newsForm.content)?.trim()
      const title = this.getText(this.newsForm.title)?.trim()
      const remark = this.getText(this.newsForm.remark)?.trim()

      const isSafe = this.checkSensitiveWords(text)
      const isSafe2 = this.checkSensitiveWords(title)
      const isSafe3 = this.checkSensitiveWords(remark)
      if (this.sensitiveWordLists?.length && isSafe && isSafe2 && isSafe3) {
        this.onlyPdf = true
      } else {
        this.onlyPdf = false
      }
      // 回显文件名
      if (res?.fileName) {
        this.fileList.push({
          name: res?.fileName || ''
        })
      }

      this.html = res.content
    },
    handleClose() {
      this.util.$smallPop(() => {
        this.drawer = false
        this.newsForm = {}
        this.html = null
        this.$emit('resetCode')
      }, '请确认是否关闭该页面？')
    },
    beforeUploadPdf(file) {
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
    handleChange(file, fileList) {
      this.changeUploadFileFlag = true
      this.newsForm.fileName = fileList[0].name || ''
    },
    handleRemove(file, fileList) {
      this.newsForm.fileId = ''
      this.newsForm.fileName = ''
      this.newsForm.fileUrl = ''
      this.fileList = []
      this.changeUploadFileFlag = true
    },
    // 上传
    async httpRequestPdf(file) {
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
        this.butLoading = false
        this.newsForm.fileUrl = res.fileUrl || ''
        this.$set(this.newsForm, 'fileId', res.fileId || '')
        this.$message.success('上传附件成功！')
      } catch (error) {
        this.fileList = []
        this.butLoading = false
      }
    },
    // 基金公司模糊搜索
    async firmRemoteMethod(query) {
      query = query.replace(/\s*/g, '')
      if (!query) return
      const params = {
        compName: query
      }
      try {
        const res = await getFirmOptionsList(params)
        if (!res) {
          this.firmOptions = []
          return
        }
        this.firmOptions = res
      } catch (error) {}
    },
    compChange(v) {
      let findResult = this.firmOptions.find(item => item.compId === v)
      if (findResult) this.compResult = findResult
    }
  },
  created() {},
  beforeUpdate() {},
  mounted() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {}
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 20px;
  box-sizing: border-box;
}

.release-drawer {
  width: 100%;
  overflow: auto;
  .waring-text {
    font-size: 16px;
    color: #f56c6c;
    display: block;
    height: 14px;
    line-height: 14px;
    margin-bottom: 10px;
    margin-left: 100px;
  }
}
::v-deep .release-drawer {
  .btns {
    text-align: center;
    margin: 20px 0;
    width: 100%;
    button.el-button--default.release-btn {
      border: none !important;
      width: 88px;
      height: 32px;
      line-height: 32px;
      padding: 0;
      border-radius: 4px;
      opacity: 1;
      color: #fff !important;
      background: #d60010;
      margin-bottom: 20px;

      &:hover {
        color: #fff !important;
        background: #d60010;
      }
    }

    button.el-button--default.save-btn {
      width: 108px;
      padding: 0;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      border: none !important;
      color: rgba(0, 0, 0, 0.8);
      background: #e9e9eb !important;

      &:hover {
        color: rgba(0, 0, 0, 0.8);
        background: #e9e9eb !important;
      }
    }

    button.el-button--default.preview-btn {
      margin: 0 20px;
      width: 88px;
      padding: 0;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      border: 1px solid #d60010 !important;
      color: #d60010 !important;
      background: #fff !important;

      &:hover {
        border: 1px solid #d60010 !important;
        color: #d60010 !important;
      }
    }
  }

  .el-drawer__header {
    font-size: 16px !important;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.8);
    padding: 16px 20px;
    margin-bottom: 20px;
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.05);
  }

  div.el-upload .el-upload-dragger {
    width: 376px;
    height: 160px;
  }

  .w-e-bar-item button {
    font-size: 14px;
  }
  .el-form {
    width: 100%;
  }
}
</style>
