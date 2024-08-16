import axios from 'axios'
import useAuthStore from 'store/useAuthStore'
import { useNavigate } from 'react-router-dom'

const axiosInstance = axios.create({
  // localhost에서는 refreshToken은 발급되지 않음.
  // accessToken
  baseURL: 'https://i11b105.p.ssafy.io/api', // API 기본 URL 설정
  // baseURL: 'http://localhost:8080/api', // API 기본 URL 설정
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // HTTP-only 쿠키를 전송하기 위해 설정
})
const { clearAuth } = useAuthStore.getState()
const EXCLUDED_PATHS = ['/auth/login', '/members/register','/auth']

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    if (
      config.url &&
      !EXCLUDED_PATHS.some((path) => config.url!.includes(path))
    ) {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      originalRequest.url &&
      !EXCLUDED_PATHS.some((path) => originalRequest.url.includes(path))
    ) {
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          const { refreshToken, setAccessToken, setRefreshToken, clearAuth } =
            useAuthStore.getState()
          // console.log(clearAuth) // clearAuth가 올바르게 가져와졌는지 확인하는 로그
          // 새로운 Access Token 요청
          const response = await axios.post(
            'https://i11b105.p.ssafy.io/api/refresh-token',
            {},
            {
              headers: { Authorization: `Bearer ${refreshToken}` },
            }
          )
          const newAccessToken = response.data.accessToken
          const newRefreshToken = response.data.refreshToken
          setAccessToken(newAccessToken) // 상태 업데이트
          setRefreshToken(newRefreshToken) // 상태 업데이트
          axiosInstance.defaults.headers.common['Authorization'] =
            `Bearer ${newAccessToken}`
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          const navigate = useNavigate()
          clearAuth() // 사용자 상태 초기화
          navigate('/login') // 로그인 페이지로 리다이렉트
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error)
  }
)

export const setAccessToken = (token: string) => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default axiosInstance
