import axiosInstance from './axiosInstance'

export const fetchUserInfo = async () => {
  try {
    const response = await axiosInstance.get('/members/get-member')
    console.log('Response from /user/info:', response.data) // API 응답 로그 확인
    return response.data
  } catch (error) {
    console.error('Failed to fetch user info:', error)
    throw error
  }
}
