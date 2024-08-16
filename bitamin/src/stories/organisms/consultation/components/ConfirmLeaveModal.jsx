import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmLeaveModal from './ConfirmLeaveModal' // 모달 컴포넌트 가져오기
import { leaveConsultationAndReset } from '../../../../store/useConsultationStore'

const App = ({ consultationId }) => {
  const navigate = useNavigate()
  const isNavigation = useRef(false)
  const [showModal, setShowModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  useEffect(() => {
    const unlisten = navigate(() => {
      isNavigation.current = true // 페이지 이동이 발생했음을 기록
      setShowModal(true) // 모달을 표시
      setPendingAction(() => () => navigate(1)) // 사용자가 나가기로 확인한 후 실행할 작업
    })

    const handleBeforeUnload = (event) => {
      if (!isNavigation.current) {
        setShowModal(true) // 새로고침인 경우 모달을 표시
        setPendingAction(() => () => window.location.reload()) // 새로고침을 실행
        event.preventDefault()
        event.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      unlisten()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [navigate])

  const handleConfirmLeave = async () => {
    try {
      await leaveConsultationAndReset(consultationId) // API 호출
      if (pendingAction) pendingAction() // 대기 중인 동작(페이지 이동 또는 새로고침) 실행
    } catch (error) {
      console.error('Failed to leave consultation', error)
    } finally {
      setShowModal(false) // 모달 숨기기
    }
  }

  const handleCancelLeave = () => {
    setShowModal(false)
    isNavigation.current = false // 페이지 이동을 취소
  }

  return (
    <div>
      <h1>My React App</h1>
      {showModal && (
        <ConfirmLeaveModal
          onConfirm={handleConfirmLeave}
          onCancel={handleCancelLeave}
        />
      )}
    </div>
  )
}

export default App
