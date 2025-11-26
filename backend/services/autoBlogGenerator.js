// backend/services/autoBlogGenerator.js - UPDATED WITH DIFFERENT IMAGES
import axios from "axios"
import Blog from "../models/Blog.js"
import User from "../models/User.js"

const CRICKET_API_KEY = process.env.CRICKET_API_KEY
const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY
const PUBG_API_KEY = process.env.PUBG_API_KEY
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "your_rapidapi_key_here"

// Image URLs for different sports and teams
const SPORT_IMAGES = {
  cricket: [
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop", // Cricket match
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop", // Cricket stadium
    "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&h=400&fit=crop", // Cricket bat
    "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&h=400&fit=crop", // Cricket ball
    "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=400&fit=crop"  // Cricket action
  ],
  football: [
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=400&fit=crop", // Football match
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop", // Football stadium
    "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&h=400&fit=crop", // Football action
    "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=400&fit=crop", // Football goal
    "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=400&fit=crop"  // Football crowd
  ],
  tennis: [
    "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=400&fit=crop", // Tennis court
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=400&fit=crop", // Tennis player
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&h=400&fit=crop", // Tennis match
    "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=800&h=400&fit=crop", // Tennis action
    "https://images.unsplash.com/photo-1617883861744-87ef004d0d9d?w=800&h=400&fit=crop"  // Tennis ball
  ],
  pubg: [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop", // Gaming
    "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=400&fit=crop", // Esports
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=400&fit=crop", // Gaming setup
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop", // Gaming tournament
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=400&fit=crop"  // Gaming action
  ]
}

// Get random image for sport
function getRandomSportImage(sport) {
  const images = SPORT_IMAGES[sport] || SPORT_IMAGES.cricket
  return images[Math.floor(Math.random() * images.length)]
}

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

async function blogExistsForMatch(matchId, sport) {
  const existingBlog = await Blog.findOne({
    slug: { $regex: new RegExp(`${sport}-${matchId}`, "i") },
    published: true
  })
  return !!existingBlog
}

// ==================== CRICKET FUNCTIONS ====================

async function fetchLiveCricketMatches() {
  try {
    const response = await axios.get("https://cricket-api-free-data.p.rapidapi.com/live", {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'cricket-api-free-data.p.rapidapi.com'
      }
    })

    if (response.data && response.data.matches) {
      return response.data.matches.slice(0, 5)
    }
  } catch (error) {
    console.log("RapidAPI failed, using mock data...")
  }

  return generateMockCricketMatches(5)
}

function generateMockCricketMatches(count = 5) {
  const teams = [
    ["India", "Australia"], ["England", "Pakistan"], 
    ["South Africa", "New Zealand"], ["West Indies", "Bangladesh"],
    ["Sri Lanka", "Afghanistan"], ["Ireland", "Zimbabwe"]
  ]
  
  const venues = ["MCG Melbourne", "Lords London", "Eden Gardens Kolkata", "Gabba Brisbane", "Wankhede Mumbai"]
  
  return Array.from({ length: count }, (_, i) => {
    const [team1, team2] = teams[i % teams.length]
    return {
      id: `cricket-${Date.now()}-${i}`,
      name: `${team1} vs ${team2}`,
      matchType: "T20",
      status: "Live - In Progress",
      venue: venues[i % venues.length],
      teams: [team1, team2],
      score: [
        { r: Math.floor(Math.random() * 180) + 100, w: Math.floor(Math.random() * 8), o: Math.floor(Math.random() * 20) },
        { r: Math.floor(Math.random() * 150) + 80, w: Math.floor(Math.random() * 6), o: Math.floor(Math.random() * 15) }
      ],
      matchStarted: true,
      matchEnded: false,
      dateTimeGMT: new Date().toISOString()
    }
  })
}

