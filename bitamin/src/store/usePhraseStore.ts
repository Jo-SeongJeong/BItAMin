import create from 'zustand'

interface PhraseState {
  phraseContent: string
  phraseId: string | null
  setPhrase: (content: string, id: string) => void
}

const usePhraseStore = create<PhraseState>((set) => ({
  phraseContent: '',
  phraseId: null,
  setPhrase: (content: string, id: string) =>
    set({ phraseContent: content, phraseId: id }),
}))

export default usePhraseStore
