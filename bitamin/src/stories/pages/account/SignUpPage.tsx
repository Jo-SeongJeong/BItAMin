import React, { useState, useEffect } from 'react'
import {
  registerUser,
  checkEmail,
  checkNickname,
  fetchSidoNames,
  fetchGugunNames,
  fetchDongNames,
} from '@/api/userAPI'
import useAuthStore from '@/store/useAuthStore'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import styles from 'styles/account/SignUpPage.module.css'
import HeaderBeforeLogin from '@/stories/organisms/common/HeaderBeforeLogin'
import Modal from '@/stories/organisms/Modal'

const SignUpPage: React.FC = () => {
  const [signupForm, setSignupForm] = useState({
    email: '',
    name: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
    birthday: '',
    sidoName: '',
    gugunName: '',
    dongName: '',
    image: null as File | null, // 파일은 null로 초기화
  })

  const [emailValid, setemailValid] = useState<boolean | null>(null)
  const [nicknameValid, setNicknameValid] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [, setCookie] = useCookies(['refreshToken'])
  const navigate = useNavigate()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null) // 미리보기 URL 상태
  const [sidoNames, setSidoNames] = useState<string[]>([])
  const [gugunNames, setGugunNames] = useState<string[]>([])
  const [dongNames, setDongNames] = useState<string[]>([])
  const [isQueryPrefilled, setIsQueryPrefilled] = useState<boolean>(false)

  // 모달 창
  const [isModalOpen, setModalOpen] = useState<string | null>(null)

  const openModal = (type: string) => () => setModalOpen(type)
  const closeModal = () => {
    setModalOpen(null)
    navigate('/login')
  }
  const {
    setAccessToken: setAuthAccessToken,
    setRefreshToken: setAuthRefreshToken,
  } = useAuthStore()

  // 시/도 목록을 가져옴
  useEffect(() => {
    const loadSidoNames = async () => {
      try {
        const data = await fetchSidoNames()
        setSidoNames(data)
      } catch (error) {
        console.error('시/도 목록을 가져오는 중 오류 발생:', error)
      }
    }

    loadSidoNames()
  }, [])

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (e.target instanceof HTMLInputElement && e.target.files) {
      const files = e.target.files
      if (name === 'image' && files && files[0]) {
        const imageFile = files[0]
        setSignupForm({
          ...signupForm,
          image: imageFile,
        })
        const previewUrl = URL.createObjectURL(imageFile)
        setPreviewUrl(previewUrl) // 미리보기 URL을 상태에 저장
      }
    } else {
      setSignupForm({
        ...signupForm,
        [name]: value,
      })

      if (name === 'email' && value) {
        try {
          const result = await checkEmail(value)
          setemailValid(result === 0) // 0이면 사용 가능, 1이면 중복
        } catch (error) {
          setemailValid(null)
          setError('이메일 중복 확인 중 오류가 발생했습니다.')
        }
      }

      if (name === 'nickname' && value) {
        try {
          const result = await checkNickname(value)
          setNicknameValid(result === 0) // 0이면 사용 가능, 1이면 중복
        } catch (error) {
          setNicknameValid(null)
          setError('닉네임 중복 확인 중 오류가 발생했습니다.')
        }
      }

      if (name === 'sidoName') {
        // 시/도를 선택하면 구/군 목록을 로드
        try {
          const data = await fetchGugunNames(value)
          setGugunNames(data)
          setSignupForm({
            ...signupForm,
            sidoName: value,
            gugunName: '',
            dongName: '',
          })
          setDongNames([]) // 구/군 선택 전 동 목록 초기화
        } catch (error) {
          console.error('구/군 목록을 가져오는 중 오류 발생:', error)
        }
      }

      if (name === 'gugunName') {
        try {
          const data = await fetchDongNames(signupForm.sidoName, value)
          setDongNames(data)
          setSignupForm({ ...signupForm, gugunName: value, dongName: '' })
        } catch (error) {
          console.error('동 목록을 가져오는 중 오류 발생:', error)
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!emailValid) {
      setError('중복된 이메일입니다. 다른 이메일을 사용하세요.')
      return
    }

    try {
      const data = await registerUser(signupForm)

      const { accessToken, refreshToken } = data

      setAuthAccessToken(accessToken) // zustand 상태 관리에 accessToken 설정
      setAuthRefreshToken(refreshToken) // zustand 상태 관리에 refreshToken 설정
      setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'strict', // 또는 'lax' 또는 'none'으로 설정
      })

      setSuccess('회원가입이 성공적으로 완료되었습니다.')
      openModal('signupComplete')()
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || '회원가입 실패'
      setError(errorMessage)
      console.error('Signup error:', error) // 오류 로그 출력
      console.log('Error response:', error.response) // 상세 오류 응답 출력
    }
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const emailQuery = query.get('email')
    const passwordQuery = query.get('password')
    if (emailQuery && passwordQuery) {
      setSignupForm((prevForm) => ({
        ...prevForm,
        email: emailQuery,
        password: passwordQuery,
        passwordConfirm: passwordQuery,
      }))
      setIsQueryPrefilled(true)
    }
  }, [window.location.search])

  return (
    <>
      <div className={styles.div}>
        <div className={styles.backred}></div>
        <div className={styles.component66}>
          <div className={styles.component63}>
            <b className={styles.b}>회원가입</b>
            <b className={styles.bitamin1}>BItAMin에 오신 것을 환영합니다.</b>
          </div>
          <div className={styles.component65}>
            <div className={styles.component65Child}></div>
            <div className={styles.component78}>
              {previewUrl ? (
                <img src={previewUrl} alt="미리보기 이미지" />
              ) : (
                <div>이미지를 선택해주세요</div>
              )}
              <input
                type="file"
                name="image"
                accept=".jpg, .jpeg, .png"
                onChange={handleChange}
                className={styles.inputFile}
              />
            </div>
            <form onSubmit={handleSubmit} className={styles.groupDiv}>
              <div className={styles.component70}>
                {emailValid === false && (
                  <div className={styles.error}>이메일이 존재합니다.</div>
                )}
                <input
                  type="email"
                  name="email"
                  value={signupForm.email}
                  onChange={handleChange}
                  className={`${styles.div11} ${
                    emailValid === false ? styles.inputError : ''
                  }`}
                  placeholder="이메일을 입력하세요"
                  required
                  disabled={isQueryPrefilled}
                />
              </div>
              <div className={styles.component70}>
                <input
                  type="text"
                  name="name"
                  value={signupForm.name}
                  onChange={handleChange}
                  className={styles.div11}
                  placeholder="이름"
                  required
                />
              </div>
              <div className={styles.component70}>
                {nicknameValid === false && (
                  <div className={styles.error}>
                    닉네임이 이미 사용 중입니다.
                  </div>
                )}
                {nicknameValid && (
                  <div className={styles.success}>
                    닉네임을 사용할 수 있습니다.
                  </div>
                )}
                <input
                  type="text"
                  name="nickname"
                  value={signupForm.nickname}
                  onChange={handleChange}
                  className={styles.div11}
                  placeholder="닉네임"
                  required
                />
              </div>
              <div className={styles.component70}>
                {signupForm.password !== signupForm.passwordConfirm && (
                  <div className={styles.error}>
                    비밀번호가 일치하지 않습니다
                  </div>
                )}
                <input
                  type="password"
                  name="password"
                  value={signupForm.password}
                  onChange={handleChange}
                  className={`${styles.div11} ${
                    signupForm.password !== signupForm.passwordConfirm
                      ? styles.inputError
                      : ''
                  }`}
                  placeholder="비밀번호"
                  disabled={isQueryPrefilled}
                  required
                />
              </div>
              <div className={styles.component70}>
                <input
                  type="password"
                  name="passwordConfirm"
                  value={signupForm.passwordConfirm}
                  onChange={handleChange}
                  className={`${styles.div11} ${
                    signupForm.password !== signupForm.passwordConfirm
                      ? styles.inputError
                      : ''
                  }`}
                  placeholder="비밀번호 확인"
                  disabled={isQueryPrefilled}
                  required
                />
              </div>
              <div className={styles.component70}>
                <input
                  type="date"
                  name="birthday"
                  value={signupForm.birthday}
                  onChange={handleChange}
                  className={styles.div11}
                  placeholder="생년월일"
                  required
                />
              </div>
              <div className={styles.component74}>
                <select
                  name="sidoName"
                  value={signupForm.sidoName}
                  onChange={handleChange}
                  className={styles.div11}
                  required
                >
                  <option value="">시/도 선택</option>
                  {sidoNames.map((sido) => (
                    <option key={sido} value={sido}>
                      {sido}
                    </option>
                  ))}
                </select>
              </div>
              {signupForm.sidoName && (
                <div className={styles.component74}>
                  <select
                    name="gugunName"
                    value={signupForm.gugunName}
                    onChange={handleChange}
                    className={styles.div11}
                  >
                    <option value="">구/군 선택</option>
                    {gugunNames.map((gugun) => (
                      <option key={gugun} value={gugun}>
                        {gugun}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {signupForm.gugunName && (
                <div className={styles.component74}>
                  <select
                    name="dongName"
                    value={signupForm.dongName}
                    onChange={handleChange}
                    className={styles.div11}
                  >
                    <option value="">동 선택</option>
                    {dongNames.map((dong) => (
                      <option key={dong} value={dong}>
                        {dong}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {error && <div className={styles.error}>{error}</div>}
              {success && <div className={styles.success}>{success}</div>}

              <div className={styles.component55Child}>
                <button type="submit" className={styles.div3}>
                  가입
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isModalOpen === 'signupComplete' && (
        <Modal
          title="회원가입 완료"
          content="회원가입이 성공적으로 완료되었습니다."
          iconSrc="fi.FiEdit"
          onClose={closeModal}
          headerBackgroundColor="#FF713C"
          buttonBorderColor="#FF713C"
          buttonTextColor="#FF713C"
          imgColor="#333"
        />
      )}
    </>
  )
}

export default SignUpPage
