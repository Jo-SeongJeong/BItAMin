import React, { useState } from 'react'
import { changePassword } from '@/api/userAPI'
import styles from 'styles/account/MyPage.module.css'
import { useNavigate } from 'react-router-dom'

const PasswordChangePage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChangePassword = async () => {
    try {
      setError('')
      setSuccess('')

      // 비밀번호 변경 요청 객체
      const changePasswordRequest = {
        currentPassword,
        newPassword,
      }
      const response = await changePassword(changePasswordRequest)

      setSuccess('비밀번호가 성공적으로 변경되었습니다.')
      navigate('/my-page') // 비밀번호 변경 후 마이페이지로 이동
    } catch (error: any) {
      const errorMessage =
        error.response?.data || error.message || '비밀번호 변경에 실패했습니다.'
      setError(errorMessage)
    }
  }

  return (
    <div className={styles.container}>
      <h2>비밀번호 변경</h2>
      <div>
        <input
          type="password"
          placeholder="현재 비밀번호"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="새 비밀번호 확인"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      <button onClick={handleChangePassword}>비밀번호 변경</button>
    </div>
  )
}

export default PasswordChangePage
