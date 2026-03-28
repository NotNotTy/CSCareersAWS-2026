import { SiteHeader } from "@/components/site-header"
import { ArticleCard, ArticleRow } from "@/components/article-card"
import { Landmark, Vote, Scale } from "lucide-react"

const politicsArticles = [
  {
    title: "Senate Passes Landmark Infrastructure Bill After Months of Debate",
    excerpt: "Bipartisan legislation allocates $1.2 trillion for roads, bridges, broadband, and clean energy projects across all 50 states.",
    category: "Congress",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    type: "legislation",
  },
  {
    title: "Supreme Court to Hear Arguments on Digital Privacy Rights",
    excerpt: "Justices will consider whether Fourth Amendment protections extend to cloud-stored data and AI-analyzed communications.",
    category: "Judiciary",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    type: "courts",
  },
  {
    title: "State Governors Coalition Announces Joint Education Initiative",
    excerpt: "Twelve governors from both parties unite to standardize STEM curriculum and expand vocational training programs.",
    category: "State Politics",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
    type: "policy",
  },
  {
    title: "Campaign Finance Reform Bill Advances in House Committee",
    excerpt: "Proposed legislation would require real-time disclosure of political donations and limit corporate PAC contributions.",
    category: "Elections",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80",
    type: "elections",
  },
  {
    title: "Federal Agencies Begin Implementation of AI Governance Framework",
    excerpt: "New executive order establishes oversight protocols for artificial intelligence use in government decision-making.",
    category: "Executive",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    type: "policy",
  },
  {
    title: "Local Elections See Record Turnout Amid Redistricting Debates",
    excerpt: "Municipal races draw unprecedented voter participation as communities grapple with representation changes.",
    category: "Local Politics",
    date: "March 25, 2026",
    image: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=800&q=80",
    type: "elections",
  },
]

const analysisArticles = [
  { title: "The shifting dynamics of suburban voting patterns in 2026", date: "Opinion" },
  { title: "How the filibuster debate could reshape legislative strategy", date: "Analysis" },
  { title: "Understanding the constitutional implications of executive orders", date: "Explainer" },
]

export default function PoliticsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Custom themed header bar */}
      <div className="bg-[#8b0000] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Landmark className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Politics</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hidden md:block hover:text-red-200 transition-colors">Congress</a>
              <a href="#" className="hidden md:block hover:text-red-200 transition-colors">White House</a>
              <a href="#" className="hidden md:block hover:text-red-200 transition-colors">Judiciary</a>
              <a href="#" className="hidden md:block hover:text-red-200 transition-colors">Elections</a>
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <header className="mb-10 pb-8 border-b-4 border-[#8b0000]">
          <h1 className="font-serif text-5xl md:text-6xl text-[#8b0000] mb-4">Politics</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            In-depth coverage of government, policy, elections, and the forces shaping American democracy.
          </p>
        </header>

        {/* Branch Icons */}
        <section className="grid grid-cols-3 gap-4 mb-10">
          <a href="#" className="bg-white border-2 border-[#8b0000]/10 hover:border-[#8b0000] p-6 text-center transition-colors group rounded">
            <Landmark className="w-10 h-10 mx-auto mb-3 text-[#8b0000]" />
            <span className="font-serif text-lg text-foreground group-hover:text-[#8b0000] transition-colors">Legislative</span>
          </a>
          <a href="#" className="bg-white border-2 border-[#8b0000]/10 hover:border-[#8b0000] p-6 text-center transition-colors group rounded">
            <Scale className="w-10 h-10 mx-auto mb-3 text-[#8b0000]" />
            <span className="font-serif text-lg text-foreground group-hover:text-[#8b0000] transition-colors">Judicial</span>
          </a>
          <a href="#" className="bg-white border-2 border-[#8b0000]/10 hover:border-[#8b0000] p-6 text-center transition-colors group rounded">
            <Vote className="w-10 h-10 mx-auto mb-3 text-[#8b0000]" />
            <span className="font-serif text-lg text-foreground group-hover:text-[#8b0000] transition-colors">Elections</span>
          </a>
        </section>

        {/* Featured Article */}
        <section className="mb-12">
          <ArticleCard
            title={politicsArticles[0].title}
            excerpt={politicsArticles[0].excerpt}
            category={politicsArticles[0].category}
            date={politicsArticles[0].date}
            image={politicsArticles[0].image}
            featured
          />
        </section>

        {/* Main Grid */}
        <section className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            {/* Articles with styled dividers */}
            {politicsArticles.slice(1, 5).map((article, index) => (
              <div key={index} className="mb-8 pb-8 border-b border-[#8b0000]/20 last:border-b-0">
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-2">
                    <div className="relative aspect-[4/3] overflow-hidden rounded">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#8b0000] mb-2">
                      {article.category}
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl text-foreground leading-snug mb-3 hover:text-[#8b0000] transition-colors cursor-pointer text-balance">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{article.excerpt}</p>
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-[#8b0000] text-white p-6 rounded mb-6">
              <h2 className="font-serif text-2xl mb-4">Analysis & Opinion</h2>
              <div className="space-y-4">
                {analysisArticles.map((article, index) => (
                  <div key={index} className="pb-4 border-b border-white/20 last:border-b-0 last:pb-0">
                    <span className="text-xs text-red-200 uppercase tracking-wider">{article.date}</span>
                    <p className="text-white hover:text-red-100 transition-colors cursor-pointer text-balance">
                      {article.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded border-l-4 border-[#8b0000]">
              <h3 className="font-serif text-xl text-[#8b0000] mb-4">Daily Briefing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the essential political news delivered to your inbox every morning.
              </p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 border border-border rounded text-sm mb-3"
              />
              <button className="w-full bg-[#8b0000] text-white py-2 rounded text-sm font-medium hover:bg-[#6b0000] transition-colors">
                Subscribe
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
