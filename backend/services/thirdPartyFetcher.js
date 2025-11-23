import axios from "axios"
import ThirdPartyBlog from "../models/ThirdPartyBlog.js"

// Fetch from Dev.to API
export async function fetchFromDevTo() {
  try {
    const response = await axios.get("https://dev.to/api/articles", {
      params: {
        tag: "sports",
        per_page: 10,
        state: "published",
      },
    })

    const blogs = response.data
    const savedBlogs = []

    for (const blog of blogs) {
      const slug = blog.slug || `devto-${blog.id}`
      const existingBlog = await ThirdPartyBlog.findOne({ sourceId: blog.id, source: "dev.to" })

      if (!existingBlog) {
        const newBlog = new ThirdPartyBlog({
          title: blog.title,
          slug,
          content: blog.body_markdown || blog.body_html,
          excerpt: blog.description || blog.title.substring(0, 150),
          author: blog.user.name,
          source: "dev.to",
          sourceUrl: blog.url,
          sourceId: blog.id,
          category: "general",
          tags: blog.tag_list || [],
          featured_image: blog.cover_image,
          rawData: blog,
        })

        await newBlog.save()
        savedBlogs.push(newBlog)
      }
    }

    return savedBlogs
  } catch (error) {
    console.error("Error fetching from Dev.to:", error.message)
    return []
  }
}

// Fetch from Medium via RSS (since Medium API is limited)
export async function fetchFromMedium() {
  try {
    const response = await axios.get("https://medium.com/tag/sports/latest?format=json")
    const text = response.data.toString()
    const jsonStr = text.substring(text.indexOf("{"))
    const data = JSON.parse(jsonStr)

    const savedBlogs = []

    if (data.payload?.posts) {
      for (const postId in data.payload.posts) {
        const post = data.payload.posts[postId]
        const slug = post.uniqueSlug || `medium-${postId}`
        const existingBlog = await ThirdPartyBlog.findOne({ sourceId: postId, source: "medium" })

        if (!existingBlog) {
          const newBlog = new ThirdPartyBlog({
            title: post.title,
            slug,
            content: post.content?.bodyModel?.paragraphs?.map((p) => p.text).join("\n") || post.title,
            excerpt: post.previewContent?.bodyModel?.paragraphs?.[0]?.text || post.title.substring(0, 150),
            author: post.creator?.name || "Unknown",
            source: "medium",
            sourceUrl: `https://medium.com/${post.uniqueSlug}`,
            sourceId: postId,
            category: "general",
            tags: post.tags || [],
            featured_image: post.image?.imageId || null,
            rawData: post,
          })

          await newBlog.save()
          savedBlogs.push(newBlog)
        }
      }
    }

    return savedBlogs
  } catch (error) {
    console.error("Error fetching from Medium:", error.message)
    return []
  }
}

// Fetch from Hashnode API
export async function fetchFromHashnode() {
  try {
    const query = `
      query {
        feed(first: 10, tagSlugs: ["sports"]) {
          edges {
            node {
              id
              title
              slug
              brief
              content
              coverImage {
                url
              }
              author {
                name
              }
              tags {
                name
              }
              url
            }
          }
        }
      }
    `

    const response = await axios.post("https://gql.hashnode.com", { query })
    const blogs = response.data.data.feed.edges

    const savedBlogs = []

    for (const { node } of blogs) {
      const existingBlog = await ThirdPartyBlog.findOne({ sourceId: node.id, source: "hashnode" })

      if (!existingBlog) {
        const newBlog = new ThirdPartyBlog({
          title: node.title,
          slug: node.slug,
          content: node.content || node.brief,
          excerpt: node.brief || node.title.substring(0, 150),
          author: node.author.name,
          source: "hashnode",
          sourceUrl: node.url,
          sourceId: node.id,
          category: "general",
          tags: node.tags?.map((t) => t.name) || [],
          featured_image: node.coverImage?.url,
          rawData: node,
        })

        await newBlog.save()
        savedBlogs.push(newBlog)
      }
    }

    return savedBlogs
  } catch (error) {
    console.error("Error fetching from Hashnode:", error.message)
    return []
  }
}

// Generic RSS feed fetcher
export async function fetchFromRSS(feedUrl, source) {
  try {
    const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`)
    const items = response.data.items || []

    const savedBlogs = []

    for (const item of items.slice(0, 10)) {
      const slug = item.link?.split("/").pop() || `${source}-${Date.now()}`
      const existingBlog = await ThirdPartyBlog.findOne({ sourceId: item.link, source: "rss" })

      if (!existingBlog) {
        const newBlog = new ThirdPartyBlog({
          title: item.title,
          slug,
          content: item.description || item.content || item.title,
          excerpt: item.description || item.title.substring(0, 150),
          author: item.author || "Unknown",
          source: "rss",
          sourceUrl: item.link,
          sourceId: item.link,
          category: "general",
          tags: item.categories || [],
          featured_image: item.image,
          rawData: item,
        })

        await newBlog.save()
        savedBlogs.push(newBlog)
      }
    }

    return savedBlogs
  } catch (error) {
    console.error(`Error fetching RSS from ${source}:`, error.message)
    return []
  }
}

// Fetch all third-party sources
export async function fetchAllThirdPartySources() {
  const results = {
    devTo: await fetchFromDevTo(),
    medium: await fetchFromMedium(),
    hashnode: await fetchFromHashnode(),
    rss: await fetchFromRSS("https://www.espn.com/espn/rss", "espn"),
  }

  return results
}
