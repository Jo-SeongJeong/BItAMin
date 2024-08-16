import { useState, useEffect, useCallback } from 'react'
import styles from 'styles/main/MainPage.module.css'
import mainConsultImg from 'assets/image/mainConsultImg.png'
import mainQuestImg from 'assets/image/mainQuestImg.png'
import mainImg from 'assets/image/mainImg.png'
import recordBackGroundImg from 'assets/image/recordBackgroundImg.png'
import recordStart from 'assets/image/mic.png'
import recordSave from 'assets/image/recordSave.png'
import recordStop from 'assets/image/recordEnd.png'
import recordAgain from 'assets/image/recordAgain.png'
import recordPlay from 'assets/image/recordPlay.png'
import clickme from 'assets/image/clickme.png'
import RecordModal from '@/stories/pages/main/RecordModal'
import { saveAudio } from '@/api/phraseAPI'
import { usePhraseStore } from '@/store/usePhraseStore'
import HeaderAfterLogin from '@/stories/organisms/common/HeaderAfterLogin'
import { useNavigate } from 'react-router-dom'
import { HealthReportCheck } from 'api/userAPI'
import CheckModal from '@/stories/organisms/CheckModal'
import useUserStore from '@/store/useUserStore'

const MainPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, fetchUser, loading, clearUserData } = useUserStore()

  const [isRecording, setIsRecording] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [media, setMedia] = useState<MediaRecorder | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [consultOpacityClass, setConsultOpacityClass] = useState(
    styles.transparent
  )
  const [questOpacityClass, setQuestOpacityClass] = useState(styles.transparent)
  const [isModalOpen, setIsModalOpen] = useState(false) // 모달 상태 추가

  const { phraseId, phraseContent, fetchPhrase, isSaved, setSaved } =
    usePhraseStore()

  useEffect(() => {
    fetchPhrase()
    fetchUser()
  }, [fetchPhrase])
  const [isCheckModalOpen, setCheckModalOpen] = useState(false)

  const closeCheckModal = () => {
    setCheckModalOpen(false)
  }

  const handleConfirm = async () => {
    // 확인 버튼 클릭 시의 로직
    closeCheckModal()
    navigate('/survey')
  }

  const handleSecondaryAction = () => {
    closeCheckModal()
  }

  useEffect(() => {
    const init = async () => {
      const result = await HealthReportCheck()
      if (result.result == 0) {
        setCheckModalOpen(true)
      }
    }

    init()
  }, [])
  const onRecAudio = () => {
    if (isSaved) return // 녹음이 저장되었을 경우 녹음 불가
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.addEventListener('dataavailable', (e) => {
          const blob = e.data
          setAudioBlob(blob)
          setIsRecording(false)
        })

        mediaRecorder.start()
        setMedia(mediaRecorder)
        setIsRecording(true)
        setIsEnded(false)
      })
      .catch(() => {
        alert('마이크 사용 권한을 허용해야 녹음을 진행할 수 있습니다.')
      })
  }

  const offRecAudio = () => {
    if (media) {
      media.stop()
      media.stream.getAudioTracks().forEach((track) => track.stop())
      setMedia(null)
    }
    setIsRecording(false)
    setIsEnded(true)
  }

  const onPlayAudio = useCallback(() => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob))
      audio.play()
    }
  }, [audioBlob])

  const onSaveAudio = async () => {
    if (phraseContent && audioBlob) {
      const formData = new FormData()
      formData.append(
        'memberPhraseRequest',
        new Blob(
          [
            JSON.stringify({
              phraseId: phraseId,
              saveDate: new Date().toISOString().split('T')[0],
            }),
          ],
          { type: 'application/json' }
        )
      )
      formData.append('phraseRecord', audioBlob)

      try {
        const response = await saveAudio(formData)
        alert('녹음이 성공적으로 저장되었습니다.')
        setSaved(new Date().toISOString().split('T')[0]) // 상태와 날짜 저장
      } catch (error) {
        console.error('녹음 저장 중 오류 발생:', error)
        alert('녹음 저장에 실패했습니다.')
      }
    } else {
      alert('녹음 파일이 없거나 문구 ID를 찾을 수 없습니다.')
    }
  }

  const onResetAudio = () => {
    if (isSaved) return // 녹음이 저장되었을 경우 리셋 불가
    setAudioBlob(null)
    setIsRecording(false)
    setIsEnded(false)
  }

  const onRecordClick = useCallback(() => {
    if (isRecording) {
      offRecAudio()
    } else {
      onRecAudio()
    }
  }, [isRecording])

  const onAgainClick = useCallback(() => {
    onResetAudio()
  }, [])

  const onPlayClick = useCallback(() => {
    onPlayAudio()
  }, [onPlayAudio])

  const onRectangleClick = useCallback(() => {}, [])

  const handleMouseEnterConsult = () => {
    setConsultOpacityClass(styles.opaque)
    document
      .querySelector(`.${styles.consultBorder}`)
      ?.classList.add(styles.glow)
  }

  const handleMouseLeaveConsult = () => {
    setConsultOpacityClass(styles.transparent)
    document
      .querySelector(`.${styles.consultBorder}`)
      ?.classList.remove(styles.glow)
  }

  const handleMouseEnterQuest = () => {
    setQuestOpacityClass(styles.opaque)
    document.querySelector(`.${styles.questBorder}`)?.classList.add(styles.glow)
  }

  const handleMouseLeaveQuest = () => {
    setQuestOpacityClass(styles.transparent)
    document
      .querySelector(`.${styles.questBorder}`)
      ?.classList.remove(styles.glow)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const onMissionClick = useCallback(() => {
    navigate('/mission')
  }, [navigate])

  const onconsultationClick = useCallback(() => {
    navigate('/consultationlist')
  }, [navigate])
  return (
    <>
      {isModalOpen && <RecordModal onClose={closeModal} />}
      <div className={styles.container}>
        <div className={styles.innerSection}>
          <img
            className={styles.mainImg}
            alt="Main Image"
            src={mainImg}
            onClick={openModal}
          />
          <img
            className={styles.clickmeImg}
            alt="Main Image"
            src={clickme}
            onClick={openModal}
          />
          <div className={styles.inner}>
            <div className={styles.div3}>
              <p className={styles.p}>{phraseContent}</p>
            </div>
          </div>
          <div className={styles.recordBtns}>
            <img
              className={styles.recordBtn}
              alt=""
              src={
                isRecording ? recordStop : isEnded ? recordPlay : recordStart
              }
              onClick={isEnded ? onPlayClick : onRecordClick}
            />
            {isEnded && !isSaved && (
              <>
                <img
                  className={styles.recordBtn}
                  alt=""
                  src={recordAgain}
                  onClick={onAgainClick}
                />
                <img
                  className={styles.recordBtn}
                  alt=""
                  src={recordSave}
                  onClick={onSaveAudio}
                />
              </>
            )}
          </div>
          <img
            className={styles.recordBackgroundImg}
            alt=""
            src={recordBackGroundImg}
          />
        </div>

        {/* 상담 섹션 */}
        <div
          className={`${styles.consultSection} cursor-pointer`}
          onMouseEnter={handleMouseEnterConsult}
          onMouseLeave={handleMouseLeaveConsult}
          onClick={onconsultationClick}
        >
          <div className={styles.consultBox} />
          <div className={styles.tryConsultBtn}>
            <b className={styles.b}>상담하기</b>
          </div>
          <img
            className={`${styles.mainConsultImg} ${consultOpacityClass}`}
            src={mainConsultImg}
            alt="Main Consult"
          />
          <div className={styles.consultBorder} />
        </div>

        {/* 미션 섹션 */}
        <div
          className={`${styles.questSection} cursor-pointer`}
          onMouseEnter={handleMouseEnterQuest}
          onMouseLeave={handleMouseLeaveQuest}
          onClick={onMissionClick}
        >
          <div className={styles.questBox} />
          <div className={styles.tryQuestBtn}>
            <b className={styles.b}>미션하기</b>
          </div>
          <div className={styles.questBorder} />
          <img
            className={`${styles.mainQuestImg} ${questOpacityClass}`}
            alt="Main Quest"
            src={mainQuestImg}
          />
        </div>
      </div>
      {isCheckModalOpen && (
        <CheckModal
          title="검사지 도착"
          content="이번 주 검사지 작성을 완료해주세요."
          iconSrc="fi.FiEdit"
          confirmText="바로 가기"
          onConfirm={handleConfirm}
          onClose={closeCheckModal}
          width="400px"
          height="300px"
          headerBackgroundColor="#FF713C"
          buttonBorderColor="#FF713C"
          buttonTextColor="#FF713C"
          secondaryButtonText="취소"
          onSecondaryAction={handleSecondaryAction}
        />
      )}
    </>
  )
}

export default MainPage
