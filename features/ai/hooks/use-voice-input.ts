"use client"

import { useEffect, useRef, useState } from "react"

import { toast } from "@/components/ui/toast"

type SpeechResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}

type SpeechRecognizer = {
  lang: string
  interimResults: boolean
  onresult: ((event: SpeechResultEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechWindow = {
  SpeechRecognition?: new () => SpeechRecognizer
  webkitSpeechRecognition?: new () => SpeechRecognizer
}

const createRecognizer = () => {
  const speechWindow = window as unknown as SpeechWindow
  const Recognizer =
    speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
  return Recognizer ? new Recognizer() : null
}

export function useVoiceInput(onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const recognizerRef = useRef<SpeechRecognizer | null>(null)

  useEffect(() => () => recognizerRef.current?.stop(), [])

  const toggle = () => {
    if (isListening) {
      recognizerRef.current?.stop()
      return
    }
    const recognizer = createRecognizer()
    if (!recognizer) {
      toast.error("Voice input isn't supported in this browser")
      return
    }
    recognizer.lang = "en-US"
    recognizer.interimResults = false
    recognizer.onresult = (event) =>
      onTranscript(
        Array.from(event.results, (result) => result[0].transcript).join(" ")
      )
    recognizer.onend = () => setIsListening(false)
    recognizer.onerror = () => setIsListening(false)
    recognizerRef.current = recognizer
    recognizer.start()
    setIsListening(true)
  }

  return { isListening, toggle }
}
