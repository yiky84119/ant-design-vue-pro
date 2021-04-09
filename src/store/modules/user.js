import storage from 'store'
import { queryPermissionsByUser } from '@/api/index'
import { login, logout } from '@/api/login'
import {
  ACCESS_TOKEN,
  USER_NAME,
  USER_INFO,
  CACHE_DICT_DATA,
  USER_BUTTON_AUTH,
  SYS_BUTTON_AUTH
} from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    username: '',
    realname: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    permissionList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, realname, welcome }) => {
      state.name = name
      state.realname = realname
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSION_LIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code === 200) {
            const result = response.result
            // const userInfo = result.userInfo
            storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            storage.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
            storage.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
            storage.set(CACHE_DICT_DATA, result.sysAllDictItems, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            commit('SET_INFO', userInfo)
            commit('SET_NAME', { username: userInfo.username, realname: userInfo.realname, welcome: welcome() })
            commit('SET_AVATAR', userInfo.avatar)
            resolve(response)
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    QueryPermissions ({ commit }) {
      return new Promise((resolve, reject) => {
        queryPermissionsByUser().then(response => {
          const menuData = response.result.menu
          const authData = response.result.auth
          const allAuthData = response.result.allAuth
          sessionStorage.setItem(USER_BUTTON_AUTH, JSON.stringify(authData))
          sessionStorage.setItem(SYS_BUTTON_AUTH, JSON.stringify(allAuthData))
          if (menuData && menuData.length > 0) {
            menuData.forEach((item, index) => {
              if (item['children']) {
                const hasChildrenMenu = item['children'].filter((i) => {
                  return !i.hidden || i.hidden === false
                })
                if (hasChildrenMenu == null || hasChildrenMenu.length === 0) {
                  item['hidden'] = true
                }
              }
            })
            commit('SET_PERMISSION_LIST', menuData)
          } else {
            reject(new Error('getPermissions: permissions must be a non-null array !'))
          }

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSION_LIST', [])
        storage.remove(ACCESS_TOKEN)
        storage.remove(USER_INFO)
        storage.remove(USER_NAME)
        storage.remove(CACHE_DICT_DATA)
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    }

  }
}

export default user