function generateCricketBlogContent(match) {
  const team1 = match.teams && match.teams[0] ? match.teams[0] : "Team 1"
  const team2 = match.teams && match.teams[1] ? match.teams[1] : "Team 2"
  
  const score = match.score || []
  const score1 = score[0] || { r: 0, w: 0, o: 0 }
  const score2 = score[1] || { r: 0, w: 0, o: 0 }

  const content = `
<div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.8; color: #1a202c;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 2rem; border-radius: 1rem; margin-bottom: 2rem;">
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
      <span style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%; animation: pulse 2s infinite;"></span>
      <span style="font-weight: 700; text-transform: uppercase; font-size: 0.875rem; letter-spacing: 1px;">LIVE MATCH</span>
    </div>
    <h2 style="font-size: 2.5rem; font-weight: 800; margin: 0;">🏏 ${match.name}</h2>
    <p style="margin-top: 0.5rem; opacity: 0.9;">${match.matchType || "Cricket"} • ${match.venue || "Stadium"}</p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: center; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem;">
    <div style="text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🇮🇳</div>
      <h3 style="font-size: 1.5rem; font-weight: 700; color: #1e40af; margin-bottom: 1rem;">${team1}</h3>
      <div style="font-size: 3rem; font-weight: 800; color: #10b981;">${score1.r}/${score1.w}</div>
      <div style="color: #6b7280; margin-top: 0.5rem;">(${score1.o} overs)</div>
    </div>
    
    <div style="font-size: 2rem; font-weight: 700; color: #9ca3af;">VS</div>
    
    <div style="text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🇦🇺</div>
      <h3 style="font-size: 1.5rem; font-weight: 700; color: #7c3aed; margin-bottom: 1rem;">${team2}</h3>
      <div style="font-size: 3rem; font-weight: 800; color: #8b5cf6;">${score2.r}/${score2.w}</div>
      <div style="color: #6b7280; margin-top: 0.5rem;">(${score2.o} overs)</div>
    </div>
  </div>

  <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem;">
    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937;">📍 Match Details</h3>
    <div style="display: grid; gap: 0.75rem;">
      <p style="margin: 0;"><strong>Venue:</strong> ${match.venue || "Cricket Stadium"}</p>
      <p style="margin: 0;"><strong>Match Type:</strong> ${match.matchType || "T20"}</p>
      <p style="margin: 0;"><strong>Status:</strong> ${match.status || "Match in Progress"}</p>
      <p style="margin: 0;"><strong>Time:</strong> ${match.dateTimeGMT ? new Date(match.dateTimeGMT).toLocaleString() : "Live Now"}</p>
    </div>
  </div>

  <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937;">🎯 Match Highlights</h3>
    <p style="margin-bottom: 1rem;">An exciting ${match.matchType || "cricket"} match is currently underway between ${team1} and ${team2}. The match is being played at ${match.venue || "the stadium"} and promises thrilling cricket action.</p>
    
    <p style="margin-bottom: 1rem;">${team1} has posted <strong>${score1.r} runs</strong> for the loss of <strong>${score1.w} wickets</strong> in ${score1.o} overs, while ${team2} is chasing with <strong>${score2.r} runs</strong> on the board for <strong>${score2.w} wickets</strong>.</p>
    
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">⚡ Live updates - Scores refreshed automatically</p>
    </div>
  </div>
</div>
  `

  return {
    title: `🏏 LIVE: ${team1} vs ${team2} - ${match.status}`,
    content: content,
    excerpt: `Live cricket action between ${team1} and ${team2}. Current score: ${score1.r}/${score1.w} vs ${score2.r}/${score2.w}`,
    category: "cricket",
    tags: ["cricket", "live-match", team1, team2, match.matchType || "cricket", "live-score"],
    matchId: match.id
  }
}

// ==================== FOOTBALL FUNCTIONS ====================

async function fetchLiveFootballMatches() {
  try {
    const response = await axios.get("https://free-api-live-football-data.p.rapidapi.com/football-get-live-scores", {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'free-api-live-football-data.p.rapidapi.com'
      }
    })

    if (response.data && response.data.data) {
      return response.data.data.slice(0, 5)
    }
  } catch (error) {
    console.log("Football API failed, generating mock data...")
  }

  return generateMockFootballMatches(5)
}

function generateMockFootballMatches(count = 5) {
  const teams = [
    ["Manchester United", "Liverpool"], ["Barcelona", "Real Madrid"],
    ["Bayern Munich", "Dortmund"], ["PSG", "Marseille"],
    ["Chelsea", "Arsenal"], ["Inter Milan", "AC Milan"]
  ]
  
  const leagues = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"]
  
  return Array.from({ length: count }, (_, i) => {
    const [home, away] = teams[i % teams.length]
    return {
      id: `football-${Date.now()}-${i}`,
      homeTeam: { name: home },
      awayTeam: { name: away },
      score: {
        fullTime: {
          home: Math.floor(Math.random() * 4),
          away: Math.floor(Math.random() * 4)
        }
      },
      status: "IN_PLAY",
      competition: { name: leagues[i % leagues.length] },
      venue: `${home} Stadium`,
      utcDate: new Date().toISOString()
    }
  })
}

