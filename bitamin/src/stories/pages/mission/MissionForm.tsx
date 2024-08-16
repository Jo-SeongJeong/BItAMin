import React, { useEffect, useState, useRef } from 'react'
import { useMissionStore } from '@/store/useMissionStore'
import { submitMission } from '@/api/missionAPI'
import { getMemberPhraseByDate } from '@/api/phraseAPI'
import emptyimg from '@/assets/missionImage/emptyImg.png'
import deleteimg from '@/assets/missionImage/deleteImg.png'
import missionchange from '@/assets/missionImage/missionchange.png'
import styles from '/src/styles/mission/MissionPage.module.css'
import missionDescriptionImg from '@/assets/missionImage/missionDescriptionImg.png';
import MissionModal from './MissionModal';

interface MissionFormProps {
  onMissionComplete: () => void; // 콜백 함수 정의
}

const MissionForm: React.FC<MissionFormProps> = ({ onMissionComplete }) => {
  const { mission, substituteCount, fetchMission, handleSubstituteMission } = useMissionStore()
  const [missionReview, setMissionReview] = useState<string>('')
  const [missionImage, setMissionImage] = useState<File | null>(null)
  const [missionImagePreview, setMissionImagePreview] = useState<string | null>(null)
  const [phraseUrl, setPhraseUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [completeDate, setCompleteDate] = useState<Date | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedMissionId, setSelectedMissionId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    fetchMission()
    setCompleteDate(new Date())

    const fetchPhrase = async () => {
      const todayDate = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\. /g, '-').replace('.', '');
      try {
        const phraseResponse = await getMemberPhraseByDate(todayDate)
        if (phraseResponse.success) {
          setPhraseUrl(phraseResponse.data.phraseUrl)
        }
      } catch (err) {
        console.error('Failed to fetch phrase:', err)
      }
    }

    fetchPhrase()
  }, [fetchMission])

  const handleMissionSubmit = async () => {
    if (!mission || !missionImage) {
      alert('리뷰와 이미지를 모두 입력해야 합니다.')
      return
    }

    try {
      setLoading(true)
      const completeDateStr = completeDate?.toISOString().split('T')[0]
      const formData = new FormData()
      formData.append('memberMissionRequest', JSON.stringify({
        missionReview,
        completeDate: completeDateStr,
        missionId: mission.id,
      }))
      formData.append('missionImage', missionImage)

      const response = await submitMission(formData)
      if (response.success) {
        alert('미션이 성공적으로 제출되었습니다.')
        window.location.reload()
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError('미션을 제출하는 도중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setMissionImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMissionImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageDelete = () => {
    setMissionImage(null)
    setMissionImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = '' // 파일 입력을 초기화하여 다시 업로드할 수 있게 함
    }
  }

  const openModal = (missionId: number) => {
    setSelectedMissionId(missionId)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedMissionId(null)
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      {mission ? (
        <div className={styles.missionContainer2}>
          <h3 className={styles.missionTitleForm}>
            <div className={styles.missionDateForm}>
              {completeDate?.getDate()}일 미션
            </div>
            <div className={styles.missionNameForm}>
              {mission.missionName}
              <button onClick={() => openModal(mission.id)} className={styles.modalButton}>
                <img src={missionDescriptionImg} alt="정보 보기"
                     style={{ width: '24px', height: '24px', marginLeft: '15px' }} />
              </button>
            </div>
            <div className={styles.missionChange}>
              <img
                src={missionchange}
                alt="미션 교체하기"
                onClick={handleSubstituteMission}
                style={{
                  cursor: substituteCount >= 5 ? 'not-allowed' : 'pointer',
                  opacity: substituteCount >= 5 ? 0.5 : 1,
                }}
              />
            </div>

          </h3>
          <div className={styles.missionSubstituteInfo}>
            <p>미션 교체는 하루에 5번 가능합니다. (남은 횟수: {5 - substituteCount}번)</p>
          </div>
          <div className={styles.missionContent}>
            {missionImagePreview ? (
              <div className={styles.missionImagePreviewContainer}>
                <img
                  src={missionImagePreview}
                  alt="미션 이미지 미리보기"
                  className={styles.missionImagePreview}
                />
                <button onClick={handleImageDelete} className={styles.deleteButton}>
                  <img src={deleteimg} alt="삭제 이미지" />
                </button>
              </div>
            ) : (
              <img
                src={emptyimg}
                alt="미션 이미지 업로드"
                onClick={handleImageClick}
                className={styles.missionImageUp}
                style={{ cursor: 'pointer' }}
              />
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <textarea
              value={missionReview}
              onChange={(e) => setMissionReview(e.target.value)}
              placeholder="미션 리뷰를 입력하세요"
              className={styles.missionTextarea}
            />
          </div>

          <div className={styles.bottomRow}>
            {phraseUrl && (
              <audio controls className={styles.audioPlayer}>
                <source src={phraseUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}

            <button onClick={handleMissionSubmit} className={styles.saveButton}>저장</button>
          </div>
        </div>
      ) : (
        <p>미션이 없습니다.</p>
      )}

      {showModal && selectedMissionId && (
        <MissionModal
          showModal={showModal}
          handleClose={closeModal}
          missionId={selectedMissionId}
        />
      )}
    </div>
  )
}

export default MissionForm
