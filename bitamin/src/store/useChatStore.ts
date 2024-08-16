import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sendChatGPTMessage } from 'api/consultationAPI'
import { ChatLog, Message } from 'ts/consultationType'

interface ChatState {
  exChatLog: ChatLog // 기존 ChatLog를 exChatLog로 변경
  chatLog: ChatLog // STT 텍스트와 새로운 메시지를 저장할 새로운 ChatLog
  sendMessage: (
    user: string,
    content: string,
    category: string,
    consultationId: number
  ) => Promise<void>
  resetChatLog: () => void
  saveSttText: (user: string, text: string) => void // STT 텍스트 저장 메서드
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      exChatLog: {}, // 초기 exChatLog 상태
      chatLog: {}, // 초기 chatLog 상태

      sendMessage: async (
        user: string,
        content: string,
        category: string,
        consultationId: number
      ) => {
        try {
          const currentChatLog = get().chatLog

          const userMessages: Message[] = currentChatLog[user]?.messages || []

          const userMessage: Message = {
            role: 'user',
            content,
          }

          // GPT API로 메시지 전송
          const response = await sendChatGPTMessage(
            user,
            content,
            category,
            consultationId,
            userMessages
          )

          const assistantMessage: Message = {
            role: 'assistant',
            content: response.gptResponses[user].content,
          }

          // 채팅 로그 업데이트
          set((state) => ({
            chatLog: {
              ...state.chatLog,
              [user]: {
                userId: user,
                messages: [...userMessages, userMessage, assistantMessage],
              },
            },
          }))

          // TTS 기능으로 응답 음성 재생
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(
              assistantMessage.content
            )
            utterance.lang = 'ko-KR'
            speechSynthesis.speak(utterance)
          } else {
            console.error('TTS를 지원하지 않는 브라우저입니다.')
          }
        } catch (error) {
          console.error('Failed to send message to ChatGPT:', error)
          throw error
        }
      },

      resetChatLog: () => {
        set({ chatLog: {} })
      },

      saveSttText: (user: string, text: string) => {
        set((state) => {
          const userMessages = state.chatLog[user]?.messages || []
          const newMessage: Message = {
            role: 'user',
            content: text,
          }

          return {
            chatLog: {
              ...state.chatLog,
              [user]: {
                userId: user,
                messages: [...userMessages, newMessage],
              },
            },
          }
        })

        console.log(`STT Text saved for ${user}: ${text}`)
      },
    }),
    {
      name: 'chat-log-storage',
    }
  )
)