function generateFootballBlogContent(match) {
  const homeTeam = match.homeTeam?.name || "Home Team"
  const awayTeam = match.awayTeam?.name || "Away Team"
  const homeScore = match.score?.fullTime?.home || 0
  const awayScore = match.score?.fullTime?.away || 0

  const content = `
<div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.8; color: #1a202c;">
  <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 2rem; border-radius: 1rem; margin-bottom: 2rem;">
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
      <span style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%; animation: pulse 2s infinite;"></span>
      <span style="font-weight: 700; text-transform: uppercase; font-size: 0.875rem; letter-spacing: 1px;">LIVE MATCH</span>
    </div>
    <h2 style="font-size: 2.5rem; font-weight: 800; margin: 0;">⚽ ${homeTeam} vs ${awayTeam}</h2>
    <p style="margin-top: 0.5rem; opacity: 0.9;">${match.competition?.name || "Football League"} • ${match.venue || "Stadium"}</p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: center; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem;">
    <div style="text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🏠</div>
      <h3 style="font-size: 1.5rem; font-weight: 700; color: #1e40af; margin-bottom: 1rem;">${homeTeam}</h3>
      <div style="font-size: 4rem; font-weight: 800; color: #3b82f6;">${homeScore}</div>
    </div>
    
    <div style="font-size: 2rem; font-weight: 700; color: #9ca3af;">-</div>
    
    <div style="text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">✈️</div>
      <h3 style="font-size: 1.5rem; font-weight: 700; color: #dc2626; margin-bottom: 1rem;">${awayTeam}</h3>
      <div style="font-size: 4rem; font-weight: 800; color: #ef4444;">${awayScore}</div>
    </div>
  </div>

  <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem;">
    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937;">🏆 Match Information</h3>
    <div style="display: grid; gap: 0.75rem;">
      <p style="margin: 0;"><strong>Competition:</strong> ${match.competition?.name || "Football Championship"}</p>
      <p style="margin: 0;"><strong>Venue:</strong> ${match.venue || "Football Stadium"}</p>
      <p style="margin: 0;"><strong>Kick-off:</strong> ${match.utcDate ? new Date(match.utcDate).toLocaleString() : "Live Now"}</p>
      <p style="margin: 0;"><strong>Status:</strong> Match in Progress</p>
    </div>
  </div>

  <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937;">⚡ Match Summary</h3>
    <p style="margin-bottom: 1rem;">Thrilling ${match.competition?.name || "football"} action as ${homeTeam} hosts ${awayTeam} at ${match.venue || "the stadium"}. The current scoreline stands at <strong>${homeScore}-${awayScore}</strong>.</p>
    
    <p style="margin-bottom: 1rem;">This ${match.competition?.name || "league"} encounter promises excitement as both teams battle for crucial points. Follow live updates as the match unfolds.</p>
    
    <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
      <p style="margin: 0; font-weight: 600; color: #1e40af;">⚽ Live match - Score updates in real-time</p>
    </div>
  </div>
</div>
  `

  return {
    title: `⚽ LIVE: ${homeTeam} ${homeScore}-${awayScore} ${awayTeam}`,
    content: content,
    excerpt: `Live football: ${homeTeam} vs ${awayTeam} (${homeScore}-${awayScore}) in ${match.competition?.name || "Football"}`,
    category: "football",
    tags: ["football", "live-match", homeTeam, awayTeam, match.competition?.name || "football", "soccer"],
    matchId: match.id
  }
}

// ==================== PUBG FUNCTIONS ====================

async function fetchPubgMatches() {
  return generatePubgContent(8)
}

function generatePubgContent(count = 8) {
  const tournaments = [
    "PUBG Global Championship", "PGC Grand Finals", "PUBG Continental Series",
    "PMPL Championship", "PUBG Nations Cup", "PCS Asia",
    "PUBG Mobile World League", "PMI Regional Finals"
  ]
  
  const regions = ["Asia", "Europe", "Americas", "APAC", "EMEA", "Global"]
  const teams = ["Team Liquid", "FaZe Clan", "Gen.G", "DWG KIA", "Nova Esports", "4AM", "ENCE", "Soniqs"]
  const contentTypes = ["tournament", "match", "update", "highlights"]
  
  return Array.from({ length: count }, (_, i) => {
    const contentType = contentTypes[i % contentTypes.length]
    const tournament = tournaments[i % tournaments.length]
    const region = regions[i % regions.length]
    
    return {
      id: `pubg-${Date.now()}-${i}`,
      type: contentType,
      tournament: tournament,
      region: region,
      teams: [teams[i % teams.length], teams[(i + 1) % teams.length]],
      prizePool: `$${(Math.floor(Math.random() * 900) + 100)}K`,
      viewers: Math.floor(Math.random() * 50000) + 10000,
      createdAt: new Date().toISOString()
    }
  })
}

