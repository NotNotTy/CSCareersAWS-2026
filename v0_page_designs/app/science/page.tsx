import { SiteHeader } from "@/components/site-header"
import { ArticleCard, ArticleRow } from "@/components/article-card"
import { Atom, Dna, Telescope, Brain, Leaf, FlaskConical } from "lucide-react"

const scienceArticles = [
  {
    title: "Mars Sample Return Mission Reveals Ancient Microbial Signatures",
    excerpt: "Analysis of Martian soil samples suggests biological activity occurred on the red planet billions of years ago, transforming our understanding of life in the solar system.",
    category: "Space",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80",
    field: "Astronomy",
  },
  {
    title: "CRISPR Gene Therapy Achieves Lasting Results in Clinical Trial",
    excerpt: "Patients with hereditary blood disorders show sustained improvement two years after single-dose treatment, marking a milestone for genetic medicine.",
    category: "Medicine",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
    field: "Genetics",
  },
  {
    title: "Ocean Carbon Capture Experiments Show Promising Results",
    excerpt: "Researchers demonstrate scalable methods for enhancing ocean alkalinity to absorb atmospheric CO2 without disrupting marine ecosystems.",
    category: "Climate",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    field: "Environment",
  },
  {
    title: "Neuroscientists Map Complete Connectome of Mouse Brain",
    excerpt: "Landmark project documents every neural connection in the mouse brain, providing unprecedented insights into memory and cognition.",
    category: "Neuroscience",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    field: "Biology",
  },
  {
    title: "New Superconductor Material Works at Higher Temperatures",
    excerpt: "Discovery of room-temperature superconductivity under moderate pressure could revolutionize energy transmission and computing.",
    category: "Physics",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80",
    field: "Physics",
  },
  {
    title: "Biodiversity Survey Identifies New Species in Deep Ocean Trenches",
    excerpt: "Expedition to hadal zones discovers organisms with unique adaptations to extreme pressure, expanding our knowledge of life's limits.",
    category: "Biology",
    date: "March 25, 2026",
    image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&q=80",
    field: "Marine Biology",
  },
]

const fields = [
  { name: "Physics", icon: Atom, color: "text-blue-600" },
  { name: "Biology", icon: Dna, color: "text-green-600" },
  { name: "Space", icon: Telescope, color: "text-purple-600" },
  { name: "Neuroscience", icon: Brain, color: "text-pink-600" },
  { name: "Environment", icon: Leaf, color: "text-emerald-600" },
  { name: "Chemistry", icon: FlaskConical, color: "text-orange-600" },
]

export default function SciencePage() {
  return (
    <div className="min-h-screen bg-[#f0f4f3]">
      {/* Header bar */}
      <div className="bg-[#1e5245] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Science</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hidden md:block hover:text-emerald-200 transition-colors">Space</a>
              <a href="#" className="hidden md:block hover:text-emerald-200 transition-colors">Health</a>
              <a href="#" className="hidden md:block hover:text-emerald-200 transition-colors">Climate</a>
              <a href="#" className="hidden md:block hover:text-emerald-200 transition-colors">Biology</a>
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <header className="mb-10 pb-8 border-b-2 border-[#1e5245]">
          <h1 className="font-serif text-5xl md:text-6xl text-[#1e5245] mb-4">Science</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discoveries, research, and breakthroughs expanding the frontiers of human knowledge.
          </p>
        </header>

        {/* Field Navigation */}
        <section className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-10">
          {fields.map((field) => (
            <a
              key={field.name}
              href="#"
              className="bg-white p-4 rounded-lg text-center hover:shadow-lg transition-shadow group border border-[#1e5245]/10"
            >
              <field.icon className={`w-8 h-8 mx-auto mb-2 ${field.color}`} />
              <span className="text-sm font-medium text-foreground group-hover:text-[#1e5245] transition-colors">
                {field.name}
              </span>
            </a>
          ))}
        </section>

        {/* Featured Article */}
        <section className="mb-12 bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto overflow-hidden">
              <img
                src={scienceArticles[0].image}
                alt={scienceArticles[0].title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-[#1e5245] text-white text-xs font-medium tracking-wider uppercase rounded mb-4 w-fit">
                {scienceArticles[0].field}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight text-balance mb-4">
                {scienceArticles[0].title}
              </h2>
              <p className="text-muted-foreground text-lg mb-4">{scienceArticles[0].excerpt}</p>
              <span className="text-sm text-muted-foreground">{scienceArticles[0].date}</span>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid lg:grid-cols-3 gap-6 mb-12">
          {scienceArticles.slice(1).map((article, index) => (
            <article
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur text-[#1e5245] text-xs font-medium rounded">
                  {article.field}
                </div>
              </div>
              <div className="p-5">
                <span className="text-xs text-[#1e5245] font-medium uppercase tracking-wider">{article.category}</span>
                <h3 className="font-serif text-xl text-foreground leading-snug mt-2 mb-3 group-hover:text-[#1e5245] transition-colors text-balance">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
                <span className="text-xs text-muted-foreground mt-3 block">{article.date}</span>
              </div>
            </article>
          ))}
        </section>

        {/* Research Highlight */}
        <section className="bg-[#1e5245] rounded-lg p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Atom className="w-12 h-12 mb-4 text-emerald-300" />
              <h2 className="font-serif text-3xl mb-4">Research Papers</h2>
              <p className="text-emerald-100 mb-6">
                Access peer-reviewed studies and preprints from leading scientific journals worldwide.
              </p>
              <button className="px-6 py-3 bg-white text-[#1e5245] font-medium rounded hover:bg-emerald-50 transition-colors">
                Browse Research
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded">
                <span className="text-3xl font-bold">2.4M</span>
                <span className="block text-emerald-200 text-sm">Papers Indexed</span>
              </div>
              <div className="bg-white/10 p-4 rounded">
                <span className="text-3xl font-bold">850+</span>
                <span className="block text-emerald-200 text-sm">Journals</span>
              </div>
              <div className="bg-white/10 p-4 rounded">
                <span className="text-3xl font-bold">45K</span>
                <span className="block text-emerald-200 text-sm">Researchers</span>
              </div>
              <div className="bg-white/10 p-4 rounded">
                <span className="text-3xl font-bold">190</span>
                <span className="block text-emerald-200 text-sm">Countries</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
