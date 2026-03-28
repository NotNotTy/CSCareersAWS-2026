import { SiteHeader } from "@/components/site-header"
import { ArticleCard, ArticleRow } from "@/components/article-card"
import { TrendingUp, TrendingDown, DollarSign, Building2, BarChart3 } from "lucide-react"

const businessArticles = [
  {
    title: "Federal Reserve Signals Steady Course Amid Economic Growth",
    excerpt: "Central bank officials indicate patience on rate adjustments as inflation continues moderating toward target levels.",
    category: "Economy",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  },
  {
    title: "Tech Giants Report Strong Q1 Earnings Driven by AI Integration",
    excerpt: "Major technology companies exceed analyst expectations as enterprise AI adoption accelerates across industries.",
    category: "Technology",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    title: "Global Supply Chains Adapt to New Trade Corridors",
    excerpt: "Companies restructure logistics networks as geopolitical shifts reshape international commerce patterns.",
    category: "Trade",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80",
  },
  {
    title: "Sustainable Investment Funds Reach Record Asset Levels",
    excerpt: "ESG-focused portfolios attract $2.3 trillion in new capital as institutional investors prioritize climate goals.",
    category: "Investing",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80",
  },
  {
    title: "Startup Funding Rebounds in Healthcare and Biotech Sectors",
    excerpt: "Venture capital firms deploy $45 billion in health innovation as pandemic-era lessons drive investment priorities.",
    category: "Startups",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80",
  },
  {
    title: "Real Estate Markets Show Regional Divergence in 2026",
    excerpt: "Commercial and residential trends vary significantly across metropolitan areas as remote work patterns stabilize.",
    category: "Real Estate",
    date: "March 25, 2026",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
]

const marketData = [
  { name: "S&P 500", value: "5,847.23", change: "+1.2%", up: true },
  { name: "DOW", value: "42,156.89", change: "+0.8%", up: true },
  { name: "NASDAQ", value: "18,923.45", change: "+1.5%", up: true },
  { name: "10Y Treasury", value: "3.92%", change: "-0.05", up: false },
]

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Market Ticker */}
      <div className="bg-[#0d1f2d] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 py-2 overflow-x-auto">
            {marketData.map((item) => (
              <div key={item.name} className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm text-gray-400">{item.name}</span>
                <span className="text-sm font-medium">{item.value}</span>
                <span className={`text-sm flex items-center gap-1 ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category bar */}
      <div className="bg-[#1a3a4a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Business</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hidden md:block hover:text-emerald-300 transition-colors">Markets</a>
              <a href="#" className="hidden md:block hover:text-emerald-300 transition-colors">Economy</a>
              <a href="#" className="hidden md:block hover:text-emerald-300 transition-colors">Companies</a>
              <a href="#" className="hidden md:block hover:text-emerald-300 transition-colors">Tech</a>
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <header className="mb-10 pb-8 border-b-2 border-[#1a3a4a]">
          <h1 className="font-serif text-5xl md:text-6xl text-[#0d1f2d] mb-4">Business</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Markets, economy, and corporate news driving global commerce and financial decisions.
          </p>
        </header>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {marketData.map((item) => (
            <div key={item.name} className="bg-white p-4 rounded border-l-4 border-[#1a3a4a]">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.name}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-[#0d1f2d]">{item.value}</span>
                <span className={`text-sm font-medium flex items-center gap-1 ${item.up ? 'text-emerald-600' : 'text-red-600'}`}>
                  {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Featured Article */}
        <section className="mb-12">
          <ArticleCard
            title={businessArticles[0].title}
            excerpt={businessArticles[0].excerpt}
            category={businessArticles[0].category}
            date={businessArticles[0].date}
            image={businessArticles[0].image}
            featured
          />
        </section>

        {/* Main Grid */}
        <section className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {businessArticles.slice(1, 5).map((article, index) => (
              <div key={index} className="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <ArticleCard
                  title={article.title}
                  excerpt={article.excerpt}
                  category={article.category}
                  date={article.date}
                  image={article.image}
                />
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-[#0d1f2d] text-white p-6 rounded">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h2 className="font-serif text-xl">Market Movers</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span>NVDA</span>
                  <span className="text-emerald-400">+4.2%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span>AAPL</span>
                  <span className="text-emerald-400">+2.1%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span>TSLA</span>
                  <span className="text-red-400">-1.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>MSFT</span>
                  <span className="text-emerald-400">+1.5%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-[#1a3a4a]" />
                <h2 className="font-serif text-xl text-[#0d1f2d]">Industry Focus</h2>
              </div>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-muted-foreground hover:text-[#1a3a4a] transition-colors">
                  Technology & Software
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-[#1a3a4a] transition-colors">
                  Financial Services
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-[#1a3a4a] transition-colors">
                  Healthcare & Biotech
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-[#1a3a4a] transition-colors">
                  Energy & Utilities
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-[#1a3a4a] transition-colors">
                  Real Estate
                </a>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