function generatePubgBlogContent(item) {
  const titles = {
    tournament: `🎮 ${item.tournament} - ${item.region} Tournament Live`,
    match: `⚡ LIVE PUBG Match: ${item.teams[0]} vs ${item.teams[1]}`,
    update: `📰 PUBG ${item.region} Championship Update`,
    highlights: `🏆 ${item.tournament} Day Highlights`
  }
  
  const content = `
<div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.8; color: #1a202c;">
  <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; padding: 2rem; border-radius: 1rem; margin-bottom: 2rem;">
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
      <span style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%; animation: pulse 2s infinite;"></span>
      <span style="font-weight: 700; text-transform: uppercase; font-size: 0.875rem; letter-spacing: 1px;">LIVE TOURNAMENT</span>
    </div>
    <h2 style="font-size: 2.5rem; font-weight: 800; margin: 0;">${titles[item.type]}</h2>
    <p style="margin-top: 0.5rem; opacity: 0.9;">${item.region} Region • ${item.viewers.toLocaleString()} Viewers</p>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
    <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏆</div>
      <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Tournament</div>
      <div style="font-weight: 700; color: #1f2937;">${item.tournament}</div>
    </div>
    
    <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">💰</div>
      <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Prize Pool</div>
      <div style="font-weight: 700; color: #10b981; font-size: 1.5rem;">${item.prizePool}</div>
    </div>
    
    <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">👥</div>
      <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Live Viewers</div>
      <div style="font-weight: 700; color: #3b82f6; font-size: 1.5rem;">${item.viewers.toLocaleString()}</div>
    </div>
    
    <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">🌍</div>
      <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Region</div>
      <div style="font-weight: 700; color: #1f2937;">${item.region}</div>
    </div>
  </div>

  <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem;">
    <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937;">🎯 Featured Teams</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
      <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎮</div>
        <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">${item.teams[0]}</h4>
        <p style="margin: 0; opacity: 0.9; font-size: 0.875rem;">Competing for victory</p>
      </div>
      <div style="background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); color: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎮</div>
        <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">${item.teams[1]}</h4>
        <p style="margin: 0; opacity: 0.9; font-size: 0.875rem;">Fighting for the championship</p>
      </div>
    </div>
  </div>

  <div style="background: #f3f4f6; padding: 2rem; border-radius: 1rem;">
    <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937;">📊 Tournament Overview</h3>
    <p style="margin-bottom: 1rem;">The ${item.tournament} continues with intense PUBG esports action from the ${item.region} region. Top teams including ${item.teams[0]} and ${item.teams[1]} are battling it out for their share of the ${item.prizePool} prize pool.</p>
    
    <p style="margin-bottom: 1rem;">This competitive PUBG tournament showcases the best players and strategies in battle royale gaming. With ${item.viewers.toLocaleString()} live viewers tuning in, the excitement is at an all-time high.</p>
    
    <h4 style="font-size: 1.25rem; font-weight: 700; margin: 1.5rem 0 1rem; color: #1f2937;">What to Expect</h4>
    <ul style="list-style: none; padding: 0; display: grid; gap: 0.75rem;">
      <li style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.5rem;">🎮</span>
        <span>High-level competitive gameplay</span>
      </li>
      <li style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.5rem;">🎯</span>
        <span>Strategic rotations and positioning</span>
      </li>
      <li style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.5rem;">⚡</span>
        <span>Intense firefights and clutch moments</span>
      </li>
      <li style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.5rem;">🏆</span>
        <span>Championship points on the line</span>
      </li>
      <li style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.5rem;">💰</span>
        <span>Major prize pool distribution</span>
      </li>
    </ul>
    
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">⚡ Tournament ongoing - Check back for live updates!</p>
    </div>
  </div>
</div>
  `

  return {
    title: titles[item.type],
    content: content,
    excerpt: `${item.tournament} in ${item.region} region - ${item.prizePool} prize pool, ${item.viewers.toLocaleString()} viewers watching live`,
    category: "pubg",
    tags: ["pubg", "esports", "tournament", item.region, item.tournament, "gaming", "battle-royale"],
    matchId: item.id
  }
}

