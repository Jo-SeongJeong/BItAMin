import React, { useState } from 'react'

interface RandomConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  onJoin: (type: string) => void
}

const RandomConsultationModal: React.FC<RandomConsultationModalProps> = ({
  isOpen,
  onClose,
  onJoin,
}) => {
  const [selectedType, setSelectedType] = useState<string>('전체')

  if (!isOpen) return null

  const handleJoin = () => {
    onJoin(selectedType)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
          <img
            src="your-image-path.png"
            alt="Random Consultation"
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold">랜덤 상담</h2>
        </div>

        <div className="flex justify-center space-x-2 mb-4">
          {['전체', '독서', '영화', '그림', '음악', '대화'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`py-1 px-3 rounded-full ${
                selectedType === type
                  ? 'bg-orange-400 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">입장하시겠습니까?</div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleJoin}
            className="py-2 px-6 bg-orange-500 text-white rounded-lg"
          >
            바로 가기
          </button>
          <button
            onClick={onClose}
            className="py-2 px-6 bg-gray-200 text-gray-700 rounded-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default RandomConsultationModal
