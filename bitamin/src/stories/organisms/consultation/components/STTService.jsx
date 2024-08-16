class STTService {
  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition()
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = 'en-US' // 언어 설정
    } else {
      console.warn('Web Speech API is not supported by this browser.')
    }
    this.isListening = false
  }

  start(onResult) {
    if (this.recognition) {
      this.recognition.start()
      this.isListening = true

      this.recognition.onresult = (event) => {
        let interimTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            onResult(transcript)
          } else {
            interimTranscript += transcript
          }
        }
        console.log('Interim STT text:', interimTranscript)
      }

      this.recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error)
      }

      this.recognition.onend = () => {
        this.isListening = false
      }
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }
}

export default STTService
