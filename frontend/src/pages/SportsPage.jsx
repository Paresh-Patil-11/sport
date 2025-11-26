// frontend/src/pages/SportsPage.jsx
import { Link } from "react-router-dom"

function SportsPage() {
  const sports = [
    {
      id: "cricket",
      name: "Cricket",
      icon: "🏏",
      color: "from-green-500 to-emerald-600",
      description: "Follow live cricket scores, matches, and expert analysis",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop",
      stats: { matches: "150+", tournaments: "25+", teams: "200+" }
    },
    {
      id: "football",
      name: "Football",
      icon: "⚽",
      color: "from-blue-500 to-indigo-600",
      description: "Get updates on football leagues, matches, and player stats",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=400&fit=crop",
      stats: { matches: "300+", leagues: "50+", teams: "500+" }
    },
    {
      id: "tennis",
      name: "Tennis",
      icon: "🎾",
      color: "from-yellow-500 to-orange-600",
      description: "Track tennis tournaments, rankings, and match schedules",
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=400&fit=crop",
      stats: { tournaments: "80+", players: "300+", matches: "1000+" }
    },
    {
      id: "pubg",
      name: "PUBG Esports",
      icon: "🎮",
      color: "from-purple-500 to-pink-600",
      description: "Follow PUBG tournaments, teams, and gaming highlights",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
      stats: { tournaments: "40+", teams: "150+", prize: "$5M+" }
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Explore Sports
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Discover live scores, match updates, and exclusive content for your favorite sports
          </p>
        </div>
      </section>

      {/* Sports Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {sports.map((sport) => (
              <div 
                key={sport.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={sport.image} 
                    alt={sport.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${sport.color} opacity-80`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-8xl mb-4">{sport.icon}</div>
                      <h2 className="text-4xl font-bold">{sport.name}</h2>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-gray-600 text-lg mb-6">
                    {sport.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(sport.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className={`text-2xl font-bold bg-gradient-to-r ${sport.color} bg-clip-text text-transparent`}>
                          {value}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <Link 
                      to={`/blogs?category=${sport.id}`}
                      className={`flex-1 py-3 bg-gradient-to-r ${sport.color} text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-200`}
                    >
                      View Blogs
                    </Link>
                    <Link 
                      to="/live-scores"
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-center hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                    >
                      Live Scores
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Live Matches", icon: "🔴", link: "/live-scores" },
              { name: "Match Results", icon: "🏆", link: "/blogs" },
              { name: "Player Stats", icon: "📊", link: "/blogs" },
              { name: "Tournaments", icon: "🎯", link: "/blogs" },
              { name: "Team Rankings", icon: "📈", link: "/blogs" },
              { name: "News & Updates", icon: "📰", link: "/blogs" },
              { name: "Highlights", icon: "⭐", link: "/blogs" },
              { name: "Analysis", icon: "🔍", link: "/blogs" }
            ].map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl text-center hover:shadow-lg hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <div className="font-semibold text-gray-800">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default SportsPage