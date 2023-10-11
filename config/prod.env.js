'use strict'

const { JavascriptModulesPlugin } = require("webpack")

module.exports = {
  NODE_ENV: '"production"',
  HEAD_IMAGE_URL: '"/ems/public/image/user_head/"',
  TASK_IMAGE_URL: '"/ems/public"',
  DEVICE_IMAGE_URL: '"/ems/public/image/device_type/"',
  AD_IMAGE_URL: '"/public/image/ad/"',
  PROJECT_IMAGE_URL: '"/ems/public/image/project_head/"',
  FILE_URL:'"/ems/public"',
  BASE_API: '"/ems/public/index.php/web/v1/"'
}
