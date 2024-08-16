import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'
import { useCookies } from 'react-cookie'
import useUserStore from '@/store/useUserStore'
import { BsSend } from 'react-icons/bs'
import mainQuestImg from 'assets/image/mainQuestImg.png'

const Header: FunctionComponent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { accessToken, clearAuth, role } = useAuthStore()
  const [, , removeCookie] = useCookies(['refreshToken'])
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const { user, fetchUser, loading, clearUserData } = useUserStore()

  useEffect(() => {
    fetchUser() // 항상 최신 유저 데이터를 불러오도록 수정
  }, [fetchUser])

  useEffect(() => {
    setDropdownVisible(false)
  }, [location])

  const onBItAMinTextClick = useCallback(() => {
    navigate('/home')
  }, [navigate])

  const onConsultationClick = useCallback(() => {
    navigate('/consultationlist')
  }, [navigate])

  const onLoginTextClick = useCallback(() => {
    navigate('/login')
  }, [navigate])

  const onMissionClick = useCallback(() => {
    navigate('/mission')
  }, [navigate])

  const onHealthUPClick = useCallback(() => {
    navigate('/healthuplist')
  }, [navigate])

  const onAdminClick = useCallback(() => {
    navigate('/admin')
  }, [navigate])

  const onMessageClick = useCallback(() => {
    navigate('/messagelist')
  }, [navigate])

  const onSignupTextClick = useCallback(() => {
    navigate('/signup')
  }, [navigate])

  const onLogoutClick = useCallback(() => {
    clearAuth()
    clearUserData() // 유저 데이터를 초기화
    removeCookie('refreshToken', { path: '/' })
    alert('Logged out successfully!')
    navigate('/home')
  }, [navigate, clearAuth, removeCookie, clearUserData])

  const toggleDropdown = useCallback(() => {
    setDropdownVisible((prev) => !prev)
  }, [])

  // 현재 경로에 따른 강조 표시를 위한 변수 설정
  const isConsultationActive = location.pathname === '/consultationlist'
  const isMissionActive = location.pathname === '/mission'
  const isHealthUPActive = location.pathname === '/healthuplist'
  const isAdminActive = location.pathname === '/admin'

  return (
    <div className="w-full fixed top-0 z-50 flex flex-row items-center justify-between text-center text-[0.875rem] text-brand-primary font-nanumgothic bg-white h-[calc(9/16*100vw*0.1)] px-[44px] font-nanumgothic">
      <div
        className="w-[8.5rem] relative text-[3rem] font-bagel text-left inline-block shrink-0 cursor-pointer text-[#ff713c]"
        onClick={onBItAMinTextClick}
      >
        BItAMin
      </div>
      <div className="flex flex-row items-center justify-start gap-[7.125rem]">
        <div
          className={`w-[5rem] h-full flex flex-col items-center justify-center p-[0.312rem] box-border gap-[0.312rem] cursor-pointer ${
            isConsultationActive ? 'text-[#ff713c]' : 'text-black'
          }`}
          onClick={onConsultationClick}
        >
          <div className="w-[5rem] h-[1.438rem] flex flex-row items-end justify-center">
            <div className="relative text-[1rem]">상담</div>
          </div>
          <div
            className={`w-full mt-2 h-[0.125rem] ${
              isConsultationActive ? 'bg-[#ff713c]' : 'bg-gray-200'
            }`}
          />
        </div>
        <div
          className={`w-[5rem] h-full flex flex-col items-center justify-center p-[0.312rem] box-border gap-[0.312rem] cursor-pointer ${
            isMissionActive ? 'text-[#ff713c]' : 'text-black'
          }`}
          onClick={onMissionClick}
        >
          <div className="w-[5rem] h-[1.438rem] flex flex-row items-end justify-center">
            <div className="relative text-[1rem]">미션</div>
          </div>
          <div
            className={`w-full mt-2 h-[0.125rem] ${
              isMissionActive ? 'bg-[#ff713c]' : 'bg-gray-200'
            }`}
          />
        </div>
        <div
          className={`w-[5rem] h-full flex flex-col items-center justify-center p-[0.312rem] box-border gap-[0.312rem] cursor-pointer ${
            isHealthUPActive ? 'text-[#ff713c]' : 'text-black'
          }`}
          onClick={onHealthUPClick}
        >
          <div className="w-[5rem] h-[1.438rem] flex flex-row items-end justify-end">
            <div className="relative text-[1rem]">건강</div>
            <div className="w-[1.688rem] h-[2.25rem] flex flex-row items-start justify-center ml-[-0.25rem] text-brand-primary font-ownglyph-ryuttung">
              <div className="w-[1.375rem] relative flex items-center justify-center h-[2.063rem] shrink-0">
                UP
              </div>
            </div>
          </div>
          <div
            className={`w-full mt-2 h-[0.125rem] ${
              isHealthUPActive ? 'bg-[#ff713c]' : 'bg-gray-200'
            }`}
          />
        </div>
        {role === 'admin' && (
          <div
            className={`w-[5rem] h-full flex flex-col items-center justify-center p-[0.312rem] box-border gap-[0.312rem] cursor-pointer ${
              isAdminActive ? 'text-[#ff713c]' : 'text-black'
            }`}
            onClick={onAdminClick}
          >
            <div className="w-[5rem] h-[1.438rem] flex flex-row items-end justify-center">
              <div className="relative text-[1.2rem]">관리자</div>
            </div>
            <div
              className={`w-full mt-2 h-[0.125rem] ${
                isAdminActive ? 'bg-[#ff713c]' : 'bg-gray-200'
              }`}
            />
          </div>
        )}
      </div>
      {accessToken ? (
        <div className="relative w-[10rem] font-ownglyph h-full flex flex-row items-center justify-start text-darkgray ml-[-3rem]">
          <div className="flex flex-row items-center justify-start gap-[0.437rem]">
            <img
              className="w-[4rem] h-[2.5rem] relative overflow-hidden shrink-0"
              alt=""
              src={mainQuestImg}
            />
            <div
              className="w-[4.5rem] h-[1.188rem] flex flex-row items-center justify-start gap-[0.25rem] cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="h-[1.563rem] flex flex-col items-center justify-center">
                <div className="w-[5rem] relative flex items-center h-[1.5rem] shrink-0">
                  {loading ? (
                    <div>로딩 중...</div>
                  ) : (
                    <span className="w-full whitespace-nowrap">
                      <span className="text-[1.3rem]">{user?.name}</span>
                      <span className="font-ownglyph text-[1rem]">
                        <span className="text-[1rem]">님</span>
                      </span>
                    </span>
                  )}
                </div>
              </div>
              <div className="w-[0.563rem] h-[1.188rem] flex flex-col items-center justify-end py-[0.312rem] px-[0rem] box-border">
                <img></img>
              </div>
            </div>
          </div>
          <div
            className="h-[1.5rem] flex flex-row items-center justify-end cursor-pointer"
            onClick={onMessageClick}
          >
            <BsSend />
          </div>
          {dropdownVisible && (
            <div className="absolute top-[5rem] left-0 w-[6rem] shadow-[4px_4px_25px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start mt-[0.25rem] text-[0.875rem] text-gray bg-white rounded-[0.25rem]">
              <div
                className="w-full py-[0.5rem] px-[1rem] cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                onClick={() => navigate('/mypage')}
              >
                마이페이지
              </div>
              <div
                className="w-full py-[0.5rem] px-[1rem] cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                onClick={onLogoutClick}
              >
                로그아웃
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-[12rem] h-full flex flex-row items-center justify-center gap-[0.287rem] text-dimgray whitespace-nowrap">
          <div
            className="w-[4rem] relative flex items-center justify-center h-[2rem] shrink-0 cursor-pointer text-[1rem]"
            onClick={onLoginTextClick}
          >
            로그인
          </div>
          <div className="w-[1.25rem] relative text-black flex items-center justify-center h-[2rem] shrink-0">
            /
          </div>
          <div
            className="relative cursor-pointer w-[8rem] text-[1rem]"
            onClick={onSignupTextClick}
          >
            회원가입
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
