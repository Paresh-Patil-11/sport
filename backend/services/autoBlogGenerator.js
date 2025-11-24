// backend/services/autoBlogGenerator.js
import axios from "axios"
import Blog from "../models/Blog.js"
import User from "../models/User.js"

// API Configuration
const CRICKET_API_KEY = process.env.CRICKET_API_KEY || "dNUopRiZAPZSMiatA1wjInKA5ttVnmqZnETbnAaSACzNAN5g1qSPwTZacSO9"
const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY || "Cv3d7aM8mPQy1eDUEl9MKQ1y2PumvSHGGlNHGzuRrNKdI1mCZnryIck9zSQN"
const PUBG_API_KEY = process.env.PUBG_API_KEY || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0ODBhZDg2MC1hYjY4LTAxM2UtNDlmNC00YWNkZDYwODAyOGUiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNzYzOTkxMjkyLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Ii1kYjkwM2QxZC03OGZlLTRlODEtYjExNi05OTc3MzgyNTg3YTUifQ.K2b5KTyCGsfCncSq9WucAzOFsDpLuqIwnjrzMwiSomc"

/**
 * Get system bot user for auto-generated blogs
 * Creates a bot user if it doesn't exist
 */
async function getBotUser() {
  try {
    let botUser = await User.findOne({ username: "SportsHub_Bot" })
    
    if (!botUser) {
      botUser = new User({
        username: "SportsHub_Bot",
        email: "bot@sportshub.com",
        password: "bot_password_secure_2024",
        role: "editor",
        bio: "Automated sports content generator"
      })
      await botUser.save()
    }
    
    return botUser
  } catch (error) {
    console.error("Error getting bot user:", error.message)
    throw error
  }
}

/**
 * Generate slug from title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100)
}

/**
 * Check if blog already exists for this match
 */
async function blogExistsForMatch(matchId, sport) {
  const existingBlog = await Blog.findOne({
    slug: { $regex: new RegExp(`${sport}-${matchId}`, "i") },
    published: true
  })
  return !!existingBlog
}

// ==================== CRICKET FUNCTIONS ====================

/**
 * Fetch live cricket matches
 */
async function fetchLiveCricketMatches() {
  try {
    const response = await axios.get("https://api.cricapi.com/v1/currentMatches", {
      params: {
        apikey: CRICKET_API_KEY,
        offset: 0
      }
    })

    if (response.data && response.data.data) {
      // Filter only live matches
      return response.data.data.filter(match => 
        match.matchStarted === true && 
        match.matchEnded === false &&
        match.matchType !== "test" // Exclude test matches for faster updates
      ).slice(0, 3) // Limit to 3 matches
    }
    return []
  } catch (error) {
    console.error("Cricket API Error:", error.message)
    return []
  }
}

/**
 * Generate cricket blog content
 */
function generateCricketBlogContent(match) {
  const team1 = match.teams && match.teams[0] ? match.teams[0] : "Team 1"
  const team2 = match.teams && match.teams[1] ? match.teams[1] : "Team 2"
  
  const score = match.score || []
  const score1 = score[0] || { r: 0, w: 0, o: 0 }
  const score2 = score[1] || { r: 0, w: 0, o: 0 }

  const content = `
<h2>Live Match Update: ${match.name}</h2>

<p><strong>Match Status:</strong> ${match.status || "In Progress"}</p>
<p><strong>Venue:</strong> ${match.venue || "Unknown Venue"}</p>
<p><strong>Series:</strong> ${match.series || "Cricket Series"}</p>

<h3>Current Score</h3>
<p><strong>${team1}:</strong> ${score1.r}/${score1.w} (${score1.o} overs)</p>
<p><strong>${team2}:</strong> ${score2.r}/${score2.w} (${score2.o} overs)</p>

<h3>Match Details</h3>
<p>This ${match.matchType || "cricket"} match is currently in progress between ${team1} and ${team2} at ${match.venue || "the venue"}.</p>

<p>The match started at ${match.dateTimeGMT ? new Date(match.dateTimeGMT).toLocaleString() : "earlier today"} and is providing exciting cricket action for fans worldwide.</p>

<p><em>This is a live match update. Scores and details are subject to change as the match progresses.</em></p>

<p><strong>Match ID:</strong> ${match.id}</p>
  `

  return {
    title: `LIVE: ${match.name} - ${match.status}`,
    content: content,
    excerpt: `Live cricket match between ${team1} and ${team2}. ${match.status || "In Progress"}`,
    category: "cricket",
    tags: ["cricket", "live-match", team1, team2, match.matchType || "cricket"],
    matchId: match.id
  }
}

// ==================== FOOTBALL FUNCTIONS ====================

/**
 * Fetch live football matches
 */
