import React, { useState } from 'react'

interface PasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (password: string) => void
  error?: string // 에러 메시지를 받을 수 있도록 수정
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  error,
}) => {
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    if (password.trim()) {
      onSubmit(password)
    } else {
      alert('비밀번호를 입력해주세요.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex flex-col items-center">
          <div className="bg-orange-400 p-2 rounded-full mb-4">
            <i className="fas fa-lock text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-semibold mb-4">비밀방 입장</h1>
          <p className="text-gray-700 mb-6">비밀번호를 입력해주세요.</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          placeholder="비밀번호"
          required
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}{' '}
        {/* 에러 메시지 추가 */}
        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 bg-orange-500 text-white rounded-lg font-semibold"
          >
            입장하기
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

export default PasswordModal
