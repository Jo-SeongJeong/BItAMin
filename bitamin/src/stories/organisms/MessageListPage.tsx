import React, { useState, useEffect } from 'react'
import { fetchMessages, deleteMessage } from 'api/messageAPI'
import { useNavigate } from 'react-router-dom'
import Modal from '@/stories/organisms/Modal'
import CheckModal from '@/stories/organisms/CheckModal'
import mainQuestImg from 'assets/image/mainQuestImg.png'

interface Message {
  id: number
  nickname: string
  title: string
  sendDate: string
}

const MessageListPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null)
  const navigate = useNavigate()
  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const [isCheckModalOpen, setCheckModalOpen] = useState(false)
  const [toDeleteMessage, setToDeleteMessage] = useState<number>(0)

  const closeCheckModal = () => {
    setCheckModalOpen(false)
  }

  const handleConfirm = async () => {
    // 확인 버튼 클릭 시의 로직
    try {
      await deleteMessage(toDeleteMessage)
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== toDeleteMessage)
      )
      setModalOpen(true)
    } catch (error) {
      console.error('Failed to delete message:', error)
    } finally {
      closeCheckModal()
    }
  }

  const handleSecondaryAction = () => {
    closeCheckModal()
  }

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessages()

        // 날짜 형식 변환
        const formattedMessages = data.map((message: Message) => ({
          ...message,
          sendDate: formatDate(message.sendDate),
        }))
        setMessages(formattedMessages)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    }

    loadMessages()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  const handleDelete = async (id: number) => {
    setToDeleteMessage(id)
    setCheckModalOpen(true)
  }

  const handleMouseEnter = (id: number) => {
    setHoveredMessageId(id)
  }

  const handleMouseLeave = () => {
    setHoveredMessageId(null)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <div className="mx-auto" style={{ marginLeft: '20%', marginRight: '20%' }}>
      <ul className="space-y-2">
        {messages.map((message) => (
          <li
            key={message.id}
            className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer ${
              hoveredMessageId === message.id
                ? 'bg-green-500 text-white'
                : 'bg-white'
            }`}
            onMouseEnter={() => handleMouseEnter(message.id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate(`/messages/${message.id}`)}
          >
            <div className="flex items-center space-x-4">
              <img
                className="w-[4rem] h-[2.5rem] relative overflow-hidden shrink-0"
                alt=""
                src={mainQuestImg}
              />
              <span
                className={`font-semibold ${
                  hoveredMessageId === message.id
                    ? 'text-white'
                    : 'text-red-500'
                }`}
              >
                {message.nickname}
              </span>
              <span
                className={`${
                  hoveredMessageId === message.id
                    ? 'text-white'
                    : 'text-gray-800'
                }`}
              >
                {message.title}
              </span>
            </div>
            <div className="text-gray-500">{message.sendDate}</div>
            {hoveredMessageId === message.id && (
              <button
                className="ml-4 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(message.id)
                }}
              >
                삭제
              </button>
            )}
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <Modal
          title="쪽지가 삭제되었습니다."
          content="쪽지가 성공적으로 삭제되었습니다."
          iconSrc="src.alert"
          onClose={closeModal}
          headerBackgroundColor="#FF1B1B"
          buttonBorderColor="#FF1B1B"
          buttonTextColor="#FF1B1B"
          imgColor="#333"
          imgSize={100}
        />
      )}
      {isCheckModalOpen && (
        <CheckModal
          title="쪽지 삭제"
          content="정말 삭제하시겠습니까?"
          iconSrc="src.alert"
          confirmText="확인"
          onConfirm={handleConfirm}
          onClose={closeCheckModal}
          width="400px"
          height="300px"
          headerBackgroundColor="#FF1B1B"
          buttonBorderColor="#FF1B1B"
          buttonTextColor="#FF1B1B"
          secondaryButtonText="취소"
          onSecondaryAction={handleSecondaryAction}
        />
      )}
    </div>
  )
}

export default MessageListPage
