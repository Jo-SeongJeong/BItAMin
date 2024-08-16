import React, { useState } from 'react'
import { createMessage } from 'api/messageAPI'
import Modal from '@/stories/organisms/Modal'

interface MessageModalProps {
  participant: {
    memberId: number
    memberNickname: string
  }
  onClose: () => void
}

const MessageModal: React.FC<MessageModalProps> = ({
  participant,
  onClose,
}) => {
  const [category, setCategory] = useState<string | null>(null) // 기본 카테고리
  const [title, setTitle] = useState('') // 쪽지 제목
  const [content, setContent] = useState('') // 쪽지 내용
  const [selectedDate, setSelectedDate] = useState<string>('') // 선택된 날짜
  const [selectedTime, setSelectedTime] = useState<string>('06:00') // 선택된 시간
  const [isModalOpen, setModalOpen] = useState<boolean>(false) // 모달 상태

  const closeModal = () => {
    setModalOpen(false)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!category) {
      alert('카테고리를 선택해주세요.')
      return
    }

    const counselingDate = `${selectedDate}T${selectedTime}`

    await createMessage({
      receiverId: participant.memberId,
      category,
      title,
      content,
      counselingDate,
    })

    setModalOpen(true)
  }

  // 내일부터의 날짜 가져오기
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(tomorrow.getHours() + 9)
  const minDate = tomorrow.toISOString().split('T')[0] // 내일의 날짜 (년-월-일)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          {participant.memberNickname}에게 쪽지 보내기
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 카테고리 선택 */}
          <div>
            <label className="block text-sm font-medium">카테고리</label>
            <div className="flex space-x-2 flex-nowrap">
              {['독서', '영화', '미술', '음악', '대화'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCategory(type)}
                  className={`py-2 px-4 rounded-full ${
                    category === type
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 입력 */}
          <div>
            <label className="block text-sm font-medium">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="제목을 입력하세요"
            />
          </div>

          {/* 내용 입력 */}
          <div>
            <label className="block text-sm font-medium">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="내용을 입력하세요"
            />
          </div>

          {/* 상담 날짜 선택 */}
          <div>
            <label className="block text-sm font-medium">상담 날짜</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              min={minDate} // 내일부터 날짜 선택 가능
            />
          </div>

          {/* 상담 시간 선택 */}
          <div>
            <label className="block text-sm font-medium">상담 시간</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              min="06:00"
              max="21:00" // 6시부터 21시까지만 시간 선택 가능
            />
          </div>

          {/* 전송 및 닫기 버튼 */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              disabled={!category} // 카테고리 선택이 안되어있으면 버튼 비활성화
            >
              전송
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              닫기
            </button>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <Modal
          title="쪽지가 전송되었습니다."
          content="쪽지가 성공적으로 전송되었습니다."
          iconSrc="ri.RiMailSendLine"
          onClose={closeModal}
          headerBackgroundColor="#FF713C"
          buttonBorderColor="#FF713C"
          buttonTextColor="#FF713C"
          imgColor="#333"
        />
      )}
    </div>
  )
}

export default MessageModal
