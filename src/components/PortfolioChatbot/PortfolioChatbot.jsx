
// src/components/PortfolioChatbot/PortfolioChatbot.jsx

import { useState } from "react"
import "./PortfolioChatbot.css"
import { useConstants } from "/src/hooks/constants.js"

export default function PortfolioChatbot() {
    const constants = useConstants()

    const chatbotSettings = constants.chatbotSettings

    const {
        enabled,
        title,
        subtitle,
        icon,
        provider,
        model,
        apiUrl
    } = chatbotSettings

    const [open, setOpen] = useState(false)
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hi 👋 I'm Fulbabu's Portfolio Assistant. Ask me about my projects, skills, education or experience."
        }
    ])

    if (!enabled) {
        return null
    }

    const sendMessage = async () => {
        const text = input.trim()

        if (!text || loading) {
            return
        }

        const userMessage = {
            role: "user",
            content: text
        }

        const history = [...messages]

        setMessages(prev => [
            ...prev,
            userMessage
        ])

        setInput("")
        setLoading(true)

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: text,
                    history,
                    model
                })
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.error || "AI request failed"
                )
            }

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: data.message
                }
            ])

        } catch (error) {
            console.error(
                "Portfolio chatbot error:",
                error
            )

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "⚠️ Local AI is not connected. Please start Ollama and the backend server."
                }
            ])

        } finally {
            setLoading(false)
        }
    }

    const clearChat = () => {
        setMessages([
            {
                role: "assistant",
                content:
                    "Hi 👋 I'm Fulbabu's Portfolio Assistant. How can I help you?"
            }
        ])
    }

    const handleSubmit = event => {
        event.preventDefault()
        sendMessage()
    }

    return (
        <>
           {!open && (
    <button
        type="button"
        className="portfolio-ai-button"
        onClick={() => setOpen(true)}
        aria-label="Open Portfolio Assistant"
    >
        <div className="portfolio-ai-icon">
            <div className="portfolio-ai-face">
                <span></span>
                <span></span>
            </div>

            <div className="portfolio-ai-tail"></div>
        </div>
    </button>
)}


            {open && (
                <div className="portfolio-ai-chat">

                    {/* Header */}
                    <div className="portfolio-ai-header">

                        <div className="portfolio-ai-title">

                            <div className="portfolio-ai-avatar">
                                <i className={icon}></i>
                            </div>

                            <div>
                                <strong>
                                    {title}
                                </strong>

                                <small>
                                    ● {subtitle}
                                </small>
                            </div>

                        </div>

                        <div className="portfolio-ai-actions">

                            <button
                                type="button"
                                onClick={clearChat}
                                aria-label="Clear chat"
                                title="Clear chat"
                            >
                                <i className="fa-solid fa-rotate"></i>
                            </button>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close chatbot"
                                title="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                        </div>

                    </div>

                    {/* Messages */}
                    <div className="portfolio-ai-messages">

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`portfolio-ai-message ${message.role}`}
                            >

                                <div className="portfolio-ai-message-icon">
                                    {message.role === "assistant"
                                        ? "🤖"
                                        : "👤"}
                                </div>

                                <div className="portfolio-ai-bubble">
                                    {message.content}
                                </div>

                            </div>
                        ))}

                        {loading && (
                            <div className="portfolio-ai-message assistant">

                                <div className="portfolio-ai-message-icon">
                                    🤖
                                </div>

                                <div className="portfolio-ai-bubble typing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>

                            </div>
                        )}

                    </div>

                    {/* Input */}
                    <form
                        className="portfolio-ai-input"
                        onSubmit={handleSubmit}
                    >

                        <input
                            type="text"
                            value={input}
                            onChange={event =>
                                setInput(event.target.value)
                            }
                            placeholder="Ask about my portfolio..."
                            disabled={loading}
                            autoComplete="off"
                        />

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !input.trim()
                            }
                            aria-label="Send message"
                        >
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>

                    </form>

                    {/* Footer */}
                    <div className="portfolio-ai-footer">
                        Powered by {provider} · {model}
                    </div>

                </div>
            )}
        </>
    )
}

