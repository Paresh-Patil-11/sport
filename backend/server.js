// backend/server.js
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import { WebSocketServer } from "ws"
import http from "http"
import { setupWebSocket } from "./websocket-handler.js"
import { startBlogScheduler } from "./services/blogScheduler.js"

// Routes
import authRoutes from "./routes/authRoutes.js"
import blogRoutes from "./routes/blogRoutes.js"
import matchRoutes from "./routes/matchRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
import autoBlogRoutes from "./routes/autoBlogRoutes.js"

dotenv.config() // Must be called before accessing process.env

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
)

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully")
    
    // Start auto blog generation scheduler after DB connection
    console.log("🚀 Starting automated blog generation...")
    startBlogScheduler()
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)
    process.exit(1)
  })

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/blogs", blogRoutes)
app.use("/api/matches", matchRoutes)
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/auto-blogs", autoBlogRoutes) // New auto blog management routes

// WebSocket setup
setupWebSocket(wss)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date(),
    autoBlogGeneration: "active"
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log("\n" + "=".repeat(60))
  console.log(`🎉 SportsHub Server Started`)
  console.log(`   Port: ${PORT}`)
  console.log(`   WebSocket: ws://localhost:${PORT}`)
  console.log(`   Auto Blog Generation: ENABLED`)
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`)
  console.log("=".repeat(60) + "\n")
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server")
  server.close(() => {
    console.log("HTTP server closed")
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed")
      process.exit(0)
    })
  })
})