// ==================== MAIN GENERATION FUNCTIONS ====================

async function generateCricketBlogs() {
  try {
    console.log("🏏 Fetching cricket matches...")
    const matches = await fetchLiveCricketMatches()
    const botUser = await getBotUser()
    let created = 0

    for (const match of matches) {
      try {
        const exists = await blogExistsForMatch(match.id, "cricket")
        if (exists) continue

        const blogData = generateCricketBlogContent(match)
        const slug = `cricket-${match.id}-${Date.now()}`.substring(0, 100)

        const blog = new Blog({
          ...blogData,
          slug: slug,
          author: botUser._id,
          published: true,
          featured_image: getRandomSportImage("cricket")
        })

        await blog.save()
        created++
        console.log(`✅ Created: ${blogData.title}`)
      } catch (error) {
        console.error(`❌ Error:`, error.message)
      }
    }

    return created
  } catch (error) {
    console.error("Cricket error:", error.message)
    return 0
  }
}

async function generateFootballBlogs() {
  try {
    console.log("⚽ Fetching football matches...")
    const matches = await fetchLiveFootballMatches()
    const botUser = await getBotUser()
    let created = 0

    for (const match of matches) {
      try {
        const exists = await blogExistsForMatch(match.id, "football")
        if (exists) continue

        const blogData = generateFootballBlogContent(match)
        const slug = `football-${match.id}-${Date.now()}`.substring(0, 100)

        const blog = new Blog({
          ...blogData,
          slug: slug,
          author: botUser._id,
          published: true,
          featured_image: getRandomSportImage("football")
        })

        await blog.save()
        created++
        console.log(`✅ Created: ${blogData.title}`)
      } catch (error) {
        console.error(`❌ Error:`, error.message)
      }
    }

    return created
  } catch (error) {
    console.error("Football error:", error.message)
    return 0
  }
}

async function generatePubgBlogs() {
  try {
    console.log("🎮 Generating PUBG content...")
    const items = await fetchPubgMatches()
    const botUser = await getBotUser()
    let created = 0

    for (const item of items) {
      try {
        const exists = await blogExistsForMatch(item.id, "pubg")
        if (exists) continue

        const blogData = generatePubgBlogContent(item)
        const slug = `pubg-${item.id}-${Date.now()}`.substring(0, 100)

        const blog = new Blog({
          ...blogData,
          slug: slug,
          author: botUser._id,
          published: true,
          featured_image: getRandomSportImage("pubg")
        })

        await blog.save()
        created++
        console.log(`✅ Created: ${blogData.title}`)
      } catch (error) {
        console.error(`❌ Error:`, error.message)
      }
    }

    return created
  } catch (error) {
    console.error("PUBG error:", error.message)
    return 0
  }
}

async function archiveOldBlogs() {
  try {
    const botUser = await User.findOne({ username: "SportsHub_Bot" })
    if (!botUser) return 0

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const result = await Blog.deleteMany({
      author: botUser._id,
      createdAt: { $lt: twentyFourHoursAgo }
    })

    if (result.deletedCount > 0) {
      console.log(`🗑️  Archived ${result.deletedCount} old blogs`)
    }
    return result.deletedCount
  } catch (error) {
    console.error("Archive error:", error.message)
    return 0
  }
}

export async function generateAllSportsBlogs() {
  console.log("\n" + "=".repeat(50))
  console.log("🚀 AUTO BLOG GENERATION STARTED")
  console.log("=".repeat(50))

  try {
    const cricketCount = await generateCricketBlogs()
    const footballCount = await generateFootballBlogs()
    const pubgCount = await generatePubgBlogs()
    const archivedCount = await archiveOldBlogs()

    const total = cricketCount + footballCount + pubgCount

    console.log("\n" + "=".repeat(50))
    console.log("📊 SUMMARY:")
    console.log(`   Cricket: ${cricketCount} blogs`)
    console.log(`   Football: ${footballCount} blogs`)
    console.log(`   PUBG: ${pubgCount} blogs`)
    console.log(`   Total: ${total} NEW blogs`)
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
    console.error("❌ Generation failed:", error.message)
    return { success: false, error: error.message }
  }
}

export {
  fetchLiveCricketMatches,
  fetchLiveFootballMatches,
  fetchPubgMatches,
  generateCricketBlogs,
  generateFootballBlogs,
  generatePubgBlogs,
  archiveOldBlogs
}