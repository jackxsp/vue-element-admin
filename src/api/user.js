import request from '@/utils/request'
import { getToken } from '@/utils/auth'
export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `/api/userinfo/${getToken()}`,
    method: 'get',
    data: {
      token
    }
  })
}

export function logout(token) {
  return request({
    url: `api/user/logout/${getToken()}`,
    method: 'post',
    data: {
      token
    }
  })
}

