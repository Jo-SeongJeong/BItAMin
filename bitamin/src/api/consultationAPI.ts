import axiosInstance from 'api/axiosInstance'
import {
  RoomSearch,
  Consultation,
  ConsultationList,
  RoomData,
  JoinConsultation,
  ChatGPTRequest,
  ChatGPTResponse,
  Message,
  RoomData1,
} from 'ts/consultationType'
import { WebSocketService } from 'api/WebSocketService'

type JoinData = Pick<
  Consultation,
  'id' | 'isPrivated' | 'password' | 'startTime' | 'sessionId'
>

// 상담 목록을 가져오는 함수
export const fetchConsultations = async (roomSearch: RoomSearch) => {
  try {
    const response = await axiosInstance.get<ConsultationList>(
      '/consultations',
      {
        params: {
          page: roomSearch.page,
          size: roomSearch.size,
          type: roomSearch.type,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching consultations:', error)
    throw error
  }
}

// 방을 생성하는 함수
export const createRoom = async (roomData: RoomData) => {
  try {
    const response = await axiosInstance.post<Consultation>(
      '/consultations',
      roomData
    )
    return response.data
  } catch (error) {
    console.error('Error creating room:', error)
    throw error
  }
}

// 특정 방에 참여하는 함수
export const joinRoom = async (joinData: JoinData) => {
  try {
    const response = await axiosInstance.post<JoinConsultation>(
      '/consultations/participants',
      joinData
    )

    // // 방에 성공적으로 참여한 후 WebSocket 구독을 시작
    // const consultationId = response.data.id // 참여한 방의 ID
    // const webSocketService = new WebSocketService() // WebSocketService 인스턴스 생성
    // webSocketService.activate() // WebSocket 연결 활성화
    // setTimeout(() => {
    //   webSocketService.subscribeToTopic(
    //     `/sub/consultations/${consultationId}`,
    //     (message) => {
    //       console.log('Received message in joinRoom:', message)
    //       // 여기서 받은 메시지를 처리하는 로직을 추가할 수 있음
    //     }
    //   )
    // }, 5000);

    return response.data
  } catch (error) {
    console.error('Error joining room:', error)
    throw error
  }
}

// 랜덤 방에 참여하는 함수
export const joinRandomRoom = async (type: string) => {
  try {
    const response = await axiosInstance.post<JoinConsultation>(
      '/consultations/random-participants',
      { type }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching random participants:', error)
    throw error
  }
}

export const getRoomData = async (consultationId: number) => {
  try {
    const response = await axiosInstance.get<RoomData1>(
      `/consultations/${consultationId}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching room data:', error)
    throw error
  }
}

// ChatGPT 메시지를 보내는 함수
export const sendChatGPTMessage = async (
  user: string,
  content: string,
  category: string,
  consultationId: number,
  previousMessages: Message[]
) => {
  try {
    const requestData: ChatGPTRequest = {
      gptCompletions: {
        [user]: {
          messages: [...previousMessages, { role: 'user', content }],
        },
      },
    }

    const response = await axiosInstance.post<ChatGPTResponse>(
      `/consultations/moderators/${category}/${consultationId}`,
      requestData
    )

    return response.data
  } catch (error) {
    console.error('Error sending message to ChatGPT:', error)
    throw error
  }
}

export const leaveConsultation = async (consultationId: number) => {
  try {
    const response = await axiosInstance.delete(
      `consultations/${consultationId}`
    )
    return response
  } catch (error) {
    console.error('Error Leaving Consultation', error)
    throw error
  }
}
