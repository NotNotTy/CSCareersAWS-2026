import { SiteHeader } from "@/components/site-header"
import { ArticleCard, ArticleRow } from "@/components/article-card"
import { Cpu, Smartphone, Cloud, Shield, Sparkles, Code } from "lucide-react"

const techArticles = [
  {
    title: "Next-Generation AI Assistants Transform Workplace Productivity",
    excerpt: "Autonomous AI agents now handle complex multi-step tasks, from research to report generation, fundamentally changing knowledge work.",
    category: "Artificial Intelligence",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    tag: "AI",
  },
  {
    title: "Quantum Computing Achieves New Error-Correction Milestone",
    excerpt: "Researchers demonstrate fault-tolerant quantum operations at scale, bringing practical quantum computing closer to reality.",
    category: "Quantum",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    tag: "Research",
  },
  {
    title: "5G Networks Enable Real-Time Holographic Communication",
    excerpt: "Major carriers roll out enhanced mobile broadband supporting immersive 3D video calls and augmented reality applications.",
    category: "Telecommunications",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    tag: "Mobile",
  },
  {
    title: "Browser Privacy Features Reshape Digital Advertising Landscape",
    excerpt: "New tracking protections force marketers to adopt contextual targeting and first-party data strategies.",
    category: "Privacy",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    tag: "Security",
  },
  {
    title: "Open Source AI Models Challenge Proprietary Systems",
    excerpt: "Community-developed language models achieve competitive performance, democratizing access to advanced AI capabilities.",
    category: "Open Source",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    tag: "AI",
  },
  {
    title: "Smart Cities Deploy Integrated Sensor Networks",
    excerpt: "Urban areas leverage IoT infrastructure for traffic optimization, energy management, and public safety improvements.",
    category: "IoT",
    date: "March 25, 2026",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80",
    tag: "Infrastructure",
  },
]

const techCategories = [
  { name: "AI & ML", icon: Sparkles, color: "bg-purple-500" },
  { name: "Mobile", icon: Smartphone, color: "bg-blue-500" },
  { name: "Cloud", icon: Cloud, color: "bg-cyan-500" },
  { name: "Security", icon: Shield, color: "bg-emerald-500" },
  { name: "Developer", icon: Code, color: "bg-orange-500" },
]

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-purple-900 via-violet-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Technology</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hidden md:block hover:text-purple-200 transition-colors">AI</a>
              <a href="#" className="hidden md:block hover:text-purple-200 transition-colors">Software</a>
              <a href="#" className="hidden md:block hover:text-purple-200 transition-colors">Hardware</a>
              <a href="#" className="hidden md:block hover:text-purple-200 transition-colors">Startups</a>
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <header className="mb-10 pb-8 border-b border-white/10">
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-4">Technology</h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            The latest in AI, software, hardware, and the innovations shaping our digital future.
          </p>
        </header>

        {/* Category Pills */}
        <section className="flex flex-wrap gap-3 mb-10">
          {techCategories.map((cat) => (
            <a
              key={cat.name}
              href="#"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors group"
            >
              <span className={`p-1 rounded ${cat.color}`}>
                <cat.icon className="w-4 h-4 text-white" />
              </span>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{cat.name}</span>
            </a>
          ))}
        </section>

        {/* Featured Article */}
        <section className="mb-12 rounded-xl overflow-hidden">
          <div className="relative aspect-[21/9] overflow-hidden">
            <img
              src={techArticles[0].image}
              alt={techArticles[0].title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-medium tracking-wider uppercase rounded-full mb-4">
                {techArticles[0].tag}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance mb-4">
                {techArticles[0].title}
              </h2>
              <p className="text-gray-300 text-lg max-w-3xl">{techArticles[0].excerpt}</p>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid lg:grid-cols-3 gap-6 mb-12">
          {techArticles.slice(1).map((article, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-colors group"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur text-white text-xs font-medium rounded">
                  {article.tag}
                </span>
              </div>
              <div className="p-5">
                <span className="text-xs text-purple-400 uppercase tracking-wider">{article.category}</span>
                <h3 className="font-serif text-xl text-white leading-snug mt-2 mb-3 group-hover:text-purple-300 transition-colors text-balance">
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">{article.excerpt}</p>
                <span className="text-xs text-gray-500 mt-3 block">{article.date}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Newsletter */}
        <section className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-8 border border-purple-500/20">
          <div className="max-w-2xl mx-auto text-center">
            <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h2 className="font-serif text-3xl text-white mb-3">Tech Briefing</h2>
            <p className="text-gray-400 mb-6">
              A daily digest of the most important tech news, curated by our editors.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-500 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
