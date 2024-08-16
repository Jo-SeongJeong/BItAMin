import React, { useState } from 'react'
import ReactModal from 'react-modal'
import { submitReport } from 'api/complaintsAPI' // API 서비스 불러오기

ReactModal.setAppElement('#root')

interface ReportUserModalProps {
  isOpen: boolean
  onRequestClose: () => void
  respondentId: string
}

const ReportUserModal: React.FC<ReportUserModalProps> = ({
  isOpen,
  onRequestClose,
  respondentId,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<number>(0)
  const [content, setContent] = useState<string>('')

  const handleCheckboxChange = (categoryBit: number) => {
    setSelectedCategories((prev) => prev ^ categoryBit)
  }

  const handleSubmit = async () => {
    try {
      await submitReport(respondentId, selectedCategories, content, 1) // 쪽지 신고(1)로 설정
      onRequestClose()
    } catch (error) {
      console.error('신고 접수 중 오류 발생:', error)
      alert('신고 접수에 실패하였습니다.')
    }
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="absolute inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <div className="bg-orange-500 p-4 rounded-t-lg">
          <h2 className="text-white text-xl">유저 신고하기</h2>
        </div>
        <div className="p-6">
          <p className="mb-4 text-gray-700">
            이 유저와 어떤 일이 있었는지 최대한 자세히 알려주세요. 해당하는 모든
            카테고리를 선택해주세요.
          </p>
          <div className="mb-4">
            <label className="block">
              <input
                type="checkbox"
                checked={Boolean(selectedCategories & 1)}
                onChange={() => handleCheckboxChange(1)}
                className="mr-2"
              />
              욕설 신고
            </label>
            <label className="block">
              <input
                type="checkbox"
                checked={Boolean(selectedCategories & 2)}
                onChange={() => handleCheckboxChange(2)}
                className="mr-2"
              />
              부적절한 단어 신고
            </label>
            <label className="block">
              <input
                type="checkbox"
                checked={Boolean(selectedCategories & 4)}
                onChange={() => handleCheckboxChange(4)}
                className="mr-2"
              />
              광고 신고
            </label>
          </div>
          <textarea
            className="w-full p-2 border rounded-md mb-4"
            placeholder="신고 사유를 입력해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              onClick={onRequestClose}
            >
              취소
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
            >
              신고하기
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

export default ReportUserModal
