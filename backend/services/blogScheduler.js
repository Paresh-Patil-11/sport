// backend/services/blogScheduler.js
import cron from "node-cron"
import { generateAllSportsBlogs } from "./autoBlogGenerator.js"

/**
 * Blog Generation Scheduler
 * Generates 8-10 sports blogs per hour automatically
 * Runs every 6-7 minutes to distribute generation throughout the hour
 */

let isGenerating = false // Flag to prevent concurrent generations

/**
 * Execute blog generation with error handling
 */
async function executeGeneration() {
  // Prevent concurrent executions
  if (isGenerating) {
    console.log("⏳ Blog generation already in progress, skipping...")
    return
  }

  try {
    isGenerating = true
    await generateAllSportsBlogs()
  } catch (error) {
    console.error("Scheduler execution error:", error.message)
  } finally {
    isGenerating = false
  }
}

/**
 * Start the automated blog generation scheduler
 * Schedule: Every 7 minutes (approximately 8-9 generations per hour)
 * Cron pattern: *7 * * * * (every 7 minutes)
 */
export function startBlogScheduler() {
  console.log("\n" + "=".repeat(60))
  console.log("⏰ BLOG SCHEDULER INITIALIZED")
  console.log("   Schedule: Every 7 minutes")
  console.log("   Expected: 8-9 blog generations per hour")
  console.log("   Status: ACTIVE")
  console.log("=".repeat(60) + "\n")

  // Run immediately on startup
  console.log("🎯 Running initial blog generation...")
  executeGeneration()

  // Schedule to run every 7 minutes
  const job = cron.schedule("*/7 * * * *", () => {
    const now = new Date()
    console.log(`\n⏰ Scheduled execution triggered at ${now.toLocaleString()}`)
    executeGeneration()
  })

  // Handle process termination
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down blog scheduler...")
    job.stop()
    process.exit(0)
  })

  return job
}

/**
 * Start blog generation with custom interval (for testing)
 * @param {number} minutes - Interval in minutes
 */
export function startCustomScheduler(minutes = 7) {
  console.log(`\n⏰ Custom scheduler started: Every ${minutes} minutes\n`)
  
  executeGeneration() // Run immediately

  const job = cron.schedule(`*/${minutes} * * * *`, () => {
    console.log(`\n⏰ Custom execution triggered at ${new Date().toLocaleString()}`)
    executeGeneration()
  })

  return job
}

/**
 * Manual trigger for blog generation (for admin routes)
 */
export async function triggerManualGeneration() {
  console.log("\n🔧 Manual blog generation triggered")
  return await executeGeneration()
}

export default {
  startBlogScheduler,
  startCustomScheduler,
  triggerManualGeneration
}