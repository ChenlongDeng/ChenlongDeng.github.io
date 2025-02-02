"use client"

import { Briefcase } from '@phosphor-icons/react'
import { InternshipItemType, internshipList } from '@/config/internship'

function InternshipItem({ internshipItem }: { internshipItem: InternshipItemType }) {
  return (
    <li className="flex gap-4">
      <div className="relative mt-1 flex h-12 w-12 flex-none items-center justify-center rounded-full shadow-md border border-muted bg-background">
        <img 
          src={internshipItem.logo} 
          alt={internshipItem.company}
          className="w-10 h-10 object-contain"
        />
      </div>
      <dl className="flex flex-auto flex-col justify-center gap-y-1">
        <div className="flex items-center justify-between">
          <dd className="text-sm font-medium">{internshipItem.company}</dd>
          <dd className="text-xs text-muted-foreground">
            {internshipItem.start} - {internshipItem.end}
          </dd>
        </div>
        <dd className="text-xs text-muted-foreground">
          {internshipItem.title}
        </dd>
        <dd className="text-xs text-muted-foreground">
          {internshipItem.location}
        </dd>
      </dl>
    </li>
  )
}

export default function Internship() {
  return (
    <div className="rounded-2xl border border-muted shadow-sm p-6">
      <h2 className="flex text-sm font-semibold">
        <Briefcase size={24} weight="duotone" />
        <span className="ml-3">Internship</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {internshipList.map((internshipItem, internshipItemIndex) => (
          <InternshipItem key={internshipItemIndex} internshipItem={internshipItem} />
        ))}
      </ol>
    </div>
  )
} 