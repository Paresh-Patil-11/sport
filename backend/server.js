// backend/server.js
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

import { startBlogScheduler } from "./services/blogScheduler.js"
import authRoutes from "./routes/authRoutes.js"
import blogRoutes from "./routes/blogRoutes.js"
import matchRoutes from "./routes/matchRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
import autoBlogRoutes from "./routes/autoBlogRoutes.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}))

// Database & Routes
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected")
    startBlogScheduler()
  })
  .catch(err => console.error("❌ MongoDB error:", err))

app.use("/api/auth", authRoutes)
app.use("/api/blogs", blogRoutes)
app.use("/api/matches", matchRoutes)
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/auto-blogs", autoBlogRoutes)


app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {  // ✅ Change from server.listen to app.listen
  console.log(`🎉 Server running on port ${PORT}`)
})