async function fetchLiveFootballMatches() {
  try {
    const response = await axios.get("https://api.football-data.org/v4/matches", {
      headers: {
        "X-Auth-Token": FOOTBALL_API_KEY
      },
      params: {
        status: "LIVE"
      }
    })

    if (response.data && response.data.matches) {
      return response.data.matches.slice(0, 3) // Limit to 3 matches
    }
    return []
  } catch (error) {
    console.error("Football API Error:", error.message)
    return []
  }
}

/**
 * Generate football blog content
 */
function generateFootballBlogContent(match) {
  const homeTeam = match.homeTeam?.name || "Home Team"
  const awayTeam = match.awayTeam?.name || "Away Team"
  const homeScore = match.score?.fullTime?.home || 0
  const awayScore = match.score?.fullTime?.away || 0

  const content = `
<h2>Live Football Match: ${homeTeam} vs ${awayTeam}</h2>

<p><strong>Competition:</strong> ${match.competition?.name || "Football League"}</p>
<p><strong>Match Status:</strong> ${match.status || "IN_PLAY"}</p>
<p><strong>Venue:</strong> ${match.venue || "Stadium"}</p>

<h3>Current Score</h3>
<p><strong>${homeTeam}:</strong> ${homeScore}</p>
<p><strong>${awayTeam}:</strong> ${awayScore}</p>

<h3>Match Information</h3>
<p>This exciting ${match.competition?.name || "football"} match is currently live with ${homeTeam} hosting ${awayTeam}.</p>

<p>The match started at ${match.utcDate ? new Date(match.utcDate).toLocaleString() : "kick-off time"} and is providing thrilling football action.</p>

${match.referees && match.referees.length > 0 ? `<p><strong>Referee:</strong> ${match.referees[0].name}</p>` : ""}

<p><em>Live match in progress. Score updates in real-time.</em></p>

<p><strong>Match ID:</strong> ${match.id}</p>
  `

  return {
    title: `LIVE: ${homeTeam} vs ${awayTeam} - ${homeScore}-${awayScore}`,
    content: content,
    excerpt: `Live football match: ${homeTeam} ${homeScore}-${awayScore} ${awayTeam}`,
    category: "football",
    tags: ["football", "live-match", homeTeam, awayTeam, match.competition?.name || "football"],
    matchId: match.id
  }
}

// ==================== PUBG FUNCTIONS ====================

/**
 * Fetch PUBG tournaments/matches
 */
async function fetchPubgMatches() {
  try {
    // PUBG API requires specific tournament IDs
    // This is a sample implementation - adjust based on actual API structure
    const response = await axios.get("https://api.pubg.com/tournaments", {
      headers: {
        "Authorization": `Bearer ${PUBG_API_KEY}`,
        "Accept": "application/vnd.api+json"
      }
    })

    if (response.data && response.data.data) {
      return response.data.data.slice(0, 2) // Limit to 2 tournaments
    }
    return []
  } catch (error) {
    console.error("PUBG API Error:", error.message)
    return []
  }
}

/**
 * Generate PUBG blog content
 */
function generatePubgBlogContent(tournament) {
  const content = `
<h2>PUBG Tournament Update: ${tournament.attributes?.name || "Tournament"}</h2>

<p><strong>Tournament ID:</strong> ${tournament.id}</p>
<p><strong>Created:</strong> ${tournament.attributes?.createdAt ? new Date(tournament.attributes.createdAt).toLocaleDateString() : "Recently"}</p>

<h3>Tournament Details</h3>
<p>Active PUBG tournament featuring competitive gameplay and top players from around the world.</p>

<p>This tournament showcases the best PUBG players competing for victory and prizes. Stay tuned for match results and player statistics.</p>

<p><em>Tournament data updated regularly.</em></p>
  `

  return {
    title: `PUBG Tournament: ${tournament.attributes?.name || "Active Tournament"}`,
    content: content,
    excerpt: `PUBG tournament update featuring competitive gameplay`,
    category: "pubg",
    tags: ["pubg", "tournament", "esports", "gaming"],
    matchId: tournament.id
  }
}

// ==================== MAIN GENERATION FUNCTIONS ====================

/**
 * Generate cricket blogs
 */
async function generateCricketBlogs() {
  try {
    console.log("🏏 Fetching live cricket matches...")
    const matches = await fetchLiveCricketMatches()
    const botUser = await getBotUser()
    let created = 0

    for (const match of matches) {
      try {
        // Check if blog already exists
        const exists = await blogExistsForMatch(match.id, "cricket")
        if (exists) {
          console.log(`📝 Cricket blog already exists for match ${match.id}`)
          continue
        }

        const blogData = generateCricketBlogContent(match)
        const slug = `cricket-${match.id}-${Date.now()}`

        const blog = new Blog({
          ...blogData,
          slug: slug,
          author: botUser._id,
          published: true,
          featured_image: "https://via.placeholder.com/800x400/0a3d91/ffffff?text=Live+Cricket+Match"
        })

        await blog.save()
        created++
        console.log(`✅ Created cricket blog: ${blogData.title}`)
      } catch (error) {
        console.error(`❌ Error creating cricket blog for match ${match.id}:`, error.message)
      }
    }

    return created
  } catch (error) {
    console.error("Cricket blog generation error:", error.message)
    return 0
  }
}

