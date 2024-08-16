import create from 'zustand'
import { getPhrases } from '@/api/phraseAPI'

interface PhraseState {
  phraseId: number | null
  phraseContent: string
  isSaved: boolean
  lastSavedDate: string | null
  fetchPhrase: () => Promise<void>
  setSaved: (date: string) => void
  resetSaved: () => void
}

export const usePhraseStore = create<PhraseState>((set) => ({
  phraseId: null,
  phraseContent: '',
  isSaved: false,
  lastSavedDate: null,

  fetchPhrase: async () => {
    const today = new Date().toISOString().split('T')[0]
    const savedDate = localStorage.getItem('phraseDate')
    const savedPhraseId = localStorage.getItem('phraseId')
    const savedPhraseContent = localStorage.getItem('phraseContent')

    if (savedDate === today && savedPhraseId && savedPhraseContent) {
      set({
        phraseId: Number(savedPhraseId),
        phraseContent: savedPhraseContent,
      })
    } else {
      try {
        const response = await getPhrases()
        if (response.success) {
          set({
            phraseId: response.data.id,
            phraseContent: response.data.phraseContent,
          })

          localStorage.setItem('phraseDate', today)
          localStorage.setItem('phraseId', response.data.id.toString())
          localStorage.setItem('phraseContent', response.data.phraseContent)
        } else {
          console.error('문구를 가져오는데 실패했습니다:', response.message)
        }
      } catch (error) {
        console.error('문구를 가져오는 중 오류 발생:', error)
      }
    }

    const lastSavedDate = localStorage.getItem('lastSavedDate')
    if (lastSavedDate === today) {
      set({ isSaved: true, lastSavedDate })
    } else {
      set({ isSaved: false, lastSavedDate: null })
    }
  },

  setSaved: (date) => {
    set({ isSaved: true, lastSavedDate: date })
    localStorage.setItem('lastSavedDate', date)
  },

  resetSaved: () => {
    set({ isSaved: false, lastSavedDate: null })
    localStorage.removeItem('lastSavedDate')
  },
}))
