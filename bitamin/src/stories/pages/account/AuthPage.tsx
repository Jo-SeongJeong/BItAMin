import { useState, useEffect } from 'react'
import axiosInstance, { setAccessToken } from 'api/axiosInstance' // 경로 수정
import useAuthStore from 'store/useAuthStore' // 경로 수정
import { useCookies } from 'react-cookie'
import { fetchMessages } from 'api/messageAPI'

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setCookie] = useCookies(['refreshToken']) // `cookies` 대신 `_`를 사용

  const {
    accessToken,
    refreshToken,
    setAccessToken: setAuthAccessToken,
    setRefreshToken: setAuthRefreshToken,
    clearAuth,
  } = useAuthStore()

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      })

      const { accessToken, refreshToken } = response.data
      setAccessToken(accessToken) // axiosInstance에 accessToken 설정
      setAuthAccessToken(accessToken) // zustand 상태 관리에 accessToken 설정
      setAuthRefreshToken(refreshToken) // zustand 상태 관리에 refreshToken 설정
      setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'strict', // 또는 'lax' 또는 'none'으로 설정
      })

      alert('Login successful!')
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed'
      alert(`Login failed: ${errorMessage}`)
      console.error('Login error:', error)
    }
  }

  const handleFetchMessages = async () => {
    try {
      const messages = await fetchMessages()
      console.log('Messages:', messages)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const emailQuery = query.get('email')
    const passwordQuery = query.get('password')
    console.log('Email Query:', emailQuery) // 추가
    console.log('Password Query:', passwordQuery) // 추가
    if (emailQuery) setEmail(emailQuery)
    if (passwordQuery) setPassword(passwordQuery)
  }, [window.location.search])

  return (
    <div>
      <div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      <div>
        <button onClick={() => setAuthAccessToken('newAccessToken')}>
          Set Access Token
        </button>
        <br />
        <button onClick={() => setAuthRefreshToken('newRefreshToken')}>
          Set Refresh Token
        </button>
        <br />
        <button onClick={clearAuth}>Clear Tokens</button>
        <br />
        <button onClick={handleFetchMessages}>Fetch Messages</button>
        <p>Current Access Token: {accessToken}</p>
        <p>Current Refresh Token: {refreshToken}</p>
      </div>
    </div>
  )
}

export default AuthPage
