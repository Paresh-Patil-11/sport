// backend/scripts/testBlogGeneration.js
import mongoose from "mongoose"
import dotenv from "dotenv"
import { generateAllSportsBlogs } from "../services/autoBlogGenerator.js"

dotenv.config()

/**
 * Test script for blog generation
 * Run with: npm run test-blogs
 */

console.log("🧪 Testing Auto Blog Generation...")
console.log("Connecting to database...")

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Database connected")
    console.log("\n" + "=".repeat(60))
    console.log("Starting test generation...")
    console.log("=".repeat(60) + "\n")

    try {
      const result = await generateAllSportsBlogs()
      
      console.log("\n" + "=".repeat(60))
      console.log("✅ TEST COMPLETED SUCCESSFULLY")
      console.log("=".repeat(60))
      console.log(JSON.stringify(result, null, 2))
      
      process.exit(0)
    } catch (error) {
      console.error("\n❌ TEST FAILED:", error)
      process.exit(1)
    }
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err)
    process.exit(1)
  })