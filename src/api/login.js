import request from '@/utils/request'

const userApi = {
  Login: '/sys/login',
  Logout: '/sys/logout',
  ImageCaptcha: '/sys/randomImage',
  // ForgePassword: '/auth/forge-password',
  // Register: '/auth/register',
  // twoStepCode: '/auth/2step-code',
  SendSms: '/sys/sms'
  // SendSmsErr: '/sys/permission/getUserPermissionByToken',
  // // get my info
  // UserInfo: '/user/info',
  // UserMenu: '/user/nav'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getImageCaptcha (checkKey) {
  return request({
    url: `${userApi.ImageCaptcha}/${checkKey}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}
