import mongoose from "mongoose"

const thirdPartyBlogSchema = new mongoose.Schema(
  {
    title: String,
    slug: {
      type: String,
      unique: true,
    },
    content: String,
    excerpt: String,
    author: String,
    source: {
      type: String,
      enum: ["medium", "dev.to", "hashnode", "rss"],
      required: true,
    },
    sourceUrl: {
      type: String,
      required: true,
    },
    sourceId: String,
    category: {
      type: String,
      enum: ["cricket", "football", "pubg", "tennis", "general"],
      default: "general",
    },
    tags: [String],
    featured_image: String,
    views: {
      type: Number,
      default: 0,
    },
    rawData: mongoose.Schema.Types.Mixed,
    lastFetched: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.model("ThirdPartyBlog", thirdPartyBlogSchema)
