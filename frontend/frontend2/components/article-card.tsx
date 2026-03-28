import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface ArticleCardProps {
  title: string
  excerpt: string
  category: string
  date: string
  image: string
  featured?: boolean
  source?: string
}

export function ArticleCard({
  title,
  excerpt,
  category,
  date,
  image,
  featured = false,
  source,
}: ArticleCardProps) {
  if (featured) {
    return (
      <article className="group cursor-pointer">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary-foreground/80 mb-3">
              {category}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-primary-foreground leading-tight text-balance mb-3">
              {title}
            </h2>
            <p className="text-primary-foreground/80 text-sm md:text-base line-clamp-2 max-w-2xl">
              {excerpt}
            </p>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden mb-4">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
        {category}
      </span>
      <h3 className="font-serif text-lg md:text-xl text-foreground leading-snug mb-2 group-hover:text-accent transition-colors text-balance">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm line-clamp-2">{excerpt}</p>
    </article>
  )
}

export function ArticleRow({
  title,
  date,
  source,
}: {
  title: string
  date: string
  source?: string
}) {
  return (
    <article className="group cursor-pointer py-6 border-b border-border last:border-b-0 flex items-start justify-between gap-8">
      <div className="flex-1">
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2 block">
          {date}
        </span>
        <h3 className="font-serif text-xl md:text-2xl text-foreground leading-snug group-hover:text-accent transition-colors text-balance">
          {title}
        </h3>
        {source && (
          <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground mt-2 block">
            {source}
          </span>
        )}
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
    </article>
  )
}
