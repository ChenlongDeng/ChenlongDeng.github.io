"use client"


import { Student } from '@phosphor-icons/react'
import { EducationItemType, educationList } from '@/config/infoConfig'
import { CustomIcon } from '@/components/shared/CustomIcon'




function EducationItem({ educationItem }: { educationItem: EducationItemType }) {
  return (
    <li className="flex gap-4">
      <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md border border-muted bg-background">
        <img 
          src={educationItem.logo} 
          alt={educationItem.school}
          className="w-10 h-10 object-contain"
        />
      </div>
      <dl className="flex flex-auto flex-col justify-center gap-y-1">
        <div className="flex items-center justify-between">
          <dd className="text-sm font-medium">{educationItem.school}</dd>
          <dd className="text-xs text-muted-foreground">
            {educationItem.start} - {educationItem.end}
          </dd>
        </div>
        <dd className="text-xs text-muted-foreground">
          {educationItem.degree} in {educationItem.major}
        </dd>
      </dl>
    </li>
  )
}

export default function Education() {
  return (
    <div className="rounded-2xl border border-muted shadow-sm p-6">
      <h2 className="flex text-sm font-semibold">
        <Student size={24} weight="duotone" />
        <span className="ml-3">Education</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {educationList.map((educationItem, educationItemIndex) => (
          <EducationItem key={educationItemIndex} educationItem={educationItem} />
        ))}
      </ol>
    </div>
  )
}