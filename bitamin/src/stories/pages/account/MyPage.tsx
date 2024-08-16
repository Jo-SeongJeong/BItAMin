import React, { useState, useEffect, ChangeEvent, useRef } from 'react'
import styles from 'styles/account/MyPage.module.css'
import HospitalMap from 'stories/organisms/HospitalMap'
import Modal from '@/stories/organisms/Modal'
import PasswordChangeModal from '@/stories/organisms/PasswordChangeModal'
import {
  fetchUserInfo,
  updateUserInfo,
  checkEmail,
  checkNickname,
  fetchSidoNames,
  fetchGugunNames,
  fetchDongNames,
  fetchHealthReports,
} from '@/api/userAPI'
import { useNavigate } from 'react-router-dom'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const MyPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    name: '',
    nickname: '',
    birthday: '',
    sidoName: '',
    gugunName: '',
    dongName: '',
    image: null as File | null,
    profileUrl: '',
    checkupScore: 0,
    checkupDate: '',
  })
  const [emailValid, setemailValid] = useState<boolean | null>(null)
  const [nicknameValid, setNicknameValid] = useState<boolean | null>(null)
  const [sidoNames, setSidoNames] = useState<string[]>([])
  const [gugunNames, setGugunNames] = useState<string[]>([])
  const [dongNames, setDongNames] = useState<string[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [initialProfileUrl, setInitialProfileUrl] = useState<string | null>(
    null
  )
  const [selectedResult, setSelectedResult] = useState<{
    date: string
    score: number
  } | null>(null)

  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isImageDeleted, setIsImageDeleted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false)

  const [healthReports, setHealthReports] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([]) // 차트 데이터 상태 추가

  const getScoreMessage = (score: number): string => {
    if (score <= 15) {
      return `현재 당신의 점수는 정상 범위에 속합니다. \n\n유의미한 수준의 우울감이 나타나지 않으며, 전반적으로 안정된 상태를 유지하고 있습니다. \n\n이러한 상태를 지속적으로 유지하기 위해 현재의 생활 습관을 잘 관리하시길 권장드립니다. \n\n만약 기분 변화가 느껴지거나 불안함이 생긴다면, 가벼운 산책이나 취미 생활을 통해 긍정적인 기운을 유지하는 것도 도움이 될 수 있습니다.`
    } else if (score <= 20) {
      return `다소 경미한 수준의 우울감이 느껴질 수 있습니다.\n\n이러한 기분은 일상생활에 큰 지장을 주지는 않지만, 지속된다면 심리적, 신체적 자원에 영향을 미칠 가능성이 있습니다.\n\n지금은 충분한 휴식과 자기 돌봄이 중요한 시기입니다.\n\n스스로의 감정에 귀 기울이고, 필요하다면 가까운 친구나 가족과 대화를 나누며 마음을 나누어 보세요.\n\n또한, 이러한 기분이 지속될 경우 가까운 지역센터나 전문기관을 찾아 전문가의 도움을 받는 것도 좋은 방법입니다.`
    } else if (score <= 24) {
      return `현재 당신의 점수는 중간 정도의 우울감을 나타내고 있습니다.\n\n이 정도의 우울감은 종종 일상생활에 어려움을 초래할 수 있으며, 신체적, 심리적 에너지를 저하시킬 가능성이 큽니다.\n\n이러한 상황에서는 혼자 감정을 다루기보다는 전문가의 도움을 받는 것이 좋습니다.\n\n가까운 지역센터나 전문기관에서 상담을 받아보는 것을 적극 권장드립니다.\n\n전문가와 함께라면 당신의 기분 상태를 더 잘 이해하고, 필요한 지원을 받을 수 있을 것입니다.`
    } else {
      return `현재 점수는 심각한 수준의 우울감을 나타내며, 즉각적인 전문적인 지원이 필요할 수 있습니다. \n\n이 정도의 우울감은 일상생활의 기능을 크게 저하시킬 수 있으며, 신체적, 심리적 건강에 심각한 영향을 미칠 수 있습니다.\n\n가능한 빨리 전문기관을 찾아가 치료적 개입과 평가를 받아보시기를 강력히 권장드립니다.\n\n전문가의 도움을 통해, 당신의 현재 상태를 개선할 수 있는 구체적인 방법을 찾을 수 있을 것입니다.\n\n혼자가 아닌, 함께 극복해 나가는 것이 중요합니다.`
    }
  }

  const openPasswordModal = () => setIsPasswordModalOpen(true)
  const closePasswordModal = () => setIsPasswordModalOpen(false)
  const closeModal = () => setIsModalOpen(false)

  const handlePasswordChangeSuccess = () => {
    setIsModalOpen(true)
  }

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const data = await fetchUserInfo()
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          email: data.email,
          name: data.name,
          nickname: data.nickname,
          birthday: data.birthday,
          sidoName: data.sidoName,
          gugunName: data.gugunName,
          dongName: data.dongName,
          profileUrl: data.profileUrl,
        }))
        setPreviewUrl(data.profileUrl)
        setInitialProfileUrl(data.profileUrl) // 초기 profileUrl 설정

        setLocation({
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
        })
        const sidoNames = await fetchSidoNames()
        setSidoNames(sidoNames)

        if (data.sidoName) {
          const gugunNames = await fetchGugunNames(data.sidoName)
          setGugunNames(gugunNames)
        }

        if (data.gugunName) {
          const dongNames = await fetchDongNames(data.sidoName, data.gugunName)
          setDongNames(dongNames)
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    const getHealthReports = async () => {
      try {
        const healthReports = await fetchHealthReports()
        setHealthReports(healthReports)

        // 차트 데이터 준비
        const chartData = healthReports.map((report: any) => ({
          date: report.checkupDate, // X축에 표시될 날짜
          score: report.checkupScore, // Y축에 표시될 점수
        }))
        setChartData(chartData)
      } catch (error) {
        console.error('Error fetching health reports:', error)
      }
    }

    getUserInfo()
    getHealthReports()
  }, [])

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click() // 이미지 클릭 시 파일 입력 창 열기
    }
  }
  const handleDeleteImage = () => {
    setIsImageDeleted(true)
    setPreviewUrl(null) // previewUrl을 null로 설정하여 이미지 삭제
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      image: null,
      profileUrl: 'null', // 서버로 "null" 값 전송
    }))
  }
  const handleInputChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement
    const { name, value, files } = target

    if (name === 'image' && files && files[0]) {
      const imageFile = files[0]
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        image: imageFile,
        profileUrl: URL.createObjectURL(imageFile),
      }))
      setPreviewUrl(URL.createObjectURL(imageFile))
      setIsImageDeleted(false)
    } else {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        [name]: value,
      }))

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
          const gugunNames = await fetchGugunNames(value)
          setGugunNames(gugunNames)
          setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            sidoName: value,
            gugunName: '',
            dongName: '',
          }))
          setDongNames([]) // 구/군 선택 전 동 목록 초기화
        } catch (error) {
          console.error('구/군 목록을 가져오는 중 오류 발생:', error)
        }
      }

      if (name === 'gugunName') {
        try {
          const dongNames = await fetchDongNames(userInfo.sidoName, value)
          setDongNames(dongNames)
          setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            gugunName: value,
            dongName: '',
          }))
        } catch (error) {
          console.error('동 목록을 가져오는 중 오류 발생:', error)
        }
      }
    }
  }

  const handleUpdateUserInfo = async () => {
    try {
      const profileUrlToUpdate = isImageDeleted
        ? 'null' // 이미지가 삭제된 경우
        : userInfo.image // 새로운 이미지가 있는 경우
          ? userInfo.profileUrl
          : initialProfileUrl // 이미지 수정이 없으면 기존 프로필 URL 유지

      const updatedUserInfo = {
        ...userInfo,
        profileUrl: profileUrlToUpdate,
      }

      await updateUserInfo(updatedUserInfo)
      // alert('정보가 성공적으로 수정되었습니다.')
      setIsModalOpen(true)
      setIsEditing(false)

      const data = await fetchUserInfo()
      setPreviewUrl(data.profileUrl)
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        profileUrl: data.profileUrl,
        image: null, // 이미지를 초기화
      }))
      setInitialProfileUrl(data.profileUrl) // 최신 프로필 URL을 초기값으로 갱신
      setIsImageDeleted(false) // 이미지 삭제 상태 초기화
    } catch (error) {
      console.error('Error updating user info:', error)
      alert('정보 수정에 실패했습니다.')
    }
  }

  const scoreDescription = getScoreMessage(userInfo.checkupScore)

  const handleEditClick = async () => {
    if (isEditing) {
      await handleUpdateUserInfo() // 수정 모드에서 나올 때 정보 업데이트
    }
    setIsEditing(!isEditing)
  }

  const handleChartClick = (data: any) => {
    if (data && data.activeLabel && data.activePayload) {
      const selectedDate = data.activeLabel
      const selectedScore = data.activePayload[0].value
      setSelectedResult({ date: selectedDate, score: selectedScore })
    }
  }

  return (
    <>
      <div className={styles.div} style={{ marginTop: 'calc(9/16*100vw*0.1)' }}>
        <div className={styles.InfoBox}>
          <div className={styles.child}>
            <div className={styles.item} onClick={handleImageClick}>
              {previewUrl ? (
                <div className={styles.imageWrapper}>
                  <img src={previewUrl} alt="미리보기 이미지" />
                  {isEditing && previewUrl && (
                    <button
                      className={styles.deleteButton}
                      onClick={handleDeleteImage}
                    >
                      X
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.placeholder}>이미지를 첨부하세요</div>
              )}
            </div>
            <input
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png"
              ref={fileInputRef}
              onChange={handleInputChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className={styles.frameParent}>
            {isEditing ? (
              <div>
                <div className={styles.categoryContainer}>
                  <label htmlFor="email" className={styles.categoryTitle}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    className={`${styles.inputField} ${emailValid === false ? styles.inputError : ''}`}
                    placeholder="이메일"
                    id="email"
                  />
                  {emailValid === false && (
                    <div className={styles.error}>이메일이 중복됩니다.</div>
                  )}
                </div>

                <div className={styles.categoryContainer}>
                  <label htmlFor="name" className={styles.categoryTitle}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userInfo.name}
                    onChange={handleInputChange}
                    className={styles.inputField}
                    placeholder="이름"
                    id="name"
                  />
                </div>

                <div className={styles.categoryContainer}>
                  <label htmlFor="nickname" className={styles.categoryTitle}>
                    Nickname
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={userInfo.nickname}
                    onChange={handleInputChange}
                    className={`${styles.inputField} ${nicknameValid === false ? styles.inputError : ''}`}
                    placeholder="닉네임"
                    id="nickname"
                  />
                  {nicknameValid === false && (
                    <div className={styles.error}>닉네임이 중복됩니다.</div>
                  )}
                </div>

                <div className={styles.categoryContainer}>
                  <label htmlFor="birthday" className={styles.categoryTitle}>
                    Birthday
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={userInfo.birthday}
                    onChange={handleInputChange}
                    className={styles.inputField}
                    id="birthday"
                  />
                </div>

                <div className={styles.categoryContainer}>
                  <label htmlFor="sidoName" className={styles.categoryTitle}>
                    시/도
                  </label>
                  <select
                    name="sidoName"
                    value={userInfo.sidoName}
                    onChange={handleInputChange}
                    className={styles.inputField}
                    id="sidoName"
                  >
                    <option value="">시/도 선택</option>
                    {sidoNames.map((sido) => (
                      <option key={sido} value={sido}>
                        {sido}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryTitle}>Email</div>
                  <div className={styles.categoryContent}>{userInfo.email}</div>
                </div>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryTitle}>Name</div>
                  <div className={styles.categoryContent}>{userInfo.name}</div>
                </div>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryTitle}>Nickname</div>
                  <div className={styles.categoryContent}>
                    {userInfo.nickname}
                  </div>
                </div>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryTitle}>Birthday</div>
                  <div className={styles.categoryContent}>
                    {userInfo.birthday}
                  </div>
                </div>
                <div className={styles.categoryContainer}>
                  <div className={styles.categoryTitle}>Address</div>
                  <div className={styles.categoryContent}>
                    {userInfo.sidoName} {userInfo.gugunName} {userInfo.dongName}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.buttonContainer}>
              <div
                className={`${styles.container} ${styles.buttonStyle}`}
                onClick={handleEditClick}
              >
                <div>{isEditing ? '저장' : '정보 수정'}</div>
              </div>
              <div
                className={`${styles.container} ${styles.buttonStyle}`}
                onClick={openPasswordModal}
              >
                <div className={styles.div6}>비밀번호 변경</div>
              </div>
            </div>
          </div>
          <div className={styles.inner} />
          <div className={styles.div4}>마이페이지</div>
        </div>

        {/* 결과 및 차트 */}
        <div className={styles.rectangleDiv}>
          <div className={styles.resultContainer}>
            <div className={styles.div10}>검사 결과</div>
            <div className={styles.div8}>
              {selectedResult ? selectedResult.date : userInfo.checkupDate}의
              점수
            </div>
            <div className={styles.div11}>
              <span className={styles.span}>
                {selectedResult ? selectedResult.score : userInfo.checkupScore}
              </span>
              <span className={styles.span1}>점</span>
            </div>
            <div className={styles.div12}>
              검사 소견
              <br />
              <br />
              {getScoreMessage(
                selectedResult ? selectedResult.score : userInfo.checkupScore
              )}
            </div>
          </div>
        </div>

        <div className={styles.child1} />
        <div className={styles.div66}>
          <b>{userInfo.sidoName} </b>
          <b>{userInfo.gugunName}</b>
          <span>에 있는 정신건강의학과</span>
        </div>
        <div className={styles.mapWrapper}>
          <HospitalMap lat={location.lat} lng={location.lng} />
        </div>

        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              onClick={handleChartClick} // 차트 클릭 이벤트 추가
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 60]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onRequestClose={closePasswordModal}
        onSuccess={handlePasswordChangeSuccess}
      />
      {isModalOpen && (
        <Modal
          title="회원 정보 변경"
          content="회원 정보가 성공적으로 변경되었습니다."
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

export default MyPage