/**
 * Generate football blogs
 */
async function generateFootballBlogs() {
  try {
    console.log("⚽ Fetching live football matches...")
    const matches = await fetchLiveFootballMatches()
    const botUser = await getBotUser()
    let created = 0

    for (const match of matches) {
      try {
        const exists = await blogExistsForMatch(match.id, "football")
        if (exists) {
          console.log(`📝 Football blog already exists for match ${match.id}`)
          continue
        }

        const blogData = generateFootballBlogContent(match)
        const slug = `football-${match.id}-${Date.now()}`

        const blog = new Blog({
          ...blogData,
          slug: slug,
          author: botUser._id,
          published: true,
          featured_image: "https://via.placeholder.com/800x400/0a3d91/ffffff?text=Live+Football+Match"
        })

        await blog.save()
        created++
        console.log(`✅ Created football blog: ${blogData.title}`)
      } catch (error) {
        console.error(`❌ Error creating football blog for match ${match.id}:`, error.message)
      }
    }

    return created
  } catch (error) {
    console.error("Football blog generation error:", error.message)
    return 0
  }
}

/**
 * Generate PUBG blogs
 */
async function generatePubgBlogs() {
  try {
    console.log("🎮 Fetching PUBG tournaments...")
    const tournaments = await fetchPubgMatches()
    const botUser = await getBotUser()
    let created = 0

    for (const tournament of tournaments) {
      try {
        const exists = await blogExistsForMatch(tournament.id, "pubg")
        if (exists) {
          console.log(`📝 PUBG blog already exists for tournament ${tournament.id}`)
          continue
        }

        const blogData = generatePubgBlogContent(tournament)
        const slug = `pubg-${tournament.id}-${Date.now()}`

        const blog = new Blog({
          ...blogData,
          slug: slug,
          author: botUser._id,
          published: true,
          featured_image: "https://via.placeholder.com/800x400/0a3d91/ffffff?text=PUBG+Tournament"
        })

        await blog.save()
        created++
        console.log(`✅ Created PUBG blog: ${blogData.title}`)
      } catch (error) {
        console.error(`❌ Error creating PUBG blog for tournament ${tournament.id}:`, error.message)
      }
    }

    return created
  } catch (error) {
    console.error("PUBG blog generation error:", error.message)
    return 0
  }
}

/**
 * Archive old auto-generated blogs
 * Removes blogs older than 24 hours that are marked as auto-generated
 */
async function archiveOldBlogs() {
  try {
    console.log("🗄️  Archiving old auto-generated blogs...")
    
    const botUser = await User.findOne({ username: "SportsHub_Bot" })
    if (!botUser) return 0

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const result = await Blog.deleteMany({
      author: botUser._id,
      createdAt: { $lt: twentyFourHoursAgo },
      published: true
    })

    console.log(`🗑️  Archived ${result.deletedCount} old blogs`)
    return result.deletedCount
  } catch (error) {
    console.error("Archive error:", error.message)
    return 0
  }
}

/**
 * Main function to generate all blogs
 */
export async function generateAllSportsBlogs() {
  console.log("\n" + "=".repeat(50))
  console.log("🚀 AUTO BLOG GENERATION STARTED")
  console.log("=".repeat(50))

  try {
    // Generate blogs for all sports
    const cricketCount = await generateCricketBlogs()
    const footballCount = await generateFootballBlogs()
    const pubgCount = await generatePubgBlogs()
    
    // Archive old blogs
    const archivedCount = await archiveOldBlogs()

    const total = cricketCount + footballCount + pubgCount

    console.log("\n" + "=".repeat(50))
    console.log("📊 GENERATION SUMMARY:")
    console.log(`   Cricket: ${cricketCount} blogs created`)
    console.log(`   Football: ${footballCount} blogs created`)
    console.log(`   PUBG: ${pubgCount} blogs created`)
    console.log(`   Total: ${total} new blogs`)
    console.log(`   Archived: ${archivedCount} old blogs`)
    console.log("=".repeat(50) + "\n")

    return {
      success: true,
      cricket: cricketCount,
      football: footballCount,
      pubg: pubgCount,
      total: total,
      archived: archivedCount
    }
  } catch (error) {
    console.error("❌ Auto blog generation failed:", error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

// Export individual functions for testing
export {
  fetchLiveCricketMatches,
  fetchLiveFootballMatches,
  fetchPubgMatches,
  generateCricketBlogs,
  generateFootballBlogs,
  generatePubgBlogs,
  archiveOldBlogs
}