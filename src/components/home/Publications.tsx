"use client"

import { Article } from '@phosphor-icons/react'
import { PublicationType, publicationList } from '@/config/publication'
import Link from 'next/link'

function PublicationItem({ publication }: { publication: PublicationType }) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl border border-muted bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <div className="flex gap-6">
        <div className="w-1/3 h-[120px]">
          <img 
            src={publication.image} 
            alt={publication.title}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <h3 className="text-lg font-medium">{publication.title}</h3>
          <p className="text-sm text-muted-foreground">{publication.description}</p>
          <p className="text-sm font-medium text-primary">{publication.conference}</p>
          <div className="flex gap-3 mt-2">
            {publication.links?.map((link, index) => (
              <Link 
                key={index}
                href={link.url}
                className="px-4 py-1.5 rounded-full text-xs bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Publications() {
  return (
    <div id="publications" className="rounded-2xl border border-muted shadow-sm p-6">
      <h2 className="flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight md:text-3xl opacity-80 mb-6">
        <Article size={28} weight="duotone" />
        Publications
      </h2>
      <div className="space-y-6">
        {publicationList.map((publication, index) => (
          <PublicationItem key={index} publication={publication} />
        ))}
      </div>
    </div>
  )
} 