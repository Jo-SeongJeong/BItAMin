import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { joinConsultation, useCreateRoom } from 'store/useConsultationStore'
import { CreateConsultation, JoinData } from 'ts/consultationType'

interface CreateRoomPageProps {
  onClose: () => void // 모달을 닫기 위한 onClose prop
}

const CreateRoomPage: React.FC<CreateRoomPageProps> = ({ onClose }) => {
  const [category, setCategory] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [isPrivated, setIsPrivated] = useState<number>(0)
  const [password, setPassword] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [selectedMinutes, setSelectedMinutes] = useState<number>(1)

  const navigate = useNavigate()

  const { createRoom } = useCreateRoom()
  const { joinRoom, setJoinConsultation } = joinConsultation((state) => ({
    joinRoom: state.joinRoom,
    setJoinConsultation: state.setJoinConsultation,
  }))

  const getDefaultStartTime = (): string => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + selectedMinutes)
    now.setHours(now.getHours() + 9)
    return now.toISOString().slice(0, 16)
  }

  const getDefaultEndTime = (startTime: string): string => {
    const start = new Date(startTime)
    start.setHours(start.getHours() + 11) // 2시간 후
    return start.toISOString().slice(0, 16)
  }

  const formatStartTime = (time: string): string => {
    const date = new Date(time)
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`
  }

  useEffect(() => {
    const defaultStartTime = getDefaultStartTime()
    setStartTime(defaultStartTime)
    setEndTime(getDefaultEndTime(defaultStartTime))
  }, [selectedMinutes])

  const handleSubmit = async () => {
    if (!category) {
      alert('상담 카테고리를 선택해주세요.')
      return
    }

    const roomData: CreateConsultation = {
      category,
      title,
      isPrivated,
      password: isPrivated === 1 ? password : '',
      startTime,
      endTime,
    }

    try {
      const createdRoom = await createRoom(roomData)
      if (createdRoom) {
        const joinData: JoinData = {
          id: createdRoom.id,
          isPrivated: createdRoom.isPrivated,
          password: createdRoom.isPrivated ? password : '',
          startTime: createdRoom.startTime,
          sessionId: createdRoom.sessionId,
        }
        const consultation = await joinRoom(joinData)
        if (consultation) {
          setJoinConsultation(consultation)
          navigate('/consult')
        }
      } else {
        console.error('Failed to create the room.')
      }
    } catch (error) {
      console.error('Failed to create or join room:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-4">새로운 방 생성</h1>
        <p className="text-gray-600 mb-6">상담 가능 시간 06:00 ~ 21:00</p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <div className="mb-4">
            <label className="block font-medium mb-2">상담 카테고리</label>
            <div className="flex space-x-2">
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

          <div className="mb-4">
            <label className="block font-medium mb-2">방 이름</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="방 이름을 입력하세요"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">분 선택</label>
            <select
              value={selectedMinutes}
              onChange={(e) => setSelectedMinutes(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((minute) => (
                <option key={minute} value={minute}>
                  {minute}분
                </option>
              ))}
            </select>
            <p className="text-gray-700 mb-4">
              시작 시간: {formatStartTime(startTime)}
            </p>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">비밀방 여부</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isPrivated === 1}
                onChange={(e) => setIsPrivated(e.target.checked ? 1 : 0)}
                className="h-5 w-5 text-orange-500"
              />
              <span className="text-gray-700">비밀방으로 설정</span>
            </div>
            {isPrivated === 1 && (
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 border border-gray-300 rounded-lg p-2"
                placeholder="비밀번호를 입력하세요"
                required
              />
            )}
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="flex-1 py-2 bg-orange-500 text-white rounded-lg font-semibold"
            >
              새 상담 예약하기
            </button>
            <button
              type="button"
              onClick={onClose} // 모달을 닫습니다.
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRoomPage
