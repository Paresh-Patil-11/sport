import mongoose from "mongoose"

const matchSchema = new mongoose.Schema(
  {
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
    },
    team2: {
      name: String,
      logo: String,
      score: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "completed"],
      default: "scheduled",
    },
    startTime: Date,
    endTime: Date,
    venue: String,
    streamUrl: String,
    commentary: [
      {
        user: String,
        text: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    scorecard: {
      inning1: Object,
      inning2: Object,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Match", matchSchema)
