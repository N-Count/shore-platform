<template>
  <div id="page-login">
    <div class="page-login--layer">
      <div> </div>
      <div class="page-login--content">
        <div class="page-login--content-img">
          <el-carousel :interval="5000" >
            <el-carousel-item
              v-for="(item, index) in loginArr"
              :key="index"
            >
              <img class="page-login-img" :src="item.imgUrl" />
              <p class="page-login-carousel-title">{{ item.title }}</p>
              <p class="page-login-carousel-text">{{ item.desc }}</p>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="page-login--content-body" flex="dir:top main:center cross:center">
          <!-- logo -->
          <div class="page-login--content-form">
            <img class="page-login--logo" src="./image/name.png" alt="" />
            <div class="title">
              {{ loginType === 'account' ? '账号密码登录' : '验证码登录' }}
            </div>
            <el-form ref="form" :model="formLogin" :rules="rules">
              <el-form-item prop="account">
                <el-input
                  class="login-input"
                  v-model="formLogin.account"
                  size="medium"
                  placeholder="请输入手机号/邮箱号"
                  @keyup.enter.native="preSubmit"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="loginType === 'account'" prop="loginPwd">
                <el-input
                  class="login-input"
                  @keyup.enter.native="preSubmit"
                  v-model="formLogin.loginPwd"
                  type="password"
                  size="medium"
                  placeholder="请输入密码"
                >
                  <template slot="suffix">
                    <div class="forget-pwd" @click="forgetPwdVisible = true"> 忘记密码? </div>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item
                v-if="
                  loginType === 'account' && util.notEmpty(info.errorCount) && info.errorCount > 3
                "
                prop="authCode"
              >
                <el-input
                  @keyup.enter.native="preSubmit"
                  v-model="formLogin.authCode"
                  size="medium"
                  placeholder="请输入验证码"
                >
                  <template slot="suffix">
                    <div class="forget-pwd" @click="getloginValidCode">
                      {{ loginValidText }}
                    </div>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="loginType !== 'account'" prop="authCode">
                <el-input
                  @keyup.enter.native="preSubmit"
                  v-model="formLogin.authCode"
                  size="medium"
                  placeholder="请输入验证码"
                >
                  <template slot="suffix">
                    <div class="forget-pwd" @click="getPhoneValidCode">
                      {{ phoneValidText }}
                    </div>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
            <div class="form-function">
              <el-button style="width: 100%" type="primary" :loading="loginLoading" @click="preSubmit">登录</el-button>
              <div class="change-login-type" @click="loginTypeChange">
                {{ loginType === 'account' ? '验证码登录' : '账号密码登录' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="page-login--footer">
        <span
          >Copyright @2024 上海基煜基金销售有限公司
          <a
            class="page-login--beian"
            href="https://beian.miit.gov.cn/#/Integrated/index"
            target="_blank"
          >
            沪ICP备14043616号
          </a></span
        >
      </div>
    </div>
    <!-- 强制登录 -->
    <el-dialog
      class="login-dialog"
      title="提示"
      :visible.sync="continueDialogVisible"
      :close-on-click-modal="false"
      width="600px"
    >
      <div>系统检测到该账户正在被使用，您确定继续操作吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="continueLogin">确定</el-button>
        <el-button @click="continueDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 忘记密码 -->
    <el-dialog
      class="login-dialog"
      title="忘记密码"
      :close-on-click-modal="false"
      :visible.sync="forgetPwdVisible"
      width="600px"
    >
      <div class="login-box">
        <el-form ref="forgetForm" :model="forgetPwdForm" :rules="forgetRules">
          <el-form-item prop="account">
            <el-input
              v-model="forgetPwdForm.account"
              clearable
              size="medium"
              placeholder="请输入手机号/邮箱号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="authCode">
            <el-input
              v-model="forgetPwdForm.authCode"
              size="medium"
              placeholder="请输入验证码"
              ref="verifyAuthCode"
            >
              <template slot="suffix">
                <div class="forget-pwd" @click="getResetValidCode">
                  {{ resetValidText }}
                </div>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="newPassword">
            <el-input
              v-model="forgetPwdForm.newPassword"
              clearable
              type="password"
              @change="pwdValCheck('forgetPwdForm', 'forgetPwd')"
              size="medium"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="repeatPassword">
            <el-input
              v-model="forgetPwdForm.repeatPassword"
              clearable
              type="password"
              ref="forgetPwd"
              size="medium"
              placeholder="请重复新密码"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="pwd-tip">
          <div><i class="el-icon-warning"></i>1.密码长度为8-12位；</div>
          <div>
            <i class="el-icon-warning"></i>2.格式包括数字、大小写字母、英文符号中的至少两种；
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="forgetPwdSubmit">确定</el-button>
        <el-button @click="forgetPwdDialogClose" size="small">取消</el-button>
      </div>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog
      class="login-dialog"
      title="重置密码"
      :close-on-click-modal="false"
      :visible.sync="resetPwdVisible"
      width="600px"
    >
      <div class="login-box">
        <el-form ref="resetForm" :model="resetPwdForm" :rules="resetRules">
          <el-form-item prop="newPassword">
            <el-input
              v-model="resetPwdForm.newPassword"
              clearable
              @change="pwdValCheck('resetPwdForm', 'repeatPwd')"
              maxlength="12"
              type="password"
              size="medium"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="repeatPassword">
            <el-input
              v-model="resetPwdForm.repeatPassword"
              clearable
              ref="repeatPwd"
              type="password"
              size="medium"
              placeholder="请重复新密码"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="pwd-tip">
          <div><i class="el-icon-warning"></i>1.密码长度为8-12位；</div>
          <div>
            <i class="el-icon-warning"></i>2.格式包括数字、大小写字母、英文符号中的至少两种；
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetPwdSubmit">确定</el-button>
        <el-button @click="resetPwdDialogClose">取消</el-button>
      </div>
    </el-dialog>
    <WaringDialog />
  </div>
</template>

<script>
import P1 from './image/p1.png'
import P2 from './image/p2.png'
import P3 from './image/p3.png'
import WaringDialog from './components/waring-dialog-ie/index.vue'
import { mapActions, mapState } from 'vuex'
import { sendAuthCode, passwordReset, forgotPassword } from '@api/bus-frp-agg'
import { getMenuListByUser } from '@/menu/handleMenu'
export default {
  name: '',
  components: {
    WaringDialog
  },
  data() {
    // 账号的校验
    var accountValid = (rule, value, callback) => {
      let reg = /^1[0-9]{10}$|^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (!value) {
        return callback(new Error('请输入手机号/邮箱号'))
      } else if (!reg.test(value)) {
        return callback(new Error('账号格式不正确'))
      } else {
        callback()
      }
    }
    // 重复密码的校验
    var resetPwdValid = (rule, value, callback) => {
      let formName = this.forgetPwdVisible ? 'forgetPwdForm' : 'resetPwdForm'
      if (!value) {
        return callback(new Error('请重复输入新密码'))
      } else if (value !== this[formName].newPassword) {
        return callback(new Error('两次输入密码不一致,请重新输入!'))
      } else {
        callback()
      }
    }

    var loginAuthCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入验证码'))
      } else if (this.util.isEmpty(this.formLogin.authCodeToken)) {
        return callback(new Error('请先获取验证码'))
      } else {
        callback()
      }
    }
    var forgetAuthCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入验证码'))
      } else if (this.util.isEmpty(this.forgetPwdForm.authCodeToken)) {
        return callback(new Error('请先获取验证码'))
      } else {
        callback()
      }
    }
    return {
      loginArr: [
        {
          imgUrl: P1,
          title: '全方位数据分析支持',
          desc: '数据分析和洞察，优化内容策略，提升效果'
        },
        {
          imgUrl: P2,
          title: '一站式内容管理',
          desc: '轻松创建、发布路演和研报'
        },
        {
          imgUrl: P3,
          title: '链接机构投资',
          desc: '机构投资者专属服务，满足机构投资者的专业需求'
        }
      ],
      // 登录方式
      loginType: 'account',
      phoneCodeTime: null,
      resetCodeTime: null,
      loginCodeTime: null,
      phoneValidText: '获取验证码',
      resetValidText: '获取验证码',
      loginValidText: '获取验证码',
      // 强制登录
      continueDialogVisible: false,
      // 重置密码
      resetPwdVisible: false,
      // 忘记密码
      forgetPwdVisible: false,
      // 表单
      formLogin: {
        continueLoginFlag: '0'
      },
      resetPwdForm: {},
      forgetPwdForm: {},
      // 表单校验
      rules: {
        account: [{ validator: accountValid, trigger: 'change' }],
        loginPwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        authCode: [{ validator: loginAuthCode, trigger: 'change' }]
      },
      forgetRules: {
        account: [{ validator: accountValid, trigger: 'change' }],
        authCode: [{ validator: forgetAuthCode, trigger: 'change' }],
        newPassword: [
          {
            required: true,
            pattern: /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?()+]+)$)^[\w~!@#$%^&*?()+]{8,12}$/,
            message: '请输入符合规则的密码',
            trigger: 'change'
          }
        ],
        repeatPassword: [{ validator: resetPwdValid, trigger: ['blur', 'change'] }]
      },
      resetRules: {
        newPassword: [
          {
            required: true,
            pattern: /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?()+]+)$)^[\w~!@#$%^&*?()+]{8,12}$/,
            message: '请输入符合规则的密码',
            trigger: 'change'
          }
        ],
        repeatPassword: [{ validator: resetPwdValid, trigger: ['blur', 'change'] }]
      },
      // 用户默认打开页面url
      defaultPageUrl: '/index',
      loginLoading: false
    }
  },
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  methods: {
    ...mapActions('d2admin/account', ['login']),
    ...mapActions('d2admin/page', ['resetOpened']),
    pwdValCheck(formName, inputName) {
      if (this.util.notEmpty(this[formName].repeatPassword)) {
        this.$refs[inputName].focus()
        this.$refs[inputName].blur()
      }
    },
    // 切换登录方式
    loginTypeChange() {
      this.codetime = null
      this.loginType = this.loginType === 'account' ? 'pwd' : 'account'
      this.$refs.form.resetFields()
      this.formLogin = {}
    },
    // 密码错误获取验证码
    getloginValidCode() {
      this.$refs.form.validateField('account', valid => {
        if (!valid && this.loginValidText === '获取验证码') {
          sendAuthCode({
            account: this.formLogin.account,
            businessCode: 'LOGIN_CODE'
          })
            .then(res => {
              if (this.loginValidText === '获取验证码') {
                this.loginValidText = 60
                this.formLogin.authCodeToken = res.authCodeToken
                this.$refs.form.validateField('authCode')
                this.loginCodeTime = setInterval(() => {
                  this.loginValidText--
                  if (this.loginValidText <= 0) {
                    this.loginValidText = '获取验证码'
                    clearInterval(this.loginCodeTime)
                  }
                }, 1000)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 获取验证码
    async getPhoneValidCode() {
      this.$refs.form.validateField('account', valid => {
        if (!valid && this.phoneValidText === '获取验证码') {
          sendAuthCode({
            account: this.formLogin.account,
            businessCode: 'LOGIN_CODE'
          })
            .then(res => {
              if (this.phoneValidText === '获取验证码') {
                this.phoneValidText = 60
                this.formLogin.authCodeToken = res.authCodeToken
                this.$refs.form.validateField('authCode')
                this.phoneCodeTime = setInterval(() => {
                  this.phoneValidText--
                  if (this.phoneValidText <= 0) {
                    this.phoneValidText = '获取验证码'
                    clearInterval(this.phoneCodeTime)
                  }
                }, 1000)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 获取忘记密码的验证码
    async getResetValidCode() {
      this.$refs.forgetForm.validateField('account', valid => {
        if (!valid && this.resetValidText === '获取验证码') {
          sendAuthCode({
            account: this.forgetPwdForm.account,
            businessCode: 'LOGIN_CODE'
          })
            .then(res => {
              if (this.resetValidText === '获取验证码') {
                this.resetValidText = 60
                this.forgetPwdForm.authCodeToken = res.authCodeToken
                this.$refs.forgetForm.validateField('authCode')
                this.resetCodeTime = setInterval(() => {
                  this.resetValidText--
                  if (this.resetValidText <= 0) {
                    this.resetValidText = '获取验证码'
                    clearInterval(this.resetCodeTime)
                  }
                }, 1000)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 提交之前的默认参数设置
    preSubmit() {
      this.formLogin.continueLoginFlag = '0'
      this.submit()
    },
    // 提交登录信息
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loginLoading = true
          // 登录方式 1-账号密码登陆 2-验证码登录
          this.formLogin.loginMethod = '1'
          this.loginLoading = false
          this.getUserRouterInfo({})
          console.log(2222, this.defaultPageUrl)
          this.$router.push({ path: this.defaultPageUrl })
          this.$forceUpdate()
        }
      })
    },
    // 强制登录
    continueLogin() {
      this.formLogin.continueLoginFlag = '1'
      this.continueDialogVisible = false
      this.submit()
    },
    // 忘记密码
    async forgetPwdSubmit() {
      this.$refs.forgetForm.validate(async valid => {
        if (valid) {
          forgotPassword({
            newPassword: this.util.getRsaCode(this.forgetPwdForm.newPassword),
            account: this.forgetPwdForm.account,
            authCode: this.forgetPwdForm.authCode,
            authCodeToken: this.forgetPwdForm.authCodeToken
          })
            .then(() => {
              this.$message.success('找回密码成功')
              this.resetValidText = '获取验证码'
              clearInterval(this.resetCodeTime)
              this.forgetPwdDialogClose()
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 关闭忘记密码的弹窗
    forgetPwdDialogClose() {
      this.forgetPwdVisible = false
      this.$refs.forgetForm.resetFields()
      this.forgetPwdForm = {}
    },
    // 重置密码
    async resetPwdSubmit() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          passwordReset({
            newPassword: this.util.getRsaCode(this.resetPwdForm.newPassword)
          })
            .then(() => {
              this.resetPwdDialogClose()
              // 跳转至首页
              this.$router.push({ path: this.defaultPageUrl })
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 重置密码关闭
    resetPwdDialogClose() {
      this.resetPwdVisible = false
      this.$refs.resetForm.resetFields()
      this.resetPwdForm = {}
    },
    // 根据用户信息获取菜单和路由列表信息，并设置用户默认打开的页面
    getUserRouterInfo(userInfo) {
      let dbRes = {
        defaultPageUrl: '',
        newOpened: []
      }
      let firstObj = null
      // 刷新用户对应的菜单和可见页面列表
      let { userMenuList = [] } = getMenuListByUser(userInfo, true)
      // 获取用户默认打开的页面
      if (userMenuList.length > 0) {
        firstObj = userMenuList[0]
        if (firstObj.children && firstObj.children.length > 0) {
          firstObj = firstObj.children[0]
        }
      }
      this.defaultPageUrl = firstObj.path || '/index'
      dbRes.defaultPageUrl = this.defaultPageUrl
      dbRes.newOpened.push({
        fullPath: this.defaultPageUrl,
        name: firstObj.name,
        meta: firstObj.meta,
        params: firstObj.params,
        query: firstObj.query
      })
      this.resetOpened(dbRes)
    }
  }
}
</script>
<style lang="scss">
#page-login {
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
  }
  .forget-pwd {
    font-size: 12px;
    color: #d60010;
    padding: 0 8px;
    cursor: pointer;
  }
  .forget-pwd::before {
    content: '|';
    font-size: 14px;
    color: #dcdfe6;
    position: relative;
    left: -10px;
  }
  .login-box {
    padding: 0px 86px;
  }

  .pwd-tip {
    color: #f56c6c;
  }
  .login-dialog {
    .el-dialog {
      .el-dialog__header,
      .el-dialog__body,
      .el-dialog__footer {
        background: #fff;
        .el-form {
          background: #fff;
          div.el-input {
            .el-input__inner {
              color: #38383b;
              background: #fff;
              border: 1px solid #c0c0c0;
              &:focus {
                border-color: #d60010;
              }
              &:hover {
                border-color: #d60010;
              }
            }
          }
        }
      }
      .el-dialog__header {
        border-top-color: #d60010;
        border-bottom-color: #e6e6e6;
        .el-dialog__title {
          color: #38383b;
        }
        .el-dialog__headerbtn {
          &:focus .el-dialog__close {
            color: #d60010;
          }
          &:hover .el-dialog__close {
            color: #d60010;
          }
        }
      }
      .el-dialog__body {
        color: #38383b;
      }
      .dialog-footer {
        .el-button--primary {
          background: #d60010;
          color: #fff;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
#page-login {
  background-color: $loginColor-backgroundColor;
  height: 100%;
  position: relative;
  overflow: hidden;
  // 层
  .page-login--layer {
    @extend %full;
    background: #fff;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    align-content: space-between;
    min-height: 550px;
  }
  // 登陆页面控件的容器
  .page-login--content {
    width: 100%;
    display: flex;
    min-width: 900px;
    align-items: center;
    justify-content: center;
  }

  .page-login--footer {
    font-size: 14px;
    color: #838383;
    margin-bottom: 41px;
    width: 100%;
    text-align: center;
    .page-login--beian {
      color: #838383;
      &:hover {
        color: #d60010;
        cursor: pointer;
      }
    }
  }

  .page-login--content-body {
    // 登录表单
    .page-login--content-form {
      background-color: #fff;
      box-sizing: border-box;
      margin: 35px 0px 29px 0px;
      width: 400px;
      min-height: 470px;
      border-radius: 4px;
      box-shadow: 0px 2px 10px 0px rgba(191, 191, 191, 0.45);
      padding: 0px 60px 0px;
      position: relative;
      text-align: center;
      .title {
        text-align: center;
        font-weight: 500;
        font-size: 16px;
        color: #38383b;
        margin-bottom: 24px;
        line-height: 22px;
      }
      .form-function {
        padding-top: 32px;
        .el-button {
          background: #d60010;
          color: #fff;
          font-size: 14px;
        }
        .change-login-type {
          text-align: center;
          margin: 16px 0 29px;
          cursor: pointer;
          color: #d60010;
        }
      }
      .el-form {
        .el-form-item {
          margin-bottom: 24px;
          div.el-input {
            .el-input__inner {
              color: #38383b;
              background: #fff;
              border: 1px solid #c0c0c0;
              &:focus {
                border-color: #d60010;
              }
              &:hover {
                border-color: #d60010;
              }
              &::placeholder {
                color: #838383;
              }
            }
          }
        }
      }
    }
  }

  // footer
  .page-login--content-footer {
    padding: 1em 0;
    position: absolute;
    bottom: 10px;
    width: 100%;
    border: none;
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-sub;
      a {
        color: $color-text-sub;
      }
    }
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      a {
        color: $color-text-sub;
        margin: 0 1em;
        cursor: pointer;
      }
    }
  }
}
.page-login--logo {
  width: 250px;
  margin: 40px 0;
}
.page-login--content-img {
  max-width: 511px;
  max-height: 480px;
  margin-right: 118px;
  height: 100%;
  width: 100%;
  .el-carousel {
    width: 100%;
    height: 100%;
    .el-carousel__container {
      width: 100%;
      height: 100%;
      .el-carousel__item {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .page-login-img {
          width: 330px;
          height: 340px;
        }
        .page-login-carousel-title {
          margin: 16px 0 12px;
          font-size: 24px;
          font-weight: 500;
          color: #272727;
        }
        .page-login-carousel-text {
          margin-bottom: 70px;
          font-size: 14px;
          color: #666666;
        }
      }
    }
    .is-active {
      .el-carousel__button {
        background: #d60010;
      }
    }
    .el-carousel__button {
      background: #dfdfdf;
      width: 22px;
      height: 4px;
      border-radius: 8px;
    }
  }
  .el-carousel__arrow--left,
  .el-carousel__arrow--right {
    display: none;
  }
}
// 去除IE浏览器密码框默认图标问题
input[type='password']::-ms-reveal {
  display: none;
}
</style>
