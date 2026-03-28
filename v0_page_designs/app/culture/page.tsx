import { SiteHeader } from "@/components/site-header"
import { ArticleCard, ArticleRow } from "@/components/article-card"
import { Film, Music, Book, Palette, Theater, Camera } from "lucide-react"

const cultureArticles = [
  {
    title: "Venice Biennale Opens with Provocative Exploration of Digital Identity",
    excerpt: "This year's international art exhibition challenges visitors to reconsider the boundaries between physical presence and virtual existence.",
    category: "Art",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80",
    type: "Visual Arts",
  },
  {
    title: "Streaming Platforms Reshape Independent Film Distribution",
    excerpt: "Directors embrace direct-to-digital releases as traditional theatrical windows become less relevant for art house cinema.",
    category: "Film",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    type: "Cinema",
  },
  {
    title: "Revival of Analog Photography Inspires New Generation of Artists",
    excerpt: "Young photographers rediscover darkroom techniques, embracing imperfection and tangibility in an age of digital perfection.",
    category: "Photography",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?w=800&q=80",
    type: "Photography",
  },
  {
    title: "Broadway Season Features Record Number of New Works",
    excerpt: "Theater district sees surge in original productions as audiences seek fresh narratives and diverse storytelling perspectives.",
    category: "Theater",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80",
    type: "Performing Arts",
  },
  {
    title: "Literary Fiction Embraces Climate Themes in Award Season",
    excerpt: "Major book prizes recognize novels grappling with environmental anxiety and humanity's relationship with the natural world.",
    category: "Books",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&q=80",
    type: "Literature",
  },
  {
    title: "Global Music Festival Circuit Returns to Full Capacity",
    excerpt: "Live music events report record attendance as audiences embrace in-person cultural experiences after years of disruption.",
    category: "Music",
    date: "March 25, 2026",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    type: "Music",
  },
]

const categories = [
  { name: "Film", icon: Film },
  { name: "Music", icon: Music },
  { name: "Books", icon: Book },
  { name: "Art", icon: Palette },
  { name: "Theater", icon: Theater },
  { name: "Photo", icon: Camera },
]

export default function CulturePage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      {/* Header bar with warm terracotta */}
      <div className="bg-[#c47d5b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Culture</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hidden md:block hover:text-orange-100 transition-colors">Film</a>
              <a href="#" className="hidden md:block hover:text-orange-100 transition-colors">Music</a>
              <a href="#" className="hidden md:block hover:text-orange-100 transition-colors">Art</a>
              <a href="#" className="hidden md:block hover:text-orange-100 transition-colors">Books</a>
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <header className="mb-10 pb-8 border-b-2 border-[#c47d5b]">
          <h1 className="font-serif text-5xl md:text-6xl text-[#8b4513] mb-4 italic">Culture</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Art, film, music, literature, and the creative expressions that define our time.
          </p>
        </header>

        {/* Category Icons */}
        <section className="flex flex-wrap justify-center gap-8 mb-12">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href="#"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 rounded-full bg-[#c47d5b]/10 flex items-center justify-center group-hover:bg-[#c47d5b] transition-colors">
                <cat.icon className="w-7 h-7 text-[#c47d5b] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-[#8b4513] transition-colors">
                {cat.name}
              </span>
            </a>
          ))}
        </section>

        {/* Featured Article - Magazine Style */}
        <section className="mb-12">
          <div className="relative aspect-[21/9] rounded-lg overflow-hidden">
            <img
              src={cultureArticles[0].image}
              alt={cultureArticles[0].title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute left-0 top-0 bottom-0 w-full md:w-1/2 p-8 flex flex-col justify-center">
              <span className="text-[#e8a87c] text-sm font-medium tracking-widest uppercase mb-3">
                {cultureArticles[0].type}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight text-balance mb-4 italic">
                {cultureArticles[0].title}
              </h2>
              <p className="text-gray-300 text-lg max-w-lg hidden md:block">{cultureArticles[0].excerpt}</p>
            </div>
          </div>
        </section>

        {/* Masonry-style Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cultureArticles.slice(1).map((article, index) => (
            <article
              key={index}
              className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group ${
                index === 0 ? 'md:row-span-2' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${index === 0 ? 'aspect-[3/4]' : 'aspect-video'}`}>
                <img
                  src={article.image}
                  alt={article.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-0.5 bg-[#c47d5b]"></span>
                  <span className="text-xs text-[#c47d5b] font-medium uppercase tracking-wider">{article.type}</span>
                </div>
                <h3 className="font-serif text-xl text-foreground leading-snug mb-3 group-hover:text-[#8b4513] transition-colors italic text-balance">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
                <span className="text-xs text-muted-foreground mt-3 block">{article.date}</span>
              </div>
            </article>
          ))}
        </section>

        {/* Critics' Picks */}
        <section className="bg-[#8b4513] rounded-lg p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl italic mb-2">Critics&apos; Picks</h2>
            <p className="text-orange-200">Our editors&apos; recommendations for the week</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { type: "Film", title: "A Quiet Morning in Vienna", meta: "In theaters" },
              { type: "Music", title: "Echoes of Tomorrow", meta: "New album" },
              { type: "Book", title: "The Glass Mountain", meta: "Fiction" },
              { type: "Art", title: "Reflections in Light", meta: "MoMA" },
            ].map((pick, index) => (
              <div key={index} className="text-center">
                <span className="text-xs text-orange-300 uppercase tracking-wider">{pick.type}</span>
                <h3 className="font-serif text-lg mt-2 mb-1 italic">{pick.title}</h3>
                <span className="text-sm text-orange-200">{pick.meta}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
