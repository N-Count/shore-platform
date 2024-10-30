import request from '@/plugin/axios'

let getBaseUrl = (url) => '/api/bus-frp-auth' + url

// 登录
export const AccountLogin = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/login'), params, { headers })

// 登出
export const AccountLogout = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/logout'), params, { headers })

// 获取登录用户信息
export const UserInfo = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/user-info'), params, { headers })

// 发送验证码
export const sendAuthCode = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/common/send-auth-code'), params, { headers })

// 忘记密码重置
export const forgotPassword = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/forgot-password-reset'), params, {
    headers
  })

// 修改密码
export const udpatePasswordByCode = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/udpate-password-by-code'), params, {
    headers
  })

// 修改密码
export const passwordReset = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/update-password'), params, { headers })

// 用户管理列表分页接口
export const userListPage = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/list-page'), params, { headers })

// 部门机构列表
export const orgDeptList = (params, headers = {}) =>
  request.get(getBaseUrl('/auth/org/dept-list'), params, { headers })

// 机构角色列表
export const orgRoleList = (params, headers = {}) =>
  request.get(getBaseUrl('/auth/org/org_roles'), params, { headers })

// 用户新增
export const userAdd = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/add'), params, { headers })

// 用户修改
export const userUpdate = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/update'), params, { headers })

// 修改个人信息
export const userUpdateSelf = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/update-self'), params, { headers })

// 用户状态变更
export const userEnabled = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/enabled'), params, { headers })

// 用户列表--不分页
export const userDeptList = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/dept-list'), params, { headers })

// 部门用户列表--不分页-全部
export const queryAllPartUsers = (params, headers = {}) =>
  request.post(getBaseUrl('/auth/user/dept-list-all'), params, { headers })

// 机构列表
export const getOrglist = (params, headers = {}) =>
  request.get(getBaseUrl('/auth/org/org-list'), params, { headers })

// 部门列表
export const getListParam = (params, headers = {}) =>
  request.get(getBaseUrl('/auth/org/dept-list-param'), params, { headers })

// 用户列表
export const getListAllParam = (params, headers = {}) =>
  request.get(getBaseUrl('/auth/user/dept-list-all-param'), params, { headers })

// 模糊查询机构Name
export const queryRoleLike = (params, headers = {}) =>
  request.get(getBaseUrl('/auth/user/query-role-like-name'), params, {
    headers
  })
