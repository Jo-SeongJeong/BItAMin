import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'
import { useCookies } from 'react-cookie'
import axiosInstance from '@/api/axiosInstance'

const HeaderAfterLogin: FunctionComponent = () => {
  const navigate = useNavigate()
  const { accessToken, refreshToken, clearAuth } = useAuthStore()
  const [, , removeCookie] = useCookies(['refreshToken'])
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [username, setUsername] = useState('') // username 상태 추가

  // 유저 이름 불러오기
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axiosInstance.get('/user/me') // 유저 정보를 불러오는 API 엔드포인트를 호출합니다.
        setUsername(response.data.name) // 가져온 유저 이름을 상태에 설정합니다.
      } catch (error) {
        console.error('Failed to fetch username:', error)
      }
    }

    fetchUsername()
  }, [])

  const onBItAMinTextClick = useCallback(() => {
    navigate('/home')
  }, [navigate])

  const onCounselClick = useCallback(() => {
    navigate('/counselationlist')
  }, [navigate])

  const onLogoutClick = useCallback(() => {
    // 액세스 토큰과 리프레시 토큰을 삭제
    clearAuth()
    removeCookie('refreshToken', { path: '/' })
    console.log('Logged out successfully!')
    console.log('Access Token:', accessToken)
    console.log('Refresh Token:', refreshToken)
    alert('Logged out successfully!')
    navigate('/home')
  }, [navigate, clearAuth, removeCookie, accessToken, refreshToken])

  // 이름 누르면 토글 뜨도록
  const toggleDropdown = useCallback(() => {
    setDropdownVisible((prev) => !prev)
  }, [])

  return (
    <div className="w-full relative flex flex-col items-start justify-start py-[0rem] px-[2.5rem] box-border text-center text-[0.875rem] text-brand-primary font-nanumgothic">
      <div className="self-stretch bg-white h-[4.625rem] flex flex-row items-center justify-between">
        <div
          className="w-[8.5rem] relative text-[2rem] font-bagel-fat-one text-left inline-block shrink-0 cursor-pointer"
          onClick={onBItAMinTextClick}
        >
          BItAMin
        </div>
        <div className="flex flex-row items-center justify-start gap-[3.125rem] text-black">
          <div
            className="w-[3.75rem] h-[4.625rem] flex flex-col items-center justify-center p-[0.312rem] box-border gap-[0.312rem] cursor-pointer"
            onClick={onCounselClick}
          >
            <div className="w-[4.563rem] h-[1.438rem] flex flex-row items-end justify-center">
              <div className="relative">상담</div>
            </div>
            <div className="w-[3.125rem] relative rounded-sm bg-brand-sub h-[0.125rem]" />
          </div>
          <div
            className="w-[3.75rem] h-[4.625rem] flex flex-col items-center justify-center p-[0.312rem] box-border gap-[0.312rem] cursor-pointer"
            onClick={onBItAMinTextClick}
          >
            <div className="w-[4.563rem] h-[1.438rem] flex flex-row items-end justify-center">
              <div className="relative">미션</div>
            </div>
            <div className="w-[3.125rem] relative rounded-sm bg-brand-sub h-[0.125rem]" />
          </div>
          <div
            className="w-[3.75rem] h-[4.625rem] flex flex-col items-center justify-center p-[0.312rem] box-border gap-[0.312rem] cursor-pointer"
            onClick={onBItAMinTextClick}
          >
            <div className="w-[4.563rem] h-[1.438rem] flex flex-row items-end justify-end">
              <div className="relative">건강</div>
              <div className="w-[1.688rem] h-[2.25rem] flex flex-row items-start justify-center ml-[-0.25rem] text-brand-primary font-ownglyph-ryuttung">
                <div className="w-[1.375rem] relative flex items-center justify-center h-[2.063rem] shrink-0">
                  UP !
                </div>
              </div>
            </div>
            <div className="w-[3.125rem] relative rounded-sm bg-brand-sub h-[0.125rem]" />
          </div>
          <div
            className="w-[3.75rem] h-[4.625rem] flex flex-col items-center justify-center p-[0.312rem] box-border gap-[0.312rem] cursor-pointer"
            onClick={onBItAMinTextClick}
          >
            <div className="w-[4.563rem] h-[1.438rem] flex flex-row items-end justify-center">
              <div className="relative">관리자</div>
            </div>
            <div className="w-[3.125rem] relative rounded-sm bg-brand-sub h-[0.125rem]" />
          </div>
        </div>
        <div className="w-[7.75rem] h-[6.125rem] flex flex-col items-start justify-end text-darkgray">
          <div className="self-stretch flex flex-row items-center justify-start gap-[0.375rem]">
            <div className="flex flex-row items-center justify-start gap-[0.437rem]">
              <img
                className="w-[1.188rem] relative h-[1.188rem] overflow-hidden shrink-0"
                alt=""
                src="PersonCircle.svg"
              />
              <div
                className="w-[4.5rem] h-[1.188rem] flex flex-row items-center justify-start gap-[0.25rem] cursor-pointer"
                onClick={toggleDropdown}
              >
                <div className="h-[1.563rem] flex flex-row items-center justify-center">
                  <div className="w-[3.313rem] relative flex items-center h-[1.5rem] shrink-0">
                    <span className="w-full">
                      <span>{username}</span>
                      <span className="font-nanumbarunpen text-[1.063rem]">
                        <span>{` `}</span>
                        <span className="text-[0.75rem]">님</span>
                      </span>
                    </span>
                  </div>
                </div>
                <div className="w-[0.563rem] h-[1.188rem] flex flex-col items-center justify-end py-[0.312rem] px-[0rem] box-border">
                  <img
                    className="w-[0.563rem] relative h-[0.375rem]"
                    alt=""
                    src="Vector.svg"
                  />
                </div>
              </div>
            </div>
            <div
              className="h-[1.5rem] flex flex-row items-start justify-end cursor-pointer"
              onClick={onBItAMinTextClick}
            >
              <img
                className="w-[1.188rem] relative h-[1.231rem]"
                alt=""
                src="쪽지 버튼.svg"
              />
            </div>
          </div>
          {dropdownVisible && (
            <div className="w-[5.75rem] shadow-[4px_4px_25px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start mt-[-0.125rem] text-[0.563rem] text-gray">
              <div
                className="self-stretch bg-white h-[1.188rem] flex flex-col items-start justify-center py-[0.375rem] px-[1.5rem] box-border cursor-pointer"
                onClick={() => navigate('/mypage')}
              >
                <div className="w-[2.688rem] flex flex-col items-center justify-start">
                  <div className="relative">마이페이지</div>
                </div>
              </div>
              <div
                className="self-stretch rounded-t-none rounded-b-8xs bg-white h-[1.25rem] flex flex-col items-start justify-center py-[0.375rem] px-[1.5rem] box-border cursor-pointer"
                onClick={onLogoutClick}
              >
                <div className="w-[2.688rem] flex flex-col items-center justify-start">
                  <div className="self-stretch relative">로그아웃</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeaderAfterLogin
