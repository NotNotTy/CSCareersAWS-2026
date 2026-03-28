import { SiteHeader } from "@/components/site-header"
import { ArticleCard, ArticleRow } from "@/components/article-card"

const featuredArticle = {
  title: "The Future of Sustainable Cities: How Urban Planning is Reshaping Our World",
  excerpt:
    "From vertical forests to zero-emission neighborhoods, cities around the globe are reimagining what urban living could look like in the decades ahead.",
  category: "Environment",
  date: "March 28, 2026",
  image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop",
}

const topStories = [
  {
    title: "Global Tech Leaders Announce Historic AI Safety Agreement",
    excerpt:
      "Major technology companies pledge to implement new guardrails and transparency measures in artificial intelligence development.",
    category: "Technology",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
  },
  {
    title: "Economic Summit Yields Breakthrough on Climate Finance",
    excerpt:
      "World leaders commit to unprecedented funding for developing nations to transition to renewable energy.",
    category: "Business",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=600&fit=crop",
  },
  {
    title: "Archaeological Discovery Rewrites Ancient Mediterranean History",
    excerpt:
      "Underwater excavation reveals trading routes that predate previously known civilizations by centuries.",
    category: "Science",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1461360370896-922624d12a74?w=800&h=600&fit=crop",
  },
]

const latestNews = [
  {
    title: "Senate Passes Landmark Infrastructure Bill After Marathon Session",
    date: "Mar 28 2026",
    source: "Politics",
  },
  {
    title: "Central Banks Signal Coordinated Approach to Digital Currencies",
    date: "Mar 28 2026",
    source: "Finance",
  },
  {
    title: "Breakthrough in Quantum Computing Promises New Era of Drug Discovery",
    date: "Mar 27 2026",
    source: "Science",
  },
  {
    title: "Historic Peace Agreement Signed After Decades of Regional Conflict",
    date: "Mar 27 2026",
    source: "World",
  },
  {
    title: "Major Film Studio Announces Revolutionary Virtual Production Technology",
    date: "Mar 26 2026",
    source: "Entertainment",
  },
]

const worldNews = [
  {
    title: "European Union Unveils Ambitious Carbon Neutrality Roadmap",
    excerpt:
      "New legislation sets binding targets for member states with comprehensive support mechanisms.",
    category: "World",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&h=600&fit=crop",
  },
  {
    title: "Asian Markets Rally on Trade Agreement Optimism",
    excerpt:
      "Regional indices reach record highs as new economic partnerships take shape.",
    category: "Business",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
  },
  {
    title: "Renewable Energy Investments Surge to Record Levels",
    excerpt:
      "Global clean energy spending outpaces fossil fuels for the first time in history.",
    category: "Environment",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
  },
  {
    title: "Space Agency Confirms Water Discovery on Mars Surface",
    excerpt:
      "Mission data reveals liquid water deposits that could support future human settlement.",
    category: "Science",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop",
  },
]

const opinionPieces = [
  {
    title: "Why We Need a New Approach to Global Health Security",
    excerpt:
      "The pandemic exposed critical vulnerabilities in our international response systems.",
    category: "Opinion",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
  },
  {
    title: "The Case for Rethinking Urban Transportation",
    excerpt:
      "Car-centric cities are no longer sustainable—here is what needs to change.",
    category: "Opinion",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Featured Article */}
        <section className="mb-12">
          <ArticleCard {...featuredArticle} featured />
        </section>

        {/* Top Stories Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl text-foreground">Top Stories</h2>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topStories.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        </section>

        {/* Two Column Layout: Latest News + In The Press */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Latest News */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-foreground">In The Press</h2>
            </div>
            <div className="border-t border-border">
              {latestNews.map((article, index) => (
                <ArticleRow key={index} {...article} />
              ))}
            </div>
          </div>

          {/* Opinion Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-foreground">Opinion</h2>
            </div>
            <div className="space-y-6">
              {opinionPieces.map((article, index) => (
                <ArticleCard key={index} {...article} />
              ))}
            </div>
          </div>
        </section>

        {/* World News Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl text-foreground">Around the World</h2>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              More world news
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {worldNews.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-primary text-primary-foreground py-12 px-8 lg:px-16 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl mb-4">Stay Informed</h2>
            <p className="text-primary-foreground/80 mb-8">
              Get the most important stories delivered to your inbox every morning.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary-foreground text-primary font-medium hover:bg-primary-foreground/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-medium text-foreground mb-4">News</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">World</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Politics</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Business</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Technology</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-4">Opinion</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Editorials</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Columnists</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Letters</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Sunday Review</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-4">Culture</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Arts</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Books</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Movies</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Music</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-4">More</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Podcasts</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Newsletters</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Video</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Photography</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
            <div className="font-serif text-xl text-foreground">The Daily Chronicle</div>
            <p className="text-sm text-muted-foreground">
              © 2026 The Daily Chronicle. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
