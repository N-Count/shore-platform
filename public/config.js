window.CONFIG = {
  CLOUD_VUE_APP_API: 'http://172.16.112.162:32190',
  CLOUD_VUE_APP_SENTRY: 'http://localhost@null/1',
  CLOUD_VUE_APP_ENABLE_SENTRY: false,
  // 是否打开版本切换功能
  SHOW_VERSION_DEBUG: true,
  CLOUD_SENTRY_KEYWORDS: ['error', '异常', '系统', 'not found'],
  CLOUD_TIMEOUT: 5000,
  SENSORS_SERVER: {
    sensors_url:
      'https://www-test.jiyutest.com/sensors/sa?token=c854a40323fbd1e542de06cd473e5fc2963ee62d20c6884976a1ca28b3dfc125&project=default',
    sensors_enable: true
  },
  SENSORS_CONFIG: {
    is_track_single_page: false,
    isDev: true, // 是否是开发环境，开发环境不上报
    showLog: false // 是否开启日志打印
  },
}
