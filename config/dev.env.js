'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  // NODE_ENV: '"development"',

  // HEAD_IMAGE_URL: '"http://www.smartfas.cn/fms2_test/public/image/user_head/"',
  // TASK_IMAGE_URL: '"http://www.smartfas.cn/fms2_test/public"',
  // DEVICE_IMAGE_URL: '"http://www.smartfas.cn/fms2_test/public/image/device_type/"',
  // AD_IMAGE_URL: '"http://www.smartfas.cn/fms2_test/public/image/ad/"',
  // PROJECT_IMAGE_URL: '"http://www.smartfas.cn/fms2_test/public/image/project_head/"',
  // FILE_URL:'"http://www.smartfas.cn/fms2_test/public"',
  // BASE_API: '"http://www.smartfas.cn/fms2_test/public/index.php/web/v1/"'

  HEAD_IMAGE_URL: '"http://192.168.3.101/ems/public/image/user_head/"',
  TASK_IMAGE_URL: '"http://192.168.3.101/ems/public/"',
  DEVICE_IMAGE_URL: '"http://192.168.3.101/ems/public/image/device_type/"', 
  AD_IMAGE_URL: '"http://192.168.3.101/ems/public/image/ad/"',
  PROJECT_IMAGE_URL: '"http://192.168.3.101/ems/public/image/project_head/"',
  FILE_URL:'"http://192.168.3.101/ems/public"',
  BASE_API: '"http://192.168.3.101/ems/public/index.php/web/v1/"'
})
