import mongoose from "mongoose"

const liveMatchSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      unique: true,
      required: true,
    },
    title: String,
    sport: {
      type: String,
      enum: ["cricket", "football", "pubg", "tennis"],
      required: true,
    },
    team1: {
      name: String,
      logo: String,
      score: { type: Number, default: 0 },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
    },
    team2: {
      name: String,
      logo: String,
      score: { type: Number, default: 0 },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "completed"],
      default: "scheduled",
    },
    currentOvers: Number,
    currentBatter: {
      name: String,
      runs: Number,
      balls: Number,
    },
    currentBowler: {
      name: String,
      runs: Number,
      wickets: Number,
    },
    commentary: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        ball: String,
        commentary: String,
        runs: Number,
      },
    ],
    polls: [
      {
        question: String,
        options: [
          {
            option: String,
            votes: { type: Number, default: 0 },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    startTime: Date,
    endTime: Date,
    venue: String,
    viewers: { type: Number, default: 0 },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.model("LiveMatch", liveMatchSchema)
