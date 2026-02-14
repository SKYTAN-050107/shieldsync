/**
 * Voice input utility for hands-free incident reporting
 */
export const startVoiceInput = (onResult, onError) => {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    onError('Voice input not supported in this browser')
    return null
  }
  
  const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
  const recognition = new SpeechRecognition()
  
  recognition.continuous = false
  recognition.interimResults = false
  recognition.lang = 'en-US' // Can add 'ms-MY' for Malay
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    onResult(transcript)
  }
  
  recognition.onerror = (event) => {
    onError(event.error)
  }
  
  recognition.start()
  return recognition
}

export const stopVoiceInput = (recognition) => {
  if (recognition) {
    recognition.stop()
  }
}
