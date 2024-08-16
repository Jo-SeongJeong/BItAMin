import React, { useEffect, useState } from 'react'
import styles from '/src/styles/mission/Modal.module.css'
import { fetchMissionsByDate, fetchMissionById } from '@/api/missionAPI'

interface ModalProps {
  showModal: boolean
  handleClose: () => void
  completeDate?: string // 날짜로 검색할 경우
  missionId?: number // ID로 검색할 경우
}

const MissionModal: React.FC<ModalProps> = ({ showModal, handleClose, completeDate, missionId }) => {
  const [missionDescription, setMissionDescription] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMissionData = async () => {
      try {
        setLoading(true)
        setError(null)
        let missionData;

        if (completeDate) {
          missionData = await fetchMissionsByDate(completeDate)
        } else if (missionId) {
          missionData = await fetchMissionById(missionId)
        }

        if (missionData && missionData.data) {
          setMissionDescription(missionData.data.missionDescription)
        } else {
          setMissionDescription('기다려주세요..')
        }
      } catch (error) {
        setError('미션 데이터를 불러오는 중 오류가 발생했습니다.')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (showModal) {
      fetchMissionData()
    }
  }, [showModal, completeDate, missionId])

  if (!showModal) {
    return null
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.missionTitleWithImage}>미션 설명</h2>

        {loading && <p>로딩 중...</p>}
        {missionDescription && <p>{missionDescription}</p>}
        {error && <p>{error}</p>}
        <button onClick={handleClose}>닫기</button>
      </div>
    </div>
  )
}

export default MissionModal
