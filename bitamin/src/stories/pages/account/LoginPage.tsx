import React, { useState, useCallback, useEffect } from 'react'
import axiosInstance, { setAccessToken } from 'api/axiosInstance'
import useAuthStore from 'store/useAuthStore'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/store/useUserStore'
import { loginUser } from 'api/userAPI' // 로그인 API 함수 가져오기
import styles from 'styles/account/LoginPage.module.css'
import Modal from '@/stories/organisms/Modal'
import { googleLogin, kakaoLogin } from '@/api/userAPI'
import googleImg from '@/assets/image/google.png'
import kakakoImg from '@/assets/image/kakao2.png'

interface LoginResponse {
  accessToken: string
  refreshToken: string
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setCookie] = useCookies(['refreshToken'])
  const navigate = useNavigate()
  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<LoginResponse | null>(null) // 타입 지정

  const { fetchUser } = useUserStore()

  const {
    setAccessToken: setAuthAccessToken,
    setRefreshToken: setAuthRefreshToken,
  } = useAuthStore()

  const closeModal = () => {
    if (responseData) {
      const { accessToken, refreshToken } = responseData
      console.log('Server response:', responseData) // 서버 응답 확인
      console.log('Access Token:', accessToken) // 토큰 확인

      setAccessToken(accessToken) // axiosInstance에 accessToken 설정
      setAuthAccessToken(accessToken) // zustand 상태 관리에 accessToken 설정
      setAuthRefreshToken(refreshToken) // zustand 상태 관리에 refreshToken 설정

      setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'strict', // 또는 'lax' 또는 'none'으로 설정
      })

      // 세션 스토리지에 인증 상태 저장
      sessionStorage.setItem('isAuthenticated', 'true')
      setModalOpen(false)
      navigate('/home')
    } else {
      console.error('No response data available for modal processing')
    }
  }

  const handleLogin = async () => {
    try {
      console.log('Login request data:', { email, password })
      const response = await axiosInstance.post<LoginResponse>('/auth/login', {
        email,
        password,
      })
      setResponseData(response.data)
      setModalOpen(true)
    } catch (error: any) {
      console.error('Login error:', error.message)
      alert(`사용자를 찾을 수 없습니다.: ${error.message}`)
    }
  }

  const autoLogin = async (email: string, password: string) => {
    try {
      console.log('Login request data:', { email, password })
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      })
      setResponseData(response.data)
      setModalOpen(true)
    } catch (error: any) {
      console.error('Login error:', error.response || error.message)
      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed'
      alert(`Login failed: ${errorMessage}`)
    }
  }

  const handleSignUp = useCallback(() => {
    navigate('/signup')
  }, [navigate])

  const handleGoogleLogin = () => {
    googleLogin()
  }

  const handleKakaoLogin = () => {
    kakaoLogin()
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin()
    }
  }

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const emailQuery = query.get('email')
    const passwordQuery = query.get('password')
    if (emailQuery && passwordQuery) {
      autoLogin(emailQuery, passwordQuery)
    }
  }, [location.search])

  return (
    <>
      <div className={styles.div}>
        <div className={styles.backred} />
        <div className={styles.component66}>
          <div className={styles.component63}>
            <b className={styles.b}>로그인</b>
            <b className={styles.bitamin1}>BItAMin에 오신 것을 환영합니다.</b>
          </div>
          <div className={styles.component65}>
            <div className={styles.component65Child} />
            <div className={styles.component64}>
              <div className={styles.component61}>
                <div className={styles.component61Child} />
                <br />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress} // Enter 키를 눌렀을 때 로그인 버튼 클릭
                  placeholder="이메일을 입력하세요"
                  className={styles.div11}
                />
              </div>
              <div className={styles.component62}>
                <div className={styles.component61Child} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress} // Enter 키를 눌렀을 때 로그인 버튼 클릭
                  placeholder="비밀번호를 입력하세요"
                  className={styles.div11}
                />
              </div>
              <div className={styles.component55} onClick={handleLogin}>
                <div className={styles.component55Child}>
                  <b className={styles.b1}>로그인</b>
                </div>
              </div>
              <div className={styles.component56} onClick={handleSignUp}>
                <div className={styles.component56Child}>
                  <b className={styles.b2}>회원가입</b>
                </div>
              </div>

              <div className={styles.component60}>
                <div className={styles.component60Child} />
                <div className={styles.component60Item} />
                <div className={styles.component59} onClick={handleGoogleLogin}>
                  <img
                    className={styles.loginIcon}
                    alt="Google Login"
                    src={googleImg}
                  />
                </div>
                <div className={styles.component57} onClick={handleKakaoLogin}>
                  <img
                    className={styles.loginIcon}
                    alt="Kakao Login"
                    src={kakakoImg}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          title="로그인"
          content="로그인 성공!"
          iconSrc="ri.RiCheckFill"
          onClose={closeModal}
          headerBackgroundColor="#FF713C"
          buttonBorderColor="#FF713C"
          buttonTextColor="#FF713C"
          imgColor="#FF713C"
        />
      )}
    </>
  )
}

export default LoginPage
