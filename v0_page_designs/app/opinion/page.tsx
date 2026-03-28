import { SiteHeader } from "@/components/site-header"
import { ArticleRow } from "@/components/article-card"
import { Quote, PenLine, MessageSquare, Users } from "lucide-react"

const opinionArticles = [
  {
    title: "The Promise and Peril of Algorithmic Justice",
    excerpt: "As AI systems increasingly influence legal decisions, we must grapple with fundamental questions about fairness, transparency, and human oversight.",
    author: "Dr. Sarah Chen",
    authorTitle: "Professor of Law & Technology, Stanford",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&q=80",
    authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
  },
  {
    title: "Why Remote Work Will Define the Next Decade of Innovation",
    excerpt: "The geographic decentralization of talent is creating unprecedented opportunities for diverse voices to shape technology's future.",
    author: "Marcus Thompson",
    authorTitle: "Founder, Future of Work Institute",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    title: "The Case for Ambitious Climate Policy Now",
    excerpt: "Economic modeling suggests that aggressive green investment today will generate returns that far exceed the costs of transition.",
    author: "Elena Rodriguez",
    authorTitle: "Environmental Economist",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&q=80",
    authorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
  },
  {
    title: "Rethinking Education for an Uncertain Future",
    excerpt: "Traditional curricula fail to prepare students for careers that don't yet exist. It's time for a fundamental reimagining of learning.",
    author: "James Park",
    authorTitle: "Education Policy Analyst",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  },
  {
    title: "The Hidden Costs of Convenience Culture",
    excerpt: "Our addiction to instant gratification is reshaping cities, supply chains, and labor markets in ways we're only beginning to understand.",
    author: "Aisha Patel",
    authorTitle: "Urban Sociologist",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
]

const columnists = [
  { name: "Dr. Sarah Chen", beat: "Law & Tech", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" },
  { name: "Marcus Thompson", beat: "Work & Society", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name: "Elena Rodriguez", beat: "Climate", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
  { name: "James Park", beat: "Education", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
]

export default function OpinionPage() {
  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* Header bar */}
      <div className="bg-[#2d2d2d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PenLine className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Opinion</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hidden md:block hover:text-gray-300 transition-colors">Editorials</a>
              <a href="#" className="hidden md:block hover:text-gray-300 transition-colors">Op-Eds</a>
              <a href="#" className="hidden md:block hover:text-gray-300 transition-colors">Letters</a>
              <a href="#" className="hidden md:block hover:text-gray-300 transition-colors">Columnists</a>
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <header className="mb-10 pb-8 border-b-4 border-double border-[#2d2d2d]">
          <h1 className="font-serif text-5xl md:text-6xl text-[#2d2d2d] mb-4">Opinion</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Perspectives, analysis, and commentary from leading voices on the issues that matter.
          </p>
        </header>

        {/* Featured Opinion */}
        <section className="mb-12">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                <Quote className="w-10 h-10 text-[#2d2d2d]/20 mb-4" />
                <h2 className="font-serif text-3xl md:text-4xl text-[#2d2d2d] leading-tight text-balance mb-4">
                  {opinionArticles[0].title}
                </h2>
                <p className="text-muted-foreground text-lg mb-6">{opinionArticles[0].excerpt}</p>
                <div className="flex items-center gap-4">
                  <img
                    src={opinionArticles[0].authorImage}
                    alt={opinionArticles[0].author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-medium text-foreground block">{opinionArticles[0].author}</span>
                    <span className="text-sm text-muted-foreground">{opinionArticles[0].authorTitle}</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 relative aspect-square md:aspect-auto overflow-hidden">
                <img
                  src={opinionArticles[0].image}
                  alt=""
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            {opinionArticles.slice(1).map((article, index) => (
              <article key={index} className="mb-8 pb-8 border-b border-border last:border-b-0">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-3">
                    <h3 className="font-serif text-2xl text-foreground leading-snug mb-3 hover:text-[#2d2d2d]/70 transition-colors cursor-pointer text-balance">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-3">
                      <img
                        src={article.authorImage}
                        alt={article.author}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="text-sm">
                        <span className="font-medium text-foreground">{article.author}</span>
                        <span className="text-muted-foreground"> · {article.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-1 hidden md:block">
                    <div className="aspect-square rounded overflow-hidden">
                      <img
                        src={article.image}
                        alt=""
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Columnists */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-border">
                <Users className="w-5 h-5 text-[#2d2d2d]" />
                <h2 className="font-serif text-xl text-[#2d2d2d]">Our Columnists</h2>
              </div>
              <div className="space-y-4">
                {columnists.map((columnist, index) => (
                  <a key={index} href="#" className="flex items-center gap-3 group">
                    <img
                      src={columnist.image}
                      alt={columnist.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground group-hover:text-[#2d2d2d]/70 transition-colors block">
                        {columnist.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{columnist.beat}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Submit Op-Ed */}
            <div className="bg-[#2d2d2d] text-white p-6 rounded-lg">
              <MessageSquare className="w-8 h-8 mb-4 text-gray-400" />
              <h3 className="font-serif text-xl mb-2">Share Your Voice</h3>
              <p className="text-gray-400 text-sm mb-4">
                We welcome thoughtful perspectives from our readers on the issues of the day.
              </p>
              <button className="w-full py-2 border border-white text-white text-sm font-medium rounded hover:bg-white hover:text-[#2d2d2d] transition-colors">
                Submit an Op-Ed
              </button>
            </div>

            {/* Letters */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-[#2d2d2d]">
              <h3 className="font-serif text-xl text-[#2d2d2d] mb-4">Letters to the Editor</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="italic">&quot;The analysis on algorithmic bias was illuminating...&quot;</p>
                <p className="italic">&quot;I respectfully disagree with the climate policy position...&quot;</p>
                <p className="italic">&quot;Thank you for highlighting education reform needs...&quot;</p>
              </div>
              <a href="#" className="text-sm text-[#2d2d2d] font-medium mt-4 block hover:underline">
                Read all letters →
              </a>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
