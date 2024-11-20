/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseURL: axios的baseURL
 *
 */
 const env = process.env.NODE_ENV
 let baseURL = ''
 let isDebug = env === 'development' || env === 'local' || false
 // 是否正式环境
 let isProd = env === 'production' || false
 const apiEnvKey = 'JY_API_ENV'
 const apiEnv = localStorage.getItem(apiEnvKey) || ''
 if (isProd) {
   baseURL = `${window.CONFIG.CLOUD_VUE_APP_API.replace(/\/$/g, '')}`
 } else {
   if (apiEnv) {
    //  baseURL = `${baseURL}/${apiEnv}`
     baseURL = `${baseURL}`
   } else {
    //  baseURL = `${process.env.CLOUD_VUE_APP_API.replace(/\/$/g, '')}`
     baseURL = `${baseURL}`
   }
 }
 console.log(baseURL,'baseURL');

 export { baseURL, isDebug, isProd, env }
