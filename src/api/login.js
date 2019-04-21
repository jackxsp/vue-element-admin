import request from '@/utils/request'

export function loginByUsername(data) {
	return request({
    url: `/api/login`,
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: `/api/login/logout`,
    method: 'post'
  })
}

export function getRoles(userId) {
  return request({
    url: `/api/getRoles/${userId}`,
    method: 'get'
  })
}

