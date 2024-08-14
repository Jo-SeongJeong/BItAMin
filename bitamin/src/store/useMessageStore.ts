import create from 'zustand'

interface Participant {
  id: number
  memberId: number
  memberNickname: string
  consultationId: number
  consultationDate: string
}

interface ParticipantStore {
  participants: Participant[]
  setParticipants: (participants: Participant[]) => void
}

const useParticipantStore = create<ParticipantStore>((set) => ({
  participants: [],
  setParticipants: (participants) => set({ participants }),
}))

export default useParticipantStore
