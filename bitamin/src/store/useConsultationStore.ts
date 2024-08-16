import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  RoomSearch,
  Consultation,
  ConsultationList,
  CreateConsultation,
  JoinConsultation,
  ChatLog,
  Participant,
  RoomData1,
} from 'ts/consultationType'
import {
  fetchConsultations,
  joinRoom,
  joinRandomRoom,
  createRoom,
  sendChatGPTMessage,
  leaveConsultation,
  getRoomData,
} from 'api/consultationAPI'
import { WebSocketService } from 'api/WebSocketService'
import { MenuList } from '@material-ui/core'

// Consultation List 상태 관리
interface ConsultationState {
  ConsultationList: ConsultationList | null
  fetchConsultations: (roomSearch: RoomSearch) => Promise<void>
}

export const fetchConsultationList = create<ConsultationState>()(
  persist(
    (set) => ({
      ConsultationList: null,

      fetchConsultations: async (roomSearch: RoomSearch) => {
        try {
          const data = await fetchConsultations(roomSearch)
          set({
            ConsultationList: {
              consultationList: data.consultationList, // 여기서 ConsultationList를 반환합니다.
              page: data.page,
              size: data.size,
              totalElements: data.totalElements,
              totalPages: data.totalPages,
            },
          })
        } catch (error) {
          console.error('Failed to fetch consultations:', error)
        }
      },
    }),
    {
      name: 'consultationList-storage',
    }
  )
)

// 방 참여 상태 관리
type JoinData = Pick<
  Consultation,
  'id' | 'isPrivated' | 'password' | 'startTime' | 'sessionId'
> & {
  password: string
}

interface JoinConsultationState {
  joinconsultation: JoinConsultation | null
  roomData: RoomData1 | null
  joinRoom: (joinData: JoinData) => Promise<JoinConsultation>
  resetConsultation: () => void
  setJoinConsultation: (consultation: JoinConsultation | null) => void
}

export const joinConsultation = create<JoinConsultationState>()(
  persist(
    (set) => ({
      joinconsultation: null,
      roomData: null,

      joinRoom: async (joinData: JoinData) => {
        try {
          const consultation = await joinRoom(joinData)
          const consultationId = consultation.consultationId // 참여한 방의 ID
          const webSocketService = new WebSocketService() // WebSocketService 인스턴스 생성
          webSocketService.activate() // WebSocket 연결 활성화

          console.log(1111)
          // 주제를 구독하고 메시지를 처리하는 로직을 추가합니다.
          setTimeout(() => {
            webSocketService.subscribeToTopic(
              `/sub/consultations/${consultationId}`,
              (message) => {
                console.log('Received message in joinRoom:', message)

                // 여기서 받은 메시지를 처리하는 로직을 추가할 수 있습니다.
                // 예를 들어, 메시지를 UI에 표시하거나 알림을 띄울 수 있습니다.
                if (message.type === 'USER_JOINED') {
                  console.log(`${message.content}님이 입장하셨습니다.`)
                  // UI 업데이트 로직 추가
                }
              }
            )
          }, 5000)

          // set({ joinconsultation: consultation, roomData })
          set({ joinconsultation: consultation })

          return consultation
        } catch (error) {
          console.error('Failed to join room:', error)
          throw error
        }
      },

      resetConsultation: () => {
        set({ joinconsultation: null })
      },

      setJoinConsultation: (consultation: JoinConsultation | null) => {
        set({ joinconsultation: consultation })
      },
    }),
    {
      name: 'consultation-storage',
    }
  )
)

interface getRoomDataState {
  consultationId: number | null
  roomData: RoomData1 | null
  getRoom: (consultationId: number) => Promise<void>
}

export const fetchRoomData = create<getRoomDataState>()(
  persist(
    (set) => ({
      consultationId: null,
      roomData: null,

      getRoom: async (consultationId: number) => {
        try {
          const response = await getRoomData(consultationId)
          set({
            roomData: response,
          })

          console.log(response)
        } catch (error) {
          console.error('Failed to fetch roomData:', error)
        }
      },
    }),
    {
      name: 'consultationList-storage',
    }
  )
)

// 방 생성 상태 관리
interface CreateRoomState {
  createdRoom: Consultation | null
  createRoom: (
    roomData: CreateConsultation
  ) => Promise<Consultation | undefined>
  resetCreatedRoom: () => void
}

export const useCreateRoom = create<CreateRoomState>()(
  persist(
    (set) => ({
      createdRoom: null,

      createRoom: async (roomData: CreateConsultation) => {
        try {
          const createdRoom = await createRoom(roomData)
          set({ createdRoom })
          return createdRoom
        } catch (error) {
          console.error('Failed to create room:', error)
          return undefined
        }
      },

      resetCreatedRoom: () => {
        set({ createdRoom: null })
      },
    }),
    {
      name: 'consultation-storage',
    }
  )
)

// 랜덤 방 참여 상태 관리
interface joinRandomRoomState {
  type: string | null
  joinconsultation: JoinConsultation | null
  joinRandomRoom: (type: string) => Promise<JoinConsultation>
}

export const useJoinRandomRoom = create<joinRandomRoomState>()(
  persist(
    (set) => ({
      type: null,
      joinconsultation: null,
      joinRandomRoom: async (type: string) => {
        try {
          const response = await joinRandomRoom(type)

          // const roomData = await getRoomData(response.id)
          set({ joinconsultation: response })
          // set({ joinconsultation: response, roomData })
          return response
        } catch (error) {
          console.error('Failed to join room:', error)
          throw error
        }
      },
    }),
    { name: 'consultation-storage' }
  )
)

// GPT 메시지 상태 관리
interface ChatState {
  chatLog: ChatLog
  sendMessage: (
    user: string,
    content: string,
    category: string,
    count: number,
    consultationId: number
  ) => Promise<void>
  resetChatLog: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatLog: {},

      sendMessage: async (
        user: string,
        content: string,
        category: string,
        count: number,
        consultationId: number
      ) => {
        try {
          const currentChatLog = get().chatLog

          const userMessages = currentChatLog[user]?.messages || []

          const userMessage = {
            role: 'user' as const,
            content,
          }

          const response = await sendChatGPTMessage(
            user,
            content,
            category,
            consultationId,
            userMessages
          )

          const assistantMessage = {
            role: 'assistant' as const,
            content: response.gptResponses[user].content,
          }

          set((state) => ({
            chatLog: {
              ...state.chatLog,
              [user]: {
                userId: user,
                messages: [...userMessages, userMessage, assistantMessage],
              },
            },
          }))
        } catch (error) {
          console.error('Failed to send message to ChatGPT:', error)
          throw error
        }
      },

      resetChatLog: () => {
        set({ chatLog: {} })
      },
    }),
    {
      name: 'chat-log-storage',
    }
  )
)

export const leaveConsultationAndReset = async (consultationId: number) => {
  try {
    // API 호출
    const response = await leaveConsultation(consultationId)

    // API 호출 성공 시 상태 초기화
    const { resetConsultation } = joinConsultation.getState()
    resetConsultation()

    return response
  } catch (error) {
    console.error('Error Leaving Consultation and Resetting Store', error)
    throw error
  }
}
