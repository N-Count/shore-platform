import request from '@/plugin/axios'

// let getBaseUrl = url => '/api/bus-frp-agg-cloud' + url
let getBaseUrl = url => '' + url

/** *********** 模板 *************/

// 首页-登录获取验证码
export const logIn = (params, headers = {}) =>
  request.post(getBaseUrl('/admin/sys/login'), params, { headers })

// 首页-登录获取验证码
export const sendAuthCode = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/user/send-auth-code'), params, { headers })

// 首页-登录获取验证码
export const AccountLogin = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/user/login'), params, { headers })


// 首页-获取登录用户信息
export const UserInfo = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/user/user-info'), params, { headers })

// 忘记密码重置
export const forgotPassword = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/user/forgot-password-reset'), params, {
    headers
  })

// 修改密码
export const passwordReset = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/user/update-password'), params, { headers })

// 登出
export const AccountLogout = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/user/logout'), params, { headers })

// 修改密码
export const udpatePasswordByCode = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/user/udpate-password-by-code'), params, {
    headers
  })

// 营销管理
// 基金经理列表
export const getFundManagerList = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-manager/fund-manager-list'), params, {
    headers
  })

// 基金经理模糊搜索
export const searchManager = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-manager/search-manager-by-name'), params, {
    headers
  })
// 基金经理详情
export const getFundManagerDetail = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-manager/fund-manager-detail'), params, {
    headers
  })
// 基金经理主推设置
export const setFundManagerDetail = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-manager/set-recommend-fund-manager'), params, {
    headers
  })
// 基金经理卡片
export const getRecommendManager = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-manager/get-company-recommend-manager'), params, {
    headers
  })
// 基金产品列表
export const getFundPrdList = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/list'), params, {
    headers
  })
// 基金产品更新详情
export const updateFundPrd = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/update'), params, {
    headers
  })
// 基金产品热门
export const getRecommendPrd = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/fund/company-homepage/get-company-recommend-fund'), params, {
    headers
  })
// 基金产品模糊搜索
export const searchFund = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/fund-base-info/search-fund-by-name-or-code-delisted'), params, {
    headers
  })

// 首页-查看专区用户数
export const accessCompany = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/statistic/access/company'), params, {
    headers
  })

// 首页-查看路演用户数
export const accessRoadshow = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/statistic/access/road-show'), params, {
    headers
  })

// 首页-查看报告用户数
export const accessResearchReport = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/statistic/access/research-report'), params, {
    headers
  })

// 首页-各类型机构访问量
export const accesOrgGroup = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/statistic/access/org-group'), params, {
    headers
  })

// 首页-各地区机构访问量
export const accesArea = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/statistic/access/area'), params, {
    headers
  })

// 首页-路演列表
export const accesShowlist = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/road-show/list'), params, {
    headers
  })

// 上传
export const getUpload = (params, headers = {}) =>
  request.post(
    getBaseUrl('/agg/cloud/file/report/fastdfs/upload?scene=could&path=/frp/could/'),
    params,
    headers
  )


  // 研报-资讯上传
export const getNewUpload = (params, headers = {}) =>
  request.post(
    getBaseUrl('/agg/cloud/fastdfs/upload-file-service-and-defan?scene=could&path=/frp/could/'),
    params,
    headers
  )


// 下载
export const getDownload = (params, headers = {}) =>
  request.post(
    getBaseUrl('/agg/cloud/fastdfs/download?scene=could&path=/frp/could/'),
    params,
    headers
  )

// 查询基金经理路演分页接口
export const getRoadShowList = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/road-show/get-list'), params, headers)

// 模糊查询基金公司（根据基金公司简称）
export const getFirmOptionsList = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/query-simp-comp-name-like'), params, headers)

// 模糊查询基金经理
export const getMangerOptionsList = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-manager/search-manager-by-name'), params, headers)

// 根据条件获取路演图片
export const getRoadShowImage = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/road-show/get-road-show-image'), params, headers)

// 新增、修改基金经理路演接口
export const addEditRoadShow = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/road-show/add-edit-road-show'), params, headers)

// 获取基金公司默认图片
export const getDefaultFundCompanyPhoto = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/road-show/get-default-fund-company-photo'), params, headers)

// 获取基金经理默认图片
export const getDefaultFundManagerPhoto = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/road-show/get-default-fund-manager-photo'), params, headers)

// 查询基金经理路演明细接口
export const getRoadShowDetail = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/road-show/get-road-show-detail'), params, headers)

// 查询基金经理代表产品列表
export const getCurrentManagerFundsByInnerCode = (params, headers = {}) =>
  request.post(
    getBaseUrl('/agg/cloud/road-show/get-current-manager-funds-by-inner-code-agg'),
    params,
    headers
  )

export const getLikeFundList = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/like-fund-list'), params, headers)

// FMI根据基金经理id查询基金经理代表产品、管理规模接口
export const getManagerTagByManagerId = (params, headers = {}) =>
  request.post(
    getBaseUrl('/agg/cloud/road-show/get-tag-list-and-management-scale'),
    params,
    headers
  )

// 删除基金经理路演接口
export const deleteRoad = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/road-show/delete'), params, headers)

// 首页路演详情接口
export const queryWeekDetail = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/road-show/detail'), params, headers)

// 上传研报-分页查询调研报告
export const getReportPage = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/report/get-report-page'), params, headers)

// 上传研报-研报标签下拉框
export const getLabels = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/report/get-labels'), params, headers)

// 上传研报-下线研报
export const insertingCoilReport = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/report/inserting-coil-report'), params, headers)

// 发布资讯
// 新增修改基金公司动态
export const editFundCompanyNews = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-company-news/edit'), params, headers)
// 修改基金公司动态状态
export const updateFundCompanyNews = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-company-news/updateStatus'), params, headers)
// 查询基金公司动态明细
export const getFundCompanyNewsDetail = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-company-news/detail?id=' + params.id), params, headers)
// 查询基金公司动态列表
export const getFundCompanyNewsList = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-company-news/list'), params, headers)
// 查询基金公司动态总数
export const getFundCompanyNewsCount = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-company-news/count'), params, headers)
// 删除基金公司动态
export const delFundCompanyNews = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-company-news/delete?id=' + params.id), params, headers)
// 基金公司列表
export const getFundCompanyList = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-company/list'), params, headers)
// 基金公司更新
export const updateFundCompany = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/fund-company/update'), params, headers)
// 基金公司搜索
export const getFundCompanyName = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/query-simp-comp-name-like'), params, headers)

// 上传研报-新增/编辑调研报告
export const addEditReport = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/report/add-edit-report'), params, headers)

// 上传研报-根据id查询研报信息接口(回显)
export const getReportById = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/report/get-report-by-id'), params, headers)

// 获取最新的主推基金公司
export const getRecommendCompany = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/get-latest-recommend-company'), params, headers)

// 获取标签
export const queryDictList = (params, headers = {}) =>
  request.post(getBaseUrl('/agg/cloud/road-show/get-plate-list'), params, headers)
