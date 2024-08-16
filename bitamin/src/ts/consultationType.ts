export interface RoomSearch {
  page: number | null
  size: number | null
  type: string | null
}

export interface Consultation {
  id: number
  category: string
  title: string
  isPrivated: number
  password?: string | null
  startTime: string
  endTime: string
  currentParticipants: number
  sessionId: string
}

export interface RandomJoin {
  type: string
}

export interface CurrentConsultaion {
  id: number
  isPrivated: number
  password?: string | null
  startTime: string
  sessionId: string
}

export interface JoinConsultation {
  consultationId: number
  sessionId: string
  token: string
  id: number
  memberId: number
  nickname: string
  profileUrl: string | null
  isPrivated?: boolean
  startTime: string
  password?: string // 이 부분을 추가합니다.
}

export interface CreateConsultation {
  category: string
  title: string
  isPrivated: number
  password?: string | null
  startTime: string
  endTime: string
}

export interface ConsultationList {
  consultationList: Omit<Consultation, 'password'>[] // 비밀번호 필드 제거
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type JoinData = Pick<
  Consultation,
  'id' | 'isPrivated' | 'startTime' | 'sessionId'
> & {
  password: string
}

export interface RoomData {
  category: string
  title: string
  isPrivated: number
  password?: string | null
  startTime: string
  endTime: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatEntry {
  userId: string
  messages: Message[]
}

export interface ChatLog {
  [userId: string]: ChatEntry
}

export interface ChatGPTRequest {
  gptCompletions: {
    [userId: string]: {
      messages: Message[]
    }
  }
}

export interface ChatGPTResponse {
  gptResponses: {
    [userId: string]: {
      role: 'assistant'
      content: string
    }
  }
}

export interface Participant {
  id: number
  memberId: number
  memberNickname: string
  consultationId: number
  consultationDate: string
  profileUrl: string
}

export interface RoomData1 {
  id: number
  category: string
  title: string
  isPrivated: boolean
  password: string
  startTime: string
  endTime: string
  currentParticipants: number
  participants: Participant[]
}
