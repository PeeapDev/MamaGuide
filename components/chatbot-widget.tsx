"use client"

import { useEffect } from "react"

export default function ChatbotWidget() {
  useEffect(() => {
    // Create script element
    const script = document.createElement("script")
    script.src = "https://ai.peeap.com/Modules/Chatbot/Resources/assets/js/chatbot-widget.min.js"
    script.setAttribute("data-iframe-src", "https://ai.peeap.com/chatbot/embed/chatbot_code=7a0ed08736a748f/welcome")
    script.setAttribute("data-iframe-height", "532")
    script.setAttribute("data-iframe-width", "400")
    script.async = true

    // Append to document body
    document.body.appendChild(script)

    // Cleanup function
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
}
