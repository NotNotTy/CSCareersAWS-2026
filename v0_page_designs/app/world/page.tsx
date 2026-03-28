import { SiteHeader } from "@/components/site-header"
import { ArticleCard, ArticleRow } from "@/components/article-card"
import { Globe, MapPin } from "lucide-react"

const worldArticles = [
  {
    title: "International Climate Summit Reaches Historic Agreement on Carbon Emissions",
    excerpt: "World leaders convene in Geneva to sign unprecedented treaty targeting net-zero emissions by 2045, marking a turning point in global environmental policy.",
    category: "Environment",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1569163139394-de4e5f43e5ca?w=800&q=80",
    region: "Europe",
  },
  {
    title: "Southeast Asian Economic Bloc Announces Major Trade Partnership",
    excerpt: "Ten nations agree to eliminate tariffs on key exports, creating one of the world's largest free trade zones spanning 650 million consumers.",
    category: "Economics",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80",
    region: "Asia",
  },
  {
    title: "Archaeological Discovery in Egypt Reveals Ancient Trade Networks",
    excerpt: "Newly unearthed artifacts suggest extensive commerce between Egyptian and Mesopotamian civilizations earlier than previously believed.",
    category: "Archaeology",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80",
    region: "Middle East",
  },
  {
    title: "European Union Expands Diplomatic Presence in Central Africa",
    excerpt: "New embassies and development partnerships signal shifting geopolitical priorities as EU strengthens ties with emerging economies.",
    category: "Diplomacy",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=800&q=80",
    region: "Africa",
  },
  {
    title: "Pacific Island Nations Form Coalition Against Rising Sea Levels",
    excerpt: "Twelve island states unite to demand urgent climate action and establish emergency relocation protocols for vulnerable communities.",
    category: "Climate",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80",
    region: "Oceania",
  },
  {
    title: "Latin American Summit Addresses Regional Migration Challenges",
    excerpt: "Presidents from eight nations propose coordinated approach to humanitarian corridors and economic development zones.",
    category: "Migration",
    date: "March 25, 2026",
    image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&q=80",
    region: "Americas",
  },
]

const breakingNews = [
  { title: "UN Security Council convenes emergency session on regional tensions", date: "2 hours ago" },
  { title: "Global shipping disruptions ease as key trade routes reopen", date: "4 hours ago" },
  { title: "International Space Station welcomes first commercial research crew", date: "6 hours ago" },
]

const regions = ["Africa", "Americas", "Asia", "Europe", "Middle East", "Oceania"]

export default function WorldPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Custom themed header bar */}
      <div className="bg-[#1a365d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">World News</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              {regions.map((region) => (
                <a key={region} href="#" className="hidden md:block hover:text-blue-200 transition-colors">
                  {region}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <header className="mb-10 pb-8 border-b-2 border-[#1a365d]">
          <h1 className="font-serif text-5xl md:text-6xl text-[#1a365d] mb-4">World</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Comprehensive coverage of international affairs, diplomacy, and global events shaping our interconnected world.
          </p>
        </header>

        {/* Breaking News Ticker */}
        <div className="bg-[#1a365d] text-white p-4 mb-10 rounded">
          <div className="flex items-center gap-4">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex-shrink-0">
              Breaking
            </span>
            <div className="overflow-hidden">
              <p className="text-sm">
                {breakingNews[0].title} — <span className="text-blue-200">{breakingNews[0].date}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Featured Article */}
        <section className="mb-12">
          <ArticleCard
            title={worldArticles[0].title}
            excerpt={worldArticles[0].excerpt}
            category={worldArticles[0].category}
            date={worldArticles[0].date}
            image={worldArticles[0].image}
            featured
          />
        </section>

        {/* Region Tags */}
        <section className="mb-10">
          <div className="flex flex-wrap gap-3">
            {regions.map((region) => (
              <a
                key={region}
                href="#"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a365d]/20 rounded hover:bg-[#1a365d] hover:text-white transition-colors group"
              >
                <MapPin className="w-4 h-4 text-[#1a365d] group-hover:text-white transition-colors" />
                <span className="text-sm font-medium">{region}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            {worldArticles.slice(1, 5).map((article, index) => (
              <div key={index} className="bg-white p-4 rounded shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xs font-medium text-[#1a365d] tracking-wider uppercase mb-2 block">
                  {article.region}
                </span>
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
          <aside className="bg-white p-6 rounded shadow-sm h-fit">
            <h2 className="font-serif text-2xl text-[#1a365d] mb-6 pb-3 border-b-2 border-[#1a365d]">
              Latest Updates
            </h2>
            {breakingNews.map((news, index) => (
              <ArticleRow key={index} title={news.title} date={news.date} />
            ))}
          </aside>
        </section>

        {/* World Map Section */}
        <section className="bg-[#1a365d] rounded p-8 text-center text-white">
          <Globe className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <h2 className="font-serif text-3xl mb-3">Stay Informed, Stay Connected</h2>
          <p className="text-blue-100 max-w-xl mx-auto">
            Our network of correspondents spans 50+ countries, bringing you firsthand reporting from every corner of the globe.
          </p>
        </section>
      </main>
    </div>
  )
}
