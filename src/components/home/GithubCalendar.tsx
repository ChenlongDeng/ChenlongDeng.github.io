'use client'

import GitHubCalendar from 'react-github-calendar'
import { githubUsername } from '@/config/infoConfig'
import { GithubLogo } from '@phosphor-icons/react'
import GitHubSnake from './GitHubSnake'

export default function GithubContributions() {
  return (
    <div className="rounded-2xl border border-muted shadow-sm p-6">
      <h2 className="flex text-sm font-semibold mb-6">
        <GithubLogo size={24} weight="duotone" />
        <span className="ml-3">GitHub Contributions</span>
      </h2>
      <div className="space-y-8">
        <div className="w-full overflow-hidden">
          <div className='dark:hidden'>
            <GitHubCalendar
              username={githubUsername}
              colorScheme='light'
              fontSize={12}
              blockSize={12}
              blockMargin={5}
              blockRadius={4}
            />
          </div>
          <div className='hidden dark:block'>
            <GitHubCalendar
              username={githubUsername}
              colorScheme='dark'
              fontSize={12}
              blockSize={12}
              blockMargin={5}
              blockRadius={4}
            />
          </div>
        </div>
      </div>
    </div>
  )
}