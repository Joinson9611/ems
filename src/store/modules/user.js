import { login, logout, getUserInfo, getUserLevel } from '@/api/users'
import { getToken, setToken, removeToken, getUserID, setUserID, removeUserID, getProjectId, setProjectId } from '@/utils/auth'
import md5 from '@/utils/md5'

const user = {
  state: {
    token: getToken(),
    user_id: getUserID(),
    user_name: '',
    nick_name: '',
    user_image: '',
    selected_project_id: getProjectId(),
    company_id: -1,
    department_id: -1,
    selected_project_name: '',
    user_company: '',
    user_create_time: '',
    user_level: '',
    roles: [],
    app_module: [],
    is_web_permit: 0
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.user_name = name
    },
    SET_USER_ID: (state, id) => {
      state.user_id = id
    },
    SET_NICK_NAME: (state, nickname) => {
      state.nick_name = nickname
    },
    SET_USER_IMAGE: (state, image) => {
      state.user_image = image
    },
    SET_APP_MOUDLE: (state, app_module) => {
      state.app_module = app_module
    },
    SET_SELECTED_PROJECT_ID: (state, project_id) => {
      state.selected_project_id = project_id
    },
    SET_COMPANY_ID: (state, company_id) => {
      state.company_id = company_id
    },
    SET_IS_WEB_PERMIT: (state, is_web_permit) => {
      state.is_web_permit = is_web_permit
    },
    SET_DEPARTMENT_ID: (state, department_id) => {
      state.department_id = department_id
    },
    SET_SELECTED_PROJECT_NAME: (state, project_name) => {
      state.selected_project_name = project_name
    },
    SET_USER_COMPANY: (state, company_name) => {
      state.user_company = company_name
    },
    SET_USER_CREATE_TIME: (state, create_time) => {
      state.user_create_time = create_time
    },
    SET_USER_LEVEL: (state, user_level) => {
      state.user_level = user_level
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户 登录
    Login({ commit }, userInfo) {
      const loginParam = {
        user_name: userInfo.username.trim(),
        user_password: md5.hexMD5(userInfo.password + 'alarm_salt')
      }
      return new Promise((resolve, reject) => {
        login(loginParam).then(response => {
          const data = response.data
          setToken(data.token)
          setUserID(data.user_id)
          commit('SET_TOKEN', data.token)
          commit('SET_USER_ID', data.user_id)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.selected_project_id) {
          getUserInfo({ project_id: state.selected_project_id }).then(response => {
            const data = response.data
            let roles
            if (data.roles !== null) {
              // 判断返回的路由权限
              roles = (data.roles + ',' + data.module_list).split(',')
              if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
                commit('SET_ROLES', roles)
              } else {
                reject('getUserInfo: roles must be a non-null array !')
              }
            } else {
              reject('getUserInfo: roles must be a non-null array !')
            }
            // 存储用户的基本信息
            commit('SET_COMPANY_ID', data.company_id)
            commit('SET_DEPARTMENT_ID', data.department_id)
            commit('SET_NAME', data.user_name)
            commit('SET_USER_LEVEL', data.level)
            commit('SET_USER_IMAGE', process.env.HEAD_IMAGE_URL + data.user_id + '.jpg')
            commit('SET_SELECTED_PROJECT_NAME', data.name)
            commit('SET_IS_WEB_PERMIT', data.is_web_permit)
            commit('SET_USER_CREATE_TIME', data.user_create_time)
            commit('SET_NICK_NAME', data.nickname)
            resolve(roles)
          }).catch(error => {
            reject(error)
          })
        } else {
          reject()
        }
      })
    },

    // 获取用户信息
    GetUserLevel({ commit }) {
      return new Promise((resolve, reject) => {
        getUserLevel().then(response => {
          const data = response.data
          // 存储用户的基本信息
          commit('SET_NAME', data.user_name)
          commit('SET_USER_LEVEL', data.level)
          commit('SET_USER_IMAGE', process.env.HEAD_IMAGE_URL + data.user_id + '.jpg')
          commit('SET_USER_LEVEL', data.level)
          commit('SET_USER_COMPANY', data.company_name)
          commit('SET_USER_CREATE_TIME', data.user_create_time)
          commit('SET_NICK_NAME', data.nickname)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 存储选择的项目id
    SelectProject({ commit }, info) {
      return new Promise(resolve => {
        commit('SET_SELECTED_PROJECT_ID', info.project_id)
        setProjectId(info.project_id)
        commit('SET_SELECTED_PROJECT_NAME', info.name)
        resolve()
      })
    },

    // 用户 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_SELECTED_PROJECT_ID', '')
          setProjectId('')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USER_ID', '')
        removeToken()
        removeUserID()
        resolve()
      })
    },

    // 重新选择项目时清空权限数组
    RemoveRoles({ commit }) {
      return new Promise(resolve => {
        commit('SET_ROLES', '')
        resolve()
      })
    }

    // 重新选择项目时清空项目ID
    // RemoveProjectID({ commit }) {
    //   return new Promise(resolve => {
    //     commit('SET_SELECTED_PROJECT_ID', '')
    //     setProjectId('')
    //     resolve()
    //   })
    // }
    /* SetReload({ commit }, flag) {
      return new Promise(resolve => {
        commit('SET_RELOAD', flag)
        resolve()
      })
    }*/
  }
}

export default user
