const getters = {
  token: state => state.user.token,
  user_id: state => state.user.user_id,
  company_id: state => state.user.company_id,
  department_id: state => state.user.department_id,
  user_name: state => state.user.user_name,
  nick_name: state => state.user.nick_name,
  user_image: state => state.user.user_image,
  app_module: state => state.user.app_module,
  is_web_permit: state => state.user.is_web_permit,
  selected_project_id: state => state.user.selected_project_id,
  selected_project_name: state => state.user.selected_project_name,
  // platform_project_id: state => state.user.platform_project_id,
  user_company: state => state.user.user_company,
  user_create_time: state => state.user.user_create_time,
  roles: state => state.user.roles,
  // isreload: state => state.user.isReload,

  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,

  sidebar: state => state.app.sidebar,
  device: state => state.app.device,

  // 账号类型
  Account_Type: state => state.user.user_level,
  // 系统类型
  system_type_options: state => state.globalVar.system_type_options
}
export default getters
