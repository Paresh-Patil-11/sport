import axios from "axios"

// Free Cricket API - CricAPI (https://www.cricapi.com/)
// Alternative: https://rapidapi.com/api-sports/api/cricket-live-scores

const CRICKET_API_KEY = process.env.CRICKET_API_KEY || "your_api_key_here"
const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY || "your_api_key_here"

// Cricket Live Scores Service
export async function fetchLiveCricketMatches() {
  try {
    // Using CricAPI - Get your free API key from https://www.cricapi.com/
    const response = await axios.get(
      `https://api.cricapi.com/v1/currentMatches`,
      {
        params: {
          apikey: CRICKET_API_KEY,
          offset: 0,
        },
      }
    )

    if (response.data && response.data.data) {
      return response.data.data
        .filter((match) => match.matchType !== "test")
        .slice(0, 10)
        .map((match) => ({
          id: match.id,
          name: match.name,
          matchType: match.matchType,
          status: match.status,
          venue: match.venue,
          date: match.date,
          dateTimeGMT: match.dateTimeGMT,
          teams: match.teams || [],
          teamInfo: match.teamInfo || [],
          score: match.score || [],
          series: match.series,
          matchStarted: match.matchStarted,
          matchEnded: match.matchEnded,
        }))
    }
    return []
  } catch (error) {
    console.error("Error fetching live cricket matches:", error.message)
    return []
  }
}

// Football Live Scores Service (Using API-Football)
export async function fetchLiveFootballMatches() {
  try {
    const response = await axios.get(
      "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      {
        params: { live: "all" },
        headers: {
          "X-RapidAPI-Key": FOOTBALL_API_KEY,
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      }
    )

    if (response.data && response.data.response) {
      return response.data.response.slice(0, 10).map((match) => ({
        id: match.fixture.id,
        league: match.league.name,
        status: match.fixture.status.short,
        venue: match.fixture.venue.name,
        homeTeam: {
          name: match.teams.home.name,
          logo: match.teams.home.logo,
          score: match.goals.home,
        },
        awayTeam: {
          name: match.teams.away.name,
          logo: match.teams.away.logo,
          score: match.goals.away,
        },
        date: match.fixture.date,
      }))
    }
    return []
  } catch (error) {
    console.error("Error fetching live football matches:", error.message)
    return []
  }
}

// Mock Tennis Data (Replace with actual API when available)
export async function fetchLiveTennisMatches() {
  return [
    {
      id: "t1",
      tournament: "Australian Open",
      round: "Quarter Finals",
      player1: {
        name: "Rafael Nadal",
        sets: [6, 4, 6],
        serving: true,
      },
      player2: {
        name: "Novak Djokovic",
        sets: [3, 6, 4],
        serving: false,
      },
      status: "live",
    },
  ]
}

// Aggregate all sports data
export async function fetchAllLiveSports() {
  try {
    const [cricket, football, tennis] = await Promise.allSettled([
      fetchLiveCricketMatches(),
      fetchLiveFootballMatches(),
      fetchLiveTennisMatches(),
    ])

    return {
      cricket: cricket.status === "fulfilled" ? cricket.value : [],
      football: football.status === "fulfilled" ? football.value : [],
      tennis: tennis.status === "fulfilled" ? tennis.value : [],
      lastUpdated: new Date(),
    }
  } catch (error) {
    console.error("Error fetching all live sports:", error.message)
    return {
      cricket: [],
      football: [],
      tennis: [],
      lastUpdated: new Date(),
    }
  }
}

// Get detailed match scorecard for Cricket
export async function getCricketScorecard(matchId) {
  try {
    const response = await axios.get(
      `https://api.cricapi.com/v1/match_info`,
      {
        params: {
          apikey: CRICKET_API_KEY,
          id: matchId,
        },
      }
    )

    return response.data
  } catch (error) {
    console.error("Error fetching cricket scorecard:", error.message)
    return null
  }
}

// Cache mechanism to reduce API calls
const cache = new Map()
const CACHE_DURATION = 30000 // 30 seconds

export async function getCachedLiveSports() {
  const cacheKey = "live_sports"
  const cached = cache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  const data = await fetchAllLiveSports()
  cache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}