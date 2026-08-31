import { GoogleGenAI } from "@google/genai"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000

const GEMINI_MODEL =
    process.env.GEMINI_MODEL || "gemini-3.6-flash"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const portfolioContext = `
You are the AI Portfolio Assistant for Fulbabu Islam.

Only answer questions using the portfolio information below.

Be friendly, concise and professional.

Do not invent information.

If information is not available, say:
"The portfolio does not provide that information."

Portfolio:

Name:
Fulbabu Islam

Education:
B.Tech in Computer Science and Engineering
J.C. Bose University of Science and Technology YMCA, Faridabad
2023 - 2027

Skills and interests:
- Full Stack Web Development
- MERN Stack
- JavaScript
- React
- Node.js
- Express.js
- MongoDB
- Python
- Java
- Data Structures and Algorithms
- Artificial Intelligence
- Data Science
- Machine Learning
- Cloud
- DevOps

Projects:

1. Schedula
Appointment and booking platform developed for
Odoo x VIT Hackathon 2026.

2. Group Chatting Application
Real-time group communication application.

3. AI Chatbot Application
AI-powered chatbot application.

4. Music Backend
Music-focused backend service using Node.js,
Express.js and MongoDB.

5. Course Selling App
Full-stack course selling platform using MERN.

Portfolio:
https://fulbabu.dev/

GitHub:
https://github.com/fulbabu-t

LeetCode:
https://leetcode.com/u/Fulbabu/
`

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Portfolio AI server is running",
        provider: "Google Gemini",
        model: GEMINI_MODEL
    })
})

app.post("/api/chat", async (req, res) => {
    try {
        const {
            message,
            history = []
        } = req.body

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                error: "Message is required"
            })
        }

        const conversation = history
            .slice(-10)
            .map(item => {
                const role =
                    item.role === "assistant"
                        ? "Assistant"
                        : "User"

                return `${role}: ${item.content}`
            })
            .join("\n")

        const prompt = `
${portfolioContext}

Previous conversation:

${conversation}

User:
${message.trim()}

Assistant:
`

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt
        })

        return res.json({
            success: true,
            message: response.text || "No response generated."
        })

    } catch (error) {

        console.error("Gemini error:", error)

        return res.status(500).json({
            success: false,
            error: "Unable to connect to Gemini AI."
        })
    }
})

app.listen(PORT, () => {
    console.log(
        `Portfolio AI server running on http://localhost:${PORT}`
    )

    console.log(
        `Using Gemini model: ${GEMINI_MODEL}`
    )
})