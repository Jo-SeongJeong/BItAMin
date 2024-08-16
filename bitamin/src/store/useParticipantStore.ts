import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Participant {
  id: number
  memberId: number
  memberNickname: string
  consultationId: number
  consultationDate: string
}

interface ParticipantState {
  participants: Participant[]
  setParticipants: (participants: Participant[]) => void
  clearParticipants: () => void
}

const useParticipantStore = create<ParticipantState>()(
  persist(
    (set) => ({
      participants: [],
      setParticipants: (participants) => set({ participants }),
      clearParticipants: () => set({ participants: [] }),
    }),
    {
      name: 'participant-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useParticipantStore
