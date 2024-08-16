import React, { useState } from 'react'
import Modal from 'react-modal'
import { changePassword } from '@/api/userAPI'
import styles from 'styles/account/Password.module.css'

// react-modal 설정
Modal.setAppElement('#root')

interface PasswordChangeModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSuccess: () => void // 성공 시 호출될 함수 추가
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ isOpen, onRequestClose, onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    try {
      setError('')
      setSuccess('')

      // 비밀번호 변경 요청 객체
      const changePasswordRequest = {
        currentPassword,
        newPassword,
      }
      await changePassword(changePasswordRequest)

      setSuccess('비밀번호가 성공적으로 변경되었습니다.')
      setTimeout(() => {
        onSuccess() // 성공 시 호출
        onRequestClose() // 모달 닫기
      }, 1000)
    } catch (error: any) {
      const errorMessage =
        error.response?.data || error.message || '비밀번호 변경에 실패했습니다.'
      setError(errorMessage)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.customModal}
      overlayClassName={styles.customOverlay}
    >
      <div className={styles.passwordChangeContainer}>
        <h2 className={styles.modalTitle}>비밀번호 변경</h2>
        <div className={styles.instructions}>
          <p>• 다른 아이디/사이트에서 사용한 적 없는 비밀번호</p>
          <p>• 이전에 사용한 적 없는 비밀번호가 안전합니다.</p>
        </div>
        <div className={styles.inputContainer}>
          <input
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputContainer}>
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputContainer}>
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.inputField}
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        <div className={styles.buttonContainer}>
          <button onClick={handleChangePassword} className={styles.confirmButton}>확인</button>
          <button onClick={onRequestClose} className={styles.cancelButton}>취소</button>
        </div>
      </div>
    </Modal>
  )
}

export default PasswordChangeModal
